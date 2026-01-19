const boton = document.getElementById('miBoton');
const input = document.getElementById('campoNombre');
const etiquetaEstado = document.getElementById('estado');

// --- BASE DE CONOCIMIENTOS ---
const sabiduria = {
    "hola": "¡Hola! Soy tu asistente inteligente. ¿En qué puedo ayudarte hoy?",
    "quien eres": "Soy una pequeña IA creada para aprender contigo.",
    "clima": "No tengo termómetro, pero mi procesador está a una temperatura óptima.",
    "javascript": "Es el lenguaje que me permite pensar y escribirte así."
};

// --- FUNCIÓN PARA EL EFECTO DE ESCRITURA (Tipo ChatGPT) ---
function escribirRespuesta(texto) {
    etiquetaEstado.innerText = ""; // Limpiamos el texto actual
    let i = 0;
    
    // Creamos un intervalo que pone una letra cada 30 milisegundos
    const intervalo = setInterval(() => {
        if (i < texto.length) {
            etiquetaEstado.innerText += texto.charAt(i);
            i++;
        } else {
            clearInterval(intervalo); // Cuando termina de escribir, se detiene
        }
    }, 30);
}

// --- LOGICA DE MATEMATICAS MEJORADA ---
function resolverMates(frase) {
    // Limpiamos la frase para dejar solo números y símbolos (+ - * / . )
    const operacion = frase.replace(/[a-zA-Z?¿!¡]/g, "").trim();
    try {
        if (operacion === "") return null;
        return eval(operacion); // Calcula la operación limpia
    } catch {
        return null;
    }
}

// --- EVENTO PRINCIPAL ---
boton.addEventListener('click', () => {
    const mensaje = input.value.toLowerCase().trim();
    let respuestaFinal = "";

    // 1. Prioridad: ¿Es una pregunta matemática?
    const resultadoMates = resolverMates(mensaje);
    
    if (resultadoMates !== null) {
        respuestaFinal = "El cálculo da: " + resultadoMates + ". ¡Soy un genio!";
    } 
    // 2. ¿Está en mi base de conocimientos?
    else {
        let encontrado = false;
        for (let clave in sabiduria) {
            if (mensaje.includes(clave)) {
                respuestaFinal = sabiduria[clave];
                encontrado = true;
                break;
            }
        }
        
        // 3. Respuesta por defecto
        if (!encontrado) {
            respuestaFinal = (mensaje === "") ? "Dime algo..." : "Interesante pregunta... No lo sé todavía, pero lo anotaré en mi base de datos.";
        }
    }

    // DISPARAMOS EL EFECTO DE ESCRITURA
    escribirRespuesta(respuestaFinal);
    input.value = ""; 
});