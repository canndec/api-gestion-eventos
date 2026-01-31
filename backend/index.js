import express from "express"; 
import fs from "fs";

const app = express();
const puerto = 3300;


app.get("/", (req,res) => {
    res.send("holahola mundo desde express.js");
});

app.get("/eventos", (req,res) => {
    try{
        const datos = fs.readFileSync("./src/data/eventos.json", "utf-8");
        const eventos = JSON.parse(datos);

        res.json(eventos);
    }catch(err){
        res.status(500).json({
            mensaje: "Error al leer el archivo JSON"
        });
    }
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${puerto}`)
});