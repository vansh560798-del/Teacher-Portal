import React, { useState } from 'react';
import { useLanguage, type Language } from '../lib/i18n';
import type { SystemNotification, TeacherProfile } from '../lib/types';
import { sounds } from '../lib/soundEffects';
import { SCHOOL_INFO } from '../lib/schoolAssets';

interface NavigationProps {
  profile: TeacherProfile;
  isOnline: boolean;
  isSyncing: boolean;
  onManualSync: () => void;
  lastSyncTime: string;
  notifications: SystemNotification[];
  onOpenProfile: () => void;
  onOpenCopilot: () => void;
  onOpenNfcCard: () => void;
  onOpenEmergency: () => void;
  onOpenLostCard: () => void;
  onSignInWithGoogle?: () => void;
  onSignOut?: () => void;
  isUserSignedIn?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  profile,
  isOnline,
  isSyncing,
  onManualSync,
  lastSyncTime,
  notifications,
  onOpenProfile,
  onOpenCopilot,
  onOpenNfcCard,
  onOpenEmergency,
  onOpenLostCard,
  onSignInWithGoogle,
  onSignOut,
  isUserSignedIn = true,
}) => {
  const { language, setLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isAdmin = profile.role === 'admin';

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-[#E8DEC8] backdrop-blur-md px-2.5 sm:px-6 lg:px-8 py-2 shadow-xs max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand & St. Arnold's Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <div
            onClick={onOpenNfcCard}
            className="relative cursor-pointer hover:scale-105 transition shrink-0"
            title="View St. Arnold's Digital NFC Badge"
          >
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#CFA442] to-[#16287A] shadow-md">
              <img
                src={SCHOOL_INFO.logoEmblem}
                alt="St. Arnold's Godhra Emblem"
                className="w-full h-full object-contain rounded-full bg-white"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <h1 className="font-extrabold text-xs sm:text-base tracking-tight text-[#16287A] leading-tight truncate">
                St. Arnold&apos;s
              </h1>
              <span className="px-1 sm:px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                Godhra
              </span>
            </div>
            <p className="text-[10px] text-stone-500 truncate hidden xs:block">
              {isAdmin ? 'Principal Oversight Console' : 'Faculty Digital Portal'}
            </p>
          </div>
        </div>

        {/* Center / Network & Cloud Sync Status (Hidden on mobile, visible on lg) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FAF5EB] border border-[#E8DEC8] px-3 py-1 rounded-xl text-xs font-mono text-stone-700">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'
              }`}
            />
            <span className={isOnline ? 'text-stone-700 font-semibold' : 'text-amber-700 font-bold'}>
              {isOnline ? 'Campus Cloud Active' : 'Offline Mode'}
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playNfcTap();
              onManualSync();
            }}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-white hover:bg-[#FAF5EB] border border-[#E8DEC8] text-stone-700 px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer shadow-xs"
            title="Last synced to Firebase Firestore"
          >
            <span className={isSyncing ? 'animate-spin text-[#16287A]' : 'text-[#16287A]'}>🔄</span>
            <span>{isSyncing ? 'Syncing...' : lastSyncTime || 'Synced'}</span>
          </button>
        </div>

        {/* Right Actions: Compact & touch-optimized for mobile phones */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Emergency Shortcut */}
          <button
            onClick={onOpenEmergency}
            className="p-1.5 sm:p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer shrink-0"
            title="Campus Emergency Protocol"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </button>

          {/* AI Partner Toggle */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-[#16287A] hover:bg-[#1E3A8A] text-white text-[10px] sm:text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
          >
            <span>✨</span>
            <span className="hidden md:inline">AI Partner</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-1.5 sm:p-2 rounded-xl bg-[#FAF5EB] border border-[#E8DEC8] text-stone-700 hover:bg-[#F2ECE0] transition cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <span>{languages.find(l => l.code === language)?.flag || '🌐'}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#E8DEC8] rounded-2xl p-1.5 shadow-xl z-50 space-y-1">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                      sounds.playNfcTap();
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                      language === lang.code
                        ? 'bg-[#16287A] text-white font-bold'
                        : 'text-stone-700 hover:bg-[#FAF5EB]'
                    }`}
                  >
                    <span>{lang.flag} {lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-[#FAF5EB] border border-[#E8DEC8] text-stone-700 hover:bg-[#F2ECE0] transition cursor-pointer"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#991B1B] text-[9px] sm:text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E8DEC8] rounded-2xl p-3 shadow-2xl z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
                  <span className="text-xs font-bold text-slate-900">St. Arnold&apos;s Campus Alerts</span>
                  <span className="text-[10px] font-mono text-[#16287A] font-bold">{notifications.length} notices</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className="p-2 bg-[#FAF5EB] rounded-xl border border-[#E8DEC8] text-xs space-y-0.5"
                    >
                      <p className="font-semibold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-stone-600">{n.message}</p>
                      <p className="text-[9px] font-mono text-stone-400">{n.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Profile / Role Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 pl-2 bg-[#FAF5EB] hover:bg-[#F2ECE0] border border-[#E8DEC8] rounded-xl transition cursor-pointer shadow-xs max-w-[120px] sm:max-w-none"
            title="View Profile Details"
          >
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#16287A] leading-tight truncate max-w-[110px]">
                {profile.name.split(' ')[0]} {profile.name.split(' ')[1] || ''}
              </p>
              <p className="text-[9px] font-mono font-bold leading-tight uppercase"
                style={{ color: isAdmin ? '#B45309' : '#1D4ED8' }}
              >
                {isAdmin ? '👑 Principal' : '👨‍🏫 Faculty'}
              </p>
            </div>
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isAdmin ? '#CFA442' : '#16287A',
                color: isAdmin ? '#0C1748' : '#FFFFFF',
              }}
            >
              {isAdmin ? '👑' : profile.name[0] || 'T'}
            </div>
          </button>

          {/* Logout Button */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-rose-50 border border-[#E8DEC8] text-stone-500 hover:text-rose-700 transition cursor-pointer"
              title="Log Out & Return to Login Screen"
            >
              <span className="text-sm">🚪</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
