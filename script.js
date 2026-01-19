// 1. CONEXIÓN CON EL HTML
const boton = document.getElementById('miBoton');
const input = document.getElementById('campoNombre');
const etiquetaEstado = document.getElementById('estado');
let intervaloEscritura; // Para controlar el efecto de la máquina de escribir

// 2. BASE DE CONOCIMIENTOS (Añade aquí lo que quieras)
const sabiduria = {
    "hola": "¡Hola! Soy tu asistente inteligente. ¿En qué puedo ayudarte?",
    "quien eres": "Soy una IA pequeña creada para aprender programación.",
    "clima": "No tengo sensores, pero mi procesador está funcionando al 100%.",
    "javascript": "Es el lenguaje que me permite pensar y responderte.",
    "pizza": "Es el combustible favorito de los programadores.",
    "ayuda": "Puedo calcular matemáticas, responder preguntas básicas o simplemente charlar."
};

// 3. FUNCIÓN PARA EL EFECTO DE ESCRITURA (Tipo ChatGPT)
function escribirRespuesta(texto) {
    clearInterval(intervaloEscritura); // Detenemos cualquier escritura previa
    etiquetaEstado.innerText = ""; 
    let i = 0;
    
    intervaloEscritura = setInterval(() => {
        if (i < texto.length) {
            etiquetaEstado.innerText += texto.charAt(i);
            i++;
        } else {
            clearInterval(intervaloEscritura);
        }
    }, 30); // Velocidad de escritura (30ms por letra)
}

// 4. LÓGICA DE MATEMÁTICAS MEJORADA
function resolverMates(frase) {
    // NUEVA LÍNEA: Cambiamos 'x' por '*' antes de limpiar
    let textoLimpio = frase.replace(/x/g, "*"); 
    
    // Filtramos para dejar solo números y símbolos matemáticos
    const limpieza = textoLimpio.replace(/[^0-9+\-*/().]/g, ""); 
    
    if (!/\d/.test(limpieza)) return null;

    try {
        const calculo = new Function('return ' + limpieza)();
        return calculo;
    } catch {
        return null;
    }
}

// 5. EVENTO AL HACER CLIC EN EL BOTÓN
boton.addEventListener('click', () => {
    const mensaje = input.value.toLowerCase().trim();
    let respuestaFinal = "";

    // A. Intentamos resolver como matemática primero
    const resultadoMates = resolverMates(mensaje);
    
    if (resultadoMates !== null && !isNaN(resultadoMates)) {
        respuestaFinal = "El resultado es: " + resultadoMates + ". ¡Soy un genio!";
    } 
    // B. Si no es mate, buscamos en la sabiduría
    else {
        let encontrado = false;
        for (let clave in sabiduria) {
            if (mensaje.includes(clave)) {
                respuestaFinal = sabiduria[clave];
                encontrado = true;
                break;
            }
        }
        
        // C. Si no entiende nada de lo anterior
        if (!encontrado) {
            if (mensaje === "") {
                respuestaFinal = "No has escrito nada... ¿estás ahí?";
            } else {
                respuestaFinal = "Aún no sé sobre '" + mensaje + "', pero lo anotaré para mi próxima actualización.";
            }
        }
    }

    // DISPARAMOS EL EFECTO DE ESCRITURA
    escribirRespuesta(respuestaFinal);
    input.value = ""; // Limpiamos el buscador
});