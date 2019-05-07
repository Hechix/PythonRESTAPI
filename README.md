# PythonRestAPI
Una REST API "Stand-Alone" de propósito general escrita en Python.

## Descripcion
// TODO
Es un proyecto para final de curso LOREM IPSUM LOREM IPSUM, como base de datos se usa un archivo json LOREM IPSUM LOREM IPSUM, se recomienda leer este documento antes de continuar

## Cómo empezar
### Pre-requisitos
Todo lo que necesitas está en el archivo [Hechix's Python REST API.zip](https://google.es). //TODO AÑADIR URL

### Configuración
Existen múltiples parámetros que son aceptados, para modificarlos, edita el archivo configuración.conf, ó añadelos en el CLI `hechixs_python_rest_api.exe [parametro]=[valor]`, más información en el apartado **Ejecucion**, el orden de prioridad es: `CLI > configuacion.conf > por defecto`

Si se elimina o no se configura algún parámetro, se usará el valor de la siguiente lista.

*Parametros sobre el servidor y el archivo JSON*
- SERVIDOR_DIRECCION = 0.0.0.0
- SERVIDOR_PUERTO = 80
- FICHERO_JSON = db.json
- ATRIBUTO_PRIMARIO = id *- Este es el atributo sobre el que se realizan las busquedas*

*Metodos validos*
- ACEPTAR_GET = True
- ACEPTAR_POST = True
- ACEPTAR_PUT = True
- ACEPTAR_DELETE = True

*Registro de eventos*
- REGISTRO_ALMACENAR = False
- REGISTRO_IGNORAR = False

*Página estática y directorio*
- SERVIR_ARCHIVOS = True
- INDEXAR_DIRECTORIOS = True
- PAGINA_ESTATICA_ABRIR_AUTOMATICAMENTE_AL_INICIO = True
- PAGINA_ESTATICA_ARCHIVO = index.html
- PAGINA_ESTATICA_DIRECTORIO = public
- BUSCAR_PAGINA_ESTATICA_AL_INDEXAR_DIRECTORIO = True

*URI y parametros especiales*  `_raices, _limite, _desde ...`
- URI_ESPECIALES = True
- PARAMETROS_ESPECIALES = True

`NOTA: /_configuracion devuelve los valores de:
ATRIBUTO_PRIMARIO, ACEPTAR_GET, ACEPTAR_POST, ACEPTAR_PUT y ACEPTAR_DELETE
es necesario para el correcto funcionamiento de la página estática por defecto`

- URI_ESPECIAL_CONFIGURACION = True

### Ejecución
Ahora ya podemos empezar, la sintaxis de CLI es: `hechixs_python_rest_api.exe`
- Se pueden añadir parámetros `hechixs_python_rest_api.exe [parametro]=[valor]`
- Separados por espacios `hechixs_python_rest_api.exe [parametro]=[valor] [parametro]=[valor] [parametro]=[valor]`
- Para ver la ayuda, se puede emplear -h o --help: `hechixs_python_rest_api.exe -h`

## Funcionalidad
### Capacidades
// TODO
El servidor es capaz de LOREM IPSUM LOREM IPSUM
- URI especiales
- Lista URI especiales
- Parametros especiales
- Lista Parametros especiales
- Servicio páginas web estáticas (explicar abajo la x defecto)
- La base de datos es un archivo json

### Páginas web estáticas
// TODO
El servidor puede servir una web estátca LOREM IPSUM LOREM IPSUM, la web por defecto es un CRUD, con una pequeña web a modo de demostración de cómo se usan los datos en la base de datos LOREM IPSUM LOREM IPSUM,
- Imágenes y videos
- ???  

### Códigos de error
// TODO
- Lista de códigos de error personalizados  

## Version
// TODO
Esta es la versión 1.0, no hay planes de mejora en el futuro LOREM IPSUM LOREM IPSUM  

## Licencia 
// TODO
Se permite usar este software para cualquier propósito académico o personal, no se permite modificar el código fuente sin permiso previo (o si?), LOREM IPSUM LOREM IPSUM
- Buscar la licencia

## ???
### ???
- LOREM
- IPSUM
