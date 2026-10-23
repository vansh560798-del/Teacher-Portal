import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  nfcTapToOpen: string;
  tapCardPrompt: string;
  digitalProfile: string;
  smartAttendance: string;
  personalDashboard: string;
  timetableAccess: string;
  resourceLibrary: string;
  leaveManagement: string;
  staffVerification: string;
  emergencyInfo: string;
  lostCardProtection: string;
  customReporting: string;
  biometricAuth: string;
  aiCopilot: string;
  offlineMode: string;
  onlineSynced: string;
  cloudBackup: string;
  pushNotifications: string;
  checkIn: string;
  checkOut: string;
  verified: string;
  active: string;
  deactivated: string;
  saveChanges: string;
  cancel: string;
  generateReport: string;
  requestLeave: string;
  switchLanguage: string;
  todayClasses: string;
  quickActions: string;
  recentSecurityAlerts: string;
  studentGrowth: string;
  assignmentsToGrade: string;
  clockedIn: string;
  clockedOut: string;
  scanCardToDock: string;
  lowLatencyMode: string;
  deepThinkingMode: string;
}

const dictionaries: Record<Language, Translations> = {
  en: {
    appName: 'AirNix Educator OS',
    tagline: 'Smart Teacher ID & Classroom Command System',
    nfcTapToOpen: 'NFC Tap-to-Open',
    tapCardPrompt: 'Tap NFC Card to Terminal Reader',
    digitalProfile: 'Digital Teacher Profile',
    smartAttendance: 'Smart Attendance',
    personalDashboard: 'Teacher Dashboard',
    timetableAccess: 'Timetable & Classrooms',
    resourceLibrary: 'Teaching Resource Library',
    leaveManagement: 'Leave Management',
    staffVerification: 'Digital Staff Verification',
    emergencyInfo: 'Emergency Protocol',
    lostCardProtection: 'Lost-Card Protection',
    customReporting: 'Automated Progress Reports',
    biometricAuth: 'Biometric Scanner',
    aiCopilot: 'AirNix AI Co-Pilot',
    offlineMode: 'Offline Cache Active',
    onlineSynced: 'Cloud Synced',
    cloudBackup: 'Cloud Backup & Sync',
    pushNotifications: 'System Alerts & Logs',
    checkIn: 'Clock In',
    checkOut: 'Clock Out',
    verified: 'Verified Staff',
    active: 'Card Active',
    deactivated: 'Card Revoked',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    generateReport: 'Generate AI Growth Report',
    requestLeave: 'Submit Leave Request',
    switchLanguage: 'Language',
    todayClasses: "Today's Schedule",
    quickActions: 'Terminal Quick Actions',
    recentSecurityAlerts: 'Security & Access Logs',
    studentGrowth: 'Student Performance & Growth',
    assignmentsToGrade: 'Assignments to Grade',
    clockedIn: 'Clocked In',
    clockedOut: 'Clocked Out',
    scanCardToDock: 'Dock Card onto Reader',
    lowLatencyMode: 'Low-Latency (Flash-Lite)',
    deepThinkingMode: 'Pedagogical Deep Reasoner',
  },
  es: {
    appName: 'AirNix Educador OS',
    tagline: 'Identificación Inteligente y Sistema para Docentes',
    nfcTapToOpen: 'Toque NFC para Abrir',
    tapCardPrompt: 'Toque la tarjeta en el lector de la terminal',
    digitalProfile: 'Perfil Digital del Docente',
    smartAttendance: 'Asistencia Inteligente',
    personalDashboard: 'Panel de Control',
    timetableAccess: 'Horario y Acceso al Aula',
    resourceLibrary: 'Biblioteca de Recursos Docentes',
    leaveManagement: 'Gestión de Permisos',
    staffVerification: 'Verificación Digital del Personal',
    emergencyInfo: 'Protocolo de Emergencia',
    lostCardProtection: 'Protección de Tarjeta Extraviada',
    customReporting: 'Informes de Progreso Automatizados',
    biometricAuth: 'Escáner Biométrico',
    aiCopilot: 'Copiloto de IA AirNix',
    offlineMode: 'Modo Offline Activo',
    onlineSynced: 'Sincronizado en la Nube',
    cloudBackup: 'Copia y Sincronización',
    pushNotifications: 'Alertas y Notificaciones',
    checkIn: 'Registrar Entrada',
    checkOut: 'Registrar Salida',
    verified: 'Personal Verificado',
    active: 'Tarjeta Activa',
    deactivated: 'Tarjeta Revocada',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    generateReport: 'Generar Informe con IA',
    requestLeave: 'Solicitar Permiso',
    switchLanguage: 'Idioma',
    todayClasses: 'Clases de Hoy',
    quickActions: 'Acciones Rápidas',
    recentSecurityAlerts: 'Registro de Seguridad',
    studentGrowth: 'Crecimiento del Estudiante',
    assignmentsToGrade: 'Tareas por Calificar',
    clockedIn: 'Registrado',
    clockedOut: 'Fuera de Servicio',
    scanCardToDock: 'Acercar Tarjeta al Lector',
    lowLatencyMode: 'Baja Latencia (Rápido)',
    deepThinkingMode: 'Análisis Pedagógico Profundo',
  },
  fr: {
    appName: 'AirNix Éducateur OS',
    tagline: 'Badge NFC Intelligent et Gestion de Classe',
    nfcTapToOpen: 'Badge NFC sans contact',
    tapCardPrompt: 'Posez votre badge sur la borne',
    digitalProfile: 'Profil Numérique Enseignant',
    smartAttendance: 'Présence Intelligente',
    personalDashboard: 'Tableau de Bord',
    timetableAccess: 'Emploi du Temps & Salles',
    resourceLibrary: 'Bibliothèque Pédagogique',
    leaveManagement: 'Gestion des Congés',
    staffVerification: 'Vérification Numérique',
    emergencyInfo: 'Protocole d’Urgence',
    lostCardProtection: 'Protection Badge Perdu',
    customReporting: 'Rapports de Progression IA',
    biometricAuth: 'Authentification Biométrique',
    aiCopilot: 'Assistant IA AirNix',
    offlineMode: 'Mode Hors-Ligne Actif',
    onlineSynced: 'Synchronisé au Cloud',
    cloudBackup: 'Sauvegarde Cloud',
    pushNotifications: 'Alertes Système',
    checkIn: 'Pointer Entrée',
    checkOut: 'Pointer Sortie',
    verified: 'Personnel Autorisé',
    active: 'Badge Actif',
    deactivated: 'Badge Désactivé',
    saveChanges: 'Enregistrer',
    cancel: 'Annuler',
    generateReport: 'Générer Bilan IA',
    requestLeave: 'Demande de Congé',
    switchLanguage: 'Langue',
    todayClasses: 'Cours du Jour',
    quickActions: 'Actions Rapides',
    recentSecurityAlerts: 'Journal de Sécurité',
    studentGrowth: 'Évolution des Élèves',
    assignmentsToGrade: 'Devoirs à Noter',
    clockedIn: 'Présent(e)',
    clockedOut: 'Sorti(e)',
    scanCardToDock: 'Scanner le Badge',
    lowLatencyMode: 'Mode Rapide (Flash-Lite)',
    deepThinkingMode: 'Analyse Pédagogique Poussée',
  },
  de: {
    appName: 'AirNix Pädagogen OS',
    tagline: 'Intelligenter NFC-Dienstausweis & Schulsystem',
    nfcTapToOpen: 'NFC Kontaktlos-Login',
    tapCardPrompt: 'Karte an das Lesegerät halten',
    digitalProfile: 'Digitales Lehrkraftprofil',
    smartAttendance: 'Smarte Zeiterfassung',
    personalDashboard: 'Lehrer-Dashboard',
    timetableAccess: 'Stundenplan & Raumzugang',
    resourceLibrary: 'Unterrichtsmaterialien',
    leaveManagement: 'Urlaubsverwaltung',
    staffVerification: 'Digitale Mitarbeiterverifizierung',
    emergencyInfo: 'Notfallprotokoll',
    lostCardProtection: 'Karten-Verlustschutz',
    customReporting: 'Automatisierte Berichte',
    biometricAuth: 'Biometrie-Scanner',
    aiCopilot: 'AirNix KI-Assistent',
    offlineMode: 'Offline-Modus aktiv',
    onlineSynced: 'Cloud synchronisiert',
    cloudBackup: 'Cloud-Sicherung',
    pushNotifications: 'Systembenachrichtigungen',
    checkIn: 'Einstempeln',
    checkOut: 'Ausstempeln',
    verified: 'Verifiziert',
    active: 'Karte Aktiv',
    deactivated: 'Karte Gesperrt',
    saveChanges: 'Speichern',
    cancel: 'Abbrechen',
    generateReport: 'KI-Bericht erstellen',
    requestLeave: 'Urlaub beantragen',
    switchLanguage: 'Sprache',
    todayClasses: 'Heutige Stunden',
    quickActions: 'Schnellzugriff',
    recentSecurityAlerts: 'Sicherheitsberichte',
    studentGrowth: 'Schülerfortschritt',
    assignmentsToGrade: 'Zu benotende Aufgaben',
    clockedIn: 'Anwesend',
    clockedOut: 'Abgemeldet',
    scanCardToDock: 'Karte an Terminal halten',
    lowLatencyMode: 'Niedrige Latenz (Flash-Lite)',
    deepThinkingMode: 'Pädagogische Tiefenanalyse',
  },
  ar: {
    appName: 'AirNix لنظام المعلمين',
    tagline: 'بطاقة الهوية الذكية ونظام إدارة الفصول الدراسية',
    nfcTapToOpen: 'فتح باللمس عبر NFC',
    tapCardPrompt: 'المس بطاقتك بقارئ الجهاز',
    digitalProfile: 'الملف الرقمي للمعلم',
    smartAttendance: 'الحضور والانصراف الذكي',
    personalDashboard: 'لوحة التحكم للمعلم',
    timetableAccess: 'الجدول الدراسي والصفوف',
    resourceLibrary: 'مكتبة الموارد التعليمية',
    leaveManagement: 'إدارة الإجازات',
    staffVerification: 'التحقق الرقمي من الكادر',
    emergencyInfo: 'معلومات وبروتوكول الطوارئ',
    lostCardProtection: 'حماية البطاقة المفقودة',
    customReporting: 'تقارير النمو الأكاديمي المؤتمتة',
    biometricAuth: 'التحقق البيومتري',
    aiCopilot: 'مساعد AirNix الذكي',
    offlineMode: 'العمل دون اتصال مفعل',
    onlineSynced: 'متزامن مع السحابة',
    cloudBackup: 'النسخ السحابي',
    pushNotifications: 'التنبيهات وسجلات الأمان',
    checkIn: 'تسجيل الحضور',
    checkOut: 'تسجيل الانصراف',
    verified: 'كادر معتمد',
    active: 'البطاقة نشطة',
    deactivated: 'تم إيقاف البطاقة',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    generateReport: 'توليد تقرير الذكاء الاصطناعي',
    requestLeave: 'طلب إجازة',
    switchLanguage: 'اللغة',
    todayClasses: 'جدول حصص اليوم',
    quickActions: 'إجراءات سريعة',
    recentSecurityAlerts: 'سجل الأمان والوصول',
    studentGrowth: 'مستوى نمو وتحصيل الطلاب',
    assignmentsToGrade: 'واجبات قيد التصحيح',
    clockedIn: 'تم الحضور',
    clockedOut: 'تم الانصراف',
    scanCardToDock: 'تمرير البطاقة للقارئ',
    lowLatencyMode: 'استجابة فائقة السرعة',
    deepThinkingMode: 'تحليل تربوي معمق',
  },
  hi: {
    appName: 'AirNix शिक्षक OS',
    tagline: 'स्मार्ट शिक्षक आईडी और कक्षा प्रबंधन प्रणाली',
    nfcTapToOpen: 'NFC टैप-टू-ओपन',
    tapCardPrompt: 'टर्मिनल रीडर पर कार्ड टैप करें',
    digitalProfile: 'डिजिटल शिक्षक प्रोफाइल',
    smartAttendance: 'स्मार्ट उपस्थिति',
    personalDashboard: 'शिक्षक डैशबोर्ड',
    timetableAccess: 'समय सारिणी और कक्षाएं',
    resourceLibrary: 'शिक्षण संसाधन पुस्तकालय',
    leaveManagement: 'अवकाश प्रबंधन',
    staffVerification: 'डिजिटल कर्मचारी सत्यापन',
    emergencyInfo: 'आपातकालीन प्रोटोकॉल',
    lostCardProtection: 'खोए हुए कार्ड की सुरक्षा',
    customReporting: 'स्वचालित प्रगति रिपोर्ट',
    biometricAuth: 'बायोमेट्रिक सत्यापन',
    aiCopilot: 'AirNix AI सहायक',
    offlineMode: 'ऑफ़लाइन कैश सक्रिय',
    onlineSynced: 'क्लाउड सिंक हुआ',
    cloudBackup: 'क्लाउड बैकअप',
    pushNotifications: 'सुरक्षा सूचनाएं',
    checkIn: 'चेक-इन करें',
    checkOut: 'चेक-आउट करें',
    verified: 'सत्यापित शिक्षक',
    active: 'कार्ड सक्रिय',
    deactivated: 'कार्ड निलंबित',
    saveChanges: 'सहेजें',
    cancel: 'रद्द करें',
    generateReport: 'AI रिपोर्ट बनाएं',
    requestLeave: 'छुट्टी का आवेदन करें',
    switchLanguage: 'भाषा',
    todayClasses: 'आज का समय पत्रक',
    quickActions: 'त्वरित क्रियाएं',
    recentSecurityAlerts: 'सुरक्षा अलर्ट लॉग्स',
    studentGrowth: 'छात्र प्रगति और ग्रेड',
    assignmentsToGrade: 'जांचने हेतु असाइनमेंट',
    clockedIn: 'उपस्थित',
    clockedOut: 'प्रस्थान',
    scanCardToDock: 'कार्ड को टर्मिनल पर रखें',
    lowLatencyMode: 'त्वरित गति (Flash-Lite)',
    deepThinkingMode: 'गहन शैक्षणिक विश्लेषण',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: dictionaries.en,
  isRtl: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('airnix_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('airnix_lang', lang);
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language], isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
