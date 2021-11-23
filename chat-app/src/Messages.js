import React, { useEffect, useState } from 'react';

function Messages({ socket, user }) {
  const [messages, setMessages] = useState({});

  function deleteMessage(msg) {
    socket.emit('deleteMessage', msg);
    setMessages((prevMessages) => {
      const newMessages = {...prevMessages};
      delete newMessages[msg.id];
      return newMessages
    });
    socket.emit('getMessages');
  }

  useEffect(() => {
    const messageListener = (message) => {
      if (message.room !== user.room) return;
      setMessages((prevMessages) => {
        const newMessages = {...prevMessages};
        newMessages[message.id] = message;
        return newMessages;
      });
    };

    socket.on('message', messageListener);
    socket.emit('getMessages');
  }, [socket]);

  return (
    <div className="message-list">
      {[...Object.values(messages)]
        .sort((a, b) => a.time - b.time)
        .map((message) => (
          <div
            key={message.id}
            className="message-container"
            title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
          >
            <span className="user">{message.username}:</span>
            <span className="message">{message.message}</span>
            <span className="date">{new Date(message.time).toLocaleTimeString()}</span>
            <button onClick={() => deleteMessage(message)}>Delete Message</button>
          </div>
        ))
      }
    </div>
  );
}

export default Messages;
