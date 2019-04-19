texto = `<- GET /
-> 200 index.html
<- GET /public/css/estilo.css
-> 200 estilo.css
<- GET /public/scripts/fondo.js
-> 200 fondo.js
<- GET /public/scripts/principal.js
-> 200 principal.js`

linea_actual = 0
ip_aleatoria = ""
fondo = document.getElementById("js-fondo")
estilo_fondo = window.getComputedStyle(fondo, null);

function fondo_animado() {

    if (linea_actual == 0) {
        ip_aleatoria =
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

    texto_a_añadir = fecha_y_hora + "&ensp;" + ip_aleatoria + "&ensp;" + texto.split("\n")[linea_actual] + '<br>'

    fondo.innerHTML += texto_a_añadir

    altura_maxima_fondo = parseInt(estilo_fondo.getPropertyValue('height').replace("px", ""))

    if (fondo.scrollHeight > altura_maxima_fondo) {
        fondo.innerHTML = fondo.innerHTML.split("<br>").slice(1).join("<br>")
    }

    linea_actual++

    if (linea_actual >= texto.split("\n").length) {
        linea_actual = 0
    }
}

setInterval(fondo_animado, 120);

Math.floor((Math.random() * 255));