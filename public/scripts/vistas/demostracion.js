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

    recuperar_posts_demostracion()
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

    peticion_posts.onreadystatechange = function () {
        if (peticion_posts.readyState == 4 && peticion_posts.status == 200) {
            var json = JSON.parse(peticion_posts.responseText)
            json.forEach(post => {
                var html =
                `<div class="demo-post">
                    <div class="demo-post__">
                    </div>
                </div>`
            })
        }
    }

    // id="post-`+post.id+`"

    peticion_posts.open("GET", "posts", true)

    peticion_posts.send();  

}