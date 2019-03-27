from socket import socket, AF_INET, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
from threading import Thread
import logging


def peticion(cliente_conexion, cliente_direccion):
    global SERVIDOR_ENCENDIDO
    # TODO EN #3
    print(cliente_direccion)
    http = cliente_conexion.recv(1024)
    # print(http)
    cliente_conexion.sendall(http)
    cliente_conexion.close()


def main():
    global CONFIGURACION
    logging.basicConfig(format='%(asctime)s - %(message)s',
                        level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')
    cargar_configuracion()
    logging.debug('INICIANDO SERVER')
    servidor_escucha = socket(AF_INET, SOCK_STREAM)
    servidor_escucha.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    servidor_escucha.bind(CONFIGURACION['SERVIDOR_ENLACE'])
    servidor_escucha.listen(10)
    
    while CONFIGURACION['SERVIDOR_ENCENDIDO']:
        try:
            cliente_conexion, cliente_direccion = servidor_escucha.accept()
            peti = Thread(target=peticion, args=(
                cliente_conexion, cliente_direccion,))
            peti.start()

        except Exception as e:
            logging.error("/!\\ ERROR - " + str(e))


def cargar_configuracion():
    global CONFIGURACION
    with open("configuracion.conf", "r") as archivo_configuracion:
        try:
            for linea in archivo_configuracion.readlines():

                # Eliminar los comentarios
                linea = linea.split("#")[0].strip()

                if len(linea) > 0:
                    parametro, valor = linea.split("=")
                    parametro = parametro.strip()
                    valor = valor.strip()

                    if parametro == 'SERVIDOR_DIRECCION':
                        CONFIGURACION['SERVIDOR_ENLACE'] = (
                            str(valor), CONFIGURACION['SERVIDOR_ENLACE'][1])

                    elif parametro == 'SERVIDOR_PUERTO':
                        CONFIGURACION['SERVIDOR_ENLACE'] = (
                            CONFIGURACION['SERVIDOR_ENLACE'][0], int(valor))

                    else:
                        if parametro in CONFIGURACION.keys():
                            CONFIGURACION[parametro] = valor
                        else:
                            logging.error(
                                'AVISO: PARAMETRO NO RECONOCIDO\t'+parametro+' = '+valor)

        except Exception as e:
            logging.error('PARAMETRO INVALIDO:\t' + parametro +
                          ' = ' + valor + '\n\nDetalle:\t' + str(e)+"\n\nSi el problema persiste, por favor informa:\n\thttps://github.com/Hechix/PythonRESTAPI/issues")
            exit()

    if CONFIGURACION['LOG_DEBUG']:
        logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',
                            level=logging.DEBUG, datefmt='%d-%m-%y %H:%M:%S')
        logging.debug('Configuracion:\n')

        for parametro in CONFIGURACION.keys():
            logging.debug(parametro + (' ' * (25 - len(parametro))
                                       ) + str(CONFIGURACION[parametro]))

        logging.debug(('-' * 30)+'\n')


if __name__ == '__main__':
    CONFIGURACION = {
        'SERVIDOR_ENCENDIDO': True,
        'SERVIDOR_ENLACE': ('', -1),
        'LOG_DEBUG': True,
        'LOG_ALMACENAR': False,
        'TIPO_SERVER': 'JSON',
        'ACEPTAR_GET': True,
        'ACEPTAR_POST':  True,
        'ACEPTAR_PUT': True,
        'ACEPTAR_DELETE': True
    }
    main()
