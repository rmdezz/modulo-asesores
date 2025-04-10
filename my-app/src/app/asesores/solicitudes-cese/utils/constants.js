// Configuración de estados para solicitudes
export const estadoConfig = {
    pendiente: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      texto: "Pendiente de revisión",
      icono: "Timer"
    },
    aprobado: {
      color: "bg-green-100 text-green-800 border-green-200",
      texto: "Aprobada",
      icono: "CheckCircle"
    },
    rechazado: {
      color: "bg-red-100 text-red-800 border-red-200",
      texto: "Rechazada",
      icono: "XCircle"
    },
    pendiente_informacion: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      texto: "Información adicional requerida",
      icono: "Info"
    }
  };
  
  // Opciones de ordenamiento
  export const opcionesOrdenamiento = [
    { valor: "fecha_desc", texto: "Más recientes" },
    { valor: "fecha_asc", texto: "Más antiguas" },
    { valor: "urgencia", texto: "Urgencia" },
    { valor: "tesistas", texto: "N° de tesistas" }
  ];
  
  // Asesores sugeridos de ejemplo (mock)
  export const asesoresSugeridos = [
    { id: "A101", nombre: "Dr. Luis Ramírez", especialidad: "Ingeniería Informática", tesistasActuales: 2 },
    { id: "A102", nombre: "Dr. Javier Pérez", especialidad: "Ingeniería Informática", tesistasActuales: 1 },
    { id: "A103", nombre: "Dra. Claudia Vásquez", especialidad: "Ingeniería Informática", tesistasActuales: 3 }
  ];