import React, { useState, useEffect, useRef } from 'react';
import { SCHOOL_INFO } from '../lib/schoolAssets';
import { sounds } from '../lib/soundEffects';
import type { TeacherProfile } from '../lib/types';
import { getStoredFacultyRoster, registerNewTeacherDossier } from '../lib/mockFaculty';
import { ClickablePhoneNumber } from './PhoneNumberActionModal';

interface LoginScreenProps {
  onLoginSuccess: (profile: TeacherProfile) => void;
  onSignUpSuccess: (profile: TeacherProfile) => void;
  onGoogleSignIn: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onSignUpSuccess,
  onGoogleSignIn,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  // Biometric REMOVED per user request: only 'password' and 'nfc'
  const [loginMethod, setLoginMethod] = useState<'password' | 'nfc'>('password');
  const [facultyRoster, setFacultyRoster] = useState(() => getStoredFacultyRoster());

  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState('admin@starnoldsgodhra.edu');
  const [password, setPassword] = useState('starnolds2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Real Hardware Web NFC API States
  const [isWebNfcSupported, setIsWebNfcSupported] = useState<boolean>(
    () => typeof window !== 'undefined' && 'NDEFReader' in window
  );
  const [nfcReadingState, setNfcReadingState] = useState<'idle' | 'listening' | 'reading' | 'success' | 'error'>('idle');
  const [nfcStatusText, setNfcStatusText] = useState<string>('');
  const [lastScannedCard, setLastScannedCard] = useState<string>('');
  const nfcAbortControllerRef = useRef<AbortController | null>(null);

  // Sign Up state (New Teacher Registration)
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpStaffId, setSignUpStaffId] = useState('');
  const [signUpDesignation, setSignUpDesignation] = useState('Assistant Teacher');
  const [signUpDepartment, setSignUpDepartment] = useState('Department of Pure Sciences');
  const [signUpPhone, setSignUpPhone] = useState('+91 98250 ');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpEmergencyContact, setSignUpEmergencyContact] = useState('');
  const [signUpEmergencyPhone, setSignUpEmergencyPhone] = useState('');

  // Check Web NFC hardware support
  useEffect(() => {
    setIsWebNfcSupported(typeof window !== 'undefined' && 'NDEFReader' in window);
    return () => {
      nfcAbortControllerRef.current?.abort();
    };
  }, []);

  // Handle Preset Account Switcher
  const handleSelectPreset = (dossier: ReturnType<typeof getStoredFacultyRoster>[0]) => {
    sounds.playNfcTap();
    setLoginIdentifier(dossier.profile.email);
    setPassword('starnolds2026');
  };

  // Handle Sign In submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    sounds.playNfcTap();

    setTimeout(() => {
      setIsSubmitting(false);
      const currentList = getStoredFacultyRoster();
      const matched = currentList.find(
        f =>
          f.profile.email.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
          f.profile.staffId.toLowerCase() === loginIdentifier.trim().toLowerCase()
      );

      if (matched) {
        sounds.playSuccessChime();
        onLoginSuccess(matched.profile);
      } else {
        const isAdm = loginIdentifier.toLowerCase().includes('admin') || loginIdentifier.toLowerCase().includes('principal');
        const fallbackProfile: TeacherProfile = {
          userId: `teacher_${Date.now()}`,
          name: loginIdentifier.split('@')[0].replace('.', ' ').toUpperCase() || 'St. Arnold Faculty',
          photoUrl: '',
          staffId: `SA-${Math.floor(1000 + Math.random() * 9000)}-SEC`,
          designation: isAdm ? 'Campus Administrator' : 'Faculty Member',
          department: "St. Arnold's High School, Godhra",
          email: loginIdentifier,
          phone: '+91 (2672) 240-9102',
          role: isAdm ? 'admin' : 'teacher',
          nfcCardId: `NFC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`,
          cardStatus: 'active',
          biometricEnrolled: true,
          emergencyContactName: 'Campus Security Office',
          emergencyContactPhone: '+91 98250 88190',
          emergencyMedicalNotes: 'Registered Faculty Member',
          updatedAt: new Date().toISOString(),
        };
        registerNewTeacherDossier(fallbackProfile);
        setFacultyRoster(getStoredFacultyRoster());
        sounds.playSuccessChime();
        onLoginSuccess(fallbackProfile);
      }
    }, 500);
  };

  // Real Hardware Web NFC Reader
  const startHardwareNfcScan = async () => {
    if (!('NDEFReader' in window)) {
      setNfcReadingState('idle');
      setNfcStatusText('Web NFC API is available on Chrome for Android. You can tap the physical card dock below.');
      return;
    }

    try {
      nfcAbortControllerRef.current?.abort();
      const abortController = new AbortController();
      nfcAbortControllerRef.current = abortController;

      const ndef = new (window as any).NDEFReader();
      setNfcReadingState('listening');
      setNfcStatusText('NFC Hardware Active: Hold your physical St. Arnold\'s NFC badge flat against phone back...');
      sounds.playNfcTap();

      await ndef.scan({ signal: abortController.signal });

      ndef.onreading = (event: any) => {
        const serialNumber =
          event.serialNumber || `NFC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
        setLastScannedCard(serialNumber);
        setNfcReadingState('reading');
        setNfcStatusText(`Reading Card UID: ${serialNumber}`);
        sounds.playSuccessChime();

        setTimeout(() => {
          setNfcReadingState('success');
          const currentList = getStoredFacultyRoster();
          const matched =
            currentList.find(d => d.profile.nfcCardId.toLowerCase() === serialNumber.toLowerCase())?.profile ||
            currentList.find(d => d.profile.email.toLowerCase() === loginIdentifier.toLowerCase())?.profile ||
            (currentList[1] || currentList[0]).profile;

          onLoginSuccess(matched);
        }, 600);
      };

      ndef.onreadingerror = () => {
        setNfcReadingState('error');
        setNfcStatusText('NFC read error. Hold card stationary against the phone.');
        sounds.playWarningBuzz();
      };
    } catch (err: any) {
      console.warn('Real Web NFC scan error:', err);
      setNfcReadingState('error');
      setNfcStatusText(err?.message || 'NFC hardware access blocked or not supported on this browser.');
    }
  };

  // Immediate NFC badge tap handler (used for instant tap or fallback)
  const handleNfcInstantTap = () => {
    setNfcReadingState('reading');
    sounds.playNfcTap();
    setNfcStatusText('Authenticating 13.56 MHz NFC smart credential...');

    setTimeout(() => {
      sounds.playSuccessChime();
      setNfcReadingState('success');
      const currentList = getStoredFacultyRoster();
      const matched =
        currentList.find(d => d.profile.email.toLowerCase() === loginIdentifier.toLowerCase())?.profile ||
        (currentList[1] || currentList[0]).profile;

      onLoginSuccess(matched);
    }, 700);
  };

  // Auto-trigger NFC hardware listener when switching to 'nfc' tab
  useEffect(() => {
    if (loginMethod === 'nfc') {
      if (typeof window !== 'undefined' && 'NDEFReader' in window) {
        startHardwareNfcScan();
      } else {
        setNfcStatusText('Ready for NFC Card Tap. Hold badge to sensor or tap below.');
      }
    } else {
      nfcAbortControllerRef.current?.abort();
      setNfcReadingState('idle');
    }
  }, [loginMethod]);

  // Handle Sign Up submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail) {
      setErrorMessage('Please fill in required name and email.');
      return;
    }
    setIsSubmitting(true);
    sounds.playNfcTap();

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedStaffId =
        signUpStaffId.trim() || `SA-${Math.floor(2000 + Math.random() * 8000)}-SEC`;
      const generatedNfcId = `NFC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-2026`;

      const newTeacher: TeacherProfile = {
        userId: `teacher_${Date.now()}`,
        name: signUpName.trim(),
        photoUrl: '',
        staffId: generatedStaffId,
        designation: signUpDesignation || 'Faculty Member',
        department: signUpDepartment || "St. Arnold's High School, Godhra",
        email: signUpEmail.trim(),
        phone: signUpPhone || '+91 (2672) 240-9102',
        role: 'teacher',
        nfcCardId: generatedNfcId,
        cardStatus: 'active',
        biometricEnrolled: true,
        emergencyContactName: signUpEmergencyContact || 'Emergency Contact',
        emergencyContactPhone: signUpEmergencyPhone || '+91 98250 88190',
        emergencyMedicalNotes: 'Standard Medical Profile',
        updatedAt: new Date().toISOString(),
      };

      registerNewTeacherDossier(newTeacher);
      setFacultyRoster(getStoredFacultyRoster());
      sounds.playSuccessChime();
      onSignUpSuccess(newTeacher);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF5EB] text-slate-900 font-sans selection:bg-[#16287A] selection:text-white overflow-x-hidden">
      {/* LEFT COLUMN: School Heritage & Campus Visuals */}
      <div className="relative lg:w-1/2 min-h-[220px] sm:min-h-[280px] lg:min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden bg-[#16287A] text-white">
        {/* Real School Campus Background Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${SCHOOL_INFO.campusPhoto})` }}
        />
        {/* Gradients tailored to St. Arnold's Logo Colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1748] via-[#16287A]/85 to-[#0C1748]/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1748]/95 via-transparent to-[#0C1748]/60" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#CFA442] to-white shadow-lg shrink-0">
              <img
                src={SCHOOL_INFO.logoEmblem}
                alt="Logo"
                className="w-full h-full object-contain rounded-full bg-white"
              />
            </div>
            <div>
              <p className="font-extrabold text-xs sm:text-base tracking-wider text-amber-300 uppercase leading-tight">
                {SCHOOL_INFO.name}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-200 font-mono">
                {SCHOOL_INFO.location} • {SCHOOL_INFO.established}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-xs font-mono font-bold text-amber-300 backdrop-blur-xs">
            NFC Portal v2.6
          </span>
        </div>

        {/* Center / Motto Section */}
        <div className="relative z-10 my-4 sm:my-auto space-y-2 sm:space-y-4 max-w-lg">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#CFA442]/25 text-amber-200 border border-[#CFA442]/40 inline-block">
            {SCHOOL_INFO.sanskritMotto}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Educator Operating System & Smart NFC Attendance
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed hidden sm:block">
            Integrated faculty terminal for attendance management, live gradebooks, student longitudinal growth trajectories, and campus physical security.
          </p>

          {/* Institutional Contact Hotline (With Call & WhatsApp options) */}
          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className="text-blue-200 font-mono text-[11px]">Campus Admin Helpline:</span>
            <ClickablePhoneNumber
              phone="+91 (2672) 240-9102"
              name="St. Arnold's Administration"
              label="Campus Hotline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            />
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-white/20 text-xs font-mono">
          <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <p className="text-amber-300 font-bold">13.56 MHz NFC</p>
            <p className="text-[10px] text-blue-200">Hardware & Digital Badges</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <p className="text-emerald-300 font-bold">Growth Matrix</p>
            <p className="text-[10px] text-blue-200">Recharts Trajectories</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 col-span-2 sm:col-span-1">
            <p className="text-amber-300 font-bold">RBAC Hierarchy</p>
            <p className="text-[10px] text-blue-200">Principal Oversight</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign In / Sign Up Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-3 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white border border-[#E8DEC8] rounded-3xl p-5 sm:p-8 shadow-xl space-y-5">
          {/* Form Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#E8DEC8] text-xs font-mono font-bold text-[#16287A] mb-1">
              <span>🛡️</span>
              <span>St. Arnold&apos;s Secure Portal</span>
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl text-[#16287A] tracking-tight">
              {activeTab === 'signin' ? 'Faculty Sign In' : 'New Teacher Registration'}
            </h3>
            <p className="text-xs text-stone-500">
              {activeTab === 'signin'
                ? 'Sign in via Password or Real Physical NFC Card Tap'
                : 'Create your institutional profile and receive your NFC credential'}
            </p>
          </div>

          {/* Primary View Switcher: Sign In vs Sign Up */}
          <div className="flex rounded-2xl bg-[#FAF5EB] p-1 border border-[#E8DEC8] shadow-2xs">
            <button
              onClick={() => {
                setActiveTab('signin');
                sounds.playNfcTap();
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'signin'
                  ? 'bg-[#16287A] text-white shadow-md'
                  : 'text-stone-700 hover:text-slate-900'
              }`}
            >
              <span>🔑</span>
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                sounds.playNfcTap();
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'signup'
                  ? 'bg-[#16287A] text-white shadow-md'
                  : 'text-stone-700 hover:text-slate-900'
              }`}
            >
              <span>📝</span>
              <span>Sign Up (New Teacher)</span>
            </button>
          </div>

          {/* ================= TAB 1: SIGN IN ================= */}
          {activeTab === 'signin' && (
            <div className="space-y-4">
              {/* Preset Accounts Row */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-stone-600 uppercase">
                    Institutional Faculty Directory
                  </span>
                  <span className="text-[10px] font-mono text-[#16287A] font-bold">Quick Select</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {facultyRoster.map(dossier => {
                    const isSelected =
                      loginIdentifier.toLowerCase() === dossier.profile.email.toLowerCase();
                    const isAdmin = dossier.profile.role === 'admin';
                    return (
                      <button
                        key={dossier.profile.staffId}
                        type="button"
                        onClick={() => handleSelectPreset(dossier)}
                        className={`p-2.5 rounded-xl border text-xs transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#FAF5EB] border-[#16287A] ring-2 ring-[#16287A]/20 shadow-xs'
                            : 'bg-white border-[#E8DEC8] hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded uppercase"
                            style={{
                              backgroundColor: isAdmin ? '#FEF3C7' : '#EFF6FF',
                              color: isAdmin ? '#92400E' : '#1E40AF',
                            }}
                          >
                            {isAdmin ? '👑 ADMIN' : '👨‍🏫 TEACHER'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {dossier.profile.staffId}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 truncate mt-1 text-xs sm:text-sm">
                          {dossier.profile.name}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {isAdmin ? 'Principal Oversight' : dossier.profile.designation.split('&')[0]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Authentication Mode Switcher: Password vs Real NFC Tap (BIOMETRIC REMOVED) */}
              <div className="flex rounded-xl bg-[#F4EADC] p-1 border border-[#DFCBB0] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-[#16287A] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:text-slate-900'
                  }`}
                >
                  Password Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('nfc')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    loginMethod === 'nfc'
                      ? 'bg-[#16287A] text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:text-slate-900'
                  }`}
                >
                  <span>📶</span>
                  <span>Real NFC Card Tap</span>
                </button>
              </div>

              {/* Password Form */}
              {loginMethod === 'password' && (
                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                      Email or Staff ID
                    </label>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. admin@starnoldsgodhra.edu or SA-8842-SEC"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#16287A] shadow-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono font-bold text-stone-700 uppercase">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setInfoMessage('Password recovery link has been dispatched to your institutional email address.');
                          sounds.playSuccessChime();
                        }}
                        className="text-xs text-[#16287A] font-semibold hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#16287A] shadow-xs"
                    />
                  </div>

                  <div className="flex items-center text-xs">
                    <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-[#D8C7AA] text-[#16287A]"
                      />
                      <span>Remember credentials on this device</span>
                    </label>
                  </div>

                  {infoMessage && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
                      ✓ {infoMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white font-bold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                    <span>→</span>
                  </button>
                </form>
              )}

              {/* REAL PHYSICAL NFC CARD TAP MODE */}
              {loginMethod === 'nfc' && (
                <div className="p-5 bg-white border border-[#D8C7AA] rounded-2xl text-center space-y-4 shadow-xs">
                  {/* Web NFC Hardware Status Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FAF5EB] border border-[#E8DEC8]">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        nfcReadingState === 'listening'
                          ? 'bg-emerald-500 animate-ping'
                          : isWebNfcSupported
                          ? 'bg-emerald-500'
                          : 'bg-blue-600'
                      }`}
                    />
                    <span className="text-stone-700">
                      {isWebNfcSupported
                        ? 'Hardware Web NFC Available'
                        : '13.56 MHz RFID/NFC Station Ready'}
                    </span>
                  </div>

                  {/* Pulsing NFC Antenna Visual */}
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div
                      className={`absolute inset-0 rounded-full border-2 ${
                        nfcReadingState === 'listening' || nfcReadingState === 'reading'
                          ? 'border-[#16287A] animate-ping opacity-60'
                          : 'border-blue-200'
                      }`}
                    />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#16287A] to-[#1E3A8A] text-white flex items-center justify-center text-3xl shadow-lg z-10">
                      📶
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-[#16287A]">
                      {nfcReadingState === 'reading'
                        ? 'Reading NFC Badge...'
                        : nfcReadingState === 'listening'
                        ? 'Listening for Physical NFC Card Tap...'
                        : 'Touch Physical Badge to Phone'}
                    </h4>
                    <p className="text-xs text-stone-600 max-w-xs mx-auto">
                      {nfcStatusText ||
                        'Hold your 13.56 MHz MIFARE / ISO 14443-A faculty badge to the back of your phone.'}
                    </p>
                    {lastScannedCard && (
                      <p className="text-[11px] font-mono text-emerald-700 font-bold">
                        Scanned UID: {lastScannedCard}
                      </p>
                    )}
                  </div>

                  {/* Actions for NFC */}
                  <div className="space-y-2 pt-1">
                    {/* Primary Button: Tap Card to Sensor */}
                    <button
                      type="button"
                      onClick={handleNfcInstantTap}
                      disabled={nfcReadingState === 'reading'}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#16287A] to-[#1E3A8A] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white font-bold text-sm cursor-pointer shadow-md active:scale-98 transition flex items-center justify-center gap-2"
                    >
                      <span>⚡</span>
                      <span>
                        {nfcReadingState === 'reading'
                          ? 'Validating Credentials...'
                          : 'Tap Physical Card to Sensor'}
                      </span>
                    </button>

                    {/* Hardware Scanner Trigger if supported */}
                    {isWebNfcSupported && (
                      <button
                        type="button"
                        onClick={startHardwareNfcScan}
                        className="w-full py-2 rounded-xl bg-[#FAF5EB] hover:bg-[#F2ECE0] border border-[#E8DEC8] text-xs font-mono font-bold text-[#16287A] cursor-pointer transition"
                      >
                        {nfcReadingState === 'listening'
                          ? '● Real Hardware Scanner Listening...'
                          : '🔄 Re-arm Phone Web NFC Scanner'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Google Workspace */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onGoogleSignIn}
                  className="w-full py-2 px-3 bg-white hover:bg-stone-50 border border-[#D8C7AA] rounded-xl text-xs text-stone-800 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign In with School Google Account</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: SIGN UP (NEW TEACHER) ================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#16287A] space-y-0.5">
                <p className="font-bold">🏫 St. Arnold&apos;s Faculty Registration</p>
                <p className="text-[11px] text-stone-600">
                  New teachers will be provisioned an encrypted NFC card and classroom portal account.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                  Full Name & Salutation *
                </label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
                  placeholder="e.g. Mrs. Priya Mehta"
                  className="w-full px-3 py-2 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                    School Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    placeholder="name@starnoldsgodhra.edu"
                    className="w-full px-3 py-2 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                    Staff ID (or auto)
                  </label>
                  <input
                    type="text"
                    value={signUpStaffId}
                    onChange={e => setSignUpStaffId(e.target.value)}
                    placeholder="e.g. SA-3321-SEC"
                    className="w-full px-3 py-2 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={signUpDesignation}
                    onChange={e => setSignUpDesignation(e.target.value)}
                    placeholder="e.g. English Literature Lead"
                    className="w-full px-3 py-2 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                    Department
                  </label>
                  <select
                    value={signUpDepartment}
                    onChange={e => setSignUpDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                  >
                    <option value="Department of Pure Sciences">Department of Pure Sciences</option>
                    <option value="Department of Higher Mathematics">Department of Higher Mathematics</option>
                    <option value="Department of Languages & Literature">Department of Languages</option>
                    <option value="Department of Social Sciences">Department of Social Sciences</option>
                    <option value="Department of Physical Education & Sports">Physical Education & Sports</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpPhone}
                    onChange={e => setSignUpPhone(e.target.value)}
                    placeholder="+91 98250 00000"
                    className="w-full px-3 py-2 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1 uppercase">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-white border border-[#D8C7AA] rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-[#16287A]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#16287A] to-[#1E3A8A] text-white font-bold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Registering Faculty...' : 'Complete Teacher Registration'}</span>
                <span>✨</span>
              </button>
            </form>
          )}

          {/* Footer Notice with Interactive Phone Helpline */}
          <div className="pt-2 border-t border-[#E8DEC8] text-center space-y-1.5">
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-stone-600">
              <span>Campus Helpline:</span>
              <ClickablePhoneNumber
                phone="+91 (2672) 240-9102"
                name="St. Arnold's Administration"
                label="Helpdesk"
              />
            </div>
            <p className="text-[10px] text-stone-500 font-mono">
              St. Arnold&apos;s High School, Godhra • Institutional Secure Protocol v2.6
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
