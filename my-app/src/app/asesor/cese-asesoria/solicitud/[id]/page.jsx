// app/asesor/cese-asesoria/solicitud/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import EditarSolicitudCese from '@/components/cese-asesoria/EditarSolicitudCese';

// Simulación de un servicio de API
const obtenerSolicitudPorId = async (id) => {
  // En una aplicación real, esto sería una llamada a la API
  // Por ahora, simulamos un delay y retornamos datos mockeados
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Datos mockeados - en una aplicación real vendría del backend
      const solicitudEjemplo = {
        id: id,
        fechaSolicitud: "2025-04-01T14:30:00",
        fechaLimite: "2025-04-15T23:59:59",
        motivo: "enfermedad",
        motivoTexto: "Problemas de salud",
        descripcion: "Debido a una cirugía programada y el periodo de recuperación posterior, me veré imposibilitado de continuar con las asesorías de tesis después de la fecha indicada.",
        estado: "pendiente_informacion",
        tesistas: [
          { id: "T001", nombre: "Ana María López", codigo: "20180123", titulo: "Implementación de algoritmos de IA para predicción de tráfico urbano", etapa: "Desarrollo", avance: 35, seleccionado: true },
          { id: "T002", nombre: "Juan Carlos Mendoza", codigo: "20170045", titulo: "Sistema de reconocimiento facial para seguridad institucional", etapa: "Investigación", avance: 20, seleccionado: true },
          { id: "T003", nombre: "Pedro Suárez Gutiérrez", codigo: "20190087", titulo: "Plataforma de aprendizaje adaptativo basado en ML", etapa: "Planificación", avance: 15, seleccionado: false }
        ],
        comentarios: [
          {
            id: "C001",
            autor: "Coordinador",
            fecha: "2025-04-03T10:20:00",
            texto: "Por favor, adjunte el certificado médico correspondiente y proponga fechas estimadas para su ausencia. También necesitamos saber si considera posible mantener algunas sesiones virtuales durante su recuperación."
          }
        ],
        // Agregar un campo modificaciones para llevar el historial de cambios
        modificaciones: [
          { 
            fecha: "2025-04-01T14:30:00", 
            tipo: "creacion", 
            detalles: "Solicitud creada inicialmente" 
          },
          {
            fecha: "2025-04-03T10:20:00",
            tipo: "solicitud_informacion",
            detalles: "El coordinador ha solicitado información adicional"
          }
        ]
      };
      
      resolve(solicitudEjemplo);
    }, 1000); // Simular latencia de red de 1 segundo
  });
};

export default function PaginaEditarSolicitud() {
  const params = useParams();
  const router = useRouter();
  const [solicitud, setSolicitud] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener ID de la URL
  const id = params.id;
  
  // Cargar datos de la solicitud
  useEffect(() => {
    const cargarSolicitud = async () => {
      try {
        setCargando(true);
        const datos = await obtenerSolicitudPorId(id);
        
        // Verificar si la solicitud puede ser editada (pendiente o pendiente_informacion)
        if (datos.estado !== "pendiente" && datos.estado !== "pendiente_informacion") {
          setError("Esta solicitud no puede ser editada debido a su estado actual.");
        } else {
          setSolicitud(datos);
        }
      } catch (err) {
        console.error("Error al cargar la solicitud:", err);
        setError("No se pudo cargar la información de la solicitud. Por favor, intente nuevamente.");
      } finally {
        setCargando(false);
      }
    };
    
    cargarSolicitud();
  }, [id]);
  
  // Función para manejar los cambios y guardarlos
  const guardarCambios = async (datosActualizados) => {
    // En una aplicación real, esto sería una llamada a la API para actualizar
    console.log("Guardando cambios:", datosActualizados);
    
    // Simulamos un proceso de guardado exitoso
    return new Promise((resolve) => {
      setTimeout(() => {
        // Actualizar el estado local con los cambios
        setSolicitud({
          ...solicitud,
          ...datosActualizados,
          modificaciones: [
            ...solicitud.modificaciones,
            {
              fecha: new Date().toISOString(),
              tipo: "edicion",
              detalles: "Solicitud modificada por el usuario"
            }
          ]
        });
        
        resolve({ success: true });
      }, 1500);
    });
  };
  
  // Función para cancelar la solicitud
  const cancelarSolicitud = async (justificacion) => {
    // En una aplicación real, esto sería una llamada a la API
    console.log("Cancelando solicitud:", id);
    console.log("Justificación:", justificacion);
    
    // Simulamos un proceso de cancelación exitoso
    return new Promise((resolve) => {
      setTimeout(() => {
        // Redirigir al historial después de cancelar
        router.push("/asesor/cese-asesoria/historial");
        resolve({ success: true });
      }, 1500);
    });
  };
  
  // Función para regresar al historial
  const volverAlHistorial = () => {
    router.push("/asesor/cese-asesoria/historial");
  };
  
  // Mostrar un indicador de carga
  if (cargando) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#042354] animate-spin mb-4" />
        <p className="text-lg text-gray-600">Cargando información de la solicitud...</p>
      </div>
    );
  }
  
  // Mostrar un mensaje de error si algo salió mal
  if (error) {
    return (
      <div className="container mx-auto py-16 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-red-700 mb-2">No se puede editar esta solicitud</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={volverAlHistorial}
            className="px-4 py-2 bg-[#042354] text-white rounded-md hover:bg-[#031a43] transition-colors"
          >
            Volver al historial
          </button>
        </div>
      </div>
    );
  }
  
  // Renderizar el componente de edición cuando los datos estén disponibles
  return (
    <>
      {solicitud && (
        <EditarSolicitudCese 
          solicitud={solicitud}
          onGuardarCambios={guardarCambios}
          onCancelarSolicitud={cancelarSolicitud}
          onVolverAlHistorial={volverAlHistorial}
        />
      )}
    </>
  );
}