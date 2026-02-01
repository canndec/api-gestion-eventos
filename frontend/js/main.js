
let contenedorEventos = document.getElementById("contenedorEventos");
let urlPrincipal = "http://localhost:3300";
let dataDeEventos = [];

//FUNCIONES FILTRADO Y ORDENAMIENTO

//filtro de busqueda
let inputParaFiltrar = document.getElementById("inputFiltrar");
inputParaFiltrar.addEventListener("keyup", () =>{
    let tituloABuscar = inputParaFiltrar.value.toLowerCase();
    let tituloCoincidente = dataDeEventos.filter(e => e.titulo.toLowerCase().includes(tituloABuscar));
    mostrarEventos(tituloCoincidente);
})

//ordenar por fecha
let ordenarPorFecha = document.getElementById("botonOrdenarFecha");
ordenarPorFecha.addEventListener("click", () => {
    let ordenados = [...dataDeEventos].sort((a,b) => new Date(a.fecha) - new Date(b.fecha)); 
    mostrarEventos(ordenados);
});

// filtro para seleccionar opcion (tipoEvento)
let opcionDeFiltrado = document.getElementById("tipoDeEvento");
opcionDeFiltrado.addEventListener("change",() => {
    let tipo = opcionDeFiltrado.value; 
    if(tipo === "todos"){
        mostrarEventos(dataDeEventos);
        console.log("Mostrando todos los eventos")
        return;
    }
    let filtrado = dataDeEventos.filter(evento => evento.tipo === tipo);
    console.log("Mostrando eventos de tipo:",tipo);
    mostrarEventos(filtrado);
});

// filtro para seleccionar opcion (activoSiNo)
let opcionDeActivo = document.getElementById("activoSiNo");
opcionDeActivo.addEventListener("change",async () => {
    try{
        let activo = opcionDeActivo.value;
        console.log("Mostrando eventos con tipo activo:", activo);
        let response = await fetch(`${urlPrincipal}/api/eventos?activo=${activo}`); //puede ser o true o false
        let datosActivos = await response.json();
        mostrarEventos(datosActivos);
    } catch(err){
        console.log(`Error obteniendo eventos: ${err}`);
    }

});


//FUNCIONES PARA MOSTRAR Y OBTENER DATOS
async function obtenerEventos(){
    try{
        let response = await fetch(`${urlPrincipal}/api/eventos`);
        console.log(`Solicitud fetch GET a ${urlPrincipal}/api/eventos`);
        dataDeEventos = await response.json();
        mostrarEventos(dataDeEventos);
    }catch(err){
        console.error(`Error obteniendo eventos ${err}`);
    }
}

function mostrarEventos(dataDeEventos){
    let html = "";   

    dataDeEventos.forEach(evento =>{
        html += `
        <div class="cartaDeEvento">
        <p>Tipo de evento: ${evento.tipo}</p>
        <h2>${evento.titulo}</h2>
        <p>Descripción: ${evento.descripcion}</p>
        <p>Fecha: ${evento.fecha}</p>
        <p>Modalidad: ${evento.modalidad}</p>
        <p>Ubicación: ${mostrarUbicacion(evento.ubicacion)}</p>
        <p>${mostrarActivo(evento.activo)}</p>
        <p id="feriado-${evento.id}">Consultado feriado...</p>
        </div>
        `;
    });
    contenedorEventos.innerHTML = html;
    dataDeEventos.forEach(evento => obtenerFeriado(evento.id))
}
function mostrarUbicacion(ubicacion){
    return ubicacion !== "Online" ? ubicacion : "Remota"; 
}
function mostrarActivo(activo){
    return activo !== true ? "Activo: No - Cancelado" : "Activo: Si - A realizarse";
}

async function obtenerFeriado(id){
    try{
        const response = await fetch(`${urlPrincipal}/api/eventos/${id}/feriado`);
        const datos = await response.json();
        
        const feriadoConId = document.getElementById(`feriado-${id}`);
        feriadoConId.textContent = datos.esFeriado ? `Feriado: ${datos.tipoFeriado}` : "Día hábil";
    }catch(err){
        const feriadoConId = document.getElementById(`feriado-${id}`);
        feriadoConId.textContent = "No se pudo consultar el feriado";
        console.log(err);
    }
}
obtenerEventos();