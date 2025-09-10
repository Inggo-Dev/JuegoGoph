class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    emit(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach(listener => listener(data));
    }
}

var Global = {
    eventEmitter: new EventEmitter(),
    sidebarEmitter: new EventEmitter(),

    GlobalUser: {
        Codigo: "7891"
    },



    Pagina: {
        _componente: 0,
        get componente() {
            return this._componente;
        },
        set componente(value) {
            this._componente = value;
            Global.eventEmitter.emit('paginaChange', value);
        }
    },



    Ruta: {
        Raiz: "/gophgame",
        // Url: "http://localhost:4004/japi/",
        Url: "https://goph.com.co/japi/japi/",

        version: "1.0.1",
        Ipin: "OpenSesame159*",
    },

    subscribe(callback) {
        this.eventEmitter.on('paginaChange', callback);
    },

    unsubscribe(callback) {
        this.eventEmitter.off('paginaChange', callback);
    },

};

export default Global;
