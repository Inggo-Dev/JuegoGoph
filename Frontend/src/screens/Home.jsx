import { Component } from "react";
import { Sound } from './../Helpers'
import swal from "sweetalert";
import logoGoph from "./../assets/img/logo.png";
import SAGA from "./../assets/img/SAGA.png";
import SAGAC from "./../assets/img/SAGAC.png";
import Sinergia from "./../assets/img/Sinergia.png";
import Aseco from "./../assets/img/Aseco.png";
import Asesores from "./../assets/img/Asesores.png";
import empresas from "./../assets/img/empresas.png";
import { Howl } from 'howler';
import Global from "../Global";


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sonido: false
        };
        this.soundini = new Howl({
            src: [Sound(1)],
            volume: 1,
            onend: () => { this.sound.play() }
        });
    }


    restartSound = () => {
        var sonido = this.state.sonido
        sonido ? (this.soundini.stop()) : (this.soundini.play())
        this.setState({ sonido: !sonido })
    }

    componentWillUnmount() {
        this.soundini.stop();
    }



    Saga = () => {
        swal({
            title: "SAGA",
            text: `El Grupo SAGA es una alianza estratégica conformada por cuatro empresas líderes en sus respectivos campos: 
            

             Sinergia Consultores.

             Asesores y Administradores de PH S.A.S.

             GOPH Software para Propiedad Horizontal.

             ASECO S.A. Abogados y Asesores en Cobranzas. 
             

             Juntos, trabajamos para fortalecer el conocimiento y las habilidades de los diversos actores de la Propiedad Horizontal a nivel nacional, con un enfoque académico y formativo.
             
             Nuestro epicentro de actividades es el Eje Cafetero, aprovechando las fortalezas únicas de cada empresa para ofrecer soluciones integrales y de alta calidad.`,
            icon: "success",
            button: "Aceptar",
        })
    }

    render() {
        return (
            <div className="container-fluid" >

                <div className=" pt-2">
                    <div className='d-none d-md-block'>
                        <div className="d-flex justify-content-between align-items-center ">
                            <img className="Icon_S" src={Sinergia} alt="GoPH" />
                            <img className="Icon_G" src={Asesores} alt="GoPH" />
                            <img className="Icon_G" src={logoGoph} alt="GoPH" />
                            <img className="Icon_G" src={Aseco} alt="GoPH" />
                            <button className="btn btn-outline-primary opacity-50" onClick={() => { this.restartSound() }}>{this.state.sonido ? (<i className="fa-solid fa-volume-high"></i>) : (<i className="fa-solid fa-volume-xmark"></i>)} </button>
                        </div>
                    </div>
                    <div className='d-block d-md-none'>
                        <div className=" d-flex justify-content-center align-items-center">
                            <img className="Icon_E" src={empresas} alt="GoPH" />
                            <button className="btn btn-outline-primary opacity-50" onClick={() => { this.restartSound() }}>{this.state.sonido ? (<i className="fa-solid fa-volume-high"></i>) : (<i className="fa-solid fa-volume-xmark"></i>)} </button>
                        </div>

                    </div>
                </div>

                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <div className="col-lg-8 col-md-10 col-sm-12">
                        <div className='d-none d-md-block'>
                            <div className="d-flex justify-content-center align-items-center m-3">
                                <img className="m-5" src={SAGA} alt="Logo_M" />
                            </div>
                        </div>
                        <div className='d-block d-md-none'>
                            <div className="d-flex justify-content-center align-items-center m-3">
                                <img className="m-5" src={SAGAC} alt="Logo_M" />
                            </div>
                        </div>
                        <div className="option mb-5 d-flex justify-content-center">
                            <span className="fs-5">¡Grupo SAGA: Juega y Aprende en Propiedad Horizontal!</span>
                        </div>
                        <div className="row g-3 mb-5">
                            <div className="col-12 col-md-6 ">
                                <button className="btnoption btnoption-success w-100" onClick={() => { Global.Pagina.componente = 2 }}>
                                    <span className="pe-3 "  >A:</span><span className="text-break ">Iniciar</span>
                                </button>
                            </div>
                            <div className="col-12 col-md-6">
                                <button className="btnoption btnoption-success w-100" onClick={() => { Global.Pagina.componente = 4 }}>
                                    <span className="pe-3">B:</span><span className="text-break ">Puntajes</span>
                                </button>
                            </div>
                            <div className="col-12 col-md-6">
                                <button className="btnoption btnoption-lose w-100 " onClick={() => { this.Saga() }}>
                                    <span className="pe-3">C:</span><span className="text-break ">SAGA</span>
                                </button>
                            </div>
                            <div className="col-12 col-md-6">
                                <button className="btnoption btnoption-lose w-100">
                                    <span className="pe-3">D:</span><span className="text-break ">Configuración</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
