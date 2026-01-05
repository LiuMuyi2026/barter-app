'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '@/lib/actions';
import { pusherClient } from '@/lib/pusher';
import styles from './chat.module.css';

type Match = {
    id: string;
    myItem: { id: string, title: string };
    otherItem: { id: string, title: string, user: { name: string | null } };
    lastMessage: string;
};

type Message = {
    id: string;
    content: string;
    senderId: string;
    matchId: string;
    createdAt: Date;
    sender: { name: string | null; id: string };
};

export default function ChatClient({
    initialMatches,
    currentUserId
}: {
    initialMatches: Match[],
    currentUserId: string
}) {
    const [matches, setMatches] = useState(initialMatches);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const selectedMatch = matches.find(m => m.id === selectedMatchId);

    // Subscribe to Pusher channel
    useEffect(() => {
        if (!selectedMatchId) return;

        const channelName = `match-${selectedMatchId}`;
        const channel = pusherClient.subscribe(channelName);

        // Load initial history
        const loadMessages = async () => {
            const history = await getMessages(selectedMatchId);
            setMessages(prev => {
                // Create a map of existing messages by ID to avoid duplicates
                const existing = new Map(prev.map(m => [m.id, m]));

                // Merge history, overwriting any placeholders if IDs match (unlikely for history vs optimistic)
                // However, we want history to be the base.
                // Critical: Don't overwrite recent real-time messages that might have arrived 
                // while history was fetching, unless 'history' actually contains them (which it might).

                // Simple strategy: Combine all, dedupe by ID, sort by date.
                const combined = [...history];

                // Add any from 'prev' that aren't in history (e.g. optimistic or new real-time)
                // We check if ID exists in history.
                const historyIds = new Set(history.map((h: Message) => h.id));

                // Only keep prev messages if they are NOT in history (avoid duplication)
                // AND they are possibly newer (or optimistic).
                prev.forEach(m => {
                    if (!historyIds.has(m.id)) {
                        combined.push(m);
                    }
                });

                return combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            });
        };
        loadMessages();

        // Listen for new messages
        channel.bind('new-message', (data: Message) => {
            setMessages(prev => {
                // Deduplicate: If we already have this ID, don't add
                if (prev.find(m => m.id === data.id)) return prev;

                // If message is from ME, replace the optimistic one (hacky check for temp ID with '.')
                if (data.senderId === currentUserId) {
                    return [...prev.filter(m => !m.id.includes('.')), data];
                }

                return [...prev, data];
            });
            setIsTyping(true); // Briefly show typing for effect, or we could add a specific typing event
            setTimeout(() => setIsTyping(false), 2000);
        });

        return () => {
            pusherClient.unsubscribe(channelName);
            pusherClient.unbind('new-message');
        };
    }, [selectedMatchId, currentUserId]);

    const handleSend = async () => {
        if (!inputValue.trim() || !selectedMatchId || isSending) return;

        const content = inputValue;
        setInputValue('');
        setIsSending(true);

        // Optimistic update
        const tempId = Math.random().toString();
        const optimisticMessage: Message = {
            id: tempId,
            content,
            senderId: currentUserId,
            matchId: selectedMatchId,
            createdAt: new Date(),
            sender: { name: 'Me', id: currentUserId } // Or fetch actual name if needed, but 'Me' logic uses ID check
        };

        setMessages(prev => [...prev, optimisticMessage]);

        const result = await sendMessage(selectedMatchId, content);

        if (!result.success) {
            // Revert on failure (simplified: just alert for now)
            alert('Failed to send message');
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }

        setIsSending(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.matchList}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
                    <h2>Matches</h2>
                </div>
                {matches.map(match => (
                    <div
                        key={match.id}
                        className={`${styles.matchItem} ${selectedMatchId === match.id ? styles.active : ''}`}
                        onClick={() => setSelectedMatchId(match.id)}
                    >
                        <div className={styles.matchName}>{match.otherItem.user.name}</div>
                        <div className={styles.lastMessage}>
                            {match.otherItem.title} ⇄ {match.myItem.title}
                        </div>
                    </div>
                ))}
                {matches.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        No matches yet. Go swipe!
                    </div>
                )}
            </div>

            <div className={styles.chatArea}>
                {selectedMatch ? (
                    <>
                        <div className={styles.chatHeader}>
                            <span>{selectedMatch.otherItem.user.name}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#94a3b8' }}>
                                Trading: {selectedMatch.otherItem.title} for {selectedMatch.myItem.title}
                            </span>
                        </div>

                        <div className={styles.messages}>
                            {messages.map((msg) => {
                                const isMine = msg.senderId === currentUserId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`${styles.messageBubble} ${isMine ? styles.messageMine : styles.messageTheirs}`}
                                    >
                                        {msg.content}
                                    </div>
                                );
                            })}
                            {isTyping && (
                                <div className={`${styles.messageBubble} ${styles.messageTheirs} opacity-50`}>
                                    <span className="animate-pulse">...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <input
                                className={styles.input}
                                placeholder="Type a message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className={styles.sendBtn} onClick={handleSend} disabled={isSending}>
                                ➤
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        Select a match to start chatting
                    </div>
                )}
            </div>
        </div >
    );
}
