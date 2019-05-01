function cargar_vista_panel_de_control() {
    html =
        `<div class="botones-horizontales">
            <button id="js-boton__volver" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_bienvenida()">Volver</button>
            <button id="js-boton__recargar" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_panel_de_control()">Recargar</button>
            <button id="js-boton__alternar-modo-fondo" class="boton boton--pequeño boton--no-estirado" onclick="alternar_modo_fondo()">@@@@@</button>
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
                        <span class="raiz__equis raiz__equis--oculta"onclick='event.stopPropagation();cerrar_raiz(\"` + raiz.nombre + `\")'><i class="fas fa-times"></i></span>
                    </div>
                    <div class='raiz__contenido'>
                    </div>
                </div>`
            })
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

function expandir_raiz(raiz, callback = false, callback_parametro = undefined) {
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
            if (json.length < 1) {
                html = `<div class="registro__centrar-externo">
                            <div class="registro__centrar-interno">Sin datos</div>
                        </div>`
            }
            json.forEach(registro => {

                html += '<div class="registro"><div class="registro__cabecera">'

                if (valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO') in registro) {
                    html += '<span class="registro__id" >' + HtmlEncode(valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')) + " : " + HtmlEncode(registro[valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')]) + '</span>'
                }

                html += `<span class="registro__editar" onclick="abrir_modal_edicion_registro(this)">Editar</span>
                        <span class="registro__eliminar" onclick="eliminar_registro(this)"><i class="fas fa-trash"></i></span>
                        </div>
                        <table class="registro__atributos">`

                Object.keys(registro).forEach(clave => {

                    if (clave != valor_de_configuracion('JSON_ATRIBUTO_PRIMARIO')) {
                        html += '<tr class="atributo"><td class="atributo__titulo">'
                        html += HtmlEncode(clave) + '</td><td class="atributo__valor">' + HtmlEncode(registro[clave])
                        html += "</td></tr>"
                    }

                })

                html += '</table></div>'
            })

            html += `<div class="registro__centrar-externo">
                        <i onclick="añadir_registro(this)" class="fas fa-plus-circle registro__centrar-interno registro__agregar"></i>
                    </div>`

            contenido.innerHTML = html

            if (callback) {
                callback(callback_parametro)
            }
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

function eliminar_registro(evento) {

    registro = evento.parentNode.parentNode
    raiz = registro.parentNode.parentNode
    // TODO CONFIRMACION
    id_registro = parseInt(registro.childNodes[0].childNodes[0].innerHTML.split(" : ")[1])

    peticion_delete = new XMLHttpRequest()
    peticion_delete.onreadystatechange = function () {
        if (peticion_delete.readyState == 4) {
            switch (peticion_delete.status) {
                case 200:
                    notificacion(contenido = "Registro eliminado correctamente!", tipo = "conseguido")
                    expandir_raiz(raiz.id)
                    break;

                case 404:
                    notificacion(contenido = "El registro no existe (404)", tipo = "error")
                    break;
                default:
                    notificacion(contenido = "Error eliminando (" + peticion_delete.status + ")", tipo = "error")
            }
        }
    }

    peticion_delete.open("DELETE", raiz.id + "/" + id_registro, true)
    peticion_delete.send();
}

function añadir_registro(evento) {

    raiz = evento.parentNode.parentNode.parentNode
    html =
        `<p class="modal__titulo">
        Creando nuevo registro en ` + raiz.id + `
    </p>
    <p class="modal__subtitulo">
        Nuevo id:
    </p>
    <input id="js-nuevo-id" type="text">`
    RAIZ_DEL_MODAL = raiz.id
    abrir_modal(html, "confirmar_nuevo_registro()")

}

function confirmar_nuevo_registro() {
    id = document.getElementById("js-nuevo-id").value
    if (id.length == 0) {
        notificacion(contenido = "El id está vacio", tipo = "error")
        return
    }

    peticion_post = new XMLHttpRequest()
    peticion_post.onreadystatechange = function () {
        if (peticion_post.readyState == 4) {
            switch (peticion_post.status) {
                case 200:
                    notificacion(contenido = "Registro creado correctamente!", tipo = "conseguido")
                    expandir_raiz(RAIZ_DEL_MODAL, callback = auto_editar_nuevo_registro, callback_parametro = id)
                    break;

                default:
                    notificacion(contenido = "Error creando (" + peticion_post.status + ")", tipo = "error")
            }
        }
    }

    peticion_post.open("POST", RAIZ_DEL_MODAL, true)
    peticion_post.send('{"id":' + id + '}');
}

function auto_editar_nuevo_registro(id) {
    raiz = document.getElementById(RAIZ_DEL_MODAL)
    cerrar_modal()
    modal_preparar_edicion(raiz, id)

    añadir_nuevo = document.getElementById("js-añadir-atributo")
    añadir_nuevo.click()
    añadir_nuevo.click()
    añadir_nuevo.click()
}