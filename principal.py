from socket import socket, AF_INET, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
from threading import Thread
import logging


def peticion(cliente_conexion, cliente_direccion):
    global SERVIDOR_ENCENDIDO
    # TODO EN #3
    print(cliente_direccion)
    http = cliente_conexion.recv(1024)
    print(http)
    cliente_conexion.sendall(http)
    cliente_conexion.close()


def main():
    global CONFIGURACION
    cargar_configuracion()
    logging.debug('INICIANDO SERVER')
    servidor_escucha = socket(AF_INET, SOCK_STREAM)
    servidor_escucha.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    servidor_escucha.bind(CONFIGURACION['SERVIDOR_ENLACE'])
    servidor_escucha.listen(10)
    logging.info("Bienvenido a\n\
 _   _           _     _      _               \n\
| | | |         | |   (_)    ( )              \n\
| |_| | ___  ___| |__  ___  _|/ ___           \n\
|  _  |/ _ \/ __| '_ \| \ \/ / / __|          \n\
| | | |  __/ (__| | | | |>  <  \__ \          \n\
\_| |_/\___|\___|_| |_|_/_/\_\ |___/          \n\
                                              \n\
______      _   _                             \n\
| ___ \    | | | |                            \n\
| |_/ /   _| |_| |__   ___  _ __              \n\
|  __/ | | | __| '_ \ / _ \| '_ \             \n\
| |  | |_| | |_| | | | (_) | | | |            \n\
\_|   \__, |\__|_| |_|\___/|_| |_|            \n\
       __/ |                                  \n\
      |___/                                   \n\
______ _____ _____ _____    ___  ______ _____ \n\
| ___ \  ___/  ___|_   _|  / _ \ | ___ \_   _|\n\
| |_/ / |__ \ `--.  | |   / /_\ \| |_/ / | |  \n\
|    /|  __| `--. \ | |   |  _  ||  __/  | |  \n\
| |\ \| |___/\__/ / | |   | | | || |    _| |_ \n\
\_| \_\____/\____/  \_/   \_| |_/\_|    \___/ \n\
                                              \n\
                                              ")
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
                            if valor == 'True' or valor == 'False':
                                CONFIGURACION[parametro] = eval(valor)

                            else:
                                CONFIGURACION[parametro] = valor
                                
                        else:
                            logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',
                                                level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')
                            logging.warn(
                                'PARAMETRO NO RECONOCIDO  -> '+parametro+' = '+valor)

        except Exception as e:
            logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',
                                level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')
            logging.error('PARAMETRO INVALIDO:\t' + parametro +
                          ' = ' + valor + '\n\nDetalle:\t' + str(e)+"\n\nSi el problema persiste, por favor informa:\n\thttps://github.com/Hechix/PythonRESTAPI/issues")
            exit()

    if CONFIGURACION['REGISTRO_IGNORAR']:
        print('Bienvenido a Hechix\'s Python REST API\nEl registo está deshabilitado, puedes activarlo en configuracion.conf')

    else:
        if CONFIGURACION['REGISTRO_DEBUG']:
            if CONFIGURACION['REGISTRO_ALMACENAR']:
                print('Bienvenido a Hechix\'s Python REST API\nEl registo está siendo almacenado y no aparecerá en consola, puedes cambiarlo en configuracion.conf')
                logging.basicConfig(filename='Registro.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s',
                                    level=logging.DEBUG, datefmt='%d-%m-%y %H:%M:%S')

            else:
                logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',
                                    level=logging.DEBUG, datefmt='%d-%m-%y %H:%M:%S')

            logging.debug('Configuracion:\n')

            for parametro in CONFIGURACION.keys():
                logging.debug(parametro + (' ' * (25 - len(parametro))
                                           ) + str(CONFIGURACION[parametro]))

            logging.debug(('-' * 30)+'\n')

        else:
            if CONFIGURACION['REGISTRO_ALMACENAR']:
                print('Bienvenido a Hechix\'s Python REST API\nEl registo está siendo almacenado y no aparecerá en consola, puedes cambiarlo en configuracion.conf')
                logging.basicConfig(filename='Registro.log', filemode='a', format='%(asctime)s - %(message)s',
                                    level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')

            else:
                logging.basicConfig(format='%(asctime)s - %(message)s',
                                    level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')


if __name__ == '__main__':
    CONFIGURACION = {
        'SERVIDOR_ENCENDIDO': True,
        'SERVIDOR_ENLACE': ('', -1),
        'REGISTRO_IGNORAR': False,
        'REGISTRO_DEBUG': True,
        'REGISTRO_ALMACENAR': False,
        'TIPO_SERVER': 'JSON',
        'ACEPTAR_GET': True,
        'ACEPTAR_POST':  True,
        'ACEPTAR_PUT': True,
        'ACEPTAR_DELETE': True
    }
    main()
