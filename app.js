require('dotenv').config()
const { async } = require('rxjs');
const { leerInput, inquirerMenu, pausa, listarLugares }  = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    let opt;
    const busquedas = new Busquedas();   


    do {
        opt = await inquirerMenu();

        switch ( opt ) {

            case 1:
                //Mostrar mensaje
                const busqueda = await leerInput('Ciudad: ');
                //Buscar los lugares
                const lugares = await busquedas.ciudad( busqueda );

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if ( id === '0') continue;

                const lugarSeleccionado = lugares.find(l => l.id === id)

                //guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre)

                //Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng );

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Estado del clima:', clima.desc);

                

                break;
            
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i +1 }`.green;
                    console.log(`${idx}. ${lugar}`);
                } );

                break;

            default:
                break;
        }


        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();
