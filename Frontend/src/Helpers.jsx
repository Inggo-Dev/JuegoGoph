export function Sound(opt) {

    var sound = ''

    switch (parseInt(opt)) {
        case 1:
            sound = '/GophGame/sound/salvapantallas.mp3'
            break;
        case 2:
            sound = '/GophGame/sound/pregunta.mp3'
            break;
        case 3:
            sound = '/GophGame/sound/aplausos.mp3'
            break;
        case 4:
            sound = '/GophGame/sound/incorrecta.mp3'
            break;
        case 5:
            sound = '/GophGame/sound/votacion.mp3'
            break;
        case 6:
            sound = '/GophGame/sound/tiempo.mp3'
            break;

        case 7:
            sound = '/GophGame/sound/publico.mp3'
            break;

        case 8:
            sound = '/GophGame/sound/llamada.mp3'
            break;

        case 9:
            sound = '/GophGame/sound/resultadosjuego.mp3'
            break;


        default:
            sound = '/GophGame/sound/tiempo.mp3'
            break;
    }

    return sound



}