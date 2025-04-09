import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  CheckCircle2, Download, FileText, Check, Users, 
  ChevronRight, Mail, BookUser, FileBarChart, AlertCircle,
  HelpCircle, Share2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink, X } from 'lucide-react';

const ShareReportDialog = ({ 
  open, 
  onOpenChange, 
  previewData = [], 
  facultad = 'Ingeniería', 
  especialidad = 'Informática' 
}) => {
  const [shareMethod, setShareMethod] = useState('email');
  const [selectedRole, setSelectedRole] = useState('director');
  const [shareLink, setShareLink] = useState(`https://sistema-tesis.pucp.edu.pe/informes/asesores/${Date.now()}`);
  const [emailAddresses, setEmailAddresses] = useState('');
  const [customMessage, setCustomMessage] = useState(
    `Estimado/a:\n\nComparto el informe de la reciente carga masiva de asesores para la especialidad de ${especialidad} de la facultad de ${facultad}.\n\nSe han registrado exitosamente ${previewData.length} asesores en el sistema.\n\nSaludos cordiales.`
  );
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeWarnings, setIncludeWarnings] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Roles predefinidos para compartir
  const roles = [
    { id: 'director', name: 'Director/a de Estudios' },
    { id: 'decano', name: 'Decano/a de Facultad' },
    { id: 'administrativo', name: 'Personal Administrativo' },
    { id: 'coordinadores', name: 'Otros Coordinadores' },
    { id: 'custom', name: 'Direcciones personalizadas' }
  ];

  // Función para manejar la copia del enlace
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  // Función para simular el envío del informe por correo
  const handleSendEmail = () => {
    // Aquí iría la lógica real para enviar el correo
    console.log("Enviando informe por correo a:", selectedRole === 'custom' ? emailAddresses : `Rol: ${selectedRole}`);
    console.log("Mensaje:", customMessage);
    console.log("Incluir detalles:", includeDetails);
    console.log("Incluir advertencias:", includeWarnings);
    
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 4000);
  };
  
  // Función para generar un PDF del informe (simulada)
  const handleGeneratePdf = () => {
    alert("Se generaría un PDF con el informe completo para descargar o adjuntar");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-[#042354]">
            <Share2 className="h-5 w-5 mr-2" /> 
            Compartir informe de carga masiva
          </DialogTitle>
          <DialogDescription>
            Comparta los resultados de la carga masiva con otros miembros de la universidad.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" onValueChange={setShareMethod} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" /> Por correo
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" /> Por enlace
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Destinatarios</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destinatarios" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedRole === 'custom' && (
                <div className="pt-2">
                  <label className="text-sm font-medium text-gray-700">Direcciones de correo</label>
                  <Textarea 
                    placeholder="Ingrese las direcciones de correo separadas por comas" 
                    className="mt-1"
                    value={emailAddresses}
                    onChange={(e) => setEmailAddresses(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mensaje</label>
              <Textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="space-y-3 border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-700">Opciones de informe</p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeDetails" 
                  checked={includeDetails}
                  onCheckedChange={setIncludeDetails}
                />
                <label htmlFor="includeDetails" className="text-sm text-gray-600">
                  Incluir detalles de cada asesor
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeWarnings" 
                  checked={includeWarnings}
                  onCheckedChange={setIncludeWarnings}
                />
                <label htmlFor="includeWarnings" className="text-sm text-gray-600">
                  Incluir advertencias y errores
                </label>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-gray-600"
                  onClick={handleGeneratePdf}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Vista previa del informe
                </Button>
              </div>
            </div>
            
            {notificationSent && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Informe enviado exitosamente a los destinatarios seleccionados.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enlace al informe</label>
              <div className="flex">
                <Input
                  value={shareLink}
                  readOnly
                  className="rounded-r-none"
                />
                <Button
                  className={linkCopied ? "bg-green-600 hover:bg-green-700 rounded-l-none" : "bg-[#042354] hover:bg-[#0a3a7d] rounded-l-none"}
                  onClick={handleCopyLink}
                >
                  {linkCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Este enlace permite acceder al informe a cualquier miembro de la universidad con los permisos adecuados.
              </p>
            </div>
            
            <div className="space-y-2 border rounded-md p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700">Opciones de acceso</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="accessDirector" defaultChecked />
                  <label htmlFor="accessDirector" className="text-sm text-gray-600">
                    Director/a de Estudios
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accessDecano" defaultChecked />
                  <label htmlFor="accessDecano" className="text-sm text-gray-600">
                    Decano/a de Facultad
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accessCoords" defaultChecked />
                  <label htmlFor="accessCoords" className="text-sm text-gray-600">
                    Otros coordinadores
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accessAdmin" />
                  <label htmlFor="accessAdmin" className="text-sm text-gray-600">
                    Personal administrativo
                  </label>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Checkbox id="expiryDate" defaultChecked />
                  <label htmlFor="expiryDate" className="text-sm text-gray-600">
                    El enlace expira en 30 días
                  </label>
                </div>
              </div>
            </div>
            
            {linkCopied && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  ¡Enlace copiado al portapapeles!
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-300">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </DialogClose>
          
          {shareMethod === 'email' ? (
            <Button 
              className="bg-[#042354] hover:bg-[#0a3a7d]"
              onClick={handleSendEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar informe
            </Button>
          ) : (
            <Button 
              className="bg-[#042354] hover:bg-[#0a3a7d]"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar enlace
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SuccessStep = ({ 
  previewData, 
  newAreasDetected, 
  validationErrors,
  onCancel,
  excludedCount = 0,
  facultad = 'Ingeniería',
  especialidad = 'Informática'
}) => {
  // Estado para controlar el diálogo de compartir informe
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Calcular estadísticas para mostrar en el panel
  const totalProcessed = previewData?.length || 0;
  const successCount = totalProcessed - validationErrors.filter(e => e.type === 'error').length;
  const warningCount = validationErrors.filter(e => e.type === 'warning').length;
  
  // Calcular porcentajes para las barras de progreso
  const successPercentage = totalProcessed > 0 ? (successCount / totalProcessed) * 100 : 0;
  const warningPercentage = totalProcessed > 0 ? (warningCount / totalProcessed) * 100 : 0;
  
  // Fecha actual formateada
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Función para generar y descargar el reporte en formato CSV
  const handleDownloadReport = () => {
    // Crear encabezados del CSV
    const headers = [
      'Nombres', 
      'Apellidos', 
      'Código PUCP', 
      'Correo', 
      'Área Temática', 
      'Estado'
    ];
    
    // Generar el cuerpo del CSV a partir de los datos de previewData
    const rows = previewData.map(advisor => {
      // Verificar si este asesor tiene alguna advertencia o error
      const hasIssue = validationErrors.some(error => 
        error.code === advisor.codigo || 
        error.advisor.includes(advisor.nombres) || 
        error.advisor.includes(advisor.apellidos)
      );
      
      const status = hasIssue ? 
        (validationErrors.find(error => 
          error.code === advisor.codigo || 
          error.advisor.includes(advisor.nombres) || 
          error.advisor.includes(advisor.apellidos)
        )?.type === 'error' ? 'Error' : 'Advertencia') : 
        'Éxito';
      
      return [
        advisor.nombres,
        advisor.apellidos,
        advisor.codigo,
        advisor.correo,
        advisor.area || '(No asignada)',
        status
      ];
    });
    
    // Combinar encabezados y filas
    const csvData = [
      headers,
      ...rows
    ].map(row => row.join(','));
    
    // Añadir información adicional al inicio del CSV
    const infoRows = [
      `Reporte de carga masiva - ${facultad} (${especialidad})`,
      `Fecha: ${currentDate}`,
      `Total procesados: ${totalProcessed}`,
      `Registros excluidos: ${excludedCount}`,
      `Registros exitosos: ${successCount}`,
      `Con advertencias: ${warningCount}`,
      '',  // Línea en blanco para separar
    ];
    
    // Combinar todo en un string CSV
    const csvContent = infoRows.concat(csvData).join('\n');
    
    // Crear un blob y un enlace de descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `carga_asesores_${especialidad.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Función para volver a la lista de asesores
  const handleBackToList = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      // Fallback en caso de que onCancel no esté definido
      window.location.href = '/asesores';
    }
  };
  
  // Función para mostrar detalles completos
  const handleShowDetails = () => {
    // En un caso real, esto abriría un modal con detalles o navegaría a una página de detalles
    alert('Esta funcionalidad mostraría un informe detallado de cada asesor procesado.');
  };

  // Función para abrir el diálogo de compartir
  const handleOpenShareDialog = () => {
    setShowShareDialog(true);
  };

  // Función para simular el envío de correos de bienvenida
  const handleSendWelcomeEmails = () => {
    alert(`Se enviarán correos de bienvenida a ${successCount} asesores.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner de éxito con información principal */}
      <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
        <div className="bg-green-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-green-800">Carga masiva completada</h2>
              <p className="text-green-700 text-sm">{currentDate}</p>
            </div>
          </div>
          <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1">
            {totalProcessed} asesores registrados
          </Badge>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Indicadores de éxito */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-700">Total procesados</h3>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{totalProcessed}</span>
                </div>
                <Progress value={100} className="h-2 bg-blue-100" />
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-gray-700">Registros exitosos</h3>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{successCount}</span>
                </div>
                <Progress value={successPercentage} className="h-2 bg-green-100" />
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="font-medium text-gray-700">Con advertencias</h3>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{warningCount}</span>
                </div>
                <Progress value={warningPercentage} className="h-2 bg-yellow-100" />
              </CardContent>
            </Card>
          </div>
          
          {/* Mensaje de notificación de correos */}
          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <Mail className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800 font-medium">Notificaciones enviadas</AlertTitle>
            <AlertDescription className="text-blue-700">
              Se han enviado correos de acceso a todos los asesores registrados exitosamente. 
              <Button 
                variant="link" 
                className="text-blue-600 p-0 h-auto font-medium"
                onClick={handleSendWelcomeEmails}
              >
                Reenviar correos
              </Button>
            </AlertDescription>
          </Alert>
          
          {/* Áreas temáticas */}
          {newAreasDetected.length > 0 && (
            <Card className="border border-green-200 mb-6">
              <CardHeader className="bg-green-50 py-3 px-4 border-b border-green-200">
                <CardTitle className="text-green-800 text-base font-medium flex items-center">
                  <BookUser className="h-5 w-5 mr-2" />
                  Nuevas áreas temáticas creadas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {newAreasDetected.map((area, index) => (
                    <div key={index} className="flex items-center p-2 bg-green-50 rounded-md border border-green-100">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium text-green-800">{area.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Acciones principales */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 justify-center">
            <Button 
              className="bg-[#042354] hover:bg-[#0a3a7d] text-white flex-1" 
              onClick={handleBackToList}
            >
              <Users className="h-4 w-4 mr-2" />
              Ir a la lista de asesores
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-[#042354] text-[#042354]"
                    onClick={handleDownloadReport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar reporte
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exportar como CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-[#042354] text-[#042354]"
                    onClick={handleShowDetails}
                  >
                    <FileBarChart className="h-4 w-4 mr-2" />
                    Ver detalles
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Informe detallado por asesor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Sección de ayuda y próximos pasos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[#042354] flex items-center text-lg">
            <HelpCircle className="h-5 w-5 mr-2" />
            Próximos pasos recomendados
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Los asesores ya pueden acceder al sistema con las credenciales enviadas a su correo.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Puede verificar en la lista de asesores que todos tengan asignada el área temática correcta.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Los asesores con advertencias pueden requerir ajustes manuales en sus perfiles.</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button 
            variant="ghost" 
            className="text-gray-500"
            onClick={handleOpenShareDialog}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir informe
          </Button>
        </CardFooter>
      </Card>
      
      {/* Diálogo para compartir el informe */}
      <ShareReportDialog 
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        previewData={previewData}
        facultad={facultad}
        especialidad={especialidad}
      />
    </div>
  );
};

export default SuccessStep;