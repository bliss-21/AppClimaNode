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
                const lugarSeleccionado = lugares.find(l => l.id === id)

                //Clima

                //Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:');
                console.log('Mínima:');
                console.log('Máxima:');

                

                break;
        
            default:
                break;
        }


        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();
