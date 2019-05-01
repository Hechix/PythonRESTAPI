function abrir_modal(contenido, callback = false) {

    body = document.getElementsByTagName("body")[0]
    html =
        `<div id="modal" class="modal" >
            <div class="modal__contenedor">
                <div class="modal__equis" onclick="cerrar_modal()"><i class="fas fa-times"></i></div>`
    if (callback) {
        html += '<div class="modal__boton-guardar" onclick = "' + callback + '"> Guardar</div>'
    }
    html += `<div class="modal__contenido">` + contenido + `</div>
            </div>
        </div>`
    body.innerHTML += html
}

function abrir_modal_edicion_registro(evento) {
    registro = evento.parentNode.parentNode
    raiz = registro.parentNode.parentNode
    id_registro = parseInt(registro.childNodes[0].childNodes[0].innerHTML.split(" : ")[1])
    modal_preparar_edicion(raiz, id_registro)
}

function modal_preparar_edicion(raiz, id_registro) {
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

    abrir_modal(html, 'guardar_modal(this)')
    RAIZ_DEL_MODAL = raiz.id
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
            <i onclick="eliminar_campo_modal(this)" class="fas fa-trash"></i>
        </td>`

    campo_insertado.className = "atributo"
}

function eliminar_campo_modal(evento){
    evento.parentElement.parentElement.remove()
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

function cerrar_modal() {
    modal = document.getElementById("modal")
    modal.remove();
    RAIZ_DEL_MODAL = undefined
}