import express from "express"; 

import eventosRoutes from "./src/routes/eventos.routes.js"

const app = express();
const puerto = 3300;


app.get("/", (req,res) => {
    res.send("holahola mundo desde express.js");
});

app.use("/eventos", eventosRoutes);

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${puerto}`)
});