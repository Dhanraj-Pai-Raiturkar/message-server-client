import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import JoinChat from './components/JoinChat';

function App() {
  const [socket, setSocket] = useState();
  const [messages ,setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState(undefined);
  const [joinChat, setJoinChat] = useState(false);
  const messagesEndRef = useRef(null)
  const renderMessages = (data) => {
    setMessages(data);
    scrollBottom();
  }
  const handleSubmit = (e) => {
    e?.preventDefault();
    if(socket && messageInput) {
      socket.emit('createMessage', {name:sessionStorage?.name, text:messageInput});
    }
    setMessageInput('');
  };
  const scrollBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
  }
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);
    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });
    socketInstance.on('findAllMessages',(data) => {
      renderMessages(data);
    });
    socketInstance?.emit('findAllMessages', (data) => {
      renderMessages(data)
    });
  }, [joinChat]);

  useEffect(() => {
    scrollBottom();
  }, [joinChat, messages])

  return (
    <div style={{display:'flex', justifyContent:'center', alignContent:'center'}}>
      {
        joinChat ?
        <div style={{width:'50%'}} ref={messagesEndRef}>
          {
            messages?.map((chat, index) => <div key={`messages_${index}`} style={{margin:'1rem', width:'100%', display:'flex', flexDirection:'column', alignItems:`${sessionStorage?.name === chat?.name ? 'flex-end' : 'flex-start'}`}}><div style={{width:'35%'}}><h5 style={{margin:'0px', width:'100%'}}>{chat?.name}</h5><span>{chat?.text}</span></div></div>)
          }
          <div style={{width:'100%'}}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input style={{width:'70%'}} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
              <button style={{width:'20%'}}  onClick={handleSubmit}>send</button>
            </form>
          </div>
        </div> :
        <JoinChat joinChat={setJoinChat} />
      }
    </div>
  );
}

export default App;
