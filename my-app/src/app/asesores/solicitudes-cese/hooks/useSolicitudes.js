import { useState, useEffect } from 'react';
import { datosSolicitudes, coordinadorInfo } from '../data/mockData';
import { parseISO, differenceInDays } from 'date-fns';

/**
 * Hook para gestionar y filtrar solicitudes
 * @returns {Object} Estado y funciones para manipular solicitudes
 */
export const useSolicitudes = () => {
  // Estados para filtros y ordenamiento
  const [vistaActual, setVistaActual] = useState("activas");
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("fecha_desc");
  
  // Estado para la solicitud seleccionada
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  
  // Filtrar solicitudes por especialidad del coordinador
  const solicitudesDeLaEspecialidad = datosSolicitudes.filter(
    s => s.asesor.especialidad === coordinadorInfo.especialidad
  );
  
  // Efecto para filtrar solicitudes según la vista actual y los filtros aplicados
  useEffect(() => {
    let resultado = solicitudesDeLaEspecialidad;
    
    // Primero aplicar filtro por vista activa/histórica
    if (vistaActual === "activas") {
      resultado = resultado.filter(s => 
        s.estado === "pendiente" || 
        s.estado === "pendiente_informacion"
      );
    } else if (vistaActual === "completadas") {
      resultado = resultado.filter(s => 
        s.estado === "aprobado" || 
        s.estado === "rechazado"
      );
    }
    
    // Luego aplicar filtro de estado específico si está seleccionado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter(s => s.estado === filtroEstado);
    }
    
    // Filtrar por búsqueda
    if (busqueda) {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(s => 
        s.id.toLowerCase().includes(terminoBusqueda) ||
        s.asesor.nombre.toLowerCase().includes(terminoBusqueda) ||
        s.tesistas.some(t => t.nombre.toLowerCase().includes(terminoBusqueda)) ||
        s.tesistas.some(t => t.titulo.toLowerCase().includes(terminoBusqueda))
      );
    }
    
    // Ordenar resultados
    if (ordenarPor === "fecha_desc") {
      resultado.sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud));
    } else if (ordenarPor === "fecha_asc") {
      resultado.sort((a, b) => new Date(a.fechaSolicitud) - new Date(b.fechaSolicitud));
    } else if (ordenarPor === "urgencia") {
      resultado.sort((a, b) => {
        const diasA = differenceInDays(parseISO(a.fechaLimite), new Date());
        const diasB = differenceInDays(parseISO(b.fechaLimite), new Date());
        return diasA - diasB;
      });
    } else if (ordenarPor === "tesistas") {
      resultado.sort((a, b) => b.tesistas.length - a.tesistas.length);
    }
    
    setSolicitudesFiltradas(resultado);
  }, [vistaActual, filtroEstado, busqueda, ordenarPor]);
  
  // Obtiene los estados disponibles según la vista actual
  const getEstadosDisponibles = () => {
    if (vistaActual === "activas") {
      return [
        { valor: "todos", texto: "Todos los estados" },
        { valor: "pendiente", texto: "Pendientes" },
        { valor: "pendiente_informacion", texto: "Info. Requerida" }
      ];
    } else if (vistaActual === "completadas") {
      return [
        { valor: "todos", texto: "Todos los estados" },
        { valor: "aprobado", texto: "Aprobadas" },
        { valor: "rechazado", texto: "Rechazadas" }
      ];
    } else {
      return [
        { valor: "todos", texto: "Todos los estados" },
        { valor: "pendiente", texto: "Pendientes" },
        { valor: "aprobado", texto: "Aprobadas" },
        { valor: "rechazado", texto: "Rechazadas" },
        { valor: "pendiente_informacion", texto: "Info. Requerida" }
      ];
    }
  };
  
  // Resetea todos los filtros
  const resetearFiltros = () => {
    setFiltroEstado("todos");
    setBusqueda("");
    setOrdenarPor("fecha_desc");
  };
  
  return {
    vistaActual,
    setVistaActual,
    solicitudesFiltradas,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    ordenarPor,
    setOrdenarPor,
    solicitudSeleccionada,
    setSolicitudSeleccionada,
    solicitudesDeLaEspecialidad,
    getEstadosDisponibles,
    resetearFiltros
  };
};