import React from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingStep = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 text-[#042354] animate-spin mb-4" />
      <h3 className="text-xl font-medium text-[#042354] mb-2">Procesando carga masiva</h3>
      <p className="text-slate-600 text-center max-w-md">
        Estamos registrando los asesores en el sistema. Este proceso puede tomar unos minutos dependiendo de la cantidad de registros.
      </p>
      
      <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 my-6">
        <div className="bg-[#042354] h-2.5 rounded-full w-3/4 animate-pulse"></div>
      </div>
      
      <p className="text-sm text-slate-500 italic">
        No cierre esta ventana durante el proceso
      </p>
    </div>
  );
};

export default ProcessingStep;