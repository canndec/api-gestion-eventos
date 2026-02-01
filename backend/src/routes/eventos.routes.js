import { Router } from "express";
import fs from "fs";
const router = Router();

function leerEventosJSON(){
    const datos = fs.readFileSync("src/data/eventos.json", "utf-8");
    return JSON.parse(datos);
};

//get: todos los eventos

/*Obtiene todos los eventos del JSON, en caso de que al hacerse el fetch se complemente con
un filtro,  este lo toma para sacar la info correspondiente 
con Query string se puede usar ej:activo=true y hace que req.query devuelva el dato*/
router.get("/", async (req,res) => {
    try {
        const eventosDeJson = await leerEventosJSON();
        const eventos = Array.isArray(eventosDeJson) ? eventosDeJson : eventosDeJson.eventos; //lo mismo parte del objeto para manejar un array
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
});

//get/:id evento con id especifico
router.get("/:id", async (req,res) =>{
    try {
        const eventos = await leerEventosJSON();
        let idParseado = parseInt(req.params.id); 
        let eventoConId = eventos.find(e => e.id === idParseado);

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
});

//get:/id/feriados, evento especifico mas info de feriado
router.get("/:id/feriado", async (req,res) => {
    try{
        const eventos = await leerEventosJSON();
        let idParseado = parseInt(req.params.id); 
        let eventoConId = eventos.find(e => e.id === idParseado);
        
        if (!eventoConId){
            console.log("No existen eventos con ese id");
            return res.status(404).json({
                mensaje: `No se encontró un evento con id ${idParseado}`
            });
        }
        let año = eventoConId.fecha.split("-")[0]; //separarlo y guardar solo el año
        
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${año}/${eventoConId.pais}`);
        const feriados = await response.json();
        let feriado = feriados.find(f => f.date === eventoConId.fecha);
        res.json({
            eventoConId,
            esFeriado: feriado ? true : false,
            tipoFeriado: feriado ? feriado.localName : null
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            mensaje: `Error interno al consultar feriados`
        })
    }
});



export default router;
