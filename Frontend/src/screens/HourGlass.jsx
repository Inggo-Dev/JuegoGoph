import { Component } from 'react'
import "./../assets/styles/HourGlass.css"


export default class HourGlass extends Component {
    render() {
        if (this.props.principal === true) {
            return (
                <div className="spinnerContainer d-flex align-items-center justify-content-center " style={{ minHeight: "80vh" }}>
                    <div className="spinner"></div>
                    <div className="loader">
                        <p>Cargando</p>
                        <div className="words">
                            <span className="word"></span>
                            <span className="word">{this.props.uno}</span>
                            <span className="word">{this.props.dos}</span>
                            <span className="word">{this.props.tres}</span>
                            <span className="word">GoPH</span>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="spinnerContainer d-flex align-items-center justify-content-center m-3 " >
                    <div className="spinnerM"></div>
                    <div className="loader">
                        <p>Cargando</p>
                        <div className="words">
                            <span className="word"></span>
                            <span className="word">{this.props.uno}</span>
                            <span className="word">{this.props.dos}</span>
                            <span className="word">{this.props.tres}</span>
                            <span className="word">GoPH</span>
                        </div>
                    </div>
                </div>
            )
        }
    }
}