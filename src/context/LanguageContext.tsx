import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'English (US)' | 'Spanish' | 'French' | 'German';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('credence_language') as Language) || 'English (US)';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('credence_language', lang);
    };

    // Mock Translation Function
    const t = (key: string, defaultText: string) => {
        if (language === 'English (US)') return defaultText;

        // Simple mock translations for demonstration
        const translations: Record<string, Record<string, string>> = {
            'Spanish': {
                'My Profile': 'Mi Perfil',
                'Preferences': 'Preferencias',
                'Sign out': 'Cerrar sesión',
                'Search projects, employees...': 'Buscar proyectos, empleados...',
                'My Dashboard': 'Mi Panel',
                'Live Timer': 'Temporizador',
                'Timesheet': 'Hoja de horas',
                'My Projects': 'Mis Proyectos',
                'My Reports': 'Mis Informes'
            },
            'French': {
                'My Profile': 'Mon Profil',
                'Preferences': 'Préférences',
                'Sign out': 'Se déconnecter',
                'Search projects, employees...': 'Rechercher des projets...',
                'My Dashboard': 'Mon Tableau de bord',
                'Live Timer': 'Minuteur',
                'Timesheet': 'Feuille de temps',
                'My Projects': 'Mes Projets',
                'My Reports': 'Mes Rapports'
            },
            'German': {
                'My Profile': 'Mein Profil',
                'Preferences': 'Einstellungen',
                'Sign out': 'Abmelden',
                'Search projects, employees...': 'Projekte suchen...',
                'My Dashboard': 'Mein Dashboard',
                'Live Timer': 'Timer',
                'Timesheet': 'Zeiterfassung',
                'My Projects': 'Meine Projekte',
                'My Reports': 'Meine Berichte'
            }
        };

        return translations[language]?.[defaultText] || defaultText;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
