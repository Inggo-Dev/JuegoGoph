import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import HourGlass from "./HourGlass";
import logoGoph from "./../assets/img/logo.png";
import SAGAC from "./../assets/img/SAGAC.png";
import Sinergia from "./../assets/img/Sinergia.png";
import Aseco from "./../assets/img/Aseco.png";
import Asesores from "./../assets/img/Asesores.png";
import empresas from "./../assets/img/empresas.png";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Global from "./../Global";
import axios from "axios";
import { Buffer } from 'buffer';
import swal from "sweetalert";

export default class Publico extends Component {

    constructor(props) {
        super(props);
        this.state = {
            HourGlass: false,
            data: true,
            id_pregunta: "",
            hash: "",
            Pregunta: "",
            Respuestas: [],

        };
    }

    async componentDidMount() {
        var id_pregunta = this.props.match.params.pregunta;
        if (id_pregunta !== undefined) {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const deviceId = result.visitorId;
            this.setState({ id_pregunta: id_pregunta, hash: deviceId, mounted: true }, () => {
                this.BuscarPreguntas();
            });
        }
    }



    BuscarPreguntas = () => {
        this.setState({ HourGlass: true })
        var body = {
            codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
            id_pregunta: Buffer.from("" + this.state.id_pregunta).toString("base64"),
        };
        axios.post(`${Global.Ruta.Url}game/ayudapublico/`, body).then((res) => {
            if (res.data.message === "") {
                this.setState({ Pregunta: res.data.Pregunta, Respuestas: res.data.Respuestas, HourGlass: false })
            } else {
                this.setState({ HourGlass: false })
                swal({
                    title: "Atención",
                    text: res.data.message,
                    icon: "info",
                    button: "Aceptar",
                }).then(() => { window.location.href = 'https://www.inggos.com/' })
            }
        }).catch((err) => {
            this.setState({ HourGlass: false })
            swal({
                title: "ALERTA!",
                text: "Vaya algo ha salido mal, por favor vuelva a intentarlo.",
                icon: "error",
                button: "Aceptar",
            }).then(() => { window.location.href = 'https://www.inggos.com/' })
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

    Votar = (respuesta) => {
        this.setState({ HourGlass: true })

        var body = {
            codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
            id_pregunta: Buffer.from("" + this.state.id_pregunta).toString("base64"),
            identificador: Buffer.from("" + this.state.hash).toString("base64"),
            respuesta: Buffer.from("" + respuesta).toString("base64"),
        };
        axios.post(`${Global.Ruta.Url}game/votarayudapublico/`, body).then((res) => {
            this.setState({ HourGlass: false })
            if (res.data.message === "") {
                swal({
                    title: "SAGA",
                    text: `su voto ha sido registrado. 

                    ${respuesta}`,
                    icon: "success",
                    button: "Aceptar",
                }).then(() => { window.location.href = 'https://www.inggos.com/' })
            } else {

                swal({
                    title: "Atención",
                    text: res.data.message,
                    icon: "info",
                    button: "Aceptar",
                }).then(() => { window.location.href = 'https://www.inggos.com/' })
            }
        }).catch((err) => {
            this.setState({ HourGlass: false })
            swal({
                title: "ALERTA!",
                text: "Vaya algo ha salido mal, por favor vuelva a intentarlo.",
                icon: "error",
                button: "Aceptar",
            }).then(() => { window.location.href = 'https://www.inggos.com/' })
        });
    }



    render() {

        if (this.state.data) {
            return (
                <div className="">
                    <Modal show={this.state.HourGlass} size="md" centered onHide={() => { this.setState({ HourGlass: false }) }}>
                        <HourGlass principal={false} uno={'Preguntas'} dos={'Saga'} tres={'Estadistica'} />
                    </Modal>
                    <div className=" p-2 bg-light">
                        <div className='d-none d-md-block'>
                            <div className="d-flex justify-content-between align-items-center ">
                                <img className="Icon_S" src={Sinergia} alt="GoPH" />
                                <img className="Icon_G" src={Asesores} alt="GoPH" />
                                <img className="Icon_G" src={logoGoph} alt="GoPH" />
                                <img className="Icon_G" src={Aseco} alt="GoPH" />
                            </div>
                        </div>
                        <div className='d-block d-md-none'>
                            <div className=" d-flex justify-content-center align-items-center">
                                <img className="Icon_E" src={empresas} alt="GoPH" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className='d-none d-md-block'>
                                <div className="d-flex justify-content-center align-items-center m-3">
                                    <img className="m-5" src={SAGAC} alt="Logo_M" />
                                </div>
                            </div>
                            <div className='d-block d-md-none'>
                                <div className="d-flex justify-content-center align-items-center m-3">
                                    <img className="m-0" src={SAGAC} alt="Logo_M" />
                                </div>
                            </div>
                            <div className="option mb-5 d-flex justify-content-center">
                                <span className="fs-5">{this.state.Pregunta !== "" ? (this.state.Pregunta) : ("GoPH Asambleas Presenciales, Virtuales y Mixtas")}</span>
                            </div>
                            <div className="row g-3 mb-5">
                                {this.state.Respuestas.map((datos, index) => (
                                    <div className="col-12 col-md-6 " key={index}>
                                        <button className="btnoption btnoption-success w-100" onClick={() => { this.Votar(datos.respuesta) }} >
                                            <span className="pe-3 ">{this.Letra(index)}:</span><span className="text-break ">{datos.respuesta}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }




        return (
            <div>
                <div className=" p-2">
                    <div className='d-none d-md-block'>
                        <div className="d-flex justify-content-between align-items-center ">
                            <img className="Icon_S" src={Sinergia} alt="GoPH" />
                            <img className="Icon_G" src={Asesores} alt="GoPH" />
                            <img className="Icon_G" src={logoGoph} alt="GoPH" />
                            <img className="Icon_G" src={Aseco} alt="GoPH" />
                        </div>
                    </div>
                    <div className='d-block d-md-none'>
                        <div className=" d-flex justify-content-center align-items-center">
                            <img className="Icon_E" src={empresas} alt="GoPH" />
                        </div>
                    </div>
                </div>
                <HourGlass principal={true} uno={'Preguntas'} dos={'Saga'} tres={'Estadistica'} />
            </div>
        )
    }
}
