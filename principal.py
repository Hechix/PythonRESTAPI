from socket import socket, AF_INET, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
from threading import Thread
import logging


def leerConfiguracion():
    print("//TODO")#Cambiar a loggin
    #TODO EN #2


def peticion(cliente_conexion, cliente_direccion):
    global HPRESTAPI
    #TODO EN #3
    print(cliente_direccion)
    http = cliente_conexion.recv(1024)
    print(http)
    cliente_conexion.sendall(http)
    cliente_conexion.close()
    HPRESTAPI = False

def main():
    global HPRESTAPI
    leerConfiguracion()
    logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO, datefmt='%d-%m-%y %H:%M:%S')
    logging.debug('INICIANDO SERVER')
    servidor, puerto = '', 80 #Leer esto de configuracion
    servidor_escucha = socket(AF_INET, SOCK_STREAM)
    servidor_escucha.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    servidor_escucha.bind((servidor, puerto))
    servidor_escucha.listen(10)

    logging.debug("SERVER INICIADO")
    HPRESTAPI = True
    while HPRESTAPI:
        try:
            cliente_conexion, cliente_direccion = servidor_escucha.accept()
            peti = Thread(target=peticion, args=(
                cliente_conexion, cliente_direccion,))
            peti.start()

        except Exception as e:
            logging.error("/!\\ ERROR - "+ str(e))


if __name__ == '__main__':
    HPRESTAPI = True
    main()
