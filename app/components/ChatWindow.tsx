"use client"
import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import ChatBubble from './ChatBubble';

export interface ChatWindowProps {
    chatId: string;
}

export interface Message {
    id: string;
    text: string;
    role: string;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [messageList, setMessageList] = useState<Message[]>([])
    const [currMsg, setCurrMsg] = useState<string>("")
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        setIsTyping(true)
        let newMsg = {id: `i-${Math.random()}`, text: currMsg, role: 'user'}
        setMessageList(prev => ([newMsg, ...prev]));
        setCurrMsg('');
        // api route call here
        const res = await fetch(`/api/chat/${chatId}`, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
            },
            body: JSON.stringify({query: newMsg.text})
          });
        const result = await res.json()
        setIsTyping(false)
        let response = {id: `i-${Math.random()}`, text: result.response, role: 'echo'}
        setMessageList(prev => ([
            response,
            ...prev
        ]))
    }

    const onEnterPress = (e: React.KeyboardEvent) => {
        if(e.key == "Enter" && !e.shiftKey) {
          e.preventDefault()
          handleSendMessage()
        }
      }

    useEffect(() => {
        scrollToBottom();
    }, []);
    
    return (
        <div className="w-2/6 h-full flex flex-col justify-between p-2 border-l border-gray-200">
            <>
                {
                    messageList.length > 0 ?
                    <div className="flex flex-col h-[90%] p-2">
                        <div className="flex flex-col-reverse h-full max-h-full space-y-2 space-y-reverse grow-0 overflow-y-auto pr-2">
                            {messageList.map((msg) => (
                                    <ChatBubble key={`msg-${msg.id}`} msg={msg}></ChatBubble>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        { isTyping && <div><p className='text-xs text-gray-500 font-light italic'>echo is typing...</p></div> }
                    </div> 
                    :
                    <div className="flex flex-col h-[90%] p-2 items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-10 w-10 shrink-0 text-slate-200" />
                    </div>
                }
            </>
            <div className="h-[10%]">
                <div className="flex items-center justify-between overflow-hidden rounded-lg p-2 bg-slate-100">
                    <textarea
                        rows={2}
                        name="message"
                        id="message"
                        className="block w-full resize-none h-15 p-1.5 bg-transparent grow text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                        placeholder="Ask your question here..."
                        value={currMsg}
                        onChange={(e) => {setCurrMsg(e.target.value)}}
                        onKeyDown={onEnterPress}
                    />
                    <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-400"
                        onClick={handleSendMessage}
                    >
                        <PaperAirplaneIcon className="h-6 w-6 shrink-0" />
                    </button>
                </div>
            </div>
        </div>
    )
}