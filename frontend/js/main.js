
let contenedorEventos = document.getElementById("contenedorEventos"); //contenedor de las tarjetas
let urlPrincipal = "http://localhost:3300";
let dataDeEventos = [];

//FUNCIONES FILTRADO Y ORDENAMIENTO

//filtro de busqueda
let inputParaFiltrar = document.getElementById("inputFiltrar");
inputParaFiltrar.addEventListener("keyup", () =>{
    let tituloABuscar = inputParaFiltrar.value.toLowerCase();
    let tituloCoincidente = dataDeEventos.filter(e => e.titulo.toLowerCase().includes(tituloABuscar));
    if(tituloCoincidente.length === 0){
        contenedorEventos.innerHTML = `<div id="mensajeNoHay"><p>No hay eventos relacionados</p></div>`;
        return;
    }
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
            <p>Tipo de evento: <strong>${evento.tipo}</strong></p>
            <h2>${evento.titulo}</h2>
            <p>${evento.descripcion}</p>
            <p>Fecha: ${evento.fecha}</p>
            <p>Modalidad: ${mostrarModalidad(evento.modalidad)}</strong></p>
            <p>Ubicación: ${mostrarUbicacion(evento.ubicacion)}</p>
            <p>${mostrarActivo(evento.activo)}</p>
            <p id="feriado-${evento.id}">Consultado feriado...</p>
        </div>
        `;
    });
    contenedorEventos.innerHTML = html;
    dataDeEventos.forEach(evento => obtenerFeriado(evento.id)); //en caso de que sea feriado(por API) lo agrega
}

function mostrarModalidad(modalidad){
    let tipoModalidad = modalidad === "Online" ? "Virtual" : modalidad;
    let nombreClase = tipoModalidad === "Virtual" ? "modalidadVirtual" : "modalidadPresencial";
    return `<strong class="${nombreClase}">${tipoModalidad}</strong>`;
}

function mostrarUbicacion(ubicacion){
    return ubicacion !== "Online" ? ubicacion : "Remota"; 
}

function mostrarActivo(activo){
    return activo !== true ? `<strong> Activo: No - Cancelado </strong>` : "Activo: Si - A realizarse";
}

async function obtenerFeriado(id){
    try{
        const response = await fetch(`${urlPrincipal}/api/eventos/${id}/feriado`);
        const datos = await response.json();
        
        const feriadoConId = document.getElementById(`feriado-${id}`); //edita segun dato de feriado
        feriadoConId.textContent = datos.esFeriado ? `Feriado: ${datos.tipoFeriado}` : "Día hábil"; //de datos solo la info necesaria
    }catch(err){
        const feriadoConId = document.getElementById(`feriado-${id}`);
        feriadoConId.textContent = "No se pudo consultar el feriado";
        console.log(err);
    }
}
obtenerEventos();