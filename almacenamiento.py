from json import load as jsonload


def cargar_json(CONFIGURACION):
    json = []
    with open(CONFIGURACION['FICHERO_JSON'], 'r')as archivo:
        json = jsonload(archivo)
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
                if str(puntero[indice_listado]['id']) == str(indices[indice_actual]):
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
