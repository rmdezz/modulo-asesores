'use client';

import { Badge } from "@/components/ui/badge";
import { calcularDiasRestantes, obtenerClaseUrgencia, obtenerTextoUrgencia } from "../utils/formatters";

// Componente para mostrar la urgencia
const IndicadorUrgencia = ({ fechaLimite, className = "" }) => {
  const diasRestantes = calcularDiasRestantes(fechaLimite);
  const claseUrgencia = obtenerClaseUrgencia(diasRestantes);
  const textoUrgencia = obtenerTextoUrgencia(diasRestantes);
  
  return (
    <Badge variant="outline" className={`${claseUrgencia} ${className}`}>
      {textoUrgencia}
    </Badge>
  );
};

export default IndicadorUrgencia;