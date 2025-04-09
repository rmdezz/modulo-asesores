'use client'

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Info, 
  Send,
  UserX
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
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
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
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Esquema de validación para el formulario
const getFormSchema = (tieneTesistas) => {
  // Schema base con campos comunes
  const baseSchema = {
    motivo: z.string().min(1, "Por favor seleccione un motivo"),
    descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  };
  
  // Agregar campos específicos según si tiene tesistas
  if (tieneTesistas) {
    return z.object({
      ...baseSchema,
      fechaLimite: z.date({
        required_error: "Por favor seleccione una fecha límite",
      }),
      tesistasSeleccionados: z.array(z.string()).min(1, "Debe seleccionar al menos un tesista"),
      tipoSolicitud: z.literal("con_tesistas")
    });
  } else {
    return z.object({
      ...baseSchema,
      fechaEfectiva: z.date({
        required_error: "Por favor seleccione una fecha efectiva",
      }),
      tipoSolicitud: z.literal("sin_tesistas")
    });
  }
};

// Datos de ejemplo (en una aplicación real vendrían de una API)
const datosEjemplo = {
  asesor: {
    nombre: "Dr. Carlos Rodríguez Villalobos",
    especialidad: "Ingeniería Informática",
    facultad: "Ciencias e Ingeniería",
  },
  tesistas: [
    { id: "1", nombre: "Ana María López", codigo: "20180123", titulo: "Implementación de algoritmos de IA para predicción de tráfico urbano", etapa: "Desarrollo", avance: 35 },
    { id: "2", nombre: "Juan Carlos Mendoza", codigo: "20170045", titulo: "Sistema de reconocimiento facial para seguridad institucional", etapa: "Investigación", avance: 20 },
    { id: "3", nombre: "Pedro Suárez Gutiérrez", codigo: "20190087", titulo: "Plataforma de aprendizaje adaptativo basado en ML", etapa: "Planificación", avance: 15 }
  ],
  motivosDisponibles: [
    { value: "licencia", label: "Licencia académica/personal" },
    { value: "enfermedad", label: "Problemas de salud" },
    { value: "sobrecarga", label: "Sobrecarga laboral" },
    { value: "incompatibilidad", label: "Incompatibilidad con el tema de tesis" },
    { value: "viaje", label: "Viaje prolongado" },
    { value: "otro", label: "Otro motivo" }
  ]
};

