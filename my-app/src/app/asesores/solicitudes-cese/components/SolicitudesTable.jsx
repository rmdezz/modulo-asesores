'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { formatearFechaHora } from "../utils/formatters";
import EstadoSolicitud from "./EstadoSolicitud";
import IndicadorUrgencia from "./IndicadorUrgencia";
import { 
  Eye, 
  MoreHorizontal, 
  GraduationCap, 
  ThumbsUp, 
  ThumbsDown, 
  Info, 
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown
} from 'lucide-react';

const SolicitudesTable = ({ 
  solicitudes, 
  verDetalles, 
  iniciarRespuesta, 
  setSolicitudSeleccionada 
}) => {
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado para ordenamiento local (independiente del filtro global)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  // Ordenar y paginar datos
  useEffect(() => {
    let dataToShow = [...solicitudes];
    
    // Ordenar datos localmente si se ha configurado
    if (sortConfig.key) {
      dataToShow.sort((a, b) => {
        let aValue, bValue;
        
        // Manejar propiedades anidadas o calculadas
        switch(sortConfig.key) {
          case 'asesor':
            aValue = a.asesor.nombre;
            bValue = b.asesor.nombre;
            break;
          case 'tesistas':
            aValue = a.tesistas.length;
            bValue = b.tesistas.length;
            break;
          case 'fechaLimite':
            aValue = new Date(a.fechaLimite);
            bValue = new Date(b.fechaLimite);
            break;
          default:
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Calcular total de páginas
    const pages = Math.max(1, Math.ceil(dataToShow.length / itemsPerPage));
    setTotalPages(pages);
    
    // Ajustar página actual si es necesario
    if (currentPage > pages) {
      setCurrentPage(1);
    }
    
    // Actualizar datos paginados
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, dataToShow.length);
    setPaginatedData(dataToShow.slice(startIndex, endIndex));
  }, [solicitudes, currentPage, itemsPerPage, sortConfig]);

  // Funciones para paginación
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset a primera página al cambiar items por página
  };
  
  // Función para manejar el ordenamiento
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Función para renderizar el icono de ordenamiento
  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600" /> 
      : <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600 rotate-180" />;
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead 
                  className="w-[80px] cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  <div className="flex items-center">
                    ID {getSortIcon('id')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('asesor')}
                >
                  <div className="flex items-center">
                    Asesor {getSortIcon('asesor')}
                  </div>
                </TableHead>
                <TableHead 
                  className="hidden lg:table-cell cursor-pointer"
                  onClick={() => requestSort('motivoTexto')}
                >
                  <div className="flex items-center">
                    Motivo {getSortIcon('motivoTexto')}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[130px] hidden md:table-cell cursor-pointer"
                  onClick={() => requestSort('fechaLimite')}
                >
                  <div className="flex items-center">
                    Fechas {getSortIcon('fechaLimite')}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[100px] cursor-pointer"
                  onClick={() => requestSort('tesistas')}
                >
                  <div className="flex items-center">
                    Tesistas {getSortIcon('tesistas')}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[110px] cursor-pointer"
                  onClick={() => requestSort('estado')}
                >
                  <div className="flex items-center">
                    Estado {getSortIcon('estado')}
                  </div>
                </TableHead>
                <TableHead className="w-[80px]">Urgencia</TableHead>
                <TableHead className="w-[70px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    No se encontraron solicitudes que coincidan con los criterios seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((solicitud) => (
                  <TableRow 
                    key={solicitud.id} 
                    className="hover:bg-gray-50 cursor-pointer border-b"
                    onClick={() => verDetalles(solicitud)}
                  >
                    <TableCell className="font-medium">{solicitud.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border">
                          <AvatarFallback className="bg-blue-50 text-blue-700">{solicitud.asesor.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{solicitud.asesor.nombre}</p>
                          <p className="text-xs text-gray-500">{solicitud.asesor.especialidad}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      <div className="line-clamp-2">{solicitud.motivoTexto}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 w-10">Solic:</span>
                          <span className="text-xs font-medium">
                            {formatearFechaHora(solicitud.fechaSolicitud, "dd/MM/yy")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 w-10">Límite:</span>
                          <span className="text-xs font-medium">
                            {formatearFechaHora(solicitud.fechaLimite, "dd/MM/yy")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-blue-700" />
                        <HoverCard>
                          <HoverCardTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                              {solicitud.tesistas.length}
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Tesistas afectados:</h4>
                              {solicitud.tesistas.map((tesista, idx) => (
                                <div key={idx} className="text-xs space-y-1 pb-2 border-b last:border-0">
                                  <p className="font-medium">{tesista.nombre}</p>
                                  <p className="text-gray-600">{tesista.codigo}</p>
                                  <p className="text-gray-600 truncate">{tesista.titulo}</p>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-blue-600 h-1.5 rounded-full" 
                                      style={{ width: `${tesista.avance}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-[10px] text-gray-500">Avance: {tesista.avance}%</p>
                                </div>
                              ))}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </TableCell>
                    <TableCell>
                      <EstadoSolicitud estado={solicitud.estado} />
                    </TableCell>
                    <TableCell>
                      <IndicadorUrgencia fechaLimite={solicitud.fechaLimite} />
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => verDetalles(solicitud)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          {solicitud.estado === "pendiente" && (
                            <>
                              <DropdownMenuItem onClick={() => {
                                setSolicitudSeleccionada(solicitud);
                                iniciarRespuesta("aprobar");
                              }}>
                                <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                                Aprobar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSolicitudSeleccionada(solicitud);
                                iniciarRespuesta("rechazar");
                              }}>
                                <ThumbsDown className="h-4 w-4 mr-2 text-red-600" />
                                Rechazar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSolicitudSeleccionada(solicitud);
                                iniciarRespuesta("solicitar_info");
                              }}>
                                <Info className="h-4 w-4 mr-2 text-blue-600" />
                                Solicitar info
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            window.open(`mailto:${solicitud.asesor.correo}`, '_blank');
                          }}>
                            <Mail className="h-4 w-4 mr-2" />
                            Contactar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Controles de paginación mejorados */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{paginatedData.length ? (currentPage - 1) * itemsPerPage + 1 : 0}</span>
              {' '}-{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, solicitudes.length)}
              </span>
              {' '}de{' '}
              <span className="font-medium">{solicitudes.length}</span> resultados
            </p>
            
            <div className="flex items-center">
              <select
                className="border rounded px-2 py-1 text-sm bg-white"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                aria-label="Resultados por página"
              >
                <option value={5}>5 / pág.</option>
                <option value={10}>10 / pág.</option>
                <option value={25}>25 / pág.</option>
                <option value={50}>50 / pág.</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToFirstPage} 
              disabled={currentPage === 1}
              className="p-0 w-8 h-8"
              aria-label="Primera página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousPage} 
              disabled={currentPage === 1}
              className="p-0 w-8 h-8"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="px-2">
              <span className="text-sm">
                <span className="font-medium">{currentPage}</span>
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
              className="p-0 w-8 h-8"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToLastPage} 
              disabled={currentPage === totalPages}
              className="p-0 w-8 h-8"
              aria-label="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolicitudesTable;