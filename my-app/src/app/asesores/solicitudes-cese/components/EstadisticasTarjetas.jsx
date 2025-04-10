'use client';

import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  HelpCircle, 
  AlertTriangle, 
  FileText
} from 'lucide-react';

const EstadisticasTarjetas = ({ estadisticas }) => {
  const { total, pendientes, aprobadas, rechazadas, informacionRequerida, urgentes } = estadisticas;
  
  const tarjetas = [
    {
      titulo: "Total",
      valor: total,
      icono: FileText,
      color: "text-gray-700"
    },
    {
      titulo: "Pendientes",
      valor: pendientes,
      icono: Clock,
      color: "text-amber-600"
    },
    {
      titulo: "Aprobadas",
      valor: aprobadas,
      icono: CheckCircle,
      color: "text-emerald-600"
    },
    {
      titulo: "Rechazadas",
      valor: rechazadas,
      icono: XCircle,
      color: "text-rose-600"
    },
    {
      titulo: "Info",
      valor: informacionRequerida,
      icono: HelpCircle,
      color: "text-blue-600"
    },
    {
      titulo: "Urgentes",
      valor: urgentes,
      icono: AlertTriangle,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
      {tarjetas.map((tarjeta, index) => (
        <Card 
          key={index}
          className="border shadow-sm hover:shadow transition-all duration-150"
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <tarjeta.icono className={`h-4 w-4 ${tarjeta.color}`} />
              <p className="text-xs font-medium text-gray-500">{tarjeta.titulo}</p>
            </div>
            <p className="text-xl font-bold mt-1">{tarjeta.valor}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EstadisticasTarjetas;