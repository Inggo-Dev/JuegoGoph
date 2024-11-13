import { Component } from "react";
import Global from "../Global";
import axios from "axios";
import { Buffer } from 'buffer';
import swal from "sweetalert";
import HourGlass from "./HourGlass";
import TablaMaster from './TablaMaster';
import logoGoph from "./../assets/img/logo.png";
import Sinergia from "./../assets/img/Sinergia.png";
import Aseco from "./../assets/img/Aseco.png";
import Asesores from "./../assets/img/Asesores.png";
import empresas from "./../assets/img/empresas.png";

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

export default class Historial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: false,
            HourGlass: false,
            Historial: [],
            Cols: []
        };
    }


    componentDidMount() {
        this.Historial()
    }

    Historial = () => {
        this.setState({ data: false })
        var body = {
            codigo: Buffer.from("" + Global.GlobalUser.Codigo).toString("base64"),
            id_pregunta: Buffer.from("" + this.state.id_pregunta).toString("base64"),
        };
        axios.post(`${Global.Ruta.Url}game/historial/`, body).then((res) => {
            if (res.data.message === "") {

                var cols = [
                    {
                        title: <div style={{ textAlign: 'center' }}>Item</div>,
                        dataIndex: 'id_historial',
                        key: 'id_historial',
                        sorter: (a, b) => a.id_historial - b.id_historial,
                        defaultSortOrder: 'descend',
                        align: 'center',
                        width: 10,
                        style: { padding: 0, margin: 0, lineHeight: 'normal' },
                        render: (text, record, index) => index + 1,
                    },
                    {
                        title: <div style={{ textAlign: 'center' }}>Nombre</div>,
                        dataIndex: 'nombre',
                        key: 'nombre',
                        sorter: (a, b) => a.nombre.localeCompare(b.nombre),
                        defaultSortOrder: 'descend',
                        style: { padding: 0, margin: 0, lineHeight: 'normal' },

                        render: (text) => <span style={{ textTransform: 'uppercase' }}>{text}</span>
                    },
                    {
                        title: <div style={{ textAlign: 'center' }}>Puntaje</div>,
                        dataIndex: 'puntaje',
                        key: 'puntaje',
                        sorter: (a, b) => a.puntaje - b.puntaje,
                        defaultSortOrder: 'descend',
                        align: 'center',
                        style: { padding: 0, margin: 0, lineHeight: 'normal' },
                        width: 20,

                    },
                    {
                        title: <div style={{ textAlign: 'center' }}>Fecha</div>,
                        dataIndex: 'fecha',
                        key: 'fecha',
                        sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
                        render: (data) => dayjs(data).format("DD MMM YYYY HH:mm:ss"),
                        align: 'end',
                        style: { padding: 0, margin: 0, lineHeight: 'normal' },
                        width: 200,
                    },
                    // {
                    //     title: <div style={{ textAlign: 'center' }}>Acción</div>,
                    //     dataIndex: 'estado',
                    //     key: 'estado',
                    //     sorter: (a, b) => a.item.localeCompare(b.item),
                    //     defaultSortOrder: 'descend',
                    //     width: 10,
                    //     style: { padding: 0, margin: 0, lineHeight: 'normal' },
                    //     render: (data, record) =>
                    //         <div className="d-flex justify-content-center align-items-center">
                    //             {parseInt(data) < 0 ? (
                    //                 <Tooltip title="Postularme" color='blue'> <button className="btn btn-outline-primary btn-sm " disabled={!record.postulacion} onClick={() => { this.VerificaOpcion(record, 1) }}> <i className="fa-regular fa-hand"></i></button> </Tooltip>) :
                    //                 (<Tooltip title="Eliminar Postulación" color='Red'><button className="btn btn-outline-danger btn-sm" onClick={() => { this.VerificaOpcion(record, 3) }}> <i className="fa-regular fa-trash-can"></i></button> </Tooltip>)}
                    //         </div >
                    // },
                ]


                this.setState({ Historial: res.data.Historial, Cols: cols }, () => {
                    this.setState({ data: true })
                })
            } else {
                this.setState({ data: true })
                swal({
                    title: "Atención",
                    text: res.data.message,
                    icon: "info",
                    button: "Aceptar",
                }).then(() => { Global.Pagina.componente = 0 })
            }
        }).catch((err) => {
            this.setState({ data: true })
            swal({
                title: "ALERTA!",
                text: "Vaya algo ha salido mal, por favor vuelva a intentarlo.",
                icon: "error",
                button: "Aceptar",
            }).then(() => { Global.Pagina.componente = 0 })
        });
    }


    render() {

        if (this.state.data) {
            return (
                <div className="container-fluid bg-light min-vh-100">

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


                    <div className="mt-4">
                        <TablaMaster
                            datos={this.state.Historial}
                            cols={this.state.Cols}
                            title={
                                <div>
                                    <button className="btn btn-outline-success me-3" onClick={() => { Global.Pagina.componente = 0 }}>Regresar </button>
                                    <span className='fs-6 fw-bold text-secondary'>Historial</span>
                                </div>}
                            footer={(
                                <div className="col-12 d-flex justify-content-center">
                                    <span className="text-secondary">Total Jugadores: <span className="fw-bold text-secondary">{this.state.Historial.length}</span></span>
                                </div>
                            )}
                        />
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
