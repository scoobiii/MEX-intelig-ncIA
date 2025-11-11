

import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from './icons';

export type Page = 
    'Power Plant' | 
    'Utilities' | 
    'Data Center' | 
    'Financials' | 
    'Configuration' | 
    'SIN' |
    'Grid Analysis' |
    'Solar Potential' |
    'Open Energy' |
    'EnerTradeZK' |
    'Project Status';

interface NavItem {
    label: string;
    page: Page;
}

const navItems: NavItem[] = [
    { label: 'Usina', page: 'Power Plant' },
    { label: 'Utilitários', page: 'Utilities' },
    { label: 'Data Center', page: 'Data Center' },
    { label: 'Financeiro', page: 'Financials' },
    { label: 'Configuração', page: 'Configuration' },
    { label: 'SIN', page: 'SIN' },
    { label: 'Análise de Rede', page: 'Grid Analysis' },
    { label: 'Potencial Solar', page: 'Solar Potential' },
    { label: 'Open Energy', page: 'Open Energy' },
    { label: 'MEX Trade', page: 'EnerTradeZK' },
    { label: 'Status', page: 'Project Status' },
];

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
    const [isOpen, setIsOpen] = useState(false);

    const NavButton: React.FC<{item: NavItem, isMobile?: boolean}> = ({ item, isMobile = false }) => {
        const active = currentPage === item.page;
        const baseClasses = `transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white w-full text-left`;
        const mobileClasses = `block px-3 py-2 rounded-md text-base font-medium ${active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;
        const desktopClasses = `px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;
        
        return (
            <button
                key={item.label}
                onClick={() => {
                    setCurrentPage(item.page);
                    if (isMobile) setIsOpen(false);
                }}
                className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}
                aria-current={active ? 'page' : undefined}
            >
                {item.label}
            </button>
        );
    };

    return (
        <nav className="bg-gray-800 shadow-md sticky top-0 z-40">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                         <div className="flex-shrink-0">
                            <span className="text-white font-bold text-xl cursor-pointer" onClick={() => setCurrentPage('Power Plant')}>MEX</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-2">
                                {navItems.map((item) => (
                                    <NavButton key={item.page} item={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                           <NavButton key={item.page} item={item} isMobile />
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
