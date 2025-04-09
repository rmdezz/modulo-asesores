import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Upload, Download, AlertCircle, Info, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import InfoCard from './InfoCard';

const FileUploadStep = ({ 
  isLoading,
  fileSelected,
  fileName,
  previewData,
  validationErrors,
  existingAreas,
  handleFileChange,
  handleGoToPreview
}) => {
  const [fileError, setFileError] = useState(null);

  // Lista de headers obligatorios
  const requiredHeaders = ['Nombres', 'Apellidos', 'Código PUCP', 'Correo', 'Facultad', 'Especialidad'];
  
  // Función para validar el archivo antes de procesarlo
  const validateAndProcessFile = (e) => {
    setFileError(null);
    const file = e.target.files && e.target.files[0];
    
    if (!file) return;
    
    // Validar extensión
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setFileError({
        type: 'extension',
        message: 'El archivo debe ser Excel (.xlsx o .xls)'
      });
      return;
    }
    
    // Si pasa la validación de extensión, procesar el archivo
    // Aquí normalmente leerías el archivo con alguna librería como xlsx o sheetjs
    // y validarías los headers
    
    // Simulando la lectura y validación de headers
    // En un caso real, esto se haría leyendo realmente el archivo con una librería
    setTimeout(() => {
      // Simulamos que leemos los headers
      const mockHeaders = ['Nombres', 'Apellidos', 'Código PUCP', 'Correo', 'Facultad']; // Falta 'Especialidad'
      
      // Verificar si todos los headers requeridos están presentes
      const missingHeaders = requiredHeaders.filter(header => !mockHeaders.includes(header));
      
      if (missingHeaders.length > 0) {
        setFileError({
          type: 'headers',
          message: `Faltan columnas obligatorias: ${missingHeaders.join(', ')}`,
          missingHeaders
        });
        return;
      }
      
      // Si pasa todas las validaciones, llamar al handler original
      handleFileChange(e);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#042354]/5 border border-dashed border-[#042354]/30 rounded-lg p-10 text-center">
        <div className="flex justify-center mb-4">
          <FileSpreadsheet className="h-16 w-16 text-[#042354]/70" />
        </div>
        <h3 className="text-xl font-medium text-[#042354] mb-3">Subir archivo Excel</h3>
        <p className="text-slate-600 mb-3 max-w-md mx-auto">
          Suba un archivo Excel (.xlsx) con la información de los asesores que desea registrar en el sistema.
        </p>
        <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">
          Nota: El archivo debe contener las columnas requeridas (Nombres, Apellidos, Código PUCP, Correo, Facultad, Especialidad).
          El campo "Área Temática" es opcional.
        </p>
        
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer">
            <div className="bg-[#042354] text-white py-3 px-6 rounded-md hover:bg-[#0a3a7d] flex items-center font-medium">
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar Archivo
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx,.xls" 
              onChange={validateAndProcessFile}
            />
          </label>
        </div>
        
        {fileError && (
          <div className="max-w-lg mx-auto">
            <Alert className="bg-red-50 border-red-200 mt-4">
              <XCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="font-medium text-red-800">Error en el archivo</AlertTitle>
              <AlertDescription className="text-red-700">
                <p className="mt-1">{fileError.message}</p>
                
                {fileError.type === 'headers' && (
                  <div className="mt-3 bg-red-100 rounded-md p-3 text-sm">
                    <p className="font-medium mb-1">Columnas obligatorias:</p>
                    <ul className="list-disc pl-5">
                      {requiredHeaders.map((header, index) => (
                        <li key={index} className={fileError.missingHeaders?.includes(header) ? 'text-red-800 font-medium' : ''}>
                          {header} {fileError.missingHeaders?.includes(header) && '(faltante)'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-3">
                  <Button 
                    variant="outline"
                    className="bg-white text-red-700 border-red-300 hover:bg-red-50 w-full" 
                  >
                    Seleccionar otro archivo
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {isLoading && (
          <div className="mb-4 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#042354] animate-spin mb-2" />
            <p className="text-slate-600">Analizando archivo...</p>
          </div>
        )}
        
        {fileSelected && !isLoading && !fileError && (
          <div className="max-w-lg mx-auto">
            <Alert className="bg-green-50 border-green-200 mt-4">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="font-medium text-green-800">Archivo cargado correctamente</AlertTitle>
              <AlertDescription className="text-green-700">
                <p className="mt-1">
                  <span className="font-medium">{fileName}</span> - {previewData?.length || 0} asesores encontrados
                </p>
                {validationErrors.length > 0 && (
                  <p className="mt-1">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      {validationErrors.length} advertencias
                    </Badge>
                  </p>
                )}
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <Button 
                className="bg-[#042354] hover:bg-[#0a3a7d] text-white w-full" 
                onClick={handleGoToPreview}
              >
                Continuar a Vista Previa
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard 
          type="warning"
          title="Plantilla para carga masiva"
          message="Descargue la plantilla para asegurarse de que su archivo cumple con el formato requerido."
          buttonText="Descargar Plantilla"
          buttonIcon={<Download className="h-4 w-4 mr-2" />}
          onClick={() => {}}
        />
        
        <InfoCard 
          type="info"
          title="Sobre las áreas temáticas"
          message={`Actualmente hay ${existingAreas.length} áreas temáticas registradas en el sistema.`}
          buttonText="Ver áreas existentes"
          buttonIcon={<Info className="h-4 w-4 mr-2" />}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default FileUploadStep;