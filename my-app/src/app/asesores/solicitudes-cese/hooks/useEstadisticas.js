import { useMemo } from 'react';
import { parseISO, differenceInDays } from 'date-fns';

/**
 * Hook para calcular estadísticas de solicitudes
 * @param {Array} solicitudes - Lista de solicitudes
 * @returns {Object} Objeto con las estadísticas calculadas
 */
export const useEstadisticas = (solicitudes) => {
  // Calcular estadísticas usando useMemo para evitar recálculos innecesarios
  const estadisticas = useMemo(() => {
    return {
      total: solicitudes.length,
      pendientes: solicitudes.filter(s => s.estado === "pendiente").length,
      aprobadas: solicitudes.filter(s => s.estado === "aprobado").length,
      rechazadas: solicitudes.filter(s => s.estado === "rechazado").length,
      informacionRequerida: solicitudes.filter(s => s.estado === "pendiente_informacion").length,
      urgentes: solicitudes.filter(s => {
        const fechaLimiteObj = parseISO(s.fechaLimite);
        const diasRestantes = differenceInDays(fechaLimiteObj, new Date());
        return diasRestantes <= 3 && s.estado === "pendiente";
      }).length
    };
  }, [solicitudes]);
  
  return estadisticas;
};