'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { AlertTriangle, GraduationCap } from "lucide-react";
import { asesoresSugeridos } from "../utils/constants";

const DialogoAsignacion = ({
  open,
  onOpenChange,
  solicitud,
  onAsignar,
}) => {
  if (!solicitud) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Asignar Nuevo Asesor</DialogTitle>
          <DialogDescription>
            Asigne un nuevo asesor para los tesistas afectados por el cese de asesoría.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar asesor disponible:</label>
            <Input
              type="text"
              placeholder="Buscar por nombre, especialidad..."
            />
          </div>
          
          <div className="border rounded-md">
            <div className="p-3 border-b bg-gray-50">
              <h4 className="text-sm font-medium">Asesores sugeridos</h4>
              <p className="text-xs text-gray-500">Basados en la especialidad y disponibilidad</p>
            </div>
            
            <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
              {asesoresSugeridos.map((asesor, idx) => (
                <div key={idx} className="flex items-start justify-between p-2 border rounded-md hover:bg-gray-50">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{asesor.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{asesor.nombre}</p>
                      <p className="text-xs text-gray-600">{asesor.especialidad}</p>
                      <div className="flex items-center mt-1">
                        <GraduationCap className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="text-xs text-gray-500">{asesor.tesistasActuales} tesistas actuales</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => onAsignar({
                      asesorId: asesor.id,
                      asesorNombre: asesor.nombre,
                      solicitudId: solicitud.id
                    })}
                  >
                    Asignar
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800">Importante</AlertTitle>
            <AlertDescription className="text-amber-700">
              Asegúrese de que el nuevo asesor tenga la disponibilidad y experiencia necesarias 
              para continuar con los proyectos de tesis afectados.
            </AlertDescription>
          </Alert>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogoAsignacion;