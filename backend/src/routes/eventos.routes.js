import { Router } from "express";
import fs from "fs";
const router = Router();

function leerEventosJSON(){
    const datos = fs.readFileSync("src/data/eventos.json", "utf-8");
    return JSON.parse(datos);
};

//get: todos los eventos
router.get("/", (req,res) => {
    try {
        const datos = leerEventosJSON();
        res.json(datos);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            mensaje: "Error interno al obtener datos del archivo"
        })
    }
});

//get/:id evento con id especifico
router.get("/:id", (req,res) =>{
    try {
        const eventos = leerEventosJSON();
        const idParseado = parseInt(req.params.id); 
        const eventoConId = eventos.find(e => e.id === idParseado);

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

export default router;
