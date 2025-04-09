import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Plus, 
  Trash2,
  CheckCircle2,
  FolderPlus,
  Search
} from 'lucide-react';

const EmptyAreasInterface = () => {
  // Assuming the coordinator's faculty is known
  const coordinatorFaculty = "engineering";
  
  const [areas, setAreas] = useState([]);
  const [newAreaName, setNewAreaName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleAddArea = () => {
    if (!newAreaName.trim()) return;

    const newArea = {
      id: Date.now().toString(),
      name: newAreaName.trim(),
      faculty: coordinatorFaculty,
      advisorCount: Math.floor(Math.random() * 5) // Simulated advisor count
    };

    setAreas([...areas, newArea]);
    setNewAreaName('');
    setIsAddDialogOpen(false);
    setShowSuccessAlert(true);
    
    // Hide success alert after 3 seconds
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleDeleteArea = (areaId) => {
    setAreas(areas.filter(area => area.id !== areaId));
  };

  // Filter areas based on search term
  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with description and add button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#042354]">Áreas Temáticas</h1>
          <p className="text-gray-600 mt-2 max-w-xl">
            Las áreas temáticas permiten categorizar y organizar los campos de especialización 
            para una asignación más precisa de asesores de tesis.
          </p>
        </div>
        <Button 
          size="sm" 
          variant="default" 
          className="bg-[#042354] hover:bg-[#0a3a7d]"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Área
        </Button>
      </div>

      {showSuccessAlert && (
        <Alert variant="success" className="mb-6">
          <CheckCircle2 className="h-5 w-5" />
          <AlertTitle>Área agregada</AlertTitle>
          <AlertDescription>
            El área temática ha sido registrada exitosamente.
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {/* Search input (always present) */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Buscar áreas temáticas..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {areas.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <FolderPlus className="h-16 w-16 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-4">
                No hay áreas temáticas registradas
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[#042354] hover:bg-[#0a3a7d]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar primera área
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAreas.map((area) => (
                <div 
                  key={area.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-[#042354]">{area.name}</p>
                      <p className="text-xs text-gray-500">Facultad de Ingeniería</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {area.advisorCount} Asesores
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteArea(area.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Area Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Área Temática</DialogTitle>
            <DialogDescription>
              Ingrese el nombre del área temática para la Facultad de Ingeniería
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input 
              placeholder="Nombre del área" 
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              className="w-full"
            />
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddArea}
                disabled={!newAreaName.trim()}
                className="bg-[#042354] hover:bg-[#0a3a7d]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Área
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmptyAreasInterface;