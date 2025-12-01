
import React from 'react';
import DashboardCard from '../../DashboardCard';
import { CloseIcon, BoltIcon, GlobeAltIcon } from './icons';
import { InvestmentFund, RealEstateAsset } from '../../types';

interface AssetRetrofitSimulatorProps {
    fund: InvestmentFund;
    asset: RealEstateAsset;
    onClose: () => void;
    t: (key: string) => string;
}

const AssetRetrofitSimulator: React.FC<AssetRetrofitSimulatorProps> = ({ asset, fund, onClose, t }) => {
    // Technical Calculations
    // 1. Current Infrastructure Removal
    const generatorsCount = 6;
    const totalDieselCapacity = 2500; // kVA (2.5 MW)

    // GPA SPECIFIC DATA from Prompt
    const annualConsumptionMWh = 19656.27;
    const monthlyConsumptionMWh = annualConsumptionMWh / 12; // ~1638 MWh/month

    // 2. Solar Potential - UPSCALED TO GENERATE SURPLUS FOR ODATA
    // Standard roof was 7.5MWp. To sell to Odata, we assume use of adjacent land/parking carports to reach 12 MWp.
    const realisticSolarCapacity = 12.0; // MWp (Enhanced Retrofit)
    const solarGenerationMonthlyMWh = realisticSolarCapacity * 5 * 30; // 5 peak hours * 30 days = 1800 MWh
    
    const excessEnergyMWh = Math.max(0, solarGenerationMonthlyMWh - monthlyConsumptionMWh); // 1800 - 1638 = 162 MWh Surplus

    // 3. BESS Sizing
    const bessCapacityMWh = 4; // Upscaled for Odata support
    const bessPowerMW = 1.0; 

    // 4. Financials (CAPEX)
    // Solar: R$ 3.8M/MWp | BESS: R$ 2.5M/MWh | Civil/Elec: R$ 4M
    const capexSolar = realisticSolarCapacity * 3800000;
    const capexBess = bessCapacityMWh * 2500000;
    const capexInfra = 4400000;
    const totalCapex = capexSolar + capexBess + capexInfra; // ~R$ 60M
    
    const quotaPrice = 100;
    const newQuotas = Math.ceil(totalCapex / quotaPrice);

    // 5. New Revenue Streams (Annualized)
    // a) Energy Rent (Value Capture from GPA Savings): Assume Fund captures 20% of the savings as rent
    const energyTariff = 550; // R$/MWh
    const gpaAnnualSavings = annualConsumptionMWh * energyTariff; // ~R$ 10.8M saved/year
    const annualEnergyRent = gpaAnnualSavings * 0.20; // R$ 2.16M/year revenue for Fund

    // b) Surplus Sales (PPA to ODATA)
    const ppaPrice = 280; // R$/MWh (Discounted for wholesale)
    const annualSurplusRevenue = (excessEnergyMWh * 12) * ppaPrice; // ~R$ 544k/year

    // c) Carbon & Services (Galaxy Nodes)
    const carbonRevenue = (solarGenerationMonthlyMWh * 12 * 0.1 * 50); // ~R$ 108k/year (conservative)
    const galaxyRevenue = 150000; // R$ 150k/year estimate
    
    const totalNewNOI = annualEnergyRent + annualSurplusRevenue + carbonRevenue + galaxyRevenue; // ~R$ 3M/year additional NOI

    // 6. Valuation Impact (Cap Rate Compression)
    // The retrofit makes the asset "Green Triple A", reducing risk.
    const currentCapRate = 0.085; // 8.5%
    const newCapRate = 0.0725; // 7.25% (Premium Asset)
    
    const currentImpliedNOI = fund.netWorth * currentCapRate; // Base NOI
    const futureNOI = currentImpliedNOI + totalNewNOI; // New Total NOI
    
    const futureValuation = futureNOI / newCapRate;
    const valuationUplift = futureValuation - fund.netWorth;
    const netValueCreation = valuationUplift - totalCapex;

    return (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gray-800 w-full max-w-6xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-700 flex justify-between items-start bg-gradient-to-r from-gray-800 to-gray-900">
                    <div>
                        <div className="flex items-center gap-3">
                            <BoltIcon className="w-8 h-8 text-yellow-400" />
                            <h2 className="text-2xl font-bold text-white">{t('retrofit.title')}</h2>
                        </div>
                        <p className="text-gray-400 mt-1">{t('retrofit.transform')} <strong className="text-white">{asset.name}</strong></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Technical & CAPEX */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-2">1. Engenharia & CAPEX</h3>
                        
                        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300">Capacidade Solar</span>
                                <span className="font-bold text-white">{realisticSolarCapacity} MWp</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-300">BESS (Armazenamento)</span>
                                <span className="font-bold text-white">{bessCapacityMWh} MWh</span>
                            </div>
                            <div className="w-full h-px bg-gray-600 my-3"></div>
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>CAPEX Solar</span>
                                <span>R$ {(capexSolar/1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>CAPEX BESS</span>
                                <span>R$ {(capexBess/1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-600">
                                <span className="font-bold text-white">Investimento Total</span>
                                <span className="font-bold text-yellow-400 text-lg">R$ {(totalCapex/1000000).toFixed(1)} Milhões</span>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg">
                            <h4 className="font-bold text-blue-400 mb-2">Novas Cotas (Follow-on)</h4>
                            <p className="text-sm text-gray-300 mb-3">Emissão de cotas para custear o retrofit sem descapitalizar o fundo.</p>
                            <div className="flex justify-between items-center">
                                <span>Volume de Emissão:</span>
                                <span className="font-mono font-bold text-white">{newQuotas.toLocaleString()} cotas</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Preço Base:</span>
                                <span className="font-mono text-gray-400">R$ {quotaPrice},00</span>
                            </div>
                        </div>

                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <h4 className="font-bold text-white mb-3">Benefícios GPA (Inquilino)</h4>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-400 text-sm">Conta de Energia Atual</span>
                                <span className="text-gray-400">~R$ 10.8M / ano</span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-400 text-sm">Nova Conta (com Aluguel Energia)</span>
                                <span className="text-green-400 font-bold">~R$ 8.6M / ano</span>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">Economia de 20%</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Valuation & Financial Engineering */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-green-400 border-b border-gray-700 pb-2">2. Valuation Uplift (Cálculo)</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                                <p className="text-xs text-gray-400">NOI Adicional (Ano)</p>
                                <p className="text-xl font-bold text-green-400">+R$ {(totalNewNOI/1000000).toFixed(2)}M</p>
                                <p className="text-[10px] text-gray-500">Energia + Carbono</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                                <p className="text-xs text-gray-400">Cap Rate Target</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-xl font-bold text-white">{(newCapRate*100).toFixed(2)}%</p>
                                    <p className="text-xs text-red-400 line-through mb-1">{(currentCapRate*100).toFixed(1)}%</p>
                                </div>
                                <p className="text-[10px] text-gray-500">Compressão de Risco</p>
                            </div>
                        </div>

                        <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-600">
                            <h4 className="font-bold text-white mb-4">Composição do Novo Valor Patrimonial</h4>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Valuation Atual (Pré-Retrofit)</span>
                                    <span className="text-white">R$ {(fund.netWorth/1000000).toFixed(0)} M</span>
                                </div>
                                <div className="flex justify-between text-green-400">
                                    <span>+ Impacto do Novo NOI</span>
                                    <span>R$ {(totalNewNOI / newCapRate / 1000000).toFixed(1)} M</span>
                                </div>
                                <div className="flex justify-between text-cyan-400">
                                    <span>+ Impacto da Compressão de Cap Rate</span>
                                    <span>R$ {(((currentImpliedNOI / newCapRate) - (currentImpliedNOI / currentCapRate)) / 1000000).toFixed(1)} M</span>
                                </div>
                                <div className="w-full h-px bg-gray-600 my-2"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-white">Novo Valuation Estimado</span>
                                    <span className="text-white">R$ {(futureValuation/1000000).toFixed(0)} Milhões</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-4 rounded-lg border border-green-500 shadow-lg text-center">
                            <p className="text-sm text-green-200 uppercase tracking-widest mb-1">Criação de Valor Líquida</p>
                            <p className="text-4xl font-extrabold text-white mb-2">
                                + R$ {(netValueCreation/1000000).toFixed(1)} M
                            </p>
                            <p className="text-xs text-green-300">
                                (Novo Valor - Valor Antigo - CAPEX)
                            </p>
                        </div>

                        <div className="flex gap-2">
                             <button className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition">
                                <div className="flex items-center justify-center gap-2">
                                    <GlobeAltIcon className="w-4 h-4"/>
                                    {t('retrofit.sell_tokens')}
                                </div>
                            </button>
                            <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg transition">
                                Aprovar Projeto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetRetrofitSimulator;
