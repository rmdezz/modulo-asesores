// Datos de ejemplo (en una aplicación real vendrían de una API)
export const datosSolicitudes = [
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
  // NUEVAS SOLICITUDES PENDIENTES
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
  // NUEVAS SOLICITUDES APROBADAS
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
  // NUEVAS SOLICITUDES RECHAZADAS
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
  // NUEVAS SOLICITUDES PENDIENTE_INFORMACION
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
  // SOLICITUDES ADICIONALES PARA OTRAS FACULTADES Y ESPECIALIDADES
  {
    id: "SOL-9156",
    asesor: {
      id: "A301",
      nombre: "Dr. Manuel Espinoza Herrera",
      correo: "m.espinoza@pucp.edu.pe",
      facultad: "Ciencias Sociales",
      especialidad: "Economía",
      avatar: "/avatars/manuel-espinoza.jpg"
    },
    motivo: "sobrecarga",
    motivoTexto: "Sobrecarga laboral",
    fechaSolicitud: "2025-04-07T11:45:00",
    fechaLimite: "2025-04-21T23:59:59",
    descripcion: "Debido a mi designación como investigador principal en dos proyectos CONCYTEC simultáneos, mi carga administrativa y de investigación ha incrementado significativamente, lo que me impide dedicar el tiempo adecuado a la asesoría de tesis.",
    estado: "pendiente",
    tesistas: [
      { id: "T201", nombre: "Carla Mejía", codigo: "20190134", titulo: "Análisis del impacto de políticas públicas en la desigualdad económica en Lima Metropolitana", avance: 45 },
      { id: "T202", nombre: "Luis Hernández", codigo: "20180078", titulo: "Modelos econométricos para la evaluación de microcréditos en zonas rurales", avance: 35 }
    ],
    comentarios: []
  }
];

  // Información del coordinador actual (simulado)
  export const coordinadorInfo = {
    facultad: "Ciencias e Ingeniería",
    especialidad: "Ingeniería Informática"
  };