import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems, 
  onPreviousPage, 
  onNextPage 
}) => {
  // Función para cambiar directamente a una página específica
  const goToPage = (page) => {
    if (page < currentPage) {
      // Si vamos a una página anterior, llamamos a onPreviousPage tantas veces como sea necesario
      for (let i = 0; i < currentPage - page; i++) {
        onPreviousPage();
      }
    } else if (page > currentPage) {
      // Si vamos a una página posterior, llamamos a onNextPage tantas veces como sea necesario
      for (let i = 0; i < page - currentPage; i++) {
        onNextPage();
      }
    }
  };

  // Función para generar los botones de páginas
  const renderPageButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5; // Mostrar máximo 5 botones a la vez
    
    let startPage, endPage;
    
    if (totalPages <= maxButtonsToShow) {
      // Si hay menos páginas que el máximo a mostrar, mostramos todas
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calcular páginas inicial y final basado en la página actual
      const halfButtons = Math.floor(maxButtonsToShow / 2);
      
      if (currentPage <= halfButtons + 1) {
        // Si estamos cerca del inicio
        startPage = 1;
        endPage = maxButtonsToShow;
      } else if (currentPage >= totalPages - halfButtons) {
        // Si estamos cerca del final
        startPage = totalPages - maxButtonsToShow + 1;
        endPage = totalPages;
      } else {
        // Si estamos en medio
        startPage = currentPage - halfButtons;
        endPage = currentPage + halfButtons;
      }
    }
    
    // Agregar el primer botón si no estamos mostrando desde la primera página
    if (startPage > 1) {
      buttons.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          onClick={() => goToPage(1)}
          className="px-3"
        >
          1
        </Button>
      );
      
      // Agregar elipsis si hay salto
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis-start" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }
    
    // Agregar botones para las páginas calculadas
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(i)}
          className={`px-3 ${i === currentPage ? 'bg-[#042354] text-white' : ''}`}
        >
          {i}
        </Button>
      );
    }
    
    // Agregar el último botón si no estamos mostrando hasta la última página
    if (endPage < totalPages) {
      // Agregar elipsis si hay salto
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis-end" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      
      buttons.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          className="px-3"
        >
          {totalPages}
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
      <div className="text-sm text-gray-500 hidden sm:block">
        Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{endIndex}</span> de <span className="font-medium">{totalItems}</span> asesores
      </div>
      <div className="w-full sm:w-auto flex justify-center sm:justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="hidden sm:flex space-x-1">
          {renderPageButtons()}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;