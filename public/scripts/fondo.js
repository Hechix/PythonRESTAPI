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

function fondo_animado() {

    fondo = document.getElementById("js-fondo")
    estilo_fondo = window.getComputedStyle(fondo, null);

    if (LINEA_ACTUAL == 0) {
        IP_ALEATORIA =
            Math.floor((Math.random() * 255)) + "." +
            Math.floor((Math.random() * 255)) + "." +
            Math.floor((Math.random() * 255)) + "." +
            Math.floor((Math.random() * 255))
    }
    ahora = new Date();
    fecha_y_hora = ahora.getFullYear() + "/" +
        ('0' + ahora.getMonth()).slice(-2) + "/" +
        ('0' + ahora.getDay()).slice(-2) + "&ensp;" +
        ('0' + ahora.getHours()).slice(-2) + " : " +
        ('0' + ahora.getMinutes()).slice(-2) + " : " +
        ('0' + ahora.getSeconds()).slice(-2)

    TEXTO_a_añadir = fecha_y_hora + "&ensp;" + IP_ALEATORIA + "&ensp;" + TEXTO.split("\n")[LINEA_ACTUAL] + '<br>'
    fondo.innerHTML += TEXTO_a_añadir

    altura_maxima_fondo = parseInt(estilo_fondo.getPropertyValue('height').replace("px", ""))

    if (fondo.scrollHeight > altura_maxima_fondo) {
        fondo.innerHTML = fondo.innerHTML.split("<br>").slice(1).join("<br>")
    }

    LINEA_ACTUAL++

    if (LINEA_ACTUAL >= TEXTO.split("\n").length) {
        LINEA_ACTUAL = 0
    }
}

function alternar_modo_fondo() {
    body = document.getElementsByTagName("body")[0]
    titulo = document.getElementById("js-titulo")

    boton_alternar_modo_fondo = document.getElementById("js-boton__alternar-modo-fondo")

    if (body.className == "") {
        body.className = "body-oscuro"
        fondo.className = "fondo fondo--oscuro"
        boton_alternar_modo_fondo.innerHTML = "Modo claro"
        if (titulo) {
            titulo.className = "titulo titulo--oscuro"
        }

    } else {
        body.className = ""
        fondo.className = "fondo"
        boton_alternar_modo_fondo.innerHTML = "Modo oscuro"
        if (titulo) {
            titulo.className = "titulo"
        }
    }
}

setInterval(fondo_animado, 240);