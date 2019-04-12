from json import load as json_load, loads as json_loads, dump as json_dump


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

                if str(puntero[indice_listado][CONFIGURACION['JSON_ATRIBUTO_PRIMARIO']]) == str(indices[indice_actual]):
                    puntero = puntero[indice_listado]
                    encontrado = True
                    break

            if not encontrado:
                raise Exception('NO_EXISTEN_DATOS')

            indice_actual += 1

    return puntero


def indexar_json(CONFIGURACION):
    puntero = cargar_json(CONFIGURACION)
    return str(list(puntero.keys()))


def guardar_objeto(CONFIGURACION, objeto, indices):
    objeto = json_loads(objeto)

    if not CONFIGURACION['JSON_ATRIBUTO_PRIMARIO'] in objeto.keys():
        raise Exception('OBJETO_SIN_ATRIBUTO_PRIMARIO')

    json = cargar_json(CONFIGURACION)

    encontrado, objeto_encontrado, indice_objeto_almacenado = buscar_objeto(
        CONFIGURACION, indices, json, objeto[CONFIGURACION["JSON_ATRIBUTO_PRIMARIO"]])

    objeto_encontrado = indice_objeto_almacenado = None

    if encontrado:
        raise Exception('ATRIBUTO_PRIMARIO_YA_EXISTENTE')

    json[indices[0]].append(objeto)

    with open(CONFIGURACION['FICHERO_JSON'], 'w')as archivo:
        json_dump(json, archivo)

    return str(objeto)


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

            if atributo_primario == str(objeto_almacenado[CONFIGURACION["JSON_ATRIBUTO_PRIMARIO"]]):
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

    if not CONFIGURACION['JSON_ATRIBUTO_PRIMARIO'] in objeto.keys():
        raise Exception('OBJETO_SIN_ATRIBUTO_PRIMARIO')

    json = cargar_json(CONFIGURACION)

    encontrado, objeto_encontrado, indice_objeto_almacenado = buscar_objeto(
        CONFIGURACION, indices, json, objeto[CONFIGURACION["JSON_ATRIBUTO_PRIMARIO"]])

    objeto_encontrado = None

    if not encontrado:
        raise Exception('NO_EXISTE_EL_DESTINO')

    if indice_objeto_almacenado:
        json[indices[0]][indice_objeto_almacenado] = objeto
    else:
        json[indices[0]] = objeto

    with open(CONFIGURACION['FICHERO_JSON'], 'w')as archivo:
        json_dump(json, archivo)

    return str(objeto)