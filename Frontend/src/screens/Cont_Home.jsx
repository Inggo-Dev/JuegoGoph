import React, { Component } from "react";
import Global from "./../Global";
import Home from "./Home";
import Admin from "./Admin";
import Juega from "./Juega";
import Historial from "./Historial";

export default class Cont_Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentComponent: Global.Pagina.componente,
    };
  }
  componentDidMount() {
    Global.subscribe(this.handlePaginaChange);
  }

  componentWillUnmount() {
    Global.unsubscribe(this.handlePaginaChange);
  }

  handlePaginaChange = (newComponent) => {
    this.setState({ currentComponent: newComponent });
  }


  SwitchComp = () => {
    switch (this.state.currentComponent) {
      case 0:
        return <Home />;
      case 1:
        return <Admin />;
      case 2:
        return <Juega />;
      case 4:
        return <Historial />;


      default:
        return <Home />;
    }
  };




  render() {
    return <React.Fragment>
      {this.SwitchComp()}
    </React.Fragment>
  }
}
