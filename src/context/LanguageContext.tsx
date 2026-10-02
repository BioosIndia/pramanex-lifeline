import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav
    'nav.overview': 'Overview',
    'nav.search': 'Medicine Search',
    'nav.alerts': 'Shortage Alerts',
    'nav.export': 'Export Dossier',
    'nav.command': 'Command Center',
    'nav.patient': 'Patient Portal',
    'nav.pricing': 'Pricing & Billing',
    'nav.methodology': 'Methodology',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'nav.askAI': 'Ask AI OS',
    'nav.webGrounding': 'Web Grounding',
    'nav.enterpriseOS': 'Enterprise OS Workspace',
    'nav.publicView': 'Public View',

    // Hero
    'hero.badge': 'Official-Source Medicine Supply Intelligence',
    'hero.title': 'Understand Medicine Shortage Signals',
    'hero.titleHighlight': 'Without Losing the Source.',
    'hero.subtitle': 'Search official shortage information, track source freshness, compare jurisdiction-specific signals and receive evidence-linked updates without hiding uncertainty.',
    'hero.searchPlaceholder': 'Search medicine, active substance, brand, or ATC code...',
    'hero.searchBtn': 'Search',
    'hero.commonSignals': 'Common signals:',
    'hero.activeShortages': 'Active Shortages',
    'hero.monitoredFeeds': 'Monitored Feeds',
    'hero.freshnessIndex': 'Freshness Index',
    'hero.crossSplit': 'Cross-Source Split',
    'hero.windowTitle': 'PRAMANEX LIFELINE OS v28.4 — Verified Regulatory Node',
    'hero.tabAll': 'Global View',
    'hero.tabUS': 'FDA (United States)',
    'hero.tabEU': 'EMA (European Union)',
    'hero.openConsole': 'Open Full Enterprise OS',

    // Statuses
    'status.shortageDeclared': 'Shortage Declared',
    'status.supplyDisruption': 'Supply Disruption',
    'status.resolved': 'Resolved',
    'status.conflicting': 'Conflicting Sources',
    'status.fresh': 'Fresh (Verified)',
    'status.delayed': 'Sync Delayed',
    'status.stale': 'Sync Stale',

    // Proof Strip
    'proof.officialLinked': 'Official-Source Linked',
    'proof.officialLinkedDesc': 'Directly mapped to FDA, EMA, Health Canada & TGA registers.',
    'proof.jurisdictionAware': 'Jurisdiction Aware',
    'proof.jurisdictionAwareDesc': 'Never confuse a national shortage with local availability.',
    'proof.freshnessVisible': 'Freshness Visible',
    'proof.freshnessVisibleDesc': 'Exact timestamp and sync cadence displayed on every record.',
    'proof.humanGoverned': 'Human-in-the-Loop',
    'proof.humanGovernedDesc': 'Cross-source discrepancies audited by verified regulatory leads.',

    // Search Engine
    'search.title': 'Official Medicine Supply Index',
    'search.subtitle': 'Directly cross-referencing official national regulatory filings with instant autocomplete.',
    'search.inputPlaceholder': 'Type medicine name, active ingredient, brand or ATC code...',
    'search.recentSearches': 'Recent Searches',
    'search.inspectSnapshot': 'Inspect Snapshot',
    'search.affectedPresentation': 'Affected Presentation',
    'search.officialCause': 'Official Cause',
    'search.addToWatchlist': 'Add to Watchlist',
    'search.removeFromWatchlist': 'Remove from Watchlist',
    'search.filterJurisdiction': 'Jurisdiction',
    'search.filterStatus': 'Shortage Status',
    'search.filterForm': 'Dosage Form',
    'search.filterFreshness': 'Freshness',
    'search.verifyGoogle': 'Verify with Google Search Grounding',
    'search.foundRecords': 'official records found',
    'search.viewDossier': 'View Dossier & Provenance',

    // Alerts Engine
    'alerts.title': 'Automated Watchlist & Multi-Channel Shortage Alerts',
    'alerts.subtitle': 'Receive verified push notifications, email summaries, SMS dispatch, or hospital FHIR hooks when shortages change.',
    'alerts.activateBtn': 'Activate Shortage Alerts',
    'alerts.testBtn': 'Test Signal Dispatch',
    'alerts.channelWeb': 'Browser Push Notifications',
    'alerts.channelEmail': 'Institutional Email Digest',
    'alerts.channelSms': 'Urgent SMS Dispatch',
    'alerts.channelFhir': 'FHIR HL7 EHR Integration',

    // Export Dossiers
    'export.title': 'Interoperable Compliance Dossiers & Clinical Data Exports',
    'export.subtitle': 'Download cryptographically verifiable supply intelligence dossiers in regulatory industry formats.',
    'export.download': 'Download File',
    'export.copy': 'Copy Payload',
    'export.print': 'Print Dossier',
    'export.formatFhir': 'FHIR NDH Shortage Resource (JSON)',
    'export.formatSpor': 'EMA SPOR Shortage Model (JSON)',
    'export.formatSpl': 'FDA Structured Product Labeling (XML)',
    'export.formatCsv': 'WHO INN Cross-Border CSV',

    // Global Supply Map
    'map.title': 'Global Medicine Supply Disruption Hotspots',
    'map.subtitle': 'Real-time geographic surveillance across FDA, EMA, Health Canada, TGA, and CDSCO regulatory territories.',
    'map.filterAll': 'Global Surveillance',
    'map.filterUS': 'North America (FDA / HC)',
    'map.filterEU': 'Europe (EMA / National)',
    'map.filterAPAC': 'Asia-Pacific (TGA / CDSCO)',
    'map.criticalShortage': 'Critical Shortages',
    'map.disruptions': 'Active Disruptions',
    'map.stableSupply': 'Stable Supply',

    // Agent Swarm Console
    'swarm.title': 'Autonomous Multi-Agent AI Swarm with Human-in-the-Loop',
    'swarm.subtitle': 'Real-time orchestration of specialized Gemini agents ingesting, reconciling, and drafting regulatory intelligence.',
    'swarm.ingestAgent': 'Regulatory Ingestion Agent',
    'swarm.conflictAgent': 'Cross-Source Reconciliation Agent',
    'swarm.dossierAgent': 'Compliance Dossier Agent',
    'swarm.alertAgent': 'Signal Dispatch Agent',
    'swarm.hitlSignoff': 'Sign Off & Approve Signal',
    'swarm.statusActive': 'Active Monitoring',

    // Collaborative Annotations
    'notes.title': 'Collaborative Clinical Annotations & Peer Triage',
    'notes.subtitle': 'Verified notes from hospital pharmacists, clinical supply officers, and regulatory specialists.',
    'notes.addNote': 'Add Clinical Note',
    'notes.placeholder': 'Share observations, allocation strategies, or formulation details...',
    'notes.submit': 'Post Annotation',

    // Official Bulletins
    'bulletins.title': 'Official Regulatory Bulletins & Government Notices',
    'bulletins.subtitle': 'Direct feeds from FDA MedWatch, EMA DHPC, Health Canada Recalls, and TGA Shortages.',
    'bulletins.viewNotice': 'View Official Notice',
    'bulletins.externalSource': 'Open Sovereign Source',

    // Consumer / Patient View
    'patient.title': 'Patient & Caregiver Medicine Availability Guide',
    'patient.subtitle': 'Clear, simple information about medicine shortages without confusing technical jargon.',
    'patient.searchPlaceholder': 'Type the medicine you or a family member take...',
    'patient.myList': 'My Monitored Medicines',
    'patient.whatThisMeans': 'What does this mean for me?',
    'patient.pharmacistAdvice': 'Consult your community pharmacist or doctor before changing dosages.',
    'patient.trackMedicine': 'Track This Medicine',

    // Authenticated Enterprise OS
    'os.roleWorkspace': 'My Role Workspace',
    'os.commandCenter': 'Command Center',
    'os.globalMap': 'Global Supply Map',
    'os.swarm': 'AI Agent Swarm (HITL)',
    'os.notes': 'Collaborative Notes',
    'os.bulletins': 'Official Bulletins',
    'os.index': 'Medicine Index',
    'os.dossiers': 'Export Dossiers',

    // Disclaimer & Footer
    'disclaimer.text': 'Official declarations only • Does not reflect individual retail pharmacy stock. No therapeutic substitution advice.',
    'footer.tagline': 'Source-linked, freshness-aware, jurisdiction-specific medicine supply intelligence.',
    'footer.rights': 'All rights reserved. Regulated clinical & supply intelligence platform.',
  },

  hi: {
    // Nav
    'nav.overview': 'अवलोकन',
    'nav.search': 'दवाई खोजें',
    'nav.alerts': 'शॉर्टेज अलर्ट',
    'nav.export': 'रिपोर्ट एक्सपोर्ट',
    'nav.command': 'कमांड सेंटर',
    'nav.patient': 'मरीज पोर्टल',
    'nav.pricing': 'मूल्य एवं योजनाएं',
    'nav.methodology': 'पद्धति (Methodology)',
    'nav.signIn': 'साइन इन करें',
    'nav.signOut': 'साइन आउट',
    'nav.askAI': 'एआई से पूछें',
    'nav.webGrounding': 'वेब ग्राउंडिंग',
    'nav.enterpriseOS': 'एंटरप्राइज ओएस खोलें',
    'nav.publicView': 'पब्लिक व्यू',

    // Hero
    'hero.badge': 'आधिकारिक स्रोत से दवा आपूर्ति इंटेलिजेंस',
    'hero.title': 'स्रोत की पुष्टि के साथ दवा की कमी को समझें',
    'hero.titleHighlight': 'बिना आधिकारिक स्रोत खोए।',
    'hero.subtitle': 'आधिकारिक दवा कमी की जानकारी खोजें, डेटा ताजगी ट्रैक करें, विभिन्न देशों के संकेतों की तुलना करें और प्रमाण-आधारित अपडेट प्राप्त करें।',
    'hero.searchPlaceholder': 'दवाई का नाम, ब्रांड, एक्टिव मॉलिक्यूल या एटीसी कोड खोजें...',
    'hero.searchBtn': 'खोजें',
    'hero.commonSignals': 'प्रमुख दवाएं:',
    'hero.activeShortages': 'सक्रिय कमी',
    'hero.monitoredFeeds': 'निगरानी वाले स्रोत',
    'hero.freshnessIndex': 'डेटा ताजगी दर',
    'hero.crossSplit': 'विभिन्न स्रोतों में अंतर',
    'hero.windowTitle': 'PRAMANEX LIFELINE OS v28.4 — प्रमाणित विनियामक नोड',
    'hero.tabAll': 'ग्लोबल व्यू',
    'hero.tabUS': 'एफडीए (अमेरिका)',
    'hero.tabEU': 'ईएमए (यूरोपीय संघ)',
    'hero.openConsole': 'फुल एंटरप्राइज ओएस खोलें',

    // Statuses
    'status.shortageDeclared': 'दवा की कमी घोषित',
    'status.supplyDisruption': 'सप्लाई बाधित',
    'status.resolved': 'कमी सुलझाई गई',
    'status.conflicting': 'स्रोतों में मतभेद',
    'status.fresh': 'ताज़ा (प्रमाणित)',
    'status.delayed': 'अपडेट में देरी',
    'status.stale': 'पुराना डेटा',

    // Proof Strip
    'proof.officialLinked': 'आधिकारिक स्रोत से प्रमाणित',
    'proof.officialLinkedDesc': 'सीधे FDA, EMA, Health Canada और TGA रजिस्टरों से संबद्ध।',
    'proof.jurisdictionAware': 'देश-विशिष्ट स्पष्टता',
    'proof.jurisdictionAwareDesc': 'राष्ट्रीय कमी को स्थानीय उपलब्धता से कभी न मिलाएं।',
    'proof.freshnessVisible': 'डेटा की ताजगी स्पष्ट',
    'proof.freshnessVisibleDesc': 'हर रिकॉर्ड पर सही टाइमस्टैम्प और सिंक समय दिखाई देता है।',
    'proof.humanGoverned': 'मानवीय विशेषज्ञ निगरानी (HITL)',
    'proof.humanGovernedDesc': 'स्रोतों में मतभेद होने पर विनियामक अधिकारियों द्वारा समीक्षा।',

    // Search Engine
    'search.title': 'आधिकारिक दवा आपूर्ति सूचकांक',
    'search.subtitle': 'सरकारी फाइलिंग और यूट्यूब-शैली ऑटो-कम्प्लीट के साथ सीधे मिलान।',
    'search.inputPlaceholder': 'दवाई का नाम, सक्रिय तत्व, ब्रांड या फॉर्म टाइप करें...',
    'search.recentSearches': 'हाल की खोजें',
    'search.inspectSnapshot': 'प्रमाण जांचें',
    'search.affectedPresentation': 'प्रभावित डोज / पैक',
    'search.officialCause': 'आधिकारिक कारण',
    'search.addToWatchlist': 'वॉचलिस्ट में जोड़ें',
    'search.removeFromWatchlist': 'वॉचलिस्ट से हटाएं',
    'search.filterJurisdiction': 'अधिकार क्षेत्र (देश)',
    'search.filterStatus': 'कमी की स्थिति',
    'search.filterForm': 'दवा का रूप (Dosage)',
    'search.filterFreshness': 'डेटा ताजगी',
    'search.verifyGoogle': 'गूगल सर्च ग्राउंडिंग से सत्यापित करें',
    'search.foundRecords': 'आधिकारिक रिकॉर्ड मिले',
    'search.viewDossier': 'दस्तावेज़ एवं स्रोत देखें',

    // Alerts Engine
    'alerts.title': 'स्वचालित वॉचलिस्ट एवं त्वरित दवा कमी अलर्ट',
    'alerts.subtitle': 'ब्राउज़र पुश, ईमेल, एसएमएस या हॉस्पिटल FHIR सिस्टम द्वारा त्वरित अलर्ट पाएं।',
    'alerts.activateBtn': 'शॉर्टेज अलर्ट सक्रिय करें',
    'alerts.testBtn': 'अलर्ट टेस्ट करें',
    'alerts.channelWeb': 'ब्राउज़र पुश नोटिफिकेशन',
    'alerts.channelEmail': 'ईमेल डाइजेस्ट',
    'alerts.channelSms': 'एसएमएस सूचना',
    'alerts.channelFhir': 'हॉस्पिटल FHIR एकीकरण',

    // Export Dossiers
    'export.title': 'मानकीकृत विनियामक डोजियर एवं डेटा एक्सपोर्ट',
    'export.subtitle': 'नियामक उद्योग प्रारूपों में डिजिटल रूप से हस्ताक्षरित आपूर्ति रिपोर्ट डाउनलोड करें।',
    'export.download': 'फाइल डाउनलोड करें',
    'export.copy': 'पेलोड कॉपी करें',
    'export.print': 'डोजियर प्रिंट करें',
    'export.formatFhir': 'FHIR NDH शॉर्टेज रिसोर्स (JSON)',
    'export.formatSpor': 'EMA SPOR मॉडल (JSON)',
    'export.formatSpl': 'FDA स्ट्रक्चर्ड लेबलिंग (XML)',
    'export.formatCsv': 'WHO INN क्रॉस-बॉर्डर CSV',

    // Global Supply Map
    'map.title': 'ग्लोबल दवा आपूर्ति व्यवधान मानचित्र',
    'map.subtitle': 'FDA, EMA, हेल्थ कनाडा, TGA एवं CDSCO क्षेत्रों में रीयल-टाइम वैश्विक निगरानी।',
    'map.filterAll': 'वैश्विक निगरानी',
    'map.filterUS': 'उत्तरी अमेरिका (FDA / HC)',
    'map.filterEU': 'यूरोप (EMA)',
    'map.filterAPAC': 'एशिया-प्रशांत (TGA / CDSCO)',
    'map.criticalShortage': 'गंभीर दवा कमी',
    'map.disruptions': 'सप्लाई व्यवधान',
    'map.stableSupply': 'स्थिर आपूर्ति',

    // Agent Swarm Console
    'swarm.title': 'स्वायत्त मल्टी-एजेंट एआई स्वार्म (HITL)',
    'swarm.subtitle': 'जेमिनी एआई एजेंटों का रीयल-टाइम ऑर्केस्ट्रेशन और मानवीय अनुमोदन कार्यप्रवाह।',
    'swarm.ingestAgent': 'डेटा इनजेशन एजेंट',
    'swarm.conflictAgent': 'स्रोतों के मतभेद समाधान एजेंट',
    'swarm.dossierAgent': 'विनियामक रिपोर्ट तैयारकर्ता',
    'swarm.alertAgent': 'त्वरित सिग्नल डिस्पैच एजेंट',
    'swarm.hitlSignoff': 'स्वीकृति एवं हस्ताक्षर करें',
    'swarm.statusActive': 'सक्रिय निगरानी',

    // Collaborative Annotations
    'notes.title': 'सहयोगात्मक क्लिनिकल नोट्स एवं समीक्षा',
    'notes.subtitle': 'अस्पताल के फार्मासिस्टों और विनियामक विशेषज्ञों द्वारा सत्यापित नोट्स।',
    'notes.addNote': 'क्लिनिकल नोट जोड़ें',
    'notes.placeholder': 'दवा के विकल्प, उपलब्धता टिप्पणी या अवलोकन लिखें...',
    'notes.submit': 'नोट पोस्ट करें',

    // Official Bulletins
    'bulletins.title': 'सरकारी बुलेटिन एवं विनियामक सूचनाएं',
    'bulletins.subtitle': 'FDA MedWatch, EMA DHPC, और हेल्थ कनाडा से सीधे प्राप्त आधिकारिक नोटिस।',
    'bulletins.viewNotice': 'आधिकारिक नोटिस देखें',
    'bulletins.externalSource': 'मूल सरकारी स्रोत खोलें',

    // Consumer / Patient View
    'patient.title': 'मरीजों एवं परिजनों के लिए दवा उपलब्धता गाइड',
    'patient.subtitle': 'दवा की कमी के बारे में बिना किसी कठिन तकनीकी भाषा के स्पष्ट और सरल जानकारी।',
    'patient.searchPlaceholder': 'वह दवा खोजें जो आप या आपका परिवार लेता है...',
    'patient.myList': 'मेरी ट्रैक की जा रही दवाएं',
    'patient.whatThisMeans': 'मेरे लिए इसका क्या अर्थ है?',
    'patient.pharmacistAdvice': 'खुराक बदलने से पहले हमेशा अपने डॉक्टर या फार्मासिस्ट से सलाह लें।',
    'patient.trackMedicine': 'इस दवा को ट्रैक करें',

    // Authenticated Enterprise OS
    'os.roleWorkspace': 'मेरा वर्कस्पेस',
    'os.commandCenter': 'कमांड सेंटर',
    'os.globalMap': 'सप्लाई मैप',
    'os.swarm': 'एआई एजेंट स्वार्म (HITL)',
    'os.notes': 'क्लिनिकल नोट्स',
    'os.bulletins': 'सरकारी बुलेटिन',
    'os.index': 'दवा इंडेक्स',
    'os.dossiers': 'एक्सपोर्ट डोजियर',

    // Disclaimer & Footer
    'disclaimer.text': 'केवल आधिकारिक राष्ट्रीय घोषणाएं • स्थानीय मेडिकल स्टोर का स्टॉक नहीं दर्शाता। कोई चिकित्सकीय सलाह नहीं है।',
    'footer.tagline': 'स्रोत-प्रमाणित, ताजगी-सजग, अधिकार-क्षेत्र-विशिष्ट दवा आपूर्ति इंटेलिजेंस।',
    'footer.rights': 'सर्वाधिकार सुरक्षित। प्रमाणित क्लिनिकल एवं आपूर्ति इंटेलिजेंस प्लेटफॉर्म।',
  },

  es: {
    // Nav
    'nav.overview': 'Resumen',
    'nav.search': 'Buscar Medicamento',
    'nav.alerts': 'Alertas de Escasez',
    'nav.export': 'Exportar Informe',
    'nav.command': 'Centro de Mando',
    'nav.patient': 'Portal del Paciente',
    'nav.pricing': 'Precios y Planes',
    'nav.methodology': 'Metodología',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signOut': 'Cerrar Sesión',
    'nav.askAI': 'Consultar IA',
    'nav.webGrounding': 'Búsqueda Web',
    'nav.enterpriseOS': 'Abrir Espacio Empresarial',
    'nav.publicView': 'Vista Pública',

    // Hero
    'hero.badge': 'Inteligencia Oficial de Suministro de Medicamentos',
    'hero.title': 'Comprenda las Señales de Escasez de Medicamentos',
    'hero.titleHighlight': 'Sin Perder la Fuente Oficial.',
    'hero.subtitle': 'Busque escasez oficial, verifique la frescura de los datos, compare señales jurisdiccionales y reciba actualizaciones con respaldo probatorio.',
    'hero.searchPlaceholder': 'Buscar medicamento, sustancia activa, marca o código ATC...',
    'hero.searchBtn': 'Buscar',
    'hero.commonSignals': 'Medicamentos comunes:',
    'hero.activeShortages': 'Escasez Activa',
    'hero.monitoredFeeds': 'Fuentes Monitoreadas',
    'hero.freshnessIndex': 'Índice de Frescura',
    'hero.crossSplit': 'Divergencia entre Fuentes',
    'hero.windowTitle': 'PRAMANEX LIFELINE OS v28.4 — Nodo Regulatorio Verificado',
    'hero.tabAll': 'Vista Global',
    'hero.tabUS': 'FDA (Estados Unidos)',
    'hero.tabEU': 'EMA (Unión Europea)',
    'hero.openConsole': 'Abrir Enterprise OS Completo',

    // Statuses
    'status.shortageDeclared': 'Escasez Declarada',
    'status.supplyDisruption': 'Interrupción de Suministro',
    'status.resolved': 'Resuelto',
    'status.conflicting': 'Fuentes Divergentes',
    'status.fresh': 'Fresco (Verificado)',
    'status.delayed': 'Sincronización Retrasada',
    'status.stale': 'Datos Antiguos',

    // Proof Strip
    'proof.officialLinked': 'Vinculado a Fuentes Oficiales',
    'proof.officialLinkedDesc': 'Conectado a registros de FDA, EMA, Health Canada y TGA.',
    'proof.jurisdictionAware': 'Conciencia Jurisdiccional',
    'proof.jurisdictionAwareDesc': 'Nunca confunda escasez nacional con disponibilidad local.',
    'proof.freshnessVisible': 'Frescura Visible',
    'proof.freshnessVisibleDesc': 'Marca de tiempo y cadencia de sincronización en cada registro.',
    'proof.humanGoverned': 'Gobernanza Humana (HITL)',
    'proof.humanGovernedDesc': 'Discrepancias auditadas por líderes regulatorios certificados.',

    // Search Engine
    'search.title': 'Índice Oficial de Suministro de Medicamentos',
    'search.subtitle': 'Cruce directo con registros regulatorios soberanos y autocompletado en tiempo real.',
    'search.inputPlaceholder': 'Escriba nombre de medicina, molécula activa o presentación...',
    'search.recentSearches': 'Búsquedas Recientes',
    'search.inspectSnapshot': 'Examinar Prueba',
    'search.affectedPresentation': 'Presentación Afectada',
    'search.officialCause': 'Causa Oficial',
    'search.addToWatchlist': 'Añadir a Vigilancia',
    'search.removeFromWatchlist': 'Quitar de Vigilancia',
    'search.filterJurisdiction': 'Jurisdicción',
    'search.filterStatus': 'Estado de Escasez',
    'search.filterForm': 'Forma Farmacéutica',
    'search.filterFreshness': 'Frescura de Datos',
    'search.verifyGoogle': 'Verificar con Google Search Grounding',
    'search.foundRecords': 'registros oficiales encontrados',
    'search.viewDossier': 'Ver Dossier y Procedencia',

    // Alerts Engine
    'alerts.title': 'Alertas Automatizadas de Escasez Multicanal',
    'alerts.subtitle': 'Notificaciones push, resúmenes por correo, SMS o ganchos FHIR hospitalarios.',
    'alerts.activateBtn': 'Activar Alertas de Escasez',
    'alerts.testBtn': 'Probar Despacho de Alerta',
    'alerts.channelWeb': 'Notificaciones del Navegador',
    'alerts.channelEmail': 'Resumen por Correo',
    'alerts.channelSms': 'Envío Urgente por SMS',
    'alerts.channelFhir': 'Integración Hospitalaria FHIR',

    // Export Dossiers
    'export.title': 'Dossiers Regulatorios y Exportación de Datos Clínicos',
    'export.subtitle': 'Descargue informes de suministro verificados criptográficamente.',
    'export.download': 'Descargar Archivo',
    'export.copy': 'Copiar Datos',
    'export.print': 'Imprimir Dossier',
    'export.formatFhir': 'Recurso FHIR NDH (JSON)',
    'export.formatSpor': 'Modelo EMA SPOR (JSON)',
    'export.formatSpl': 'Etiquetado FDA SPL (XML)',
    'export.formatCsv': 'CSV Transfronterizo WHO INN',

    // Global Supply Map
    'map.title': 'Mapa Global de Interrupción de Suministro',
    'map.subtitle': 'Vigilancia geográfica continua en territorios de FDA, EMA, Health Canada, TGA y CDSCO.',
    'map.filterAll': 'Vigilancia Global',
    'map.filterUS': 'Norteamérica (FDA / HC)',
    'map.filterEU': 'Europa (EMA)',
    'map.filterAPAC': 'Asia-Pacífico (TGA / CDSCO)',
    'map.criticalShortage': 'Escasez Crítica',
    'map.disruptions': 'Interrupciones Activas',
    'map.stableSupply': 'Suministro Estable',

    // Agent Swarm Console
    'swarm.title': 'Enjambre Autónomo Multi-Agente con Validación Humana (HITL)',
    'swarm.subtitle': 'Orquestación en tiempo real de agentes Gemini especializados en ingesta y conciliación regulatoria.',
    'swarm.ingestAgent': 'Agente de Ingesta Regulatoria',
    'swarm.conflictAgent': 'Agente de Conciliación de Fuentes',
    'swarm.dossierAgent': 'Agente Redactor de Dossiers',
    'swarm.alertAgent': 'Agente de Despacho de Señales',
    'swarm.hitlSignoff': 'Aprobar y Firmar Señal',
    'swarm.statusActive': 'Vigilancia Activa',

    // Collaborative Annotations
    'notes.title': 'Anotaciones Clínicas Colaborativas y Triaje',
    'notes.subtitle': 'Notas verificadas por farmacéuticos de hospital y especialistas regulatorios.',
    'notes.addNote': 'Añadir Nota Clínica',
    'notes.placeholder': 'Comparta estrategias de formulación, asignación o notas clínicas...',
    'notes.submit': 'Publicar Anotación',

    // Official Bulletins
    'bulletins.title': 'Boletines Oficiales y Avisos Gubernamentales',
    'bulletins.subtitle': 'Feeds directos de FDA MedWatch, EMA DHPC y Health Canada.',
    'bulletins.viewNotice': 'Ver Aviso Oficial',
    'bulletins.externalSource': 'Abrir Fuente Soberana',

    // Consumer / Patient View
    'patient.title': 'Guía de Disponibilidad de Medicamentos para Pacientes',
    'patient.subtitle': 'Información clara y sencilla sobre escasez sin tecnicismos complejos.',
    'patient.searchPlaceholder': 'Escriba el medicamento que toma usted o su familia...',
    'patient.myList': 'Mis Medicamentos Vigilados',
    'patient.whatThisMeans': '¿Qué significa esto para mí?',
    'patient.pharmacistAdvice': 'Consulte siempre a su médico o farmacéutico antes de alterar dosis.',
    'patient.trackMedicine': 'Vigilar Este Medicamento',

    // Authenticated Enterprise OS
    'os.roleWorkspace': 'Mi Espacio de Trabajo',
    'os.commandCenter': 'Centro de Mando',
    'os.globalMap': 'Mapa de Suministro',
    'os.swarm': 'Enjambre IA (HITL)',
    'os.notes': 'Notas Clínicas',
    'os.bulletins': 'Boletines Oficiales',
    'os.index': 'Índice de Medicinas',
    'os.dossiers': 'Exportar Dossiers',

    // Disclaimer & Footer
    'disclaimer.text': 'Únicamente declaraciones oficiales soberanas • No refleja stock en farmacias locales. Sin asesoramiento terapéutico.',
    'footer.tagline': 'Inteligencia de suministro de medicamentos vinculada a fuentes oficiales.',
    'footer.rights': 'Todos los derechos reservados. Plataforma regulada de inteligencia médica.',
  },

  fr: {
    // Nav
    'nav.overview': 'Aperçu',
    'nav.search': 'Recherche Médicament',
    'nav.alerts': 'Alertes Pénurie',
    'nav.export': 'Exporter Dossier',
    'nav.command': 'Centre de Contrôle',
    'nav.patient': 'Portail Patient',
    'nav.pricing': 'Tarifs et Plans',
    'nav.methodology': 'Méthodologie',
    'nav.signIn': 'Connexion',
    'nav.signOut': 'Déconnexion',
    'nav.askAI': 'Demander à l\'IA',
    'nav.webGrounding': 'Recherche Web',
    'nav.enterpriseOS': 'Ouvrir Espace Entreprise',
    'nav.publicView': 'Vue Publique',

    // Hero
    'hero.badge': 'Intelligence Officielle sur l\'Approvisionnement en Médicaments',
    'hero.title': 'Comprendre les Signaux de Pénurie de Médicaments',
    'hero.titleHighlight': 'Sans Perdre la Source Officielle.',
    'hero.subtitle': 'Consultez les déclarations officielles de pénurie, suivez la fraîcheur des données et comparez les statuts par juridiction sans masquer l\'incertitude.',
    'hero.searchPlaceholder': 'Rechercher par substance active, marque ou code ATC...',
    'hero.searchBtn': 'Rechercher',
    'hero.commonSignals': 'Médicaments fréquents :',
    'hero.activeShortages': 'Pénuries Actives',
    'hero.monitoredFeeds': 'Flux Surveillés',
    'hero.freshnessIndex': 'Indice de Fraîcheur',
    'hero.crossSplit': 'Divergence des Sources',
    'hero.windowTitle': 'PRAMANEX LIFELINE OS v28.4 — Nœud Réglementaire Vérifié',
    'hero.tabAll': 'Vue Globale',
    'hero.tabUS': 'FDA (États-Unis)',
    'hero.tabEU': 'EMA (Union Européenne)',
    'hero.openConsole': 'Ouvrir Enterprise OS Complet',

    // Statuses
    'status.shortageDeclared': 'Pénurie Déclarée',
    'status.supplyDisruption': 'Rupture d\'Approvisionnement',
    'status.resolved': 'Résolu',
    'status.conflicting': 'Sources Contradictoires',
    'status.fresh': 'Frais (Vérifié)',
    'status.delayed': 'Synchro Retardée',
    'status.stale': 'Données Périmées',

    // Proof Strip
    'proof.officialLinked': 'Lié aux Sources Officielles',
    'proof.officialLinkedDesc': 'Directement interconnecté avec la FDA, l\'EMA, Santé Canada et la TGA.',
    'proof.jurisdictionAware': 'Différenciation Juridictionnelle',
    'proof.jurisdictionAwareDesc': 'Ne confondez jamais une rupture nationale avec une pénurie locale.',
    'proof.freshnessVisible': 'Fraîcheur des Données Visible',
    'proof.freshnessVisibleDesc': 'Horodatage exact et fréquence de synchronisation affichés sur chaque fiche.',
    'proof.humanGoverned': 'Gouvernance Humaine (HITL)',
    'proof.humanGovernedDesc': 'Disparités auditées par des pharmaciens réglementaires accrédités.',

    // Search Engine
    'search.title': 'Index Officiel d\'Approvisionnement en Médicaments',
    'search.subtitle': 'Recoupement direct avec les registres réglementaires nationaux et autocomplétion instantanée.',
    'search.inputPlaceholder': 'Saisissez le nom du médicament, la DCI ou la forme...',
    'search.recentSearches': 'Recherches Récentes',
    'search.inspectSnapshot': 'Inspecter la Preuve',
    'search.affectedPresentation': 'Présentation Affectée',
    'search.officialCause': 'Cause Officielle',
    'search.addToWatchlist': 'Ajouter aux Favoris',
    'search.removeFromWatchlist': 'Retirer des Favoris',
    'search.filterJurisdiction': 'Juridiction',
    'search.filterStatus': 'Statut de Rupture',
    'search.filterForm': 'Forme Galénique',
    'search.filterFreshness': 'Fraîcheur',
    'search.verifyGoogle': 'Vérifier avec Google Search Grounding',
    'search.foundRecords': 'enregistrements officiels trouvés',
    'search.viewDossier': 'Voir Dossier et Provenance',

    // Alerts Engine
    'alerts.title': 'Alertes Automatiques de Pénurie Multicanal',
    'alerts.subtitle': 'Notifications push web, e-mails de synthèse, SMS d\'urgence ou flux FHIR hospitalier.',
    'alerts.activateBtn': 'Activer les Alertes',
    'alerts.testBtn': 'Tester l\'Alerte',
    'alerts.channelWeb': 'Notifications Web Push',
    'alerts.channelEmail': 'Synthèse par E-mail',
    'alerts.channelSms': 'SMS d\'Urgence',
    'alerts.channelFhir': 'Intégration FHIR Hospitalière',

    // Export Dossiers
    'export.title': 'Dossiers Réglementaires et Export de Données Cliniques',
    'export.subtitle': 'Téléchargez des dossiers d\'approvisionnement vérifiés cryptographiquement.',
    'export.download': 'Télécharger',
    'export.copy': 'Copier Données',
    'export.print': 'Imprimer Dossier',
    'export.formatFhir': 'Ressource FHIR NDH (JSON)',
    'export.formatSpor': 'Modèle EMA SPOR (JSON)',
    'export.formatSpl': 'Étiquetage FDA SPL (XML)',
    'export.formatCsv': 'CSV Transfrontalier OMS DCI',

    // Global Supply Map
    'map.title': 'Carte Mondiale des Tensions d\'Approvisionnement',
    'map.subtitle': 'Surveillance géographique en temps réel des territoires FDA, EMA, Santé Canada, TGA et CDSCO.',
    'map.filterAll': 'Surveillance Globale',
    'map.filterUS': 'Amérique du Nord (FDA / SC)',
    'map.filterEU': 'Europe (EMA)',
    'map.filterAPAC': 'Asie-Pacifique (TGA / CDSCO)',
    'map.criticalShortage': 'Ruptures Critiques',
    'map.disruptions': 'Tensions d\'Approvisionnement',
    'map.stableSupply': 'Approvisionnement Stable',

    // Agent Swarm Console
    'swarm.title': 'Essaim Autonome Multi-Agents IA avec Contrôle Humain (HITL)',
    'swarm.subtitle': 'Orchestration en temps réel d\'agents Gemini spécialisés dans la réconciliation réglementaire.',
    'swarm.ingestAgent': 'Agent d\'Ingestion Réglementaire',
    'swarm.conflictAgent': 'Agent de Réconciliation des Données',
    'swarm.dossierAgent': 'Agent Rédacteur de Dossiers',
    'swarm.alertAgent': 'Agent de Diffusion des Alertes',
    'swarm.hitlSignoff': 'Valider & Apposer la Signature',
    'swarm.statusActive': 'Surveillance Active',

    // Collaborative Annotations
    'notes.title': 'Notes Cliniques Collaboratives & Triage',
    'notes.subtitle': 'Observations vérifiées par pharmaciens hospitaliers et cadres réglementaires.',
    'notes.addNote': 'Ajouter une Note Clinique',
    'notes.placeholder': 'Partagez des stratégies de substitution ou des observations d\'approvisionnement...',
    'notes.submit': 'Publier la Note',

    // Official Bulletins
    'bulletins.title': 'Bulletins Officiels et Avis Gouvernementaux',
    'bulletins.subtitle': 'Flux directs FDA MedWatch, EMA DHPC et avis Santé Canada.',
    'bulletins.viewNotice': 'Consulter l\'Avis Officiel',
    'bulletins.externalSource': 'Ouvrir le Registre Gouvernemental',

    // Consumer / Patient View
    'patient.title': 'Guide de Disponibilité des Médicaments pour Patients',
    'patient.subtitle': 'Des informations claires et simples sur les ruptures sans jargon complexe.',
    'patient.searchPlaceholder': 'Entrez le médicament que vous ou votre proche prenez...',
    'patient.myList': 'Mes Médicaments Surveillés',
    'patient.whatThisMeans': 'Qu\'est-ce que cela signifie pour moi ?',
    'patient.pharmacistAdvice': 'Consultez toujours votre pharmacien ou médecin avant toute modification de posologie.',
    'patient.trackMedicine': 'Surveiller ce Médicament',

    // Authenticated Enterprise OS
    'os.roleWorkspace': 'Mon Espace de Travail',
    'os.commandCenter': 'Centre de Contrôle',
    'os.globalMap': 'Carte des Flux',
    'os.swarm': 'Essaim IA (HITL)',
    'os.notes': 'Notes Cliniques',
    'os.bulletins': 'Bulletins Officiels',
    'os.index': 'Index Médicaments',
    'os.dossiers': 'Dossiers Réglementaires',

    // Disclaimer & Footer
    'disclaimer.text': 'Déclarations nationales officielles uniquement • Ne reflète pas l\'état des stocks en officine locale. Aucun conseil de substitution.',
    'footer.tagline': 'Intelligence d\'approvisionnement en médicaments reliée aux sources officielles.',
    'footer.rights': 'Tous droits réservés. Plateforme réglementée d\'intelligence médicale.',
  },

  de: {
    // Nav
    'nav.overview': 'Übersicht',
    'nav.search': 'Arzneimittelsuche',
    'nav.alerts': 'Engpass-Warnungen',
    'nav.export': 'Dossier Exportieren',
    'nav.command': 'Leitstelle',
    'nav.patient': 'Patientenportal',
    'nav.pricing': 'Preise & Tarife',
    'nav.methodology': 'Methodik',
    'nav.signIn': 'Anmelden',
    'nav.signOut': 'Abmelden',
    'nav.askAI': 'KI-Assistent',
    'nav.webGrounding': 'Web-Verifikation',
    'nav.enterpriseOS': 'Unternehmens-OS Öffnen',
    'nav.publicView': 'Öffentliche Ansicht',

    // Hero
    'hero.badge': 'Behördliche Lieferengpass-Intelligenz für Arzneimittel',
    'hero.title': 'Offizielle Lieferengpässe Verstehen',
    'hero.titleHighlight': 'Ohne die Quelle zu Verlieren.',
    'hero.subtitle': 'Offizielle Engpassmeldungen durchsuchen, Aktualität nachverfolgen und behördliche Signale länderübergreifend vergleichen.',
    'hero.searchPlaceholder': 'Nach Wirkstoff, Handelsname oder ATC-Code suchen...',
    'hero.searchBtn': 'Suchen',
    'hero.commonSignals': 'Häufige Präparate:',
    'hero.activeShortages': 'Aktive Engpässe',
    'hero.monitoredFeeds': 'Überwachte Behörden',
    'hero.freshnessIndex': 'Aktualitätsindex',
    'hero.crossSplit': 'Quellen-Divergenz',
    'hero.windowTitle': 'PRAMANEX LIFELINE OS v28.4 — Verifizierter Behörden-Knoten',
    'hero.tabAll': 'Globale Ansicht',
    'hero.tabUS': 'FDA (USA)',
    'hero.tabEU': 'EMA (Europäische Union)',
    'hero.openConsole': 'Vollständiges Enterprise OS Öffnen',

    // Statuses
    'status.shortageDeclared': 'Lieferengpass Gemeldet',
    'status.supplyDisruption': 'Lieferunterbrechung',
    'status.resolved': 'Behoben',
    'status.conflicting': 'Widersprüchliche Quellen',
    'status.fresh': 'Aktuell (Verifiziert)',
    'status.delayed': 'Verzögert',
    'status.stale': 'Veraltet',

    // Proof Strip
    'proof.officialLinked': 'Mit Behördenquellen Verknüpft',
    'proof.officialLinkedDesc': 'Direkt an Register von FDA, EMA, Health Canada und TGA angebunden.',
    'proof.jurisdictionAware': 'Länderspezifische Genauigkeit',
    'proof.jurisdictionAwareDesc': 'Nationale Engpässe niemals mit lokaler Vor-Ort-Verfügbarkeit verwechseln.',
    'proof.freshnessVisible': 'Sichtbare Datenaktualität',
    'proof.freshnessVisibleDesc': 'Exakter Zeitstempel und Synchronisationsrhythmus auf jedem Datensatz.',
    'proof.humanGoverned': 'Menschliche Überwachung (HITL)',
    'proof.humanGovernedDesc': 'Abweichungen zwischen Behörden werden von Fachapothekern auditiert.',

    // Search Engine
    'search.title': 'Offizieller Arzneimittel-Lieferindex',
    'search.subtitle': 'Direkter Abgleich mit behördlichen Meldungen und Autovervollständigung in Echtzeit.',
    'search.inputPlaceholder': 'Arzneimittel, Freinamen oder Darreichung eingeben...',
    'search.recentSearches': 'Letzte Suchen',
    'search.inspectSnapshot': 'Nachweis Prüfen',
    'search.affectedPresentation': 'Betroffene Darreichungsform',
    'search.officialCause': 'Behördlicher Grund',
    'search.addToWatchlist': 'Zur Beobachtung Hinzufügen',
    'search.removeFromWatchlist': 'Aus Beobachtung Entfernen',
    'search.filterJurisdiction': 'Zulassungsgebiet',
    'search.filterStatus': 'Engpass-Status',
    'search.filterForm': 'Darreichungsform',
    'search.filterFreshness': 'Aktualität',
    'search.verifyGoogle': 'Mit Google Search Grounding Verifizieren',
    'search.foundRecords': 'offizielle Datensätze gefunden',
    'search.viewDossier': 'Dossier & Herkunft Einsehen',

    // Alerts Engine
    'alerts.title': 'Automatisierte Warnungen & Multikanal-Benachrichtigung',
    'alerts.subtitle': 'Browser-Push, E-Mail-Zusammenfassungen, Notfall-SMS oder Krankenhaus-FHIR-Schnittstellen.',
    'alerts.activateBtn': 'Engpass-Warnungen Aktivieren',
    'alerts.testBtn': 'Warnung Testen',
    'alerts.channelWeb': 'Browser-Push-Benachrichtigung',
    'alerts.channelEmail': 'E-Mail-Zusammenfassung',
    'alerts.channelSms': 'Dringende SMS',
    'alerts.channelFhir': 'Klinik-FHIR-Integration',

    // Export Dossiers
    'export.title': 'Regulatorische Dossiers & Klinischer Datenexport',
    'export.subtitle': 'Kryptografisch verifizierte Lieferberichte in behördlichen Standardformaten herunterladen.',
    'export.download': 'Datei Herunterladen',
    'export.copy': 'Daten Kopieren',
    'export.print': 'Dossier Drucken',
    'export.formatFhir': 'FHIR NDH Ressource (JSON)',
    'export.formatSpor': 'EMA SPOR Modell (JSON)',
    'export.formatSpl': 'FDA Structured Labeling (XML)',
    'export.formatCsv': 'WHO INN Grenzüberschreitende CSV',

    // Global Supply Map
    'map.title': 'Globale Karte der Lieferengpässe',
    'map.subtitle': 'Echtzeit-Überwachung in Hoheitsgebieten von FDA, EMA, Health Canada, TGA und CDSCO.',
    'map.filterAll': 'Globale Überwachung',
    'map.filterUS': 'Nordamerika (FDA / HC)',
    'map.filterEU': 'Europa (EMA)',
    'map.filterAPAC': 'Asien-Pazifik (TGA / CDSCO)',
    'map.criticalShortage': 'Kritische Engpässe',
    'map.disruptions': 'Aktive Unterbrechungen',
    'map.stableSupply': 'Stabile Versorgung',

    // Agent Swarm Console
    'swarm.title': 'Autonomer Multi-Agenten KI-Schwarm mit Human-in-the-Loop',
    'swarm.subtitle': 'Echtzeit-Orchestrierung spezialisierter Gemini-Agenten zur regulatorischen Abstimmung.',
    'swarm.ingestAgent': 'Behörden-Erfassungs-Agent',
    'swarm.conflictAgent': 'Quellen-Abgleichs-Agent',
    'swarm.dossierAgent': 'Dossier-Erstellungs-Agent',
    'swarm.alertAgent': 'Signal-Ausgabe-Agent',
    'swarm.hitlSignoff': 'Signal Freigeben & Signieren',
    'swarm.statusActive': 'Aktive Überwachung',

    // Collaborative Annotations
    'notes.title': 'Kollaborative Klinische Notizen & Triage',
    'notes.subtitle': 'Verifizierte Notizen von Krankenhausapothekern und regulatorischen Leitern.',
    'notes.addNote': 'Klinische Notiz Hinzufügen',
    'notes.placeholder': 'Substitutionsstrategien oder Versorgungsbeobachtungen teilen...',
    'notes.submit': 'Notiz Veröffentlichen',

    // Official Bulletins
    'bulletins.title': 'Behördliche Bulletins & Mitteilungen',
    'bulletins.subtitle': 'Direktnachrichten von FDA MedWatch, EMA DHPC und Health Canada.',
    'bulletins.viewNotice': 'Offizielle Mitteilung Öffnen',
    'bulletins.externalSource': 'Behördenquelle Öffnen',

    // Consumer / Patient View
    'patient.title': 'Arzneimittel-Leitfaden für Patienten & Angehörige',
    'patient.subtitle': 'Verständliche Informationen zu Engpässen ohne Fachjargon.',
    'patient.searchPlaceholder': 'Medikament eingeben, das Sie oder Ihre Familie einnehmen...',
    'patient.myList': 'Meine Beobachteten Medikamente',
    'patient.whatThisMeans': 'Was bedeutet das für mich?',
    'patient.pharmacistAdvice': 'Fragen Sie vor einer Dosisänderung stets Ihren behandelnden Arzt oder Apotheker.',
    'patient.trackMedicine': 'Medikament Beobachten',

    // Authenticated Enterprise OS
    'os.roleWorkspace': 'Mein Arbeitsbereich',
    'os.commandCenter': 'Leitstelle',
    'os.globalMap': 'Lieferkarte',
    'os.swarm': 'KI-Schwarm (HITL)',
    'os.notes': 'Klinische Notizen',
    'os.bulletins': 'Behörden-Bulletins',
    'os.index': 'Arzneimittel-Index',
    'os.dossiers': 'Export-Dossiers',

    // Disclaimer & Footer
    'disclaimer.text': 'Ausschließlich offizielle nationale Meldungen • Kein lokaler Apothekenbestand dargestellt. Keine therapeutische Beratung.',
    'footer.tagline': 'Quellentreue, aktualitätsbezogene Arzneimittel-Lieferengpass-Intelligenz.',
    'footer.rights': 'Alle Rechte vorbehalten. Regulierte medizinische Versorgungsplattform.',
  },
};

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pramanex_language') as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) {
        setCurrentLanguage(saved);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('pramanex_language', lang);
    } catch {
      // LocalStorage fallback
    }
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
