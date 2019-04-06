from json import load as jsonload

def leer_json():
    json = []
    with open("db.json",'r')as archivo:
        json = jsonload(archivo)

    procesar_campo(json)

def procesar_campo(cosa,ind = 0):
    #print(type(cosa),cosa)
    if isinstance(cosa,dict):
        for campo in cosa: 
            print('\t'*ind,campo)
            procesar_campo(cosa[campo],ind+1)

    elif isinstance(cosa,list):
        for x in range(len(cosa)):
            #print('\t'*ind,cosa[x])
            procesar_campo(cosa[x],ind + 1)

    elif isinstance(cosa,(str,int)):
        print('\t'*ind,cosa)