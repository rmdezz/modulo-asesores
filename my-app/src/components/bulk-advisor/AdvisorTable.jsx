import React from 'react';
import { Badge } from '@/components/ui/badge';

const AdvisorTable = ({ 
  data, 
  startIndex,
  existingAreas,
  validationErrors
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código PUCP</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facultad</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área Temática</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => {
          const hasWarning = validationErrors.some(error => 
            error.row === startIndex + index + 1
          );
          
          return (
            <tr key={index} className={hasWarning ? 'bg-yellow-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{startIndex + index + 1}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.nombres}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.apellidos}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.codigo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.correo}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.facultad}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.especialidad}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {item.area ? (
                  <div className="flex items-center">
                    <span>{item.area}</span>
                    {!existingAreas.some(existing => existing.name === item.area) && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800">Nueva</Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No especificada</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AdvisorTable;