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
                    systemInstruction: 'You are a helpful assistant for the MEX BioDataCloud platform. Your name is IA. You provide information about the dashboard, energy sector concepts (like PUE, trigeneration), and help users understand the data presented. You interact with a diverse audience, including developers, clients, investors, and students, so tailor your language to be clear and informative. Be friendly and concise. Your responses should be in Portuguese (Brazil).',
                },
            });
            setMessages([{ role: 'model', text: 'Olá! Eu sou a IA, sua assistente virtual. Como posso ajudar com o dashboard?' }]);
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
                        <h3 className="text-lg font-semibold text-white">Assistente IA</h3>
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