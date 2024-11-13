import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Global from './Global';
import Cont_Home from './screens/Cont_Home';
import Publico from './screens/Publico';

function Router() {

    return (
        // <Suspense>
        <BrowserRouter>
            {/* CONFIGURAR RUTAS Y PAGINAS */}
            <Switch>

                <Route exact path={Global.Ruta.Raiz + "/"} component={Cont_Home} />

                <Route exact path={Global.Ruta.Raiz + "/Publico/:pregunta/"} component={Publico} />

            </Switch>
        </BrowserRouter>
        // </Suspense>
    );

}

export default Router;