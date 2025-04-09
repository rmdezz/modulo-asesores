import React from 'react';
import { Badge } from '@/components/ui/badge';

const ValidationTable = ({ errors }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fila</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asesor</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {errors.map((error, index) => (
          <tr key={index} className={error.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'}>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{error.row}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{error.advisor}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{error.code}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
              {error.type === 'error' ? (
                <Badge className="bg-red-100 text-red-800">Error</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">{error.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ValidationTable;