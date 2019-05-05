function abrir_modal(modal) {

    var body = document.getElementsByTagName("body")[0]
    var html =
        `<div class="modal" >
            <div class="modal__contenedor">
                <div class="modal__equis" onclick="cerrar_modal()"><i class="fas fa-times"></i></div>
                <div class="modal__botones">`
    if (modal.callback) {
        html += '<div class="modal__boton modal__boton-' + modal.callback_tipo + '" onclick = "' + modal.callback + '">' + modal.callback_texto + '</div>'
    }
    if (modal.callback_secundario) {
        html += '<div class="modal__boton modal__boton-' + modal.callback_secundario_tipo + '" onclick = "' + modal.callback_secundario + '">' + modal.callback_secundario_texto + '</div>'
    }
    html += `</div>
            <div class="modal__contenido">` + modal.contenido + `</div>
            </div>
        </div>`

    if (document.getElementById("notificacion")) {
        borrar_notificacion()
    }

    body.innerHTML += html
}

function abrir_modal_edicion_registro(evento) {
    var registro = evento.parentNode.parentNode
    var raiz = registro.parentNode.parentNode

    if (registro.getElementsByClassName("registro__id").length == 0) {
        notificacion(contenido = "No se puede editar porque no tiene identificador (" + valor_de_configuracion('ATRIBUTO_PRIMARIO') + ")", tipo = "error")
        return
    }

    var id_registro = registro.getElementsByClassName("registro__id")[0].innerHTML.split(" : ")[1]

    EDICION = {
        raiz_id: raiz.id,
        registro_id: id_registro
    }

    modal_preparar_edicion()
}

function modal_preparar_edicion() {
    var num_raiz = undefined
    var num_registro = undefined

    for (x = 0; x < RAICES.length; x++) {

        if (RAICES[x].nombre == EDICION.raiz_id) {
            num_raiz = x

            for (y = 0; y < RAICES[x].registros.length; y++) {

                if (RAICES[x].registros[y][valor_de_configuracion('ATRIBUTO_PRIMARIO')] == EDICION.registro_id) {
                    num_registro = y
                    break
                }

            }
            break
        }
    }

    var html = "<table>"

    Object.keys(RAICES[num_raiz].registros[num_registro]).forEach(clave => {
        if (clave == valor_de_configuracion('ATRIBUTO_PRIMARIO')) {
            html +=
                `<tr class="atributo">
                    <td class="atributo__titulo js-clave">` + clave + `</td>
                    <td class="atributo__valor js-valor">` + RAICES[num_raiz].registros[num_registro][clave] + `</td>
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
                        <textarea rows="1"class="atributo__edicion js-valor">` + RAICES[num_raiz].registros[num_registro][clave] + `</textarea>
                    </td>
                    <td class="atributo__eliminacion">
                        <i  onclick="eliminar_campo_modal(this)" class="fas fa-trash"></i>
                    </td>
                </tr>`
        }
    })

    html +=
        `   <tr>
            <td colspan="3" class="atributo__agregar">
                <i id="js-añadir-atributo" onclick="añadir_campo_modal(this)" class="fas fa-plus-circle"></i>
            </td>
        </tr>
    </table>`

    var modal = {
        contenido: html,
        callback: 'guardar_modal(this)',
        callback_texto: 'Guardar',
        callback_tipo: 'azul'
    }

    abrir_modal(modal)
}

function añadir_campo_modal(evento) {
    var tr_añadir = evento.parentElement.parentElement
    var nuevo_campo = document.createElement("tr")
    var campo_insertado = tr_añadir.parentElement.insertBefore(nuevo_campo, tr_añadir)

    var clave_aleatoria = string_aleatoria(5);

    campo_insertado.innerHTML =
        `<td class="atributo__titulo">
            <input class="js-titulo" type="text" value="nuevo_` + clave_aleatoria + `">
        </td>
        <td class="atributo__valor">
            <textarea rows="1"class="atributo__edicion js-valor"></textarea>
        </td>
        <td class="atributo__eliminacion">
            <i onclick="eliminar_campo_modal(this)" class="fas fa-trash"></i>
        </td>`

    campo_insertado.className = "atributo"
}

function eliminar_campo_modal(evento) {
    var atributo = evento.parentElement.parentElement
    atributo.id = "js-atributo-a-borrar"
    var titulo = atributo.getElementsByClassName("js-titulo")[0].value

    var modal = {
        contenido: "¿Eliminar " + EDICION.raiz_id + " / " + EDICION.registro_id + " / " + titulo + "?",
        callback: 'cerrar_modal()',
        callback_texto: 'Cancelar',
        callback_tipo: 'verde',
        callback_secundario: "confirmar_eliminar_campo_modal()",
        callback_secundario_texto: 'Eliminar',
        callback_secundario_tipo: 'rojo'
    }

    abrir_modal(modal)
}

function confirmar_eliminar_campo_modal() {
    document.getElementById("js-atributo-a-borrar").remove()
    cerrar_modal()
}

function guardar_modal(evento) {

    var atributos = evento.parentElement.parentElement.getElementsByClassName("modal__contenido")[0].getElementsByClassName("atributo")
    var registro = {}
    var id_registro = undefined

    for (var x = 0; x < atributos.length; x++) {
        var atributo = atributos[x]
        var titulo = atributo.getElementsByClassName("atributo__titulo")[0]

        if (titulo.classList.contains('js-clave')) {
            var val_titulo = titulo.innerHTML
            var valor = atributo.getElementsByClassName("js-valor")[0].innerHTML
            id_registro = valor
        } else {
            var val_titulo = titulo.getElementsByClassName("js-titulo")[0].value
            var valor = atributo.getElementsByClassName("js-valor")[0].value
        }

        if (val_titulo in registro) {
            titulo.className += " atributo__repetido"
            return
        }

        registro[val_titulo] = valor
    }
    var peticion_put = new XMLHttpRequest()

    peticion_put.onreadystatechange = function () {
        if (peticion_put.readyState == 4) {
            switch (peticion_put.status) {
                case 200:
                    notificacion(contenido = "Registro actualizado correctamente!", tipo = "conseguido")
                    expandir_raiz(EDICION.raiz_id)
                    cerrar_modal()
                    break;

                case 404:
                    notificacion(contenido = "El registro no existe (404)", tipo = "error")
                    break;
                default:
                    notificacion(contenido = "Error actualizando (" + peticion_put.responseText + ")", tipo = "error")
            }
        }
    }

    peticion_put.open("PUT", EDICION.raiz_id + "/" + id_registro, true)
    peticion_put.send(JSON.stringify(registro));

}

function cerrar_modal() {
    var modales = document.getElementsByClassName("modal")
    var modal = modales[modales.length - 1]
    modal.remove();

    if (modales.length == 0) {
        EDICION = undefined
    }
}