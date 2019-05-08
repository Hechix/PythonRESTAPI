function cargar_vista_admin_raices() {
    var html =
        `<div class="botones-horizontales">
        <button id="js-boton__volver" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_bienvenida()"><i class="fas fa-arrow-circle-left"></i></button>
        <button id="js-boton__recargar" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_panel_de_control()"><i class="fas fa-sync"></i></button>
        <button id="js-boton__alternar-modo-fondo" class="boton boton--pequeño boton--no-estirado" onclick="alternar_modo_fondo()">@@@@@</button>
        <button id="js-boton__admin_raices" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_panel_de_control()">Administrar registros</button>
        <span class="botones-horizontales__titulo">Admin. Raices</span>
    </div>`

    if (document.getElementsByTagName("body")[0].className == "") {
        html = html.replace("@@@@@", '<i class="fas fa-lightbulb"></i>')
    } else {
        html = html.replace("@@@@@", '<i class="far fa-lightbulb"></i>')
    }

    var principal = document.getElementById("js-principal")
    principal.innerHTML = html


    var peticion_raices = new XMLHttpRequest()

    peticion_raices.onreadystatechange = function () {
        if (peticion_raices.readyState == 4 && peticion_raices.status == 200) {
            var json = JSON.parse(peticion_raices.responseText)
            var html =
                `<div class="raiz">
                    <table class="tabla-raices">
                                <thead>
                                    <td class="tabla-raices__cabecera">Nombre</td>
                                    <td class="tabla-raices__cabecera">Cantidad de registros</td>
                                </thead>`

            json.forEach(raiz => {
                html +=
                    `<tr>
                        <td class="tabla-raices__contenido">` + raiz.nombre + `</td>
                        <td class="tabla-raices__contenido">` + raiz.cantidad_registros + `</td>
                        <td class="tabla-raices__contenedor-iconos">
                            <span class="tabla-raices__editar"><i class="fas fa-edit tabla-raices__icono"></i></span>
                            <span class="tabla-raices__borrar"><i class="fas fa-trash tabla-raices__icono"></i></span>
                        </td>
                    </tr>`
            })

            html +=
                `   </table>
                    <div class="registro__centrar-externo ">
                        <i class="fas fa-plus-circle registro__centrar-interno registro__agregar "></i>
                    </div>
                </div>`
            principal.innerHTML += html
        }
    }


    peticion_raices.open("GET", "_raices", true)

    peticion_raices.send();
}