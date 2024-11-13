import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors'

//Importing routes

import Game from './routes/r.Game';


const app = express();

//MIDDELWARES
app.use(cors());
app.use(morgan('dev'));
app.use(json({ limit: '5mb' }));
app.use(urlencoded({ limit: '5mb', extended: true }));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST');
    res.header('Allow', 'GET', 'POST');
    next();
});

//ROUTES

app.use('/japi/game', Game);



export default app;