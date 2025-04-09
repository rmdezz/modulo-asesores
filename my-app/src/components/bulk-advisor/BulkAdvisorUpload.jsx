// src/components/bulk-advisor/BulkAdvisorUpload.jsx
import React, { useState } from 'react';
import FileUploadStep from './FileUploadStep';
import PreviewStep from './PreviewStep';
import ProcessingStep from './ProcessingStep';
import SuccessStep from './SuccessStep';
import AreasDialog from './AreasDialog';

const BulkAdvisorUpload = ({ onCancel, onSuccess }) => {
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
        const mockData = generateMockData(50);
        
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
              message: 'El asesor ya existe en el sistema con diferente especialidad'
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
    }
  };

  // Generate realistic advisor data
  const generateMockData = (count) => {
    const facultades = ['Ingeniería', 'Ciencias', 'Comunicaciones', 'Derecho', 'Arquitectura'];
    const especialidades = [
      'Sistemas', 'Informática', 'Electrónica', 'Industrial', 'Civil', 
      'Matemáticas', 'Física', 'Periodismo', 'Ciencias Políticas', 'Arquitectura'
    ];
    const areas = [
      'Inteligencia Artificial', 'Redes y Comunicaciones', 'Seguridad Informática',
      'Estadística Aplicada', 'Comunicación Digital', 'Blockchain',
      'IoT', 'Diseño de Software', 'Computación en la Nube', ''
    ];
    
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    return Array.from({ length: count }, (_, i) => {
      const nombres = [
        'Carlos Alberto', 'Ana María', 'Roberto', 'Luis', 'María Elena',
        'Jorge', 'Patricia', 'Javier', 'Mónica', 'Daniel', 'Carmen', 'Eduardo'
      ][Math.floor(Math.random() * 12)];
      
      const apellidos = [
        'Ramírez López', 'Méndez Ortega', 'Torres Gutiérrez', 'García Castro',
        'López Rivera', 'Martínez Solano', 'Fernández Díaz', 'Rodríguez Peña'
      ][Math.floor(Math.random() * 8)];
      
      // Generate numeric PUCP code with format: year (4 digits) + sequential number (4 digits)
      const year = getRandomInt(2015, 2023);
      const seq = getRandomInt(1000, 9999);
      const codigo = `${year}${seq}`;
      
      const especialidad = especialidades[Math.floor(Math.random() * especialidades.length)];
      const facultad = facultades[Math.floor(Math.random() * facultades.length)];
      
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
  
  // Handle starting the processing
  const handleStartProcessing = () => {
    setActiveStep('processing');
    // Simulate processing time
    setTimeout(() => {
      setActiveStep('success');
      // Notify parent component of success if callback exists
      if (onSuccess) onSuccess();
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
  
  // Render the appropriate step based on active step
  switch (activeStep) {
    case 'upload':
      return (
        <div className="space-y-6">
          <FileUploadStep 
            isLoading={isLoading}
            fileSelected={fileSelected}
            fileName={fileName}
            previewData={previewData}
            validationErrors={validationErrors}
            existingAreas={existingAreas}
            handleFileChange={handleFileChange}
            handleGoToPreview={handleGoToPreview}
          />
        </div>
      );
      
    case 'preview':
      return (
        <div className="space-y-6">
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
          />
          
          <AreasDialog 
            open={showAreasDialog}
            onOpenChange={setShowAreasDialog}
            areas={newAreasDetected}
            editingAreaIndex={editingAreaIndex}
            onEditArea={handleEditArea}
            onUpdateArea={handleUpdateArea}
          />
        </div>
      );
      
    case 'processing':
      return (
        <div className="space-y-6">
          <ProcessingStep />
        </div>
      );
      
    case 'success':
      return (
        <div className="space-y-6">
          <SuccessStep 
            previewData={previewData}
            newAreasDetected={newAreasDetected}
            validationErrors={validationErrors}
            onCancel={onCancel}
          />
        </div>
      );

    default:
      return null;
  }
};

export default BulkAdvisorUpload;