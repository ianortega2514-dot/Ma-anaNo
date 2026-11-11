import type { Answers, Tramite } from "@/data/types";

const a = (answers: Answers, key: string) => answers[key] ?? "";

export const TRAMITES: Tramite[] = [
  {
    id: "empadron",
    name: "Empadronarte",
    short: "Alta o cambio de domicilio",
    blurb: "El papel que te piden antes que casi todo lo demás.",
    organism: "Ayuntamiento · Padrón",
    fee: "Gratis",
    plazo: "En ventanilla, casi siempre el mismo día.",
    tags: [
      "padron",
      "empadronamiento",
      "me mudo",
      "cambio de domicilio",
      "volante",
      "hoja padronal",
      "ayuntamiento",
      "alquiler",
      "vivo con mis padres",
    ],
    questions: [
      {
        id: "motivo",
        prompt: "¿Qué necesitas hacer?",
        options: [
          { id: "primera", label: "Darme de alta", detail: "Nunca he estado en el padrón de este municipio." },
          { id: "cambio", label: "Cambiar de domicilio", detail: "Ya estaba empadronado en otro sitio de España." },
        ],
      },
      {
        id: "vivienda",
        prompt: "¿Cómo estás en esa casa?",
        options: [
          { id: "contrato", label: "Salgo en el contrato o soy el dueño" },
          { id: "no_salgo", label: "Vivo de alquiler, pero no salgo en el contrato" },
          { id: "ajena", label: "Vivo en casa de un familiar o amigo" },
        ],
      },
      {
        id: "menores",
        prompt: "¿Empadronas también a menores?",
        options: [
          { id: "no", label: "No, solo a adultos" },
          { id: "si", label: "Sí, hay menores" },
        ],
      },
      {
        id: "clave",
        prompt: "¿Tienes Cl@ve o certificado digital?",
        hint: "Solo cambia si puedes intentarlo por internet. El padrón en sí no lo pide siempre.",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "No" },
        ],
      },
    ],
    docs: [
      {
        id: "identidad",
        label: "DNI, NIE o pasaporte en vigor",
        why: "Caducado es el motivo más tonto para repetir la visita.",
      },
      {
        id: "titulo",
        label: "Contrato o escritura donde sales tú",
        why: "Tiene que verse tu nombre y la misma dirección que vas a declarar.",
        when: (answers) => a(answers, "vivienda") === "contrato",
      },
      {
        id: "autorizacion",
        label: "Autorización del titular, su DNI y una factura reciente",
        why: "La factura (luz, agua o gas) debe estar a nombre de quien autoriza, y no ser antigua. Muchos ayuntamientos piden menos de 3 meses.",
        when: (answers) => a(answers, "vivienda") !== "contrato",
      },
      {
        id: "menores",
        label: "Libro de familia o certificado de nacimiento",
        why: "Sin esto no inscriben a los menores, aunque tú sí salgas en la hoja.",
        when: (answers) => a(answers, "menores") === "si",
      },
      {
        id: "cita",
        label: "Cita del ayuntamiento",
        why: "Hay ciudades que atienden sin cita y otras que ni te abren la puerta. Míralo antes de ir.",
        blocking: false,
      },
    ],
    online: {
      title: "Sede del ayuntamiento",
      where: "La web de tu ayuntamiento, no una sede nacional",
      time: "Si está abierto, el mismo día",
      note: "Solo vale si tu ayuntamiento lo ofrece y entras con Cl@ve o certificado. No todos lo tienen.",
      fit: (answers) => (a(answers, "clave") === "si" ? "best" : "no"),
    },
    desk: {
      title: "Oficina del padrón",
      where: "Ayuntamiento, con cita si la piden",
      time: "Una visita",
      note: "Sales con el volante en el momento en la mayoría de las ciudades.",
      fit: (answers) => (a(answers, "clave") === "si" ? "ok" : "best"),
    },
    steps: [
      { title: "Junta el papel de la vivienda", detail: "Contrato a tu nombre, o autorización más factura del titular." },
      { title: "Mira si tu ayuntamiento cita online", detail: "Busca «padrón» en la sede de tu municipio." },
      { title: "Date de alta", detail: "Si vienes de otro municipio, no pidas la baja allí: el alta nueva ya lo comunica." },
      { title: "Pide el volante", detail: "Te lo van a reclamar para el médico, el colegio o extranjería." },
    ],
    rejections: [
      { title: "La dirección no coincide", detail: "Un número de portal, un piso o una letra distintos del contrato y ya está." },
      { title: "La factura no sirve", detail: "Está a nombre de otra persona, o es de hace medio año." },
      { title: "Falta un adulto", detail: "Algunos ayuntamientos quieren a todos los mayores de edad, o su autorización firmada." },
    ],
    script: (answers) => [
      a(answers, "motivo") === "cambio"
        ? "Vengo a cambiar el padrón a esta dirección. Vengo de otro municipio."
        : "Vengo a darme de alta en el padrón en esta dirección.",
      a(answers, "vivienda") === "contrato"
        ? "Traigo el contrato (o la escritura) donde aparezco yo."
        : "No estoy en el contrato. Traigo la autorización del titular, su DNI y una factura a su nombre.",
      "No tengo que darme de baja en el ayuntamiento anterior.",
      a(answers, "menores") === "si" ? "También empadrono a los menores. Traigo el libro de familia." : "Solo me empadrono yo.",
    ],
    warnings: (answers) =>
      a(answers, "motivo") === "cambio"
        ? ["En España ya no hace falta pasar por el ayuntamiento viejo para darte de baja."]
        : [],
    goHeadline: "Puedes empadronarte",
  },
  {
    id: "dni",
    name: "Renovar el DNI",
    short: "Cita, tasa y el día de la comisaría",
    blurb: "No se hace por internet. La cita sí. El día de la cita, no.",
    organism: "Policía Nacional",
    fee: "Hay tasa. El importe sale al reservar la cita. Con denuncia por robo, pregunta: a menudo no se cobra.",
    plazo: "El mismo día de la cita sales con el resguardo. La tarjeta física puede tardar unas semanas si no te la dan al momento.",
    tags: [
      "dni",
      "renovar dni",
      "se me caduca",
      "dni caducado",
      "documento nacional",
      "policia",
      "comisaria",
      "robo del dni",
      "cita dni",
    ],
    officialUrl: "https://www.citapreviadnie.es",
    officialLabel: "Cita previa DNI · Policía",
    questions: [
      {
        id: "motivo",
        prompt: "¿Por qué lo renuevas?",
        options: [
          { id: "caducidad", label: "Caduca o ya caducó" },
          { id: "robo", label: "Me lo robaron o lo perdí" },
          { id: "deterioro", label: "Está estropeado" },
          { id: "cambio", label: "Quiero cambiar el domicilio del DNI" },
        ],
      },
    ],
    docs: [
      {
        id: "cita",
        label: "Cita a tu nombre",
        why: "Sin cita, la oficina de expedición normalmente no te atiende. También puedes llamar al 060. Ten el DNI delante: piden número y letra, fecha de validez, número de soporte y el equipo de expedición (detrás).",
      },
      {
        id: "foto",
        label: "Foto tamaño carné, 32 × 26 mm, fondo blanco",
        why: "Reciente. Llévala aunque hayas leído que te la hacen allí: si esa oficina la pide y no la traes, repites cita.",
      },
      {
        id: "anterior",
        label: "El DNI anterior, aunque esté caducado",
        why: "Es la pieza que identifica el expediente. Caducado sí vale. Desaparecido, no: entonces toca denuncia.",
        when: (answers) => a(answers, "motivo") !== "robo",
      },
      {
        id: "denuncia",
        label: "Denuncia de robo o extravío",
        why: "Sin el DNI y sin denuncia no hay renovación. La pones en policía o Guardia Civil antes de la cita.",
        when: (answers) => a(answers, "motivo") === "robo",
      },
      {
        id: "padron",
        label: "Certificado de empadronamiento reciente",
        why: "Si el domicilio del carné cambia, suelen pedirlo de los últimos meses.",
        when: (answers) => a(answers, "motivo") === "cambio",
      },
      {
        id: "tasa",
        label: "Justificante de la tasa, si ya la pagaste al reservar",
        why: "Si no la pagaste online, lleva tarjeta. No hace falta imprimir un formulario raro.",
        blocking: false,
      },
    ],
    online: {
      title: "Solo la cita",
      where: "citapreviadnie.es o el 060",
      time: "Unos minutos, si hay hueco",
      note: "El DNI no se renueva desde el sofá. Por internet solo se reserva. Desconfía de webs que te cobren por «conseguírtela».",
      fit: () => "no",
    },
    desk: {
      title: "Oficina de expedición",
      where: "La comisaría o equipo que salga en tu cita",
      time: "La cita en sí es corta",
      note: "Ve a esa oficina, no a otra. Lleva el resguardo de la cita.",
      fit: () => "best",
    },
    steps: [
      { title: "Pide cita en el canal oficial", detail: "citapreviadnie.es o el 060. Gratis. Nadie puede venderte la cita." },
      { title: "Prepara foto y el carné viejo", detail: "Si te lo robaron, la denuncia sustituye al carné." },
      { title: "Paga la tasa", detail: "Al reservar, o con tarjeta el mismo día." },
      { title: "Acude y revisa los datos", detail: "Nombre, domicilio y firma antes de levantarte. Corregirlo después es otra cita." },
    ],
    rejections: [
      { title: "Cita que no es tuya", detail: "O de otra oficina. Ese día no te expiden nada." },
      { title: "Foto que no cumple", detail: "Fondo gris, gorra, foto antigua o tamaño de pasaporte cuando piden carné." },
      { title: "Datos de la cita mal copiados", detail: "El número de soporte y el equipo de expedición están en el carné. Si el DNI es permanente, la validez se escribe PERMANENTE, no una fecha." },
    ],
    script: (answers) => [
      "Tengo cita para renovar el DNI.",
      a(answers, "motivo") === "robo"
        ? "Me lo robaron. Traigo la denuncia, no el carné."
        : "Traigo el DNI anterior y la fotografía.",
      a(answers, "motivo") === "cambio"
        ? "Quiero que el domicilio del DNI coincida con este padrón."
        : "Es una renovación por caducidad o deterioro, sin cambio de datos.",
      "¿Me confirma que los datos en pantalla están bien antes de cerrar?",
    ],
    warnings: (answers) => {
      const notes = [
        "Las citas se agotan. No esperes a la semana en que caduca.",
      ];
      if (a(answers, "motivo") === "cambio") {
        notes.push("Si todavía no estás empadronado en la dirección nueva, haz primero el padrón.");
      }
      return notes;
    },
    goHeadline: "Puedes ir a la cita",
  },
  {
    id: "extranjeria",
    name: "NIE o tarjeta de extranjería",
    short: "Asignación de NIE, huellas o renovación",
    blurb: "La cita de huellas no es el primer paso. Si vas antes de tiempo, te devuelven.",
    organism: "Policía · Extranjería",
    fee: "Hay tasa (modelo 790). El código depende del trámite: en la toma de huellas de la TIE suele ser el 012. Una tasa con el código mal puesto no vale.",
    plazo: "El día de las huellas no te llevas la tarjeta. Te dan un resguardo. La tarjeta tarda semanas.",
    tags: [
      "nie",
      "tie",
      "extranjeria",
      "huellas",
      "tarjeta de residencia",
      "extranjero",
      "cita policia",
      "renovar nie",
      "residencia",
    ],
    officialUrl: "https://sede.administracionespublicas.gob.es",
    officialLabel: "Sede de administraciones públicas",
    questions: [
      {
        id: "objetivo",
        prompt: "¿Qué necesitas de verdad?",
        options: [
          { id: "nie", label: "Un NIE, todavía no una tarjeta", detail: "Número para un trámite, sin residencia." },
          { id: "huellas", label: "La cita de huellas", detail: "Ya tengo (o espero) una resolución de residencia." },
          { id: "renueva", label: "Renovar la tarjeta", detail: "La TIE caduca o está a punto." },
        ],
      },
      {
        id: "resolucion",
        prompt: "¿La resolución favorable ya está concedida?",
        when: (answers) => a(answers, "objetivo") !== "nie",
        options: [
          { id: "si", label: "Sí, ya me la han concedido" },
          { id: "pendiente", label: "La he pedido, aún no hay resolución" },
          { id: "no", label: "Todavía no he presentado la renovación o la solicitud" },
        ],
      },
    ],
    docs: [
      {
        id: "pasaporte",
        label: "Pasaporte en vigor",
        why: "Original. Si le queda muy poca validez, pregunta antes: hay oficinas que ponen pegas.",
      },
      {
        id: "cita",
        label: "Cita de la oficina que te corresponde",
        why: "Extranjería va por provincia. Una cita de otra ciudad no te sirve.",
      },
      {
        id: "ex15",
        label: "Impreso EX-15 y el motivo (contrato, banco, operación)",
        why: "El NIE no se pide «por si acaso». Hace falta una razón concreta, por escrito.",
        when: (answers) => a(answers, "objetivo") === "nie",
      },
      {
        id: "resolucion",
        label: "Resolución favorable",
        why: "Si todavía no está grabada en el sistema de esa comisaría, pueden no tomarte huellas aunque lleves el PDF.",
        when: (answers) => a(answers, "objetivo") !== "nie",
      },
      {
        id: "ex17",
        label: "Impreso EX-17",
        why: "Es la solicitud de la tarjeta, distinta del papel de la resolución.",
        when: (answers) => a(answers, "objetivo") !== "nie",
      },
      {
        id: "tasa",
        label: "Tasa 790 pagada, con el código que toca",
        why: "Revisa el código antes de pagar. Una tasa de otro procedimiento es dinero tirado.",
        when: (answers) => a(answers, "objetivo") !== "nie",
      },
      {
        id: "tasa_nie",
        label: "Tasa pagada del procedimiento de asignación de NIE",
        why: "No es la misma que la de la tarjeta. Quédate el justificante.",
        when: (answers) => a(answers, "objetivo") === "nie",
      },
      {
        id: "padron",
        label: "Empadronamiento de los últimos 3 meses",
        why: "En huellas y renovaciones lo piden casi siempre. Si es más viejo, te mandan a sacarlo otra vez.",
        when: (answers) => a(answers, "objetivo") !== "nie",
      },
      {
        id: "foto",
        label: "Foto tamaño carné reciente",
        why: "Fondo blanco. Algunas oficinas la hacen ellas; no apuestes a que la tuya sea de esas.",
        blocking: false,
      },
    ],
    online: {
      title: "Presentar por sede, no las huellas",
      where: "Sede de extranjería o de administraciones públicas",
      time: "La solicitud sí puede salir online",
      note: "Las huellas y la tarjeta son presenciales. Lo que a veces es online es presentar la renovación o pedir la cita.",
      fit: (answers) => (a(answers, "objetivo") === "renueva" ? "ok" : "no"),
    },
    desk: {
      title: "Comisaría o brigada de extranjería",
      where: "La provincia donde estás empadronado o donde te citan",
      time: "Una cita. La tarjeta, semanas después",
      note: "Guarda el resguardo: es lo que acredita que estás en trámite mientras llega el plástico.",
      fit: () => "best",
    },
    steps: [
      { title: "Aclara si es NIE o tarjeta", detail: "Son trámites distintos, con tasas distintas." },
      { title: "Si es renovación, preséntala antes", detail: "Muchas autorizaciones hay que iniciarlas unos 60 días antes de que caduquen. Las huellas vienen después de la resolución." },
      { title: "Paga la tasa correcta y pide cita", detail: "Código mal = volver otro día." },
      { title: "El día de huellas, no esperes la tarjeta", detail: "Sales con resguardo. Apunta cómo consultar cuándo recogerla." },
    ],
    rejections: [
      { title: "Resolución que «aún no consta»", detail: "Llevas el PDF, pero la comisaría no la ve en su sistema." },
      { title: "Padrón viejo", detail: "De hace más de tres meses, o de otra dirección." },
      { title: "Tasa con el código equivocado", detail: "El más típico entre quien rellena el 790 a mano." },
    ],
    script: (answers) => [
      a(answers, "objetivo") === "nie"
        ? "Vengo a la asignación de NIE. Traigo el EX-15, el pasaporte y el motivo."
        : "Vengo a la toma de huellas. Traigo la resolución favorable, el EX-17 y la tasa.",
      "Estoy empadronado en esta provincia.",
      "¿El resguardo me sirve mientras llega la tarjeta?",
      a(answers, "objetivo") === "renueva"
        ? "La renovación ya está concedida. No vengo a presentarla hoy."
        : "La cita es de esta oficina.",
    ],
    warnings: (answers) => {
      const notes = ["Esto cambia por provincia. El sello comprueba el paquete habitual, no te reserva la cita."];
      if (a(answers, "objetivo") === "renueva") {
        notes.push("Renovar no es presentarte a que te hagan una foto. Primero la solicitud, luego la resolución, luego las huellas.");
      }
      return notes;
    },
    hardStop: (answers) => {
      if (a(answers, "objetivo") === "nie") return null;
      if (a(answers, "resolucion") === "no") {
        return {
          level: "back",
          headline: "Aún no toca ir",
          reason:
            "Sin haber presentado la solicitud, la cita de huellas no sirve. Primero se pide la autorización o la renovación. Cuando haya resolución favorable, vuelves aquí y preparas las huellas.",
        };
      }
      if (a(answers, "resolucion") === "pendiente") {
        return {
          level: "almost",
          headline: "Espera la resolución",
          reason:
            "Si todavía no está concedida y grabada, lo normal es que te digan que vuelvas. Puedes llevar el resguardo de la presentación, pero no cuentes con que te tomen huellas.",
        };
      }
      return null;
    },
    goHeadline: "El paquete está completo",
  },
  {
    id: "autonomo",
    name: "Darte de alta de autónomo",
    short: "Hacienda y Seguridad Social, en ese orden",
    blurb: "El error caro es empezar a trabajar y darte de alta «hacia atrás».",
    organism: "AEAT y Seguridad Social",
    fee: "El alta no lleva una tasa de ventanilla. La cuota sí: si te corresponde la tarifa plana, en 2026 son 80 € al mes el primer año (un poco más con el MEI) y hay que pedirla al darte de alta. Si has sido autónomo hace poco, puede que no te toque.",
    plazo: "El alta en la Seguridad Social puede hacerse hasta 60 días antes del inicio, y nunca después de haber empezado.",
    tags: [
      "autonomo",
      "autonomos",
      "alta reta",
      "hacerme autonomo",
      "modelo 036",
      "modelo 037",
      "seguridad social",
      "tarifa plana",
      "cuota",
    ],
    officialUrl: "https://sede.agenciatributaria.gob.es",
    officialLabel: "Sede de la Agencia Tributaria",
    questions: [
      {
        id: "vuelta",
        prompt: "¿Es tu primera vez?",
        options: [
          { id: "primera", label: "Nunca he sido autónomo, o hace más de dos años" },
          { id: "repite", label: "He sido autónomo hace poco" },
        ],
      },
      {
        id: "lugar",
        prompt: "¿Dónde vas a trabajar?",
        options: [
          { id: "casa", label: "Desde casa, sin local abierto al público" },
          { id: "local", label: "En un local, tienda o sitio donde entra gente" },
        ],
      },
      {
        id: "colegio",
        prompt: "¿Tu oficio exige colegio profesional?",
        hint: "Abogacía, medicina, arquitectura y otros sí. Un diseñador o una tienda, normalmente no.",
        options: [
          { id: "no", label: "No" },
          { id: "si", label: "Sí, o no estoy seguro" },
        ],
      },
      {
        id: "clave",
        prompt: "¿Tienes Cl@ve o certificado digital?",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "ya",
        prompt: "¿Ya has facturado o empezado el trabajo?",
        options: [
          { id: "no", label: "No. La fecha de inicio será hoy o un día futuro" },
          { id: "si", label: "Sí. Llevo días o semanas trabajando sin alta" },
        ],
      },
    ],
    docs: [
      {
        id: "identidad",
        label: "DNI o NIE en vigor",
        why: "El mismo número que vas a poner en Hacienda y en la Seguridad Social.",
      },
      {
        id: "nss",
        label: "Número de la Seguridad Social",
        why: "Si nunca has cotizado, primero hay que afiliarte. Se pide en Importass o en la Tesorería.",
      },
      {
        id: "epigrafe",
        label: "Epígrafe: a qué te dedicas, con su código",
        why: "«Hago un poco de todo» no cabe en el 036. Elige la actividad principal antes de sentarte a rellenarlo.",
      },
      {
        id: "iban",
        label: "IBAN para pasar la cuota",
        why: "La Seguridad Social la domicilia. Sin cuenta, el alta se atasca.",
      },
      {
        id: "local",
        label: "Licencia o declaración responsable del ayuntamiento",
        why: "Abrir un local al público sin este papel es otro expediente, y puede pararte el negocio.",
        when: (answers) => a(answers, "lugar") === "local",
      },
      {
        id: "colegio",
        label: "Alta en el colegio profesional",
        why: "Si tu actividad está colegiada, Hacienda y el colegio tienen que cuadrar.",
        when: (answers) => a(answers, "colegio") === "si",
      },
      {
        id: "clave",
        label: "Cl@ve o certificado",
        why: "Sin esto el alta online no entra. Toca cita presencial en AEAT y en la Tesorería.",
        when: (answers) => a(answers, "clave") === "no",
        blocking: false,
      },
    ],
    online: {
      title: "036/037 y luego Importass",
      where: "Sede de la Agencia Tributaria y el portal Importass",
      time: "El mismo día, si la identificación funciona",
      note: "Orden: primero Hacienda, con fecha de inicio de hoy o futura. Después el alta en el RETA, ese mismo día o antes, nunca después.",
      fit: (answers) => (a(answers, "clave") === "si" ? "best" : "no"),
    },
    desk: {
      title: "Cita en AEAT y en la Tesorería",
      where: "Agencia Tributaria y Seguridad Social",
      time: "Dos citas, a veces más",
      note: "Sirve, pero es más lento. El orden es el mismo: Hacienda antes de empezar, Seguridad Social antes de empezar.",
      fit: (answers) => (a(answers, "clave") === "si" ? "ok" : "best"),
    },
    steps: [
      { title: "Elige la fecha de inicio", detail: "Hoy o más adelante. Nunca un día en el que ya trabajaste." },
      { title: "Presenta el 036 o el 037", detail: "En la sede de la Agencia Tributaria. Ahí va el epígrafe y la fecha." },
      { title: "Date de alta en el RETA", detail: "En Importass, antes o el mismo día del inicio. Pide la tarifa plana en ese momento si te corresponde." },
      { title: "Si hay local, el ayuntamiento va aparte", detail: "La declaración responsable o la licencia no salen solas con el alta de Hacienda." },
    ],
    rejections: [
      { title: "Fecha de inicio en el pasado", detail: "Eso no es un alta: es un alta fuera de plazo, con recargo." },
      { title: "Fechas que no coinciden", detail: "Un día en Hacienda y otro distinto en la Seguridad Social, sin darte cuenta." },
      { title: "Epígrafe inventado", detail: "Luego no puedes facturar lo que de verdad haces, o facturas algo que no diste de alta." },
    ],
    script: () => [
      "Quiero el alta censal. La fecha de inicio es hoy (o esta fecha futura).",
      "Después daré el alta en el RETA con la misma fecha.",
      "¿Este epígrafe cubre lo que voy a facturar?",
      "Quiero solicitar la tarifa plana ahora, si cumplo los requisitos.",
    ],
    warnings: (answers) => {
      const notes: string[] = [];
      if (a(answers, "vuelta") === "repite") {
        notes.push("La tarifa plana pide, en general, no haber estado de alta en los 2 años anteriores (3 si ya la disfrutaste).");
      }
      if (a(answers, "lugar") === "local") {
        notes.push("El alta de autónomo no abre el local. El ayuntamiento es otro trámite.");
      }
      return notes;
    },
    hardStop: (answers) =>
      a(answers, "ya") === "si"
        ? {
            level: "back",
            headline: "No lo fechen atrás",
            reason:
              "Si ya has trabajado o facturado, un alta con fecha del mes pasado no se admite como si nada. Date de alta con fecha de hoy y que un gestor te diga cómo regularizar lo anterior. Seguir sin alta sale más caro.",
          }
        : null,
    readyNote: (answers) =>
      a(answers, "clave") === "no"
        ? "Los papeles los tienes, pero sin Cl@ve te tocan citas presenciales. Conseguir Cl@ve antes suele ser más rápido que esperar dos mostradores."
        : null,
    goHeadline: "Puedes darte de alta",
  },
  {
    id: "sanitaria",
    name: "Tarjeta sanitaria",
    short: "Médico de cabecera en tu comunidad",
    blurb: "Sin padrón en esa comunidad, el centro de salud no tiene dónde colgarte.",
    organism: "Servicio de salud de tu comunidad",
    fee: "Gratis",
    plazo: "Con el alta de la Seguridad Social en regla, a menudo el mismo día en el centro de salud. Si no has cotizado nunca, el reconocimiento del derecho tarda más.",
    tags: [
      "medico",
      "tarjeta sanitaria",
      "centro de salud",
      "cabecera",
      "seguridad social",
      "sip",
      "catsalut",
      "sermas",
      "sas",
      "osakidetza",
    ],
    questions: [
      {
        id: "situacion",
        prompt: "¿Cuál es tu situación ahora?",
        options: [
          { id: "trabajo", label: "Trabajo por cuenta ajena" },
          { id: "autonomo", label: "Estoy de autónomo" },
          { id: "paro", label: "Estoy en paro o con prestación" },
          { id: "ninguna", label: "Ahora mismo no trabajo ni cobro prestación" },
        ],
      },
      {
        id: "padron",
        prompt: "¿Estás empadronado donde quieres el médico?",
        options: [
          { id: "si", label: "Sí, en este municipio" },
          { id: "no", label: "No, o el padrón es de otra comunidad" },
        ],
      },
    ],
    docs: [
      {
        id: "identidad",
        label: "DNI, NIE o pasaporte en vigor",
        why: "El centro de salud lo pide siempre, también si vienes de otra comunidad.",
      },
      {
        id: "padron",
        label: "Volante de empadronamiento",
        why: "De este municipio. Es lo que asigna el centro, no solo el derecho.",
        when: (answers) => a(answers, "padron") === "si",
      },
      {
        id: "alta",
        label: "Documento de alta o afiliación en la Seguridad Social",
        why: "Contrato, alta de autónomo o resolución. Sin número de afiliación, el sistema no te encuentra.",
        when: (answers) => ["trabajo", "autonomo", "paro"].includes(a(answers, "situacion")),
      },
      {
        id: "nss",
        label: "Número de la Seguridad Social",
        why: "Si no lo tienes apuntado, se consulta en Importass antes de ir al centro.",
        when: (answers) => a(answers, "situacion") !== "ninguna",
      },
    ],
    online: {
      title: "Sede del servicio de salud",
      where: "La web de tu comunidad, con Cl@ve",
      time: "A veces el mismo día",
      note: "Unas comunidades dejan pedir la tarjeta online y otras solo asignan médico en el mostrador del centro.",
      fit: () => "ok",
    },
    desk: {
      title: "Centro de salud que te toca por domicilio",
      where: "El del barrio donde estás empadronado",
      time: "Una visita de ventanilla",
      note: "No vale «el que me pilla de paso». Va por domicilio del padrón.",
      fit: () => "best",
    },
    steps: [
      { title: "Empadrónate si no lo estás", detail: "Es el trámite de antes. Sin eso, este no arranca." },
      { title: "Ten el número de la Seguridad Social", detail: "Si trabajas o estás de alta, debe constar el alta." },
      { title: "Pide la asignación en tu centro", detail: "O en la sede de tu servicio de salud, si lo permite." },
      { title: "Si no cotizas, pide el reconocimiento", detail: "No es la misma ventanilla mental: es el derecho por residencia, no el alta de trabajador." },
    ],
    rejections: [
      { title: "Padrón de otra comunidad", detail: "El centro no te asigna médico con un volante de otra ciudad." },
      { title: "Alta que todavía no consta", detail: "El contrato es de ayer y la Seguridad Social aún no lo tiene cargado." },
      { title: "Ir al ambulatorio equivocado", detail: "Te mandan al que corresponde a la calle del padrón." },
    ],
    script: (answers) => [
      "Quiero la tarjeta sanitaria y médico de cabecera.",
      "Estoy empadronado en esta dirección. Traigo el volante.",
      a(answers, "situacion") === "ninguna"
        ? "Ahora no trabajo. Quiero que revisen el derecho a la asistencia por residencia."
        : "Traigo el documento de alta en la Seguridad Social.",
      "¿Me pueden decir qué centro me corresponde?",
    ],
    warnings: (answers) =>
      a(answers, "situacion") === "ninguna"
        ? [
            "Sin trabajo no es un «no» automático. Quien reside en España puede pedir el reconocimiento del derecho, pero el camino no es el alta de un contrato.",
          ]
        : [],
    hardStop: (answers) =>
      a(answers, "padron") === "no"
        ? {
            level: "back",
            headline: "Primero el padrón",
            reason:
              "Sin empadronamiento en esta comunidad no hay tarjeta aquí. Haz el padrón (está en el mostrador) y vuelve con el volante.",
          }
        : null,
    goHeadline: "Puedes pedirla",
  },
  {
    id: "paro",
    name: "Pedir el paro",
    short: "Prestación contributiva del SEPE",
    blurb: "La baja voluntaria no se arregla con más formularios.",
    organism: "SEPE",
    fee: "Gratis",
    plazo: "15 días hábiles desde la situación legal de desempleo. Si la empresa paga vacaciones no disfrutadas, el plazo empieza cuando acaban esas vacaciones.",
    tags: [
      "paro",
      "sepe",
      "prestacion",
      "desempleo",
      "me han despedido",
      "fin de contrato",
      "subsidio",
      "demandante de empleo",
    ],
    officialUrl: "https://sede.sepe.gob.es",
    officialLabel: "Sede electrónica del SEPE",
    questions: [
      {
        id: "causa",
        prompt: "¿Cómo terminó el trabajo?",
        options: [
          { id: "despido", label: "Despido" },
          { id: "fin", label: "Se acabó el contrato" },
          { id: "ere", label: "ERE o fin por causa de la empresa" },
          { id: "voluntaria", label: "Me fui yo (baja voluntaria)" },
        ],
      },
      {
        id: "dias",
        prompt: "¿Has cotizado al menos 360 días en los últimos 6 años?",
        hint: "Si no llegas, no es esta prestación. Puede haber un subsidio, que es otro trámite.",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "No" },
          { id: "no_se", label: "No lo sé" },
        ],
      },
      {
        id: "plazo",
        prompt: "¿Sigues dentro de los 15 días hábiles?",
        options: [
          { id: "dentro", label: "Sí, acabo de quedarme sin empleo" },
          { id: "fuera", label: "Ya han pasado más de 15 días hábiles" },
          { id: "vacaciones", label: "Me están pagando vacaciones no disfrutadas" },
        ],
      },
      {
        id: "demanda",
        prompt: "¿Estás inscrito como demandante de empleo?",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "Todavía no" },
        ],
      },
      {
        id: "clave",
        prompt: "¿Tienes Cl@ve o certificado para entrar en el SEPE?",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "No" },
        ],
      },
    ],
    docs: [
      {
        id: "identidad",
        label: "DNI o NIE en vigor",
        why: "Tiene que coincidir con el de la Seguridad Social y el del banco.",
      },
      {
        id: "iban",
        label: "IBAN de una cuenta a tu nombre",
        why: "El SEPE no ingresa en una cuenta de otra persona.",
      },
      {
        id: "empresa",
        label: "Certificado de empresa",
        why: "Lo normal es que la empresa lo envíe sola por Certific@2. Si a los pocos días no consta, reclámaselo: sin eso el expediente se para.",
        blocking: false,
      },
      {
        id: "cierre",
        label: "Papel del cese: carta de despido, finiquito o fin de contrato",
        why: "Acredita que el trabajo terminó y cómo. No es lo mismo que el certificado de empresa.",
      },
      {
        id: "demanda",
        label: "Alta como demandante de empleo",
        why: "Se hace en el servicio de empleo, a menudo online, y tiene que estar activa.",
        when: (answers) => a(answers, "demanda") !== "si",
      },
      {
        id: "vida",
        label: "Informe de vida laboral",
        why: "Si no sabes si llegas a 360 días, míralo antes de pedir una prestación que no toca. Sale en Importass.",
        when: (answers) => a(answers, "dias") === "no_se",
      },
    ],
    online: {
      title: "Sede del SEPE",
      where: "sede.sepe.gob.es",
      time: "La solicitud, en un rato",
      note: "Entra con Cl@ve o certificado, prestación contributiva, y revisa a los días que el certificado de empresa conste.",
      fit: (answers) => (a(answers, "clave") === "si" ? "best" : "no"),
    },
    desk: {
      title: "Oficina del SEPE con cita",
      where: "La oficina que te corresponda, cita en la sede o en el 060",
      time: "Una cita",
      note: "Si no tienes Cl@ve, este es el camino. Lleva los mismos papeles.",
      fit: (answers) => (a(answers, "clave") === "si" ? "ok" : "best"),
    },
    steps: [
      { title: "Confirma que no fue baja voluntaria", detail: "Y que llegas a 360 días cotizados en seis años." },
      { title: "Inscríbete como demandante", detail: "Antes o a la vez. Sin demanda activa no hay prestación." },
      { title: "Presenta dentro de plazo", detail: "15 días hábiles. Ni sábados ni festivos cuentan igual que un día natural." },
      { title: "Vigila el certificado de empresa", detail: "Si no entra, el SEPE te requerirá y el cobro se retrasa." },
    ],
    rejections: [
      { title: "Baja voluntaria", detail: "No da prestación contributiva, salvo casos muy concretos que valora el SEPE." },
      { title: "Fuera de plazo", detail: "No siempre lo deniegan entero, pero se pierden los días que te retrasaste." },
      { title: "Demanda caducada", detail: "Inscribirse una vez no basta: hay que mantenerla." },
    ],
    script: (answers) => [
      "Quiero solicitar la prestación contributiva por desempleo.",
      a(answers, "causa") === "fin"
        ? "El contrato terminó. No es una baja voluntaria."
        : "El cese fue por decisión de la empresa, no mía.",
      "Estoy inscrito como demandante de empleo.",
      "¿Consta ya el certificado de empresa?",
    ],
    warnings: (answers) => {
      const notes = [
        "Si te pagan vacaciones no disfrutadas, los 15 días hábiles empiezan cuando terminan esas vacaciones.",
      ];
      if (a(answers, "plazo") === "fuera") {
        notes.push("Presenta igualmente cuanto antes. El retraso suele costar días de prestación, no siempre el derecho entero.");
      }
      if (a(answers, "plazo") === "vacaciones") {
        notes.push("Todavía no empieza tu plazo. Apunta el día en que acaban las vacaciones pagadas y cuenta 15 días hábiles desde ahí.");
      }
      return notes;
    },
    hardStop: (answers) => {
      if (a(answers, "causa") === "voluntaria") {
        return {
          level: "back",
          headline: "Así no hay paro",
          reason:
            "La baja voluntaria no da derecho a la prestación contributiva. Ir con el formulario relleno no cambia la causa. El SEPE puede mirar un caso muy concreto, pero no cuentes con ella. Un subsidio, si encajara, sería otro trámite.",
        };
      }
      if (a(answers, "dias") === "no") {
        return {
          level: "back",
          headline: "No llegas a esta",
          reason:
            "Sin 360 días cotizados en los últimos seis años no toca la prestación contributiva. Pide la vida laboral para asegurarte y pregunta en el SEPE por un subsidio: requisitos distintos, papeles distintos.",
        };
      }
      return null;
    },
    goHeadline: "Puedes solicitarla",
  },
  {
    id: "itv",
    name: "Pasar la ITV",
    short: "Coche, moto o furgoneta",
    blurb: "Caducada no significa que puedas circular. Solo ir a la estación, con cita, y directo.",
    organism: "Estación ITV de tu comunidad",
    fee: "La pone tu comunidad. Cambia según el vehículo. Te la cobran en la estación.",
    plazo: "Antes de que caduque la pegatina. Si ya caducó, pide cita y no uses el coche para otra cosa.",
    tags: [
      "itv",
      "inspeccion tecnica",
      "coche",
      "pegatina",
      "itv caducada",
      "moto",
      "ficha tecnica",
    ],
    questions: [
      {
        id: "estado",
        prompt: "¿Cómo está la ITV ahora?",
        options: [
          { id: "vigente", label: "En vigor, quiero adelantarla o me toca ya" },
          { id: "caduca", label: "Caduca en las próximas semanas" },
          { id: "caducada", label: "Ya está caducada" },
        ],
      },
    ],
    docs: [
      {
        id: "permiso",
        label: "Permiso de circulación",
        why: "Original. Una foto en el móvil no siempre les vale.",
      },
      {
        id: "ficha",
        label: "Ficha técnica (tarjeta de ITV)",
        why: "Es el papel donde constan las inspecciones anteriores, no el permiso de conducir.",
      },
      {
        id: "seguro",
        label: "Seguro del vehículo en vigor",
        why: "Lo comprueban. Sin seguro pueden no inspeccionar, y circular así es sancionable.",
      },
      {
        id: "cita",
        label: "Cita en la estación",
        why: "Hay estaciones que aceptan sin cita y otras que no. Con la ITV caducada, la cita además justifica el desplazamiento.",
        blocking: false,
      },
    ],
    online: {
      title: "Solo para pedir cita",
      where: "La web de ITV de tu comunidad",
      time: "Unos minutos",
      note: "La inspección es siempre con el vehículo delante. No existe un «pase online».",
      fit: () => "no",
    },
    desk: {
      title: "La estación, con el coche",
      where: "Cualquier estación autorizada de tu comunidad, salvo que tu cita fije una",
      time: "Suele ser menos de una hora",
      note: "Revisa luces, limpiaparabrisas, matrícula y testigos del salpicadero antes de entrar.",
      fit: () => "best",
    },
    steps: [
      { title: "Mira la fecha de la pegatina", detail: "El mes que marca es el último en el que puedes circular con la ITV en regla." },
      { title: "Confirma el seguro", detail: "Un recibo impagado cuenta como sin seguro." },
      { title: "Pide cita y ve directo", detail: "Si está caducada, el trayecto es hasta la estación, no al trabajo ni al súper." },
      { title: "Si es desfavorable, no circules", detail: "Salvo para el taller y volver a la estación, en el plazo que te den." },
    ],
    rejections: [
      { title: "Luces o intermitentes", detail: "Lo más fácil de mirar en casa y lo que más suspende." },
      { title: "Neumáticos", detail: "Dibujo por debajo del mínimo, o medidas que no salen en la ficha." },
      { title: "Fuga, humo o testigo encendido", detail: "Motor, gases o airbag. Eso no se discute en ventanilla." },
    ],
    script: () => [
      "Vengo a pasar la inspección periódica. Tengo cita.",
      "Traigo el permiso de circulación y la ficha técnica.",
      "El seguro está en vigor.",
      "Si falta algo leve, ¿me decís si puedo volver hoy o hace falta otra cita?",
    ],
    warnings: (answers) =>
      a(answers, "estado") === "caducada"
        ? [
            "Con la ITV caducada solo deberías circular para ir a la estación, con cita, por el camino directo. No es un permiso para seguir usando el coche.",
          ]
        : ["Puedes pasar la ITV hasta 30 días antes de que caduque sin perder días: la próxima fecha se cuenta desde la caducidad, no desde el día que vas."],
    goHeadline: "Puedes pasarla",
  },
  {
    id: "clave",
    name: "Conseguir Cl@ve o el certificado",
    short: "La llave del resto de trámites",
    blurb: "Un rato incómodo ahora. Después, el padrón, el paro y Hacienda sin cola.",
    organism: "Cl@ve · FNMT · AEAT",
    fee: "Gratis",
    plazo: "Con los datos de la renta, a veces el mismo día. Con cita presencial, cuando haya hueco, y activas la clave al salir.",
    tags: [
      "clave",
      "clave pin",
      "clave permanente",
      "certificado digital",
      "fnmt",
      "certificado",
      "no puedo entrar en la sede",
      "firma electronica",
    ],
    officialUrl: "https://clave.gob.es",
    officialLabel: "clave.gob.es",
    questions: [
      {
        id: "cual",
        prompt: "¿Qué quieres conseguir?",
        options: [
          { id: "pin", label: "Cl@ve PIN", detail: "Para entrar de vez en cuando con un código." },
          { id: "permanente", label: "Cl@ve permanente", detail: "Usuario y contraseña, más un SMS." },
          { id: "fnmt", label: "Certificado digital de la FNMT", detail: "El archivo que caduca a los pocos años. Hace falta acreditarte." },
        ],
      },
      {
        id: "via",
        prompt: "¿Cómo puedes acreditar quién eres?",
        options: [
          { id: "casilla", label: "Tengo la casilla 505 de mi última renta" },
          { id: "cita", label: "Puedo ir a una oficina con el DNI o el NIE" },
          { id: "dnie", label: "Tengo DNIe y sé usar el PIN" },
        ],
      },
    ],
    docs: [
      {
        id: "identidad",
        label: "DNI o NIE en vigor, el físico",
        why: "En la cita te lo piden en mano. Por internet, los datos tienen que ser exactamente los del documento.",
      },
      {
        id: "casilla",
        label: "Casilla 505 de la última declaración de la renta",
        why: "Es un número de la declaración, no el resultado a pagar o devolver. Sin ese dato, el registro online con renta no entra.",
        when: (answers) => a(answers, "via") === "casilla",
      },
      {
        id: "cita",
        label: "Cita en un oficina de registro",
        why: "Agencia Tributaria, Tesorería o algunos ayuntamientos. Vas con el documento, firmas y sales dado de alta.",
        when: (answers) => a(answers, "via") === "cita",
      },
      {
        id: "dnie",
        label: "DNIe, PIN y un lector o el móvil con NFC si lo admite",
        why: "Sin el PIN el chip no sirve. Si no lo recuerdas, se cambia en un punto de actualización del DNIe.",
        when: (answers) => a(answers, "via") === "dnie",
      },
      {
        id: "codigo",
        label: "Código de solicitud de la FNMT",
        why: "Se pide en la sede de la FNMT antes de acreditarte. Caduca. Si se te pasa, se pide otro.",
        when: (answers) => a(answers, "cual") === "fnmt",
      },
    ],
    online: {
      title: "Registro por internet",
      where: "clave.gob.es o la sede de la FNMT",
      time: "Minutos, si el dato es el bueno",
      note: "Con la casilla 505 o con DNIe no hace falta cola. La Cl@ve permanente se activa después, con una contraseña que eliges tú.",
      fit: (answers) => (a(answers, "via") === "cita" ? "no" : "best"),
    },
    desk: {
      title: "Oficina de registro",
      where: "AEAT, Seguridad Social o ayuntamiento adherido",
      time: "La cita suele ser corta",
      note: "Es el camino si no hiciste la renta o no te fías del trámite online. Lleva el documento físico.",
      fit: (answers) => (a(answers, "via") === "cita" ? "best" : "ok"),
    },
    steps: [
      { title: "Elige PIN, permanente o certificado", detail: "Para casi todos los trámites de esta app basta Cl@ve permanente." },
      { title: "Acredítate una sola vez", detail: "Con la renta, con el DNIe o en persona." },
      { title: "Activa la contraseña", detail: "En clave.gob.es, apartado de Cl@ve permanente. El PIN solo no te guarda la clave." },
      { title: "Prueba con un trámite fácil", detail: "La vida laboral. Si entras, ya puedes con el resto." },
    ],
    rejections: [
      { title: "La casilla que no es", detail: "La gente mira el importe a devolver. La 505 es otra casilla de la declaración." },
      { title: "Código de la FNMT caducado", detail: "Pediste el certificado y fuiste a la oficina demasiado tarde." },
      { title: "Nombre que no coincide", detail: "Un segundo apellido, un guion o un NIE escrito como DNI." },
    ],
    script: (answers) => [
      a(answers, "cual") === "fnmt"
        ? "Vengo a acreditar mi identidad para el certificado de la FNMT. Traigo el código de solicitud."
        : "Vengo a registrarme en Cl@ve.",
      "Traigo el documento original en vigor.",
      a(answers, "via") === "casilla"
        ? "Me registro con la casilla 505. Si no entra, pido cita presencial."
        : "¿Me confirman que al salir ya puedo activar la contraseña?",
      "Quiero la Cl@ve permanente, no solo un PIN de un uso.",
    ],
    warnings: () => [
      "Cl@ve PIN y Cl@ve permanente no son lo mismo. El PIN llega por SMS cada vez. La permanente es la que te deja entrar sin pedir cita para cada trámite.",
    ],
    goHeadline: "Puedes registrarte",
  },
  {
    id: "vida",
    name: "Informe de vida laboral",
    short: "Lo que has cotizado, en un PDF",
    blurb: "El trámite que sí se acaba hoy, si puedes entrar en la sede.",
    organism: "Seguridad Social · Importass",
    fee: "Gratis",
    plazo: "Con Cl@ve o con SMS, el PDF sale en el momento.",
    tags: [
      "vida laboral",
      "informe de vida laboral",
      "cotizaciones",
      "importass",
      "seguridad social",
      "cuanto he cotizado",
    ],
    officialUrl: "https://portal.seg-social.gob.es/wps/portal/importass",
    officialLabel: "Importass · Seguridad Social",
    questions: [
      {
        id: "acceso",
        prompt: "¿Cómo puedes entrar en la Seguridad Social?",
        options: [
          { id: "clave", label: "Con Cl@ve o certificado" },
          { id: "sms", label: "Con un SMS al móvil que ellos tienen" },
          { id: "nada", label: "Con ninguna de las dos" },
        ],
      },
    ],
    docs: [
      {
        id: "clave",
        label: "Cl@ve o certificado que sí entra",
        why: "Prueba el acceso antes de contar con el PDF. Una Cl@ve a medias (solo dada de alta, sin contraseña) no abre Importass.",
        when: (answers) => a(answers, "acceso") === "clave",
      },
      {
        id: "sms",
        label: "El móvil que la Seguridad Social tiene grabado",
        why: "Si cambiaste de número y no lo actualizaste, el SMS no llega. Entonces este camino se cae.",
        when: (answers) => a(answers, "acceso") === "sms",
      },
      {
        id: "dni",
        label: "DNI o NIE para la cita presencial",
        why: "Sin clave y sin SMS, el informe se pide en la Tesorería, con cita y el documento en la mano.",
        when: (answers) => a(answers, "acceso") === "nada",
      },
    ],
    online: {
      title: "Importass",
      where: "portal.seg-social.gob.es",
      time: "Dos minutos",
      note: "Informe de vida laboral. Descárgalo en PDF. No hace falta contárselo a nadie en una ventanilla.",
      fit: (answers) => (a(answers, "acceso") === "nada" ? "no" : "best"),
    },
    desk: {
      title: "Tesorería General de la Seguridad Social",
      where: "Cita en la oficina, con el documento",
      time: "Una cita",
      note: "Solo compensa si no puedes entrar online. Si vas a hacer más trámites, saca antes la Cl@ve y este PDF te sobra la cola.",
      fit: (answers) => (a(answers, "acceso") === "nada" ? "best" : "ok"),
    },
    steps: [
      { title: "Entra en Importass", detail: "Con Cl@ve, certificado o SMS." },
      { title: "Pide el informe de vida laboral", detail: "No el de bases de cotización, salvo que te lo hayan pedido con ese nombre." },
      { title: "Guarda el PDF", detail: "Te lo van a pedir para el paro, un alquiler o un banco." },
    ],
    rejections: [
      { title: "El móvil no es el de ellos", detail: "El SMS sale al número antiguo. Hay que actualizarlo, no insistir." },
      { title: "Cl@ve sin activar", detail: "Estás registrado y aun así la sede te echa. Falta la contraseña permanente." },
      { title: "Pedir el informe equivocado", detail: "Vida laboral, bases de cotización y estar al corriente son tres PDF distintos." },
    ],
    script: () => [
      "Necesito el informe de vida laboral.",
      "No tengo Cl@ve ni me llega el SMS.",
      "Traigo el documento en vigor.",
      "¿Me lo pueden dar hoy en papel o sellado?",
    ],
    warnings: (answers) =>
      a(answers, "acceso") === "nada"
        ? ["Merece más la pena sacar Cl@ve (está en el mostrador) que pedir cita solo para este PDF."]
        : [],
    readyNote: (answers) =>
      a(answers, "acceso") === "nada"
        ? "Con el DNI puedes pedirlo en una oficina. Por internet, hoy no. Si activas Cl@ve, este trámite se vuelve de dos minutos."
        : "Entra en Importass y descárgalo ahora. No hace falta cita.",
    goHeadline: "Lo tienes en un momento",
  },
  {
    id: "beca",
    name: "Beca general del Estado",
    short: "Bachillerato, FP o universidad",
    blurb: "La convocatoria manda. Aquí se prepara el expediente para no perder el plazo.",
    organism: "Ministerio de Educación",
    fee: "Gratis",
    plazo: "Lo fija la convocatoria de cada curso, casi siempre en primavera, con un plazo extra de matrícula en otoño para parte de la universidad. La fecha de este año está en la sede, no en un chat.",
    tags: [
      "beca",
      "beca mec",
      "ministerio de educacion",
      "universidad",
      "fp",
      "bachillerato",
      "ayuda estudios",
    ],
    officialUrl: "https://sede.educacion.gob.es",
    officialLabel: "Sede del Ministerio de Educación",
    questions: [
      {
        id: "estudio",
        prompt: "¿Qué vas a estudiar?",
        options: [
          { id: "bach", label: "Bachillerato" },
          { id: "fp", label: "Formación profesional" },
          { id: "uni", label: "Universidad" },
        ],
      },
      {
        id: "renta",
        prompt: "¿La unidad familiar presentó la renta?",
        hint: "El Ministerio cruza datos con Hacienda. Si nadie la presentó, el expediente se complica.",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "No" },
          { id: "no_se", label: "No lo sé" },
        ],
      },
      {
        id: "matricula",
        prompt: "¿Ya estás matriculado de este curso?",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "Todavía no" },
        ],
      },
      {
        id: "clave",
        prompt: "¿Quien presenta la beca tiene Cl@ve o certificado?",
        options: [
          { id: "si", label: "Sí" },
          { id: "no", label: "No" },
        ],
      },
    ],
    docs: [
      {
        id: "dni",
        label: "DNI o NIE del estudiante",
        why: "En vigor. El número tiene que ser el de la matrícula.",
      },
      {
        id: "familia",
        label: "Documentos de la unidad familiar",
        why: "DNI de los miembros computables y, si aplica, libro de familia o equivalente. Un NIF mal copiado para toda la beca.",
      },
      {
        id: "iban",
        label: "IBAN donde pueda ingresar el Ministerio",
        why: "Cuenta del estudiante o la que indique la convocatoria. No la de un amigo.",
      },
      {
        id: "matricula",
        label: "Justificante de matrícula",
        why: "Si la convocatoria deja presentarla después, guárdalo igualmente: sin él no resuelven.",
        blocking: (answers) => a(answers, "matricula") === "si",
      },
    ],
    online: {
      title: "Sede del Ministerio",
      where: "sede.educacion.gob.es",
      time: "La solicitud, en una sentada. La resolución, meses",
      note: "La beca se presenta online. En ventanilla del instituto no «te la dan»: como mucho te ayudan a entrar.",
      fit: (answers) => (a(answers, "clave") === "si" ? "best" : "no"),
    },
    desk: {
      title: "No hay un mostrador que la conceda",
      where: "El centro puede orientar. La solicitud es electrónica",
      time: "Depende del hueco que te hagan",
      note: "Si no tienes Cl@ve, el paso útil en persona es conseguirla, no hacer cola para la beca.",
      fit: (answers) => (a(answers, "clave") === "no" ? "ok" : "no"),
    },
    steps: [
      { title: "Abre la convocatoria de este curso", detail: "Ahí están la nota, la renta y el día de cierre. Esos números cambian cada año y aquí no los inventamos." },
      { title: "Reúne los NIF de casa", detail: "Antes de empezar el formulario, no a mitad." },
      { title: "Presenta dentro del plazo", detail: "Aunque la matrícula sea después, si la convocatoria lo permite. Fuera de plazo no hay beca." },
      { title: "Guarda el resguardo", detail: "Es la prueba de que entró. Consulta el estado en la misma sede." },
    ],
    rejections: [
      { title: "Unidad familiar mal declarada", detail: "Falta un progenitor, o sobra alguien que ya no vive en casa según Hacienda." },
      { title: "No llegar al requisito académico", detail: "Créditos o nota por debajo de lo que dice el BOE de este año." },
      { title: "Presentarla el día después", detail: "El plazo de la beca no se amplía porque la web vaya lenta el último día. Entra antes." },
    ],
    script: () => [
      "Quiero presentar la beca general en la sede del Ministerio.",
      "Traigo los NIF de la unidad familiar y el justificante de matrícula, si ya lo tengo.",
      "¿Esta convocatoria deja aportar la matrícula más adelante?",
      "Necesito el resguardo de que la solicitud ha entrado.",
    ],
    warnings: (answers) => {
      const notes = [
        "La nota de corte y el umbral de renta son los de la convocatoria de este curso. No uses los de un blog del año pasado.",
      ];
      if (a(answers, "renta") !== "si") {
        notes.push("Si nadie presentó la renta, Hacienda no puede cruzar y la beca se retrasa o se pierde. Compruébalo antes del cierre.");
      }
      if (a(answers, "matricula") === "no") {
        notes.push("En universidad suele haber un plazo de otoño ligado a la matrícula. No des por hecho que en bachillerato o FP sea igual.");
      }
      if (a(answers, "estudio") === "uni") {
        notes.push("En grado, además de la renta, importa el porcentaje de créditos que superaste. Está en la convocatoria, no en la media del instituto.");
      }
      return notes;
    },
    readyNote: (answers) =>
      a(answers, "clave") === "no"
        ? "Los datos los tienes, pero sin Cl@ve o certificado no entra la solicitud. Ese es el paso de hoy, no rellenar el formulario en un papel."
        : null,
    goHeadline: "El expediente está listo",
  },
];

export function getTramite(id: string) {
  return TRAMITES.find((t) => t.id === id);
}

export function rankTramites(query: string): Tramite[] {
  const q = norm(query);
  if (q.length < 2) return [];
  return TRAMITES.map((t) => {
    const hay = norm([t.name, t.short, t.blurb, t.organism, ...t.tags].join(" | "));
    let score = 0;
    if (hay.includes(q)) score += 8;
    for (const tag of t.tags) {
      const nt = norm(tag);
      if (!nt) continue;
      if (q.includes(nt) || nt.includes(q)) score += 6;
    }
    for (const word of q.split(" ")) {
      if (word.length < 3) continue;
      if (hay.includes(word)) score += 1;
    }
    return { t, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.t);
}

function norm(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
