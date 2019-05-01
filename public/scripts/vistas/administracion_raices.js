function cargar_vista_admin_raices() {
    // TOOD CAMBIAR A FONT-AWESOME
    html =
        `<div class="botones-horizontales">
            <button id="js-boton__volver" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_bienvenida()">Volver</button>
            <button id="js-boton__recargar" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_admin_raices()">Recargar</button>
            <button id="js-boton__admin_raices" class="boton boton--pequeño boton--no-estirado" onclick="cargar_vista_panel_de_control()">Administrar raices</button>
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


    peticion_raices.open("GET", "_raices", true)

    peticion_raices.send();
}