function cargar_vista_panel_de_control() {
    var html =
        `<div class="botones-horizontales">
            <button id="js-boton__volver" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_bienvenida()"><i class="fas fa-home"></i></button>
            <button id="js-boton__recargar" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_panel_de_control()"><i class="fas fa-sync"></i></button>
            <button id="js-boton__alternar-modo-fondo" class="boton boton--pequeño boton--no-estirado" onclick="alternar_modo_fondo()">@@@@@</button>
            <span class="botones-horizontales__titulo">Administración de Registros</span>
        </div>`

    if (document.getElementsByTagName("body")[0].className == "") {
        html = html.replace("@@@@@", '<i class="fas fa-lightbulb"></i>')
        html = html.replace('class="botones-horizontales__titulo"','class="botones-horizontales__titulo botones-horizontales__titulo--oscuro"')
    } else {
        html = html.replace("@@@@@", '<i class="far fa-lightbulb"></i>')
    }

    var principal = document.getElementById("js-principal")
    principal.innerHTML = html

    var peticion_raices = new XMLHttpRequest()
    var peticion_configuracion = new XMLHttpRequest()

    peticion_raices.onreadystatechange = function () {
        if (peticion_raices.readyState == 4 && peticion_raices.status == 200) {
            var json = JSON.parse(peticion_raices.responseText)
            json.forEach(raiz => {
                raiz.registros = []
                RAICES.push(raiz)
                principal.innerHTML +=
                    `<div id='` + raiz.nombre + `' class='raiz'>
                    <div class='raiz__titulo' 
                        onclick='expandir_raiz(\"` + raiz.nombre + `\")'>
                        <span class="raiz__texto">` + raiz.nombre + `</span>
                        <span class="raiz_desplegable"><i class="fas fa-caret-down"></i></span>
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
    if (ATRIBUTO_PRIMARIO) {
        return ATRIBUTO_PRIMARIO
    }
    CONFIGURACION.forEach(parametro_en_config => {
        if (parametro == parametro_en_config.nombre_campo) {
            ATRIBUTO_PRIMARIO = parametro_en_config.valor
        }
    })
    return ATRIBUTO_PRIMARIO
}

function expandir_raiz(raiz, callback = false, callback_parametro = undefined) {
    var raiz_div = document.getElementById(raiz)
    var equis = raiz_div.getElementsByClassName('raiz__equis')[0]
    var desplegable = raiz_div.getElementsByClassName('raiz_desplegable')[0]
    equis.className = "raiz__equis"
    desplegable.className = "raiz_desplegable raiz_desplegable--oculto"
    contenido = raiz_div.getElementsByClassName('raiz__contenido')[0]
    var html = ""

    var peticion_contenido = new XMLHttpRequest()

    peticion_contenido.onreadystatechange = function () {
        if (peticion_contenido.readyState == 4 && peticion_contenido.status == 200) {
            var json = JSON.parse(peticion_contenido.responseText)
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

                if (valor_de_configuracion('ATRIBUTO_PRIMARIO') in registro) {
                    html += '<span class="registro__id" >' + HtmlEncode(valor_de_configuracion('ATRIBUTO_PRIMARIO')) + " : " + HtmlEncode(registro[valor_de_configuracion('ATRIBUTO_PRIMARIO')]) + '</span>'
                }

                html += `<span class="registro__editar" onclick="abrir_modal_edicion_registro(this)"><i class="far fa-edit"></i></span>
                        <span class="registro__eliminar" onclick="eliminar_registro(this)"><i class="fas fa-trash"></i></span>
                        </div>
                        <table class="registro__atributos">`

                Object.keys(registro).forEach(clave => {

                    if (clave != valor_de_configuracion('ATRIBUTO_PRIMARIO')) {
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
    desplegable = raiz_div.getElementsByClassName('raiz_desplegable')[0]
    equis.className = "raiz__equis raiz__equis--oculta"
    desplegable.className = "raiz_desplegable"
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
    id_registro = registro.getElementsByClassName("registro__id")[0].innerHTML.split(" : ")[1]

    modal = {
        contenido: "¿Eliminar " + raiz.id + " / " + id_registro + "?",
        callback: 'cerrar_modal()',
        callback_texto: 'Cancelar',
        callback_tipo: 'verde',
        callback_secundario: "confirmar_eliminar_registro()",
        callback_secundario_texto: 'Eliminar',
        callback_secundario_tipo: 'rojo'
    }

    EDICION = {
        raiz_id: raiz.id,
        registro_id: id_registro
    }

    abrir_modal(modal)
}

function confirmar_eliminar_registro() {

    peticion_delete = new XMLHttpRequest()
    peticion_delete.onreadystatechange = function () {
        if (peticion_delete.readyState == 4) {
            switch (peticion_delete.status) {
                case 200:
                    notificacion(contenido = "Registro eliminado correctamente!", tipo = "conseguido")
                    expandir_raiz(EDICION.raiz_id)
                    cerrar_modal()
                    break;

                case 404:
                    notificacion(contenido = "El registro no existe (404)", tipo = "error")
                    break;
                default:
                    notificacion(contenido = "Error eliminando (" + peticion_delete.responseText + ")", tipo = "error")
            }
        }
    }


    peticion_delete.open("DELETE", EDICION.raiz_id + "/" + EDICION.registro_id, true)
    peticion_delete.send();

}

function añadir_registro(evento) {

    raiz = evento.parentNode.parentNode.parentNode
    html =
        `<p class="modal__titulo">
            Creando nuevo registro en ` + raiz.id + `
        </p>
        <p class="modal__subtitulo">
            Nuevo identificador (` + ATRIBUTO_PRIMARIO + `):
        </p>
        <input id="js-nuevo-id" type="text">`

    EDICION = {
        raiz_id: raiz.id
    }

    modal = {
        contenido: html,
        callback: "confirmar_nuevo_registro()",
        callback_tipo: "azul",
        callback_texto: "Guardar"
    }

    abrir_modal(modal)

}

function confirmar_nuevo_registro() {
    id = document.getElementById("js-nuevo-id").value.trim()
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
                    expandir_raiz(EDICION.raiz_id, callback = auto_editar_nuevo_registro, callback_parametro = id)
                    break;

                default:
                    notificacion(contenido = "Error creando (" + peticion_post.responseText + ")", tipo = "error")
            }
        }
    }

    peticion_post.open("POST", EDICION.raiz_id, true)
    peticion_post.send('{"' + ATRIBUTO_PRIMARIO + '":"' + id + '"}');
}

function auto_editar_nuevo_registro(id) {
    raiz = document.getElementById(EDICION.raiz_id)

    cerrar_modal()

    EDICION = {
        raiz_id: raiz.id,
        registro_id: id
    }

    modal_preparar_edicion(raiz, id)

    añadir_nuevo = document.getElementById("js-añadir-atributo")
    añadir_nuevo.click()
    añadir_nuevo.click()
    añadir_nuevo.click()
}