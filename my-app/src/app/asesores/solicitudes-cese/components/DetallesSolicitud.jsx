'use client';

import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { formatearFechaHora } from "../utils/formatters";
import EstadoSolicitud from "./EstadoSolicitud";
import IndicadorUrgencia from "./IndicadorUrgencia";
import { ThumbsUp, ThumbsDown, Info, Mail } from "lucide-react";

const DetallesSolicitud = ({ 
  solicitud, 
  onClose, 
  iniciarRespuesta,
}) => {
  if (!solicitud) return null;

  return (
    <SheetContent className="sm:max-w-xl overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="flex items-center">
          Solicitud {solicitud.id}
          <EstadoSolicitud estado={solicitud.estado} className="ml-2" />
        </SheetTitle>
        <SheetDescription>
          Detalles de la solicitud de cese de asesoría
        </SheetDescription>
      </SheetHeader>
      
      <div className="py-6 space-y-6">
        {/* Datos del asesor */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Datos del asesor</h3>
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{solicitud.asesor.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{solicitud.asesor.nombre}</p>
              <p className="text-sm text-gray-600">{solicitud.asesor.especialidad}</p>
              <p className="text-sm text-gray-600">{solicitud.asesor.facultad}</p>
              <p className="text-sm text-blue-600">{solicitud.asesor.correo}</p>
            </div>
          </div>
        </div>
        
        {/* Datos de la solicitud */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Información de la solicitud</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Fecha de solicitud</p>
                <p className="text-sm">
                  {formatearFechaHora(solicitud.fechaSolicitud)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fecha límite</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">
                    {formatearFechaHora(solicitud.fechaLimite, "dd/MM/yyyy")}
                  </p>
                  <IndicadorUrgencia fechaLimite={solicitud.fechaLimite} />
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Motivo</p>
              <p className="text-sm font-medium">{solicitud.motivoTexto}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Descripción</p>
              <p className="text-sm mt-1 bg-white p-3 border rounded-md">
                {solicitud.descripcion}
              </p>
            </div>
          </div>
        </div>
        
        {/* Tesistas afectados */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Tesistas afectados ({solicitud.tesistas.length})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto px-1">
            {solicitud.tesistas.map((tesista, idx) => (
              <div key={idx} className="bg-white p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{tesista.nombre}</p>
                    <p className="text-xs text-gray-500">Código: {tesista.codigo}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800">
                      Avance: {tesista.avance}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm mt-2 text-gray-700">{tesista.titulo}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${tesista.avance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Historial de comentarios */}
        {solicitud.comentarios.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Historial de comentarios</h3>
            <div className="space-y-3">
              {solicitud.comentarios.map((comentario, idx) => {
                const colorClasses = {
                  aprobacion: "bg-green-50 border-green-200",
                  rechazo: "bg-red-50 border-red-200",
                  informacion: "bg-blue-50 border-blue-200"
                };
                
                return (
                  <div 
                    key={idx} 
                    className={`p-3 border rounded-md ${colorClasses[comentario.estado] || "bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{comentario.autor}</p>
                      <p className="text-xs text-gray-500">
                        {formatearFechaHora(comentario.fecha)}
                      </p>
                    </div>
                    <p className="text-sm mt-1">{comentario.texto}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Información de reasignación si aplica */}
        {solicitud.estado === "aprobado" && solicitud.nuevoAsesor && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-1">Reasignación de asesor</h3>
            <p className="text-sm">
              Nuevo asesor asignado: <span className="font-medium">{solicitud.nuevoAsesor.nombre}</span>
            </p>
            <p className="text-sm text-green-700">{solicitud.nuevoAsesor.correo}</p>
          </div>
        )}
      </div>
      
      <SheetFooter className="pt-2 border-t flex flex-col sm:flex-row gap-2">
        {solicitud.estado === "pendiente" && (
          <>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              onClick={() => iniciarRespuesta("aprobar")}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Aprobar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              onClick={() => iniciarRespuesta("rechazar")}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => iniciarRespuesta("solicitar_info")}
            >
              <Info className="h-4 w-4 mr-2" />
              Solicitar información
            </Button>
          </>
        )}
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => {
            window.open(`mailto:${solicitud.asesor.correo}`, '_blank');
          }}
        >
          <Mail className="h-4 w-4 mr-2" />
          Contactar asesor
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default DetallesSolicitud;