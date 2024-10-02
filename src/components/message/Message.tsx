import { useEffect, useRef, useState } from "react";
import "./Message.scss";

const Message = ({ senderType, message, isEdits, setMessages, messageState }: any) => {
  const [sentences, setSentences] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof message === 'string') {
      const splitIntoSentences = (text: string) => {
        return text.split(/(?<=\.)\s|(?<=\.)$/);
      };
      const initialSentences = splitIntoSentences(message).filter((sentence) => sentence.trim() !== '');
      setSentences(initialSentences);
    }
  }, [message]);

  const handleChange = (index: number, event: any) => {
    const cursorPosition = event.target.selectionStart;
    
    const updatedSentences = [...sentences];
    updatedSentences[index] = event.target.value;
    setSentences(updatedSentences);

    let clonedMessages = [...messageState];
    clonedMessages[clonedMessages.length - 1].message = updatedSentences.join(' ');
    setMessages(clonedMessages);

    if (textareaRef.current) {
      textareaRef.current.selectionStart = cursorPosition;
      textareaRef.current.selectionEnd = cursorPosition;
    }

    autoResize(event.target);
  };

  const autoResize = (textarea: any) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className={`MessageWrapper ${senderType}`}>
      {senderType === "humanSender" && isEdits ? (
        <textarea
          ref={textareaRef}
          value={sentences.join(' ')}
          onChange={(event) => handleChange(0, event)}
          className="sentenceTextarea"
          placeholder="Enter your idea here..."
        />
      ) : (
        // Only render the sentences when senderType is not DefaultSender
        senderType !== "DefaultSender" && sentences.map((sentence, index) => (
          <p key={index}>{sentence}</p>
        ))
      )}
      
      {senderType === "DefaultSender" && (
        <div>
          {isEdits ? (
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => {
                const clonedMessages = [...messageState];
                clonedMessages[clonedMessages.length - 1].message = event.target.value;
                setMessages(clonedMessages);
              }}
              className="sentenceTextarea"
              placeholder="Enter your idea here..."
            />
          ) : (
            <p>{message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
