'use client'

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  ClipboardList, 
  Download, 
  Eye, 
  Filter, 
  GraduationCap, 
  History,
  Info, 
  Mail, 
  MessageSquare, 
  MoreHorizontal, 
  Search, 
  SlidersHorizontal, 
  ThumbsDown, 
  ThumbsUp, 
  Timer, 
  Trash, 
  User,
  UserX,
  X,
  XCircle,
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Datos de ejemplo (en una aplicación real vendrían de una API)
const datosSolicitudes = [
  {
    id: "SOL-7842",
    asesor: {
      id: "A001",
      nombre: "Dr. Carlos Rodríguez Villalobos",
      correo: "c.rodriguez@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/carlos-rodriguez.jpg"
    },
    motivo: "sobrecarga",
    motivoTexto: "Sobrecarga laboral",
    fechaSolicitud: "2025-04-06T10:30:00",
    fechaLimite: "2025-04-20T23:59:59",
    descripcion: "Debido a compromisos con proyectos de investigación institucionales y la asignación de nuevos cursos para el próximo semestre, me veo imposibilitado de continuar con las asesorías de tesis actuales después de la fecha indicada.",
    estado: "pendiente",
    tesistas: [
      { id: "T001", nombre: "Ana María López", codigo: "20180123", titulo: "Implementación de algoritmos de IA para predicción de tráfico urbano", avance: 35 },
      { id: "T002", nombre: "Juan Carlos Mendoza", codigo: "20170045", titulo: "Sistema de reconocimiento facial para seguridad institucional", avance: 20 }
    ],
    comentarios: []
  },
  {
    id: "SOL-6538",
    asesor: {
      id: "A002",
      nombre: "Dra. Mariana González Fuentes",
      correo: "mgonzalez@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/mariana-gonzalez.jpg"
    },
    motivo: "licencia",
    motivoTexto: "Licencia académica/personal",
    fechaSolicitud: "2025-04-05T14:15:00",
    fechaLimite: "2025-05-15T23:59:59",
    descripcion: "He sido aceptada para realizar una estancia de investigación en la Universidad de Stanford por un período de 6 meses a partir del 16 de mayo. Durante este tiempo no podré continuar con mis labores de asesoría.",
    estado: "pendiente",
    tesistas: [
      { id: "T003", nombre: "Roberto Sánchez", codigo: "20190056", titulo: "Análisis de sentimientos en redes sociales para estrategias de marketing", avance: 45 },
      { id: "T004", nombre: "Patricia Molina", codigo: "20180089", titulo: "Sistema de monitoreo de calidad del aire basado en IoT", avance: 60 },
      { id: "T005", nombre: "Diego Castillo", codigo: "20170112", titulo: "Plataforma para gestión de historias clínicas digitales", avance: 30 }
    ],
    comentarios: []
  },
  {
    id: "SOL-5421",
    asesor: {
      id: "A003",
      nombre: "Dr. Jorge Ruiz Alvarado",
      correo: "j.ruiz@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Electrónica",
      avatar: "/avatars/jorge-ruiz.jpg"
    },
    motivo: "enfermedad",
    motivoTexto: "Problemas de salud",
    fechaSolicitud: "2025-04-03T09:45:00",
    fechaLimite: "2025-04-17T23:59:59",
    descripcion: "Por recomendación médica debo someterme a una intervención quirúrgica y posterior recuperación que me mantendrá alejado de mis actividades académicas por un período aproximado de 2 meses.",
    estado: "aprobado",
    tesistas: [
      { id: "T006", nombre: "Fernando Torres", codigo: "20180035", titulo: "Diseño de sistemas embebidos para monitoreo de estructuras", avance: 50 }
    ],
    comentarios: [
      { 
        id: "C001", 
        autor: "Coordinador", 
        fecha: "2025-04-04T11:20:00", 
        texto: "Solicitud aprobada. Se ha contactado al Dr. Miguel Silva para hacerse cargo de la asesoría durante su recuperación. Por favor, coordine la transición con él.",
        estado: "aprobacion"
      }
    ],
    fechaAprobacion: "2025-04-04T11:20:00",
    nuevoAsesor: {
      id: "A007",
      nombre: "Dr. Miguel Silva Paredes",
      correo: "m.silva@pucp.edu.pe"
    }
  },
  {
    id: "SOL-4287",
    asesor: {
      id: "A004",
      nombre: "Dra. Carmen Linares Díaz",
      correo: "clinares@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Industrial",
      avatar: "/avatars/carmen-linares.jpg"
    },
    motivo: "viaje",
    motivoTexto: "Viaje prolongado",
    fechaSolicitud: "2025-04-02T16:30:00",
    fechaLimite: "2025-04-15T23:59:59",
    descripcion: "He sido invitada a participar como ponente en una serie de conferencias internacionales que me mantendrán fuera del país durante 3 meses, desde mediados de abril hasta mediados de julio.",
    estado: "rechazado",
    tesistas: [
      { id: "T007", nombre: "Luisa Paredes", codigo: "20190078", titulo: "Optimización de cadenas de suministro con Machine Learning", avance: 55 },
      { id: "T008", nombre: "Ricardo Vargas", codigo: "20180092", titulo: "Aplicación de métodos Lean Six Sigma en servicios hospitalarios", avance: 40 }
    ],
    comentarios: [
      { 
        id: "C002", 
        autor: "Coordinador", 
        fecha: "2025-04-03T10:15:00", 
        texto: "Solicitud rechazada. Las conferencias pueden ser atendidas virtualmente sin necesidad de interrumpir la asesoría. Por favor, coordine con sus tesistas para establecer sesiones de asesoría virtual durante su ausencia física.",
        estado: "rechazo" 
      }
    ],
    fechaRechazo: "2025-04-03T10:15:00"
  },
  {
    id: "SOL-3125",
    asesor: {
      id: "A005",
      nombre: "Dr. Eduardo Méndez Castro",
      correo: "e.mendez@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Mecánica",
      avatar: "/avatars/eduardo-mendez.jpg"
    },
    motivo: "incompatibilidad",
    motivoTexto: "Incompatibilidad con el tema de tesis",
    fechaSolicitud: "2025-03-28T11:20:00",
    fechaLimite: "2025-04-12T23:59:59",
    descripcion: "Tras varias sesiones de asesoría, he detectado que el enfoque que está tomando el tesista requiere conocimientos especializados en análisis de elementos finitos no lineales que están fuera de mi área de expertise. Considero que otro asesor podría guiarlo mejor.",
    estado: "aprobado",
    tesistas: [
      { id: "T009", nombre: "Gabriel Pacheco", codigo: "20180067", titulo: "Análisis del comportamiento de materiales compuestos bajo cargas dinámicas", avance: 25 }
    ],
    comentarios: [
      { 
        id: "C003", 
        autor: "Coordinador", 
        fecha: "2025-03-30T14:40:00", 
        texto: "Solicitud aprobada. Se asignará a la Dra. Rosa Gutiérrez como nueva asesora por su especialización en el área requerida. Favor de coordinar la transición y compartir los avances realizados hasta la fecha.",
        estado: "aprobacion" 
      }
    ],
    fechaAprobacion: "2025-03-30T14:40:00",
    nuevoAsesor: {
      id: "A008",
      nombre: "Dra. Rosa Gutiérrez León",
      correo: "r.gutierrez@pucp.edu.pe"
    }
  },
  {
    id: "SOL-2946",
    asesor: {
      id: "A006",
      nombre: "Dr. Alberto Morales Guzmán",
      correo: "a.morales@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Civil",
      avatar: "/avatars/alberto-morales.jpg"
    },
    motivo: "otro",
    motivoTexto: "Otro motivo",
    fechaSolicitud: "2025-03-25T08:50:00",
    fechaLimite: "2025-04-08T23:59:59",
    descripcion: "He sido nombrado Decano de la Facultad de Ingeniería Civil en otra universidad, lo que implica un cambio de institución y nuevas responsabilidades administrativas que no me permitirán continuar con las asesorías de tesis en la PUCP.",
    estado: "pendiente_informacion",
    tesistas: [
      { id: "T010", nombre: "Valeria Castro", codigo: "20190023", titulo: "Evaluación sísmica de estructuras históricas en el centro de Lima", avance: 70 },
      { id: "T011", nombre: "Martín Suárez", codigo: "20180056", titulo: "Diseño de sistemas de drenaje urbano sostenible", avance: 55 }
    ],
    comentarios: [
      { 
        id: "C004", 
        autor: "Coordinador", 
        fecha: "2025-03-26T13:10:00", 
        texto: "Por favor, proporcione la documentación oficial de su nombramiento y una propuesta de transición para sus tesistas, especialmente para el caso de Valeria Castro que tiene un avance significativo.",
        estado: "informacion" 
      }
    ]
  },
  // PENDIENTES
  {
    id: "SOL-8934",
    asesor: {
      id: "A101",
      nombre: "Dr. Alejandro Torres Vargas",
      correo: "a.torres@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/alejandro-torres.jpg"
    },
    motivo: "enfermedad",
    motivoTexto: "Problemas de salud",
    fechaSolicitud: "2025-04-07T09:15:00",
    fechaLimite: "2025-04-10T23:59:59", // Muy urgente (3 días)
    descripcion: "Por recomendación médica debo iniciar un tratamiento que me mantendrá con licencia por 3 meses. Mi médico ha recomendado reposo absoluto durante este periodo, lo que me imposibilita continuar con mis labores académicas.",
    estado: "pendiente",
    tesistas: [
      { id: "T101", nombre: "Laura Méndez", codigo: "20200134", titulo: "Desarrollo de aplicaciones blockchain para sistemas de votación electrónica", avance: 40 }
    ],
    comentarios: []
  },
  {
    id: "SOL-8731",
    asesor: {
      id: "A102",
      nombre: "Dra. Valentina Soto Ramírez",
      correo: "v.soto@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/valentina-soto.jpg"
    },
    motivo: "viaje",
    motivoTexto: "Viaje prolongado",
    fechaSolicitud: "2025-04-05T11:30:00",
    fechaLimite: "2025-04-12T23:59:59", // Urgente (7 días)
    descripcion: "He recibido una invitación para participar como profesora visitante en la Universidad de Tokio por un periodo de 8 meses a partir del 15 de abril. Este es un proyecto importante para mi carrera académica y requiere mi presencia física en Japón.",
    estado: "pendiente",
    tesistas: [
      { id: "T102", nombre: "Miguel Herrera", codigo: "20190078", titulo: "Optimización de arquitecturas de microservicios para aplicaciones de alto rendimiento", avance: 55 },
      { id: "T103", nombre: "Carolina Vega", codigo: "20200045", titulo: "Implementación de sistemas de recomendación basados en aprendizaje profundo", avance: 25 },
      { id: "T104", nombre: "Rodrigo Palacios", codigo: "20190112", titulo: "Seguridad en aplicaciones IoT para entornos hospitalarios", avance: 30 }
    ],
    comentarios: []
  },
  {
    id: "SOL-8562",
    asesor: {
      id: "A103",
      nombre: "Dr. Francisco Paredes Luna",
      correo: "f.paredes@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/francisco-paredes.jpg"
    },
    motivo: "sobrecarga",
    motivoTexto: "Sobrecarga laboral",
    fechaSolicitud: "2025-04-02T15:45:00",
    fechaLimite: "2025-04-22T23:59:59", // No urgente (> 7 días)
    descripcion: "Debido a mi reciente nombramiento como Director de Investigación en la Facultad, debo dedicar un tiempo significativo a la gestión administrativa que anteriormente no tenía asignado. Esto ha reducido mi disponibilidad para las asesorías de tesis de manera considerable.",
    estado: "pendiente",
    tesistas: [
      { id: "T105", nombre: "Daniela Quiroz", codigo: "20180134", titulo: "Técnicas avanzadas de procesamiento de lenguaje natural para análisis de documentos académicos", avance: 60 },
      { id: "T106", nombre: "Jorge Salazar", codigo: "20190023", titulo: "Desarrollo de frameworks para pruebas automatizadas en aplicaciones distribuidas", avance: 45 }
    ],
    comentarios: []
  },
  
  // APROBADOS
  {
    id: "SOL-7123",
    asesor: {
      id: "A104",
      nombre: "Dr. Martín Aguilar Mendoza",
      correo: "m.aguilar@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/martin-aguilar.jpg"
    },
    motivo: "licencia",
    motivoTexto: "Licencia académica/personal",
    fechaSolicitud: "2025-03-25T10:20:00",
    fechaLimite: "2025-04-08T23:59:59", // Fecha ya pasada
    descripcion: "He sido beneficiado con una beca Fulbright para realizar una estancia de investigación en MIT por un período de 12 meses. Esta oportunidad es fundamental para el desarrollo de mi línea de investigación en computación cuántica.",
    estado: "aprobado",
    tesistas: [
      { id: "T107", nombre: "Sebastián Ortiz", codigo: "20180067", titulo: "Algoritmos cuánticos para optimización de rutas logísticas", avance: 70 },
      { id: "T108", nombre: "Valeria Miranda", codigo: "20190056", titulo: "Modelos de seguridad para comunicaciones cuánticas", avance: 55 }
    ],
    comentarios: [
      { 
        id: "C101", 
        autor: "Coordinador", 
        fecha: "2025-03-27T14:30:00", 
        texto: "Solicitud aprobada. Felicitaciones por su beca Fulbright. Se ha designado al Dr. Javier Montes como nuevo asesor para sus tesistas. Por favor, coordine una reunión con él para realizar la transición.",
        estado: "aprobacion"
      }
    ],
    fechaAprobacion: "2025-03-27T14:30:00",
    nuevoAsesor: {
      id: "A201",
      nombre: "Dr. Javier Montes Solano",
      correo: "j.montes@pucp.edu.pe"
    }
  },
  {
    id: "SOL-6895",
    asesor: {
      id: "A105",
      nombre: "Dra. Lucía Fuentes Castro",
      correo: "l.fuentes@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/lucia-fuentes.jpg"
    },
    motivo: "incompatibilidad",
    motivoTexto: "Incompatibilidad con el tema de tesis",
    fechaSolicitud: "2025-03-20T08:45:00",
    fechaLimite: "2025-04-03T23:59:59", // Fecha ya pasada
    descripcion: "Los proyectos de tesis que estoy asesorando han tomado un giro hacia el análisis avanzado de datos biomédicos, un área en la que no tengo la experiencia necesaria para brindar una asesoría adecuada. Considero que mis tesistas se beneficiarían más de un asesor especializado en este campo.",
    estado: "aprobado",
    tesistas: [
      { id: "T109", nombre: "Felipe Zúñiga", codigo: "20200012", titulo: "Análisis de imágenes médicas mediante redes neuronales convolucionales", avance: 35 },
      { id: "T110", nombre: "Camila Rojas", codigo: "20190089", titulo: "Predicción de diagnósticos médicos utilizando aprendizaje profundo", avance: 40 }
    ],
    comentarios: [
      { 
        id: "C102", 
        autor: "Coordinador", 
        fecha: "2025-03-22T11:15:00", 
        texto: "Solicitud aprobada. Agradecemos su honestidad profesional. Se ha asignado a la Dra. Ana Belén Cortés, especialista en IA aplicada a la medicina, como nueva asesora.",
        estado: "aprobacion"
      }
    ],
    fechaAprobacion: "2025-03-22T11:15:00",
    nuevoAsesor: {
      id: "A202",
      nombre: "Dra. Ana Belén Cortés Herrera",
      correo: "ab.cortes@pucp.edu.pe"
    }
  },
  
  // RECHAZADOS
  {
    id: "SOL-5978",
    asesor: {
      id: "A106",
      nombre: "Dr. Ricardo Núñez Pardo",
      correo: "r.nunez@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/ricardo-nunez.jpg"
    },
    motivo: "sobrecarga",
    motivoTexto: "Sobrecarga laboral",
    fechaSolicitud: "2025-03-18T14:20:00",
    fechaLimite: "2025-04-01T23:59:59", // Fecha ya pasada
    descripcion: "Debido a la carga de dictado de cursos para el semestre 2025-1 (3 cursos con alto número de estudiantes), considero que no podré dedicar el tiempo necesario para la adecuada asesoría de tesis.",
    estado: "rechazado",
    tesistas: [
      { id: "T111", nombre: "Rubén Castro", codigo: "20180045", titulo: "Sistemas de detección de intrusiones basados en aprendizaje por refuerzo", avance: 25 }
    ],
    comentarios: [
      { 
        id: "C103", 
        autor: "Coordinador", 
        fecha: "2025-03-20T09:30:00", 
        texto: "Solicitud rechazada. Todos los docentes a tiempo completo deben mantener un mínimo de 2 asesorías de tesis. La carga académica ya fue ajustada considerando sus responsabilidades de asesoría. Por favor, coordine con su tesista para mantener al menos una sesión quincenal.",
        estado: "rechazo"
      }
    ],
    fechaRechazo: "2025-03-20T09:30:00"
  },
  {
    id: "SOL-5640",
    asesor: {
      id: "A107",
      nombre: "Dra. Carmen Valencia Mejía",
      correo: "c.valencia@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/carmen-valencia.jpg"
    },
    motivo: "viaje",
    motivoTexto: "Viaje prolongado",
    fechaSolicitud: "2025-03-15T10:10:00",
    fechaLimite: "2025-03-29T23:59:59", // Fecha ya pasada
    descripcion: "He recibido una invitación para dictar un curso de verano en la Universidad de California, Berkeley, durante los meses de mayo a julio. Esta es una oportunidad importante para mi desarrollo profesional.",
    estado: "rechazado",
    tesistas: [
      { id: "T112", nombre: "Pablo Alarcón", codigo: "20190134", titulo: "Métodos de aprendizaje federado para aplicaciones de salud", avance: 50 },
      { id: "T113", nombre: "Mónica Salas", codigo: "20200023", titulo: "Análisis de vulnerabilidades en sistemas de autenticación biométrica", avance: 40 }
    ],
    comentarios: [
      { 
        id: "C104", 
        autor: "Coordinador", 
        fecha: "2025-03-17T13:45:00", 
        texto: "Solicitud rechazada. El dictado del curso en Berkeley puede realizarse de manera remota según acuerdo previo con dicha universidad. Adicionalmente, las sesiones de asesoría pueden programarse virtualmente en horarios compatibles. Por favor, presente un plan de asesoría virtual para sus tesistas.",
        estado: "rechazo"
      }
    ],
    fechaRechazo: "2025-03-17T13:45:00"
  },
  
  // PENDIENTE_INFORMACION
  {
    id: "SOL-7456",
    asesor: {
      id: "A108",
      nombre: "Dr. Gabriel Moreno Ferreyra",
      correo: "g.moreno@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/gabriel-moreno.jpg"
    },
    motivo: "enfermedad",
    motivoTexto: "Problemas de salud",
    fechaSolicitud: "2025-04-01T16:40:00",
    fechaLimite: "2025-04-15T23:59:59", // Urgente (pocos días)
    descripcion: "Por motivos de salud personal debo someterme a una intervención quirúrgica que requiere un periodo de recuperación de aproximadamente 2 meses.",
    estado: "pendiente_informacion",
    tesistas: [
      { id: "T114", nombre: "Ignacio Torres", codigo: "20180112", titulo: "Sistemas de recomendación contextual para comercio electrónico", avance: 55 },
      { id: "T115", nombre: "Diana Velasco", codigo: "20190067", titulo: "Implementación de chatbots con procesamiento de lenguaje natural avanzado", avance: 40 }
    ],
    comentarios: [
      { 
        id: "C105", 
        autor: "Coordinador", 
        fecha: "2025-04-03T11:25:00", 
        texto: "Por favor, adjunte el certificado médico correspondiente y proponga fechas estimadas para su ausencia. También necesitamos saber si considera posible mantener algunas sesiones virtuales durante su recuperación.",
        estado: "informacion"
      }
    ]
  },
  {
    id: "SOL-7289",
    asesor: {
      id: "A109",
      nombre: "Dr. Ignacio Vega Saavedra",
      correo: "i.vega@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/ignacio-vega.jpg"
    },
    motivo: "otro",
    motivoTexto: "Otro motivo",
    fechaSolicitud: "2025-03-28T09:05:00",
    fechaLimite: "2025-04-11T23:59:59", // Próximo a vencer
    descripcion: "He aceptado una oferta laboral en Google como Research Scientist, lo que implica mi renuncia a la universidad a partir del 1 de mayo de 2025. No podré continuar con mis responsabilidades como asesor de tesis.",
    estado: "pendiente_informacion",
    tesistas: [
      { id: "T116", nombre: "Mariana Costa", codigo: "20200134", titulo: "Detección de fake news mediante técnicas de procesamiento de lenguaje natural", avance: 30 },
      { id: "T117", nombre: "Andrés Segura", codigo: "20190056", titulo: "Algoritmos de visión computacional para conducción autónoma", avance: 45 },
      { id: "T118", nombre: "Natalia Vega", codigo: "20180089", titulo: "Sistemas de gestión de conocimiento basados en grafos", avance: 65 }
    ],
    comentarios: [
      { 
        id: "C106", 
        autor: "Coordinador", 
        fecha: "2025-03-30T10:15:00", 
        texto: "Felicitaciones por su nuevo cargo. Por favor, envíe su carta de renuncia oficial y un informe detallado del estado actual de cada tesista. Adicionalmente, sugerimos una lista de posibles asesores que podrían continuar con la asesoría de sus tesistas según las temáticas particulares.",
        estado: "informacion"
      }
    ]
  },
  {
    id: "SOL-6793",
    asesor: {
      id: "A110",
      nombre: "Dra. Sofia Ramos Medina",
      correo: "s.ramos@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/sofia-ramos.jpg"
    },
    motivo: "incompatibilidad",
    motivoTexto: "Incompatibilidad con el tema de tesis",
    fechaSolicitud: "2025-03-22T14:50:00",
    fechaLimite: "2025-04-05T23:59:59", // Fecha ya pasada
    descripcion: "Los tesistas han reorientado sus proyectos hacia tecnologías de computación en la nube y microservicios, áreas que no son de mi especialidad. Considero que necesitan un asesor con mayor experiencia en estos temas.",
    estado: "pendiente_informacion",
    tesistas: [
      { id: "T119", nombre: "Cristian Soto", codigo: "20190123", titulo: "Arquitecturas serverless para procesamiento de big data", avance: 40 },
      { id: "T120", nombre: "Fabiola Reyes", codigo: "20180045", titulo: "Implementación de sistemas de CI/CD para microservicios", avance: 35 }
    ],
    comentarios: [
      { 
        id: "C107", 
        autor: "Coordinador", 
        fecha: "2025-03-25T09:30:00", 
        texto: "Necesitamos evidencia del cambio de enfoque en los proyectos. Por favor, adjunte los planes de tesis originales y los actualizados, además de un informe comparativo. También proporcione documentación sobre intentos previos de orientar a los tesistas hacia temas de su especialidad.",
        estado: "informacion"
      }
    ]
  },
  
  // Solicitudes con estados mixtos
  {
    id: "SOL-8123",
    asesor: {
      id: "A111",
      nombre: "Dr. Héctor Guzmán Rojas",
      correo: "h.guzman@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/hector-guzman.jpg"
    },
    motivo: "sobrecarga",
    motivoTexto: "Sobrecarga laboral",
    fechaSolicitud: "2025-04-08T08:30:00",
    fechaLimite: "2025-04-09T23:59:59", // Extremadamente urgente (1 día)
    descripcion: "He sido designado como investigador principal en un nuevo proyecto con la Unión Europea que requiere mi dedicación inmediata y a tiempo completo durante los próximos 6 meses.",
    estado: "pendiente",
    tesistas: [
      { id: "T121", nombre: "Jaime Oliva", codigo: "20200078", titulo: "Sistemas de gestión de energía para smart grids", avance: 25 },
      { id: "T122", nombre: "Daniela Rey", codigo: "20190112", titulo: "Algoritmos de optimización para ruteo de vehículos eléctricos", avance: 45 }
    ],
    comentarios: []
  },
  {
    id: "SOL-5387",
    asesor: {
      id: "A112",
      nombre: "Dra. Patricia Lagos Vidal",
      correo: "p.lagos@pucp.edu.pe",
      facultad: "Ciencias e Ingeniería",
      especialidad: "Ingeniería Informática",
      avatar: "/avatars/patricia-lagos.jpg"
    },
    motivo: "licencia",
    motivoTexto: "Licencia académica/personal",
    fechaSolicitud: "2025-03-10T11:30:00",
    fechaLimite: "2025-03-24T23:59:59", // Fecha ya pasada
    descripcion: "Solicito licencia por maternidad por un período de 4 meses a partir del 1 de abril de 2025.",
    estado: "aprobado",
    tesistas: [
      { id: "T123", nombre: "Adrián Campos", codigo: "20180134", titulo: "Sistemas de procesamiento de eventos complejos en tiempo real", avance: 60 },
      { id: "T124", nombre: "Renata Paredes", codigo: "20190067", titulo: "Implementación de data lakes para análisis de grandes volúmenes de datos", avance: 50 }
    ],
    comentarios: [
      { 
        id: "C108", 
        autor: "Coordinador", 
        fecha: "2025-03-12T14:20:00", 
        texto: "Solicitud aprobada. Felicitaciones por esta etapa. Se ha asignado al Dr. Ernesto Soto como asesor temporal durante su licencia por maternidad. Por favor, coordine la transición antes del 30 de marzo.",
        estado: "aprobacion"
      }
    ],
    fechaAprobacion: "2025-03-12T14:20:00",
    nuevoAsesor: {
      id: "A203",
      nombre: "Dr. Ernesto Soto Jiménez",
      correo: "e.soto@pucp.edu.pe"
    }
  }
];

