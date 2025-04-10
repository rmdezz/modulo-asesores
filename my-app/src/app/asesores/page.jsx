'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Download, 
  CloudUpload,
  UserPlus, 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  Menu,
  ChevronDown,
  Filter,
  AlertCircle, // Icon for warning
  ToggleLeft, // Icon for marking inactive
  ToggleRight, // Icon for marking active
  ChevronLeft, // Icon for previous page
  ChevronRight // Icon for next page
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Consider using a proper Alert Dialog component for the warning
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // We might trigger this programmatically
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import ExpandableTags from "@/components/ExpandableTags";

export default function Asesores() {
  const router = useRouter();

  // Estados principales
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // State for status filter
  const [advisors, setAdvisors] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estado para el diálogo de advertencia
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningAdvisor, setWarningAdvisor] = useState(null);
  
  // Datos simulados para áreas de especialidad
  const areaOptions = [
    "Inteligencia Artificial",
    "Desarrollo de Software",
    "Redes y Seguridad",
    "Ciencia de Datos",
    "Sistemas de Información",
    "Interacción Humano-Computador",
    "Computación Gráfica",
    "Computación en la Nube"
  ];
  
  // Opciones de estado
  const statusOptions = ["Activo", "Inactivo"];
  
  // Efecto para cargar los datos cuando se monta el componente
  useEffect(() => {
    // Simulamos la carga de datos desde una API
    const mockData = [
      {
        id: "1",
        nombres: "Carlos Alberto",
        apellidoPaterno: "Ramírez",
        apellidoMaterno: "López",
        codigo: "20201234",
        correo: "cramirez@pucp.edu.pe",
        areaTematica: "Inteligencia Artificial",
        temasInteres: ["Machine Learning", "Redes Neuronales", "Procesamiento de Lenguaje Natural"],
        estado: "Activo",
        tesisActivasCount: 2
      },
      {
        id: "2",
        nombres: "Ana María",
        apellidoPaterno: "Torres",
        apellidoMaterno: "Gutiérrez",
        codigo: "20175678",
        correo: "amtorres@pucp.edu.pe",
        areaTematica: "Desarrollo de Software",
        temasInteres: ["Metodologías Ágiles", "Patrones de Diseño", "Arquitectura de Software"],
        estado: "Activo",
        tesisActivasCount: 0
      },
      {
        id: "3",
        nombres: "Jorge Luis",
        apellidoPaterno: "Mendoza",
        apellidoMaterno: "Paredes",
        codigo: "20189012",
        correo: "jmendoza@pucp.edu.pe",
        areaTematica: "Redes y Seguridad",
        temasInteres: ["Ciberseguridad", "Redes Inalámbricas", "Seguridad en la Nube"],
        estado: "Inactivo",
        tesisActivasCount: 0
      },
      {
        id: "4",
        nombres: "Patricia",
        apellidoPaterno: "Sánchez",
        apellidoMaterno: "Vega",
        codigo: "20163456",
        correo: "psanchez@pucp.edu.pe",
        areaTematica: "Ciencia de Datos",
        temasInteres: ["Big Data", "Visualización de Datos", "Análisis Predictivo"],
        estado: "Activo",
        tesisActivasCount: 1
      },
      {
        id: "5",
        nombres: "Roberto",
        apellidoPaterno: "Díaz",
        apellidoMaterno: "Castro",
        codigo: "20197890",
        correo: "rdiaz@pucp.edu.pe",
        areaTematica: "Sistemas de Información",
        temasInteres: ["ERP", "Gestión de Procesos", "Transformación Digital"],
        estado: "Activo",
        tesisActivasCount: 0
      },
      // Nuevos datos agregados
      {
        id: "6",
        nombres: "Lucía",
        apellidoPaterno: "Ortega",
        apellidoMaterno: "Miranda",
        codigo: "20154321",
        correo: "lortega@pucp.edu.pe",
        areaTematica: "Interacción Humano-Computador",
        temasInteres: ["Experiencia de Usuario", "Diseño de Interfaces", "Accesibilidad Web"],
        estado: "Activo",
        tesisActivasCount: 3
      },
      {
        id: "7",
        nombres: "Miguel Ángel",
        apellidoPaterno: "Vargas",
        apellidoMaterno: "Herrera",
        codigo: "20185432",
        correo: "mvargas@pucp.edu.pe",
        areaTematica: "Computación Gráfica",
        temasInteres: ["Animación 3D", "Renderizado", "Realidad Virtual"],
        estado: "Activo",
        tesisActivasCount: 1
      },
      {
        id: "8",
        nombres: "Gabriela",
        apellidoPaterno: "Fuentes",
        apellidoMaterno: "Rivera",
        codigo: "20193210",
        correo: "gfuentes@pucp.edu.pe",
        areaTematica: "Inteligencia Artificial",
        temasInteres: ["Visión por Computadora", "Robótica", "Sistemas Expertos"],
        estado: "Inactivo",
        tesisActivasCount: 0
      },
      {
        id: "9",
        nombres: "Héctor",
        apellidoPaterno: "Navarro",
        apellidoMaterno: "Méndez",
        codigo: "20172345",
        correo: "hnavarro@pucp.edu.pe",
        areaTematica: "Computación en la Nube",
        temasInteres: ["AWS", "Microservicios", "Contenedores"],
        estado: "Activo",
        tesisActivasCount: 2
      },
      {
        id: "10",
        nombres: "Valentina",
        apellidoPaterno: "Rojas",
        apellidoMaterno: "Paredes",
        codigo: "20186789",
        correo: "vrojas@pucp.edu.pe",
        areaTematica: "Desarrollo de Software",
        temasInteres: ["Desarrollo Móvil", "Progressive Web Apps", "Flutter"],
        estado: "Activo",
        tesisActivasCount: 0
      },
      {
        id: "11",
        nombres: "Alejandro",
        apellidoPaterno: "Peralta",
        apellidoMaterno: "Jiménez",
        codigo: "20164567",
        correo: "aperalta@pucp.edu.pe",
        areaTematica: "Ciencia de Datos",
        temasInteres: ["Aprendizaje Automático", "Minería de Datos", "Estadística Computacional"],
        estado: "Activo",
        tesisActivasCount: 4
      },
      {
        id: "12",
        nombres: "Sofía",
        apellidoPaterno: "Morales",
        apellidoMaterno: "Campos",
        codigo: "20208765",
        correo: "smorales@pucp.edu.pe",
        areaTematica: "Redes y Seguridad",
        temasInteres: ["Seguridad IoT", "Análisis de Vulnerabilidades", "Hacking Ético"],
        estado: "Inactivo",
        tesisActivasCount: 0
      },
      {
        id: "13",
        nombres: "Daniel",
        apellidoPaterno: "Vega",
        apellidoMaterno: "Espinoza",
        codigo: "20195678",
        correo: "dvega@pucp.edu.pe",
        areaTematica: "Sistemas de Información",
        temasInteres: ["Business Intelligence", "CRM", "Sistemas de Gestión Documental"],
        estado: "Activo",
        tesisActivasCount: 1
      },
      {
        id: "14",
        nombres: "Carolina",
        apellidoPaterno: "Lagos",
        apellidoMaterno: "Soto",
        codigo: "20171234",
        correo: "clagos@pucp.edu.pe",
        areaTematica: "Interacción Humano-Computador",
        temasInteres: ["Diseño Centrado en el Usuario", "Evaluación de Usabilidad", "Interfaces Gestuales"],
        estado: "Activo",
        tesisActivasCount: 2
      },
      {
        id: "15",
        nombres: "Fernando",
        apellidoPaterno: "Ruiz",
        apellidoMaterno: "Molina",
        codigo: "20184567",
        correo: "fruiz@pucp.edu.pe",
        areaTematica: "Computación Gráfica",
        temasInteres: ["Videojuegos", "Modelado 3D", "Efectos Visuales"],
        estado: "Activo",
        tesisActivasCount: 0
      },
      {
        id: "16",
        nombres: "María José",
        apellidoPaterno: "Álvarez",
        apellidoMaterno: "Pinto",
        codigo: "20202468",
        correo: "malvarez@pucp.edu.pe",
        areaTematica: "Inteligencia Artificial",
        temasInteres: ["Agentes Inteligentes", "Sistemas Multiagente", "Aprendizaje por Refuerzo"],
        estado: "Activo",
        tesisActivasCount: 1
      },
      {
        id: "17",
        nombres: "Joaquín",
        apellidoPaterno: "Castro",
        apellidoMaterno: "Valenzuela",
        codigo: "20191357",
        correo: "jcastro@pucp.edu.pe",
        areaTematica: "Computación en la Nube",
        temasInteres: ["DevOps", "Serverless", "Azure"],
        estado: "Inactivo",
        tesisActivasCount: 0
      },
      {
        id: "18",
        nombres: "Isabel",
        apellidoPaterno: "Medina",
        apellidoMaterno: "Fuentes",
        codigo: "20169876",
        correo: "imedina@pucp.edu.pe",
        areaTematica: "Desarrollo de Software",
        temasInteres: ["Clean Code", "Testing", "Integración Continua"],
        estado: "Activo",
        tesisActivasCount: 3
      },
      {
        id: "19",
        nombres: "Rodrigo",
        apellidoPaterno: "Guzmán",
        apellidoMaterno: "Torres",
        codigo: "20183456",
        correo: "rguzman@pucp.edu.pe",
        areaTematica: "Ciencia de Datos",
        temasInteres: ["Procesamiento de Señales", "Reconocimiento de Patrones", "Sistemas de Recomendación"],
        estado: "Activo",
        tesisActivasCount: 0
      },
      {
        id: "20",
        nombres: "Camila",
        apellidoPaterno: "Herrera",
        apellidoMaterno: "Rojas",
        codigo: "20207890",
        correo: "cherrera@pucp.edu.pe",
        areaTematica: "Redes y Seguridad",
        temasInteres: ["Seguridad en Aplicaciones Web", "Blockchain", "Criptografía"],
        estado: "Activo",
        tesisActivasCount: 1
      }
    ];
    
    setAdvisors(mockData);
  }, []);
  
  // Filtrar asesores según términos de búsqueda y filtros
  const filteredAdvisors = advisors.filter(advisor => {
    const fullName = `${advisor.nombres} ${advisor.apellidoPaterno} ${advisor.apellidoMaterno}`.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      fullName.includes(searchTerm.toLowerCase()) || 
      advisor.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.correo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAreaFilter = activeFilter === "all" || 
      (activeFilter === advisor.areaTematica);
      
    const matchesStatusFilter = statusFilter === "all" ||
      (statusFilter === advisor.estado); // Filter by status
    
    return matchesSearch && matchesAreaFilter && matchesStatusFilter;
  });
  
  // Calculate pagination indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdvisors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdvisors.length / itemsPerPage);
  
  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Reset to first page when filters change or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter, statusFilter, itemsPerPage]);
  
  // Función para manejar el cambio de estado (HU19)
  const handleToggleStatus = (advisorId) => {
    const advisorToUpdate = advisors.find(a => a.id === advisorId);
    if (!advisorToUpdate) return;

    const targetStatus = advisorToUpdate.estado === "Activo" ? "Inactivo" : "Activo";

    // RF71: Check constraint when trying to set to Inactive
    if (targetStatus === "Inactivo" && advisorToUpdate.tesisActivasCount > 0) {
      setWarningAdvisor(advisorToUpdate); // Store advisor info for the dialog
      setShowWarningDialog(true); // Open the warning dialog
      return; // Stop the status change for now
    }

    // Proceed with status change if no constraint or activating
    setAdvisors(prevAdvisors => 
      prevAdvisors.map(advisor => 
        advisor.id === advisorId 
          ? { ...advisor, estado: targetStatus } 
          : advisor
      )
    );
    // In a real app, you would likely make an API call here to update the backend
    console.log(`Advisor ${advisorId} status changed to ${targetStatus}`);
  };
  
  // Función para navegar (simulado) a la pantalla de reasignación
  const handleReassignThesis = (advisorId) => {
    setShowWarningDialog(false); // Close the dialog first
    if (!advisorId) {
      console.error("No advisor ID provided for reassignment navigation.");
      // Optionally show an error message to the user
      return;
    }
    console.log(`Navigating to reassignment page for advisor ID: ${advisorId}`);
    // Use router.push for client-side navigation
    router.push(`/asesores/${advisorId}/reasignar-tesis`); // <--- 3. Navigate
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Título y controles superiores (sin cambios significativos) */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listado de Asesores</h2>
          
          {/* Controles superiores */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <div className="md:w-1/2 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Buscar por nombre, código o correo..." 
                className="pl-10 border-gray-200 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            
            <div className="flex gap-2 md:justify-end">
              {/* Botones escritorio */}
              <div className="hidden md:flex">
                <Link href="/asesores/registrar">
                  <Button 
                    variant="outline" 
                    className="rounded-l-md rounded-r-none border-r-0"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nuevo asesor
                  </Button>
                </Link>
                <Link href="/asesores/carga-masiva">
                  <Button 
                    variant="outline" 
                    className="rounded-none border-r-0"
                  >
                    <CloudUpload className="h-4 w-4 mr-2" />
                    Carga masiva
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="rounded-r-md rounded-l-none"
                  // onClick={() => exportData()} // Funcionalidad de exportación pendiente
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              
              {/* Botones móviles */}
              <Link href="/asesores/carga-masiva" className="md:hidden">
                <Button className="bg-[#003A70] hover:bg-[#002854]">
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Carga
                </Button>
              </Link>
              <Link href="/asesores/registrar" className="md:hidden">
                <Button className="bg-[#003A70] hover:bg-[#002854]">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Añadir
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Filtros combinados */}
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          </div>
          
          {/* Filtro Área Temática */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600">Área:</span>
            <Select 
              value={activeFilter} 
              onValueChange={setActiveFilter}
            >
              <SelectTrigger className="h-8 w-auto border-gray-200 text-xs">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {areaOptions.map(area => (
                  <SelectItem key={area} value={area} className="text-xs">{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeFilter !== "all" && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 px-1.5 text-xs text-gray-500 hover:bg-gray-100" 
                onClick={() => setActiveFilter("all")}
              >
                Limpiar
              </Button>
            )}
          </div>

          {/* Filtro Estado */}
          <div className="flex items-center gap-1">
             <span className="text-xs font-medium text-gray-600">Estado:</span>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="h-8 w-auto border-gray-200 text-xs">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status} className="text-xs">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             {statusFilter !== "all" && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 px-1.5 text-xs text-gray-500 hover:bg-gray-100" 
                onClick={() => setStatusFilter("all")}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
        
        {/* Tabla de asesores */}
        {filteredAdvisors.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Nombre completo</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Área Temática</TableHead>
                  <TableHead className="font-semibold">Temas de Interés</TableHead>
                  <TableHead className="font-semibold text-center w-[100px]">Tesis Activas</TableHead> {/* RF71 */}
                  <TableHead className="font-semibold w-[100px]">Estado</TableHead> {/* RF71 */}
                  <TableHead className="w-[60px]"></TableHead> {/* Acciones */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((advisor) => (
                  <TableRow key={advisor.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium align-top">
                      {advisor.nombres} {advisor.apellidoPaterno} {advisor.apellidoMaterno}
                      <div className="text-xs text-gray-500">{advisor.correo}</div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline" className="bg-white text-xs font-mono">
                        {advisor.codigo}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      {advisor.areaTematica ? (
                        <Badge className="bg-[#003A70]/10 text-[#003A70] border-[#003A70]/20 text-xs whitespace-nowrap">
                          {advisor.areaTematica}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">--</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs align-top">
                      {advisor.temasInteres && advisor.temasInteres.length > 0 ? (
                        <ExpandableTags tags={advisor.temasInteres} maxVisible={2} />
                      ) : (
                        <span className="text-gray-400 text-sm">Sin temas</span>
                      )}
                    </TableCell>
                    {/* RF71: Mostrar Tesis Activas */}
                    <TableCell className="text-center align-top">
                      {advisor.tesisActivasCount > 0 ? (
                         <Badge variant="outline" className="text-xs font-medium">
                           {advisor.tesisActivasCount}
                         </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                    {/* RF71: Mostrar Estado */}
                    <TableCell className="align-top">
                      <Badge 
                        variant={advisor.estado === "Activo" ? "outline" : "secondary"}
                        className={`text-xs capitalize ${advisor.estado === "Activo" 
                          ? 'text-green-700 border-green-500/50 bg-green-50 font-medium' 
                          : 'text-gray-600 border-gray-300/80 bg-gray-100'}`}
                      >
                        {advisor.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2 text-gray-500" />
                            Editar perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2 text-gray-500" />
                            Asignar tesis
                          </DropdownMenuItem>
                           {/* HU19: Acción para cambiar estado */}
                          <DropdownMenuItem onClick={() => handleToggleStatus(advisor.id)}>
                             {advisor.estado === 'Activo' ? (
                               <>
                                 <ToggleLeft className="h-4 w-4 mr-2 text-orange-600" />
                                 <span>Marcar como Inactivo</span>
                               </>
                             ) : (
                               <>
                                 <ToggleRight className="h-4 w-4 mr-2 text-green-600" />
                                 <span>Marcar como Activo</span>
                               </>
                             )}
                           </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar asesor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
            <Search className="h-12 w-12 text-gray-300 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">No se encontraron asesores</h3>
            <p className="text-sm text-gray-500 mb-4">Intenta ajustar los filtros o el término de búsqueda.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm(""); 
                setActiveFilter("all");
                setStatusFilter("all"); // Reset status filter as well
              }}
            >
              Limpiar filtros y búsqueda
            </Button>
          </div>
        )}
        
        {/* Paginación actualizada */}
        {filteredAdvisors.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
            <span>Mostrando {Math.min(indexOfFirstItem + 1, filteredAdvisors.length)} - {Math.min(indexOfLastItem, filteredAdvisors.length)} de {filteredAdvisors.length} asesores</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>
              
              {/* Current page indicator */}
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="h-8 px-2"
              >
                <span className="sr-only">Página siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Page size selector */}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs text-gray-500">Mostrar:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                  <SelectTrigger className="h-8 w-20 border-gray-200 text-xs">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
          </div>
        )}
      </div>

      {/* RF71: Dialogo de Advertencia */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              Advertencia: No se puede inactivar al asesor
            </AlertDialogTitle>
            <AlertDialogDescription>
              El asesor <strong>{warningAdvisor?.nombres} {warningAdvisor?.apellidoPaterno}</strong> tiene actualmente <strong>{warningAdvisor?.tesisActivasCount}</strong> tesis activas asignadas. 
              <br /> <br />
              Para poder marcarlo como 'Inactivo', primero debe reasignar estas tesis a otros asesores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
             {/* Este botón simula la navegación a la pantalla de reasignación */}
             <AlertDialogAction onClick={() => handleReassignThesis(warningAdvisor?.id)}>
              Ir a reasignar tesis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}