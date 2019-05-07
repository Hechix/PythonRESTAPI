from json import load as json_load, loads as json_loads, dump as json_dump
from os import listdir as os_listdir
from os import path as os_path


def cargar_json(CONFIGURACION):
    json = {}
    with open(CONFIGURACION['FICHERO_JSON'], 'r')as archivo:
        json = json_load(archivo)
    return json


def leer_json(CONFIGURACION, indices):
    puntero = cargar_json(CONFIGURACION)
    # Se recorre el árbol JSON buscando los objetos que coincidan con los indices extraidos de la URI
    indice_actual = 0

    while indice_actual < len(indices):

        if isinstance(puntero, dict):

            if indices[indice_actual] in puntero.keys():

                puntero = puntero[indices[indice_actual]]
                indice_actual += 1

            else:
                raise Exception('NO_EXISTEN_DATOS')

        elif isinstance(puntero, list):

            encontrado = False

            for indice_listado in range(len(puntero)):

                if isinstance(puntero[indice_listado], list):
                    raise Exception('ALMACENAMIENTO_JSON_MALFORMADO')

                if str(puntero[indice_listado][CONFIGURACION['ATRIBUTO_PRIMARIO']]) == str(indices[indice_actual]):
                    puntero = puntero[indice_listado]
                    encontrado = True
                    break

            if not encontrado:
                raise Exception('NO_EXISTEN_DATOS')

            indice_actual += 1
    return puntero


def indexar_json(CONFIGURACION):
    puntero = cargar_json(CONFIGURACION)
    listado = []
    for indice in puntero.keys():
        listado.append(
            {'nombre': indice, 'cantidad_registros': len(puntero[indice])})
    return listado


def guardar_objeto(CONFIGURACION, objeto, indices):
    objeto = json_loads(objeto)
    objeto[CONFIGURACION["ATRIBUTO_PRIMARIO"]
           ] = objeto[CONFIGURACION["ATRIBUTO_PRIMARIO"]].strip()

    if not CONFIGURACION['ATRIBUTO_PRIMARIO'] in objeto.keys():
        raise Exception('OBJETO_SIN_ATRIBUTO_PRIMARIO')

    json = cargar_json(CONFIGURACION)

    encontrado, objeto_encontrado, indice_objeto_almacenado = buscar_objeto(
        CONFIGURACION, indices, json, objeto[CONFIGURACION["ATRIBUTO_PRIMARIO"]])

    objeto_encontrado = indice_objeto_almacenado = None

    if encontrado:
        raise Exception('ATRIBUTO_PRIMARIO_YA_EXISTENTE')

    json[indices[0]].append(objeto)

    with open(CONFIGURACION['FICHERO_JSON'], 'w')as archivo:
        json_dump(json, archivo)


def buscar_objeto(CONFIGURACION, indices, json, atributo_primario=None):
    # En caso de estar buscando para POST o PUT, se usa el atributo primario
    # en caso de DELETE se usa el valor pasaado en la URI
    if atributo_primario == None and len(indices) == 2:
        atributo_primario = indices[1]

    atributo_primario = str(atributo_primario)

    if not indices[0] in json.keys():
        raise Exception('NO_EXISTE_EL_DESTINO')

    if isinstance(json[indices[0]], list):

        for indice_objeto_almacenado in range(len(json[indices[0]])):
            objeto_almacenado = json[indices[0]][indice_objeto_almacenado]

            if CONFIGURACION["ATRIBUTO_PRIMARIO"] in objeto_almacenado \
                    and atributo_primario == str(objeto_almacenado[CONFIGURACION["ATRIBUTO_PRIMARIO"]]):
                return True, objeto_almacenado, indice_objeto_almacenado

    elif isinstance(json[indices[0]], dict):
        return True,  json[indices[0]], None

    return False, None, None


def borrar_objeto(CONFIGURACION, indices, json, objeto):

    json[indices[0]].remove(objeto)
    with open(CONFIGURACION['FICHERO_JSON'], 'w')as archivo:
        json_dump(json, archivo)


