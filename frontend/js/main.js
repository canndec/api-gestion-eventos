let contenedorEventos = document.getElementById("contenedorEventos");
let urlPrincipal = "http://localhost:3300";
let dataDeEventos = [];

let inputParaFiltrar = document.getElementById("inputFiltrar");
inputParaFiltrar.addEventListener("keyup", () =>{
    let tituloABuscar = inputParaFiltrar.value.toLowerCase();
    let tituloCoincidente = dataDeEventos.filter(e => e.titulo.toLowerCase().includes(tituloABuscar));
    mostrarEventos(tituloCoincidente);
})

let ordenarPorFecha = document.getElementById("botonOrdenarFecha");
ordenarPorFecha.addEventListener("click", () => {
    let ordenados = [...dataDeEventos].sort((a,b) => new Date(a.fecha) - new Date(b.fecha)); 
    mostrarEventos(ordenados);
});

let opcionDeFiltrado = document.getElementById("tipoDeEvento");
opcionDeFiltrado.addEventListener("change",() => {
    let tipo = opcionDeFiltrado.value; 
    if(tipo === "todos"){
        mostrarEventos(dataDeEventos);
        return;
    }
    let filtrado = dataDeEventos.filter(evento => evento.tipo === tipo);
    mostrarEventos(filtrado);
});


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
    contenedorEventos.innerHTML = "";   

    dataDeEventos.forEach(evento =>{
        contenedorEventos.innerHTML += `
        <div class="cartaDeEvento">
        <p>Tipo de evento: ${evento.tipo}</p>
        <h2>${evento.titulo}</h2>
        <p>Descripción: ${evento.descripcion}</p>
        <p>Fecha: ${evento.fecha}</p>
        <p>Modalidad: ${evento.modalidad}</p>
        <p>Ubicación: ${mostrarUbicacion(evento.ubicacion)}</p>
        <p>${mostrarActivo(evento.activo)}</p>
        <p id="feriado-${evento.id}">...</p>
        </div>
        `;
        obtenerFeriado(evento.id); //manejarlo a parte
    });
}
function mostrarUbicacion(ubicacion){
    return ubicacion != "Online" ? ubicacion : "Remota"; 
}
function mostrarActivo(activo){
    return activo != true ? "Cancelado" : "A realizarse";
}

async function obtenerFeriado(id){
    const response = await fetch(`${urlPrincipal}/api/eventos/${id}/feriado`);
    const datos = await response.json();

    const feriadoConId = document.getElementById(`feriado-${id}`);
    feriadoConId.textContent = datos.esFeriado ? `Feriado: ${datos.tipoFeriado}` : "Día hábil";
}
obtenerEventos();