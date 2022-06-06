window.onload = function () {

}

async function playAudio(context) {
    let timer;

    // Obtener el offsetparent del contexto y obtener la etiqueta de audio
    let offsetParent = context.offsetParent;
    let audio = offsetParent.getElementsByTagName('audio')[0];

    // Pausar el audio si este se esta reproduciendo
    if (!audio.paused) {
        audio.pause();

        // En la pausa el temporizador se resetea a 0
        audio.addEventListener("pause", function (_event) {
            clearTimeout(timer);
        });

        // Elimina la clase del contexto
        context.classList.replace('fa-pause', 'fa-play');
        return null;
    }

    // Comprueba si se está reproduciendo otra etiqueta de audio
    if (checkAudioPause() !== null) {
        // Poner en pausa la etiqueta de audio que se está reproduciendo
        let activeAudio = checkAudioPause();
        activeAudio.pause();

        activeAudio.addEventListener("pause", function (_event) {
            clearTimeout(timer);
        });

        activeAudio.currentTime = 0;
        // Encuentra el contexto de la etiqueta de audio que se está reproduciendo y elimina la clase
        let activeContext = activeAudio.parentNode.offsetParent.getElementsByTagName('i')[0];
        activeContext.classList.replace('fa-pause', 'fa-play');
    }

    try {
        // Reproducir el audio
        await audio.play();
        console.log('Playing...');
    } catch (err) {
        console.log('Failed to play...' + err);
    }

    // En la reproduccion se aumenta la barra de progreso
    audio.addEventListener('playing', function (_event) {
        let duration = _event.target.duration;
        advance(duration, audio);
    });

    audio.addEventListener('ended', function (_event) {
        // Elimina la clase del contexto
        context.classList.replace('fa-pause', 'fa-play');
    });

    // Añade la clase al contexto
    context.classList.replace('fa-play', 'fa-pause');
}

/**
 * Comprueba si se está reproduciendo otra etiqueta de audio
 * 
 * @returns 
 */
function checkAudioPause() {
    // Obtenemos todos las etiquetas de las canciones
    let players = document.querySelectorAll('[id=player]');

    // Recorre todas las etiquetas de audio y comprueba si están en pausa
    for (let i = 0; i < players.length; i++) {
        // Si la etiqueta de audio esta pausada
        if (!players[i].paused) {
            // Devuelve la etiqueta de audio
            return players[i];
        }
    }

    return null;
}

/**
 * Incrementacion de la barra de progreso
 * 
 * @param {*} duration 
 * @param {*} element 
 */
function advance(duration, element) {
    let percent = 0;
    // Get the progress bar
    let progress = element.parentNode.offsetParent.querySelector('[id=progress]');
    increment = 10 / duration
    percent = Math.min(increment * element.currentTime * 10, 100);
    progress.style.width = percent + '%'
    startTimer(duration, element, percent);
}

/**
 * Comienza el temporizador
 * 
 * @param {*} duration 
 * @param {*} element 
 */
function startTimer(duration, element, percent) {
    if (percent < 100) {
        timer = setTimeout(function () { advance(duration, element) }, 100);
    }
}

/**
 * Obtiene el id de la canción y lo pasa al input que se envia al servidor
 * @param {*} element 
 */
function getTrackToAdd(element) {
    let trackId = element.getAttribute('data-track-id');
    let inputTrackId = document.querySelector("#trackId");

    inputTrackId.value = trackId;
}
