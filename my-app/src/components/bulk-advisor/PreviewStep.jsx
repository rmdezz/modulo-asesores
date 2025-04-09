import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, AlertCircle, Info, Plus, XCircle, CheckCircle2, Edit } from 'lucide-react';
import AdvisorTable from './AdvisorTable';
import ValidationTable from './ValidationTable';
import Pagination from './Pagination';

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBackToUpload}
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
              onClick={onShowAreasDialog}
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
              <AdvisorTable 
                data={currentData} 
                startIndex={startIndex}
                existingAreas={existingAreas}
                validationErrors={validationErrors}
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
        </TabsContent>
        
        <TabsContent value="warnings" className="mt-0">
          {validationErrors.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <ValidationTable errors={validationErrors} />
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
              onClick={onShowAreasDialog}
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
          onClick={onStartProcessing}
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
};

export default PreviewStep;