// Componente para mostrar el estado de la solicitud
const EstadoSolicitud = ({ estado }) => {
  const estadoConfig = {
    pendiente: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      texto: "Pendiente de revisión",
      icono: <Timer className="h-3 w-3 mr-1" />
    },
    aprobado: {
      color: "bg-green-100 text-green-800 border-green-200",
      texto: "Aprobada",
      icono: <CheckCircle className="h-3 w-3 mr-1" />
    },
    rechazado: {
      color: "bg-red-100 text-red-800 border-red-200",
      texto: "Rechazada",
      icono: <XCircle className="h-3 w-3 mr-1" />
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

// Componente para mostrar la urgencia
const IndicadorUrgencia = ({ fechaLimite }) => {
  const fechaLimiteObj = parseISO(fechaLimite);
  const diasRestantes = differenceInDays(fechaLimiteObj, new Date());
  
  if (diasRestantes < 0) {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        Vencida
      </Badge>
    );
  } else if (diasRestantes <= 3) {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
        Urgente ({diasRestantes} días)
      </Badge>
    );
  } else if (diasRestantes <= 7) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        Pronta ({diasRestantes} días)
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        {diasRestantes} días
      </Badge>
    );
  }
};

// Información del coordinador actual (simulado)
const coordinadorInfo = {
  facultad: "Ciencias e Ingeniería",
  especialidad: "Ingeniería Informática"
};