export default function SolicitudCeseAsesoria() {
  // Determinar si el asesor tiene tesistas activos
  const tieneTesistas = datosEjemplo.tesistas && datosEjemplo.tesistas.length > 0;
  
  // Estado para el tipo de solicitud
  const [tipoSolicitud, setTipoSolicitud] = useState(tieneTesistas ? "con_tesistas" : "sin_tesistas");
  
  // Estados para el formulario y confirmación
  const [tesistasSeleccionados, setTesistasSeleccionados] = useState([]);
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [enviado, setEnviado] = useState(false);
  
  // Inicializar el formulario con React Hook Form
  const form = useForm({
    resolver: zodResolver(getFormSchema(tipoSolicitud === "con_tesistas")),
    defaultValues: {
      motivo: "",
      descripcion: "",
      tipoSolicitud: tipoSolicitud,
      // Campos condicionales
      ...(tipoSolicitud === "con_tesistas" 
        ? { 
            fechaLimite: undefined,
            tesistasSeleccionados: [] 
          } 
        : { 
            fechaEfectiva: undefined 
          }
      )
    },
  });
  
  // Efecto para actualizar el esquema de validación cuando cambia el tipo de solicitud
  useEffect(() => {
    form.setValue("tipoSolicitud", tipoSolicitud);
  }, [tipoSolicitud, form]);
  
  // Manejar la selección de tesistas
  const toggleTesistaSeleccionado = (id) => {
    if (tesistasSeleccionados.includes(id)) {
      setTesistasSeleccionados(tesistasSeleccionados.filter(tesista => tesista !== id));
      form.setValue("tesistasSeleccionados", 
                   tesistasSeleccionados.filter(tesista => tesista !== id));
    } else {
      setTesistasSeleccionados([...tesistasSeleccionados, id]);
      form.setValue("tesistasSeleccionados", 
                   [...tesistasSeleccionados, id]);
    }
  };
  
  // Actualizar el valor del formulario cuando cambia la selección
  useEffect(() => {
    if (tipoSolicitud === "con_tesistas") {
      form.setValue("tesistasSeleccionados", tesistasSeleccionados);
    }
  }, [tesistasSeleccionados, form, tipoSolicitud]);
  
  // Enviar el formulario
  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
    
    // Verificar si hay tesistas seleccionados (para solicitudes con tesistas)
    if (tipoSolicitud === "con_tesistas" && tesistasSeleccionados.length === 0) {
      const todosLosIds = datosEjemplo.tesistas.map(t => t.id);
      setTesistasSeleccionados(todosLosIds);
      form.setValue("tesistasSeleccionados", todosLosIds);
    }
    
    setConfirmacionAbierta(true);
  };
  
  // Confirmar y enviar la solicitud
  const confirmarEnvio = () => {
    // Aquí iría la lógica para enviar los datos al backend
    setConfirmacionAbierta(false);
    setEnviado(true);
  };
  
  // Pantalla de éxito después de enviar
  if (enviado) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="border-green-200 shadow-md">
          <CardHeader className="bg-green-50">
            <div className="flex items-center">
              <CheckCircle2 className="h-6 w-6 mr-2 text-green-600" />
              <CardTitle>Solicitud Enviada Correctamente</CardTitle>
            </div>
            <CardDescription>
              {tipoSolicitud === "con_tesistas" 
                ? "Su solicitud de cese de asesoría ha sido registrada y será revisada por el coordinador."
                : "Su solicitud de baja como asesor ha sido registrada y será revisada por el coordinador."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Detalles de la solicitud:</h3>
                <p><span className="font-medium">Número de solicitud:</span> SOL-{Math.floor(Math.random() * 10000)}</p>
                <p><span className="font-medium">Fecha de solicitud:</span> {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                <p><span className="font-medium">Estado:</span> <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Pendiente de revisión</span></p>
                <p><span className="font-medium">Tipo:</span> {tipoSolicitud === "con_tesistas" ? "Cese de asesoría con tesistas" : "Baja como asesor"}</p>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Próximos pasos</AlertTitle>
                <AlertDescription>
                  {tipoSolicitud === "con_tesistas" ? (
                    <>
                      <p className="mb-2">El coordinador de tesis revisará su solicitud y tomará una decisión en los próximos días. Recibirá una notificación cuando haya una actualización.</p>
                      <p>Mientras tanto, se le recomienda continuar con sus responsabilidades de asesoría hasta la fecha límite indicada.</p>
                    </>
                  ) : (
                    <p>El coordinador de tesis revisará su solicitud y gestionará su baja como asesor. Recibirá una notificación cuando el proceso se complete.</p>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => window.location.href = "/asesor/dashboard"}>
              Volver al Dashboard
            </Button>
            {tipoSolicitud === "con_tesistas" && (
              <Button variant="default" onClick={() => window.location.href = "/asesor/tesistas/activos"}>
                Ver mis tesistas
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-[#042354] flex items-center">
        <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" />
        {tipoSolicitud === "con_tesistas" ? "Solicitar Cese de Asesoría" : "Solicitar Baja como Asesor"}
      </h1>
      
      <div className="mb-8">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Información Importante</AlertTitle>
          <AlertDescription>
            {tipoSolicitud === "con_tesistas" ? (
              <>
                Esta solicitud permite declarar la imposibilidad de continuar con la asesoría de tesis por motivos
                justificados. Una vez enviada, será evaluada por el coordinador de tesis de su especialidad.
                Se recomienda utilizar esta opción solo en casos necesarios, ya que afecta el progreso académico
                de los tesistas.
              </>
            ) : (
              <>
                Esta solicitud permite dar de baja su rol como asesor en la facultad. Una vez aprobada, ya no podrá
                recibir nuevas asignaciones de tesistas. Si en el futuro desea volver a ser asesor, deberá solicitar
                nuevamente su alta en el sistema.
              </>
            )}
          </AlertDescription>
        </Alert>
      </div>
      
      {/* Selector de tipo de solicitud - Solo visible cuando tiene tesistas activos */}
      {tieneTesistas && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipo de Solicitud</CardTitle>
            <CardDescription>
              Seleccione el tipo de solicitud que desea realizar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              defaultValue={tipoSolicitud} 
              onValueChange={(value) => setTipoSolicitud(value)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="con_tesistas" id="con-tesistas" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="con-tesistas"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Cesar asesoría para tesistas actuales
                  </label>
                  <p className="text-sm text-gray-500">
                    Solicita dejar de asesorar a uno o más de sus tesistas actuales, pero mantiene su rol como asesor.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="sin_tesistas" id="sin-tesistas" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="sin-tesistas"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Baja completa como asesor
                  </label>
                  <p className="text-sm text-gray-500">
                    Solicita darse de baja como asesor en la facultad. Esto también cesará su relación con todos sus tesistas actuales.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}
      
      {/* Información del asesor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Asesor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">{datosEjemplo.asesor.nombre}</p>
            <p className="text-sm text-gray-600">{datosEjemplo.asesor.especialidad}</p>
            <p className="text-sm text-gray-600">{datosEjemplo.asesor.facultad}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              {tipoSolicitud === "con_tesistas" ? "Tesistas Activos" : "Estado Actual"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tipoSolicitud === "con_tesistas" || tieneTesistas ? (
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-[#042354] mr-2" />
                <div>
                  <p className="font-semibold text-2xl">{datosEjemplo.tesistas.length}</p>
                  <p className="text-sm text-gray-600">Estudiantes asesorados</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-[#042354] mr-2" />
                <div>
                  <p className="font-semibold">Sin tesistas activos</p>
                  <p className="text-sm text-gray-600">Asesor disponible</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              {tipoSolicitud === "con_tesistas" ? "Tiempo Estimado" : "Fecha Efectiva"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-[#042354] mr-2" />
              <div>
                <p className="font-semibold text-lg">7+ días</p>
                <p className="text-sm text-gray-600">
                  {tipoSolicitud === "con_tesistas" 
                    ? "Tiempo mínimo requerido" 
                    : "Tiempo para procesamiento"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Solicitud</CardTitle>
              <CardDescription>
                Complete todos los campos requeridos para enviar su solicitud.
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
                        {datosEjemplo.motivosDisponibles.map((motivo) => (
                          <SelectItem key={motivo.value} value={motivo.value}>
                            {motivo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el motivo principal por el cual {tipoSolicitud === "con_tesistas" ? "no puede continuar con la asesoría" : "desea darse de baja como asesor"}.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Fecha límite o efectiva según el tipo de solicitud */}
              {tipoSolicitud === "con_tesistas" ? (
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
              ) : (
                <FormField
                  control={form.control}
                  name="fechaEfectiva"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha efectiva de baja</FormLabel>
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
                        Indique a partir de qué fecha desea que sea efectiva su baja como asesor.
                        Debe ser al menos 7 días en el futuro.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Descripción detallada */}
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción detallada</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={`Proporcione detalles adicionales sobre el motivo de su solicitud${tipoSolicitud === "sin_tesistas" ? " de baja como asesor" : ""}...`}
                        className="resize-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explique con más detalle la situación y cualquier información relevante para el coordinador.
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
          
          {/* Sección de tesistas - solo visible en el caso de cese con tesistas */}
          {tipoSolicitud === "con_tesistas" && tieneTesistas && (
            <Card>
              <CardHeader>
                <CardTitle>Tesistas Afectados</CardTitle>
                <CardDescription>
                  Seleccione los tesistas para los cuales solicita el cese de asesoría.
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
                    {datosEjemplo.tesistas.map((tesista) => (
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
          )}
          
          {/* Caso especial: aviso de baja con tesistas activos */}
          {tipoSolicitud === "sin_tesistas" && tieneTesistas && (
            <Alert variant="warning" className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800">Aviso importante sobre sus tesistas activos</AlertTitle>
              <AlertDescription className="text-amber-700">
                <p className="mb-2">Actualmente tiene {datosEjemplo.tesistas.length} tesista(s) bajo su asesoría. Al solicitar la baja como asesor, se dará por terminada su relación académica con todos ellos.</p>
                <p>El coordinador deberá asignar nuevos asesores para todos sus tesistas actuales.</p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end space-x-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-[#042354] hover:bg-[#031a43]"
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Diálogo de confirmación */}
      <Dialog open={confirmacionAbierta} onOpenChange={setConfirmacionAbierta}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {tipoSolicitud === "con_tesistas" 
                ? "Confirmar solicitud de cese" 
                : "Confirmar solicitud de baja como asesor"}
            </DialogTitle>
            <DialogDescription>
              Por favor revise los detalles de su solicitud antes de confirmar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Motivo seleccionado:</h4>
              <p>{datosEjemplo.motivosDisponibles.find(m => m.value === form.getValues().motivo)?.label || "No especificado"}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {tipoSolicitud === "con_tesistas" 
                  ? "Fecha límite de disponibilidad:" 
                  : "Fecha efectiva de baja:"}
              </h4>
              <p>
                {tipoSolicitud === "con_tesistas"
                  ? (form.getValues().fechaLimite ? format(form.getValues().fechaLimite, "PPP", { locale: es }) : "No especificada")
                  : (form.getValues().fechaEfectiva ? format(form.getValues().fechaEfectiva, "PPP", { locale: es }) : "No especificada")}
              </p>
            </div>
            
            {tipoSolicitud === "con_tesistas" && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Tesistas afectados:</h4>
                <p>{tesistasSeleccionados.length} tesista(s) seleccionado(s)</p>
              </div>
            )}
            
            <Alert variant="warning" className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800">Acción importante</AlertTitle>
              <AlertDescription className="text-amber-700">
                {tipoSolicitud === "con_tesistas" ? (
                  "Esta solicitud será enviada al coordinador de tesis y afectará a los tesistas seleccionados. Por favor, asegúrese de que la información proporcionada es correcta."
                ) : (
                  tieneTesistas 
                    ? "Esta solicitud dará por terminada su función como asesor y afectará a todos sus tesistas actuales. El coordinador deberá reasignar nuevos asesores para ellos."
                    : "Esta solicitud dará por terminada su función como asesor en la facultad. Si en el futuro desea volver a ser asesor, deberá solicitar nuevamente su alta en el sistema."
                )}
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmacionAbierta(false)}
            >
              Regresar y editar
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-[#042354] hover:bg-[#031a43]"
              onClick={confirmarEnvio}
            >
              Confirmar y enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}