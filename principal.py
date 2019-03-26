import socket
from threading import Thread


def peticion(cliente, direccion):
    print(direccion)
    http = cliente.recv(1024)
    print(http)
    cliente.sendall(http)
    cliente.close()

def main():
    print("Iniciando Server")
    HOST, PORT = '', 80

    listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listen_socket.bind((HOST, PORT))
    listen_socket.listen(10)

    print("Server iniciado")

    while True:
        try:
            client_connection, client_address = listen_socket.accept()
            print(client_address,"Conexion entrante")
            
            peti = Thread(target=peticion, args=(client_connection, client_address,))
            peti.start()
            
        except Exception as e:
            print("/!\\ ERROR:", e)

if __name__ == '__main__':
    main()