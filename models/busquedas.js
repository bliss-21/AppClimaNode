const axios = require('axios');

class Busquedas {

    historial = [];

    constructor() {
        //TODO: leer DB si existe
    }

    async ciudad (lugar = '') {
        
        console.log('CITY ::',lugar);

        return [];//retornar lugares
    }

}


module.exports = Busquedas;