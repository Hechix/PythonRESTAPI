TEXTO =
    `<i class="fas fa-arrow-left"></i> GET /
<i class="fas fa-arrow-right"></i> 200 index.html
<i class="fas fa-arrow-left"></i> GET /public/css/estilo_fondo.css
<i class="fas fa-arrow-left"></i> GET /public/css/estilo.css
<i class="fas fa-arrow-right"></i> 200 estilo_fondo.css
<i class="fas fa-arrow-right"></i> 200 estilo.css
<i class="fas fa-arrow-left"></i> GET /public/css/estilo_panel_control.css
<i class="fas fa-arrow-left"></i> GET /public/css/estilo_pagina_bienvenida.css
<i class="fas fa-arrow-left"></i> GET /public/css/estilo_modal.css
<i class="fas fa-arrow-left"></i> GET /public/css/estilo_notificacion.css
<i class="fas fa-arrow-right"></i> 200 estilo_panel_control.css
<i class="fas fa-arrow-right"></i> 200 estilo_pagina_bienvenida.css
<i class="fas fa-arrow-right"></i> 200 estilo_modal.css
<i class="fas fa-arrow-right"></i> 200 estilo_notificacion.css
<i class="fas fa-arrow-left"></i> GET /public/css/estilo_admin_raices.css
<i class="fas fa-arrow-right"></i> 200 estilo_admin_raices.css
<i class="fas fa-arrow-left"></i> GET /public/scripts/componentes/fondo.js
<i class="fas fa-arrow-left"></i> GET /public/scripts/componentes/modal.js
<i class="fas fa-arrow-right"></i> 200 fondo.js
<i class="fas fa-arrow-right"></i> 200 modal.js
<i class="fas fa-arrow-left"></i> GET /public/scripts/componentes/varios.js
<i class="fas fa-arrow-left"></i> GET /public/scripts/vistas/bienvenida.js
<i class="fas fa-arrow-right"></i> 200 varios.js
<i class="fas fa-arrow-right"></i> 200 bienvenida.js
<i class="fas fa-arrow-left"></i> GET /public/scripts/vistas/panel_de_control.js
<i class="fas fa-arrow-left"></i> GET /public/scripts/vistas/administracion_raices.js
<i class="fas fa-arrow-right"></i> 200 panel_de_control.js
<i class="fas fa-arrow-right"></i> 200 administracion_raices.js
<i class="fas fa-arrow-left"></i> GET /public/scripts/globales.js
<i class="fas fa-arrow-right"></i> 200 globales.js`

LINEA_ACTUAL = 0
IP_ALEATORIA = ""

CONFIGURACION = undefined
ATRIBUTO_PRIMARIO = undefined
RAICES = []
EDICION = undefined

function inicializacion() {
    html =
        `<div id="js-fondo" class="fondo fondo--oscuro">
        </div>
        <div id="js-principal" class="principal">
        </div>`

    var body = document.getElementsByTagName("body")[0]
    body.className = "body-oscuro"
    body.innerHTML = html
    
    ANIMACION_FONDO = setInterval(fondo_animado, 240);
    cargar_vista_bienvenida()
}


window.onload = inicializacion;