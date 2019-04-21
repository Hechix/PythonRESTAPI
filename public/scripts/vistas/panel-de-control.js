
function cargar_vista_panel_de_control() {
    html =
        `<div class="botones-horizontales">
    <button id="js-boton__volver" class="boton boton--pequeño boton--no-estirado">Volver</button>
    <button id="js-boton__recargar" class="boton boton--pequeño boton--no-estirado">Recargar</button>
    <button id="js-boton__alternar-modo-fondo" class="boton boton--pequeño boton--no-estirado">@@@@@</button>
    </div>`

    if (document.getElementsByTagName("body")[0].className == "") {
        html = html.replace("@@@@@", "Modo oscuro")
    } else {
        html = html.replace("@@@@@", "Modo claro")
    }

    principal = document.getElementById("js-principal")
    peticion = new XMLHttpRequest()

    peticion.onreadystatechange = function () {
        if (peticion.readyState == 4 && peticion.status == 200) {
            json = JSON.parse(peticion.responseText)

            json.forEach(indice => {
                html += "<div id='" + indice.nombre + "'class='raiz'>" + indice.nombre + "</div>"
            })

            principal.innerHTML = html

            boton__volver = document.getElementById("js-boton__volver")
            boton__recargar = document.getElementById("js-boton__recargar")
            boton_alternar_modo_fondo = document.getElementById("js-boton__alternar-modo-fondo")

            boton__volver.onclick = cargar_vista_bienvenida
            boton__recargar.onclick = cargar_vista_panel_de_control
            boton_alternar_modo_fondo.onclick = alternar_modo_fondo
        }
    }

    peticion.open("GET", "_indices", true)
    peticion.send();
}

function expandir_raiz(raiz){
    div = document.getElementById(raiz)
    html = 
    `<p class="registro">
        <span class="registro__id" >1</span>
        <span class="resumen">fecha: 1/1/1, contenido: ASBABASBS</span>
    </p>`
    div.innerHTML += html + html + html
}