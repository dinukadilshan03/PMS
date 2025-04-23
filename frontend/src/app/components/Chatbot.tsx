'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Package } from "@/app/packages/types/Package";

interface Message {
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    quickActions?: QuickAction[];
}

interface QuickAction {
    label: string;
    action: () => void;
}

interface ChatbotProps {
    onPackageSelect?: (packageId: string) => void;
    onCustomize?: (packageId: string) => void;
    packages?: Package[];
}

const Chatbot: React.FC<ChatbotProps> = ({ onPackageSelect, onCustomize, packages = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'bot',
            content: 'Hello! I can help you choose or customize a photography package. What would you like to do?',
            timestamp: new Date(),
            quickActions: [
                { label: 'View Packages', action: () => showPackages() },
                { label: 'Customize Package', action: () => showCustomizationOptions() },
                { label: 'Get Help', action: () => showHelp() }
            ]
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const showPackages = () => {
        const packageList = packages.map(pkg => 
            `- ${pkg.name} (${pkg.investment} LKR): ${pkg.packageType}`
        ).join('\n');
        
        setMessages(prev => [...prev, {
            type: 'bot',
            content: `Here are our available packages:\n${packageList}\n\nWould you like to:\n1. Book a package\n2. Customize a package\n3. Get more details about a specific package?`,
            timestamp: new Date(),
            quickActions: [
                { label: 'View All', action: () => showPackages() },
                { label: 'Customize', action: () => showCustomizationOptions() }
            ]
        }]);
    };

    const showCustomizationOptions = () => {
        setMessages(prev => [...prev, {
            type: 'bot',
            content: 'You can customize packages by:\n1. Adding extra services\n2. Modifying existing services\n3. Creating a completely custom package\n\nWhich option interests you?',
            timestamp: new Date(),
            quickActions: packages.map(pkg => ({
                label: `Customize ${pkg.name}`,
                action: () => onCustomize?.(pkg.id)
            }))
        }]);
    };

    const showHelp = () => {
        setMessages(prev => [...prev, {
            type: 'bot',
            content: 'I can help you with:\n1. Finding the perfect package\n2. Customizing packages\n3. Understanding our services\n4. Booking process\n5. Pricing information\n\nWhat would you like to know more about?',
            timestamp: new Date(),
            quickActions: [
                { label: 'View Packages', action: () => showPackages() },
                { label: 'Pricing Info', action: () => showPricingInfo() }
            ]
        }]);
    };

    const showPricingInfo = () => {
        const priceRanges = packages.reduce((acc, pkg) => {
            const range = Math.floor(pkg.investment / 10000) * 10000;
            if (!acc[range]) acc[range] = 0;
            acc[range]++;
            return acc;
        }, {} as Record<number, number>);

        const priceInfo = Object.entries(priceRanges)
            .map(([range, count]) => `${range}-${+range + 10000} LKR: ${count} packages`)
            .join('\n');

        setMessages(prev => [...prev, {
            type: 'bot',
            content: `Our packages are available in these price ranges:\n${priceInfo}\n\nWould you like to:\n1. Filter by price range\n2. See all packages\n3. Get package recommendations?`,
            timestamp: new Date(),
            quickActions: [
                { label: 'View All Packages', action: () => showPackages() },
                { label: 'Get Recommendations', action: () => showRecommendations() }
            ]
        }]);
    };

    const showRecommendations = () => {
        const popularPackages = packages
            .sort((a, b) => b.investment - a.investment)
            .slice(0, 3);

        const recommendations = popularPackages.map(pkg => 
            `- ${pkg.name} (${pkg.investment} LKR): ${pkg.packageType}`
        ).join('\n');

        setMessages(prev => [...prev, {
            type: 'bot',
            content: `Here are our most popular packages:\n${recommendations}\n\nWould you like to:\n1. Book one of these packages\n2. See more options\n3. Get personalized recommendations?`,
            timestamp: new Date(),
            quickActions: popularPackages.map(pkg => ({
                label: `Book ${pkg.name}`,
                action: () => onPackageSelect?.(pkg.id)
            }))
        }]);
    };

    const processMessage = async (userMessage: string) => {
        setMessages(prev => [...prev, {
            type: 'user',
            content: userMessage,
            timestamp: new Date()
        }]);

        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('help') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            showHelp();
        } else if (lowerMessage.includes('package') || lowerMessage.includes('pricing')) {
            showPackages();
        } else if (lowerMessage.includes('customize')) {
            showCustomizationOptions();
        } else if (lowerMessage.includes('book')) {
            showRecommendations();
        } else if (lowerMessage.includes('recommend')) {
            showRecommendations();
        } else {
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "I'm not sure I understand. Would you like to:\n1. View our packages\n2. Customize a package\n3. Get recommendations\n4. Learn about pricing?",
                timestamp: new Date(),
                quickActions: [
                    { label: 'View Packages', action: () => showPackages() },
                    { label: 'Get Help', action: () => showHelp() }
                ]
            }]);
        }

        setIsTyping(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            processMessage(inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
            >
                {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <ChatBubbleLeftIcon className="h-6 w-6" />
                )}
            </button>

            {isOpen && (
                <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
                    <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
                        <h3 className="text-lg font-semibold">Photography Assistant</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className="space-y-2">
                                <div
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                            message.type === 'user'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-50 text-gray-800'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                        <span className="text-xs opacity-75 mt-1 block">
                                            {message.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                {message.quickActions && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {message.quickActions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                onClick={action.action}
                                                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors duration-200"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors duration-200"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 