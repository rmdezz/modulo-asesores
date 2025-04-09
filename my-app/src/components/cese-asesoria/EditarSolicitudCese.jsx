// components/cese-asesoria/EditarSolicitudCese.jsx
'use client'

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Info, 
  Pencil,
  Save,
  X,
  Ban,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Esquema de validación para el formulario
const formSchema = z.object({
  motivo: z.string().min(1, "Por favor seleccione un motivo"),
  fechaLimite: z.date({
    required_error: "Por favor seleccione una fecha límite",
  }),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  tesistasSeleccionados: z.array(z.string()).min(1, "Debe seleccionar al menos un tesista"),
});

// Lista de motivos disponibles
const motivosDisponibles = [
  { value: "licencia", label: "Licencia académica/personal" },
  { value: "enfermedad", label: "Problemas de salud" },
  { value: "sobrecarga", label: "Sobrecarga laboral" },
  { value: "incompatibilidad", label: "Incompatibilidad con el tema de tesis" },
  { value: "viaje", label: "Viaje prolongado" },
  { value: "otro", label: "Otro motivo" }
];

// Componente para mostrar el estado de la solicitud con un badge
const EstadoSolicitud = ({ estado }) => {
  const estadoConfig = {
    pendiente: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      texto: "Pendiente de revisión",
      icono: <Clock className="h-3 w-3 mr-1" />
    },
    aprobado: {
      color: "bg-green-100 text-green-800 border-green-200",
      texto: "Aprobada",
      icono: <CheckCircle2 className="h-3 w-3 mr-1" />
    },
    rechazado: {
      color: "bg-red-100 text-red-800 border-red-200",
      texto: "Rechazada",
      icono: <X className="h-3 w-3 mr-1" />
    },
    pendiente_informacion: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      texto: "Información adicional requerida",
      icono: <Info className="h-3 w-3 mr-1" />
    }
  };

  const config = estadoConfig[estado] || estadoConfig.pendiente;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center`}>
      {config.icono}
      {config.texto}
    </Badge>
  );
};

export default function EditarSolicitudCese({ 
  solicitud, 
  onGuardarCambios, 
  onCancelarSolicitud, 
  onVolverAlHistorial 
}) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tesistasSeleccionados, setTesistasSeleccionados] = useState(
    solicitud.tesistas.filter(t => t.seleccionado).map(t => t.id)
  );
  const [dialogoConfirmacionAbierto, setDialogoConfirmacionAbierto] = useState(false);
  const [dialogoCancelarAbierto, setDialogoCancelarAbierto] = useState(false);
  const [activeTab, setActiveTab] = useState("detalles");
  const [guardando, setGuardando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  
  // Inicializar el formulario con React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motivo: solicitud.motivo,
      fechaLimite: new Date(solicitud.fechaLimite),
      descripcion: solicitud.descripcion,
      tesistasSeleccionados: tesistasSeleccionados,
    },
  });
  
  // Manejar la selección de tesistas
  const toggleTesistaSeleccionado = (id) => {
    if (tesistasSeleccionados.includes(id)) {
      setTesistasSeleccionados(tesistasSeleccionados.filter(tesista => tesista !== id));
    } else {
      setTesistasSeleccionados([...tesistasSeleccionados, id]);
    }
  };
  
  // Actualizar el valor del formulario cuando cambia la selección
  useEffect(() => {
    form.setValue("tesistasSeleccionados", tesistasSeleccionados);
  }, [tesistasSeleccionados, form]);
  
  // Guardar cambios
  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
    setDialogoConfirmacionAbierto(true);
  };
  
  // Confirmar y enviar los cambios
  const confirmarCambios = async () => {
    setGuardando(true);
    
    // Crear un objeto con los cambios desde el formulario
    const datosActualizados = {
      motivo: form.getValues().motivo,
      motivoTexto: motivosDisponibles.find(m => m.value === form.getValues().motivo)?.label || "",
      fechaLimite: form.getValues().fechaLimite.toISOString(),
      descripcion: form.getValues().descripcion,
      tesistas: solicitud.tesistas.map(tesista => ({
        ...tesista,
        seleccionado: tesistasSeleccionados.includes(tesista.id)
      }))
    };
    
    try {
      // Llamar a la función proporcionada por el componente padre
      const resultado = await onGuardarCambios(datosActualizados);
      
      if (resultado.success) {
        setDialogoConfirmacionAbierto(false);
        setModoEdicion(false);
        // Mostrar mensaje de éxito (podría ser un toast en una implementación real)
        alert("Cambios guardados correctamente");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Ocurrió un error al guardar los cambios. Por favor, intente nuevamente.");
    } finally {
      setGuardando(false);
    }
  };
  
  // Iniciar proceso de cancelación
  const iniciarCancelacion = () => {
    setDialogoCancelarAbierto(true);
  };
  
  // Confirmar cancelación de solicitud
  const confirmarCancelacion = async () => {
    setCancelando(true);
    
    try {
      // Llamar a la función proporcionada por el componente padre
      const resultado = await onCancelarSolicitud();
      
      if (resultado.success) {
        setDialogoCancelarAbierto(false);
        // La redirección la maneja el componente padre
      }
    } catch (error) {
      console.error("Error al cancelar solicitud:", error);
      alert("Ocurrió un error al cancelar la solicitud. Por favor, intente nuevamente.");
      setCancelando(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={onVolverAlHistorial}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#042354] flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" />
            Solicitud de Cese {solicitud.id}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {solicitud.estado === "pendiente" && !modoEdicion && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setModoEdicion(true)}
            >
              <Pencil className="h-4 w-4" />
              Editar Solicitud
            </Button>
          )}
          
          {solicitud.estado === "pendiente" && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={iniciarCancelacion}
            >
              <Ban className="h-4 w-4" />
              Cancelar Solicitud
            </Button>
          )}
        </div>
      </div>
      
      <Alert className={`mb-6 ${
        solicitud.estado === "pendiente" 
          ? "bg-yellow-50 border-yellow-200" 
          : solicitud.estado === "pendiente_informacion"
          ? "bg-blue-50 border-blue-200"
          : "bg-gray-50 border-gray-200"
      }`}>
        <Info className="h-4 w-4" />
        <AlertTitle className="flex items-center">
          Estado: <EstadoSolicitud estado={solicitud.estado} className="ml-2" />
        </AlertTitle>
        <AlertDescription>
          {solicitud.estado === "pendiente" 
            ? "Su solicitud está siendo revisada por el coordinador. Recibirá una notificación cuando haya una actualización." 
            : solicitud.estado === "pendiente_informacion"
            ? "El coordinador ha solicitado información adicional para procesar su solicitud."
            : "Esta solicitud ya ha sido procesada y no puede ser modificada."}
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="detalles" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="detalles" className="h-full">
            <div className="flex items-center justify-center h-full">
              <Info className="mr-2 h-4 w-4" />
              Detalles de la Solicitud
            </div>
          </TabsTrigger>
          <TabsTrigger value="historial" className="h-full">
            <div className="flex items-center justify-center h-full">
              <Clock className="mr-2 h-4 w-4" />
              Historial y Comentarios
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab: Detalles de la Solicitud */}
        <TabsContent value="detalles">
          {modoEdicion ? (
            // Formulario de edición
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Solicitud</CardTitle>
                    <CardDescription>
                      Modifique los detalles de su solicitud de cese de asesoría.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Motivo de la solicitud */}
                    <FormField
                      control={form.control}
                      name="motivo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivo de la solicitud</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un motivo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {motivosDisponibles.map((motivo) => (
                                <SelectItem key={motivo.value} value={motivo.value}>
                                  {motivo.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Fecha límite de disponibilidad */}
                    <FormField
                      control={form.control}
                      name="fechaLimite"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha límite de disponibilidad</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Seleccione una fecha</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  
                                  // Deshabilitar fechas anteriores a 7 días desde hoy
                                  const minDate = new Date(today);
                                  minDate.setDate(minDate.getDate() + 7);
                                  
                                  return date < minDate;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Indique hasta qué fecha podrá continuar atendiendo a los tesistas antes del cese definitivo.
                            Debe ser al menos 7 días en el futuro.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Descripción detallada */}
                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción detallada</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Proporcione detalles adicionales sobre el motivo de su solicitud..." 
                              className="resize-none h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <span className="text-xs block mt-1">
                              {field.value?.length || 0}/500 caracteres
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tesistas Afectados</CardTitle>
                    <CardDescription>
                      Actualice la selección de tesistas para los cuales solicita el cese de asesoría.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableCaption>
                        Listado de tesistas actualmente bajo su asesoría
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Seleccionar</TableHead>
                          <TableHead>Tesista</TableHead>
                          <TableHead>Código</TableHead>
                          <TableHead>Título de Tesis</TableHead>
                          <TableHead>Etapa</TableHead>
                          <TableHead>Avance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {solicitud.tesistas.map((tesista) => (
                          <TableRow 
                            key={tesista.id}
                            className={tesistasSeleccionados.includes(tesista.id) ? "bg-blue-50" : ""}
                          >
                            <TableCell>
                              <input 
                                type="checkbox" 
                                className="h-4 w-4 rounded border-gray-300 text-[#042354] focus:ring-[#042354]"
                                checked={tesistasSeleccionados.includes(tesista.id)}
                                onChange={() => toggleTesistaSeleccionado(tesista.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{tesista.nombre}</TableCell>
                            <TableCell>{tesista.codigo}</TableCell>
                            <TableCell>{tesista.titulo}</TableCell>
                            <TableCell>{tesista.etapa}</TableCell>
                            <TableCell>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${tesista.avance}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{tesista.avance}%</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {form.formState.errors.tesistasSeleccionados && (
                      <p className="text-sm text-red-500 mt-2">
                        {form.formState.errors.tesistasSeleccionados.message}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex justify-end space-x-4 mt-8">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setModoEdicion(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar Edición
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#042354] hover:bg-[#031a43]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            // Vista de solo lectura
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Solicitud</CardTitle>
                  <CardDescription>
                    Detalles de su solicitud de cese de asesoría
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de solicitud</h3>
                      <p>{format(new Date(solicitud.fechaSolicitud), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha límite de disponibilidad</h3>
                      <p>{format(new Date(solicitud.fechaLimite), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Motivo</h3>
                    <p>{motivosDisponibles.find(m => m.value === solicitud.motivo)?.label}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Descripción detallada</h3>
                    <p className="bg-gray-50 p-3 rounded-md border">{solicitud.descripcion}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Tesistas Afectados</CardTitle>
                  <CardDescription>
                    Estudiantes incluidos en la solicitud de cese
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>
                      Tesistas para los que se solicita el cese de asesoría
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tesista</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Título de Tesis</TableHead>
                        <TableHead>Etapa</TableHead>
                        <TableHead>Avance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitud.tesistas
                        .filter(t => t.seleccionado)
                        .map((tesista) => (
                          <TableRow key={tesista.id}>
                            <TableCell className="font-medium">{tesista.nombre}</TableCell>
                            <TableCell>{tesista.codigo}</TableCell>
                            <TableCell>{tesista.titulo}</TableCell>
                            <TableCell>{tesista.etapa}</TableCell>
                            <TableCell>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${tesista.avance}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{tesista.avance}%</span>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        {/* Tab: Historial y Comentarios */}
        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de la Solicitud</CardTitle>
              <CardDescription>
                Seguimiento cronológico de eventos y comunicaciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitud.comentarios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay comentarios o actualizaciones disponibles para esta solicitud.</p>
                  <p className="text-sm">Las actualizaciones aparecerán aquí cuando el coordinador revise su solicitud.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {solicitud.comentarios.map((comentario, index) => (
                    <div 
                      key={index}
                      className="p-4 border rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{comentario.autor}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comentario.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                        </span>
                      </div>
                      <p className="mt-2">{comentario.texto}</p>
                    </div>
                  ))}
                  
                  {/* Timeline de eventos */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-4">Línea de tiempo</h3>
                    <ol className="relative border-l border-gray-200 dark:border-gray-700">
                      <li className="mb-10 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                          <Clock className="w-3 h-3 text-blue-800" />
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Solicitud enviada</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                          {format(new Date(solicitud.fechaSolicitud), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                        </time>
                        <p className="mb-4 text-base font-normal text-gray-500">
                          Su solicitud fue recibida y está pendiente de revisión por el coordinador.
                        </p>
                      </li>
                      
                      {/* Mostrar modificaciones si existen */}
                      {solicitud.modificaciones && solicitud.modificaciones.filter(m => m.tipo === "edicion").map((mod, index) => (
                        <li key={index} className="mb-10 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                            <Pencil className="w-3 h-3 text-green-800" />
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                            Solicitud modificada
                          </h3>
                          <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                            {format(new Date(mod.fecha), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                          </time>
                          <p className="mb-4 text-base font-normal text-gray-500">
                            {mod.detalles}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {solicitud.estado === "pendiente_informacion" && (
            <Card className="mt-6 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Información Adicional Requerida</CardTitle>
                <CardDescription>
                  El coordinador ha solicitado que proporcione información adicional.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea 
                  placeholder="Escriba la información solicitada por el coordinador..." 
                  className="resize-none h-32 mb-4"
                />
                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Enviar Información
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de confirmación de cambios */}
      <Dialog open={dialogoConfirmacionAbierto} onOpenChange={setDialogoConfirmacionAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Cambios</DialogTitle>
            <DialogDescription>
              Está a punto de guardar los cambios realizados en su solicitud.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Información Importante</AlertTitle>
              <AlertDescription>
                Al modificar su solicitud, esta volverá a ser revisada por el coordinador.
                El tiempo de procesamiento puede verse afectado.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogoConfirmacionAbierto(false)}
              disabled={guardando}
            >
              Volver y Editar
            </Button>
            <Button 
              onClick={confirmarCambios}
              className="bg-[#042354] hover:bg-[#031a43]"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Confirmar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación de cancelación */}
      <Dialog open={dialogoCancelarAbierto} onOpenChange={setDialogoCancelarAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Solicitud</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea cancelar esta solicitud de cese de asesoría?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800">Acción irreversible</AlertTitle>
              <AlertDescription className="text-amber-700">
                Esta acción no se puede deshacer. La solicitud será cancelada y se notificará al coordinador.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogoCancelarAbierto(false)}
              disabled={cancelando}
            >
              Volver
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmarCancelacion}
              disabled={cancelando}
            >
              {cancelando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Cancelación"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}