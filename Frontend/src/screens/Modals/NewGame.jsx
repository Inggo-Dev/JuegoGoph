import { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import { Divider, Input, Switch } from 'antd';
import HourGlass from "../HourGlass";
import SimpleReactValidator from 'simple-react-validator'
import Global from "../../Global";
import { Howl } from 'howler';
import axios from "axios";
import { Buffer } from 'buffer';
import swal from "sweetalert";


export default class NewGame extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                required: 'El campo es requerido.',
            }
        });

        this.state = {
            HourGlass: false,
            Nombre: "",
            gophia: true,
            banco: false,
        };
    }



    Guardar = () => {

        if (this.validator.allValid()) {
            this.setState({ HourGlass: true })
            var body = {
                codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
                nombre: Buffer.from("" + this.state.Nombre).toString("base64"),
                tipo: Buffer.from("" + this.state.gophia ? ("0") : ("1")).toString("base64"),
            };

            axios.post(`${Global.Ruta.Url}game/newgame/`, body).then((res) => {
                if (res.data.message === "") {
                    this.setState({ HourGlass: false })
                    var datos = {
                        Nombre: this.state.Nombre,
                        gophia: this.state.gophia,
                        id_jugador: res.data.id
                    }

                    this.props.NewGame(datos)

                } else {
                    swal({
                        title: "ALERTA!",
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
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }





    render() {

        if (!this.state.HourGlass) {
            return (
                <div className="container-fluid">
                    <Modal.Header>
                        <div className="card-header"><span className="fw-bold text-secondary">Nuevo Jugador</span></div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="flex-column align-items-center justify-content-center">
                            <Input className="w-100 px-4" placeholder="Nombre del Jugador" value={this.state.Nombre} onChange={(e) => { this.setState({ Nombre: e.target.value.toUpperCase() }) }} />
                            <label className='text-muted  m-0 px-1 txt-helper' style={{ fontSize: "11px" }}>{this.validator.message('Nombre', this.state.Nombre, 'required', { className: 'text-danger' })}</label>
                        </div>
                        <div className="col d-flex align-items-start flex-column my-2">
                            <div className="d-flex align-items-center w-100">
                                <span className="col-5 text-secondary">¿Preguntas por GoPH IA?</span>
                                <div className="col ms-5">
                                    <Switch checkedChildren="Si" unCheckedChildren="No" value={this.state.gophia} onChange={(e) => this.setState({ gophia: e, banco: !e })} />
                                </div>
                            </div>
                        </div>
                        <div className="col d-flex align-items-start flex-column my-2">
                            <div className="d-flex align-items-center w-100">
                                <span className="col-5 text-secondary">¿Banco de Preguntas?</span>
                                <div className="col ms-5">
                                    <Switch checkedChildren="Si" unCheckedChildren="No" value={this.state.banco} onChange={(e) => this.setState({ banco: e, gophia: !e })} />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Divider className="mt-0" />
                    <div className="d-flex align-items-center justify-content-center my-3 ">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 d-flex  my-3 ">
                            <button className="btn btn-outline-secondary btn-sm w-100 me-2" onClick={() => { Global.Pagina.componente = 0 }}>Regresar</button>
                            <button className="btn btn-outline-primary btn-sm w-100 " onClick={() => { this.Guardar() }}>Guardar</button>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <HourGlass principal={false} uno={'Preguntas'} dos={'Saga'} tres={'Estadistica'} />
        )
    }
}