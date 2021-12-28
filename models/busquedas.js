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

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            lang: 'es',
            units: 'metric',
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

    async climaLugar( lat, lon) {

        try {

            // intancia axios create
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {lat, lon, ...this.paramsWeather},
            })
            
            //respuesta data
            const resp = await intance.get();
            const {weather, main} = resp.data;

            //retornar
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }
            
        } catch (error) {
            console.log(error);
        }

    }


}


module.exports = Busquedas;