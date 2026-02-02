# Gestión de Eventos
Proyecto desarrollado con **JavaScript**, **Node.js** y **Express**, utilizando un archivo JSON para el consumo de datos y una **API externa** de feriados (Nager.Date) para complementar información a los eventos


## Funcionalidades
- Presentación de eventos en formato tarjetas
- Busqueda de eventos por titulos
- Filtrar por tipo de evento
- Filtrar por estado de evento (Activo o cancelado)
- Ordenar eventos por fecha 
- Consulta de feriados mediante API externa

## Endpoints
`- GET /api/eventos` -> Obtener todos los eventos

`- GET /api/eventos?activo=true|false` -> Obtener los eventos filtrados por el tipo de estado

`- GET /api/eventos/:id` -> Obtener el evento por id 

`- GET /api/eventos/:id/feriado` -> Devuelve si la fecha del evento con id es feriado

## ¿Cómo ejecutar el proyecto?
1. Clonar repositorio
```bash
git clone https://github.com/canndec/api-gestion-eventos.git
```
2. Configuración
```bash
cd backend
npm install
```
3. Levantar servidor
```bash
npm run dev
# para iniciar el front. 
# click derecho sobre index.html -> 
"Open with Live server"
```


### 👩‍💻 Candela Magalí Corral