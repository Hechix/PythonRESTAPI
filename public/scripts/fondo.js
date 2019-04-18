texto = `from socket import socket, AF_INET, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
from threading import Thread
import logging
from Peticion import Peticion
from webbrowser import open_new_tab as abrir_en_navegador


def main():
    global CONFIGURACION
    cargar_configuracion()
    logging.debug('INICIANDO SERVER')
    servidor_escucha = socket(AF_INET, SOCK_STREAM)
    servidor_escucha.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    servidor_escucha.bind(CONFIGURACION['SERVIDOR_ENLACE'])
    servidor_escucha.listen(10)
    # TODO Configuracion / linea comandos si se abre automaticamnte o no
    if CONFIGURACION['PAGINA_BIENVENIDA_ABRIR_AUTOMATICAMENTE_AL_INICIO']:
        abrir_en_navegador('http://localhost:' +
                           str(CONFIGURACION['SERVIDOR_ENLACE'][1]))
    logging.info("Bienvenido a...
 _   _           _     _      _              
| | | |         | |   (_)    ( )              
| |_| | ___  ___| |__  ___  _|/ ___           
|  _  |/ _ \/ __| '_ \| \ \/ / / __|          
| | | |  __/ (__| | | | |>  <  \__ \          
\_| |_/\___|\___|_| |_|_/_/\_\ |___/          
                                              
______      _   _                             
| ___ \    | | | |                            
| |_/ /   _| |_| |__   ___  _ __              
|  __/ | | | __| '_ \ / _ \| '_ \             
| |  | |_| | |_| | | | (_) | | | |            
\_|   \__, |\__|_| |_|\___/|_| |_|            
       __/ |                                  
      |___/                                   
______ _____ _____ _____    ___  ______ _____ 
| ___ \  ___/  ___|_   _|  / _ \ | ___ \_   _|
| |_/ / |__ \ \`--.  | |   / /_\ \| |_/ / | |  
|    /|  __| \`--. \ | |   |  _  ||  __/  | |  
| |\ \| |___/\__/ / | |   | | | || |    _| |_
\_| \_\____/\____/  \_/   \_| |_/\_|    \___/ 
                                              
                                              ")
    while CONFIGURACION['SERVIDOR_ENCENDIDO']:
        try:
            cliente_conexion, cliente_direccion = servidor_escucha.accept()
            peticion = Peticion(
                cliente_conexion, cliente_direccion, CONFIGURACION, logging)
            hilo = Thread(target=peticion.procesar)
            hilo.start()
        except Exception as e:
            logging.error("/!\ ERROR - " + str(e))


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
            logging.error('PARAMETRO INVALIDO:' + parametro +
                          ' = ' + valor + 'Detalle:' + str(e)+"Si el problema persiste, por favor informa:https://github.com/Hechix/PythonRESTAPI/issues")
            exit()

    if CONFIGURACION['REGISTRO_IGNORAR']:
        print('Bienvenido a Hechix's Python REST API El registo está deshabilitado, puedes activarlo en configuracion.conf')

    else:
        if CONFIGURACION['REGISTRO_DEBUG']:
            if CONFIGURACION['REGISTRO_ALMACENAR']:
                print('Bienvenido a Hechixs Python REST APIEl registo está siendo almacenado y no aparecerá en consola, puedes cambiarlo en configuracion.conf')
                logging.basicConfig(filename='Registro.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s',
                                    level=logging.DEBUG, datefmt='%d-%m-%y %H:%M:%S')

            else:
                logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',
                                    level=logging.DEBUG, datefmt='%d-%m-%y %H:%M:%S')

            logging.debug('Configuracion:')

            for parametro in CONFIGURACION.keys():
                logging.debug(parametro + (' ' * (25 - len(parametro))
                                           ) + str(CONFIGURACION[parametro]))

            logging.debug(('-' * 30)+'')

        else:
            if CONFIGURACION['REGISTRO_ALMACENAR']:
                print('Bienvenido a Hechix's Python REST API El registo está siendo almacenado y no aparecerá en consola, puedes cambiarlo en configuracion.conf')
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
        'FICHERO_JSON': 'db.json',  # TODO :  Cargar esto desde parametro de terminal
        'JSON_ATRIBUTO_PRIMARIO': 'id',
        'ACEPTAR_GET': True,
        'ACEPTAR_POST':  True,
        'ACEPTAR_PUT': True,
        'ACEPTAR_DELETE': True,
        'PAGINA_BIENVENIDA_SERVIR': True,
        'PAGINA_BIENVENIDA_ABRIR_AUTOMATICAMENTE_AL_INICIO': True,
        'PAGINA_BIENVENIDA_ARCHIVO': 'index.html',
        'PAGINA_BIENVENIDA_DIRECTORIO': 'public'
    }
    main()
`
linea_actual = 0
fondo = document.getElementById("js-fondo")
estilo_fondo = window.getComputedStyle(fondo, null);

function fondo_animado() {
    texto_a_añadir = texto.split("\n")[linea_actual].replace(/    /g, "&ensp;&ensp;") + '<br>'

    fondo.innerHTML += texto_a_añadir

    altura_maxima_fondo = parseInt(estilo_fondo.getPropertyValue('height').replace("px", ""))

    if (fondo.scrollHeight > altura_maxima_fondo) {
        fondo.innerHTML = fondo.innerHTML.split("<br>").slice(1).join("<br>")
    }

    linea_actual++

    if (linea_actual >= texto.split("\n").length) {
        linea_actual = 0
    }
}

setInterval(fondo_animado, 30);