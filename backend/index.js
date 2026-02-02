import express from "express"; 
import cors from "cors";
import eventosRoutes from "./src/routes/eventos.routes.js"

const app = express();
const puerto = 3300;

//middlewares
app.use(cors());//para permitir solicitudes
app.use(express.json()); //parsear json

//rutas
/*app.get("/", (req,res) => {
    res.send("holahola mundo desde express.js");
});*/
app.use("/api/eventos", eventosRoutes);


app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${puerto}`)
});