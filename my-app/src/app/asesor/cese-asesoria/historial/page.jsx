'use client'

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2,
  Clock, 
  Eye, 
  Info, 
  Search,
  XCircle,
  Filter,
  X,
  FileText,
  Ban,
  ArrowUpDown,
  Loader2,
  Pencil,
  ExternalLink
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Badge,
} from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Datos de ejemplo para el historial de solicitudes (igual)
const solicitudesEjemplo = [
  {
    id: "SOL-9852",
    fechaSolicitud: "2025-04-01T14:30:00",
    fechaLimite: "2025-04-15T23:59:59",
    motivo: "sobrecarga",
    motivoTexto: "Sobrecarga laboral",
    estado: "pendiente",
    tesistas: [
      { id: "T001", nombre: "Ana María López" },
      { id: "T002", nombre: "Juan Carlos Mendoza" }
    ],
    comentarios: []
  },
  {
    id: "SOL-7634",
    fechaSolicitud: "2025-03-15T09:45:00",
    fechaLimite: "2025-03-29T23:59:59",
    motivo: "viaje",
    motivoTexto: "Viaje prolongado",
    estado: "aprobado",
    tesistas: [
      { id: "T003", nombre: "Roberto Sánchez" },
      { id: "T004", nombre: "Patricia Molina" }
    ],
    comentarios: [
      { 
        id: "C001", 
        autor: "Coordinador", 
        fecha: "2025-03-17T10:20:00", 
        texto: "Solicitud aprobada. Se ha asignado al Dr. Miguel Peralta como nuevo asesor para sus tesistas."
      }
    ],
    fechaAprobacion: "2025-03-17T10:20:00",
    nuevoAsesor: {
      id: "A007",
      nombre: "Dr. Miguel Peralta",
      correo: "m.peralta@pucp.edu.pe"
    }
  },
  {
    id: "SOL-6521",
    fechaSolicitud: "2025-02-10T16:20:00",
    fechaLimite: "2025-02-24T23:59:59",
    motivo: "licencia",
    motivoTexto: "Licencia académica/personal",
    estado: "rechazado",
    tesistas: [
      { id: "T005", nombre: "Diego Castillo" }
    ],
    comentarios: [
      { 
        id: "C002", 
        autor: "Coordinador", 
        fecha: "2025-02-12T11:30:00", 
        texto: "Solicitud rechazada. La licencia solicitada puede adaptarse para permitir sesiones virtuales de asesoría. Por favor, coordine con su tesista para establecer un horario adecuado."
      }
    ],
    fechaRechazo: "2025-02-12T11:30:00"
  },
  {
    id: "SOL-5478",
    fechaSolicitud: "2025-01-20T13:10:00",
    fechaLimite: "2025-02-03T23:59:59",
    motivo: "enfermedad",
    motivoTexto: "Problemas de salud",
    estado: "cancelado",
    tesistas: [
      { id: "T006", nombre: "Fernando Torres" },
      { id: "T007", nombre: "Luisa Paredes" }
    ],
    comentarios: [
      { 
        id: "C003", 
        autor: "Asesor", 
        fecha: "2025-01-22T09:45:00", 
        texto: "He decidido cancelar esta solicitud ya que mi situación médica ha mejorado y podré continuar con las asesorías normalmente."
      }
    ],
    fechaCancelacion: "2025-01-22T09:45:00"
  },
  {
    id: "SOL-4395",
    fechaSolicitud: "2024-12-05T10:30:00",
    fechaLimite: "2024-12-19T23:59:59",
    motivo: "incompatibilidad",
    motivoTexto: "Incompatibilidad con el tema de tesis",
    estado: "pendiente_informacion",
    tesistas: [
      { id: "T008", nombre: "Ricardo Vargas" }
    ],
    comentarios: [
      { 
        id: "C004", 
        autor: "Coordinador", 
        fecha: "2024-12-07T14:50:00", 
        texto: "Por favor, proporcione más detalles sobre la incompatibilidad y adjunte evidencia de intentos previos de resolución del problema."
      }
    ]
  }
];

