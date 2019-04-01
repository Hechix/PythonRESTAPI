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
        print(self.datos_recibidos)
        tipo_peticion = self.datos_recibidos.decode('utf-8').split(' ')[0]
        print(tipo_peticion)

        if tipo_peticion == 'GET':
            if not self.CONFIGURACION['ACEPTAR_GET']:
                self.logging.info('No aceptamos GET')
                self.devolver_estado(403)

        self.cliente_conexion.sendall(self.datos_recibidos)
        self.cliente_conexion.close()

    def devolver_estado(codigo_estado=500, contenido=False):
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

        print(codigo_estado, contenido)
