# Hechix's Python REST API
Una REST API "Stand-Alone" de propósito general escrita en Python.

## Descripción
Este es un proyecto para final de curso, se trata de un servidor, que gestiona una REST API de uso general, pensada para ser usada como mini-servidor web para proyectos pequeños.
- No tiene ningún tipo de autenticación
- Como base de datos se usa un archivo json
- Muy configurable
- Sirve páginas web estáticas
- Descomprimir y ejecutar.

Se recomienda leer este documento antes de continuar.

## Cómo empezar
### Pre-requisitos / Descargas
Todo lo que necesitas está en el archivo [Hechix's Python REST API.zip](https://google.es).
### Configuración
Existen múltiples parámetros que son aceptados, para modificarlos, edita el archivo configuración.conf, ó añádelos en el CLI `hechixs_python_rest_api.exe [parametro]=[valor]`, más información en el apartado **Ejecución**, el orden de prioridad es: `CLI > configuacion.conf > por defecto`

Si se elimina o no se configura algún parámetro, se usará el valor de la siguiente lista.

*Parámetros sobre el servidor y el archivo JSON*
- SERVIDOR_DIRECCION = 0.0.0.0
- SERVIDOR_PUERTO = 80
- FICHERO_JSON = db.json
- ATRIBUTO_PRIMARIO = id *- Este es el atributo sobre el que se realizan las búsquedas*

*Métodos validos*
- ACEPTAR_GET = True
- ACEPTAR_POST = True
- ACEPTAR_PUT = True
- ACEPTAR_DELETE = True

*Registro de eventos*
- REGISTRO_ALMACENAR = False *- Guardar en Registro.log*
- REGISTRO_IGNORAR = False *- No imprimir ni guardar*

*Página estática y directorio*
- SERVIDOR_ESTATICO = True
- INDEXAR_DIRECTORIOS = True
- PAGINA_ESTATICA_ABRIR_AUTOMATICAMENTE_AL_INICIO = True
- PAGINA_ESTATICA_ARCHIVO = index.html
- PAGINA_ESTATICA_DIRECTORIO = public
- BUSCAR_PAGINA_ESTATICA_AL_INDEXAR_DIRECTORIO = True

*URI y parametros especiales*  `_raices, _limite, _desde ...`
- URI_ESPECIALES = True
- PARAMETROS_ESPECIALES = True
- URI_ESPECIAL_CONFIGURACION = True

### Ejecución
Ahora ya podemos empezar, la sintaxis de CLI es: `hechixs_python_rest_api.exe`
- Se pueden añadir parámetros `hechixs_python_rest_api.exe [parametro]=[valor]`
- Separados por espacios `hechixs_python_rest_api.exe [parametro]=[valor] [parametro]=[valor] [parametro]=[valor]`
- Para ver la ayuda, se puede emplear -h o --help: `hechixs_python_rest_api.exe -h`

> Ejemplo `hechixs_python_rest_api.exe PAGINA_ESTATICA_ABRIR_AUTOMATICAMENTE_AL_INICIO=False` en este caso, se iniciará el servidor pero no se va a abrir la página estática

## Funcionalidad
### Capacidades
El servidor tiene múltiples capacidades.

**URIs normales**:  Son las "clásicas" `/posts, /posts/1, /posts/1/autor, ...`

**Parámetros normales**: Son parámetros condicionales, se pueden juntar con los especiales, sirven para modificar el retorno de datos `/posts?autor=1, /comentarios?postId=1, ...`

**URIs especiales**: Son URLs pensadas para expandir las capacidades del servidor, pueden activarse y desactivarse con el parámetro de configuración `URI_ESPECIALES`
- /_raices  *- Devuelve las raíces (posts, comentarios, usuarios), es el mismo comportamiento que si se desactiva la página estática*
- /_configuracion *- Devuelve los valores de configuración del servidor `ATRIBUTO_PRIMARIO, ACEPTAR_GET, ACEPTAR_POST, ACEPTAR_PUT y ACEPTAR_DELETE`. Es necesario para el correcto funcionamiento de la página estática por defecto*

**Parámetros especiales**: Son parámetros que modifican el retorno de los datos, pueden activarse y desactivarse con el parámetro de configuración `PARAMETROS_ESPECIALES` 
- _limite=x *- Limita la cantidad de resultados a x `/posts?_limite=1`*
> Ejemplo: si `/numeros` devuelve `[1,2,3,4,5]`, `/numeros?_limite=3` devuelve `[1,2,3]`
- _desde=x *- "Corta" los resultados  devuelve a partir de x `/posts?_desde=1`*
> Ejemplo: si `/numeros` devuelve `[1,2,3,4,5]`, `/numeros?_desde=3` devuelve `[4,5]`
- _total *- Limita la cantidad de resultados `/posts?_total`*
> Ejemplo: si `/numeros` devuelve `[1,2,3,4,5]`, `/numeros?_total` devuelve `5`

### Páginas web estáticas
El servidor por defecto, sirve una web estática, que se almacena en el directorio `/public`.

La web por defecto es un CRUD, con una pequeña web a modo de demostración de cómo se usan los datos en la base de datos. Ese es su único propósito y se recomienda eliminarla cuando se modifique la base de datos.

En caso de pedir un directorio `EJ: /public`, se buscará el archivo índice, si no se encuentra, se listará el directorio, esto puede desactivarse con `INDEXAR_DIRECTORIOS` y la búsqueda del archivo con `BUSCAR_PAGINA_ESTATICA_AL_INDEXAR_DIRECTORIO`

Se leerán archivos de texto plano, y los siguientes archivos binarios `jpg, png, gif, mp4, webm`

Se puede desactivar completamente la función de servidor estático con el parámetro `SERVIDOR_ESTATICO`
Tanto el directorio como el archivo índice se modifican respectivamente con `PAGINA_ESTATICA_DIRECTORIO` y `PAGINA_ESTATICA_ARCHIVO`.

### Códigos de error
// TODO
- Lista de códigos de error personalizados
- 
## Licencia
Se permite usar este software para cualquier propósito académico o personal, no se permite modificar el código fuente ni distribuirlo sin enlazar a este repositorio.

[Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
