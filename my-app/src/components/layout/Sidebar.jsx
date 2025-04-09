'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Users, 
  BookOpen, 
  Settings, 
  LayoutDashboard, 
  PanelLeft, 
  AlertTriangle,
  UserCog,
  FileText,
  Clock,
  GraduationCap,
  ClipboardList,
  Building,
  UserCircle2,
  BellRing,
  UserCheck,
  Upload,
  Tag,
  PlusCircle,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

export default function Sidebar({ className, userRole = "coordinador", estadisticas }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  // Estado para los menús expandibles
  const [openMenus, setOpenMenus] = useState({
    asesores: true,
    tesis: false,
    estudiantes: false,
    configuracion: false,
    misTesistas: true,
    solicitudesEstudiantes: false
  });
  
  // Función para alternar el estado de un menú
  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };
  
  // Función para verificar si una ruta está activa
  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };
  
  // Renderizar contenido para el sidebar del coordinador expandido
  const renderCoordinadorContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-14 px-4 border-b border-[#042354]/10">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo-pucp.svg" alt="PUCP" className="h-8" />
          <div className="font-medium text-[#042354]">
            Coordinación de Tesis
          </div>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <Link href="/dashboard">
            <Button
              variant={isActive('/dashboard') ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive('/dashboard') ? "bg-[#042354] text-white" : "text-[#042354]"
              )}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          
          {/* Sección de Asesores */}
          <Collapsible
            open={openMenus.asesores}
            onOpenChange={() => toggleMenu('asesores')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between",
                  isActive('/asesores') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
                )}
              >
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Asesores</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.asesores ? "-rotate-180" : "rotate-0"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
              <Link href="/asesores">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesores') && pathname === '/asesores' ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Listado de Asesores
                </Button>
              </Link>
              <Link href="/asesores/solicitudes-cese">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesores/solicitudes-cese') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Solicitudes de Cese
                  {estadisticas?.solicitudesPendientes > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white hover:bg-red-600">{estadisticas.solicitudesPendientes}</Badge>
                  )}
                </Button>
              </Link>
              <Link href="/asesores/registrar">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesores/registrar') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Registrar Asesor
                </Button>
              </Link>
              <Link href="/asesores/carga-masiva">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesores/carga-masiva') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Carga Masiva
                </Button>
              </Link>
              <Link href="/asesores/areas-tematicas">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesores/areas-tematicas') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Áreas Temáticas
                </Button>
              </Link>
              <Link href="/asesores/estadisticas">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesores/estadisticas') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Estadísticas
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Sección de Tesis */}
          <Collapsible
            open={openMenus.tesis}
            onOpenChange={() => toggleMenu('tesis')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between",
                  isActive('/tesis') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
                )}
              >
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Tesis</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.tesis ? "-rotate-180" : "rotate-0"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
              <Link href="/tesis">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#042354]/80"
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Proyectos Activos
                </Button>
              </Link>
              <Link href="/tesis/registro">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#042354]/80"
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Registrar Tesis
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Sección de Estudiantes */}
          <Collapsible
            open={openMenus.estudiantes}
            onOpenChange={() => toggleMenu('estudiantes')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between",
                  isActive('/estudiantes') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
                )}
              >
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>Estudiantes</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.estudiantes ? "-rotate-180" : "rotate-0"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
              <Link href="/estudiantes">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#042354]/80"
                  size="sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Listado de Estudiantes
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Sección de Configuración */}
          <Collapsible
            open={openMenus.configuracion}
            onOpenChange={() => toggleMenu('configuracion')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between",
                  isActive('/configuracion') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
                )}
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Configuración</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.configuracion ? "-rotate-180" : "rotate-0"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
              <Link href="/configuracion/facultades">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#042354]/80"
                  size="sm"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Facultades
                </Button>
              </Link>
              <Link href="/configuracion/especialidades">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#042354]/80"
                  size="sm"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Especialidades
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-[#042354]/10">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setCollapsed(true)}
        >
          <PanelLeft className="h-4 w-4 mr-2" />
          Colapsar
        </Button>
      </div>
    </div>
  );
  
  // Renderizar contenido para el sidebar del asesor expandido
  const renderAsesorContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-14 px-4 border-b border-[#042354]/10">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo-pucp.svg" alt="PUCP" className="h-8" />
          <div className="font-medium text-[#042354]">
            Portal de Asesor
          </div>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <Link href="/asesor/dashboard">
            <Button
              variant={isActive('/asesor/dashboard') ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive('/asesor/dashboard') ? "bg-[#042354] text-white" : "text-[#042354]"
              )}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          
          {/* Sección Mi Perfil */}
          <Link href="/asesor/perfil">
            <Button
              variant={isActive('/asesor/perfil') ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive('/asesor/perfil') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
              )}
            >
              <UserCircle2 className="h-4 w-4 mr-2" />
              Mi Perfil
            </Button>
          </Link>
          
          {/* Sección Mis Tesistas */}
          <Collapsible
            open={openMenus.misTesistas}
            onOpenChange={() => toggleMenu('misTesistas')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between",
                  isActive('/asesor/tesistas') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
                )}
              >
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>Mis Tesistas</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.misTesistas ? "-rotate-180" : "rotate-0"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
              <Link href="/asesor/tesistas/activos">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesor/tesistas/activos') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Tesistas Activos
                </Button>
              </Link>
              <Link href="/asesor/tesistas/historial">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesor/tesistas/historial') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Historial
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Sección Solicitudes de Estudiantes (HU04) */}
          <Collapsible
            open={openMenus.solicitudesEstudiantes}
            onOpenChange={() => toggleMenu('solicitudesEstudiantes')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between",
                  isActive('/asesor/solicitudes') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
                )}
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Solicitudes de Estudiantes</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.solicitudes ? "-rotate-180" : "rotate-0"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
              <Link href="/asesor/solicitudes/pendientes">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesor/solicitudes/pendientes') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Solicitudes Pendientes
                </Button>
              </Link>
              <Link href="/asesor/solicitudes/historial">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesor/solicitudes/historial') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Historial de Solicitudes
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Sección Cese de Asesoría (HU16) */}
          {/* Sección Cese de Asesoría con submenu */}
          <Collapsible
            open={openMenus.ceseAsesoria}
            onOpenChange={() => toggleMenu('ceseAsesoria')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between",
                  isActive('/asesor/cese-asesoria') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
                )}
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Cese de Asesoría</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.ceseAsesoria ? "-rotate-180" : "rotate-0"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pr-2 py-1 space-y-1">
              <Link href="/asesor/cese-asesoria/nueva">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesor/cese-asesoria/nueva') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </Link>
              <Link href="/asesor/cese-asesoria/historial">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive('/asesor/cese-asesoria/historial') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]/80"
                  )}
                  size="sm"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Historial
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Sección de Asesores (Directorio) */}
          <Link href="/asesor/directorio">
            <Button
              variant={isActive('/asesor/directorio') ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive('/asesor/directorio') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
              )}
            >
              <Users className="h-4 w-4 mr-2" />
              Directorio de Asesores
            </Button>
          </Link>
          
          {/* Sección de Notificaciones */}
          <Link href="/asesor/notificaciones">
            <Button
              variant={isActive('/asesor/notificaciones') ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive('/asesor/notificaciones') ? "bg-[#042354]/10 text-[#042354] font-medium" : "text-[#042354]"
              )}
            >
              <BellRing className="h-4 w-4 mr-2" />
              Notificaciones
            </Button>
          </Link>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-[#042354]/10">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setCollapsed(true)}
        >
          <PanelLeft className="h-4 w-4 mr-2" />
          Colapsar
        </Button>
      </div>
    </div>
  );
  
  // Renderizar contenido para el sidebar colapsado (común para ambos roles)
  const renderCollapsedContent = () => {
    // Generar ícones según el rol
    const navIcons = userRole === "coordinador" 
      ? [
          { path: '/dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
          { path: '/asesores', icon: Users, tooltip: 'Asesores' },
          { path: '/tesis', icon: BookOpen, tooltip: 'Tesis' },
          { path: '/estudiantes', icon: GraduationCap, tooltip: 'Estudiantes' },
          { path: '/configuracion', icon: Settings, tooltip: 'Configuración' }
        ]
      : [
          { path: '/asesor/dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
          { path: '/asesor/perfil', icon: UserCircle2, tooltip: 'Mi Perfil' },
          { path: '/asesor/tesistas/activos', icon: GraduationCap, tooltip: 'Mis Tesistas' },
          { path: '/asesor/solicitudes', icon: FileText, tooltip: 'Solicitudes' },
          { path: '/asesor/directorio', icon: Users, tooltip: 'Directorio' },
          { path: '/asesor/notificaciones', icon: BellRing, tooltip: 'Notificaciones' }
        ];
    
    return (
      <div className="flex flex-col h-full items-center">
        <div className="flex justify-center h-14 w-full border-b border-[#042354]/10">
          <Link href="/" className="flex items-center justify-center h-full">
            <img src="/logo-pucp.svg" alt="PUCP" className="h-8" />
          </Link>
        </div>
        
        <ScrollArea className="flex-1 w-full py-4">
          <div className="space-y-2 flex flex-col items-center">
            {navIcons.map((item, index) => (
              <Link 
                key={index} 
                href={item.path} 
                className="tooltip-wrapper" 
                data-tooltip={item.tooltip}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn(
                    "h-10 w-10",
                    isActive(item.path) ? "bg-[#042354] text-white" : "text-[#042354]"
                  )}
                  size="icon"
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-[#042354]/10 w-full flex justify-center">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setCollapsed(false)}
          >
            <PanelLeft className="h-5 w-5 rotate-180" />
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <aside className={cn(
      "border-r border-[#042354]/10 bg-white",
      collapsed ? "w-16" : "w-64",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {collapsed 
        ? renderCollapsedContent() 
        : userRole === "coordinador" 
          ? renderCoordinadorContent() 
          : renderAsesorContent()
      }
      
      {/* Estilos para los tooltips en el modo colapsado */}
      <style jsx global>{`
        .tooltip-wrapper {
          position: relative;
        }
        
        .tooltip-wrapper:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 10px;
          padding: 5px 10px;
          background-color: #042354;
          color: white;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 10;
        }
        
        .tooltip-wrapper:hover::before {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent #042354 transparent transparent;
          z-index: 10;
        }
      `}</style>
    </aside>
  );
}