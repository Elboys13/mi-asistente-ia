window.onload = () => {
    // Asegúrate de que estos nombres coincidan con los IDs de tu HTML
const btnMenu = document.getElementById('menu-toggle');
const barraLateral = document.getElementById('barra-lateral');
const pantallaChat = document.getElementById('pantalla');

if (btnMenu && barraLateral) {
    btnMenu.onclick = (e) => {
        // Esto evita que el clic se propague a otros elementos
        e.stopPropagation();
        // Agregamos o quitamos la clase "abierta"
        barraLateral.classList.toggle('abierta');
        console.log("Menú clickeado"); // Esto es para que veas en la consola si funciona
    };

    // Si el usuario toca el chat mientras el menú está abierto, que se cierre solo
    pantallaChat.onclick = () => {
        if (barraLateral.classList.contains('abierta')) {
            barraLateral.classList.remove('abierta');
        }
    };
}

    const pantalla = document.getElementById('pantalla');
    const entradaUsuario = document.getElementById('entrada-usuario');
    const btnEnviar = document.getElementById('botonEnviar');
    const btnNuevaSeccion = document.getElementById('nueva-seccion');
    const listaSecciones = document.getElementById('lista-secciones');
    const btnStop = document.getElementById('btn-detener');

    let intervaloEscritura = null;
    let secciones = [{ id: 1, nombre: "Nueva Conversación", mensajes: [], ultimoTema: "" }];
    let idActual = 1;

    const redesSociales = { 
        "fb": "Facebook", "ig": "Instagram", "tw": "Twitter/X", "tk": "TikTok", "yt": "YouTube" 
    };

   function detenerEscritura() {
    if (intervaloEscritura) {
        clearInterval(intervaloEscritura);
        intervaloEscritura = null;
        // OCULTAR EL BOTÓN cuando se detiene
        document.getElementById('btn-detener').classList.remove('activo');
    }
}

function animarRespuesta(texto, seccion, elementoSpan) {
    detenerEscritura();
    
    // MOSTRAR EL BOTÓN cuando empieza a escribir
    document.getElementById('btn-detener').classList.add('activo');

    let span = elementoSpan || mostrarBurbuja("", 'robot');
    seccion.mensajes.push({ texto: texto, clase: 'robot' });
    let i = 0;
    span.textContent = "";

    intervaloEscritura = setInterval(() => {
        if (i < texto.length) {
            span.textContent += texto[i++];
            pantalla.scrollTop = pantalla.scrollHeight;
        } else { 
            detenerEscritura(); // Esto apaga el botón al terminar
        }
    }, 15);
}

    function mostrarBurbuja(texto, clase) {
        const fila = document.createElement('div');
        fila.className = `fila-mensaje fila-${clase}`;
        const b = document.createElement('div');
        b.className = `mensaje ${clase}`;
        if (clase === 'robot') {
            const img = document.createElement('img');
            img.src = "avatar.jpeg"; 
            img.className = "avatar-chat";
            img.onerror = () => img.style.display = 'none';
            b.appendChild(img);
        }
        const span = document.createElement('span');
        span.className = "texto-mensaje";
        span.textContent = texto;
        b.appendChild(span);
        fila.appendChild(b);
        pantalla.appendChild(fila);
        pantalla.scrollTop = pantalla.scrollHeight;
        return span;
    }

    function renderizarSecciones() {
        listaSecciones.innerHTML = "";
        secciones.slice().reverse().forEach(sec => {
            const btn = document.createElement('button');
            btn.className = `btn-seccion ${sec.id === idActual ? 'activa' : ''}`;
            btn.textContent = sec.nombre;
            btn.onclick = () => {
                detenerEscritura();
                idActual = sec.id;
                pantalla.innerHTML = "";
                sec.mensajes.forEach(m => mostrarBurbuja(m.texto, m.clase));
                renderizarSecciones();
            };
            listaSecciones.appendChild(btn);
        });
    }

    function animarRespuesta(texto, seccion, elementoSpan) {
        detenerEscritura();
        let span = elementoSpan || mostrarBurbuja("", 'robot');
        seccion.mensajes.push({ texto: texto, clase: 'robot' });
        let i = 0;
        span.textContent = "";
        intervaloEscritura = setInterval(() => {
            if (i < texto.length) {
                span.textContent += texto[i++];
                pantalla.scrollTop = pantalla.scrollHeight;
            } else { detenerEscritura(); }
        }, 15);
    }

    btnNuevaSeccion.onclick = () => {
        detenerEscritura();
        const nuevoId = Date.now();
        secciones.push({ id: nuevoId, nombre: "Nueva Conversación", mensajes: [], ultimoTema: "" });
        idActual = nuevoId;
        pantalla.innerHTML = "";
        renderizarSecciones();
        entradaUsuario.focus();
    };

    btnEnviar.onclick = async () => {
        let rawText = entradaUsuario.value.trim();
        if (!rawText) return;

        detenerEscritura();
        mostrarBurbuja(rawText, 'usuario');
        const seccionActual = secciones.find(s => s.id === idActual);
        seccionActual.mensajes.push({ texto: rawText, clase: 'usuario' });

        let inputLimpio = rawText.toLowerCase();

        // 1. RESPUESTA CREADOR
        if (inputLimpio.includes("quien te creo") || inputLimpio.includes("tu creador")) {
            animarRespuesta("Me creó un pibe que no le gusta dormir y prefiere quedarse programando. 😎", seccionActual);
            entradaUsuario.value = "";
            return;
        }

        // 2. LÓGICA DE BÚSQUEDA Y MEMORIA
        // Limpiamos palabras clave para extraer el tema
        let busqueda = inputLimpio.replace(/quien es |info de |que es |dame mas |mas |infor|resumen de |resumen/g, "").trim();
        
        // Si el usuario solo escribió "resumen" o "más info", usamos el último tema guardado
        if (busqueda === "" && seccionActual.ultimoTema) {
            busqueda = seccionActual.ultimoTema;
        } else if (busqueda !== "") {
            seccionActual.ultimoTema = busqueda; // Guardamos el nuevo tema en memoria
        }

        if (seccionActual.nombre === "Nueva Conversación") {
            seccionActual.nombre = redesSociales[busqueda] || busqueda.substring(0, 15);
            renderizarSecciones();
        }

        entradaUsuario.value = "";
        const spanIA = mostrarBurbuja("Buscando...", 'robot');

        try {
            // Traducir abreviaturas (yt -> YouTube)
            for (let a in redesSociales) { if (busqueda === a) { busqueda = redesSociales[a]; break; } }

            // Buscamos el título exacto en Wikipedia
            const searchRes = await fetch(`https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(busqueda)}&format=json&origin=*`);
            const searchData = await searchRes.json();
            const tituloCorrecto = searchData.query.search[0].title;

            let textoFinal = "";

            // --- AQUÍ SE DECIDE SI ES RESUMEN O MÁS INFO ---
            if (inputLimpio.includes("mas") || inputLimpio.includes("infor")) {
                // MODO DETALLE: Texto largo
                const fullRes = await fetch(`https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(tituloCorrecto)}&format=json&origin=*`);
                const fullData = await fullRes.json();
                const pageId = Object.keys(fullData.query.pages)[0];
                textoFinal = fullData.query.pages[pageId].extract || "No encontré detalles.";
            } else {
                // MODO NORMAL / RESUMEN: Texto corto
                const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tituloCorrecto)}`);
                const data = await res.json();
                textoFinal = data.extract;

                // Si detecta la palabra resumen, corta el texto a 2 oraciones
                if (inputLimpio.includes("resumen")) {
                    const frases = textoFinal.split('. ');
                    textoFinal = "RESUMEN: " + frases.slice(0, 2).join('. ') + (frases.length > 2 ? "." : "");
                }
            }

            animarRespuesta(textoFinal, seccionActual, spanIA);
        } catch (e) { spanIA.textContent = "No encontré información sobre eso."; }
    };

    renderizarSecciones();
};