function cargar_demostracion() {

    var peticion_posts = new XMLHttpRequest()

    peticion_posts.onreadystatechange = function () {
        if (peticion_posts.readyState == 4 && peticion_posts.status == 200) {
            var json = JSON.parse(peticion_posts.responseText)
            var contenedor = document.getElementById("js-contenido-general")
            json.forEach(post => {
                if (!USUARIOS_A_RECUPERAR.includes(post.autor)) {
                    USUARIOS_A_RECUPERAR.push(post.autor)
                }
                contenedor.innerHTML +=
                    `<div id="post-` + post.id + `" class="post">
                        <div class="post__imagen-autor" data-imagen-autor="` + post.autor + `">
                        </div>
                        <div class="post__autor" data-autor="` + post.autor + `">
                        </div>
                        <div class="post__cabecera">
                            <div class="cabecera__titulo">
                                ` + post.titulo + `
                            </div>
                            <div class="cabecera__fecha">
                                ` + post.fecha + ` ` + post.hora + `
                            </div>
                        </div>
                        <div class="post__contenido">
                            <div class="post__contenido-interno">
                            ` + post.contenido + `
                            </div>
                        </div>
                        <div class="post__comentarios">
                        </div>
                    </div>`
                descargar_comentarios(post.id)
            })
        }
    }

    peticion_posts.open("GET", "/posts", true)
    peticion_posts.send();

}

function descargar_comentarios(id) {
    var div_comentarios = document.getElementById("post-"+id).getElementsByClassName("post__comentarios")[0]
    var peticion_comentarios = new XMLHttpRequest()
    peticion_comentarios.onreadystatechange = function () {
        if (peticion_comentarios.readyState == 4 && peticion_comentarios.status == 200) {
            var json = JSON.parse(peticion_comentarios.responseText)
            console.log(json)
            json.forEach(comentario=>{
                if (!USUARIOS_A_RECUPERAR.includes(comentario.autor)) {
                    USUARIOS_A_RECUPERAR.push(comentario.autor)
                }
                div_comentarios.innerHTML +=
                    `<div id="comen-` + comentario.id + `" class="comentario">
                        <div class="comentario__imagen-autor" data-imagen-autor="` + comentario.autor + `">
                        </div>
                        <div class="comentario__autor" data-autor="` + comentario.autor + `">
                        </div>
                        <div class="comentario__fecha">
                            ` + comentario.fecha + ` ` + comentario.hora + `
                        </div>
                        <div class="comentario__contenido">
                            <div class="comentario__contenido-interno">
                            ` + comentario.contenido + `
                            </div>
                        </div>
                    </div>`
            })
            descargar_usuarios()
        }
    }
    peticion_comentarios.open("GET", "/comentarios?postId=" + id, true)
    peticion_comentarios.send();

}

function descargar_usuarios() {
    USUARIOS_A_RECUPERAR.forEach(usuario => {
        var peticion_usuarios = new XMLHttpRequest()

        peticion_usuarios.onreadystatechange = function () {
            if (peticion_usuarios.readyState == 4 && peticion_usuarios.status == 200) {
                var json = JSON.parse(peticion_usuarios.responseText)

                var imagenes_de_este_usuario = document.querySelectorAll('[data-imagen-autor]')
                imagenes_de_este_usuario.forEach(imagen => {
                    if (imagen.dataset["imagenAutor"] == usuario.toString()){
                        imagen.innerHTML = '<img class="x__imagen-autor-interno" src="imgs/' + json.foto + '"></img>'
                    }
                })

                var nombres_de_este_usuario = document.querySelectorAll('[data-autor]')
                nombres_de_este_usuario.forEach(nombre => {
                    if (nombre.dataset["autor"] == usuario.toString()){
                    nombre.innerHTML = json.nombre
                    }
                })

            }
        }
        peticion_usuarios.open("GET", "/usuarios/" + usuario, true)
        peticion_usuarios.send();
    })
}

function ver_informacion_demostracion() {
    var modal = {
        contenido: `<h1>Aviso:</h1>
        Este foro de demostración está pensado para ser usado con la base de datos por defecto.<br>
        Los cambios en los datos aparecerán, pero si se modifica su estructura la demostración se rompe :(`
    }
    abrir_modal(modal)
}

USUARIOS_A_RECUPERAR = []
window.onload = cargar_demostracion