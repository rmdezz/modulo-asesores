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
import { Textarea } from "@/components/ui/textarea";
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const DialogoRespuesta = ({
  open,
  onOpenChange,
  accion,
  respuestaTexto,
  setRespuestaTexto,
  onEnviar,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {accion === "aprobar" && "Aprobar solicitud de cese"}
            {accion === "rechazar" && "Rechazar solicitud de cese"}
            {accion === "solicitar_info" && "Solicitar información adicional"}
          </DialogTitle>
          <DialogDescription>
            {accion === "aprobar" && "Apruebe la solicitud e indique las instrucciones para el asesor."}
            {accion === "rechazar" && "Indique los motivos por los cuales se rechaza la solicitud."}
            {accion === "solicitar_info" && "Solicite información adicional para evaluar la solicitud."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {accion === "aprobar" && (
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Aprobación de solicitud</AlertTitle>
              <AlertDescription className="text-green-700">
                Al aprobar esta solicitud, deberá asignar un nuevo asesor para los tesistas afectados.
              </AlertDescription>
            </Alert>
          )}
          
          {accion === "rechazar" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTitle className="text-red-800">Rechazo de solicitud</AlertTitle>
              <AlertDescription className="text-red-700">
                El rechazo debe estar justificado. El asesor deberá continuar con sus responsabilidades.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="respuesta" className="text-sm font-medium">
              Mensaje para el asesor:
            </label>
            <Textarea
              id="respuesta"
              value={respuestaTexto}
              onChange={(e) => setRespuestaTexto(e.target.value)}
              rows={5}
              placeholder="Escriba su respuesta..."
            />
            <p className="text-xs text-gray-500">
              Este mensaje será enviado al asesor y quedará registrado en el historial de la solicitud.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={onEnviar}
            className={
              accion === "aprobar" ? "bg-green-600 hover:bg-green-700 text-white" :
              accion === "rechazar" ? "bg-red-600 hover:bg-red-700 text-white" :
              "bg-blue-600 hover:bg-blue-700 text-white"
            }
          >
            {accion === "aprobar" && "Aprobar y continuar"}
            {accion === "rechazar" && "Confirmar rechazo"}
            {accion === "solicitar_info" && "Enviar solicitud"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogoRespuesta;