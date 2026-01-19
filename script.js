window.onload = () => {
    const botonEnviar = document.getElementById('botonEnviar');
    const botonDetener = document.getElementById('botonDetener');
    const entradaUsuario = document.getElementById('entrada-usuario');
    const textoRobot = document.getElementById('texto-robot');
    let intervaloEscritura;

    function escribirRespuesta(texto) {
        clearInterval(intervaloEscritura);
        if (!texto) return;
        let i = 0;
        textoRobot.innerHTML = "";
        intervaloEscritura = setInterval(() => {
            if (i < texto.length) {
                textoRobot.innerHTML += texto.charAt(i);
                i++;
            } else {
                clearInterval(intervaloEscritura);
            }
        }, 20);
    }

    async function buscarWikipedia(tema) {
        let consulta = tema.toLowerCase().replace("semon", "simón").replace(/[¿?¡!]/g, "").trim();
        try {
            const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(consulta)}&format=json&origin=*`;
            const resSearch = await fetch(searchUrl);
            const dataSearch = await resSearch.json();

            if (dataSearch.query.search.length > 0) {
                const tituloReal = dataSearch.query.search[0].title;
                const summaryUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tituloReal.replace(/ /g, "_"))}`;
                const resSummary = await fetch(summaryUrl);
                const dataSummary = await resSummary.json();
                return dataSummary.extract;
            }
            return "No encontré información sobre eso.";
        } catch (error) {
            return "Error de conexión.";
        }
    }

    botonEnviar.addEventListener('click', async () => {
        const msj = entradaUsuario.value.trim();
        if (!msj) return;
        clearInterval(intervaloEscritura);
        textoRobot.innerText = "Buscando...";
        const respuesta = await buscarWikipedia(msj);
        escribirRespuesta(respuesta);
        entradaUsuario.value = "";
    });

    // LA PARTE QUE FALTABA:
    botonDetener.addEventListener('click', () => {
        clearInterval(intervaloEscritura);
    });

    entradaUsuario.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') botonEnviar.click();
    });
};