export default function CoordinadorSolicitudesCese() {
  // Estado principal para las pestañas activas/históricas
  const [vistaActual, setVistaActual] = useState("activas");
  
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("fecha_desc");
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [panelDetallesAbierto, setPanelDetallesAbierto] = useState(false);
  const [dialogoRespuestaAbierto, setDialogoRespuestaAbierto] = useState(false);
  const [accionRespuesta, setAccionRespuesta] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [nuevaAsignacionAbierta, setNuevaAsignacionAbierta] = useState(false);
  
  // Filtrar solicitudes por especialidad del coordinador
  const solicitudesDeLaEspecialidad = datosSolicitudes.filter(
    s => s.asesor.especialidad === coordinadorInfo.especialidad
  );
  
  // Estadísticas para la especialidad actual
  const estadisticas = {
    total: solicitudesDeLaEspecialidad.length,
    pendientes: solicitudesDeLaEspecialidad.filter(s => s.estado === "pendiente").length,
    aprobadas: solicitudesDeLaEspecialidad.filter(s => s.estado === "aprobado").length,
    rechazadas: solicitudesDeLaEspecialidad.filter(s => s.estado === "rechazado").length,
    informacionRequerida: solicitudesDeLaEspecialidad.filter(s => s.estado === "pendiente_informacion").length,
    urgentes: solicitudesDeLaEspecialidad.filter(s => {
      const fechaLimiteObj = parseISO(s.fechaLimite);
      const diasRestantes = differenceInDays(fechaLimiteObj, new Date());
      return diasRestantes <= 3 && s.estado === "pendiente";
    }).length
  };
  
  // Efecto para filtrar solicitudes según la vista actual y los filtros aplicados
  useEffect(() => {
    let resultado = solicitudesDeLaEspecialidad;
    
    // Primero aplicar filtro por vista activa/histórica
    if (vistaActual === "activas") {
      resultado = resultado.filter(s => 
        s.estado === "pendiente" || 
        s.estado === "pendiente_informacion"
      );
    } else if (vistaActual === "completadas") {
      resultado = resultado.filter(s => 
        s.estado === "aprobado" || 
        s.estado === "rechazado"
      );
    }
    
    // Luego aplicar filtro de estado específico si está seleccionado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter(s => s.estado === filtroEstado);
    }
    
    // Filtrar por búsqueda
    if (busqueda) {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(s => 
        s.id.toLowerCase().includes(terminoBusqueda) ||
        s.asesor.nombre.toLowerCase().includes(terminoBusqueda) ||
        s.tesistas.some(t => t.nombre.toLowerCase().includes(terminoBusqueda)) ||
        s.tesistas.some(t => t.titulo.toLowerCase().includes(terminoBusqueda))
      );
    }
    
    // Ordenar resultados
    if (ordenarPor === "fecha_desc") {
      resultado.sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud));
    } else if (ordenarPor === "fecha_asc") {
      resultado.sort((a, b) => new Date(a.fechaSolicitud) - new Date(b.fechaSolicitud));
    } else if (ordenarPor === "urgencia") {
      resultado.sort((a, b) => {
        const diasA = differenceInDays(parseISO(a.fechaLimite), new Date());
        const diasB = differenceInDays(parseISO(b.fechaLimite), new Date());
        return diasA - diasB;
      });
    } else if (ordenarPor === "tesistas") {
      resultado.sort((a, b) => b.tesistas.length - a.tesistas.length);
    }
    
    setSolicitudesFiltradas(resultado);
  }, [vistaActual, filtroEstado, busqueda, ordenarPor]);
  
  // Abrir panel de detalles
  const verDetallesSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setPanelDetallesAbierto(true);
  };
  
  // Iniciar respuesta a solicitud
  const iniciarRespuesta = (tipo) => {
    setAccionRespuesta(tipo);
    setRespuestaTexto("");
    setDialogoRespuestaAbierto(true);
  };
  
  // Enviar respuesta a solicitud
  const enviarRespuesta = () => {
    console.log("Respuesta enviada:", {
      solicitudId: solicitudSeleccionada.id,
      accion: accionRespuesta,
      respuesta: respuestaTexto
    });
    
    // Aquí iría la lógica para actualizar el estado de la solicitud en el backend
    // Por ahora, solo cerramos el diálogo
    setDialogoRespuestaAbierto(false);
    
    // Si la acción es aprobar, mostrar diálogo de asignación de nuevo asesor
    if (accionRespuesta === "aprobar") {
      setNuevaAsignacionAbierta(true);
    }
  };
  
  // Asignar nuevo asesor
  const asignarNuevoAsesor = (asignacion) => {
    console.log("Nuevo asesor asignado:", asignacion);
    setNuevaAsignacionAbierta(false);
  };
  
  // Filtros disponibles según la vista actual
  const getEstadosDisponibles = () => {
    if (vistaActual === "activas") {
      return [
        { valor: "todos", texto: "Todos los estados" },
        { valor: "pendiente", texto: "Pendientes" },
        { valor: "pendiente_informacion", texto: "Info. Requerida" }
      ];
    } else if (vistaActual === "completadas") {
      return [
        { valor: "todos", texto: "Todos los estados" },
        { valor: "aprobado", texto: "Aprobadas" },
        { valor: "rechazado", texto: "Rechazadas" }
      ];
    } else {
      return [
        { valor: "todos", texto: "Todos los estados" },
        { valor: "pendiente", texto: "Pendientes" },
        { valor: "aprobado", texto: "Aprobadas" },
        { valor: "rechazado", texto: "Rechazadas" },
        { valor: "pendiente_informacion", texto: "Info. Requerida" }
      ];
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#042354] flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" />
            Solicitudes de Cese de Asesoría
          </h1>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{coordinadorInfo.facultad}</span> / <span className="font-medium">{coordinadorInfo.especialidad}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar datos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold">{estadisticas.total}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-yellow-800 mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-800">{estadisticas.pendientes}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-green-800 mb-1">Aprobadas</p>
              <p className="text-2xl font-bold text-green-800">{estadisticas.aprobadas}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-red-800 mb-1">Rechazadas</p>
              <p className="text-2xl font-bold text-red-800">{estadisticas.rechazadas}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-blue-800 mb-1">Info. Requerida</p>
              <p className="text-2xl font-bold text-blue-800">{estadisticas.informacionRequerida}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-orange-800 mb-1">Urgentes</p>
              <p className="text-2xl font-bold text-orange-800">{estadisticas.urgentes}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pestañas principales con altura fija */}
      <Tabs 
        defaultValue="activas" 
        className="mb-6"
        onValueChange={(value) => {
          setVistaActual(value);
          // Resetear el filtro de estado cuando se cambia de pestaña
          setFiltroEstado("todos");
        }}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6 h-14">
          <TabsTrigger value="activas" className="h-full">
            <div className="flex items-center justify-center h-full">
              <Timer className="mr-2 h-4 w-4" />
              Solicitudes Activas
            </div>
          </TabsTrigger>
          <TabsTrigger value="completadas" className="h-full">
            <div className="flex items-center justify-center h-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Solicitudes Completadas
            </div>
          </TabsTrigger>
          <TabsTrigger value="todas" className="h-full">
            <div className="flex items-center justify-center h-full">
              <ClipboardList className="mr-2 h-4 w-4" />
              Todas las Solicitudes
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar por ID, asesor, tesista o título..."
                className="pl-9"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                {getEstadosDisponibles().map((estado) => (
                  <SelectItem key={estado.valor} value={estado.valor}>
                    {estado.texto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={ordenarPor} onValueChange={setOrdenarPor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fecha_desc">Más recientes</SelectItem>
                <SelectItem value="fecha_asc">Más antiguas</SelectItem>
                <SelectItem value="urgencia">Urgencia</SelectItem>
                <SelectItem value="tesistas">N° de tesistas</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => {
              setFiltroEstado("todos");
              setBusqueda("");
              setOrdenarPor("fecha_desc");
            }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Contenido de las pestañas - reutilizamos la misma tabla */}
        <TabsContent value="activas">
          <SolicitudesTable 
            solicitudes={solicitudesFiltradas} 
            verDetalles={verDetallesSolicitud}
            iniciarRespuesta={iniciarRespuesta}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
          />
        </TabsContent>
        
        <TabsContent value="completadas">
          <SolicitudesTable 
            solicitudes={solicitudesFiltradas} 
            verDetalles={verDetallesSolicitud}
            iniciarRespuesta={iniciarRespuesta}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
          />
        </TabsContent>
        
        <TabsContent value="todas">
          <SolicitudesTable 
            solicitudes={solicitudesFiltradas} 
            verDetalles={verDetallesSolicitud}
            iniciarRespuesta={iniciarRespuesta}
            setSolicitudSeleccionada={setSolicitudSeleccionada}
          />
        </TabsContent>
      </Tabs>
      
      
      {/* Panel lateral de detalles */}
      <Sheet open={panelDetallesAbierto} onOpenChange={setPanelDetallesAbierto}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {solicitudSeleccionada && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  Solicitud {solicitudSeleccionada.id}
                  <EstadoSolicitud estado={solicitudSeleccionada.estado} className="ml-2" />
                </SheetTitle>
                <SheetDescription>
                  Detalles de la solicitud de cese de asesoría
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                {/* Datos del asesor */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Datos del asesor</h3>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{solicitudSeleccionada.asesor.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{solicitudSeleccionada.asesor.nombre}</p>
                      <p className="text-sm text-gray-600">{solicitudSeleccionada.asesor.especialidad}</p>
                      <p className="text-sm text-gray-600">{solicitudSeleccionada.asesor.facultad}</p>
                      <p className="text-sm text-blue-600">{solicitudSeleccionada.asesor.correo}</p>
                    </div>
                  </div>
                </div>
                
                {/* Datos de la solicitud */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Información de la solicitud</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Fecha de solicitud</p>
                        <p className="text-sm">
                          {format(parseISO(solicitudSeleccionada.fechaSolicitud), "dd/MM/yyyy HH:mm", { locale: es })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha límite</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm">
                            {format(parseISO(solicitudSeleccionada.fechaLimite), "dd/MM/yyyy", { locale: es })}
                          </p>
                          <IndicadorUrgencia fechaLimite={solicitudSeleccionada.fechaLimite} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Motivo</p>
                      <p className="text-sm font-medium">{solicitudSeleccionada.motivoTexto}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Descripción</p>
                      <p className="text-sm mt-1 bg-white p-3 border rounded-md">
                        {solicitudSeleccionada.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Tesistas afectados */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tesistas afectados ({solicitudSeleccionada.tesistas.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto px-1">
                    {solicitudSeleccionada.tesistas.map((tesista, idx) => (
                      <div key={idx} className="bg-white p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{tesista.nombre}</p>
                            <p className="text-xs text-gray-500">Código: {tesista.codigo}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-blue-50 text-blue-800">
                              Avance: {tesista.avance}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm mt-2 text-gray-700">{tesista.titulo}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${tesista.avance}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Historial de comentarios */}
                {solicitudSeleccionada.comentarios.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Historial de comentarios</h3>
                    <div className="space-y-3">
                      {solicitudSeleccionada.comentarios.map((comentario, idx) => {
                        const colorClasses = {
                          aprobacion: "bg-green-50 border-green-200",
                          rechazo: "bg-red-50 border-red-200",
                          informacion: "bg-blue-50 border-blue-200"
                        };
                        
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 border rounded-md ${colorClasses[comentario.estado] || "bg-gray-50"}`}
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm">{comentario.autor}</p>
                              <p className="text-xs text-gray-500">
                                {format(parseISO(comentario.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                              </p>
                            </div>
                            <p className="text-sm mt-1">{comentario.texto}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Información de reasignación si aplica */}
                {solicitudSeleccionada.estado === "aprobado" && solicitudSeleccionada.nuevoAsesor && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-green-800 mb-1">Reasignación de asesor</h3>
                    <p className="text-sm">Nuevo asesor asignado: <span className="font-medium">{solicitudSeleccionada.nuevoAsesor.nombre}</span></p>
                    <p className="text-sm text-green-700">{solicitudSeleccionada.nuevoAsesor.correo}</p>
                  </div>
                )}
              </div>
              
              <SheetFooter className="pt-2 border-t flex flex-col sm:flex-row gap-2">
                {solicitudSeleccionada.estado === "pendiente" && (
                  <>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      onClick={() => iniciarRespuesta("aprobar")}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                      onClick={() => iniciarRespuesta("rechazar")}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                      onClick={() => iniciarRespuesta("solicitar_info")}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Solicitar información
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    window.open(`mailto:${solicitudSeleccionada.asesor.correo}`, '_blank');
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contactar asesor
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Diálogo de respuesta */}
      <Dialog open={dialogoRespuestaAbierto} onOpenChange={setDialogoRespuestaAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {accionRespuesta === "aprobar" && "Aprobar solicitud de cese"}
              {accionRespuesta === "rechazar" && "Rechazar solicitud de cese"}
              {accionRespuesta === "solicitar_info" && "Solicitar información adicional"}
            </DialogTitle>
            <DialogDescription>
              {accionRespuesta === "aprobar" && "Apruebe la solicitud e indique las instrucciones para el asesor."}
              {accionRespuesta === "rechazar" && "Indique los motivos por los cuales se rechaza la solicitud."}
              {accionRespuesta === "solicitar_info" && "Solicite información adicional para evaluar la solicitud."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {accionRespuesta === "aprobar" && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Aprobación de solicitud</AlertTitle>
                <AlertDescription className="text-green-700">
                  Al aprobar esta solicitud, deberá asignar un nuevo asesor para los tesistas afectados.
                </AlertDescription>
              </Alert>
            )}
            
            {accionRespuesta === "rechazar" && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTitle className="text-red-800">Rechazo de solicitud</AlertTitle>
                <AlertDescription className="text-red-700">
                  El rechazo debe estar justificado. El asesor deberá continuar con sus responsabilidades.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="respuesta" className="text-sm font-medium">
                Mensaje para el asesor:
              </label>
              <Textarea
                id="respuesta"
                value={respuestaTexto}
                onChange={(e) => setRespuestaTexto(e.target.value)}
                rows={5}
                placeholder="Escriba su respuesta..."
              />
              <p className="text-xs text-gray-500">
                Este mensaje será enviado al asesor y quedará registrado en el historial de la solicitud.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoRespuestaAbierto(false)}>
              Cancelar
            </Button>
            <Button
              onClick={enviarRespuesta}
              className={
                accionRespuesta === "aprobar" ? "bg-green-600 hover:bg-green-700 text-white" :
                accionRespuesta === "rechazar" ? "bg-red-600 hover:bg-red-700 text-white" :
                "bg-blue-600 hover:bg-blue-700 text-white"
              }
            >
              {accionRespuesta === "aprobar" && "Aprobar y continuar"}
              {accionRespuesta === "rechazar" && "Confirmar rechazo"}
              {accionRespuesta === "solicitar_info" && "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de asignación de nuevo asesor */}
      {solicitudSeleccionada && (
        <Dialog open={nuevaAsignacionAbierta} onOpenChange={setNuevaAsignacionAbierta}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Asignar Nuevo Asesor</DialogTitle>
              <DialogDescription>
                Asigne un nuevo asesor para los tesistas afectados por el cese de asesoría.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Aquí iría un componente de búsqueda y selección de asesores */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar asesor disponible:</label>
                <Input
                  type="text"
                  placeholder="Buscar por nombre, especialidad..."
                />
              </div>
              
              <div className="border rounded-md">
                <div className="p-3 border-b bg-gray-50">
                  <h4 className="text-sm font-medium">Asesores sugeridos</h4>
                  <p className="text-xs text-gray-500">Basados en la especialidad y disponibilidad</p>
                </div>
                
                <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
                  {/* Lista de asesores sugeridos (ejemplo) */}
                  {[
                    { id: "A101", nombre: "Dr. Luis Ramírez", especialidad: "Ingeniería Informática", tesistasActuales: 2 },
                    { id: "A102", nombre: "Dr. Javier Pérez", especialidad: "Ingeniería Informática", tesistasActuales: 1 },
                    { id: "A103", nombre: "Dra. Claudia Vásquez", especialidad: "Ingeniería Informática", tesistasActuales: 3 }
                  ].map((asesor, idx) => (
                    <div key={idx} className="flex items-start justify-between p-2 border rounded-md hover:bg-gray-50">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{asesor.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{asesor.nombre}</p>
                          <p className="text-xs text-gray-600">{asesor.especialidad}</p>
                          <div className="flex items-center mt-1">
                            <GraduationCap className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="text-xs text-gray-500">{asesor.tesistasActuales} tesistas actuales</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => asignarNuevoAsesor({
                          asesorId: asesor.id,
                          asesorNombre: asesor.nombre,
                          solicitudId: solicitudSeleccionada.id
                        })}
                      >
                        Asignar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Importante</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Asegúrese de que el nuevo asesor tenga la disponibilidad y experiencia necesarias para continuar con los proyectos de tesis afectados.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setNuevaAsignacionAbierta(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente reutilizable para la tabla de solicitudes
const SolicitudesTable = ({ solicitudes, verDetalles, iniciarRespuesta, setSolicitudSeleccionada }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead className="w-[180px]">Fecha Solicitud</TableHead>
              <TableHead className="w-[180px]">Fecha Límite</TableHead>
              <TableHead className="w-[100px]">Tesistas</TableHead>
              <TableHead className="w-[150px]">Estado</TableHead>
              <TableHead className="w-[100px]">Urgencia</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No se encontraron solicitudes que coincidan con los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              solicitudes.map((solicitud) => (
                <TableRow key={solicitud.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{solicitud.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{solicitud.asesor.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{solicitud.asesor.nombre}</p>
                        <p className="text-xs text-gray-500">{solicitud.asesor.especialidad}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{solicitud.motivoTexto}</TableCell>
                  <TableCell>
                    {format(parseISO(solicitud.fechaSolicitud), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(solicitud.fechaLimite), "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1 text-[#042354]" />
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                            {solicitud.tesistas.length} tesista{solicitud.tesistas.length !== 1 ? 's' : ''}
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Tesistas afectados:</h4>
                            {solicitud.tesistas.map((tesista, idx) => (
                              <div key={idx} className="text-xs space-y-1 pb-2 border-b last:border-0">
                                <p className="font-medium">{tesista.nombre} ({tesista.codigo})</p>
                                <p className="text-gray-600">{tesista.titulo}</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full" 
                                    style={{ width: `${tesista.avance}%` }}
                                  ></div>
                                </div>
                                <p className="text-[10px] text-gray-500">Avance: {tesista.avance}%</p>
                              </div>
                            ))}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </TableCell>
                  <TableCell>
                    <EstadoSolicitud estado={solicitud.estado} />
                  </TableCell>
                  <TableCell>
                    <IndicadorUrgencia fechaLimite={solicitud.fechaLimite} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => verDetalles(solicitud)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => verDetalles(solicitud)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          {solicitud.estado === "pendiente" && (
                            <>
                              <DropdownMenuItem onClick={() => {
                                setSolicitudSeleccionada(solicitud);
                                iniciarRespuesta("aprobar");
                              }}>
                                <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                                Aprobar solicitud
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSolicitudSeleccionada(solicitud);
                                iniciarRespuesta("rechazar");
                              }}>
                                <ThumbsDown className="h-4 w-4 mr-2 text-red-600" />
                                Rechazar solicitud
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSolicitudSeleccionada(solicitud);
                                iniciarRespuesta("solicitar_info");
                              }}>
                                <Info className="h-4 w-4 mr-2 text-blue-600" />
                                Solicitar información
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            window.open(`mailto:${solicitud.asesor.correo}`, '_blank');
                          }}>
                            <Mail className="h-4 w-4 mr-2" />
                            Contactar asesor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};