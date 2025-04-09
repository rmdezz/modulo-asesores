import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  CheckCircle2,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Info,
  Edit,
  Save,
  Plus,
  ArrowLeft,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Loader2
} from 'lucide-react';

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
      
      // Simulate API call delay
      setTimeout(() => {
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
  
  // Render the appropriate step
  const renderStepContent = () => {
    switch (activeStep) {
      case 'upload':
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
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              
              {isLoading && (
                <div className="mb-4 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#042354] animate-spin mb-2" />
                  <p className="text-slate-600">Analizando archivo...</p>
                </div>
              )}
              
              {fileSelected && !isLoading && (
                <div>
                  <Alert className="bg-green-50 border-green-200 mt-4 mx-auto max-w-lg">
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
                    <div className="mt-3">
                      <Button 
                        className="bg-[#042354] hover:bg-[#0a3a7d] text-white w-full" 
                        onClick={handleGoToPreview}
                      >
                        Continuar a Vista Previa
                      </Button>
                    </div>
                  </Alert>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Plantilla para carga masiva</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Descargue la plantilla para asegurarse de que su archivo cumple con el formato requerido.</p>
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-yellow-800 border-yellow-600 hover:bg-yellow-100">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Plantilla
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Sobre las áreas temáticas</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Actualmente hay {existingAreas.length} áreas temáticas registradas en el sistema.</p>
                    </div>
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-800 border-blue-600 hover:bg-blue-100"
                      >
                        Ver áreas existentes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'preview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToUpload}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver a seleccionar archivo
              </Button>
              
              <Badge className="bg-blue-100 text-blue-800">
                {previewData?.length || 0} asesores en total
              </Badge>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="valid" className="px-4">
                    <FileText className="h-4 w-4 mr-2" />
                    Vista Previa
                  </TabsTrigger>
                  <TabsTrigger value="warnings" className="px-4">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Advertencias ({validationErrors.length})
                  </TabsTrigger>
                </TabsList>
                
                {newAreasDetected.length > 0 && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAreasDialog(true)}
                    className="text-blue-800 border-blue-600 hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevas áreas ({newAreasDetected.length})
                  </Button>
                )}
              </div>
              
              <TabsContent value="valid" className="mt-0">
                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
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
                        {currentData.map((item, index) => {
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
                  </div>
                  
                  {/* Pagination controls */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{endIndex}</span> de <span className="font-medium">{previewData?.length || 0}</span> asesores
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="warnings" className="mt-0">
                {validationErrors.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
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
                        {validationErrors.map((error, index) => (
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
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-md p-8 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-green-800 mb-1">¡No hay advertencias!</h3>
                    <p className="text-green-700">Todos los registros cumplen con el formato esperado.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {newAreasDetected.length > 0 && (
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800 font-medium">Nuevas áreas temáticas detectadas</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p className="mb-2">
                    Se detectaron {newAreasDetected.length} nuevas áreas temáticas que no existen en el sistema.
                    Estas áreas se crearán automáticamente al procesar la carga.
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-1" 
                    size="sm"
                    onClick={() => setShowAreasDialog(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Revisar áreas nuevas
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-6 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                className="bg-[#042354] hover:bg-[#0a3a7d] text-white"
                onClick={handleStartProcessing}
                disabled={validationErrors.some(error => error.type === 'error')}
              >
                {validationErrors.some(error => error.type === 'error') ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Corrija los errores para continuar
                  </>
                ) : (
                  <>
                    Procesar Carga Masiva
                  </>
                )}
              </Button>
            </div>
          </div>
        );
        
      case 'processing':
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
        
      case 'success':
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
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}

      {/* Diálogo para revisar áreas nuevas */}
      <Dialog open={showAreasDialog} onOpenChange={setShowAreasDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevas áreas temáticas</DialogTitle>
            <DialogDescription>
              Las siguientes áreas temáticas no existen en el sistema. Puede editarlas antes de que se registren.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {newAreasDetected.map((area, index) => (
              <div key={index} className="space-y-1">
                <Label>Área {index + 1}</Label>
                <div className="flex space-x-2 items-center">
                  <Input
                    value={editingAreaIndex === index ? area.name : newAreasDetected[index].name}
                    onChange={(e) => handleUpdateArea(index, e.target.value)}
                    disabled={editingAreaIndex !== index}
                  />
                  {editingAreaIndex === index ? (
                    <Button size="icon" onClick={() => setEditingAreaIndex(null)}>
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="icon" onClick={() => handleEditArea(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowAreasDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkAdvisorUpload;
