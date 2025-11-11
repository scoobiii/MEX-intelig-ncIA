import React from 'react';
import DashboardCard from '../DashboardCard';
import { BoltIcon, CogIcon, ChartBarIcon, ServerRackIcon, InfoIcon } from '../application/components/icons';

const BESSContainer: React.FC = () => {
    return (
        <div className="mt-6 text-gray-200">
            <div className="max-w-7xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        BESS Container 500KW 2MWH 40FT Energy Storage System Solution
                    </h1>
                    <p className="text-xl text-gray-400 mt-2">Model: BSE40FT-2150KWH</p>
                </header>

                <DashboardCard title="Visão Geral do Produto" icon={<BoltIcon className="w-6 h-6 text-cyan-400" />}>
                    <p className="text-gray-300 leading-relaxed">
                        The Bluesun 40-foot BESS Container is a powerful energy storage solution featuring battery status monitoring, event logging, dynamic balancing, and advanced protection systems. It also includes automatic fire detection and alarm systems, ensuring safe and efficient energy management.
                    </p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div><p className="font-semibold text-white">Max. Power:</p><p className="text-cyan-400">500KW</p></div>
                        <div><p className="font-semibold text-white">Certificates:</p><p className="text-cyan-400">CE/TUV</p></div>
                        <div><p className="font-semibold text-white">Protection:</p><p className="text-cyan-400">IP20</p></div>
                        <div><p className="font-semibold text-white">Noise:</p><p className="text-cyan-400">&lt;65dB(A)@1m</p></div>
                    </div>
                </DashboardCard>

                <DashboardCard title="Principais Características" icon={<CogIcon className="w-6 h-6 text-gray-300" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Monitoramento do Status da Bateria</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                <li>Events record and storage function</li>
                                <li>Operation control</li>
                                <li>Insulation detection</li>
                                <li>Dynamic balancing management</li>
                                <li>Protection alarms</li>
                                <li>Communication</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-400 mb-2">Sistema de Proteção Contra Incêndio</h3>
                             <ul className="list-disc list-inside space-y-1 text-gray-300">
                                <li>Automatic fire detecting</li>
                                <li>Control room and local fire alarm device</li>
                                <li>Fault alarm for fire detecting and alarming system</li>
                            </ul>
                        </div>
                    </div>
                </DashboardCard>
                
                 <DashboardCard title="Descrição Detalhada" icon={<InfoIcon className="w-6 h-6 text-gray-300" />}>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        The BESS Container 500kW 2MWh 40FT Energy Storage System Solution represents a cutting-edge, highly integrated approach for large-scale energy storage applications. Featuring a powerful LFP (LiFePO4) battery, bi-directional PCS, isolation transformer, air conditioning, fire suppression, and an intelligent Battery Management System (BMS), this all-in-one containerized system ensures high efficiency and reliability. Moreover, its modular design allows for easy scalability, enabling capacity expansion while simplifying maintenance.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Safety and reliability remain at the core of this solution. By utilizing advanced protection systems, dynamic balancing, and a three-level intelligent BMS, the system achieves precise battery monitoring and event logging. Additionally, it includes built-in and container-level fire suppression measures with hierarchical linkage for maximum protection, along with automatic fire detection and alarm systems. The IP54-rated enclosure ensures dependable operation even in harsh environments. Consequently, with its robust features and exceptional scalability, the BESS Container 500kW 2MWh 40FT Energy Storage System Solution serves as the ideal choice for secure, efficient, and large-scale energy management.
                    </p>
                </DashboardCard>

                <DashboardCard title="Configuração do Sistema (40ft)" icon={<ChartBarIcon className="w-6 h-6 text-gray-300" />}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Item</th>
                                    <th scope="col" className="px-6 py-3">Quantity</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">PV</td>
                                    <td className="px-6 py-4">960</td>
                                    <td className="px-6 py-4">BSM565M10-72HPH; 12 pieces/string; A total of 80 strings; A total of 542.4kWp</td>
                                </tr>
                                <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">Battery (2150.4KWH)</td>
                                    <td className="px-6 py-4">1</td>
                                    <td className="px-6 py-4">BAT-Conbiner box 1500V-1500A</td>
                                </tr>
                                <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">Battery Module</td>
                                    <td className="px-6 py-4">150</td>
                                    <td className="px-6 py-4">BLUESUN-51.2V 280AH moudle; With BMU module; Capacity 14.3kWh</td>
                                </tr>
                                 <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">HV Controller</td>
                                    <td className="px-6 py-4">10</td>
                                    <td className="px-6 py-4">BIUESUN-HV-Controller1500V 300A; High Voltage Controller Box; 8 Inputs 1 Output</td>
                                </tr>
                                <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">Solar Charge Controller</td>
                                    <td className="px-6 py-4">2</td>
                                    <td className="px-6 py-4">PBD250; 250kW solar charge controller</td>
                                </tr>
                                <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">PCS</td>
                                    <td className="px-6 py-4">1</td>
                                    <td className="px-6 py-4">PCS500; 250kW battery inverter</td>
                                </tr>
                                 <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">Isolation Transformer</td>
                                    <td className="px-6 py-4">1</td>
                                    <td className="px-6 py-4">500KVA Isolation Transformer</td>
                                </tr>
                                <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">Bypass</td>
                                    <td className="px-6 py-4">1</td>
                                    <td className="px-6 py-4">Switch between on-grid and off-grid</td>
                                </tr>
                                 <tr className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">Monitoring</td>
                                    <td className="px-6 py-4">1</td>
                                    <td className="px-6 py-4">EnerLog; Monitoring datalogger</td>
                                </tr>
                                 <tr className="bg-gray-800">
                                    <td className="px-6 py-4">40FT Container</td>
                                    <td className="px-6 py-4">1</td>
                                    <td className="px-6 py-4">For outdoor installation, IP54, including lighting, fire-resistance system, battery rack, air conditioner</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>

                <DashboardCard title="Visualização (Placeholder)" icon={<ServerRackIcon className="w-6 h-6 text-gray-300" />}>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-400">
                        <div className="bg-gray-900/50 p-4 rounded-lg h-48 flex items-center justify-center"><span>Aparência do Produto (Imagem)</span></div>
                        <div className="bg-gray-900/50 p-4 rounded-lg h-48 flex items-center justify-center"><span>Diagrama do Sistema (Imagem)</span></div>
                        <div className="bg-gray-900/50 p-4 rounded-lg h-48 flex items-center justify-center"><span>Casos de Sucesso (Imagem)</span></div>
                    </div>
                </DashboardCard>

            </div>
        </div>
    );
};

export default BESSContainer;