// Componente para mostrar el estado de la solicitud (igual)
const EstadoSolicitud = ({ estado }) => {
  const estadoConfig = {
    pendiente: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      texto: "Pendiente de revisión",
      icono: <Clock className="h-3 w-3 mr-1" />
    },
    aprobado: {
      color: "bg-green-100 text-green-800 border-green-200",
      texto: "Aprobada",
      icono: <CheckCircle2 className="h-3 w-3 mr-1" />
    },
    rechazado: {
      color: "bg-red-100 text-red-800 border-red-200",
      texto: "Rechazada",
      icono: <XCircle className="h-3 w-3 mr-1" />
    },
    pendiente_informacion: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      texto: "Información adicional requerida",
      icono: <Info className="h-3 w-3 mr-1" />
    },
    cancelado: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      texto: "Cancelada por usted",
      icono: <Ban className="h-3 w-3 mr-1" />
    }
  };

  const config = estadoConfig[estado] || estadoConfig.pendiente;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center`}>
      {config.icono}
      {config.texto}
    </Badge>
  );
};

export default function HistorialSolicitudesCese() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [ordenarPor, setOrdenarPor] = useState("recientes");
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState(solicitudesEjemplo);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [dialogoDetallesAbierto, setDialogoDetallesAbierto] = useState(false);
  const [dialogoCancelarAbierto, setDialogoCancelarAbierto] = useState(false);
  const [cancelacionEnProceso, setCancelacionEnProceso] = useState(false);
  
  // Filtrar solicitudes
  const filtrarSolicitudes = () => {
    let resultado = solicitudesEjemplo;
    
    // Filtrar por estado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter(s => s.estado === filtroEstado);
    }
    
    // Filtrar por búsqueda
    if (busqueda) {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(s => 
        s.id.toLowerCase().includes(terminoBusqueda) ||
        s.motivoTexto.toLowerCase().includes(terminoBusqueda) ||
        s.tesistas.some(t => t.nombre.toLowerCase().includes(terminoBusqueda))
      );
    }
    
    // Ordenar
    if (ordenarPor === "recientes") {
      resultado.sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud));
    } else if (ordenarPor === "antiguos") {
      resultado.sort((a, b) => new Date(a.fechaSolicitud) - new Date(b.fechaSolicitud));
    }
    
    setSolicitudesFiltradas(resultado);
  };
  
  // Aplicar filtros cuando cambian los valores
  useEffect(() => {
    filtrarSolicitudes();
  }, [busqueda, filtroEstado, ordenarPor]);
  
  // Ver detalles de una solicitud
  const verDetalles = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setDialogoDetallesAbierto(true);
  };
  
  // Ir a editar solicitud
  const irAEditarSolicitud = (solicitud) => {
    // En una implementación real, navegaríamos a la ruta con el ID correspondiente
    router.push(`/asesor/cese-asesoria/editar/${solicitud.id}`);
  };
  
  // Iniciar cancelación de solicitud
  const iniciarCancelacion = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setDialogoCancelarAbierto(true);
  };
  
  // Confirmar cancelación de solicitud
  const confirmarCancelacion = () => {
    setCancelacionEnProceso(true);
    
    // Simulación de API call
    setTimeout(() => {
      setCancelacionEnProceso(false);
      setDialogoCancelarAbierto(false);
      
      // Aquí actualizaríamos el estado en una aplicación real
      alert("La solicitud ha sido cancelada exitosamente");
      
      // Actualizar la vista
      filtrarSolicitudes();
    }, 1500);
  };
  
  // Verificar si una solicitud puede ser editada/cancelada
  const puedeSerEditada = (solicitud) => {
    return solicitud.estado === "pendiente" || solicitud.estado === "pendiente_informacion";
  };
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-[#042354] flex items-center">
        <FileText className="mr-2 h-6 w-6 text-[#042354]" />
        Historial de Solicitudes de Cese
      </h1>
      
      {/* Panel de filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar por ID, motivo o tesista..."
              className="pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="aprobado">Aprobadas</SelectItem>
              <SelectItem value="rechazado">Rechazadas</SelectItem>
              <SelectItem value="pendiente_informacion">Info. requerida</SelectItem>
              <SelectItem value="cancelado">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ordenarPor} onValueChange={setOrdenarPor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recientes">Más recientes</SelectItem>
              <SelectItem value="antiguos">Más antiguos</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              setBusqueda("");
              setFiltroEstado("todos");
              setOrdenarPor("recientes");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Tabla de solicitudes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID Solicitud</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Fecha de Solicitud
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="w-[100px]">Tesistas</TableHead>
                <TableHead className="w-[180px]">Estado</TableHead>
                <TableHead className="text-right w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No se encontraron solicitudes que coincidan con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                solicitudesFiltradas.map((solicitud) => (
                  <TableRow 
                    key={solicitud.id}
                    className={solicitud.estado === "pendiente" ? "bg-yellow-50/30" : ""}
                  >
                    <TableCell className="font-medium">{solicitud.id}</TableCell>
                    <TableCell>
                      {format(parseISO(solicitud.fechaSolicitud), "dd/MM/yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>{solicitud.motivoTexto}</TableCell>
                    <TableCell>{solicitud.tesistas.length} tesista(s)</TableCell>
                    <TableCell>
                      <EstadoSolicitud estado={solicitud.estado} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => verDetalles(solicitud)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Eye className="h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalles</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Button>
                        
                        {puedeSerEditada(solicitud) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => irAEditarSolicitud(solicitud)}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Pencil className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Editar solicitud</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Button>
                        )}
                        
                        {puedeSerEditada(solicitud) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => iniciarCancelacion(solicitud)}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Ban className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cancelar solicitud</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Link para crear una nueva solicitud */}
      <div className="mt-6 flex justify-end">
        <Link href="/asesor/cese-asesoria/nueva">
          <Button className="bg-[#042354] hover:bg-[#031a43]">
            Nueva Solicitud de Cese
          </Button>
        </Link>
      </div>
      
      {/* Diálogo de detalles de solicitud */}
      {solicitudSeleccionada && (
        <Dialog open={dialogoDetallesAbierto} onOpenChange={setDialogoDetallesAbierto}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                Solicitud {solicitudSeleccionada.id}
                <span className="ml-2">
                  <EstadoSolicitud estado={solicitudSeleccionada.estado} />
                </span>
              </DialogTitle>
              <DialogDescription>
                Detalles de la solicitud de cese de asesoría
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha de solicitud</h4>
                  <p>{format(parseISO(solicitudSeleccionada.fechaSolicitud), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha límite indicada</h4>
                  <p>{format(parseISO(solicitudSeleccionada.fechaLimite), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Motivo</h4>
                <p>{solicitudSeleccionada.motivoTexto}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Tesistas afectados</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {solicitudSeleccionada.tesistas.map((tesista) => (
                    <li key={tesista.id}>{tesista.nombre}</li>
                  ))}
                </ul>
              </div>
              
              {solicitudSeleccionada.comentarios.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Comentarios</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {solicitudSeleccionada.comentarios.map((comentario) => (
                      <div 
                        key={comentario.id} 
                        className="bg-gray-50 p-3 rounded-md border text-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{comentario.autor}</span>
                          <span className="text-xs text-gray-500">
                            {format(parseISO(comentario.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                          </span>
                        </div>
                        <p className="mt-1">{comentario.texto}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {solicitudSeleccionada.estado === "aprobado" && solicitudSeleccionada.nuevoAsesor && (
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Nuevo asesor asignado</h4>
                  <p className="text-sm">{solicitudSeleccionada.nuevoAsesor.nombre}</p>
                  <p className="text-sm text-green-700">{solicitudSeleccionada.nuevoAsesor.correo}</p>
                </div>
              )}
              
              {solicitudSeleccionada.estado === "pendiente_informacion" && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Acción requerida</AlertTitle>
                  <AlertDescription>
                    Se ha solicitado información adicional. Por favor, proporcione la información solicitada para continuar con el proceso.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {puedeSerEditada(solicitudSeleccionada) && (
                <>
                  <Button 
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      setDialogoDetallesAbierto(false);
                      irAEditarSolicitud(solicitudSeleccionada);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar Solicitud
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setDialogoDetallesAbierto(false);
                      iniciarCancelacion(solicitudSeleccionada);
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Cancelar Solicitud
                  </Button>
                </>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => setDialogoDetallesAbierto(false)}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Diálogo de confirmación de cancelación */}
      {solicitudSeleccionada && (
        <Dialog open={dialogoCancelarAbierto} onOpenChange={setDialogoCancelarAbierto}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cancelar Solicitud</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea cancelar esta solicitud de cese de asesoría?
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Alert variant="warning" className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Acción irreversible</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Esta acción no se puede deshacer. La solicitud será cancelada y se notificará al coordinador.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDialogoCancelarAbierto(false)}
                disabled={cancelacionEnProceso}
              >
                Volver
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmarCancelacion}
                disabled={cancelacionEnProceso}
              >
                {cancelacionEnProceso ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Cancelación"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}