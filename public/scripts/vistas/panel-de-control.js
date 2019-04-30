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

    peticion_raices = new XMLHttpRequest()
    peticion_configuracion = new XMLHttpRequest()

    peticion_raices.onreadystatechange = function () {
        if (peticion_raices.readyState == 4 && peticion_raices.status == 200) {
            json = JSON.parse(peticion_raices.responseText)
            json.forEach(raiz => {
                raiz.registros = []
                RAICES.push(raiz)
                principal.innerHTML +=
                    `<div id='` + raiz.nombre + `' class='raiz'>
                    <div class='raiz__titulo' 
                        onclick='expandir_raiz(\"` + raiz.nombre + `\")'>
                        <span class="raiz__texto">` + raiz.nombre + `</span>
                        <span class="raiz__equis raiz__equis--oculta"onclick='event.stopPropagation();cerrar_raiz(\"` + raiz.nombre + `\")'>X</span>
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

    peticion_raices.open("GET", "_raices", true)
    peticion_configuracion.open("GET", "_configuracion", true)

    peticion_raices.send();
    peticion_configuracion.send();

}

function valor_de_configuracion(parametro) {
    if (JSON_ATRIBUTO_PRIMARIO) {
        return JSON_ATRIBUTO_PRIMARIO
    }
    CONFIGURACION.forEach(parametro_en_config => {
        if (parametro == parametro_en_config.nombre_campo) {
            JSON_ATRIBUTO_PRIMARIO = parametro_en_config.valor
        }
    })
    return JSON_ATRIBUTO_PRIMARIO
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
            RAICES.forEach(raiz_almacenada => {
                if (raiz_almacenada.nombre == raiz) {
                    raiz_almacenada.registros = json
                }
            })
            json.forEach(registro => {

                html += '<div class="registro"><div class="registro__cabecera">'

                if (valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO') in registro) {
                    html += '<span class="registro__id" >' + HtmlEncode(valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')) + " : " + HtmlEncode(registro[valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')]) + '</span>'
                }

                html += '<span class="registro__editar" onclick="abrir_modal(this)">Editar</span></div><table class="registro__atributos">'

                Object.keys(registro).forEach(clave => {

                    if (clave != valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')) {
                        html += '<tr class="atributo"><td class="atributo__titulo">'
                        html += HtmlEncode(clave) + '</td><td class="atributo__valor">' + HtmlEncode(registro[clave])
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
    RAICES.forEach(raiz_almacenada => {
        if (raiz_almacenada.nombre == raiz) {
            raiz_almacenada.registros = []
        }
    })
}

function abrir_modal(evento) {
    registro = evento.parentNode.parentNode
    raiz = registro.parentNode.parentNode
    id_registro = parseInt(registro.childNodes[0].childNodes[0].innerHTML.split(" : ")[1])

    num_raiz = undefined
    num_registro = undefined

    for (x = 0; x < RAICES.length; x++) {

        if (RAICES[x].nombre == raiz.id) {
            num_raiz = x

            for (y = 0; y < RAICES[x].registros.length; y++) {

                if (RAICES[x].registros[y].id == id_registro) {
                    num_registro = y
                    break
                }

            }
            break
        }
    }

    html = "<table>"

    Object.keys(RAICES[num_raiz].registros[num_registro]).forEach(clave => {
        if (clave == valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')) {
            html +=
                `<tr class="atributo">
                    <td class="atributo__titulo js-clave">` + clave + `</td>
                    <td class="atributo__valor js-valor">`+ RAICES[num_raiz].registros[num_registro][clave] + `</td>
                    <td class="atributo__clave">
                        <i title="Clave Primaria" class="fas fa-key"></i>
                    </td>
                </tr>`
        } else {
            html +=
                `<tr class="atributo">
                    <td class="atributo__titulo">
                        <input class="js-titulo" type="text" value="` + clave + `">
                    </td>
                    <td class="atributo__valor">
                        <textarea rows="1"class="atributo__edicion js-valor">`+ RAICES[num_raiz].registros[num_registro][clave] + `</textarea>
                    </td>
                    <td class="atributo__eliminacion">
                        <i class="fas fa-trash"></i>
                    </td>
                </tr>`
        }
    })

    html +=
        `   <tr>
            <td colspan="3" class="atributo__agregar">
                <i onclick="añadir_campo_modal(this)" class="fas fa-plus-circle"></i>
            </td>
        </tr>
    </table>`

    body = document.getElementsByTagName("body")[0]
    body.innerHTML +=
        `<div id="modal" class="modal" >
            <div class="modal__contenedor">
                <div class="modal__equis" onclick="cerrar_modal()"><i class="fas fa-times"></i></div>
                <div class="modal__boton-guardar" onclick="guardar_modal(this)">Guardar</div>
                <div class="modal__contenido">`+ html + `</div>
            </div>
        </div>`

    RAIZ_DEL_MODAL = raiz.id
}

function cerrar_modal() {
    modal = document.getElementById("modal")
    modal.remove();
    RAIZ_DEL_MODAL = undefined
}

function guardar_modal(evento) {

    atributos = evento.parentElement.getElementsByClassName("modal__contenido")[0].getElementsByClassName("atributo")
    registro = {}
    id_registro = undefined

    for (atributo of atributos) {
        titulo = atributo.getElementsByClassName("atributo__titulo")[0]

        if (titulo.classList.contains('js-clave')) {
            titulo = titulo.innerHTML
            valor = atributo.getElementsByClassName("js-valor")[0].innerHTML
            id_registro = valor
        } else {
            titulo = titulo.getElementsByClassName("js-titulo")[0].value
            valor = atributo.getElementsByClassName("js-valor")[0].value
        }

        registro[titulo] = valor
    }
    peticion_put = new XMLHttpRequest()

    peticion_put.onreadystatechange = function () {
        if (peticion_put.readyState == 4) {
            switch (peticion_put.status) {
                case 200:
                    notificacion(contenido = "Registro actualizado correctamente!", tipo = "conseguido")
                    expandir_raiz(RAIZ_DEL_MODAL)
                    cerrar_modal()
                    break;

                case 404:
                    notificacion(contenido = "El registro no existe (404)", tipo = "error")
                    break;
                default:
                    notificacion(contenido = "Error actualizando (" + peticion_put.status + ")", tipo = "error")
            }
        }
    }

    peticion_put.open("PUT", RAIZ_DEL_MODAL + "/" + id_registro, true)
    peticion_put.send(JSON.stringify(registro));

}

function añadir_campo_modal(evento) {
    tr_añadir = evento.parentElement.parentElement
    nuevo_campo = document.createElement("tr")
    campo_insertado = tr_añadir.parentElement.insertBefore(nuevo_campo, tr_añadir)

    clave_aleatoria = string_aleatoria(5);

    campo_insertado.innerHTML =
        `<td class="atributo__titulo">
            <input class="js-titulo" type="text" value="nuevo_` + clave_aleatoria + `">
        </td>
        <td class="atributo__valor">
            <textarea rows="1"class="atributo__edicion js-valor"></textarea>
        </td>
        <td class="atributo__eliminacion">
            <i class="fas fa-trash"></i>
        </td>`

    campo_insertado.className = "atributo"
}

function notificacion(contenido = undefined, tipo = "info") {
    if (contenido) {
        noti_actual = document.getElementById("notificacion")

        if (noti_actual) {
            noti_actual.remove()
        }

        body = document.getElementsByTagName("body")[0]
        body.innerHTML +=
            `<div id="notificacion" class="notificacion notificacion--` + tipo + `">
                <div class="notificacion__contenido">
                    <div class="notificacion__barra"></div>
                    `+ contenido + `
                </div>
            </div>`
    }
    else {
        console.error("Se ha intentado invocar una notificacion sin contenido")
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

CONFIGURACION = undefined
JSON_ATRIBUTO_PRIMARIO = undefined
RAICES = []
RAIZ_DEL_MODAL = undefined