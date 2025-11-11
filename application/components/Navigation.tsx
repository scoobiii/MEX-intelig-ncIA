import React from 'react';

export type Page = 
    'Power Plant' | 
    'Utilities' | 
    'Data Center' | 
    'Financials' | 
    'Configuration' | 
    'Infrastructure' |
    'Open Energy' |
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
    { label: 'Infraestrutura', page: 'Infrastructure' },
    { label: 'Open Energy', page: 'Open Energy' },
    { label: 'Status do Projeto', page: 'Project Status' },
];

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
    return (
        <nav className="bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-start h-16">
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => setCurrentPage(item.page)}
                                    className={`transition-colors duration-200 ${
                                        currentPage === item.page
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white`}
                                    aria-current={currentPage === item.page ? 'page' : undefined}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;