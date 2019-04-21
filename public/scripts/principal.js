function alternar_modo_fondo() {
    body = document.getElementsByTagName("body")[0]
    titulo = document.getElementById("js-titulo")

    boton_alternar_modo_fondo = document.getElementById("js-boton__alternar-modo-fondo")

    if (body.className == "") {
        body.className = "body-oscuro"
        fondo.className = "fondo fondo--oscuro"
        boton_alternar_modo_fondo.innerHTML = "Modo claro"
        if (titulo) {
            titulo.className = "titulo titulo--oscuro"
        }

    } else {
        body.className = ""
        fondo.className = "fondo"
        boton_alternar_modo_fondo.innerHTML = "Modo oscuro"
        if (titulo) {
            titulo.className = "titulo"
        }
    }
}


cargar_vista_bienvenida()