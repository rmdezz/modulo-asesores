import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha ISO como cadena legible
 * @param {string} fechaIso - Fecha en formato ISO 
 * @param {string} formatoDeseado - Formato deseado
 * @returns {string} - Fecha formateada
 */
export const formatearFecha = (fechaIso, formatoDeseado = "dd/MM/yyyy") => {
  return format(parseISO(fechaIso), formatoDeseado, { locale: es });
};

/**
 * Formatea una fecha ISO como fecha y hora
 * @param {string} fechaIso - Fecha en formato ISO
 * @returns {string} - Fecha y hora formateadas
 */
export const formatearFechaHora = (fechaIso) => {
  return format(parseISO(fechaIso), "dd/MM/yyyy HH:mm", { locale: es });
};

/**
 * Calcula los días restantes hasta una fecha límite
 * @param {string} fechaLimite - Fecha límite en formato ISO
 * @returns {number} - Número de días restantes (negativo si la fecha ya pasó)
 */
export const calcularDiasRestantes = (fechaLimite) => {
  const fechaLimiteObj = parseISO(fechaLimite);
  return differenceInDays(fechaLimiteObj, new Date());
};

/**
 * Determina la clase CSS de urgencia según los días restantes
 * @param {number} diasRestantes - Días restantes hasta la fecha límite
 * @returns {string} - Clases CSS para el estilo de urgencia
 */
export const obtenerClaseUrgencia = (diasRestantes) => {
  if (diasRestantes < 0) {
    return "bg-red-100 text-red-800 border-red-200";
  } else if (diasRestantes <= 3) {
    return "bg-red-100 text-red-800 border-red-200";
  } else if (diasRestantes <= 7) {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  } else {
    return "bg-green-100 text-green-800 border-green-200";
  }
};

/**
 * Genera el texto de urgencia según los días restantes
 * @param {number} diasRestantes - Días restantes hasta la fecha límite
 * @returns {string} - Texto descriptivo de la urgencia
 */
export const obtenerTextoUrgencia = (diasRestantes) => {
  if (diasRestantes < 0) {
    return "Vencida";
  } else if (diasRestantes <= 3) {
    return `Urgente (${diasRestantes} días)`;
  } else if (diasRestantes <= 7) {
    return `Pronta (${diasRestantes} días)`;
  } else {
    return `${diasRestantes} días`;
  }
};