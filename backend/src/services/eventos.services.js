import fs from "fs/promises";

export async function leerEventosJSON(){
    try{
        const datos = await fs.readFile("src/data/eventos.json", "utf-8");
        return JSON.parse(datos);
    }catch(err){
        console.log("Error interno para leer el archivo JSON: ", err);
    }
};

export async function buscarEventoPorId(id){

    const eventos = await leerEventosJSON();
    let idParseado = parseInt(id); 
    return eventos.find(e => e.id === idParseado);
}