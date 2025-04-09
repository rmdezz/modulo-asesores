import React, { useState, useRef } from 'react';
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
  handleGoToPreview,
  facultad = "Ingeniería",
  especialidad = "Informática"
}) => {
  const [fileError, setFileError] = useState(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Lista de headers obligatorios
  const requiredHeaders = ['Nombres', 'Apellidos', 'Código PUCP', 'Correo'];
  
  // Función para validar el archivo antes de procesarlo
  const validateAndProcessFile = (file) => {
    setFileError(null);
    
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
    
    // Aquí iría la validación real del archivo Excel
    // Por simplicidad, simularemos una validación exitosa y pasaremos el archivo
    
    // Si pasa todas las validaciones, crear un evento sintético para el handler original
    const syntheticEvent = {
      target: {
        files: [file]
      }
    };
    handleFileChange(syntheticEvent);
  };

  // Handler para evento de input de archivo
  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  // Handlers para eventos de drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileSelected && !isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileSelected && !isLoading && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!fileSelected && !isLoading) {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        validateAndProcessFile(files[0]);
      }
    }
  };

  // Abridor de diálogo dedicado (siempre abre el explorador de archivos)
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

   // Función para descargar la plantilla de Excel
   const handleDownloadTemplate = () => {
    setDownloadingTemplate(true);
    
    try {
      // Importación dinámica de SheetJS (asumiendo que está disponible en el proyecto)
      import('xlsx').then(XLSX => {
        // Crear una hoja de trabajo (worksheet)
        const ws = XLSX.utils.aoa_to_sheet([
          // Encabezados
          ['Nombres', 'Apellidos', 'Código PUCP', 'Correo', 'Área Temática'],
          // Datos de ejemplo
          ['Pedro', 'Gomez', '20201234', 'pedro.gomez@pucp.edu.pe', 'Inteligencia Artificial'],
          ['Maria', 'Rodriguez', '20191235', 'maria.rodriguez@pucp.edu.pe', '']
        ]);
  
        // Aplicar estilos a los encabezados (negrita)
        const headerCellStyle = { font: { bold: true }, alignment: { horizontal: 'center' } };
        
        // Configurar anchos de columna
        const wscols = [
          { wch: 15 }, // Ancho para Nombres
          { wch: 15 }, // Ancho para Apellidos
          { wch: 15 }, // Ancho para Código PUCP
          { wch: 25 }, // Ancho para Correo
          { wch: 20 }  // Ancho para Área Temática
        ];
        ws['!cols'] = wscols;
  
        // Crear un libro de trabajo (workbook) y añadir la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Asesores');
  
        // Generar el archivo Excel
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        
        // Convertir a Blob
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        // Crear URL del objeto
        const url = URL.createObjectURL(blob);
        
        // Crear elemento de enlace para descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = `plantilla_asesores_${especialidad.toLowerCase()}.xlsx`;
        
        // Simular clic y limpiar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setDownloadingTemplate(false);
      }).catch(error => {
        console.error("Error al cargar la biblioteca xlsx:", error);
        setDownloadingTemplate(false);
      });
    } catch (error) {
      console.error("Error al generar la plantilla:", error);
      setDownloadingTemplate(false);
    }
  };

  // Renderizado condicional basado en el estado
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-10 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#042354] animate-spin mb-4" />
          <h3 className="text-xl font-medium text-[#042354] mb-2">Analizando archivo</h3>
          <p className="text-slate-600">Esto puede tomar unos momentos...</p>
        </div>
      );
    }
    
    if (fileError) {
      return (
        <div className="max-w-lg mx-auto p-6">
          <Alert className="bg-red-50 border-red-200">
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
              
              <div className="mt-4">
                <Button 
                  variant="outline"
                  className="bg-white text-red-700 border-red-300 hover:bg-red-50 w-full" 
                  onClick={openFileDialog}
                >
                  Seleccionar otro archivo
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    if (fileSelected) {
      return (
        <div className="max-w-lg mx-auto p-6">
          <Alert className="bg-green-50 border-green-200">
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
              
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline"
                  className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50" 
                  onClick={openFileDialog}
                >
                  Cambiar archivo
                </Button>
                
                <Button 
                  className="bg-[#042354] hover:bg-[#0a3a7d] text-white" 
                  onClick={handleGoToPreview}
                >
                  Continuar a Vista Previa
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    // Estado inicial - No hay archivo seleccionado
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <FileSpreadsheet className="h-16 w-16 text-[#042354]/70" />
        </div>
        <h3 className="text-xl font-medium text-[#042354] mb-3">
          Subir archivo Excel
        </h3>
        
        <p className="text-slate-600 mb-3 max-w-md mx-auto">
          Suba un archivo Excel (.xlsx) con la información de los asesores que desea registrar en el sistema.
        </p>
        
        <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">
          Nota: El archivo debe contener las columnas obligatorias (Nombres, Apellidos, Código PUCP, Correo).
          El campo "Área Temática" es opcional.
        </p>
        
        <div className="flex justify-center mb-4">
          <Button
            className="bg-[#042354] text-white py-3 px-6 rounded-md hover:bg-[#0a3a7d] flex items-center font-medium"
            onClick={openFileDialog}
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar Archivo
          </Button>
        </div>
        
        <p className="text-slate-500 text-sm">
          o arrastre y suelte un archivo aquí
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Información sobre la facultad y especialidad */}
      <div className="mb-4 flex flex-col">
        <p className="text-sm text-slate-500">
          Los asesores serán registrados en:
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <Badge className="bg-[#042354]/10 text-[#042354] hover:bg-[#042354]/20">
            Facultad: {facultad}
          </Badge>
          <Badge className="bg-[#042354]/10 text-[#042354] hover:bg-[#042354]/20">
            Especialidad: {especialidad}
          </Badge>
        </div>
      </div>
      
      {/* Contenedor de arrastrar y soltar */}
      <div 
        className={`
          bg-[#042354]/5 border-2 border-dashed 
          ${isDragging ? 'border-[#042354] bg-[#042354]/10' : 'border-[#042354]/30'} 
          rounded-lg overflow-hidden transition-all duration-200
        `}
        onDragEnter={!fileSelected && !isLoading ? handleDragEnter : undefined}
        onDragLeave={!fileSelected && !isLoading ? handleDragLeave : undefined}
        onDragOver={!fileSelected && !isLoading ? handleDragOver : undefined}
        onDrop={!fileSelected && !isLoading ? handleDrop : undefined}
      >
        {renderContent()}
        
        {/* Input oculto para la selección de archivos */}
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".xlsx,.xls" 
          onChange={handleFileInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard 
          type="warning"
          title="Plantilla para carga masiva"
          message={`Descargue la plantilla para asegurarse de que su archivo cumple con el formato requerido para ${especialidad}.`}
          buttonText={downloadingTemplate ? "Generando plantilla..." : "Descargar Plantilla"}
          buttonIcon={downloadingTemplate ? 
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
            <Download className="h-4 w-4 mr-2" />
          }
          onClick={handleDownloadTemplate}
          buttonDisabled={downloadingTemplate}
        />
        
        <InfoCard 
          type="info"
          title="Sobre las áreas temáticas"
          message={`Actualmente hay ${existingAreas.length} áreas temáticas registradas para ${especialidad}.`}
          buttonText="Ver áreas existentes"
          buttonIcon={<Info className="h-4 w-4 mr-2" />}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default FileUploadStep;