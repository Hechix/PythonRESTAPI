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

    if (fondo.scrollHeight > altura_maxima_fondo) {
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

    if (body.className == "") {
        body.className = "body-oscuro"
        fondo.className = "fondo fondo--oscuro"
        boton_alternar_modo_fondo.innerHTML = '<i class="far fa-lightbulb"></i>'

    } else {
        body.className = ""
        fondo.className = "fondo"
        boton_alternar_modo_fondo.innerHTML = '<i class="fas fa-lightbulb"></i>'
    }
}