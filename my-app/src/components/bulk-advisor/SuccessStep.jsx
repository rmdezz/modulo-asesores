import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Download, FileText, Check } from 'lucide-react';

const SuccessStep = ({ 
  previewData, 
  newAreasDetected, 
  validationErrors,
  onCancel 
}) => {
  return (
    <div className="py-6">
      <Alert className="bg-green-50 border-green-200 text-green-800 my-6">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        <AlertTitle className="font-medium text-green-800 text-lg">Registro exitoso</AlertTitle>
        <AlertDescription className="text-green-700 mt-2">
          <p className="mb-3">
            Se han registrado correctamente <span className="font-medium">{previewData?.length || 0}</span> asesores desde el archivo Excel.
          </p>
          
          {newAreasDetected.length > 0 && (
            <div className="mb-3 bg-green-100 p-3 rounded-md">
              <p className="font-medium mb-2">
                Nuevas áreas temáticas creadas:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {newAreasDetected.map((area, index) => (
                  <li key={index}>
                    <span className="font-medium">{area.name}</span> <span className="text-green-600 text-sm">(Facultad: {area.facultad}, Especialidad: {area.especialidad})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p>
            Se han enviado las credenciales de acceso a los correos electrónicos proporcionados.
          </p>
          
          <div className="mt-6">
            <Button 
              className="bg-[#042354] hover:bg-[#0a3a7d] text-white" 
              onClick={onCancel}
            >
              <Check className="h-4 w-4 mr-2" />
              Volver a la lista de asesores
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      <Card className="mb-4">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-[#042354]">Detalles del proceso</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-md p-4 text-center">
                <p className="text-sm text-blue-600 mb-1">Total procesados</p>
                <p className="text-2xl font-bold text-blue-800">{previewData?.length || 0}</p>
              </div>
              <div className="bg-green-50 rounded-md p-4 text-center">
                <p className="text-sm text-green-600 mb-1">Registros exitosos</p>
                <p className="text-2xl font-bold text-green-800">{previewData?.length - validationErrors.filter(e => e.type === 'error').length || 0}</p>
              </div>
              <div className="bg-yellow-50 rounded-md p-4 text-center">
                <p className="text-sm text-yellow-600 mb-1">Con advertencias</p>
                <p className="text-2xl font-bold text-yellow-800">{validationErrors.filter(e => e.type === 'warning').length}</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" className="mr-2">
                <Download className="h-4 w-4 mr-2" />
                Descargar reporte
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Ver detalles completos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessStep;