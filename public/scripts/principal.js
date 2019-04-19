function alternar_modo_fondo() {
    body = document.getElementsByTagName("body")[0]
    titulo = document.getElementById("js-titulo")
    fondo = document.getElementById("js-fondo")
    boton_alternar_modo_fondo = document.getElementById("boton__alternar-modo-fondo")

    if (body.className == "") {
        body.className = "body-oscuro"
        fondo.className = "fondo fondo--oscuro"
        titulo.className = "titulo titulo--oscuro"
        boton_alternar_modo_fondo.innerHTML = "Modo claro"
    } else {
        body.className = ""
        fondo.className = "fondo"
        titulo.className = "titulo"
        boton_alternar_modo_fondo.innerHTML = "Modo oscuro"
    }
}

boton_alternar_modo_fondo = document.getElementById("boton__alternar-modo-fondo")
boton_alternar_modo_fondo.onclick = alternar_modo_fondo