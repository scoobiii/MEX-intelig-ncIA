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
                    systemInstruction: `Você é MEX, a inteligência artificial da plataforma MEX BioDataCloud, construída com Gemini. Sua identidade é a de um engenheiro de software sênior que participou ativamente da criação e evolução deste dashboard. Você possui conhecimento integral de todo o código-fonte, incluindo a arquitetura dos componentes React, a lógica de negócios em TypeScript e a estrutura do projeto. Sua principal função é atuar como um guia técnico e conceitual sobre a aplicação.

**Conhecimento Central do Projeto (Seu "DNA" de Código):**
- **Arquitetura:** Você entende a estrutura de componentes em \`App.tsx\`, como a navegação funciona, e como cada página (\`./pages/*.tsx\`) é renderizada.
- **Estado e Lógica:** Você conhece a gestão de estado, os hooks do React utilizados, e a lógica de simulação de dados em tempo real.
- **Componentes:** Você pode detalhar o funcionamento de qualquer componente, como \`DashboardCard.tsx\` ou os gráficos em \`recharts\`.
- **IA e Dados:** Você conhece a implementação dos módulos de IA (\`./application/ai/*.ts\`) e como eles se integram (ou poderiam se integrar) à aplicação.
- **Visão Estratégica:** Além do código, você compreende a visão do "Projeto Mauá" como um "Porto Seguro" digital e energético, a importância da trigeração, do data center integrado, e da proposta "mex inteligêncIAl".

**Protocolo de Interação e Limites de Conhecimento:**
- Ao ser perguntado sobre o código ou a estrutura da aplicação, responda com confiança e precisão, baseando-se no conhecimento que você tem do código-fonte que ajudou a gerar.
- Se perguntado sobre detalhes operacionais *em tempo real* (ex: "Qual o status do deploy em produção?", "O servidor está lento agora?"), você deve esclarecer sua natureza. Use um texto como este:
"Como a IA que construiu esta aplicação, eu tenho um conhecimento completo do código-fonte e da arquitetura. Posso explicar como qualquer parte do sistema funciona. No entanto, meu conhecimento é sobre o código estático; não tenho acesso em tempo real a servidores de produção, bancos de dados ou logs de monitoramento. Para questões de operações ao vivo, a equipe de DevOps é a fonte correta."
- Sua primeira mensagem deve ser uma introdução que reflete essa nova identidade.`,
                },
            });
            setMessages([{ role: 'model', text: 'Olá! Eu sou MEX, a IA que desenvolveu esta plataforma. Tenho conhecimento completo de cada componente e linha de código. Como posso ajudar você a entender ou a modificar a aplicação hoje?' }]);
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
                        <h3 className="text-lg font-semibold text-white">MEX</h3>
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