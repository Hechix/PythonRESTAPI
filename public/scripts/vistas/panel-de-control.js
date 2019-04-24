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
    principal.innerHTML = html

    peticion_indices = new XMLHttpRequest()
    peticion_configuracion = new XMLHttpRequest()

    peticion_indices.onreadystatechange = function () {
        if (peticion_indices.readyState == 4 && peticion_indices.status == 200) {
            json = JSON.parse(peticion_indices.responseText)
            json.forEach(indice => {
                principal.innerHTML +=
                    `<div id='` + indice.nombre + `' class='raiz'>
                    <div class='raiz__titulo' 
                        onclick='expandir_raiz(\"` + indice.nombre + `\")'>
                        <span class="raiz__texto">` + indice.nombre + `</span>
                        <span class="raiz__equis raiz__equis--oculta"onclick='event.stopPropagation();cerrar_raiz(\"` + indice.nombre + `\")'>X</span>
                    </div>
                    <div class='raiz__contenido'>
                    </div>
                </div>`
            })

            boton__volver = document.getElementById("js-boton__volver")
            boton__recargar = document.getElementById("js-boton__recargar")
            boton_alternar_modo_fondo = document.getElementById("js-boton__alternar-modo-fondo")

            boton__volver.onclick = cargar_vista_bienvenida
            boton__recargar.onclick = cargar_vista_panel_de_control
            boton_alternar_modo_fondo.onclick = alternar_modo_fondo
        }
    }

    peticion_configuracion.onreadystatechange = function () {
        if (peticion_configuracion.readyState == 4 && peticion_configuracion.status == 200) {
            CONFIGURACION = JSON.parse(peticion_configuracion.responseText)
        }
    }

    peticion_indices.open("GET", "_indices", true)
    peticion_configuracion.open("GET", "_configuracion", true)

    peticion_indices.send();
    peticion_configuracion.send();

}

function valor_de_configuracion(parametro) {
    encontrado = null
    CONFIGURACION.forEach(parametro_en_config => {
        if (parametro == parametro_en_config.nombre_campo) {
            encontrado = parametro_en_config.valor
        }
    })
    return encontrado
}

function expandir_raiz(raiz) {
    raiz_div = document.getElementById(raiz)
    equis = raiz_div.getElementsByClassName('raiz__equis')[0]
    equis.className = "raiz__equis"
    contenido = raiz_div.getElementsByClassName('raiz__contenido')[0]
    html = ""

    peticion_contenido = new XMLHttpRequest()

    peticion_contenido.onreadystatechange = function () {
        if (peticion_contenido.readyState == 4 && peticion_contenido.status == 200) {
            json = JSON.parse(peticion_contenido.responseText)
            json.forEach(registro => {

                html += '<div class="registro"><div class="registro__cabecera">'

                if (valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO') in registro) {
                    html += '<span class="registro__id" >' + HtmlEncode(valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')) + " : " + HtmlEncode(registro[valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')]) + '</span>'
                }

                html += '<span class="registro__editar" onclick="abrir_modal(this)">Editar</span></div><table class="registro__atributos">'

                Object.keys(registro).forEach(clave => {

                    if (clave != valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')) {
                        html += '<tr class="atributo"><td class="atributo__titulo">'
                        html += HtmlEncode(clave) + '</td> <td class="atributo__valor">' + HtmlEncode(registro[clave])
                        html += "</td></tr>"
                    }

                })

                html += '</table></div>'
            })

            contenido.innerHTML = html
        }
    }

    peticion_contenido.open("GET", raiz, true)
    peticion_contenido.send();
}

function cerrar_raiz(raiz) {
    raiz_div = document.getElementById(raiz)
    equis = raiz_div.getElementsByClassName('raiz__equis')[0]
    equis.className = "raiz__equis raiz__equis--oculta"
    contenido = raiz_div.getElementsByClassName('raiz__contenido')[0]
    contenido.innerHTML = ""
}

function HtmlEncode(s) {
    // https://stackoverflow.com/questions/784586/convert-special-characters-to-html-in-javascript
    // Basicamente crea un div, le inserta la string a codificar, y la recupera, y el propio html la devuelve codificada
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

function abrir_modal(evento) {
    body = document.getElementsByTagName("body")[0]
    body.innerHTML += 
    `<div id="modal" class="modal" onclick="cerrar_modal()">
        <div class="modal__contenido" onclick="event.stopPropagation()">
            <div class="modal__equis">X</div>
            <div class="modal__boton-guardar">Guardar</div>
            // TODO CONTENIDO DEL MODAL
        </div>
    </div>`
}

function cerrar_modal(){
    modal = document.getElementById("modal")
    console.log(modal)
    modal.remove();
}

CONFIGURACION = null
