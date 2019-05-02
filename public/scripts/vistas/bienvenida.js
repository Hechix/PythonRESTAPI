function cargar_vista_bienvenida() {
    html =
        `<div id="js-titulo" class="titulo titulo--oscuro">
            <div class="titulo titulo__superior">
                <span class="hechix">
                    HECHIX'S
                </span>
                <span class="python">
                    Python
                </span></div>
            <div class="titulo titulo__inferior">
                <div class="rest-api">
                    REST API
                </div>
            </div>
        </div>
        <div class="cuerpo">
            <div class="botones">
                <div class="botones__superiores">
                    <button class="boton boton--enlace" onclick="cargar_vista_panel_de_control()">Empezar</button>
                </div>
                <div class="botones__inferiores">
                    <a class="boton boton--pequeño boton--enlace"
                        href="https://github.com/Hechix/PythonRESTAPI" target="_blank">Github</a>
                    <button  id="js-boton__alternar-modo-fondo" class="boton boton--pequeño boton--no-estirado" onclick="alternar_modo_fondo()">@@@@@</button>
                </div>
            </div>
        </div>`

    if (document.getElementsByTagName("body")[0].className == "") {
        html = html.replace("@@@@@", '<i class="fas fa-lightbulb"></i>')
    } else {
        html = html.replace("@@@@@", '<i class="far fa-lightbulb"></i>')
    }

    principal = document.getElementById("js-principal")
    principal.innerHTML = html

}