import React, { useEffect, useState } from 'react';
import io  from "socket.io-client";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MessageInput from './MessageInput'
import Messages from './Messages'

const SERVER = "http://127.0.0.1:3000/";

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    console.log('connected with socket')
    return () => newSocket.close();
  }, [setSocket]);


  function displayContainer() {
    if (socket && !user) {
      return (
        <div className="create-user">
          <Formik
            initialValues={{ name: '', room: '' }}
            onSubmit={(val) => {
              socket.emit('user', { username: val.name, room: val.room });
              socket.on('user', (userinfo) => {
                setUser(userinfo);
              });
              return () => socket.close();
            }}
          >
            <Form>
              <label htmlFor="name">Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" />

              <label htmlFor="room">Room</label>
              <Field name="room" type="text" />
              <ErrorMessage name="room" />

              <button type="submit">Create User</button>
            </Form>
          </Formik>
        </div>
      )
    } else if (socket) {
      return (
        <div className="chat-container">
          <div className="chat-banner">
            <div>Current Room: {user.room}</div>
          </div>
          <Messages socket={socket} user={user}/>
          <MessageInput socket={socket} user={user}/>
        </div>
      )
    } else {
      return (<div>Not Connected</div>);
    }
  }

  return (
    <div className="App">
      <header className="app-header">
        React Chat
      </header>
      {displayContainer()}
    </div>
  );
}

export default App;
