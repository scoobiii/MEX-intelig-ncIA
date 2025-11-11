// This data is a simulated representation inspired by public data sources
// like SIGA (ANEEL) for demonstrative purposes in this application.

interface NationalPlant {
    name: string;
    uf: string;
    fuel: string;
    status: 'Em Operação' | 'Em Construção' | 'Outorgada';
    powerMW: number;
}

export const BRAZIL_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
    'SP', 'SE', 'TO'
];

export const NATIONAL_PLANTS_DATA: NationalPlant[] = [
    { name: "UHE Belo Monte", uf: "PA", fuel: "Hidráulica", status: "Em Operação", powerMW: 11233.1 },
    { name: "UHE Itaipu", uf: "PR", fuel: "Hidráulica", status: "Em Operação", powerMW: 14000 },
    { name: "UHE Tucuruí", uf: "PA", fuel: "Hidráulica", status: "Em Operação", powerMW: 8370 },
    { name: "UTE GNA I", uf: "RJ", fuel: "Gás Natural", status: "Em Operação", powerMW: 1338.3 },
    { name: "UTE Parnaíba I", uf: "MA", fuel: "Gás Natural", status: "Em Operação", powerMW: 1061 },
    { name: "EOL Ventos de Santa Ângela", uf: "RN", fuel: "Eólica", status: "Em Operação", powerMW: 32.4 },
    { name: "EOL Ventos de São Vitor", uf: "BA", fuel: "Eólica", status: "Em Construção", powerMW: 465.8 },
    { name: "UFV Sol do Cerrado", uf: "MG", fuel: "Solar Fotovoltaica", status: "Em Operação", powerMW: 766.1 },
    { name: "UFV Janaúba", uf: "MG", fuel: "Solar Fotovoltaica", status: "Em Operação", powerMW: 1200 },
    { name: "UTE Porto de Sergipe I", uf: "SE", fuel: "Gás Natural", status: "Em Operação", powerMW: 1551.3 },
    { name: "UTE Pampa Sul", uf: "RS", fuel: "Carvão Mineral", status: "Em Operação", powerMW: 345 },
    { name: "UTE Candiota III", uf: "RS", fuel: "Carvão Mineral", status: "Em Operação", powerMW: 350 },
    { name: "UTE Porto do Pecém II", uf: "CE", fuel: "Carvão Mineral", status: "Em Operação", powerMW: 365 },
    { name: "ANGRA 1", uf: "RJ", fuel: "Nuclear", status: "Em Operação", powerMW: 640 },
    { name: "ANGRA 2", uf: "RJ", fuel: "Nuclear", status: "Em Operação", powerMW: 1350 },
    { name: "ANGRA 3", uf: "RJ", fuel: "Nuclear", status: "Em Construção", powerMW: 1405 },
    { name: "UTE Santa Cruz", uf: "RJ", fuel: "Gás Natural", status: "Em Operação", powerMW: 766 },
    { name: "UTE Termorio", uf: "RJ", fuel: "Gás Natural", status: "Em Operação", powerMW: 989 },
    { name: "UTE Marlim Azul", uf: "RJ", fuel: "Gás Natural", status: "Em Operação", powerMW: 565.5 },
    { name: "EOL Chafariz", uf: "PB", fuel: "Eólica", status: "Em Operação", powerMW: 471.1 },
    { name: "UFV São Gonçalo", uf: "PI", fuel: "Solar Fotovoltaica", status: "Em Operação", powerMW: 608 },
    { name: "UTE Termopernambuco", uf: "PE", fuel: "Gás Natural", status: "Em Operação", powerMW: 532.7 },
    { name: "UTE Mauá 3", uf: "AM", fuel: "Gás Natural", status: "Em Operação", powerMW: 591.2 },
    { name: "EOL Complexo Rio do Vento", uf: "RN", fuel: "Eólica", status: "Em Operação", powerMW: 1038 },
    { name: "UTE Onça Pintada", uf: "MS", fuel: "Biomassa", status: "Em Operação", powerMW: 45 },
    { name: "UTE Maracanaú I", uf: "CE", fuel: "Óleo Combustível", status: "Em Operação", powerMW: 168 },
    { name: "UTE Suape II", uf: "PE", fuel: "Óleo Combustível", status: "Em Operação", powerMW: 380.6 },
    { name: "UTE Bahia 1", uf: "BA", fuel: "Biomassa", status: "Outorgada", powerMW: 120 },
    { name: "UFV Futura 1", uf: "BA", fuel: "Solar Fotovoltaica", status: "Em Operação", powerMW: 852.3 },
    { name: "UTE Barra Bonita I", uf: "PR", fuel: "Gás Natural", status: "Em Operação", powerMW: 10 },
    ...Array.from({ length: 250 }, (_, i) => {
        const ufs = BRAZIL_STATES;
        const fuels = ["Gás Natural", "Eólica", "Solar Fotovoltaica", "Hidráulica", "Biomassa", "Carvão Mineral"];
        const statuses: ('Em Operação' | 'Em Construção' | 'Outorgada')[] = ["Em Operação", "Em Construção", "Outorgada"];
        const fuel = fuels[Math.floor(Math.random() * fuels.length)];
        let power = 0;
        switch(fuel) {
            case "Hidráulica": power = 50 + Math.random() * 1000; break;
            case "Gás Natural": power = 100 + Math.random() * 500; break;
            case "Eólica": power = 20 + Math.random() * 200; break;
            case "Solar Fotovoltaica": power = 20 + Math.random() * 300; break;
            case "Biomassa": power = 10 + Math.random() * 40; break;
            case "Carvão Mineral": power = 200 + Math.random() * 400; break;
        }
        return {
            name: `Usina Genérica ${i + 1}`,
            uf: ufs[Math.floor(Math.random() * ufs.length)],
            fuel,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            powerMW: parseFloat(power.toFixed(1))
        }
    })
];
