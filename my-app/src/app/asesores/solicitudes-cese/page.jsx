'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  Download,
  Timer, 
  CheckCircle, 
  ClipboardList 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet } from "@/components/ui/sheet";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { coordinadorInfo } from './data/mockData';
import { useSolicitudes } from './hooks/useSolicitudes';
import { useEstadisticas } from './hooks/useEstadisticas';

// Importar componentes
import EstadisticasTarjetas from './components/EstadisticasTarjetas';
import FilterBar from './components/FilterBar';
import SolicitudesTable from './components/SolicitudesTable';
import DetallesSolicitud from './components/DetallesSolicitud';
import DialogoRespuesta from './components/DialogoRespuesta';
import DialogoAsignacion from './components/DialogoAsignacion';

export default function CoordinadorSolicitudesCese() {
  // Hooks personalizados
  const {
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
  } = useSolicitudes();
  
  // Estadísticas
  const estadisticas = useEstadisticas(solicitudesDeLaEspecialidad);
  
  // Estados locales para UI
  const [panelDetallesAbierto, setPanelDetallesAbierto] = useState(false);
  const [dialogoRespuestaAbierto, setDialogoRespuestaAbierto] = useState(false);
  const [accionRespuesta, setAccionRespuesta] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [nuevaAsignacionAbierta, setNuevaAsignacionAbierta] = useState(false);
  
  // Abrir panel de detalles
  const verDetallesSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setPanelDetallesAbierto(true);
  };
  
  // Iniciar respuesta a solicitud
  const iniciarRespuesta = (tipo) => {
    setAccionRespuesta(tipo);
    setRespuestaTexto("");
    setDialogoRespuestaAbierto(true);
  };
  
  // Enviar respuesta a solicitud
  const enviarRespuesta = () => {
    console.log("Respuesta enviada:", {
      solicitudId: solicitudSeleccionada.id,
      accion: accionRespuesta,
      respuesta: respuestaTexto
    });
    
    // Aquí iría la lógica para actualizar el estado de la solicitud en el backend
    // Por ahora, solo cerramos el diálogo
    setDialogoRespuestaAbierto(false);
    
    // Si la acción es aprobar, mostrar diálogo de asignación de nuevo asesor
    if (accionRespuesta === "aprobar") {
      setNuevaAsignacionAbierta(true);
    }
  };
  
  // Asignar nuevo asesor
  const asignarNuevoAsesor = (asignacion) => {
    console.log("Nuevo asesor asignado:", asignacion);
    setNuevaAsignacionAbierta(false);
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#042354] flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" />
            Solicitudes de Cese de Asesoría
          </h1>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{coordinadorInfo.facultad}</span> / <span className="font-medium">{coordinadorInfo.especialidad}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar datos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <EstadisticasTarjetas estadisticas={estadisticas} />
      
      {/* Pestañas principales */}
      <Tabs 
        defaultValue="activas" 
        className="mb-6"
        onValueChange={(value) => {
          setVistaActual(value);
          // Resetear el filtro de estado cuando se cambia de pestaña
          setFiltroEstado("todos");
        }}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6 h-14">
          <TabsTrigger value="activas" className="h-full">
            <div className="flex items-center justify-center h-full">
              <Timer className="mr-2 h-4 w-4" />
              Solicitudes Activas
            </div>
          </TabsTrigger>
          <TabsTrigger value="completadas" className="h-full">
            <div className="flex items-center justify-center h-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Solicitudes Completadas
            </div>
          </TabsTrigger>
          <TabsTrigger value="todas" className="h-full">
            <div className="flex items-center justify-center h-full">
              <ClipboardList className="mr-2 h-4 w-4" />
              Todas las Solicitudes
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Filtros y búsqueda */}
        <FilterBar 
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          ordenarPor={ordenarPor}
          setOrdenarPor={setOrdenarPor}
          estadosDisponibles={getEstadosDisponibles()}
          resetearFiltros={resetearFiltros}
        />
        
        {/* Contenido de las pestañas - reutilizamos la misma tabla */}
        <TabsContent value="activas">
          <SolicitudesTable 
            solicitudes={solicitudesFiltradas} 
            verDetalles={verDetallesSolicitud}
            iniciarRespuesta={iniciarRespuesta}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
          />
        </TabsContent>
        
        <TabsContent value="completadas">
          <SolicitudesTable 
            solicitudes={solicitudesFiltradas} 
            verDetalles={verDetallesSolicitud}
            iniciarRespuesta={iniciarRespuesta}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
          />
        </TabsContent>
        
        <TabsContent value="todas">
          <SolicitudesTable 
            solicitudes={solicitudesFiltradas} 
            verDetalles={verDetallesSolicitud}
            iniciarRespuesta={iniciarRespuesta}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
          />
        </TabsContent>
      </Tabs>
      
      {/* Panel lateral de detalles */}
      <Sheet open={panelDetallesAbierto} onOpenChange={setPanelDetallesAbierto}>
        <DetallesSolicitud
          solicitud={solicitudSeleccionada}
          onClose={() => setPanelDetallesAbierto(false)}
          iniciarRespuesta={iniciarRespuesta}
        />
      </Sheet>
      
      {/* Diálogo de respuesta */}
      <DialogoRespuesta
        open={dialogoRespuestaAbierto}
        onOpenChange={setDialogoRespuestaAbierto}
        accion={accionRespuesta}
        respuestaTexto={respuestaTexto}
        setRespuestaTexto={setRespuestaTexto}
        onEnviar={enviarRespuesta}
      />
      
      {/* Diálogo de asignación de nuevo asesor */}
      <DialogoAsignacion
        open={nuevaAsignacionAbierta}
        onOpenChange={setNuevaAsignacionAbierta}
        solicitud={solicitudSeleccionada}
        onAsignar={asignarNuevoAsesor}
      />
    </div>
  );
}