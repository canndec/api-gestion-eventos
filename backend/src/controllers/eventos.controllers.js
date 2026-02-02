import { buscarEventoPorId, leerEventosJSON } from "../services/eventos.services.js";

/*Obtiene todos los eventos del JSON, en caso de que al hacerse el fetch se complemente con
un filtro,  este lo toma para sacar la info correspondiente 
con Query string se puede usar ej:activo=true y hace que req.query devuelva el dato*/
export const obtenerTodosLosEventos = async (req,res) => {
    try {
        const eventos = await leerEventosJSON();
        let datosFiltrados = eventos;

        let eventoActivo = req.query.activo; //devuelve el true o false del activo:"";

        if(eventoActivo === "true"){
            datosFiltrados = eventos.filter(e => e.activo === true);
        }else if (eventoActivo === "false"){
            datosFiltrados = eventos.filter(e => e.activo === false);
        }
        res.json(datosFiltrados); //puede o dar todos los evento, o en caso que haya un filtro (al agregarle info extra a la ruta)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            mensaje: "Error interno al obtener datos del archivo"
        })
    }
}

export const obtenerEventoPorId = async (req,res) =>{
    try {
        let eventoConId = await buscarEventoPorId(req.params.id);

        if (!eventoConId){
            console.log("No existen eventos con ese id");
            return res.status(404).json({
                mensaje: `No se encontró un evento con id ${idParseado}`
            });
        }
        res.json(eventoConId);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            mensaje: `Error interno al obtener el evento con id ${idParseado}`
        })
    }
}

export const obtenerFeriadoPorId = async (req,res) => {
    try{
        let infoEvento = await buscarEventoPorId(req.params.id); //await porq buscarevento.. devuelve una promise

        if (!infoEvento){
            console.log("No existen eventos con ese id");
            return res.status(404).json({
                mensaje: `No se encontró un evento con id ${req.params.id}`
            });
        }

        console.log(infoEvento);
        let año = infoEvento.fecha.split("-")[0]; //separarlo y guardar solo el año
        
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${año}/${infoEvento.pais}`); //API externa
        const feriados = await response.json(); //parseo
        let feriado = feriados.find(f => f.date === infoEvento.fecha);
        res.json({
            infoEvento,
            esFeriado: feriado ? true : false,
            tipoFeriado: feriado ? feriado.localName : null
        }); //se agrega como obj el evento si es feriado y su nombre en caso de corresponder
        // la respuesta pasa a ser un objeto donde tiene el array con los datos del evento y otro con datos del feriado agregado
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            mensaje: `Error interno al consultar feriados`
        })
    }
}