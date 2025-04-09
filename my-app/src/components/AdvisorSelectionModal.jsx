'use client'

import { useState, useMemo, useEffect } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserSearch, Users, BookCopy, X, Filter, FilterX } from "lucide-react";

export default function AdvisorSelectionModal({ 
    isOpen, 
    onClose, 
    onAdvisorSelected, 
    thesis, 
    eligibleAdvisors = [] // Default to empty array
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [uniqueAreas, setUniqueAreas] = useState([]);
  
  // Extraer áreas únicas de los asesores y configurar el área inicial
  useEffect(() => {
    if (thesis && eligibleAdvisors.length > 0) {
      // Extraer todas las áreas únicas de los asesores
      const areas = [...new Set(eligibleAdvisors.map(advisor => advisor.areaTematica))];
      setUniqueAreas(areas);
      
      // Establecer el área inicial basada en la tesis (si existe y hay asesores en esa área)
      if (thesis.areaTematica && areas.includes(thesis.areaTematica)) {
        setSelectedArea(thesis.areaTematica);
      } else {
        setSelectedArea('todas'); // Si no hay match, mostrar todas
      }
    }
  }, [thesis, eligibleAdvisors]);

  // Filter advisors based on selected area and search term
  const filteredAdvisors = useMemo(() => {
    if (!thesis || !eligibleAdvisors) return [];
    
    return eligibleAdvisors.filter(advisor => {
      // Match area (if 'todas' is selected, show all)
      const areaMatch = selectedArea === 'todas' || advisor.areaTematica === selectedArea;
      
      // Match search term (case-insensitive search in name)
      const searchMatch = searchTerm === '' || 
        `${advisor.nombres} ${advisor.apellidoPaterno}`.toLowerCase().includes(searchTerm.toLowerCase());
        
      return areaMatch && searchMatch;
    });
  }, [thesis, eligibleAdvisors, searchTerm, selectedArea]);

  // Check if there are any advisors in the same area as the thesis
  const hasAdvisorsInSameArea = useMemo(() => {
    if (!thesis || !eligibleAdvisors) return false;
    return eligibleAdvisors.some(
      advisor => advisor.areaTematica === thesis.areaTematica
    );
  }, [thesis, eligibleAdvisors]);
  
  // Count advisors per area for display in dropdown
  const areasWithCount = useMemo(() => {
    if (!eligibleAdvisors) return [];
    
    const counts = {};
    eligibleAdvisors.forEach(advisor => {
      const area = advisor.areaTematica;
      counts[area] = (counts[area] || 0) + 1;
    });
    
    return counts;
  }, [eligibleAdvisors]);

  if (!isOpen || !thesis) return null; // Don't render if not open or no thesis context

  const handleSelect = (selectedAdvisor) => {
    onAdvisorSelected(thesis.id, selectedAdvisor); // Pass thesisId and advisor object
    onClose(); // Close modal after selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Seleccionar Nuevo Asesor</DialogTitle>
          <DialogDescription>
            Para la tesis: <span className="font-semibold">{thesis.titulo}</span>
            <br />
            Área temática: <Badge variant="secondary">{thesis.areaTematica || 'No especificada'}</Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center mt-2 mb-4">
          {/* Search Input */}
          <div className="relative w-full md:w-1/2">
            <UserSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar asesor por nombre..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Area Filter Dropdown */}
          <div className="w-full md:w-[250px]">
            <Select 
              value={selectedArea} 
              onValueChange={setSelectedArea}
              disabled={uniqueAreas.length === 0}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por área temática" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">
                  <div className="flex items-center">
                    <FilterX className="h-4 w-4 mr-2" />
                    <span>Todas las áreas</span>
                  </div>
                </SelectItem>
                {uniqueAreas.map(area => (
                  <SelectItem key={area} value={area}>
                    <div className="flex items-center justify-between w-full">
                      <span>{area}</span>
                      <Badge variant="outline" className="ml-2">
                        {areasWithCount[area] || 0}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recommendation note when not filtering by thesis area */}
        {selectedArea !== thesis.areaTematica && thesis.areaTematica && (
          <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            <strong>Nota:</strong> Se recomienda asignar asesores de la misma área temática que la tesis cuando sea posible.
          </div>
        )}

        {/* No advisors in same area warning */}
        {!hasAdvisorsInSameArea && thesis.areaTematica && selectedArea === thesis.areaTematica && (
          <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
            No hay asesores disponibles en el área de <strong>{thesis.areaTematica}</strong>. Puede seleccionar un asesor de otra área.
          </div>
        )}

        {/* Advisor List Table */}
        <div className="max-h-[40vh] overflow-y-auto border rounded-md">
           {filteredAdvisors.length > 0 ? (
             <Table>
                <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                    <TableRow>
                    <TableHead className="font-semibold">Nombre Asesor</TableHead>
                    <TableHead className="font-semibold">Área Temática</TableHead>
                    <TableHead className="font-semibold text-center w-[100px]">Tesis Activas</TableHead>
                    <TableHead className="w-[100px]"></TableHead> 
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAdvisors.map((advisor) => (
                    <TableRow key={advisor.id} className="hover:bg-muted/30">
                        <TableCell>
                            <div className="font-medium">{advisor.nombres} {advisor.apellidoPaterno}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className={`text-xs ${advisor.areaTematica === thesis.areaTematica ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
                                {advisor.areaTematica}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge variant={advisor.tesisActivasCount > 3 ? "destructive" : "outline"} className="text-xs">
                                {advisor.tesisActivasCount}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleSelect(advisor)}
                            >
                                Seleccionar
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
           ) : (
             <div className="p-6 text-center text-muted-foreground">
                No se encontraron asesores disponibles que coincidan con los criterios de búsqueda.
                {selectedArea !== 'todas' && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedArea('todas')}
                    >
                      Mostrar todos los asesores
                    </Button>
                  </div>
                )}
             </div>
           )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}