from socket import socket, AF_INET, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
from threading import Thread


def leerConfiguracion():
    print("//TODO")#Cambiar a loggin
    #TODO EN #2


def peticion(cliente_conexion, cliente_direccion):
    #TODO EN #3
    print(cliente_direccion)
    http = cliente_conexion.recv(1024)
    print(http)
    cliente_conexion.sendall(http)
    cliente_conexion.close()


def main():
    print("Iniciando Server") #Cambiar a loggin
    leerConfiguracion()
    servidor, puerto = '', 80 #Leer esto de configuracion

    servidor_escucha = socket(AF_INET, SOCK_STREAM)
    servidor_escucha.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    servidor_escucha.bind((servidor, puerto))
    servidor_escucha.listen(10)

    print("Server iniciado")#Cambiar a loggin

    while True:
        try:
            cliente_conexion, cliente_direccion = servidor_escucha.accept()
            print(cliente_direccion, "Conexion entrante")#Cambiar a loggin

            peti = Thread(target=peticion, args=(
                cliente_conexion, cliente_direccion,))
            peti.start()

        except Exception as e:
            print("/!\\ ERROR:", e)#Cambiar a loggin


if __name__ == '__main__':
    main()
