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
            <boton id="boton__empezar" class="boton boton--enlace boton__empezar">Empezar</boton>
        </div>
        <div class="botones__inferiores">
            <a class="boton boton--pequeño boton--enlace"
                href="https://github.com/Hechix/PythonRESTAPI">Github</a>
            <button id="boton__alternar-modo-fondo" class="boton boton--pequeño boton__alternar-modo-fondo">Modo
                claro</button>
        </div>
    </div>
</div>`

function cargar_vista_bienvenida(){
    principal = document.getElementById("js-principal")
    principal.innerHTML = html
    
boton_alternar_modo_fondo = document.getElementById("boton__alternar-modo-fondo")
boton_alternar_modo_fondo.onclick = alternar_modo_fondo
}