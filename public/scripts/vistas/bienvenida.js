function cargar_vista_bienvenida() {
    var html =
        `<div>
            <div id="js-titulo-superior" class="titulo titulo__superior">
                <span class="hechix">
                    HECHIX'S
                </span>
                <span class="python">
                    Python
                </span></div>
            <div id="js-titulo-inferior" class="titulo titulo__inferior">
                <div class="rest-api">
                    REST API
                </div>
            </div>
        </div>
        <div class="cuerpo">
            <div class="botones">
                <div class="botones__superiores">
                    <button class="boton boton--enlace" onclick="cargar_vista_panel_de_control()">Panel de control</button>
                    <button class="boton boton--enlace" onclick="cargar_vista_panel_de_control()">Demostración</button>
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
        html = html.replace('class="titulo titulo__superior"','class="titulo titulo__superior titulo--oscuro"')
        html = html.replace('class="titulo titulo__inferior"','class="titulo titulo__inferior titulo--oscuro"')
    } else {
        html = html.replace("@@@@@", '<i class="far fa-lightbulb"></i>')
    }

    var principal = document.getElementById("js-principal")
    principal.innerHTML = html

}