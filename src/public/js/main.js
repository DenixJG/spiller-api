window.onload = function () {

}

// TODO: Cambiar comentarios a español

async function playAudio(context) {
    let timer;

    // Get the offsetparent of the context and get the audio tag
    let offsetParent = context.offsetParent;
    let audio = offsetParent.getElementsByTagName('audio')[0];

    // If the audio is playing pause it
    if (!audio.paused) {
        audio.pause();

        // On pause clear the timer
        audio.addEventListener("pause", function (_event) {
            clearTimeout(timer);
        });

        // Remove class from the context
        context.classList.replace('fa-pause', 'fa-play');
        return null;
    }

    // Check if there is another audio tag playing
    if (checkAudioPause() !== null) {
        // Pause the audio tag that is playing
        let activeAudio = checkAudioPause();
        activeAudio.pause();

        activeAudio.addEventListener("pause", function (_event) {
            clearTimeout(timer);
        });

        activeAudio.currentTime = 0;
        // Find the context of the audio tag that is playing and remove the class
        let activeContext = activeAudio.parentNode.offsetParent.getElementsByTagName('i')[0];
        activeContext.classList.replace('fa-pause', 'fa-play');
    }

    try {
        // Play the audio
        await audio.play();
        console.log('Playing...');
    } catch (err) {
        console.log('Failed to play...' + err);
    }

    // On playing increment the progress bar
    audio.addEventListener('playing', function (_event) {
        let duration = _event.target.duration;
        advance(duration, audio);
    });

    audio.addEventListener('ended', function (_event) {
        // Remove the class from the context
        context.classList.replace('fa-pause', 'fa-play');
    });

    // Add class to the context
    context.classList.replace('fa-play', 'fa-pause');
}

/**
 * Check if there is another audio tag playing
 * 
 * @returns 
 */
function checkAudioPause() {
    // Get all the audio tags
    let players = document.querySelectorAll('[id=player]');

    // Loop through all the audio tags and check if they are paused
    for (let i = 0; i < players.length; i++) {
        // If the audio tag is paused
        if (!players[i].paused) {
            // Return the audio tag
            return players[i];
        }
    }

    return null;
}

/**
 * Increment the progress bar
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
 * Start the timer
 * 
 * @param {*} duration 
 * @param {*} element 
 */
function startTimer(duration, element, percent) {
    if (percent < 100) {
        timer = setTimeout(function () { advance(duration, element) }, 100);
    }
}