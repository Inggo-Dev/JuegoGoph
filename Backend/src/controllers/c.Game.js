import { parentPort } from 'worker_threads';
import {
    ConexionBD, CadenaConexion, CifrarGoph, DescifrarGoph, Randon, CHATGPT
} from './c.Functions';
import { Buffer } from 'buffer';



export async function Verifica(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarPass = Buffer.from(params.password, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);



        let sql = "SELECT password FROM usuarios WHERE id_user=:id_user"
        let rem = { replacements: { id_user: 1 } }
        const Resp = await CnxBD.query(sql, rem);

        VarPass = Cifrar(VarPass)

        if (Resp[0].length > 0) {
            var verifica = Resp[0][0]["password"] === VarPass
            return res.status(200).json({
                message: ``,
                verifica: verifica
            });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function NewGame(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarNombre = Buffer.from(params.nombre, 'base64').toString('utf8');
        let VarTipo = Buffer.from(params.tipo, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);


        var id = await CnxBD.query("SELECT nextval('Jugador_id_jugador_seq');");

        id = parseInt(id[0][0]['nextval']);

        let sql = "INSERT INTO jugador (id_jugador, nombre, tipo) VALUES (:id_jugador, :nombre, :tipo)"
        let rem = { replacements: { id_jugador: id, nombre: VarNombre, tipo: VarTipo } }

        await CnxBD.query(sql, rem).then(resp => {
            return res.status(200).json({
                message: "",
                id: id
            });
        }).catch(err => {
            console.log(err.message)
            return res.status(200).json({
                message: `Error al ingresar el usuario`
            });
        })
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function InsertHistorial(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarIdjugador = Buffer.from(params.id_jugador, 'base64').toString('utf8');
        let VarIdpregunta = Buffer.from(params.id_pregunta, 'base64').toString('utf8');
        let VarPuntaje = Buffer.from(params.puntaje, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        let sql = "INSERT INTO historial (id_jugador, id_pregunta, puntaje) VALUES (:id_jugador, :id_pregunta, :puntaje)"
        let rem = { replacements: { id_jugador: VarIdjugador, id_pregunta: VarIdpregunta, puntaje: VarPuntaje } }
        await CnxBD.query(sql, rem).then(resp => {
            return res.status(200).json({ message: "" });
        }).catch(err => {
            console.log(err.message)
            return res.status(200).json({
                message: `Error al ingresar el historial`
            });
        })
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function InsertPregunta(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarPregunta = Buffer.from(params.id_jugador, 'base64').toString('utf8');
        let VarA = Buffer.from(params.resa, 'base64').toString('utf8');
        let VarB = Buffer.from(params.resb, 'base64').toString('utf8');
        let VarC = Buffer.from(params.resc, 'base64').toString('utf8');
        let VarD = Buffer.from(params.resd, 'base64').toString('utf8');
        let VarRespuesta = Buffer.from(params.respuesta, 'base64').toString('utf8');
        let VarDificultad = Buffer.from(params.dificultad, 'base64').toString('utf8');


        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        await InsertPreguntaF(CnxBD, VarPregunta, VarA, VarB, VarC, VarD, VarRespuesta, VarDificultad, 1).then(resp => {
            return res.status(200).json({
                message: "",
                Id: resp.id
            });
        }).catch(err => {
            return res.status(200).json({
                message: err
            });
        })


    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

function InsertPreguntaF(CnxBD, VarPregunta, VarA, VarB, VarC, VarD, VarRespuesta, VarDificultad, VarEstado) {
    return new Promise(async (resolve, reject) => {
        try {
            var id = await CnxBD.query("SELECT nextval('preguntas_id_pregunta_seq');");
            id = parseInt(id[0][0]['nextval']);

            let sql = `INSERT INTO preguntas (id_pregunta, pregunta, res_a, res_b, res_c, res_d, respuesta, dificultad, estado)
             VALUES (:id_pregunta, :pregunta, :res_a, :res_b, :res_c, :res_d, :respuesta, :dificultad, :estado)`
            let rem = { replacements: { id_pregunta: id, pregunta: VarPregunta, res_a: VarA, res_b: VarB, res_c: VarC, res_d: VarD, respuesta: VarRespuesta, dificultad: VarDificultad, estado: VarEstado } }
            await CnxBD.query(sql, rem).then(resp => {
                resolve({ id: id })
            }).catch(err => {
                reject(`Error al ingresar la pregunta`)
            })
        } catch (error) {
            reject(`Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`)
            throw error;
        }
    })
}

export async function ConsultaPregunta(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarDificultad = Buffer.from(params.dificultad, 'base64').toString('utf8');
        let VarTipo = Buffer.from(params.id_pregunta, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        if (parseInt(VarTipo) === 0) {
            await ConsultaPreguntaIA(CnxBD, VarDificultad).then(resp => {
                return res.status(200).json({
                    message: "",
                    Pregunta: resp.pregunta,
                    Respuestas: resp.Respuestas,
                    id_pregunta: resp.id_pregunta
                });
            }).catch(err => {
                return res.status(200).json({
                    message: err
                });
            })
        } else {
            await ConsultaPreguntaF(CnxBD, VarDificultad).then(resp => {
                return res.status(200).json({
                    message: "",
                    Pregunta: resp.pregunta,
                    Respuestas: resp.Respuestas,
                    id_pregunta: resp.id_pregunta
                });
            }).catch(err => {
                return res.status(200).json({
                    message: err
                });
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

function ConsultaPreguntaF(CnxBD, dificultad) {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "SELECT id_pregunta FROM preguntas WHERE estado=1 and dificultad=:dificultad"
            var rem = { replacements: { dificultad: dificultad } }
            const Resp = await CnxBD.query(sql, rem);
            var id = ""
            if (Resp[0].length > 0) {
                id = Randon(Resp[0])

                var sql1 = "SELECT pregunta, res_a, res_b, res_c, res_d, respuesta FROM preguntas WHERE id_pregunta=:id_pregunta AND dificultad=:dificultad"
                var rem1 = { replacements: { id_pregunta: id, dificultad: dificultad } }
                const Resp1 = await CnxBD.query(sql1, rem1);
                const respuestas = [
                    { respuesta: Resp1[0][0].res_a, key: Resp1[0][0].res_a === Resp1[0][0].respuesta },
                    { respuesta: Resp1[0][0].res_b, key: Resp1[0][0].res_b === Resp1[0][0].respuesta },
                    { respuesta: Resp1[0][0].res_c, key: Resp1[0][0].res_c === Resp1[0][0].respuesta },
                    { respuesta: Resp1[0][0].res_d, key: Resp1[0][0].res_d === Resp1[0][0].respuesta },
                ];
                for (let i = respuestas.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
                }
                resolve({ pregunta: Resp1[0][0]['pregunta'], Respuestas: respuestas, id_pregunta: id })
            } else {
                reject('No hay preguntas')
            }
        } catch (error) {
            reject(`Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`)
            throw error;
        }
    })
}

function ConsultaPreguntaIA(CnxBD, VarDificultad) {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "SELECT tema FROM tema WHERE estado=1 "
            const Resp = await CnxBD.query(sql);

            var promp = ""
            var promp1 = ""
            var respuestas = ""


            if (Resp[0].length > 0) {
                promp = `Eres un experto en el tema de ${Resp[0][0]["tema"]}, por ende vas a realizar una pregunta de cualquier aspecto del tema, la pregunta va por niveles, del 1 al 10, siendo 10 el nivel más alto,
                    realiza la pregunta de nivel ${parseInt(VarDificultad)}, pero no puede pasar mas de 200 caracteres, Formula la pregunta de manera clara y concisa.`
            } else {
                promp = `eres un experto en el tema de Ley 675 de 2001 Congreso de la República de Colombia, por ende vas a realizar una pregunta, la pregunta va por niveles, del 1 al 10, siendo 10 el nivel más alto,
                    realiza la pregunta de nivel ${parseInt(VarDificultad)}, pero no puede pasar mas de 200 caracteres, Formula la pregunta de manera clara y concisa. `
            }
            await CHATGPT(promp).then(async (Pregunta) => {
                promp1 = `de acuerdo a la siguiente pregunta dame 4 opciones de respuestas, 1 correcta y 3 incorrectas, Redacta las respuestas incorrectas para que sean casi idénticas a la correcta, cambiando un detalle mínimo (una palabra, cifras, orden de los elementos) que pueda confundir. 
                         ${Pregunta.content}
                         pero estas respuestas deben ser en formato json, como ejemplo [{respuesta: "",key: true,}, {}, {}, {}], solo me debes devolver el JSON sin mas texto, ademas las respuestas no deben superar los 50 caracteres`
                await CHATGPT(promp1).then(async (Respuestas) => {
                    respuestas = Respuestas.content.match(/\[.*\]/s)[0];
                    respuestas = JSON.parse(respuestas);

                    for (let i = respuestas.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
                    }

                    var indiceVerdadero = respuestas.findIndex(item => item.key === true);

                    await InsertPreguntaF(CnxBD, Pregunta.content, respuestas[0].respuesta, respuestas[1].respuesta, respuestas[2].respuesta, respuestas[3].respuesta, respuestas[indiceVerdadero].respuesta, VarDificultad, 2).then(resp => {
                        resolve({ pregunta: Pregunta.content, Respuestas: respuestas, id_pregunta: resp.id })
                    }).catch(err2 => {
                        reject(`Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`)
                    })
                }).catch(err1 => {
                    reject(`Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`)
                })
            }).catch(err => {
                reject(`Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`)
            })
        } catch (error) {
            reject(`Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`)
            throw error;
        }
    })
}

export async function AyudaPublicoCifrado(req, res) {
    try {
        let params = req.body

        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarIdPregunta = Buffer.from(params.id_pregunta, 'base64').toString('utf8');
        let VarRespuestas = Buffer.from(params.respuestas, 'base64').toString('utf8');

        console.log(VarIdPregunta)
        console.log(CifrarGoph(params.id_pregunta))

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);


        let sql = "INSERT INTO pregunta_activa (id_pregunta, respuestas) VALUES (:id_pregunta, :respuestas)"
        let rem = { replacements: { id_pregunta: VarIdPregunta, respuestas: VarRespuestas } }



        await CnxBD.query(sql, rem).then(resp => {
            return res.status(200).json({
                message: "",
                id_pregunta: CifrarGoph(params.id_pregunta)
            });
        }).catch(err => {
            console.log(err.message)
            return res.status(200).json({
                message: `Error al Generar QR`
            });
        })


    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function AyudaPublicoCerrar(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarIdPregunta = Buffer.from(params.id_pregunta, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        let sql = "UPDATE pregunta_activa SET estado=0 WHERE id_pregunta=:id_pregunta"
        let rem = { replacements: { id_pregunta: VarIdPregunta } }

        await CnxBD.query(sql, rem).then(resp => {
            return res.status(200).json({
                message: "",
            });
        }).catch(err => {
            console.log(err.message)
            return res.status(200).json({
                message: `Error al Generar Cerrar`
            });
        })
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function AyudaPublicoProgreso(req, res) {
    try {
        let params = req.body

        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarIdPregunta = Buffer.from(params.id_pregunta, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        let sql = "SELECT respuesta FROM pregunta_activa_logs WHERE id_pregunta=:id_pregunta"
        let rem = { replacements: { id_pregunta: VarIdPregunta } }

        await CnxBD.query(sql, rem).then(resp => {
            return res.status(200).json({
                message: "",
                RespuestaPublico: resp[0]
            });
        }).catch(err => {
            console.log(err.message)
            return res.status(200).json({
                message: `Error al Generar Cerrar`
            });
        })
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function AyudaPublico(req, res) {
    try {
        let params = req.body

        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarIdPregunta = Buffer.from(params.id_pregunta, 'base64').toString('utf8');
        VarIdPregunta = DescifrarGoph(VarIdPregunta)

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);
        let sql = `SELECT p.pregunta, a.respuestas FROM pregunta_activa a 
                    INNER JOIN preguntas p ON (p.id_pregunta=a.id_pregunta) 
                    WHERE  a.id_pregunta=:id_pregunta`
        let rem = { replacements: { id_pregunta: VarIdPregunta } }
        const Resp = await CnxBD.query(sql, rem);

        if (Resp[0].length > 0) {
            return res.status(200).json({
                message: ``,
                Pregunta: Resp[0][0]['pregunta'],
                Respuestas: Resp[0][0]['respuestas']['respuestas'],
            });
        } else {
            return res.status(200).json({
                message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
            });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function VotarAyudaPublico(req, res) {
    try {
        let params = req.body

        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarIdPregunta = Buffer.from(params.id_pregunta, 'base64').toString('utf8');
        let VarIdentificador = Buffer.from(params.identificador, 'base64').toString('utf8');
        let VarRespuesta = Buffer.from(params.respuesta, 'base64').toString('utf8');
        VarIdPregunta = DescifrarGoph(VarIdPregunta)

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);
        let sql = "SELECT estado FROM pregunta_activa WHERE  id_pregunta=:id_pregunta"
        let rem = { replacements: { id_pregunta: VarIdPregunta } }
        const Resp = await CnxBD.query(sql, rem);

        if (Resp[0].length > 0) {
            if (parseInt(Resp[0][0]['estado']) === 1) {

                let sql1 = `INSERT INTO pregunta_activa_logs (id_pregunta, identificador, respuesta)
                            SELECT :id_pregunta, :identificador, :respuesta
                            WHERE NOT EXISTS (
                            SELECT 1 FROM pregunta_activa_logs 
                            WHERE id_pregunta = :id_pregunta 
                            AND identificador = :identificador);`
                let rem1 = { replacements: { id_pregunta: VarIdPregunta, identificador: VarIdentificador, respuesta: VarRespuesta } }
                await CnxBD.query(sql1, rem1).then(resp => {
                    if (parseInt(resp[1]) === 1) {
                        return res.status(200).json({
                            message: "",

                        });
                    } else {
                        return res.status(200).json({
                            message: `Recuerda que solo debes realizar un voto.`
                        });
                    }
                }).catch(err => {
                    return res.status(200).json({
                        message: `Recuerda que solo debes realizar un voto.`
                    });
                })
            } else {
                return res.status(200).json({
                    message: `Lamentamos informarte que no puedes votar en esta pregunta, ya que ha sido cerrada.`
                });
            }
        } else {
            return res.status(200).json({
                message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
            });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function Historial(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        let sql = `SELECT j.nombre, h.puntaje, h.fecha, h.id_historial
                FROM historial h
                INNER JOIN jugador j ON j.id_jugador = h.id_jugador
                INNER JOIN (
                SELECT id_jugador, MAX(fecha) AS max_fecha
                FROM historial
                GROUP BY id_jugador
                ) AS latest ON h.id_jugador = latest.id_jugador AND h.fecha = latest.max_fecha;`

        await CnxBD.query(sql).then(resp => {
            return res.status(200).json({
                message: "",
                Historial: resp[0]
            });
        }).catch(err => {
            console.log(err.message)
            return res.status(200).json({
                message: `Error al consultar el Historial`
            });
        })
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};


export async function Configuracion(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');

        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        let sql = `SELECT id_tema, tema, estado FROM tema WHERE estado>0`
        const Resp = await CnxBD.query(sql);

        let sql1 = "SELECT id_pregunta, pregunta, res_a, res_b, res_c, res_d, respuesta, dificultad, estado, fecha FROM preguntas WHERE estado>0"
        const Resp1 = await CnxBD.query(sql1);

        return res.status(200).json({
            message: "",
            Temas: Resp[0],
            Preguntas: Resp1[0]
        });
    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};

export async function Preguntas(req, res) {
    try {
        let params = req.body
        let VarCodigo = Buffer.from(params.codigo, 'base64').toString('utf8');
        let VarEstado = Buffer.from(params.estado, 'base64').toString('utf8');
        let VarIdpregunta = Buffer.from(params.id_pregunta, 'base64').toString('utf8');


        const Conection = CadenaConexion(VarCodigo);
        const CnxBD = ConexionBD(Conection.NomBD, Conection.UserBD, Conection.PwdBD, Conection.HostBD, Conection.Port);

        let sql = `UPDATE pregunta SET estado=:estado WHERE id_pregunta=:id_pregunta`
        let rem = { replacements: { estado: VarEstado, id_pregunta: VarIdpregunta } }

        await CnxBD.query(sql, rem).then(resp => {
            return res.status(200).json({
                message: "",
            });
        }).catch(err => {
            console.log(err.message)
            return res.status(200).json({
                message: `Error al actualizar la pregunta`
            });
        })

    } catch (error) {
        console.log(error.message)
        return res.status(200).json({
            message: `Vaya algo salio mal, por favor vuelva a intentarlo mas tarde.`
        });
    }
};