import almacenamiento


class Peticion:
    def __init__(self, cliente_conexion, cliente_direccion, CONFIGURACION, logging):
        self.cliente_conexion = cliente_conexion
        self.cliente_direccion = cliente_direccion[0] + \
            ' : ' + str(cliente_direccion[1])
        self.datos_recibidos = b''
        self.logging = logging
        self.CONFIGURACION = CONFIGURACION
        self.URI = '/'
        self.logging.debug('Inicializada Peticion para ' +
                           self.cliente_direccion)

    def procesar(self):
        self.datos_recibidos = self.cliente_conexion.recv(8192)
        trozos_peticion = self.datos_recibidos.decode('utf-8').split(' ')
        tipo_peticion = trozos_peticion[0]
        self.URI = trozos_peticion[1]

        if tipo_peticion == 'GET':
            if not self.CONFIGURACION['ACEPTAR_GET']:
                self.logging.info(self.cliente_direccion +
                                  '\t -> ' + 'No aceptamos GET')
                self.devolver_estado(403)
            else:
                self.GET()

        elif tipo_peticion == 'POST':
            if not self.CONFIGURACION['ACEPTAR_POST']:
                self.logging.info(self.cliente_direccion +
                                  '\t -> ' + 'No aceptamos POST')
                self.devolver_estado(403)
            else:
                self.POST()

        elif tipo_peticion == 'PUT':
            if not self.CONFIGURACION['ACEPTAR_PUT']:
                self.logging.info(self.cliente_direccion +
                                  '\t -> ' + 'No aceptamos PUT')
                self.devolver_estado(403)
            else:
                self.PUT()

        elif tipo_peticion == 'DELETE':
            if not self.CONFIGURACION['ACEPTAR_DELETE']:
                self.logging.info(self.cliente_direccion +
                                  '\t -> ' + 'No aceptamos DELETE')
                self.devolver_estado(403)
            else:
                self.DELETE()

        else:
            raise Exception('Ultima salida no implementada')
            # TODO Gestionar que ocurre cuando hay una peticion no soportada

        #self.devolver_estado(200, self.datos_recibidos)

    def devolver_estado(self, codigo_estado=500, contenido=False):
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

        html = 'HTTP/1.0 '+str(codigo_estado)+' ' + \
            codigos_estado[codigo_estado]+'\r\r\n\r\n' + contenido

        try:
            html = html.encode('cp1252')
        except:
            try:
                html = html.encode('utf-8')
                self.logging.info('Aviso: Codificada la respuesta con UTF-8')
            except:
                pass

        self.logging.info(self.cliente_direccion + '\t -> ' +
                          str(codigo_estado) + ' ' + contenido)
        self.cliente_conexion.sendall(html)
        self.cliente_conexion.close()
        self.logging.debug(self.cliente_direccion +
                           '\t -> Finalizada la conexion')

    def GET(self):
        #TODO #22 MOVER ESTO A ANTES DE LLAMAR LA FUNCION
        self.logging.info(self.cliente_direccion + ' GET ' + self.URI)
        if self.URI == '/':
            try:
                datos_almacenados = almacenamiento.indexar_json(
                    self.CONFIGURACION)
                self.devolver_estado(200, datos_almacenados)
            except Exception:
                self.devolver_estado(
                    500, 'ALMACENAMIENTO_JSON_INEXISTENTE_O_CORRUPTO')
        else:
            separacion_indice_de_parametros = self.URI.split('?')
            trozos_URI = separacion_indice_de_parametros[0].split('/')
            # El 1º indice es '', puede que existan otros si se introduce en la URL AAAA//BBBB en vez de AAAA/BBBB (repeticiones de / sin nada en medio) o similares
            trozos_URI = [
                elemento_en_URI for elemento_en_URI in trozos_URI if elemento_en_URI != '']
            try:
                datos_almacenados = almacenamiento.leer_json(
                    self.CONFIGURACION, trozos_URI)
                # Si existen parametros, por cada parametro y por cada dato recuperado se comprueba, solo funciona con objetos
                if len(separacion_indice_de_parametros) > 1:
                    if not isinstance(datos_almacenados, list):
                        self.devolver_estado(400)
                        return True
                    parametros = separacion_indice_de_parametros[1].split("&")
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
                self.devolver_estado(200, str(datos_almacenados))
            except Exception as e:
                if str(e) in ['ALMACENAMIENTO_JSON_OBJETO_SIN_ATRIBUTO_PRIMARIO', 'ALMACENAMIENTO_JSON_MALFORMADO']:
                    self.devolver_estado(404, str(e))
                else:
                    self.devolver_estado(404)

    def POST(self):
        # TODO #22 LANZAR ERROR EN POST CON ARGUMENTOS
        trozos_URI = self.URI.split('?')[0].split('/')
        objeto_recibido = str(self.datos_recibidos.split(b"\r\n\r\n")[1])[2:-1]

        try:
            # El 1º indice es '', puede que existan otros si se introduce en la URL AAAA//BBBB en vez de AAAA/BBBB (repeticiones de / sin nada en medio) o similares
            trozos_URI = [
                elemento_en_URI for elemento_en_URI in trozos_URI if elemento_en_URI != '']

            if len(trozos_URI) == 0:
                self.devolver_estado(
                    400, 'NO_EXISTE_EL_DESTINO')

            objeto_creado = almacenamiento.guardar_objeto(
                self.CONFIGURACION, objeto_recibido, trozos_URI)

            self.devolver_estado(200, objeto_creado)

        except Exception as e:
            errores_personalizados = [
                'OBJETO_SIN_ATRIBUTO_PRIMARIO',
                'NO_EXISTE_EL_DESTINO',
                'ATRIBUTO_PRIMARIO_YA_EXISTENTE'
            ]

            if str(e) in errores_personalizados:
                self.devolver_estado(400, str(e))

            else:
                self.devolver_estado(400, 'OBJETO_JSON_MALFORMADO')

    def PUT(self):

         # TODO #22 LANZAR ERROR EN POST CON ARGUMENTOS
        trozos_URI = self.URI.split('?')
        objeto_recibido = str(self.datos_recibidos.split(b"\r\n\r\n")[1])[2:-1]
        
        if len(trozos_URI) > 1:
            self.devolver_estado(400)
            return

        trozos_URI = trozos_URI[0].split("/") 

        objeto_recibido = str(self.datos_recibidos.split(b"\r\n\r\n")[1])[2:-1]

        try:
            # El 1º indice es '', puede que existan otros si se introduce en la URL AAAA//BBBB en vez de AAAA/BBBB (repeticiones de / sin nada en medio) o similares
            trozos_URI = [
                elemento_en_URI for elemento_en_URI in trozos_URI if elemento_en_URI != '']

            if len(trozos_URI) == 0:
                self.devolver_estado(
                    400, 'NO_EXISTE_EL_DESTINO')

            objeto_creado = almacenamiento.modificar_objeto(self.CONFIGURACION, objeto_recibido, trozos_URI)

            self.devolver_estado(200, objeto_creado)

        except Exception as e:
            errores_personalizados = [
                'OBJETO_SIN_ATRIBUTO_PRIMARIO',
                'NO_EXISTE_EL_DESTINO'
            ]

            if str(e) in errores_personalizados:
                self.devolver_estado(400, str(e))

            else:
                self.devolver_estado(400, 'OBJETO_JSON_MALFORMADO')
                print(str(e))
                
    def DELETE(self):

        #TODO #22 MOVER ESTO A ANTES DE LLAMAR LA FUNCION
        self.logging.info(self.cliente_direccion + ' DELETE ' + self.URI)
        trozos_URI = self.URI.split('?')

        if len(trozos_URI) > 1:
            self.devolver_estado(400)
            return

        trozos_URI = trozos_URI[0].split("/") 
        # El 1º indice es '', puede que existan otros si se introduce en la URL AAAA//BBBB en vez de AAAA/BBBB (repeticiones de / sin nada en medio) o similares
        trozos_URI = [ elemento_en_URI for elemento_en_URI in trozos_URI if elemento_en_URI != '']

        if not len(trozos_URI) == 2: 
            self.devolver_estado(400)
            return

        json = almacenamiento.cargar_json(self.CONFIGURACION)
        encontrado, objeto_encontrado,indice_objeto_almacenado = almacenamiento.buscar_objeto(self.CONFIGURACION, trozos_URI, json)

        indice_objeto_almacenado = None
        
        if encontrado :
            almacenamiento.borrar_objeto(self.CONFIGURACION,trozos_URI,json, objeto_encontrado)
            self.devolver_estado(200)

        else:
            self.devolver_estado(404)
            

