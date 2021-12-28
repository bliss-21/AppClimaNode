const axios = require('axios');

class Busquedas {

    historial = [];

    constructor() {
        //TODO: leer DB si existe
    }

    get paramsMapbox() {
        return {
            'limit':'5',
            'language':'es',
            'access_token':process.env.MAPBOX_KEY,
        }
    }

    async ciudad (lugar = '') {
        
        try {
            
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox,
            })

            const resp = await intance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            
        }

        return [];//retornar lugares
    }

}


module.exports = Busquedas;