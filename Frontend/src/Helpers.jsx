export function Sound(opt) {

    var sound = ''

    switch (parseInt(opt)) {
        case 1:
            sound = '/gophgame/sound/salvapantallas.mp3'
            break;
        case 2:
            sound = '/gophgame/sound/pregunta.mp3'
            break;
        case 3:
            sound = '/gophgame/sound/aplausos.mp3'
            break;
        case 4:
            sound = '/gophgame/sound/incorrecta.mp3'
            break;
        case 5:
            sound = '/gophgame/sound/votacion.mp3'
            break;
        case 6:
            sound = '/gophgame/sound/tiempo.mp3'
            break;

        case 7:
            sound = '/gophgame/sound/publico.mp3'
            break;

        case 8:
            sound = '/gophgame/sound/llamada.mp3'
            break;

        case 9:
            sound = '/gophgame/sound/resultadosjuego.mp3'
            break;


        default:
            sound = '/gophgame/sound/tiempo.mp3'
            break;
    }

    return sound



}