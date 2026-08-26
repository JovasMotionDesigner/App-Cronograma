/**
 * Data Storage & Initial State for Cronograma de Manual de Marca
 * Artesanías Maverick & Variedades Franco
 */

const TEAM_MEMBERS = [
    { id: "jose", name: "José Luis Vásquez", role: "Coordinador & Motion/Digital", avatar: "JV", color: "bg-blue-600" },
    { id: "marcela", name: "Marcela Castillo", role: "Diseñadora Gráfica & Editorial", avatar: "MC", color: "bg-rose-600" },
    { id: "ezequiel", name: "Ezequiel Medrano", role: "Diseñador UI/UX & Social Media", avatar: "EM", color: "bg-emerald-600" },
    { id: "grupal", name: "Trabajo Grupal (Equipo)", role: "Colaboración General", avatar: "TG", color: "bg-purple-600" }
];

const TASK_STATUSES = [
    { id: "pendiente", label: "Pendiente", color: "bg-slate-500 text-white", border: "border-slate-400" },
    { id: "en_proceso", label: "En Proceso", color: "bg-amber-500 text-white", border: "border-amber-400" },
    { id: "en_revision", label: "En Revisión", color: "bg-blue-500 text-white", border: "border-blue-400" },
    { id: "completada", label: "Completada", color: "bg-emerald-500 text-white", border: "border-emerald-400" }
];

const PHASES = [
    { id: "fase1", number: 1, name: "Investigación & Briefing", icon: "search", color: "sky" },
    { id: "fase2", number: 2, name: "Identidad Visual (Logo & ADN)", icon: "palette", color: "indigo" },
    { id: "fase3", number: 3, name: "Manual de Marca Editorial", icon: "book-open", color: "purple" },
    { id: "fase4", number: 4, name: "Catálogo & Fotografía", icon: "layers", color: "amber" },
    { id: "fase5", number: 5, name: "Piezas Gráficas Redes Sociales", icon: "share-2", color: "pink" },
    { id: "fase6", number: 6, name: "Sitio Web (UI/UX & Prototipo)", icon: "globe", color: "cyan" },
    { id: "fase7", number: 7, name: "Aplicaciones, Punto de Venta & Packaging", icon: "package", color: "orange" },
    { id: "fase8", number: 8, name: "Control de Calidad & Entregables", icon: "check-circle", color: "emerald" }
];

