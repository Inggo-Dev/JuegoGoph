import { Router } from 'express';
const router = Router();

import {
    Verifica, NewGame, InsertHistorial, InsertPregunta, ConsultaPregunta, AyudaPublicoCifrado, AyudaPublicoCerrar, AyudaPublicoProgreso, AyudaPublico, VotarAyudaPublico,
    Historial
} from '../controllers/c.Game'


export default router
    .post('/verifica', Verifica)
    .post('/newgame', NewGame)
    .post('/inserthistorial', InsertHistorial)
    .post('/insertpregunta', InsertPregunta)
    .post('/consultapregunta', ConsultaPregunta)
    .post('/ayudapublicocifrado', AyudaPublicoCifrado)
    .post('/ayudapublicocerrar', AyudaPublicoCerrar)
    .post('/ayudapublicoprogreso', AyudaPublicoProgreso)
    .post('/ayudapublico', AyudaPublico)
    .post('/votarayudapublico', VotarAyudaPublico)
    .post('/historial', Historial)