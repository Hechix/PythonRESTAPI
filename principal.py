from socket import socket, AF_INET, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
from threading import Thread
import logging
from Peticion import Peticion
from webbrowser import open_new_tab as abrir_en_navegador
from sys import argv


def main():
    global CONFIGURACION
    cargar_configuracion()

    if "-h" in argv or "--help" in argv:
        print("Ayuda de CLI\n")
        print("Sintaxis: hechixs_python_rest_api.exe [comando]=[valor]\n")
        print("\t- Los parametros deben estar separados por espacios")
        print("\t- Los parametros se pueden configurar en el achivo configuracion.conf")
        print("\t- CLI prevalece sobre configuracion.conf")
        print("\t- Si un parametro no se configura o se elimina de configuracion.conf, se usará el valor por defecto\n")
        print("Configuración actual:\n")
        for parametro in CONFIGURACION.keys():
            print("\t"+parametro+" = "+str(CONFIGURACION[parametro]))
        print("\nDocumentación: https://github.com/Hechix/PythonRESTAPI/")
        return

    servidor_escucha = socket(AF_INET, SOCK_STREAM)
    servidor_escucha.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    servidor_escucha.bind(CONFIGURACION['SERVIDOR_ENLACE'])
    servidor_escucha.listen(10)
    if CONFIGURACION['PAGINA_ESTATICA_ABRIR_AUTOMATICAMENTE_AL_INICIO']:
        abrir_en_navegador('http://localhost:' +
                           str(CONFIGURACION['SERVIDOR_ENLACE'][1]))

    logging.info("Bienvenido a...\n\
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
\_| \_\____/\____/  \_/   \_| |_/\_|    \___/ \n\n\n")

    while CONFIGURACION['SERVIDOR_ENCENDIDO']:
        try:
            cliente_conexion, cliente_direccion = servidor_escucha.accept()
            peticion = Peticion(
                cliente_conexion, cliente_direccion, CONFIGURACION, logging)
            hilo = Thread(target=peticion.procesar)
            hilo.start()
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
                    parametro = procesar_param_configuracion(linea)

        except Exception as e:
            logging.basicConfig(format='%(asctime)s - %(message)s',
                                level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')
            logging.error('PARAMETRO INVALIDO: ' + parametro + '\n\nDetalle: ' + str(e) +
                          "\n\nSi el problema persiste, por favor informa:\n\thttps://github.com/Hechix/PythonRESTAPI/issues")
            quit()

        for parametro in argv[1:]:
            try:
                if not parametro == "-h" and not parametro == "--help":
                    procesar_param_configuracion(parametro)

            except Exception as e:
                logging.error('PARAMETRO INVALIDO EN CLI: '+parametro+'\nEl formato debe ser [parametro]=[valor]\n\nDetalle: ' + str(e) +
                              "\n\nSi el problema persiste, por favor informa:\n\thttps://github.com/Hechix/PythonRESTAPI/issues")
                quit()

    if CONFIGURACION['REGISTRO_IGNORAR']:
        print('Bienvenido a Hechix\'s Python REST API\nEl registo está deshabilitado, puedes activarlo en configuracion.conf')

    else:
            if CONFIGURACION['REGISTRO_ALMACENAR']:
                print('Bienvenido a Hechix\'s Python REST API\nEl registo está siendo almacenado y no aparecerá en consola, puedes cambiarlo en configuracion.conf')
                logging.basicConfig(filename='Registro.log', filemode='a', format='%(asctime)s - %(message)s',
                                    level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')

            else:
                logging.basicConfig(format='%(asctime)s - %(message)s',
                                    level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')


def procesar_param_configuracion(parametro):
    parametro, valor = parametro.split("=")
    parametro = parametro.strip().upper()
    valor = valor.strip()

    if parametro == 'SERVIDOR_DIRECCION':
        CONFIGURACION['SERVIDOR_ENLACE'] = (
            str(valor), CONFIGURACION['SERVIDOR_ENLACE'][1])

    elif parametro == 'SERVIDOR_PUERTO':
        CONFIGURACION['SERVIDOR_ENLACE'] = (
            CONFIGURACION['SERVIDOR_ENLACE'][0], int(valor))

    else:
        if parametro in CONFIGURACION.keys():
            if valor.lower() == "true" or valor.lower() == "false":
                valor = valor[0].upper() + valor[1:].lower()
            if valor == 'True' or valor == 'False':
                CONFIGURACION[parametro] = eval(valor)

            else:
                CONFIGURACION[parametro] = valor

        else:
            logging.basicConfig(format='%(asctime)s - %(message)s',
                                level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')
            logging.info(
                'PARAMETRO NO RECONOCIDO  -> '+parametro+' = '+valor)

    return parametro


if __name__ == '__main__':
    CONFIGURACION = {
        'SERVIDOR_ENCENDIDO': True,
        'SERVIDOR_ENLACE': ('0.0.0.0', -1),
        'FICHERO_JSON': 'db.json',
        'ATRIBUTO_PRIMARIO': 'id',
        'ACEPTAR_GET': True,
        'ACEPTAR_POST':  True,
        'ACEPTAR_PUT': True,
        'ACEPTAR_DELETE': True,
        'REGISTRO_ALMACENAR': False,
        'REGISTRO_IGNORAR': False,
        'SERVIR_ARCHIVOS': True,
        'INDEXAR_DIRECTORIOS': True,
        'PAGINA_ESTATICA_ABRIR_AUTOMATICAMENTE_AL_INICIO': True,
        'PAGINA_ESTATICA_ARCHIVO': 'index.html',
        'PAGINA_ESTATICA_DIRECTORIO': 'public',
        'BUSCAR_PAGINA_ESTATICA_AL_INDEXAR_DIRECTORIO': True,
        'URI_ESPECIALES': True,
        'PARAMETROS_ESPECIALES': True,
        'URI_ESPECIAL_CONFIGURACION': True
    }
    main()
