import almacenamiento
class Peticion:
    def __init__(self, cliente_conexion, cliente_direccion, CONFIGURACION, logging):
        self.cliente_conexion = cliente_conexion
        self.cliente_direccion = cliente_direccion[0] + \
            ' : ' + str(cliente_direccion[1])
        self.datos_recibidos = b''
        self.logging = logging
        self.CONFIGURACION = CONFIGURACION

        self.logging.debug('Inicializada Peticion para ' +
                           self.cliente_direccion)

    def procesar(self):
        self.datos_recibidos = self.cliente_conexion.recv(8192)
        tipo_peticion = self.datos_recibidos.decode('utf-8').split(' ')[0]

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
                          str(codigo_estado) + ' ' + codigos_estado[codigo_estado])
        self.cliente_conexion.sendall(html)
        self.cliente_conexion.close()
        self.logging.debug(self.cliente_direccion +
                           '\t -> Finalizada la conexion')

    def GET(self):
        self.devolver_estado(200, 'Hechix\'s Python REST API')
        #raise Exception('GET no implementado')

    def POST(self):
        raise Exception('POST no implementado')

    def PUT(self):
        raise Exception('PUT no implementado')

    def DELETE(self):
        raise Exception('DELETE no implementado')
