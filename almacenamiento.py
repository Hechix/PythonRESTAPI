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

                # Comprobacion de como está escrito el atributo primario, para evitar problemas como ID en vez de id
                atributo_primario = ''
                if CONFIGURACION['JSON_ATRIBUTO_PRIMARIO'].lower() in puntero[indice_listado].keys():
                    atributo_primario = CONFIGURACION['JSON_ATRIBUTO_PRIMARIO'].lower(
                    )
                elif CONFIGURACION['JSON_ATRIBUTO_PRIMARIO'].upper() in puntero[indice_listado].keys():
                    atributo_primario = CONFIGURACION['JSON_ATRIBUTO_PRIMARIO'].upper(
                    )
                else:
                    raise Exception(
                        'ALMACENAMIENTO_JSON_OBJETO_SIN_ATRIBUTO_PRIMARIO')

                if str(puntero[indice_listado][atributo_primario]) == str(indices[indice_actual]):
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

    encontrado, objeto_encontrado = buscar_objeto(
        CONFIGURACION, indices, json, objeto[CONFIGURACION["JSON_ATRIBUTO_PRIMARIO"]])

    if encontrado:
        raise Exception('ATRIBUTO_PRIMARIO_YA_EXISTENTE')

    json[indices[0]].append(objeto)

    with open(CONFIGURACION['FICHERO_JSON'], 'w')as archivo:
        json_dump(json, archivo)

    return str(objeto)


def buscar_objeto(CONFIGURACION, indices, json, atributo_primario=None):
    if atributo_primario == None:
        atributo_primario = indices[1]
    atributo_primario = str(atributo_primario)

    if not indices[0] in json.keys():
        raise Exception('NO_EXISTE_EL_DESTINO')

    for objeto_almacenado in json[indices[0]]:
        if atributo_primario == str(objeto_almacenado[CONFIGURACION["JSON_ATRIBUTO_PRIMARIO"]]):
            return True, objeto_almacenado
            break

    return False, None


def borrar_objeto(CONFIGURACION, indices, json, objeto):

    json[indices[0]].remove(objeto)
    with open(CONFIGURACION['FICHERO_JSON'], 'w')as archivo:
        json_dump(json, archivo)


'''
def procesar_campo(cosa, ind=0):
    # Esto sera para en la version 1.0 formar el indice
    # print(type(cosa),cosa)
    if isinstance(cosa, dict):
        for campo in cosa:
            print('\t'*ind, campo)
            procesar_campo(cosa[campo], ind+1)

    elif isinstance(cosa, list):
        for x in range(len(cosa)):
            # print('\t'*ind,cosa[x])
            procesar_campo(cosa[x], ind + 1)

    elif isinstance(cosa, (str, int)):
        print('\t'*ind, cosa)
'''
