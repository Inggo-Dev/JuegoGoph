import { Component } from "react";
import { Sound } from './../Helpers'
import { Progress } from "antd";
import { Howl } from 'howler';
import Modal from 'react-bootstrap/Modal';
import logoGoph from "./../assets/img/logo.png";
import SAGAC from "./../assets/img/SAGAC.png";
import Sinergia from "./../assets/img/Sinergia.png";
import Aseco from "./../assets/img/Aseco.png";
import Asesores from "./../assets/img/Asesores.png";
import empresas from "./../assets/img/empresas.png";
import HourGlass from "./HourGlass";
import NewGame from './Modals/NewGame';
import Global from "../Global";
import axios from "axios";
import { Buffer } from 'buffer';
import swal from "sweetalert";
import AyudaPublico from "./Modals/AyudaPublico";
import Confetti from 'react-confetti';



export default class Juega extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Modal: true,
            ModalPublico: false,
            data: true,
            HourGlass: false,
            sonido: false,
            isConfettiActive: false,

            Nombre: "",
            id_jugador: "",
            gophia: true,

            Pregunta: "",
            Respuestas: [],
            Votos: {},
            id_pregunta: "",
            cifrado: "",
            TempRespuestas: [{ label: "A" }, { label: "B" }, { label: "C" }, { label: "D" }],


            tiempo: 40,
            cincuenta: false,
            publico: false,
            llamada: false,
            puntos: 0,
            botonSeleccionado: null,
            botonVerde: null,

            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.soundini = new Howl({
            src: [Sound(1)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundjuego.play() }
        });
        this.soundpregnta = new Howl({
            src: [Sound(2)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundjuego.play() }
        });
        this.soundcorrecta = new Howl({
            src: [Sound(3)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundjuego.play() }
        });
        this.soundincorrecta = new Howl({
            src: [Sound(4)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundjuego.play() }
        });
        this.soundvotacion = new Howl({
            src: [Sound(5)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundpregnta.play() }
        });
        this.soundtiempo = new Howl({
            src: [Sound(6)],
            volume: this.state.sonido ? (1) : (0),
        });
        this.soundpublico = new Howl({
            src: [Sound(7)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundpregnta.play() }
        });
        this.soundllamada = new Howl({
            src: [Sound(8)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundpregnta.play() }
        });
        this.soundjuego = new Howl({
            src: [Sound(9)],
            volume: this.state.sonido ? (1) : (0),
            onend: () => { this.soundjuego.play() }
        });

    }

    componentDidMount() {
        this.mute()
    }

    stopSound = () => {
        this.soundini.stop()
        this.soundpregnta.stop()
        this.soundcorrecta.stop()
        this.soundincorrecta.stop()
        this.soundvotacion.stop()
        this.soundtiempo.stop()
        this.soundpublico.stop()
        this.soundllamada.stop()
        this.soundjuego.stop()
    }

    restartSound = () => {
        this.stopSound()
        var sonido = this.state.sonido
        sonido ? (this.soundjuego.stop()) : (this.soundjuego.play())
        this.setState({ sonido: !sonido })
    }

    mute = () => {
        this.soundini.volume(this.state.sonido ? 1 : 0);
        this.soundpregnta.volume(this.state.sonido ? 1 : 0);
        this.soundcorrecta.volume(this.state.sonido ? 1 : 0);
        this.soundincorrecta.volume(this.state.sonido ? 1 : 0);
        this.soundvotacion.volume(this.state.sonido ? 1 : 0);
        this.soundtiempo.volume(this.state.sonido ? 1 : 0);
        this.soundpublico.volume(this.state.sonido ? 1 : 0);
        this.soundllamada.volume(this.state.sonido ? 1 : 0);
        this.soundjuego.volume(this.state.sonido ? 1 : 0);
    }

    componentWillUnmount() {
        this.stopSound()
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.setState({ tiempo: 30 })
        }
    }


    NewGame = (data) => {
        this.stopSound()
        this.soundini.play()
        this.setState({ Nombre: data.Nombre, gophia: data.gophia, id_jugador: data.id_jugador, isConfettiActive: false }, () => {
            this.setState({ Modal: false })
        })
    }

    IniciarPartida = () => {
        this.setState({ HourGlass: true, Votos: {} })
        if (this.state.gophia) {
            this.BuscarPregunta(0)
        } else {
            this.BuscarPregunta(1)
        }
    }

    BuscarPregunta = (id_pregunta) => {

        var body = {
            codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
            dificultad: Buffer.from("" + (parseInt(this.state.puntos) + 1)).toString("base64"),
            id_pregunta: Buffer.from("" + id_pregunta).toString("base64"),
        };

        axios.post(`${Global.Ruta.Url}game/consultapregunta/`, body).then((res) => {
            if (res.data.message === "") {
                this.setState({ HourGlass: false })
                clearInterval(this.intervalId);
                this.setState({ Pregunta: res.data.Pregunta, Respuestas: res.data.Respuestas, id_pregunta: res.data.id_pregunta, tiempo: 40, botonSeleccionado: null, botonVerde: null }, () => { this.iniciarConteo(), this.stopSound(), this.soundpregnta.play() })
            } else {
                this.IniciarPartida()
            }
        }).catch((err) => {
            this.setState({ HourGlass: false })
            swal({
                title: "ALERTA!",
                text: "Vaya algo ha salido mal, por favor vuelva a intentarlo.",
                icon: "error",
                button: "Aceptar",
            }).then(() => { Global.Pagina.componente = 0 })
        });
    }

    Letra = (dato) => {
        switch (parseInt(dato)) {
            case 0:
                return "A"
            case 1:
                return "B"
            case 2:
                return "C"
            case 3:
                return "D"
            default:
                return "A"
        }
    }

    Puntaje = (dato) => {
        switch (parseInt(dato)) {
            case 0:
                return 0;
            case 1:
                return 100;
            case 2:
                return 200;
            case 3:
                return 400;
            case 4:
                return 800;
            case 5:
                return 1600;
            case 6:
                return 3200;
            case 7:
                return 6400;
            case 8:
                return 12800;
            case 9:
                return 25600;
            case 10:
                return 50000;
            default:
                return 0;
        }
    }

    iniciarConteo() {
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                if (prevState.tiempo > 0) {
                    if (prevState.tiempo === 2) {
                        this.stopSound()
                        this.soundtiempo.play()
                    }
                    return { tiempo: prevState.tiempo - 1 };
                } else {
                    this.stopSound()
                    this.soundcorrecta.play()
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                    this.setState({ llamada: true, cincuenta: true, publico: true });
                    return { tiempo: 0 };
                }
            });
        }, 1000);
    }

    Ayuda5050 = () => {

        clearInterval(this.intervalId);
        var temp = this.state.Respuestas
        var respuestasFalse = temp.filter(item => item.key === false);
        var indexAleatorio = Math.floor(Math.random() * respuestasFalse.length);
        var respuestaConservada = respuestasFalse[indexAleatorio];

        temp.forEach(item => {
            if (item.key === false && item !== respuestaConservada) {
                item.respuesta = "";
            }
        });
        this.setState({ Respuestas: temp, tiempo: this.state.tiempo + 15, cincuenta: true }, () => {
            this.iniciarConteo()
            this.stopSound()
            this.soundllamada.play()
        })
    }

    Llamada = () => {
        this.stopSound()
        this.soundpublico.play()
        clearInterval(this.intervalId);
        this.setState({ tiempo: 60, llamada: true }, () => { this.iniciarConteo() })
    }

    Publico = () => {
        clearInterval(this.intervalId);
        this.setState({ HourGlass: true, publico: true })
        var respuestas = { respuestas: this.state.Respuestas }
        var body = {
            codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
            id_pregunta: Buffer.from("" + this.state.id_pregunta).toString("base64"),
            respuestas: Buffer.from("" + JSON.stringify(respuestas)).toString("base64"),
        };
        axios.post(`${Global.Ruta.Url}game/ayudapublicocifrado/`, body).then((res) => {
            if (res.data.message === "") {
                this.setState({ cifrado: res.data.id_pregunta }, () => { this.setState({ HourGlass: false, ModalPublico: true }) })
            } else {
                this.setState({ HourGlass: false })
                swal({
                    title: "Atención",
                    text: res.data.message,
                    icon: "info",
                    button: "Aceptar",
                }).then(() => { Global.Pagina.componente = 0 })
            }
        }).catch((err) => {
            this.setState({ HourGlass: false })
            swal({
                title: "ALERTA!",
                text: "Vaya algo ha salido mal, por favor vuelva a intentarlo.",
                icon: "error",
                button: "Aceptar",
            }).then(() => { Global.Pagina.componente = 0 })
        });
    }

    RespuestaParticipante = (index, key) => {
        if (this.state.tiempo !== 0) {
            clearInterval(this.intervalId);
            const indiceVerdadero = this.state.Respuestas.findIndex(item => item.key === true);
            if (!key) {
                this.stopSound()
                this.soundincorrecta.play()
                this.setState({ botonSeleccionado: index, botonVerde: indiceVerdadero, llamada: true, cincuenta: true, publico: true });
            } else {
                var puntos = parseInt(this.state.puntos) + 1
                if (puntos < 10) {
                    this.stopSound()
                    this.soundcorrecta.play()
                    this.setState({ botonSeleccionado: index, botonVerde: null, puntos: puntos }, () => { this.GuardarPuntaje() });
                } else {
                    this.stopSound()
                    this.soundcorrecta.play()
                    this.setState({ isConfettiActive: true, puntos: puntos, botonVerde: indiceVerdadero, botonSeleccionado: index, llamada: true, cincuenta: true, publico: true }, () => { this.GuardarPuntaje() })
                }
            }
        }
    }

    GuardarPuntaje = () => {

        var puntaje = this.Puntaje(this.state.puntos)

        var body = {
            codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
            id_jugador: Buffer.from("" + this.state.id_jugador).toString("base64"),
            id_pregunta: Buffer.from("" + this.state.id_pregunta).toString("base64"),
            puntaje: Buffer.from("" + puntaje).toString("base64"),
        };

        axios.post(`${Global.Ruta.Url}game/inserthistorial/`, body).catch((err) => {
            console.log("")
        });
    }

    Reiniciar = () => {
        swal({
            title: "Atención",
            text: "¿Desea Reiniciar la partida?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"],
        }).then((continuar) => {
            if (continuar) {
                this.stopSound()
                this.soundini.play()
                this.setState({
                    Modal: true,
                    ModalPublico: false,
                    data: true,
                    HourGlass: false,
                    sonido: false,
                    isConfettiActive: false,
                    Nombre: "",
                    id_jugador: "",
                    gophia: true,
                    Pregunta: "",
                    Respuestas: [],
                    Votos: {},
                    id_pregunta: "",
                    cifrado: "",
                    TempRespuestas: [{ label: "A" }, { label: "B" }, { label: "C" }, { label: "D" }],
                    tiempo: 30,
                    cincuenta: false,
                    publico: false,
                    llamada: false,
                    puntos: 0,
                    botonSeleccionado: null,
                    botonVerde: null,
                    width: window.innerWidth,
                    height: window.innerHeight,
                }, () => { this.setState({ Modal: true }, () => { this.mute() }) })
            }
        })
    }

    GoHome = () => {
        swal({
            title: "Atención",
            text: "¿Desea abandonar la partida?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"],
        }).then((continuar) => {
            if (continuar) {
                Global.Pagina.componente = 0
            }
        })
    }




    render() {

        if (this.state.data) {
            return (
                <div className="" >
                    <Modal show={this.state.HourGlass} size="md" centered onHide={() => { this.setState({ HourGlass: false }) }}>
                        <HourGlass principal={false} uno={'Preguntas'} dos={'Saga'} tres={'Estadistica'} />
                    </Modal>

                    <Modal show={this.state.Modal} size="lg" centered backdrop="static" onHide={() => { this.setState({ Modal: false }) }}>
                        <NewGame NewGame={(data) => { this.NewGame(data) }} />
                    </Modal>

                    <Modal show={this.state.ModalPublico} size="lg" centered backdrop="static" onHide={() => { this.setState({ ModalPublico: false }) }}>
                        <AyudaPublico Respuestas={this.state.Respuestas} Pregunta={this.state.Pregunta} id_pregunta={this.state.id_pregunta} cifrado={this.state.cifrado}
                            Cerrar={(data) => { this.setState({ Votos: data, tiempo: parseInt(this.state.tiempo) + 15 }, () => { this.setState({ ModalPublico: false }), this.iniciarConteo() }) }} />
                    </Modal>

                    <div className="container">
                        {this.state.isConfettiActive && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                    </div>
                    <div className=" pt-2 bg-light">
                        <div className='d-none d-md-block'>
                            <div className="d-flex justify-content-between align-items-center ">
                                <img className="Icon_S" src={Sinergia} alt="GoPH" />
                                <img className="Icon_G" src={Asesores} alt="GoPH" />
                                <img className="Icon_G" src={logoGoph} alt="GoPH" />
                                <img className="Icon_G" src={Aseco} alt="GoPH" />
                                <button className="btn btn-outline-primary opacity-50" onClick={() => { this.setState({ sonido: !this.state.sonido }, () => { this.mute() }) }}>{this.state.sonido ? (<i className="fa-solid fa-volume-high"></i>) : (<i className="fa-solid fa-volume-xmark"></i>)} </button>
                            </div>
                        </div>
                        <div className='d-block d-md-none'>
                            <div className=" d-flex justify-content-center align-items-center">
                                <img className="Icon_E" src={empresas} alt="GoPH" />
                                <button className="btn btn-outline-primary opacity-50" onClick={() => { this.setState({ sonido: !this.state.sonido }, () => { this.mute() }) }}>{this.state.sonido ? (<i className="fa-solid fa-volume-high"></i>) : (<i className="fa-solid fa-volume-xmark"></i>)} </button>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="card transparent-card my-3  border-light  ">
                                <div className="card-body m-0 p-0">
                                    <div className="d-flex justify-content-center align-items-center m-3">
                                        {this.state.Respuestas.length > 0 && (
                                            Object.values(this.state.Votos).reduce((acc, value) => acc + value, 0) > 0 ? (
                                                <div className="row me-3">
                                                    <div className="card transparent-card-2 border-light ">
                                                        <div className="card-body ">
                                                            <p className="m-0 card-text">A.<span className="ms-2">{this.state.Votos.resa} Votos</span></p>
                                                            <p className="m-0 card-text">B.<span className="ms-2">{this.state.Votos.resb} Votos</span></p>
                                                            <p className="m-0 card-text">C.<span className="ms-2">{this.state.Votos.resc} Votos</span></p>
                                                            <p className="m-0 card-text">D.<span className="ms-2">{this.state.Votos.resd} Votos</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="row me-3">
                                                    <div className="card transparent-card-2 border-light ">
                                                        <div className="card-body ">
                                                            <p className="m-0 card-text">10.<span className={`${this.state.puntos > 9 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(10))} puntos</span></p>
                                                            <p className="m-0 card-text">9.<span className={`${this.state.puntos > 8 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(9))} puntos</span></p>
                                                            <p className="m-0 card-text">8.<span className={`${this.state.puntos > 7 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(8))} puntos</span></p>
                                                            <p className="m-0 card-text">7.<span className={`${this.state.puntos > 6 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(7))} puntos</span></p>
                                                            <p className="m-0 card-text">6.<span className={`${this.state.puntos > 5 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(6))} puntos</span></p>
                                                            <p className="m-0 card-text">5.<span className={`${this.state.puntos > 4 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(5))} puntos</span></p>
                                                            <p className="m-0 card-text">4.<span className={`${this.state.puntos > 3 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(4))} puntos</span></p>
                                                            <p className="m-0 card-text">3.<span className={`${this.state.puntos > 2 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(3))} puntos</span></p>
                                                            <p className="m-0 card-text">2.<span className={`${this.state.puntos > 1 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(2))} puntos</span></p>
                                                            <p className="m-0 card-text">1.<span className={`${this.state.puntos > 0 ? ("text-success") : ("text-danger")} ms-2`}>{new Intl.NumberFormat("es-ES").format(this.Puntaje(1))} puntos</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <div className="col-3 d-flex justify-content-center align-items-center mx-5 ">

                                            {this.state.Respuestas.length > 0 ? (
                                                <Progress type="circle" size={200} percent={(this.state.tiempo / 40) * 100} className="tex-success" strokeWidth={7} strokeColor="#6ab7f7" format={() => `${this.state.tiempo}`} />
                                            ) : (
                                                <img className="m-4 " src={SAGAC} alt="Logo_M" />
                                            )}
                                        </div>
                                        {this.state.Respuestas.length > 0 && (
                                            <div className="row g-3">
                                                <button className={`btnoicon btnoption-lose`} onClick={() => { this.GoHome() }}><i className="fa-solid fa-house"></i></button>
                                                <button className={`btnoicon ${this.state.cincuenta ? ("btnoption-danger") : ("btnoption-success")}`} disabled={this.state.cincuenta} onClick={() => { this.Ayuda5050() }}><i className="fa-solid fa-5"></i><i className="fa-solid fa-0"></i> : <i className="fa-solid fa-5"></i><i className="fa-solid fa-0"></i></button>
                                                <button className={`btnoicon ${this.state.publico ? ("btnoption-danger") : ("btnoption-success")}`} disabled={this.state.publico} onClick={() => { this.Publico() }}><i className="fa-solid fa-users"></i></button>
                                                <button className={`btnoicon ${this.state.llamada ? ("btnoption-danger") : ("btnoption-success")}`} disabled={this.state.llamada} onClick={() => { this.Llamada() }}><i className="fa-solid fa-phone-volume"></i></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center align-items-center m-3">
                                <span className="text-light fs-3">{this.state.Nombre !== "" ? (this.state.Nombre) : ("GOPH")}</span>
                            </div>
                            <div className="option mb-5 d-flex justify-content-center">
                                <span className="fs-5">{this.state.Pregunta !== "" ? (this.state.Pregunta) : ("GoPH Asambleas Presenciales, Virtuales y Mixtas")}</span>
                            </div>
                            <div className="row g-3 mb-5">
                                {this.state.Respuestas.length > 0 ? (
                                    this.state.Respuestas.map((datos, index) => (
                                        <div className="col-12 col-md-6" key={index}>
                                            <button
                                                className={`btnoption w-100 ${this.state.tiempo === 0 && (datos.key ? ('btn-parpadeo-verde') : ('btn-parpadeo-rojo'))} 
                                                ${this.state.botonSeleccionado === index ? datos.key ? 'btn-parpadeo-verde' : 'btn-parpadeo-rojo' : this.state.botonVerde === index ? 'btn-parpadeo-verde' : ''}`}
                                                onClick={() => this.RespuestaParticipante(index, datos.key)}
                                                disabled={this.state.botonSeleccionado !== null}
                                            >
                                                <span className="pe-3">{this.Letra(index)}:</span>
                                                <span className="text-break">{datos.respuesta} </span>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    this.state.TempRespuestas.map((datos, index) => (
                                        <div className="col-12 col-md-6 " key={index}>
                                            <button className="btnoption w-100" >
                                                <span className="pe-3 ">{datos.label}:</span><span className="text-break "></span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center  ">
                        {this.state.Respuestas.length > 0 ? (
                            <div className="col-lg-8 col-md-10 col-sm-12">
                                <div className="row g-3 mb-5">
                                    <div className="col-12 col-md-6">
                                        <button className="btnoption btnoption-lose w-100 " onClick={() => { this.Reiniciar() }}>
                                            <span className="pe-3">Reiniciar</span>
                                        </button>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <button className="btnoption btnoption-lose w-100" disabled={this.state.botonSeleccionado === null || this.state.botonVerde !== null} onClick={() => { this.IniciarPartida() }}>
                                            <span className="pe-3">Continuar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row w-25 d-flex align-items-center">
                                <button className="btnoicon btnoption-success  p-2" onClick={() => { this.IniciarPartida() }}>
                                    <span className="">Iniciar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div >
            )
        }
        return (
            <div className="pt-5">
                <HourGlass principal={true} uno={'Preguntas'} dos={'Saga'} tres={'Estadistica'} />
            </div >
        )
    }
}
