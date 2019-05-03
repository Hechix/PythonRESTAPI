function fondo_animado() {

    var fondo = document.getElementById("js-fondo")
    var estilo_fondo = window.getComputedStyle(fondo, null);

    if (LINEA_ACTUAL == 0) {
        IP_ALEATORIA =
            Math.floor((Math.random() * 255)) + "." +
            Math.floor((Math.random() * 255)) + "." +
            Math.floor((Math.random() * 255)) + "." +
            Math.floor((Math.random() * 255))
    }

    var ahora = new Date();
    var fecha_y_hora = ahora.getFullYear() + "/" +
        ('0' + (ahora.getMonth() + 1)).slice(-2) + "/" +
        ('0' + ahora.getDate()).slice(-2) + "&ensp;" +
        ('0' + ahora.getHours()).slice(-2) + " : " +
        ('0' + ahora.getMinutes()).slice(-2) + " : " +
        ('0' + ahora.getSeconds()).slice(-2)

    var TEXTO_a_añadir = fecha_y_hora + "&ensp;" + IP_ALEATORIA + "&ensp;" + TEXTO.split("\n")[LINEA_ACTUAL] + '<br>'
    fondo.innerHTML += TEXTO_a_añadir

    var altura_maxima_fondo = parseInt(estilo_fondo.getPropertyValue('height').replace("px", ""))

    if (fondo.scrollHeight > altura_maxima_fondo + 10) {
        fondo.innerHTML = fondo.innerHTML.split("<br>").slice(1).join("<br>")
    }

    LINEA_ACTUAL++

    if (LINEA_ACTUAL >= TEXTO.split("\n").length) {
        LINEA_ACTUAL = 0
    }
}

function alternar_modo_fondo() {
    var body = document.getElementsByTagName("body")[0]
    var fondo = document.getElementById("js-fondo")
    var boton_alternar_modo_fondo = document.getElementById("js-boton__alternar-modo-fondo")
    var titulo_superior = document.getElementById("js-titulo-superior")
    var titulo_inferior = document.getElementById("js-titulo-inferior")
    var titulo_administracion = document.getElementsByClassName("botones-horizontales__titulo")[0]

    if (body.className == "") {
        body.className = "body-oscuro"
        fondo.className = "fondo fondo--oscuro"
        boton_alternar_modo_fondo.innerHTML = '<i class="far fa-lightbulb"></i>'
        if (titulo_superior) {
            titulo_superior.className = "titulo titulo__superior"
            titulo_inferior.className = "titulo titulo__inferior"
        }
        if (titulo_administracion) {
            titulo_administracion.className = "botones-horizontales__titulo"
        }
    } else {
        body.className = ""
        fondo.className = "fondo"
        boton_alternar_modo_fondo.innerHTML = '<i class="fas fa-lightbulb"></i>'
        if (titulo_superior) {
            titulo_superior.className = "titulo titulo__superior titulo--oscuro"
            titulo_inferior.className = "titulo titulo__inferior titulo--oscuro"
        }
        if (titulo_administracion) {
            titulo_administracion.className = "botones-horizontales__titulo botones-horizontales__titulo--oscuro"
        }
    }
}