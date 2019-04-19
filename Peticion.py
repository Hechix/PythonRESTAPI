import almacenamiento


class Peticion:
    def __init__(self, cliente_conexion, cliente_direccion, CONFIGURACION, logging):
        self.cliente_conexion = cliente_conexion
        self.cliente_direccion = cliente_direccion[0]
        self.datos_recibidos = b''
        self.logging = logging
        self.CONFIGURACION = CONFIGURACION
        self.URI = '/'
        self.logging.debug('Inicializada Peticion para ' +
                           self.cliente_direccion)
        self.URIs_especiales = {
            '_indices': 'self.indexar_json()'
        }

    def procesar(self):
        self.datos_recibidos = self.cliente_conexion.recv(8192)
        trozos_peticion = self.datos_recibidos.decode('utf-8').split(' ')
        tipo_peticion = trozos_peticion[0]
        self.URI = trozos_peticion[1]
        self.logging.info(self.cliente_direccion + "\t<- " +
                          trozos_peticion[0] + " " + self.URI)

        try:
            if tipo_peticion == 'GET':
                if not self.CONFIGURACION['ACEPTAR_GET']:
                    self.logging.info(self.cliente_direccion +
                                      '\t-> ' + 'No aceptamos GET')
                    self.devolver_estado(403, 'METODO_NO_ADMITIDO')
                else:
                    self.GET()

            elif tipo_peticion == 'POST':
                if not self.CONFIGURACION['ACEPTAR_POST']:
                    self.logging.info(self.cliente_direccion +
                                      '\t-> ' + 'No aceptamos POST')
                    self.devolver_estado(403, 'METODO_NO_ADMITIDO')
                else:
                    self.POST()

            elif tipo_peticion == 'PUT':
                if not self.CONFIGURACION['ACEPTAR_PUT']:
                    self.logging.info(self.cliente_direccion +
                                      '\t-> ' + 'No aceptamos PUT')
                    self.devolver_estado(403, 'METODO_NO_ADMITIDO')
                else:
                    self.PUT()

            elif tipo_peticion == 'DELETE':
                if not self.CONFIGURACION['ACEPTAR_DELETE']:
                    self.logging.info(self.cliente_direccion +
                                      '\t-> ' + 'No aceptamos DELETE')
                    self.devolver_estado(403, 'METODO_NO_ADMITIDO')
                else:
                    self.DELETE()

            else:
                self.devolver_estado(403, 'METODO_NO_ADMITIDO')
        except Exception as e:
            self.devolver_estado()

    def devolver_estado(self, codigo_estado=500, contenido=False, nombre_archivo=None):
        codigos_estado = {
            200: 'OK',
            400: 'PETICION_INCORRECTA',
            403: 'ACCESO_DENEGADO',
            404: 'NO_EXISTEN_DATOS',
            500: 'ERROR_INTERNO_DEL_SERVIDOR'
        }

        if not isinstance(codigo_estado, int) or codigo_estado < 1:
            codigo_estado = 500

        if codigo_estado in codigos_estado.keys() and not contenido:
            contenido = codigos_estado[codigo_estado]

        if isinstance(contenido, str):

            html = 'HTTP/1.0 '+str(codigo_estado) + '\r\r\n\r\n' + contenido

            try:
                html = html.encode('cp1252')
            except:
                try:
                    html = html.encode('utf-8')
                    self.logging.info(
                        'Aviso: Codificada la respuesta con UTF-8')
                except:
                    pass  # TODO ver que hago en este caso

        else:
            html = contenido

        if nombre_archivo:
            self.logging.info(self.cliente_direccion + '\t-> ' +
                              str(codigo_estado) + ' '+nombre_archivo)

        else:
            self.logging.info(self.cliente_direccion + '\t-> ' + str(codigo_estado) +
                              ' ' + (contenido[1:500] + " ..." if len(contenido) > 500 else contenido))

        self.cliente_conexion.sendall(html)
        self.cliente_conexion.close()
        self.logging.debug(self.cliente_direccion +
                           '\t-> Finalizada la conexion')

    def trocear_URI(self, parametros=False):
        separacion_URI_de_parametros = self.URI.split('?')

        try:
            parametros_URI = []
            parametros_especiales = []
            for parametro in separacion_URI_de_parametros[1].split("&"):
                if parametro.startswith("_"):
                    parametros_especiales.append(parametro)
                else:
                    parametros_URI.append(parametro)
        except:
            parametros_URI = parametros_especiales = []

        trozos_URI = separacion_URI_de_parametros[0].split('/')

        # El 1º indice es '', puede que existan otros si se introduce en la URL AAAA//BBBB en vez de AAAA/BBBB (repeticiones de / sin nada en medio) o similares
        trozos_URI = [
            elemento_en_URI for elemento_en_URI in trozos_URI if elemento_en_URI != '']

        # Tambien se eliminan los posibles parametros en blanco
        parametros_URI = [
            parametro_en_URI for parametro_en_URI in parametros_URI if parametro_en_URI != '']

        parametros_especiales = [
            parametro_especial for parametro_especial in parametros_especiales if parametro_especial != '']

        if parametros:
            return trozos_URI, parametros_URI, parametros_especiales
        return trozos_URI

    def captura_error(self, error, cod_error=400, msg_error=False):
        errores_personalizados = [
            'ALMACENAMIENTO_JSON_OBJETO_SIN_ATRIBUTO_PRIMARIO',
            'ALMACENAMIENTO_JSON_MALFORMADO',
            'OBJETO_SIN_ATRIBUTO_PRIMARIO',
            'NO_EXISTE_EL_DESTINO',
            'ATRIBUTO_PRIMARIO_YA_EXISTENTE'
        ]

        if error in errores_personalizados:
            self.devolver_estado(404, error)
        else:
            self.devolver_estado(cod_error, msg_error)

    def indexar_json(self):
        try:
            datos_almacenados = almacenamiento.indexar_json(
                self.CONFIGURACION)
            self.devolver_estado(200, datos_almacenados)
        except Exception:
            self.devolver_estado(
                500, 'ALMACENAMIENTO_JSON_INEXISTENTE_O_CORRUPTO')

    def GET(self):
        acciones_parametros_especiales = {
            '_limite': ' datos_almacenados[0:int(valor_parametro_especial)]',
            '_desde': ' datos_almacenados[int(valor_parametro_especial):]'
        }

        trozos_URI, parametros, parametros_especiales = self.trocear_URI(
            parametros=True)

        if len(trozos_URI) == 0:

            if self.CONFIGURACION['PAGINA_BIENVENIDA_SERVIR']:

                try:

                    with open(self.CONFIGURACION['PAGINA_BIENVENIDA_DIRECTORIO']+'/'+self.CONFIGURACION['PAGINA_BIENVENIDA_ARCHIVO'], 'r') as pagina_bienvenida:
                        self.devolver_estado(200, pagina_bienvenida.read(
                        ), nombre_archivo=self.CONFIGURACION['PAGINA_BIENVENIDA_ARCHIVO'])

                except Exception as e:
                    self.indexar_json()

            else:
                self.indexar_json()

        elif trozos_URI[0] in self.URIs_especiales.keys():
            eval(self.URIs_especiales[trozos_URI[0]])

        elif trozos_URI[0] == self.CONFIGURACION['PAGINA_BIENVENIDA_DIRECTORIO']:

            directorio = ""
            for x in range(1, len(trozos_URI)):
                directorio += "/" + trozos_URI[x]

            try:
                archivos_binarios = [
                    'jpg',
                    'png',
                    'gif',
                    'mp4',
                    'webm'
                ]

                metodo_lectura = 'r'

                if trozos_URI[-1].split(".")[-1] in archivos_binarios:
                    metodo_lectura = 'rb'

                with open(self.CONFIGURACION['PAGINA_BIENVENIDA_DIRECTORIO'] + directorio, metodo_lectura) as archivo_leido:
                    self.devolver_estado(
                        200, archivo_leido.read(), nombre_archivo=trozos_URI[-1])

            except Exception as e:
                if type(e).__name__ == 'UnicodeDecodeError':
                    self.devolver_estado(500, 'NO_SE_PUEDE_DECODIFICAR')

                elif type(e).__name__ == 'FileNotFoundError':
                    self.devolver_estado(404)

                else:
                    self.devolver_estado(500)
        else:
            try:
                datos_almacenados = almacenamiento.leer_json(
                    self.CONFIGURACION, trozos_URI)

                # Si existen parametros, por cada parametro y por cada dato recuperado se comprueba, solo funciona con objetos
                if len(parametros) > 0:
                    if not isinstance(datos_almacenados, list):
                        self.devolver_estado(400)
                        return True

                    for parametro in parametros:
                        indice = 0

                        while indice < len(datos_almacenados):

                            if not isinstance(datos_almacenados[indice], dict):
                                self.devolver_estado(400)
                                return True

                            if not str(datos_almacenados[indice][parametro.split("=")[0]]) == str(parametro.split("=")[1]):
                                datos_almacenados.remove(
                                    datos_almacenados[indice])

                            else:
                                indice += 1

                # Si existen parametros especiales, se recorren y ejecutan
                if len(parametros_especiales) > 0:
                    if not isinstance(datos_almacenados, list):
                        self.devolver_estado(400)
                        return True

                    for parametro in parametros_especiales:
                        parametro_especial = parametro.split("=")[0]
                        valor_parametro_especial = parametro.split("=")[1]

                        if parametro_especial in acciones_parametros_especiales.keys():
                            datos_almacenados = eval(
                                acciones_parametros_especiales[parametro_especial])

                self.devolver_estado(200, str(datos_almacenados))

            except Exception as e:
                print("ROTO")
                self.captura_error(str(e), cod_error=404)

    def POST(self):
        trozos_URI = self.trocear_URI()
        objeto_recibido = self.datos_recibidos.split(b"\r\n\r\n")[
            1].decode('utf-8')

        if len(trozos_URI) > 1:
            self.devolver_estado(400)
            return

        try:

            if len(trozos_URI) == 0:
                self.devolver_estado(
                    400, 'NO_EXISTE_EL_DESTINO')
                return

            if len(trozos_URI) > 1:
                self.devolver_estado(
                    400, 'DESTINO_INCORRECTO')
                return

            almacenamiento.guardar_objeto(
                self.CONFIGURACION, objeto_recibido, trozos_URI)

            self.devolver_estado(200, objeto_recibido)

        except Exception as e:
            self.captura_error(str(e), msg_error='OBJETO_JSON_MALFORMADO')

    def PUT(self):
        trozos_URI = self.trocear_URI()
        objeto_recibido = self.datos_recibidos.split(b"\r\n\r\n")[
            1].decode('utf-8')

        try:
            if len(trozos_URI) == 0:
                self.devolver_estado(
                    400, 'NO_EXISTE_EL_DESTINO')
                return

            if len(trozos_URI) > 2:
                self.devolver_estado(
                    400, 'DESTINO_INCORRECTO')
                return

            objeto_creado = almacenamiento.modificar_objeto(
                self.CONFIGURACION, objeto_recibido, trozos_URI)

            self.devolver_estado(200, objeto_creado)

        except Exception as e:
            self.captura_error(str(e), msg_error='OBJETO_JSON_MALFORMADO')

    def DELETE(self):

        trozos_URI = self.trocear_URI()

        if not len(trozos_URI) == 2:
            self.devolver_estado(400)
            return

        json = almacenamiento.cargar_json(self.CONFIGURACION)
        encontrado, objeto_encontrado, indice_objeto_almacenado = almacenamiento.buscar_objeto(
            self.CONFIGURACION, trozos_URI, json)

        indice_objeto_almacenado = None

        if encontrado:
            almacenamiento.borrar_objeto(
                self.CONFIGURACION, trozos_URI, json, objeto_encontrado)
            self.devolver_estado(200)

        else:
            self.devolver_estado(404)
