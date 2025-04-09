import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, FileText, AlertCircle, Info, Plus, XCircle, 
  CheckCircle2, Edit, Trash2, AlertOctagon, Filter, 
  Download, BookOpen, CircleHelp, UserCog
} from 'lucide-react';
import AdvisorTable from './AdvisorTable';
import ValidationTable from './ValidationTable';
import Pagination from './Pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Componente de vista previa para la carga masiva de asesores académicos
 * 
 * Permite a coordinadores de tesis revisar, validar y gestionar la importación
 * de asesores antes de procesarlos en el sistema.
 */
const PreviewStep = ({ 
  previewData,
  validationErrors,
  existingAreas,
  newAreasDetected,
  activeTab,
  setActiveTab,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  currentData,
  onBackToUpload,
  onShowAreasDialog,
  onPreviousPage,
  onNextPage,
  onStartProcessing,
  onCancel
}) => {
  // Estado para rastrear qué filas han sido excluidas
  const [excludedRows, setExcludedRows] = useState([]);
  
  // Estado para mostrar/ocultar el panel de ayuda
  const [showHelp, setShowHelp] = useState(false);
  
  // Asegurar que los elementos de validationErrors son string
  const sanitizeError = (error) => {
    return {
      ...error,
      advisor: typeof error.advisor === 'object' ? 
        (error.advisor.name || 'Nombre no disponible') : error.advisor,
      message: typeof error.message === 'object' ? 
        JSON.stringify(error.message) : error.message
    };
  };
  
  // Sanitizar todos los errores para evitar problemas de renderizado
  const sanitizedValidationErrors = validationErrors.map(sanitizeError);

  // Filtrar errores para mostrar solo los que no han sido excluidos
  const activeErrors = sanitizedValidationErrors.filter(error => !excludedRows.includes(error.row));
  
  // Verificar si quedan errores críticos sin resolver
  const hasCriticalErrors = activeErrors.some(error => error.type === 'error');

  // Contadores para diferentes tipos de problemas
  const criticalErrorCount = activeErrors.filter(e => e.type === 'error').length;
  const warningCount = activeErrors.filter(e => e.type === 'warning').length;
  
  // Función para excluir una fila específica
  const handleExcludeRow = (rowIndex) => {
    if (excludedRows.includes(rowIndex)) {
      setExcludedRows(excludedRows.filter(row => row !== rowIndex));
    } else {
      setExcludedRows([...excludedRows, rowIndex]);
    }
  };

  // Función para excluir todas las filas con errores críticos
  const handleExcludeAllErrors = () => {
    const errorRows = sanitizedValidationErrors
      .filter(error => error.type === 'error')
      .map(error => error.row);
    
    // Combinar las filas ya excluidas con las nuevas, evitando duplicados
    const newExcludedRows = [...new Set([...excludedRows, ...errorRows])];
    setExcludedRows(newExcludedRows);
  };
  
  // Función para incluir todos los registros (deshacer exclusiones)
  const handleIncludeAll = () => {
    setExcludedRows([]);
  };
  
  // Verificar cuántos registros serán procesados (total - excluidos)
  const recordsToProcess = previewData ? previewData.length - excludedRows.length : 0;
  
  // Calcular el porcentaje de registros válidos para la barra de progreso
  const validPercentage = previewData ? Math.round((recordsToProcess / previewData.length) * 100) : 0;
  
  // Determinar el color de la barra de progreso basado en el porcentaje
  const progressColor = hasCriticalErrors 
    ? "bg-red-500" 
    : validPercentage > 90 
      ? "bg-green-500" 
      : validPercentage > 70 
        ? "bg-yellow-500" 
        : "bg-orange-500";
  
  // Función para exportar registros con errores a CSV
  const handleExportErrorsCSV = () => {
    // Aquí iría la lógica para exportar los errores a CSV
    console.log("Exportar errores a CSV");
  };
  
  // Memoizar los datos filtrados para evitar recálculos innecesarios
  const filteredData = useMemo(() => {
    return currentData.filter(item => {
      const rowIndex = startIndex + currentData.indexOf(item) + 1;
      return !excludedRows.includes(rowIndex);
    });
  }, [currentData, excludedRows, startIndex]);

  return (
    <div className="space-y-6">
      {/* Cabecera con título y descripción contextual */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
          <UserCog className="h-6 w-6 mr-2 text-blue-600" />
          Validación de Asesores Académicos
        </h2>
        <p className="text-slate-600">
          Revise los datos de los asesores antes de importarlos al sistema. Identifique y resuelva posibles errores o agregue nuevas áreas de especialización.
        </p>
      </div>
      
      {/* Barra de progreso y estadísticas */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToUpload}
              className="text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a seleccionar archivo
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowHelp(!showHelp)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <CircleHelp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Mostrar/ocultar ayuda</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex space-x-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1 flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {recordsToProcess} de {previewData?.length || 0} asesores
            </Badge>
            
            {excludedRows.length > 0 && (
              <Badge className="bg-red-100 text-red-800 px-3 py-1 flex items-center">
                <XCircle className="h-3 w-3 mr-1" />
                {excludedRows.length} registros excluidos
              </Badge>
            )}
            
            {criticalErrorCount > 0 && (
              <Badge className="bg-red-100 text-red-800 px-3 py-1 flex items-center">
                <AlertOctagon className="h-3 w-3 mr-1" />
                {criticalErrorCount} errores críticos
              </Badge>
            )}
            
            {warningCount > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {warningCount} advertencias
              </Badge>
            )}
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div 
            className={`h-2.5 rounded-full ${progressColor}`} 
            style={{ width: `${validPercentage}%` }}
          ></div>
        </div>
        
        {/* Panel de ayuda contextual */}
        {showHelp && (
          <Alert className="bg-blue-50 border-blue-200 mb-4">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800 font-medium">Ayuda para la validación</AlertTitle>
            <AlertDescription className="text-blue-700">
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Revise todos los registros en la pestaña <strong>Vista Previa</strong>.</li>
                <li>Consulte la pestaña <strong>Advertencias</strong> para ver los problemas detectados.</li>
                <li>Los <strong>errores críticos</strong> deben resolverse antes de continuar.</li>
                <li>Puede <strong>excluir</strong> registros con problemas para procesarlos más tarde.</li>
                <li>Las <strong>nuevas áreas</strong> detectadas se pueden revisar antes de crearlas.</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="p-1">
            <TabsTrigger value="valid" className="px-4 py-2">
              <FileText className="h-4 w-4 mr-2" />
              Vista Previa
            </TabsTrigger>
            <TabsTrigger value="warnings" className="px-4 py-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              Advertencias ({activeErrors.length})
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            {activeErrors.length > 0 && (
              <Button 
                variant="outline"
                size="sm"
                onClick={handleExportErrorsCSV}
                className="text-slate-700 border-slate-300 hover:bg-slate-100"
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar errores
              </Button>
            )}
            
            {newAreasDetected.length > 0 && (
              <Button 
                variant="outline"
                size="sm"
                onClick={onShowAreasDialog}
                className="text-blue-800 border-blue-600 hover:bg-blue-100"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nuevas áreas ({newAreasDetected.length})
              </Button>
            )}
          </div>
        </div>
        
        {/* Contenido de pestaña: Vista Previa */}
        <TabsContent value="valid" className="mt-0">
          {filteredData.length > 0 ? (
            <div className="border rounded-md overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <AdvisorTable 
                  data={filteredData} 
                  startIndex={startIndex}
                  excludedRows={excludedRows}
                  onExcludeRow={handleExcludeRow}
                  existingAreas={existingAreas}
                  validationErrors={activeErrors}
                  renderSafely
                />
              </div>
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={previewData?.length || 0}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
              />
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-8 text-center">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-yellow-800 mb-1">No hay registros para mostrar</h3>
              <p className="text-yellow-700 mb-4">Todos los registros han sido excluidos de la importación.</p>
              {excludedRows.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIncludeAll}
                  className="bg-yellow-200 border-yellow-300 text-yellow-800 hover:bg-yellow-300"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Incluir todos los registros
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Contenido de pestaña: Advertencias */}
        <TabsContent value="warnings" className="mt-0">
          {activeErrors.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                  <Badge className={activeErrors.some(e => e.type === 'error') ? 
                    "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                    {activeErrors.filter(e => e.type === 'error').length} errores críticos
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {activeErrors.filter(e => e.type === 'warning').length} advertencias
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  {activeErrors.filter(e => e.type === 'error').length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleExcludeAllErrors}
                      className="text-red-800 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir registros con errores
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportErrorsCSV}
                    className="text-slate-700 border-slate-300 hover:bg-slate-100"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar a CSV
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fila
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre del Asesor
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código de Error
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severidad
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeErrors.map((error, index) => (
                      <tr key={index} className={error.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {error.row}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {typeof error.advisor === 'object' 
                            ? (error.advisor?.name || JSON.stringify(error.advisor)) 
                            : error.advisor}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {error.code}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <Badge className={error.type === 'error' 
                            ? "bg-red-100 text-red-800" 
                            : "bg-yellow-100 text-yellow-800"}
                          >
                            {error.type === 'error' ? 'Error crítico' : 'Advertencia'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {typeof error.message === 'object' 
                            ? JSON.stringify(error.message) 
                            : error.message}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant={excludedRows.includes(error.row) ? "default" : "outline"}
                                  onClick={() => handleExcludeRow(error.row)}
                                  className={excludedRows.includes(error.row) 
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "text-red-700 border-red-600 hover:bg-red-50"}
                                >
                                  {excludedRows.includes(error.row) ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {excludedRows.includes(error.row) ? 'Excluido' : 'Excluir'}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p className="text-xs">
                                  {excludedRows.includes(error.row) 
                                    ? "Este registro no será importado" 
                                    : "Excluir este registro de la importación"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-green-800 mb-1">¡Datos validados correctamente!</h3>
              <p className="text-green-700">Todos los registros cumplen con el formato esperado para la Facultad.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Alerta para nuevas áreas temáticas */}
      {newAreasDetected.length > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 font-medium">Nuevas áreas de especialización detectadas</AlertTitle>
          <AlertDescription className="text-blue-700">
            <p className="mb-2">
              Se encontraron {newAreasDetected.length} nuevas áreas de especialización académica que no existen actualmente en el sistema.
              Estas áreas se crearán automáticamente al procesar la importación.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {newAreasDetected.slice(0, 3).map((area, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-800 px-3 py-1">
                  {typeof area === 'object' ? area.name || 'Área sin nombre' : area}
                </Badge>
              ))}
              {newAreasDetected.length > 3 && (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  +{newAreasDetected.length - 3} más
                </Badge>
              )}
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white mt-3" 
              size="sm"
              onClick={onShowAreasDialog}
            >
              <Edit className="h-4 w-4 mr-2" />
              Revisar áreas nuevas
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Resumen del estado de la validación */}
      {excludedRows.length > 0 && (
        <Alert className={hasCriticalErrors ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
          {hasCriticalErrors ? (
            <AlertOctagon className="h-5 w-5 text-red-600" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
          
          <AlertTitle className={hasCriticalErrors ? "text-red-800 font-medium" : "text-green-800 font-medium"}>
            Resumen de exclusiones
          </AlertTitle>
          
          <AlertDescription className={hasCriticalErrors ? "text-red-700" : "text-green-700"}>
            <div className="space-y-1 mt-1">
              <p>
                Se excluirán {excludedRows.length} registros de la importación masiva.
              </p>
              
              {hasCriticalErrors && (
                <p className="font-medium text-red-800 mt-2">
                  Aún quedan {activeErrors.filter(e => e.type === 'error').length} errores críticos por resolver.
                </p>
              )}
              
              {excludedRows.length > 0 && !hasCriticalErrors && (
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={handleIncludeAll}
                  className="mt-2 text-green-800 border-green-600 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Incluir todos los registros
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Botones de acción */}
      <div className="mt-6 flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          Cancelar importación
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBackToUpload}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a seleccionar archivo
          </Button>
          
          <Button 
            type="button" 
            className={hasCriticalErrors 
              ? "bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed" 
              : "bg-[#042354] hover:bg-[#0a3a7d] text-white"}
            onClick={onStartProcessing}
            disabled={hasCriticalErrors}
          >
            {hasCriticalErrors ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Resolver errores para continuar
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Importar {recordsToProcess} Asesores
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;