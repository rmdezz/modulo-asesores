import React, { useState } from 'react';
import { 
  Share2, Mail, Copy, FileText, Users, X, 
  ExternalLink, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

// Componente para compartir el informe
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

// Ejemplo de uso en el componente SuccessStep
const ShareReportExample = ({ previewData, facultad, especialidad }) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  return (
    <>
      <Button 
        variant="ghost" 
        className="text-gray-500"
        onClick={() => setShowShareDialog(true)}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartir informe
      </Button>
      
      <ShareReportDialog 
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        previewData={previewData}
        facultad={facultad}
        especialidad={especialidad}
      />
    </>
  );
};

export { ShareReportDialog, ShareReportExample };