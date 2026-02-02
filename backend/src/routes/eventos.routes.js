import { Router } from "express";

import { obtenerEventoPorId, obtenerFeriadoPorId, obtenerTodosLosEventos } from "../controllers/eventos.controllers.js";
const router = Router();

router.get("/", obtenerTodosLosEventos); //get: todos los eventos - && /activo=true|false
router.get("/:id", obtenerEventoPorId); //get/:id evento con id especifico
router.get("/:id/feriado", obtenerFeriadoPorId); //get:/id/feriados, evento especifico mas info de feriado


export default router;
