'use client';

import { Badge } from "@/components/ui/badge";
import { estadoConfig } from "../utils/constants";
import { 
  Timer, 
  CheckCircle, 
  XCircle, 
  Info 
} from 'lucide-react';

// Componente para mostrar el estado de la solicitud
const EstadoSolicitud = ({ estado, className = "" }) => {
  const iconos = {
    Timer: <Timer className="h-3 w-3 mr-1" />,
    CheckCircle: <CheckCircle className="h-3 w-3 mr-1" />,
    XCircle: <XCircle className="h-3 w-3 mr-1" />,
    Info: <Info className="h-3 w-3 mr-1" />
  };

  const config = estadoConfig[estado] || estadoConfig.pendiente;
  const IconoComponente = iconos[config.icono];

  return (
    <Badge variant="outline" className={`${config.color} flex items-center ${className}`}>
      {IconoComponente}
      {config.texto}
    </Badge>
  );
};

export default EstadoSolicitud;