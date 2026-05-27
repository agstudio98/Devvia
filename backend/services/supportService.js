/**
 * SERVICIO DE SOPORTE (REDISEÑO: BOT DE ETIQUETAS ROBUSTO)
 * 
 * Este servicio funciona como un motor de navegación. No contiene texto plano,
 * sino que devuelve identificadores de traducción (keys) y opciones.
 * No se guarda historial en base de datos.
 */

const BOT_FLOW = {
  "root": {
    responseKey: "SUPPORT_BOT.FLOW.WELCOME",
    options: ["explore_platform", "career_boost", "projects_help", "community_rules", "technical_issue"]
  },
  
  // 1. Explore Platform
  "explore_platform": {
    responseKey: "SUPPORT_BOT.FLOW.EXPLORE_PLATFORM",
    options: ["what_is_devvia", "how_it_works", "benefits", "info_portal", "aprender_uso", "back_to_main"]
  },
  "what_is_devvia": {
    responseKey: "SUPPORT_BOT.FLOW.WHAT_IS_DEVVIA",
    options: ["how_it_works", "back_to_main"]
  },
  "how_it_works": {
    responseKey: "SUPPORT_BOT.FLOW.HOW_IT_WORKS",
    options: ["benefits", "back_to_main"]
  },
  "benefits": {
    responseKey: "SUPPORT_BOT.FLOW.BENEFITS",
    options: ["explore_platform", "back_to_main"]
  },
  "info_portal": {
    redirectTo: "what_is_devvia"
  },
  "aprender_uso": {
    redirectTo: "how_it_works"
  },

  // 2. Career & Jobs
  "career_boost": {
    responseKey: "SUPPORT_BOT.FLOW.CAREER_BOOST",
    options: ["find_jobs", "match_algorithm", "interview_tips", "como_postular", "back_to_main"]
  },
  "find_jobs": {
    responseKey: "SUPPORT_BOT.FLOW.FIND_JOBS",
    options: ["match_algorithm", "back_to_main"]
  },
  "match_algorithm": {
    responseKey: "SUPPORT_BOT.FLOW.MATCH_ALGORITHM",
    options: ["career_boost", "back_to_main"]
  },
  "interview_tips": {
    responseKey: "SUPPORT_BOT.FLOW.INTERVIEW_TIPS",
    options: ["back_to_main"]
  },
  "como_postular": {
    redirectTo: "find_jobs"
  },

  // 3. Projects & Code
  "projects_help": {
    responseKey: "SUPPORT_BOT.FLOW.PROJECTS_HELP",
    options: ["upload_project", "showcase_talent", "open_source", "subir_mi_proyecto", "back_to_main"]
  },
  "upload_project": {
    responseKey: "SUPPORT_BOT.FLOW.UPLOAD_PROJECT",
    options: ["showcase_talent", "back_to_main"]
  },
  "showcase_talent": {
    responseKey: "SUPPORT_BOT.FLOW.SHOWCASE_TALENT",
    options: ["projects_help", "back_to_main"]
  },
  "open_source": {
    responseKey: "SUPPORT_BOT.FLOW.OPEN_SOURCE",
    options: ["back_to_main"]
  },
  "subir_mi_proyecto": {
    redirectTo: "upload_project"
  },

  // 4. Community & Networking
  "community_rules": {
    responseKey: "SUPPORT_BOT.FLOW.COMMUNITY_RULES",
    options: ["networking", "mentorship", "back_to_main"]
  },
  "networking": {
    responseKey: "SUPPORT_BOT.FLOW.NETWORKING",
    options: ["mentorship", "back_to_main"]
  },
  "mentorship": {
    responseKey: "SUPPORT_BOT.FLOW.MENTORSHIP",
    options: ["community_rules", "back_to_main"]
  },

  // 5. Technical Support
  "technical_issue": {
    responseKey: "SUPPORT_BOT.FLOW.TECHNICAL_ISSUE",
    options: ["solucionar_sitio", "error_login", "report_issue", "account_help", "back_to_main"]
  },
  "solucionar_sitio": {
    responseKey: "SUPPORT_BOT.FLOW.SOLVE_SITE",
    options: ["report_issue", "back_to_main"]
  },
  "error_login": {
    responseKey: "SUPPORT_BOT.FLOW.LOGIN_ERROR_DETAIL",
    options: ["account_help", "back_to_main"]
  },
  "report_issue": {
    responseKey: "SUPPORT_BOT.FLOW.REPORT_ISSUE",
    options: ["back_to_main"]
  },
  "account_help": {
    responseKey: "SUPPORT_BOT.FLOW.ACCOUNT_HELP",
    options: ["back_to_main"]
  },

  "back_to_main": {
    redirectTo: "root"
  }
};

/**
 * Procesa un turno de chat.
 */
const processChatTurn = async (userId, { mensaje, isOption }) => {
  // Lógica de navegación
  let targetTag = isOption ? mensaje : "root";
  let flow = BOT_FLOW[targetTag] || BOT_FLOW["root"];

  // Manejo de redirecciones internas
  if (flow.redirectTo) {
    targetTag = flow.redirectTo;
    flow = BOT_FLOW[targetTag];
  }

  return {
    respuestaKey: flow.responseKey,
    nextOptions: flow.options || [],
    allowInput: flow.allowInput || false
  };
};

module.exports = {
  processChatTurn
};
