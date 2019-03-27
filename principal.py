from socket import socket, AF_INET, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
from threading import Thread
import logging


def leerConfiguracion():
    print("//TODO")#Cambiar a loggin
    #TODO EN #2


def peticion(cliente_conexion, cliente_direccion):
    global SERVIDOR_ENCENDIDO
    #TODO EN #3
    print(cliente_direccion)
    http = cliente_conexion.recv(1024)
    print(http)
    cliente_conexion.sendall(http)
    cliente_conexion.close()

def main():
    global SERVIDOR_ENCENDIDO,SERVIDOR_ENLACE
    leerConfiguracion()
    logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')
    logging.debug('INICIANDO SERVER')
    servidor, puerto = '', 80 
    servidor_escucha = socket(AF_INET, SOCK_STREAM)
    servidor_escucha.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    servidor_escucha.bind(SERVIDOR_ENLACE)
    servidor_escucha.listen(10)

    logging.debug("SERVER INICIADO")
    while SERVIDOR_ENCENDIDO:
        try:
            cliente_conexion, cliente_direccion = servidor_escucha.accept()
            peti = Thread(target=peticion, args=(
                cliente_conexion, cliente_direccion,))
            peti.start()

        except Exception as e:
            logging.error("/!\\ ERROR - "+ str(e))


if __name__ == '__main__':
    SERVIDOR_ENCENDIDO = True
    SERVIDOR_ENLACE = ('',-1)#Modificar esto de configuracion
    main()
