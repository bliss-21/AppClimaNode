const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json'

    constructor() {
        //TODO: leer DB si existe
        this.leerDB();
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
    get historialCapitalizado() {
        //capitalizar  historial
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });
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

    agregarHistorial( lugar = '' ) {
        //prevenir duplicados
        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }

        //guardamos maximos 6 ciudades
        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //grabar en DB
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial,
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload) );
    }

    leerDB() {
        // debe de existir db
        if( !fs.existsSync(this.dbPath) ){
            return;
        }

        // guardar en historial
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8'} );
        const data = JSON.parse(info)
        this.historial = data.historial
    }

}


module.exports = Busquedas;