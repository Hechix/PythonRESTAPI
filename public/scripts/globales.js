// TODO Cambiar flechas a font-awesome y darle colores o algo

TEXTO = `<- GET /
-> 200 index.html
<- GET /public/css/estilo.css
-> 200 estilo.css
<- GET /public/scripts/fondo.js
-> 200 fondo.js
<- GET /public/scripts/principal.js
-> 200 principal.js`

LINEA_ACTUAL = 0
IP_ALEATORIA = ""

CONFIGURACION = undefined
JSON_ATRIBUTO_PRIMARIO = undefined
RAICES = []
EDICION = undefined

function inicializacion() {
    setInterval(fondo_animado, 240);
    cargar_vista_bienvenida()
}


window.onload = inicializacion;