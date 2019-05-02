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
                    <button class="boton boton--pequeño" onclick="alternar_modo_fondo()">Modo claro</button>
                </div>
            </div>
        </div>`

    principal = document.getElementById("js-principal")
    principal.innerHTML = html

}