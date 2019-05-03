function cargar_vista_demostracion(){
    ANIMACION_FONDO = undefined
    var html = 
    `<div class="demo">
        <div class="demo-boton demo-boton__salir" onclick="inicializacion()"><i class="fas fa-home"></i></div>
        <div class="demo-boton demo-boton__info" onclick="ver_informacion_demostracion()"><i class="fas fa-exclamation"></i></div>
        <div class="demo-titulo-general">Hechix's Foro</div>
        <div id="js-contenido-general" class="demo-contenido-general"></div>
    </div>`
    var body = document.getElementsByTagName("body")[0]
    body.className = ""
    body.innerHTML = html

    //recuperar_posts_demostracion()
}

function ver_informacion_demostracion(){
    var modal = {
        contenido:
        `<h1>Aviso:</h1>
        Este foro de demostración está pensado para ser usado con la base de datos por defecto.<br>
        Los cambios en los datos aparecerán, pero si se modifica su estructura la demostración se rompe :(`
    }
    abrir_modal(modal)
}

function recuperar_posts_demostracion(){
    
    var peticion_posts = new XMLHttpRequest()

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