def modificar_objeto(CONFIGURACION, objeto, indices):
    objeto = json_loads(objeto)

    if not CONFIGURACION['ATRIBUTO_PRIMARIO'] in objeto.keys():
        raise Exception('OBJETO_SIN_ATRIBUTO_PRIMARIO')

    json = cargar_json(CONFIGURACION)

    encontrado, objeto_encontrado, indice_objeto_almacenado = buscar_objeto(
        CONFIGURACION, indices, json, objeto[CONFIGURACION["ATRIBUTO_PRIMARIO"]])

    objeto_encontrado = None

    if not encontrado:
        raise Exception('NO_EXISTE_EL_DESTINO')

    if indice_objeto_almacenado == None:
        json[indices[0]] = objeto
    else:
        json[indices[0]][indice_objeto_almacenado] = objeto

    with open(CONFIGURACION['FICHERO_JSON'], 'w')as archivo:
        json_dump(json, archivo)

    return str(objeto)


def leer_archivo(directorio, trozos_URI):
    try:
        archivos_binarios = [
            'jpg',
            'png',
            'gif',
            'mp4',
            'webm'
        ]

        metodo_lectura = 'r'

        if trozos_URI[-1].split(".")[-1] in archivos_binarios:
            metodo_lectura = 'rb'

        with open(directorio, metodo_lectura) as archivo_leido:
            return 200, archivo_leido.read(), trozos_URI[-1]

    except Exception as e:
        if type(e).__name__ == 'UnicodeDecodeError':
            return 500, 'NO_SE_PUEDE_DECODIFICAR', False

        elif type(e).__name__ == 'FileNotFoundError':
            return 404, False, False

        else:
            return 500, False, False


def leer_directorio(directorio, trozos_URI, archivo_pagina_estatica, buscar_archivo_pag_estatica):
    archivos_en_dire = os_listdir(directorio)
    if buscar_archivo_pag_estatica and archivo_pagina_estatica in archivos_en_dire:
        codigo, contenido, nom_archivo = leer_archivo(
            directorio + "/" + archivo_pagina_estatica, trozos_URI)
        return codigo, contenido, nom_archivo

    html = '<!DOCTYPE html>\
            <html lang="en">\
            <head>\
                <meta charset="UTF-8">\
                <meta name="viewport" content="width=device-width, initial-scale=1.0">\
                <meta http-equiv="X-UA-Compatible" content="ie=edge">\
                <title>'+directorio+'</title>\
                <style>\
                    table{\
                        width:100%;\
                        margin: 0 15px;\
                    }\
                    .directorio {\
                        border-left: 3px solid blue;\
                        padding-left: 5px;\
                    }\
                    .archivo {\
                        border-left: 3px solid green;\
                        padding-left: 5px;\
                    }\
                    .archivo_peso {\
                        text-align: right;\
                    }\
                </style>\
            </head>\
            <body>\
                <h1>' + directorio + '</h1>\
                <table>'

    for cosa in archivos_en_dire:
        if os_path.isdir(directorio + "/" + cosa):
            html += '<tr><td class="directorio"><a href="/' + \
                directorio+"/"+cosa+'">'+cosa+'/</a></td></tr>'
        else:
            peso, escala_peso = calcular_tamaño(directorio+"/"+cosa)
            html += '<tr><td class="archivo"><a href="/'+directorio + \
                "/"+cosa+'">'+cosa+'</a></td><td class="archivo_peso">'+peso+'</td><td>'+escala_peso+'</td></tr>'

    html += '   </table>\
            </body>\
        </html>'
    return 200, html, False


def calcular_tamaño(archivo):
    escalas = ["B", "KB", "MB", "GB", "TB"]
    escala_actual = 0
    peso = os_path.getsize(archivo)
    while peso > 1000:
        if escala_actual < len(escalas):
            peso = int(peso / 1000)
            escala_actual += 1
        else:
            break

    return str(peso), escalas[escala_actual]
