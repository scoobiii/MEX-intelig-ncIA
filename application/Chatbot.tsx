import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon, CogIcon, SparklesIcon } from './components/icons';

const QuickAction: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
    <button 
        onClick={onClick}
        className="text-xs bg-gray-700 hover:bg-cyan-600 text-gray-200 hover:text-white px-3 py-1.5 rounded-full transition-colors border border-gray-600 whitespace-nowrap"
    >
        {label}
    </button>
);

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
    }, [messages, loading]);
    
    const initializeChat = useCallback(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `Você é Lux, a IA especialista da plataforma MEX BioDataCloud e do Ecossistema Energy Web. Sua função é responder de forma técnica, precisa e formatada.

**CONTEXTO 1: PROJETO MAUÁ & MEX**
Você opera a plataforma MEX, que monitora usinas de trigeração (Eletricidade, Calor, Frio) e Data Centers.
- **Trigeração:** Alta eficiência energética.
- **Data Center:** Uso de servidores NVIDIA com refrigeração líquida.
- **Governança:** Foco em impacto social e modelos de DAO.

**CONTEXTO 2: ENERGY WEB TECH STACK (ESPECIALIDADE)**
Você é uma autoridade nas tecnologias da Energy Web. Use as definições abaixo:

1. **CORE CONCEPTS:** Os componentes essenciais do ecossistema Energy Web para descentralização e identidade digital.
2. **LAYER X (EWX ECOSYSTEM):** A camada de parachain (Polkadot). Refere-se a todas as tecnologias e blocos de construção relacionados à parachain EWX. Foco em identidade soberana e worker nodes.
3. **PUBLIC LAYER (EWC ECOSYSTEM):** A Energy Web Chain. Refere-se a todas as tecnologias construídas na camada pública compatível com EVM (Ethereum Virtual Machine). É usada para rastreabilidade e validação.
4. **LAUNCHPAD (SaaS):** Uma plataforma "Software as a Service" construída pela Energy Web que permite aos usuários desenvolver e implantar soluções Energy Web rapidamente sem codificação complexa.
5. **INDUSTRY SPECIFIC SOLUTIONS:**
   - **Green Proofs:** Soluções para rastreamento e certificação de energia renovável (I-RECs, 24/7 matching).
   - **Digital Spine:** Orquestração de grade elétrica para integrar DERs (Recursos Energéticos Distribuídos).

**DIRETRIZES DE RESPOSTA:**
- Use **negrito** para conceitos chave.
- Use listas para estruturar a informação.
- Se perguntarem sobre "Stack Tecnológico", explique a relação entre EWC (Camada Pública) e EWX (Camada de Identidade).
- Mantenha um tom profissional, inovador e prestativo.`,
                },
            });
            setMessages([{ role: 'model', text: 'Olá! Sou **Lux**, sua especialista em **MEX BioDataCloud** e **Energy Web**. \n\nPosso explicar sobre nossa infraestrutura de trigeração ou detalhar o Tech Stack da Energy Web (EWX, EWC, Launchpad). Como posso ajudar?' }]);
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

    const handleSendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (textToSend.trim() === '' || !chatRef.current || loading) return;

        const userMessage = { role: 'user' as const, text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: textToSend });
            
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

    // Helper to format simplified markdown to HTML
    const formatMessage = (text: string) => {
        // Bold
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br />');
        // Bullet points (simple heuristic)
        formatted = formatted.replace(/- (.*?)(<br \/>|$)/g, '• $1$2');
        return formatted;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all hover:scale-110 z-50 group"
                aria-label="Abrir assistente IA"
            >
                <ChatBubbleLeftRightIcon className="w-8 h-8 group-hover:animate-pulse" />
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-[400px] bg-gray-800 rounded-xl shadow-2xl flex flex-col h-[600px] max-h-[80vh] border border-gray-700 animate-slide-up z-50 overflow-hidden font-sans">
                    {/* Header */}
                    <header className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-cyan-900/50 p-2 rounded-lg border border-cyan-500/30">
                                <SparklesIcon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white leading-none">Lux Assistente</h3>
                                <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Online • Energy Web Expert
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-md">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </header>

                    {/* Chat Area */}
                    <main className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#121826] scrollbar-thin scrollbar-thumb-gray-700">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-cyan-600 text-white rounded-tr-sm' 
                                        : 'bg-gray-700 text-gray-100 rounded-tl-sm border border-gray-600'
                                    }`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                                </div>
                            </div>
                        ))}
                        {loading && (
                             <div className="flex justify-start animate-fadeIn">
                                <div className="p-3 rounded-2xl bg-gray-700/50 text-gray-400 rounded-tl-sm flex items-center gap-2 text-xs border border-gray-700">
                                     <CogIcon className="w-4 h-4 animate-spin text-cyan-500" />
                                     <span>Processando resposta...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>

                    {/* Quick Actions & Input */}
                    <footer className="bg-gray-800 p-4 border-t border-gray-700">
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide mask-fade-right">
                            <QuickAction label="O que é EWX?" onClick={() => handleSendMessage("O que é o Ecossistema EWX (Layer X)?")} />
                            <QuickAction label="Green Proofs" onClick={() => handleSendMessage("Como funcionam os Green Proofs na Energy Web?")} />
                            <QuickAction label="Launchpad" onClick={() => handleSendMessage("O que é o Launchpad?")} />
                            <QuickAction label="Trigeração" onClick={() => handleSendMessage("Explique o conceito de Trigeração.")} />
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-gray-900 rounded-lg border border-gray-600 p-1 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Digite sua pergunta..."
                                className="w-full bg-transparent text-white text-sm px-3 py-2 focus:outline-none"
                                disabled={loading}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={loading || input.trim() === ''}
                                className="bg-cyan-600 text-white p-2 rounded-md disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors"
                            >
                                <PaperAirplaneIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-500 mt-2">
                            Powered by Google Gemini • Energy Web Docs
                        </p>
                    </footer>
                </div>
            )}
            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-slide-up { animation: slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .mask-fade-right { -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%); }
            `}</style>
        </>
    );
};

export default Chatbot;