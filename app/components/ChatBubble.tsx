import { useEffect, useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export interface Message {
  msg: {
    id: string;
    text: string;
    role: string;
  }
}

const ChatBubble = ({ msg }: Message) => {
  const [animate, setAnimate] = useState(false);

  const getCurrTime = () => {
    let date = new Date();
    let n = date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    return n;
  }

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <div 
        className={classNames(
            msg.role === 'user'
            ? 'rounded-tl-xl place-self-end bg-blue-500'
            : 'rounded-tr-xl border-gray-200 bg-gray-100',
            `flex flex-col w-full max-w-[300px] break-words leading-1.5 p-3 rounded-bl-xl rounded-br-xl dark:bg-gray-700 ${animate ? 'slide-in' : ''}`
        )}
        >
        <p className={classNames( msg.role === 'user' ? 'text-white' : 'text-gray-900', 'text-sm font-normal')}>{msg.text}</p>
      </div>
      <div 
        className={classNames(msg.role === 'user' ? 'place-self-end' : '',
          'text-xs text-gray-500 font-light'
        )}
      >
        {msg.role} {getCurrTime()}
      </div>
    </div>
  );
};

export default ChatBubble;