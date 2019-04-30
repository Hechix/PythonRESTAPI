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
                <button id="js-boton__empezar" class="boton boton--enlace">Empezar</button>
            </div>
            <div class="botones__inferiores">
                <a class="boton boton--pequeño boton--enlace"
                    href="https://github.com/Hechix/PythonRESTAPI">Github</a>
                <button id="js-boton__alternar-modo-fondo" class="boton boton--pequeño">Modo
                    claro</button>
            </div>
        </div>
    </div>`

    principal = document.getElementById("js-principal")
    principal.innerHTML = html

    boton_empezar = document.getElementById("js-boton__empezar")
    boton_alternar_modo_fondo = document.getElementById("js-boton__alternar-modo-fondo")
    boton_empezar.onclick = cargar_vista_panel_de_control
    boton_alternar_modo_fondo.onclick = alternar_modo_fondo
}