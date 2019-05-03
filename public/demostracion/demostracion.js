function cargar_demostracion() {

    var peticion_posts = new XMLHttpRequest()

    peticion_posts.onreadystatechange = function () {
        if (peticion_posts.readyState == 4 && peticion_posts.status == 200) {
            var json = JSON.parse(peticion_posts.responseText)
            var contenedor = document.getElementById("js-contenido-general")
            json.forEach(post => {
                var html =
                    `<div class="demo-post">
                        <div class="demo-post__cabecera">
                            <div class="demo-cabecera__imagen-autor">
                                <img class="demo-cabecera__imagen-autor-interno" src="hechix.jpg">
                            </div>
                            <span class="demo-cabecera__item demo-cabecera__autor">
                                Hechix
                            </span>
                            <span class="demo-cabecera__item demo-cabecera__titulo">
                                `+post.titulo+`
                            </span>
                            <span class="demo-cabecera__item demo-cabecera__fecha">
                                `+post.fecha+` `+post.hora+`
                            </span>
                        </div>
                        <div class="demo-post__contenido">
                        </div>
                    </div>`
                contenedor.innerHTML += html
            })
        }
    }

    // id="post-`+post.id+`"

    peticion_posts.open("GET", "/posts", true)

    peticion_posts.send();

}

function ver_informacion_demostracion() {
    var modal = {
        contenido: `<h1>Aviso:</h1>
        Este foro de demostración está pensado para ser usado con la base de datos por defecto.<br>
        Los cambios en los datos aparecerán, pero si se modifica su estructura la demostración se rompe :(`
    }
    abrir_modal(modal)
}

window.onload = cargar_demostracion