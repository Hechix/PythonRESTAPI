function notificacion(contenido = undefined, tipo = "info") {
    if (contenido) {
        borrar_notificacion()
        body = document.getElementsByTagName("body")[0]
        body.innerHTML +=
            `<div id="notificacion" class="notificacion notificacion--` + tipo + `" onanimationend="borrar_notificacion()">
                <div class="notificacion__contenido">
                    <div class="notificacion__barra"></div>
                    ` + contenido + `
                </div>
            </div>`

    } else {
        console.error("Se ha intentado invocar una notificacion sin contenido")
    }
}

function borrar_notificacion() {
    noti_actual = document.getElementById("notificacion")

    if (noti_actual) {
        noti_actual.remove()
    }
}

function HtmlEncode(s) {
    // https://stackoverflow.com/questions/784586/convert-special-characters-to-html-in-javascript
    // Basicamente crea un div, le inserta la string a codificar, y la recupera, y el propio html la devuelve codificada
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

function string_aleatoria(length) {
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}