const INITIAL_COMPANIES_DATA = {
    maverick: {
        id: "maverick",
        name: "Artesanías Maverick",
        badge: "Turismo & Recuerdos Típicos",
        location: "Mercado Sagrado Corazón, puesto #248, planta baja",
        contact: "7234-0194 | TikTok: Variedades Franco",
        owner: "Propietario / Encargado Maverick",
        docFile: "docs/Artesanias_Maverick_Brief.docx",
        docName: "Artesanías Maverick.docx",
        tagline: "El Salvador y Centroamérica en cada recuerdo artesanal",
        theme: {
            primary: "#0284c7",
            primaryLight: "#e0f2fe",
            accent: "#f59e0b",
            heroGradient: "from-sky-900 via-indigo-950 to-slate-950",
            cardBorder: "border-sky-500/30"
        },
        brief: {
            summary: "Iniciativa enfocada en el auge del turismo en El Salvador, ofreciendo artesanías y recuerdos representativos de El Salvador, Guatemala y Nicaragua para turistas y residentes.",
            targetAudience: "Turistas internacionales, salvadoreños en el país y en el exterior, personas que buscan recuerdos folclóricos accesibles y de calidad.",
            valueProposition: "Atención amable y cálida, precios competitivos, variedad multicultural y elementos auténticos de identidad salvadoreña.",
            logoConcept: "Desarrollo a partir de las iniciales 'AM' integrando iconos salvadoreños como el Torogoz (ave nacional) o la silueta emblemática de la BINAES.",
            colorPalette: "Colores vivos, alegres y llamativos (Azul profundo, Turquesa Torogoz, Amarillo cálido, Terracota y Blanco).",
            typographyStyle: "Moderna, amigable, limpia y legible tanto en soportes impresos reducidos como en pantallas digitales.",
            keyProducts: [
                "Imanes decorativos y artesanales de El Salvador",
                "Llaveros típicos y tallados en madera",
                "Juegos tradicionales: Trompos, Capiruchos y Yoyos artesanales",
                "Recuerdos y figuras alusivas a la cultura centroamericana"
            ],
            applications: [
                "Rótulo principal para Puesto #248 en el Mercado",
                "Tarjetas de presentación con QR para WhatsApp",
                "Branding para redes sociales: Instagram, Facebook y TikTok",
                "Etiquetas de recuerdo, packaging y bolsas ecológicas",
                "Catálogo de productos digital e impreso",
                "Landing page web para reservas de souvenirs"
            ]
        },
        tasks: [
            // FASE 1
            {
                id: "mav-1",
                phaseId: "fase1",
                title: "Diagnóstico de Marca y Benchmark del Mercado Sagrado Corazón",
                description: "Investigación de competidores directos en el Mercado Sagrado Corazón y tiendas de souvenirs del Centro Histórico. Análisis de precios, formatos y oportunidades de diferenciación.",
                deliverable: "Documento de análisis de mercado, cuadro comparativo de competidores y síntesis FODA.",
                assignedTo: "Marcela Castillo",
                status: "completada",
                priority: "alta",
                deadline: "Semana 1"
            },
            {
                id: "mav-2",
                phaseId: "fase1",
                title: "Definición de Arquetipo de Marca y User Personas (Turistas & Locales)",
                description: "Estructuración de los perfiles de compradores (turista estadounidense/europeo, salvadoreño en el exterior y cliente local). Mapeo del Customer Journey en el puesto #248.",
                deliverable: "Fichas de User Personas y mapa de empatía del cliente ideal.",
                assignedTo: "Ezequiel Medrano",
                status: "completada",
                priority: "media",
                deadline: "Semana 1"
            },

            // FASE 2: IDENTIDAD
            {
                id: "mav-3",
                phaseId: "fase2",
                title: "Bocetería y Conceptualización del Logotipo 'AM + Torogoz/BINAES'",
                description: "Creación de propuestas conceptuales explorando la unión de las iniciales AM con la silueta estilizada del ave nacional Torogoz y trazos modernos de la BINAES.",
                deliverable: "Panel de 15 bocetos preliminares y selección de 3 caminos visuales finalistas.",
                assignedTo: "José Luis Vásquez",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 2"
            },
            {
                id: "mav-4",
                phaseId: "fase2",
                title: "Vectorización, Retícula Constructiva y Versiones del Logotipo",
                description: "Trazado vectorial milimétrico del isotipo y logotipo principal en Adobe Illustrator. Definición de versiones horizontal, vertical, isotipo solitario y versiones monocromáticas.",
                deliverable: "Archivos vectoriales (.AI, .SVG, .EPS) y lámina con retícula de proporciones modulares y área de seguridad.",
                assignedTo: "José Luis Vásquez",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 2"
            },
            {
                id: "mav-5",
                phaseId: "fase2",
                title: "Definición de la Paleta Cromática Oficial (Vivos & Culturales)",
                description: "Selección de la armonía de colores vivos representativos: Azul Torogoz, Esmeralda, Amarillo Calidez, Terracota y Neutros. Conversión a sistemas CMYK, RGB, HEX y Pantone.",
                deliverable: "Guía de color con porcentajes exactos de impresión y valores hexadecimales para pantallas.",
                assignedTo: "Marcela Castillo",
                status: "en_revision",
                priority: "alta",
                deadline: "Semana 2"
            },
            {
                id: "mav-6",
                phaseId: "fase2",
                title: "Selección y Jerarquía del Sistema Tipográfico",
                description: "Elección de la familia tipográfica primaria para logotipo, títulos y titulares (con personalidad amigable y contemporánea), y familia secundaria para textos de lectura y empaques.",
                deliverable: "Láminas con especímenes tipográficos, pesos, usos recomendados y fuentes web (Google Fonts).",
                assignedTo: "Marcela Castillo",
                status: "en_revision",
                priority: "media",
                deadline: "Semana 2"
            },
            {
                id: "mav-7",
                phaseId: "fase2",
                title: "Diseño de Texturas, Patrones e Iconografía Cultural",
                description: "Desarrollo de pattern con motivos tradicionales salvadoreños (formas de capiruchos, trompos, siluetas de torogoz y grecas) para fondos de empaque y piezas digitales.",
                deliverable: "Set de 12 iconos vectoriales y 3 patrones gráficos en alta resolución.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 3"
            },

            // FASE 3: MANUAL EDITORIAL
            {
                id: "mav-8",
                phaseId: "fase3",
                title: "Redacción de Fundamentos de Marca, Propósito y Tono de Voz",
                description: "Redacción del manifiesto de Artesanías Maverick, promesa de valor, pilares de comunicación (cálido, auténtico, salvadoreño, entusiasta) y directrices de redacción.",
                deliverable: "Capítulo 1 del manual: Filosofía, ADN y Tono de Comunicación redactado y aprobado.",
                assignedTo: "Marcela Castillo",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 3"
            },
            {
                id: "mav-9",
                phaseId: "fase3",
                title: "Normativa de Usos Permitidos, Reducciones e Incorrecciones",
                description: "Elaboración de las normativas de tamaños mínimos de impresión y pantalla, fondo claro/oscuro, contraste, y catálogo de usos indebidos (deformaciones, cambios de color).",
                deliverable: "Capítulo normativo con ejemplos gráficos del 'Qué hacer y Qué NO hacer' con el logo.",
                assignedTo: "José Luis Vásquez",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 3"
            },
            {
                id: "mav-10",
                phaseId: "fase3",
                title: "Maquetación Editorial y Producción del Manual de Marca (PDF)",
                description: "Diseño y diagramación completa del Manual de Identidad Visual en InDesign/Illustrator con diseño editorial de vanguardia, portada, índice interactivo y fichas técnicas.",
                deliverable: "Manual de Marca completo en PDF Interactivo de alta calidad para cliente y versión para imprenta.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 4"
            },

            // FASE 4: CATALOGO & FOTOGRAFIA
            {
                id: "mav-11",
                phaseId: "fase4",
                title: "Estructura de Categorías e Inventario para Catálogo de Productos",
                description: "Clasificación de los productos en categorías: 1) Recuerdos Típicos (imanes/llaveros), 2) Juguetes Artesanales (trompos, capiruchos, yoyos), 3) Piezas de Colección.",
                deliverable: "Tabla de contenido de productos, fichas técnicas y códigos de referencia.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 3"
            },
            {
                id: "mav-12",
                phaseId: "fase4",
                title: "Sesión Fotográfica de Productos y Retoque Digital",
                description: "Toma fotográfica en estudio/puesto de souvenirs con iluminación adecuada para destacar el color y textura de las artesanías. Retoque y eliminación de fondos en Photoshop.",
                deliverable: "Banco de 30 imágenes retocadas en alta resolución con fondo transparente y fondo ambientado.",
                assignedTo: "José Luis Vásquez",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 4"
            },
            {
                id: "mav-13",
                phaseId: "fase4",
                title: "Diseño y Maquetación del Catálogo Digital Interactivo con Enlace a WhatsApp",
                description: "Diagramación editorial del catálogo con fotos, descripciones, precios sugeridos y botones interactivos 'Pedir por WhatsApp' listos para enviar al 7234-0194.",
                deliverable: "Catálogo digital PDF interactivo optimizado para móviles y versión imprimible.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 4"
            },

            // FASE 5: PIEZAS GRAFICAS REDES SOCIALES
            {
                id: "mav-14",
                phaseId: "fase5",
                title: "Kit de Plantillas para Posts y Carruseles (Instagram & Facebook)",
                description: "Diseño de 8 plantillas editables en Canva/Figma/Photoshop: Lanzamiento de producto, historia de la artesanía, datos curiosos de El Salvador, precios y promociones.",
                deliverable: "Archivos editables y exportados en 1080x1080px y 1080x1350px.",
                assignedTo: "Ezequiel Medrano",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 4"
            },
            {
                id: "mav-15",
                phaseId: "fase5",
                title: "Plantillas Dinámicas para Instagram Stories y Estados de WhatsApp",
                description: "Creación de 6 plantillas verticales (1080x1920px) interactivas: encuestas, 'Visítanos en el Puesto #248', producto del día y novedades para turistas.",
                deliverable: "Pack de plantillas para Stories listas para editar en móvil y PC.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 5"
            },
            {
                id: "mav-16",
                phaseId: "fase5",
                title: "Estrategia Visual de Portadas y Motion Graphics para TikTok",
                description: "Diseño de portadas de videos, overlays de texto, transiciones y elementos animados para mostrar el proceso artesanal y cómo jugar capirucho/trompo.",
                deliverable: "Plantillas de cover para TikTok y 2 animaciones cortas de logotipo (Motion ID).",
                assignedTo: "José Luis Vásquez",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 5"
            },
            {
                id: "mav-17",
                phaseId: "fase5",
                title: "Banners de Cabecera, Avatares y Catálogo de WhatsApp Business",
                description: "Optimización gráfica para perfil de WhatsApp Business (7234-0194): foto de perfil con símbolo AM, portada y banner de Facebook, configuración visual de catálogo.",
                deliverable: "Set de cabeceras en alta resolución adaptadas a todas las plataformas.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 5"
            },

            // FASE 6: SITIO WEB UI/UX
            {
                id: "mav-18",
                phaseId: "fase6",
                title: "Arquitectura de Información, Sitemap y Wireframes Web",
                description: "Estructuración de las secciones del sitio web: Inicio, Quiénes Somos, Galería de Souvenirs, Ubicación en Mercado #248 y Botón de Pedidos.",
                deliverable: "Diagrama de flujo de navegación y wireframes de baja fidelidad.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 5"
            },
            {
                id: "mav-19",
                phaseId: "fase6",
                title: "Diseño UI en Figma (Landing Page & Catálogo Online Responsivo)",
                description: "Diseño de la interfaz visual completa para dispositivos móviles y computadoras de escritorio, integrando la paleta viva, fotos de artesanías y llamados a la acción.",
                deliverable: "Prototipo interactivo navegable en Figma con UI Kit y guía de componentes.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 6"
            },
            {
                id: "mav-20",
                phaseId: "fase6",
                title: "Prototipo Web Interactivo con Integración de WhatsApp y Geolocalización",
                description: "Desarrollo del prototipo funcional con mapa de cómo llegar al puesto #248 en el Mercado Sagrado Corazón y cotizador rápido conectado a WhatsApp.",
                deliverable: "Prototipo web funcional en línea / código frontend listo.",
                assignedTo: "José Luis Vásquez",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 6"
            },

            // FASE 7: APLICACIONES & PACKAGING
            {
                id: "mav-21",
                phaseId: "fase7",
                title: "Diseño del Rótulo Comercial para Puesto #248 (Mercado Sagrado Corazón)",
                description: "Diseño a escala real del letrero identificativo para el puesto en planta baja, con visibilidad desde los pasillos principales y acabados resistentes.",
                deliverable: "Arte final a escala 1:1 para impresión en lona vinílica / acrílico con cotas técnicas.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 6"
            },
            {
                id: "mav-22",
                phaseId: "fase7",
                title: "Diseño de Tarjetas de Presentación y Stickers de Recuerdo",
                description: "Tarjetas con diseño folclórico salvadoreño, código QR de WhatsApp y redes, más stickers autoadhesivos para pegar en las compras de los turistas.",
                deliverable: "Archivos listos para imprenta con líneas de corte y troquel.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 6"
            },
            {
                id: "mav-23",
                phaseId: "fase7",
                title: "Diseño de Bolsas Ecológicas y Empaques de Souvenir",
                description: "Diseño para bolsas de papel kraft con el sello de Artesanías Maverick, el patrón salvadoreño y mensaje de despedida turística.",
                deliverable: "Mockups 3D y plantillas mecánicas de impresión a 1 y 2 tintas.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 7"
            },

            // FASE 8: CONTROL DE CALIDAD & ENTREGA
            {
                id: "mav-24",
                phaseId: "fase8",
                title: "Revisión Grupal, Control de Calidad y Validación de Entregables",
                description: "Sesión grupal entre José Luis, Marcela y Ezequiel para verificar consistencia cromática, ortografía, enlaces de WhatsApp y resolución de archivos.",
                deliverable: "Acta de control de calidad y checklist final de entregables firmado.",
                assignedTo: "Trabajo Grupal (Equipo)",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 7"
            },
            {
                id: "mav-25",
                phaseId: "fase8",
                title: "Empaquetado de Archivos Maestros y Guía Rápida para el Cliente",
                description: "Organización de carpetas en la nube con archivos editables, fuentes tipográficas, fotos y un resumen de 2 páginas con instrucciones fáciles de uso.",
                deliverable: "Carpeta digital entregable estructurada y Guía Rápida en PDF.",
                assignedTo: "Trabajo Grupal (Equipo)",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 7"
            }
        ]
    },

    franco: {
        id: "franco",
        name: "Variedades Franco",
        badge: "Talabartería Tradicional & Cuero",
        location: "Mercado Sagrado Corazón, Puestos #354 y #357 (Portón #5, frente al Hotel Palacio)",
        contact: "Samuel Neftalí Andrade Franco (Encargado) / José Elí Franco (Propietario)",
        owner: "Familia Franco Chavarría",
        docFile: "docs/Variedades_Franco_Brief.docx",
        docName: "Cuestionario de Identidad Visual - Variedades Franco.docx",
        tagline: "Variedades Franco: Cuero, tradición y calidad garantizada",
        theme: {
            primary: "#92400e",
            primaryLight: "#fef3c7",
            accent: "#ea580c",
            heroGradient: "from-amber-950 via-stone-900 to-slate-950",
            cardBorder: "border-amber-500/30"
        },
        brief: {
            summary: "Negocio de tradición familiar nacido del esfuerzo de José Elí Franco, hoy administrado y con taller de fabricación artesanal liderado por Samuel Franco. Especialistas en artículos utilitarios de cuero y manufactura exclusiva.",
            targetAudience: "Turistas que buscan artesanía representativa, comerciantes mayoristas que surten sus tiendas y clientes fieles del mercado que buscan artículos resistentes en cuero.",
            valueProposition: "Confección propia y exclusiva de pecheras y cinchos de alta durabilidad, garantía y reposición directa sin complicaciones, y trato familiar honesto.",
            logoConcept: "Isologotipo estilo Sello / Emblema grabado a fuego sobre cuero, transmitiendo autenticidad, solidez y costuras artesanales de talabartería. Descriptor: 'Variedades Franco: Artesanías & Cuero'.",
            colorPalette: "Gama principal en tonos tierra (Marrón cuero envejecido, Suela, Terracota, Tabaco) con acentos en Rojo artesanal y Amarillo cálido (evitar neones).",
            typographyStyle: "Robusta, artesanal, de herencia y con excelente presencia en marcas quemadas sobre cuero y etiquetas de papel kraft.",
            keyProducts: [
                "Pecheras para perros: Confección artesanal exclusiva hecha a mano por Samuel",
                "Cinchos y cinturones de cuero legítimo de alta resistencia",
                "Billeteras, monederos y fundas utilitarias en cuero",
                "Artesanías típicas en cuero repujado y textil folclórico"
            ],
            applications: [
                "Rótulo comercial principal para Puestos #354 y #357",
                "Etiquetas colgantes de cuero y papel kraft con sello térmico",
                "Catálogo de productos digital para mayoristas y minoristas",
                "Perfil y catálogo en WhatsApp Business para envíos por encomienda",
                "Redes sociales (TikTok, Instagram, Facebook)",
                "Landing page web y sistema de pedidos con código QR"
            ]
        },
        tasks: [
            // FASE 1
            {
                id: "fra-1",
                phaseId: "fase1",
                title: "Entrevista a Profundidad y Levantamiento de ADN de Taller con Samuel Franco",
                description: "Entrevista técnica sobre los procesos de confección de pecheras y cinchos, origen de cueros, garantía directa de reemplazo y propuesta de valor familiar.",
                deliverable: "Documento de transcripción, síntesis de propuesta de valor y matriz de atributos de marca.",
                assignedTo: "José Luis Vásquez",
                status: "completada",
                priority: "alta",
                deadline: "Semana 1"
            },
            {
                id: "fra-2",
                phaseId: "fase1",
                title: "Benchmark de Talabarterías y Accesorios Caninos en Cuero",
                description: "Análisis de mercado sobre marcas de accesorios de cuero para mascotas y marroquinería en Centroamérica. Identificación de tendencias y precios de venta al mayoreo y detalle.",
                deliverable: "Informe de benchmark comparativo con oportunidades de posicionamiento premium accesible.",
                assignedTo: "Marcela Castillo",
                status: "completada",
                priority: "media",
                deadline: "Semana 1"
            },

            // FASE 2: IDENTIDAD
            {
                id: "fra-3",
                phaseId: "fase2",
                title: "Bocetería y Diseño del Isologotipo Tipo Sello Grabado en Cuero",
                description: "Exploración gráfica de sello / emblema de talabartería con las palabras 'Variedades Franco: Artesanías & Cuero', integrando texturas de costura y motivos artesanales.",
                deliverable: "Panel de 12 propuestas conceptuales y selección de la estructura del emblema.",
                assignedTo: "Marcela Castillo",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 2"
            },
            {
                id: "fra-4",
                phaseId: "fase2",
                title: "Vectorización y Adaptación para Grabado a Fuego y Troquelado",
                description: "Trazado milimétrico optimizado para poder estamparse con calor sobre cuero, madera o papel kraft sin perder detalle en grosores finos ni empastarse.",
                deliverable: "Archivos vectoriales (.AI, .SVG) optimizados con versión de alto contraste para sellos térmicos.",
                assignedTo: "José Luis Vásquez",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 2"
            },
            {
                id: "fra-5",
                phaseId: "fase2",
                title: "Paleta Cromática Terrosa (Cuero, Suela, Terracota & Acentos)",
                description: "Definición cromática basada en tonos naturales del cuero curtido, suela, tabaco y acento rojo rústico. Especificación de fórmulas CMYK, RGB, HEX y Pantone.",
                deliverable: "Guía de paleta de color con combinaciones armónicas para impresos rústicos y pantallas.",
                assignedTo: "Marcela Castillo",
                status: "en_revision",
                priority: "alta",
                deadline: "Semana 2"
            },
            {
                id: "fra-6",
                phaseId: "fase2",
                title: "Selección Tipográfica de Herencia y Solidez",
                description: "Selección de fuentes que evoquen tradición, durabilidad y trabajo manual con carácter (Serif artesanal / Slab) y tipografía de soporte moderna y clara.",
                deliverable: "Lámina de jerarquía tipográfica con pesos, interlineados y directrices de aplicación.",
                assignedTo: "Marcela Castillo",
                status: "en_revision",
                priority: "media",
                deadline: "Semana 2"
            },
            {
                id: "fra-7",
                phaseId: "fase2",
                title: "Desarrollo de Texturas de Cuero y Sellos de Garantía 'Hecho a Mano'",
                description: "Creación del sello secundario de garantía '100% Hecho a Mano por Samuel Franco - Calidad Garantizada' para acompañar las pecheras y cinchos.",
                deliverable: "Pack de 4 insignias secundarias vectoriales y texturas de costura artesanal.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 3"
            },

            // FASE 3: MANUAL EDITORIAL
            {
                id: "fra-8",
                phaseId: "fase3",
                title: "Redacción de Historia Familiar, Garantía y Tono de Voz Franco",
                description: "Documentación de la historia de superación de don José Elí y Samuel Franco. Redacción del manifiesto de honestidad, garantía de cambio y trato cercano al cliente.",
                deliverable: "Sección de ADN de Marca redactada para el manual corporativo.",
                assignedTo: "José Luis Vásquez",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 3"
            },
            {
                id: "fra-9",
                phaseId: "fase3",
                title: "Directrices de Uso del Emblema, Tamaños Mínimos y Restricciones",
                description: "Normas de reducción para grabado en hebillas pequeñas, etiquetas de tela y grandes vallas. Casos de aplicación sobre fondos oscuros y texturas de cuero.",
                deliverable: "Capítulo técnico de normas y restricciones con ejemplos visuales.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 3"
            },
            {
                id: "fra-10",
                phaseId: "fase3",
                title: "Maquetación Editorial del Manual de Marca Variedades Franco (PDF)",
                description: "Diagramación editorial premium en formato horizontal de alta resolución con estilo rústico y moderno, incluyendo portadas, índice interactivo y fichas de aplicación.",
                deliverable: "Manual de Identidad Visual completo en PDF Interactivo de alta calidad.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 4"
            },

            // FASE 4: CATALOGO & FOTOGRAFIA
            {
                id: "fra-11",
                phaseId: "fase4",
                title: "Estructuración de Línea Exclusiva Canina (Pecheras) y Marroquinería",
                description: "Definición de fichas técnicas para pecheras por tallas (S, M, L, XL), cinchos por medidas, colores de cuero y tablas de precios mayoristas/minoristas.",
                deliverable: "Documento de catálogo estructurado con descripciones, tallas y beneficios de durabilidad.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 3"
            },
            {
                id: "fra-12",
                phaseId: "fase4",
                title: "Sesión Fotográfica de Pecheras en Mascotas y Detalle de Costuras de Cuero",
                description: "Fotografía de producto con tomas macro de remaches, hebillas y costuras reforzadas, más tomas en uso con perros para resaltar la comodidad y resistencia.",
                deliverable: "Galería de 35 fotografías editadas en alta definición.",
                assignedTo: "José Luis Vásquez",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 4"
            },
            {
                id: "fra-13",
                phaseId: "fase4",
                title: "Diseño del Catálogo Digital Interactivo con Botones de Pedido al Mayoreo",
                description: "Maquetación del catálogo en PDF y versión web con botones directos 'Cotizar por Mayor / Detalle' enlazados al WhatsApp de Samuel Franco.",
                deliverable: "Catálogo interactivo con selector de tallas y enlaces directos a WhatsApp.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 4"
            },

            // FASE 5: PIEZAS GRAFICAS REDES SOCIALES
            {
                id: "fra-14",
                phaseId: "fase5",
                title: "Kit de Plantillas para Posts y Carruseles (Instagram & Facebook)",
                description: "Diseño de 8 plantillas para redes: 'Cómo elegir la pechera ideal', 'Resistencia del cuero legítimo vs sintético', 'Nuestros puestos en el mercado', promociones.",
                deliverable: "Archivos editables en Figma/Photoshop/Canva y plantillas en alta resolución.",
                assignedTo: "Ezequiel Medrano",
                status: "en_proceso",
                priority: "alta",
                deadline: "Semana 4"
            },
            {
                id: "fra-15",
                phaseId: "fase5",
                title: "Plantillas para Stories y Estados de WhatsApp de Envíos y Stock",
                description: "Plantillas dinámicas para avisar 'Envíos por encomienda del día', nuevos modelos de cinchos y testimonios de clientes satisfechos.",
                deliverable: "Set de 6 plantillas de Stories en formato vertical 1080x1920px.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 5"
            },
            {
                id: "fra-16",
                phaseId: "fase5",
                title: "Estrategia Visual de Videos y Portadas para TikTok (Taller Franco)",
                description: "Concepto de videos mostrando a Samuel elaborando una pechera desde cero (corte de cuero, costura, remaches) para generar confianza y viralidad.",
                deliverable: "Plantillas de covers para TikTok, guión gráfico y 2 intros animadas.",
                assignedTo: "José Luis Vásquez",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 5"
            },
            {
                id: "fra-17",
                phaseId: "fase5",
                title: "Configuración Visual de WhatsApp Business y Banners de Puestos",
                description: "Creación de foto de perfil con el nuevo sello, portada con foto de los puestos #354-357 y armado visual del catálogo de productos en WhatsApp.",
                deliverable: "Assets optimizados para el WhatsApp comercial de Samuel Franco.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 5"
            },

            // FASE 6: SITIO WEB UI/UX
            {
                id: "fra-18",
                phaseId: "fase6",
                title: "Arquitectura de Información Web y Guía de Tallas Interactiva",
                description: "Estructura del sitio: Home con video de taller, Catálogo de Pecheras & Cinchos, Calculadora de Talla para Perros, Sección Mayoristas y Contacto.",
                deliverable: "Sitemap detallado y wireframes UX del flujo de compra y cotización.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 5"
            },
            {
                id: "fra-19",
                phaseId: "fase6",
                title: "Diseño UI en Figma (E-Commerce / Landing de Artesanías Franco)",
                description: "Diseño visual moderno con fondo oscuro cálido, detalles en dorado y cuero, tarjetas de producto con selector de color y botones de compra directa.",
                deliverable: "Prototipo interactivo en Figma para versión Desktop y Mobile.",
                assignedTo: "Ezequiel Medrano",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 6"
            },
            {
                id: "fra-20",
                phaseId: "fase6",
                title: "Prototipo Web Funcional con Enlace a Métodos de Pago y Envíos",
                description: "Implementación del prototipo web mostrando opciones de pago (Efectivo, Transferencia, Código QR) y logística de envíos por encomienda nacional.",
                deliverable: "Prototipo interactivo en línea con formulario de pedido a WhatsApp.",
                assignedTo: "José Luis Vásquez",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 6"
            },

            // FASE 7: APLICACIONES & PACKAGING
            {
                id: "fra-21",
                phaseId: "fase7",
                title: "Diseño de Rótulo Principal para Puestos #354 y #357 (Portón #5)",
                description: "Diseño de fachada y letrero superior para los dos puestos contiguos frente al Hotel Palacio, destacando 'Variedades Franco: Artesanías & Cuero'.",
                deliverable: "Planos técnicos a escala y fotomontaje en el puesto real del mercado.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 6"
            },
            {
                id: "fra-22",
                phaseId: "fase7",
                title: "Diseño de Etiquetas Físicas en Cuero y Papel Kraft para Cinchos y Pecheras",
                description: "Etiquetas colgantes perforadas con cuerda de yute, con el sello grabado, código de barra/QR de WhatsApp e instrucciones de cuidado del cuero.",
                deliverable: "Diseño de troquel y arte final para imprenta en papel kraft de 300g.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 6"
            },
            {
                id: "fra-23",
                phaseId: "fase7",
                title: "Diseño de Tarjetas de Presentación con QR y Bolsa de Tela/Kraft",
                description: "Tarjetas corporativas con relieve o textura rústica para entregar a compradores mayoristas y turistas en el puesto.",
                deliverable: "Artes finales para impresión en offset y mockups de presentación.",
                assignedTo: "Marcela Castillo",
                status: "pendiente",
                priority: "media",
                deadline: "Semana 7"
            },

            // FASE 8: CONTROL DE CALIDAD & ENTREGA
            {
                id: "fra-24",
                phaseId: "fase8",
                title: "Control de Calidad, Pruebas de Impresión y Revisión con el Equipo",
                description: "Validación conjunta de legibilidad de los grabados en cuero, pruebas de color impreso en papel kraft y revisión de enlaces de WhatsApp.",
                deliverable: "Checklist de aprobación técnica firmado por el equipo de diseño.",
                assignedTo: "Trabajo Grupal (Equipo)",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 7"
            },
            {
                id: "fra-25",
                phaseId: "fase8",
                title: "Entrega de Paquete Maestro de Marca y Capacitación a Samuel Franco",
                description: "Entrega de carpeta digital completa con todos los formatos (.AI, .SVG, .PNG, .PDF, .JPG) y capacitación práctica sobre el uso de plantillas en WhatsApp y redes.",
                deliverable: "Kit de entrega final entregado y manual de bolsillo para el comerciante.",
                assignedTo: "Trabajo Grupal (Equipo)",
                status: "pendiente",
                priority: "alta",
                deadline: "Semana 7"
            }
        ]
    }
};
