'use client'
import { useState } from "react";
import BulkAdvisorUpload from "@/components/bulk-advisor/BulkAdvisorUpload";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Upload, Users, UserPlus, Search, 
  Filter, Download, ChevronRight, CloudUpload,
  Trash2, Edit, MoreHorizontal, Menu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  // Estados principales
  const [currentView, setCurrentView] = useState("empty"); // empty, bulk-upload, register-individual, list
  const [processedAdvisors, setProcessedAdvisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Datos simulados para áreas de especialidad
  const areaOptions = [
    "Inteligencia Artificial",
    "Desarrollo de Software",
    "Redes y Seguridad",
    "Ciencia de Datos",
    "Sistemas de Información"
  ];
  
  // Función para manejar el éxito en la carga masiva
  const handleUploadSuccess = (data) => {
    setProcessedAdvisors(data);
    setCurrentView("list");
  };
  
  // Filtrar asesores según términos de búsqueda y filtros
  const filteredAdvisors = processedAdvisors.filter(advisor => {
    const fullName = `${advisor.nombres} ${advisor.apellidos}`.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      fullName.includes(searchTerm.toLowerCase()) || 
      advisor.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.correo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === advisor.area && advisor.area);
    
    return matchesSearch && matchesTab;
  });
  
  // Renderizado condicional según vista actual
  if (currentView === "bulk-upload") {
    return (
      <BulkAdvisorUpload 
        onCancel={() => setCurrentView(processedAdvisors.length > 0 ? "list" : "empty")} 
        onSuccess={handleUploadSuccess}
        facultad="Ingeniería"
        especialidad="Informática"
      />
    );
  }
  
  if (currentView === "register-individual") {
    // Aquí iría el componente para registrar un asesor individual
    // Por ahora solo mostramos un placeholder
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView(processedAdvisors.length > 0 ? "list" : "empty")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Registrar Nuevo Asesor</h1>
          </div>
          
          <div className="text-center py-16">
            <UserPlus className="h-12 w-12 text-[#003A70]/20 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">Formulario de registro de asesor individual</h3>
            <p className="text-gray-500 mb-6">Esta funcionalidad estaría disponible en la implementación completa.</p>
            <Button 
              onClick={() => setCurrentView(processedAdvisors.length > 0 ? "list" : "empty")}
              className="bg-[#003A70] hover:bg-[#002854]"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de asesores
  if (currentView === "list") {
    return (
      <div className="bg-white min-h-screen pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003A70] to-[#002854] text-white py-4 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo-pucp.svg" alt="PUCP" className="h-8 mr-3" />
              <div>
                <h1 className="text-xl font-semibold">Gestión de Asesores</h1>
                <p className="text-sm opacity-80">Facultad de Ingeniería | Informática</p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-64">
                <div className="py-6 flex flex-col gap-2">
                  <Button variant="ghost" onClick={() => setCurrentView("empty")} className="justify-start">
                    Inicio
                  </Button>
                  <Button variant="ghost" onClick={() => setCurrentView("register-individual")} className="justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar asesor
                  </Button>
                  <Button variant="ghost" onClick={() => setCurrentView("bulk-upload")} className="justify-start">
                    <CloudUpload className="h-4 w-4 mr-2" />
                    Carga masiva
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar datos
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Controles superiores */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6 justify-between">
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
              <div className="hidden md:flex">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView("register-individual")} 
                  className="rounded-l-md rounded-r-none border-r-0"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo asesor
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView("bulk-upload")} 
                  className="rounded-none border-r-0"
                >
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Carga masiva
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-r-md rounded-l-none"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              
              <Button className="md:hidden bg-[#003A70] hover:bg-[#002854]" onClick={() => setCurrentView("bulk-upload")}>
                <CloudUpload className="h-4 w-4 mr-2" />
                Carga
              </Button>
              
              <Button className="md:hidden" variant="outline" onClick={() => setCurrentView("register-individual")}>
                <UserPlus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>
          </div>
          
          {/* Tabs para filtrar por área */}
          <div className="mb-6 overflow-x-auto pb-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-2 bg-gray-50 p-1">
                <TabsTrigger value="all" className="text-sm">
                  Todos
                </TabsTrigger>
                {areaOptions.map(area => (
                  <TabsTrigger key={area} value={area} className="text-sm whitespace-nowrap">
                    {area}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Tarjetas de asesores */}
          {filteredAdvisors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAdvisors.map((advisor, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4 border-b">
                      <Avatar className="h-10 w-10 bg-[#003A70]/10 text-[#003A70] mr-3">
                        <span>{advisor.nombres.charAt(0)}{advisor.apellidos.charAt(0)}</span>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {advisor.nombres} {advisor.apellidos}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{advisor.correo}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar asesor
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Asignar tesis
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="px-4 py-3 bg-gray-50">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-white text-xs">
                            {advisor.codigo}
                          </Badge>
                        </div>
                        <Badge className="bg-[#003A70]/10 text-[#003A70] border-[#003A70]/20 text-xs">
                          {advisor.area || "Sin área"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Search className="h-12 w-12 text-gray-300 mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
              <p className="text-gray-500 mb-4">Prueba con otros términos de búsqueda o filtros.</p>
              <Button variant="outline" onClick={() => {setSearchTerm(""); setActiveTab("all");}}>
                Limpiar filtros
              </Button>
            </div>
          )}
          
          {/* Paginación o información */}
          {filteredAdvisors.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
              <span>Mostrando {filteredAdvisors.length} de {processedAdvisors.length} asesores</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Vista de estado vacío (pantalla inicial)
  return (
    <div className="min-h-screen bg-white">
      {/* Header con logo de PUCP */}
      <div className="bg-gradient-to-r from-[#003A70] to-[#002854] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center">
          <img src="/logo-pucp.svg" alt="PUCP" className="h-10 mr-4" />
          <div>
            <h1 className="text-2xl font-semibold">Sistema de Gestión de Asesores</h1>
            <p className="opacity-80">Facultad de Ingeniería • Especialidad de Informática</p>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
          <div className="text-center">
            <Users className="h-12 w-12 text-[#003A70]/20 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aún no hay asesores registrados</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Para comenzar, puedes registrar asesores de manera individual o realizar una carga masiva desde un archivo.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                className="flex-1 h-auto py-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm hover:shadow"
                onClick={() => setCurrentView("register-individual")}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-[#003A70]/10 rounded-full p-3 mb-3">
                    <UserPlus className="h-6 w-6 text-[#003A70]" />
                  </div>
                  <span className="font-medium mb-1">Registrar asesor</span>
                  <span className="text-xs text-gray-500">Añadir un asesor manualmente</span>
                </div>
              </Button>
              
              <Button 
                className="flex-1 h-auto py-6 bg-[#003A70] hover:bg-[#002854] text-white shadow-sm"
                onClick={() => setCurrentView("bulk-upload")}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 rounded-full p-3 mb-3">
                    <CloudUpload className="h-6 w-6" />
                  </div>
                  <span className="font-medium mb-1">Carga masiva</span>
                  <span className="text-xs text-blue-100">Importar múltiples asesores</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Footer informativo */}
        <div className="text-center text-sm text-gray-400 border-t pt-6">
          <p>© {new Date().getFullYear()} Pontificia Universidad Católica del Perú • Facultad de Ingeniería</p>
        </div>
      </div>
    </div>
  );
}