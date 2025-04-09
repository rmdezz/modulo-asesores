// src/components/bulk-advisor/BulkAdvisorUpload.jsx
import React, { useState } from 'react';
import FileUploadStep from './FileUploadStep';
import PreviewStep from './PreviewStep';
import ProcessingStep from './ProcessingStep';
import SuccessStep from './SuccessStep';
import AreasDialog from './AreasDialog';

const BulkAdvisorUpload = ({ onCancel, onSuccess, facultad = "Ingeniería", especialidad = "Informática" }) => {
  const [activeStep, setActiveStep] = useState('upload'); // upload, preview, processing, success
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [newAreasDetected, setNewAreasDetected] = useState([]);
  const [showAreasDialog, setShowAreasDialog] = useState(false);
  const [editingAreaIndex, setEditingAreaIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('valid');
  const [excludedRows, setExcludedRows] = useState([]);
  
  const itemsPerPage = 10;

  // Mock existing areas in the system
  const existingAreas = [
    { id: 'ai', name: 'Inteligencia Artificial' },
    { id: 'networks', name: 'Redes y Comunicaciones' },
    { id: 'security', name: 'Seguridad Informática' }
  ];
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true);
      setFileName(e.target.files[0].name);
      
      // Simulate API call delay - esta función ahora solo se llamaría después de las validaciones
      setTimeout(() => {
        // En un caso real, aquí procesarías el archivo con una librería como SheetJS/xlsx
        // y validarías que todos los headers necesarios están presentes
        
        // Generate more realistic sample data
        const mockData = generateMockData(50, facultad, especialidad);
        
        setPreviewData(mockData);
        setFileSelected(true);
        
        // Detect new areas
        const newAreas = [];
        mockData.forEach(item => {
          if (item.area && !existingAreas.some(existing => existing.name === item.area) && 
              !newAreas.some(newArea => newArea.name === item.area)) {
            newAreas.push({
              id: item.area.toLowerCase().replace(/\s+/g, '_'),
              name: item.area,
              especialidad: item.especialidad,
              facultad: item.facultad
            });
          }
        });
        
        // Generate some validation errors
        const errors = [];
        mockData.slice(0, 3).forEach((item, index) => {
          if (index === 0) {
            errors.push({
              row: index + 1,
              advisor: `${item.nombres} ${item.apellidos}`,
              code: item.codigo,
              type: 'error',
              message: 'El correo electrónico no pertenece al dominio PUCP'
            });
          } else if (index === 1) {
            errors.push({
              row: index + 1,
              advisor: `${item.nombres} ${item.apellidos}`,
              code: item.codigo,
              type: 'warning',
              message: 'El asesor ya existe en el sistema con diferente área temática'
            });
          } else {
            errors.push({
              row: index + 1,
              advisor: `${item.nombres} ${item.apellidos}`,
              code: item.codigo,
              type: 'warning',
              message: 'El código PUCP no sigue el formato esperado'
            });
          }
        });
        
        setValidationErrors(errors);
        setNewAreasDetected(newAreas);
        setIsLoading(false);
      }, 1500);
    } else {
      setFileSelected(false);
      setFileName('');
      setPreviewData(null);
      setNewAreasDetected([]);
      setValidationErrors([]);
      setExcludedRows([]);
    }
  };

  // Generate realistic advisor data from the same faculty and specialty
  const generateMockData = (count, facultad, especialidad) => {
    const areas = [
      'Inteligencia Artificial', 'Redes y Comunicaciones', 'Seguridad Informática',
      'Estadística Aplicada', 'Blockchain', 'IoT', 'Diseño de Software', 
      'Computación en la Nube', 'Ingeniería de Software', 'Bases de Datos Avanzadas', ''
    ];
    
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    return Array.from({ length: count }, (_, i) => {
      const nombres = [
        'Carlos Alberto', 'Ana María', 'Roberto', 'Luis', 'María Elena',
        'Jorge', 'Patricia', 'Javier', 'Mónica', 'Daniel', 'Carmen', 'Eduardo',
        'Rosa', 'Juan Pablo', 'Sofía', 'Miguel', 'Alejandra', 'Víctor', 'Lucía'
      ][Math.floor(Math.random() * 19)];
      
      const apellidos = [
        'Ramírez López', 'Méndez Ortega', 'Torres Gutiérrez', 'García Castro',
        'López Rivera', 'Martínez Solano', 'Fernández Díaz', 'Rodríguez Peña',
        'Vargas Silva', 'Morales Quispe', 'Sánchez Flores', 'Díaz Vega',
        'Paredes Acosta', 'Delgado Chávez', 'Herrera Paz', 'Medina Rojas'
      ][Math.floor(Math.random() * 16)];
      
      // Generate numeric PUCP code with format: year (4 digits) + sequential number (4 digits)
      const year = getRandomInt(2015, 2023);
      const seq = getRandomInt(1000, 9999);
      const codigo = `${year}${seq}`;
      
      // Determine if this advisor has an area (80% chance)
      const area = Math.random() < 0.8 ? 
        areas[Math.floor(Math.random() * areas.length)] : '';
      
      const name = nombres.split(' ')[0].toLowerCase();
      const surname = apellidos.split(' ')[0].toLowerCase();
      
      return {
        nombres,
        apellidos,
        codigo,
        correo: `${name}.${surname}@pucp.edu.pe`,
        facultad,
        especialidad,
        area
      };
    });
  };
  
  const handleEditArea = (index) => {
    setEditingAreaIndex(index);
  };
  
  const handleUpdateArea = (index, newName) => {
    const updatedAreas = [...newAreasDetected];
    updatedAreas[index].name = newName;
    updatedAreas[index].id = newName.toLowerCase().replace(/\s+/g, '_');
    setNewAreasDetected(updatedAreas);
    setEditingAreaIndex(null);
  };
  
  // Handle proceeding to preview step
  const handleGoToPreview = () => {
    setActiveStep('preview');
  };
  
  // Handle going back to upload step
  const handleBackToUpload = () => {
    setActiveStep('upload');
  };
  
  // Handle excluding rows with errors
  const handleExcludeRow = (rowIndex) => {
    if (excludedRows.includes(rowIndex)) {
      setExcludedRows(excludedRows.filter(row => row !== rowIndex));
    } else {
      setExcludedRows([...excludedRows, rowIndex]);
    }
  };

  // Handle excluding all rows with errors
  const handleExcludeAllErrors = () => {
    const errorRows = validationErrors
      .filter(error => error.type === 'error')
      .map(error => error.row);
    
    const newExcludedRows = [...new Set([...excludedRows, ...errorRows])];
    setExcludedRows(newExcludedRows);
  };
  
  // Handle starting the processing
  const handleStartProcessing = () => {
    // Filter out excluded rows from the data to process
    const dataToProcess = previewData.filter((_, index) => !excludedRows.includes(index + 1));
    
    setActiveStep('processing');
    // Simulate processing time
    setTimeout(() => {
      setActiveStep('success');
      // Notify parent component of success if callback exists
      if (onSuccess) onSuccess(dataToProcess);
    }, 3000);
  };
  
  // Calculate pagination values
  const totalPages = previewData ? Math.ceil(previewData.length / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, previewData ? previewData.length : 0);
  const currentData = previewData ? previewData.slice(startIndex, endIndex) : [];
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  // Contenedor principal con padding
  const containerStyle = {
    padding: '24px', // Padding de 24px en todos los lados
    maxWidth: '1280px', // Ancho máximo para evitar que se estire demasiado en pantallas grandes
    margin: '0 auto', // Centrar el contenedor
    backgroundColor: '#ffffff', // Fondo blanco
    borderRadius: '8px', // Bordes redondeados
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Sombra ligera
  };
  
  // Filtrar errores para mostrar solo los que no han sido excluidos
  const activeErrors = validationErrors.filter(error => !excludedRows.includes(error.row));
  
  // Verificar si quedan errores críticos sin resolver
  const hasCriticalErrors = activeErrors.some(error => error.type === 'error');

  // Verificar cuántos registros serán procesados (total - excluidos)
  const recordsToProcess = previewData ? previewData.length - excludedRows.length : 0;
  
  // Render the appropriate step based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 'upload':
        return (
          <FileUploadStep 
            isLoading={isLoading}
            fileSelected={fileSelected}
            fileName={fileName}
            previewData={previewData}
            validationErrors={validationErrors}
            existingAreas={existingAreas}
            handleFileChange={handleFileChange}
            handleGoToPreview={handleGoToPreview}
            facultad={facultad}
            especialidad={especialidad}
          />
        );
        
      case 'preview':
        return (
          <>
            <PreviewStep 
              previewData={previewData}
              validationErrors={validationErrors}
              existingAreas={existingAreas}
              newAreasDetected={newAreasDetected}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              currentData={currentData}
              onBackToUpload={handleBackToUpload}
              onShowAreasDialog={() => setShowAreasDialog(true)}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              onStartProcessing={handleStartProcessing}
              onCancel={onCancel}
              excludedRows={excludedRows}
              onExcludeRow={handleExcludeRow}
              onExcludeAllErrors={handleExcludeAllErrors}
              activeErrors={activeErrors}
              hasCriticalErrors={hasCriticalErrors}
              recordsToProcess={recordsToProcess}
              facultad={facultad}
              especialidad={especialidad}
            />
            
            <AreasDialog 
              open={showAreasDialog}
              onOpenChange={setShowAreasDialog}
              areas={newAreasDetected}
              editingAreaIndex={editingAreaIndex}
              onEditArea={handleEditArea}
              onUpdateArea={handleUpdateArea}
              facultad={facultad}
              especialidad={especialidad}
            />
          </>
        );
        
      case 'processing':
        return <ProcessingStep />;
        
      case 'success':
        return (
          <SuccessStep 
            previewData={previewData.filter((_, index) => !excludedRows.includes(index + 1))}
            newAreasDetected={newAreasDetected}
            validationErrors={validationErrors.filter(error => !excludedRows.includes(error.row))}
            onCancel={onCancel}
            facultad={facultad}
            especialidad={especialidad}
            excludedCount={excludedRows.length}
          />
        );
  
      default:
        return null;
    }
  };

  // Retornamos el contenedor con padding y el contenido del paso actual
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div style={containerStyle} className="shadow-md">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#042354]">
            Carga masiva de asesores - {facultad} ({especialidad})
          </h2>
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default BulkAdvisorUpload;