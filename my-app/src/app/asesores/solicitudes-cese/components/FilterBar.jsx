'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, X } from 'lucide-react';
import { opcionesOrdenamiento } from "../utils/constants";

const FilterBar = ({ 
  busqueda, 
  setBusqueda, 
  filtroEstado, 
  setFiltroEstado, 
  ordenarPor, 
  setOrdenarPor,
  estadosDisponibles,
  resetearFiltros
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por ID, asesor, tesista o título..."
            className="pl-9"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estadosDisponibles.map((estado) => (
              <SelectItem key={estado.valor} value={estado.valor}>
                {estado.texto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={ordenarPor} onValueChange={setOrdenarPor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {opcionesOrdenamiento.map((opcion) => (
              <SelectItem key={opcion.valor} value={opcion.valor}>
                {opcion.texto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon" onClick={resetearFiltros}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;