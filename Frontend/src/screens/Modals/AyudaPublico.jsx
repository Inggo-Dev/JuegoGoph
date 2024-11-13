import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import { QRCode, Progress } from 'antd';
import logoGoph from "./../../assets/img/logo.png";
import Global from "../../Global";
import axios from "axios";
import { Buffer } from 'buffer';
import swal from "sweetalert";

export default class AyudaPublico extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Pregunta: this.props.Pregunta,
            Respuestas: this.props.Respuestas,
            id_pregunta: this.props.id_pregunta,
            cifrado: this.props.cifrado,
            Votos: [],
        };


    }


    componentDidMount() {
        this.Votos()
        this.interval = setInterval(this.Votos, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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


    Votos = () => {
        var body = {
            codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
            id_pregunta: Buffer.from("" + this.state.id_pregunta).toString("base64"),
        };
        axios.post(`${Global.Ruta.Url}game/ayudapublicoprogreso/`, body).then((res) => {
            if (res.data.message === "") {
                this.setState({ Votos: res.data.RespuestaPublico })
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


    Porcentaje = (index, data) => {
        var temp = this.state.Votos
        var count = 0
        switch (parseInt(index)) {
            case 0:
                count = temp.filter(item => item.respuesta === data).length;
                return count
            case 1:
                count = temp.filter(item => item.respuesta === data).length;
                return count
            case 2:
                count = temp.filter(item => item.respuesta === data).length;
                return count
            case 3:
                count = temp.filter(item => item.respuesta === data).length;
                return count
            default:
                return count
        }
    }

    Cerrar = () => {
        swal({
            title: "¿Desea cerrar la ayuda del publico?",
            text: "Una vez cerrada, no podrá volver a activar la ayuda del público",
            icon: "info",
            buttons: ["Cancelar", "Aceptar"],
        }).then((Aceptar) => {
            if (Aceptar) {
                var temp = this.state.Votos
                var temp1 = this.state.Respuestas
                var resa = temp.filter(item => item.respuesta === temp1[0].respuesta).length;
                var resb = temp.filter(item => item.respuesta === temp1[1].respuesta).length;
                var resc = temp.filter(item => item.respuesta === temp1[2].respuesta).length;
                var resd = temp.filter(item => item.respuesta === temp1[3].respuesta).length;
                var data = { resa: resa, resb: resb, resc: resc, resd: resd, }

                var body = {
                    codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
                    id_pregunta: Buffer.from("" + this.state.id_pregunta).toString("base64"),
                };
                axios.post(`${Global.Ruta.Url}game/ayudapublicocerrar/`, body).catch((err) => {
                    console.log("")
                });

                this.props.Cerrar(data)
            }
        });
    }


    render() {
        return (
            <div className="container-fluid" >
                <Modal.Body>
                    <div className="d-flex justify-content-center align-items-center my-4">
                        <QRCode
                            errorLevel="H"
                            type="svg"
                            value={`https://goph.com.co/GophGame/Publico/${this.state.cifrado}`}
                            icon={logoGoph}
                            size={250}
                            iconSize={100}
                            bordered={true}
                            status={'active'}
                        />
                    </div>
                    <div className="option mb-5 d-flex justify-content-center">
                        <span className="fs-5">{this.state.Pregunta !== "" ? (this.state.Pregunta) : ("GoPH Asambleas Presenciales, Virtuales y Mixtas")}</span>
                    </div>
                    <div className="row g-3 mb-5">
                        {this.state.Respuestas.map((datos, index) => (
                            <div className="col-12 col-md-6" key={index}>
                                <button className={`btnoption w-100`} onClick={() => { this.Votos() }}>
                                    <span className="pe-3">{this.Letra(index)}:</span>
                                    <span className="text-break">{datos.respuesta} </span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {this.state.Respuestas.map((datos1, index1) => (
                        <div className="row" key={index1}>
                            <div className="col-2 d-flex justify-content-center">
                                <span className="text-secondary fw-bold"> Respuesta {this.Letra(index1)}:</span>
                            </div>
                            <div className="col-10">
                                <Progress percent={((parseInt(this.Porcentaje(index1, datos1.respuesta)) * 100) / this.state.Votos.length)} format={() => `${this.Porcentaje(index1, datos1.respuesta)} Votos`} />
                            </div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-center mt-4">
                        <button className="btn btn-outline-success btn-sm w-50" onClick={() => { this.Cerrar() }}>Cerrar</button>
                    </div>

                </Modal.Body>
            </div>
        )
    }
}
