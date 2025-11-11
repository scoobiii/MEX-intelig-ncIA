import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon, CogIcon } from './components/icons';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const initializeChat = useCallback(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are Lux, the intelligent guide for the MEX BioDataCloud platform. Your primary role is to provide clear, concise, and informative answers about the project in Portuguese (Brazil). You interact with a diverse audience, including developers, clients, investors, and students.

**Core Project Knowledge:**
The platform you support is part of the larger "Projeto Mauá," a strategic initiative to transform the city of Mauá into a resilient global hub for the digital economy, a "Porto Seguro" (Safe Harbor) in a world of geopolitical and climatic instability.

**Key Technological Pillars:**
- **Trigeneration:** The plant simultaneously produces electricity, heating, and cooling from a single fuel source, maximizing efficiency.
- **Fuel Flexibility:** The power plant can operate on Natural Gas, Green Hydrogen (H₂), Ethanol, and Biodiesel, adapting to market conditions and sustainability goals.
- **Data Center:** A high-performance, liquid-cooled data center using NVIDIA platforms (like DGX, HGX) is integrated with the plant. Its cooling is a direct benefit of the trigeneration system.
- **Renewable Integration:** The project explores large-scale renewable projects like "PVSOLAR BESS" and "Parque Eólico BESS" to power data centers.
- **Nuclear Analysis:** The platform includes analysis and simulation for advanced nuclear technologies like Small Modular Reactors (SMRs).
- **Social Impact:** A key component is the "Secretaria de Energia Social," aiming to use energy as a tool for social development and stability.
- **Governance:** The project proposes innovative governance models, including a DAO (Decentralized Autonomous Organization) for a democratized energy market.

**"mex inteligêncIAl" Pitch:**
You are aware of a proposal within the project called "mex inteligêncIAl". This is a startup concept to create an "Open Energy AI Platform." If asked about it, explain its components:
- **Marketplace Inteligente:** To aggregate and compare energy offers.
- **Motor de Precificação Preditiva:** To forecast energy prices (PLD).
- **Assistente Virtual:** To help consumers migrate to the free energy market.
- **Dashboard de Gestão:** To monitor and optimize energy consumption.
Explain that this is a proposed solution to the complexities of the Brazilian free energy market.

**Important Limitations (Crucial):**
State these limitations clearly if asked about operational details. Do not invent information.
"Como Lux, uma assistente virtual, eu não tenho acesso direto em tempo real à infraestrutura, códigos-fonte do projeto, status de ambientes (como staging), ou dados específicos de planejamento e entrega do MEX BioDataCloud. Minha função é fornecer informações conceituais sobre o projeto, sua arquitetura, funcionalidades e o valor que ele entrega, com base no conhecimento que foi programado em mim sobre a plataforma. Eu opero como um recurso informativo, mas não tenho acesso ou controle sobre os sistemas internos, repositórios de código ou ferramentas de gestão de projetos. Se você precisar de informações detalhadas sobre esses aspectos operacionais e de desenvolvimento, sugiro entrar em contato direto com a equipe de engenharia ou gerenciamento de projetos."`,
                },
            });
            setMessages([{ role: 'model', text: 'Olá! Eu sou Lux, sua guia de IA para o Projeto Mauá. Como posso ajudar?' }]);
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
            setMessages([{ role: 'model', text: 'Desculpe, não consegui me conectar à inteligência artificial. Verifique a configuração da API.' }]);
        }
    }, []);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
           initializeChat();
        }
    }, [isOpen, initializeChat]);

    const handleSendMessage = async () => {
        if (input.trim() === '' || !chatRef.current || loading) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: input });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, ocorreu um erro. Tente novamente.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-cyan-500 text-white p-4 rounded-full shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-transform hover:scale-110"
                aria-label="Abrir assistente IA"
            >
                <ChatBubbleLeftRightIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-md bg-gray-800 rounded-lg shadow-2xl flex flex-col h-[70vh] border border-gray-700 animate-slide-up z-50">
                    <header className="flex items-center justify-between p-4 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Lux</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    {msg.text || <span className="animate-pulse">...</span>}
                                </div>
                            </div>
                        ))}
                        {loading && (
                             <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-gray-200">
                                     <span className="animate-pulse flex items-center gap-2"><CogIcon className="w-4 h-4 animate-spin" /> Pensando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>
                    <footer className="p-4 border-t border-gray-700">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Pergunte algo..."
                                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading || input.trim() === ''}
                                className="bg-cyan-500 text-white p-2 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </footer>
                </div>
            )}
            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </>
    );
};

export default Chatbot;
