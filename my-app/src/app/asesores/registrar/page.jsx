'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Hash, 
  Briefcase,
  Building,
  CalendarClock,
  Plus,
  ChevronRight,
  BookOpen,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

export default function RegistrarAsesor() {
  const router = useRouter();
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    codigo: "",
    correo: "",
    areaTematica: "",
    facultad: "Ingeniería",
    especialidad: "Informática"
  });
  
  // Estado para la modal de nueva área temática
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newArea, setNewArea] = useState("");
  
  // Estado para la lista de áreas temáticas disponibles
  const [areaTematicas, setAreaTematicas] = useState([
    "Inteligencia Artificial",
    "Desarrollo de Software",
    "Redes y Seguridad",
    "Ciencia de Datos",
    "Sistemas de Información"
  ]);
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Manejar cambios en el select
  const handleAreaChange = (value) => {
    if (value === "añadir-nueva-area") {
      setDialogOpen(true);
    } else {
      setFormData(prevData => ({
        ...prevData,
        areaTematica: value
      }));
    }
  };
  
  // Manejar la creación de una nueva área
  const handleAddNewArea = () => {
    if (newArea.trim()) {
      setAreaTematicas(prev => [...prev, newArea.trim()]);
      setFormData(prevData => ({
        ...prevData,
        areaTematica: newArea.trim()
      }));
      setNewArea("");
      setDialogOpen(false);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí normalmente se enviaría la información al backend
    console.log("Datos del nuevo asesor:", formData);
    
    // En una implementación real, aquí se haría la petición al backend
    // y luego se redirigría al listado de asesores
    
    // Redireccionar al listado de asesores (simulado)
    router.push("/asesores");
  };
  
  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Cabecera con breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Registrar Nuevo Asesor</h1>
          <Link href="/asesores">
            <Button variant="outline" className="mt-3 sm:mt-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al listado
            </Button>
          </Link>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-[#003A70]" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input
                  id="nombres"
                  name="nombres"
                  placeholder="Ingrese nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
                <Input
                  id="apellidoPaterno"
                  name="apellidoPaterno"
                  placeholder="Ingrese apellido paterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                <Input
                  id="apellidoMaterno"
                  name="apellidoMaterno"
                  placeholder="Ingrese apellido materno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="codigo">Código PUCP</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="codigo"
                    name="codigo"
                    placeholder="Ej: 20201234"
                    className="pl-10"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    placeholder="Ej: nombre.apellido@pucp.edu.pe"
                    className="pl-10"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-[#003A70]" />
                Información Académica
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facultad">Facultad</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="facultad"
                    name="facultad"
                    value={formData.facultad}
                    className="pl-10 bg-gray-50"
                    readOnly
                  />
                </div>
                <p className="text-xs text-gray-500">Campo asignado automáticamente</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    className="pl-10 bg-gray-50"
                    readOnly
                  />
                </div>
                <p className="text-xs text-gray-500">Campo asignado automáticamente</p>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="areaTematica">Área Temática (opcional)</Label>
                <Select 
                  value={formData.areaTematica} 
                  onValueChange={handleAreaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar área temática" />
                  </SelectTrigger>
                  <SelectContent>
                    {areaTematicas.map(area => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                    <SelectItem value="añadir-nueva-area" className="text-[#003A70] font-medium">
                      <div className="flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Añadir nueva área temática
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarClock className="h-4 w-4 mr-1" />
                Fecha de registro: {new Date().toLocaleDateString('es-ES')}
              </div>
              
              <Badge variant="outline" className="text-[#003A70]">
                <Building className="h-3 w-3 mr-1" /> PUCP
              </Badge>
            </CardFooter>
          </Card>
          
          <div className="flex justify-end gap-3 mt-8">
            <Link href="/asesores">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="bg-[#003A70] hover:bg-[#002854]">
              Guardar Asesor
            </Button>
          </div>
        </form>
      </div>
      
      {/* Diálogo para añadir nueva área temática */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir nueva área temática</DialogTitle>
            <DialogDescription>
              Ingrese el nombre de la nueva área temática. Una vez creada, estará disponible para todos los asesores.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nueva-area">Nombre del área temática</Label>
              <Input
                id="nueva-area"
                placeholder="Ej: Computación Gráfica"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddNewArea} 
              className="bg-[#003A70] hover:bg-[#002854]"
              disabled={!newArea.trim()}
            >
              Añadir área
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}