import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import sendIcon from './assets/send.png'
const socket = io('http://localhost:3000')


interface messageDetails{
  username: string;
  message: string;
  
}

function App() {
  const [messageList, setMessageList] = useState<messageDetails[]>([])
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('Room 1')
  const [toggler, setToggler] = useState(false)
  const [message, setMessage] = useState('')

  const joinRoom = () =>{
    if(username === '') return alert('Empty')

      socket.emit('join_room', {room, username})
      setToggler(true)
  }

  const SendMessage = () =>{
   
    if(message === '') return alert('Message is empty')

   socket.emit('send_message', {message, username, room})
   setMessageList(prev => [...prev, {username, message}])
   setMessage('')
  }

  useEffect(() =>{
    socket.on('receive_message', data =>{
      console.log(data)
      setMessageList(prev => [...prev, {username: data.username, message: data.message}])
    })
  },[])

  return (
    <>
      <div className='app-bg'>

        {toggler ? <ChatRoom room={room} username={username} messageList={messageList} message={message} SendMessage={SendMessage} setMessage={setMessage} /> : <div className='login-container'>
            <label htmlFor="">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(prev => prev = e.target.value)}/>
            <label htmlFor="">Select a room</label>
            <select name="" id="" onChange={(e) => setRoom(prev => prev = e.target.value)}>
              <option value="Room 1">Room 1</option>
              <option value="Room 2">Room 2</option>
              <option value="Room 3">Room 3</option>
            </select>
            <button onClick={joinRoom} className='joinRoomBtn'>
              Join Room
            </button>
        </div>}
      
      </div>
        
    </>
  )
}

interface chatProps{
  SendMessage: () => void
  setMessage: React.Dispatch<React.SetStateAction<string>>
  message: string
  messageList: messageDetails[]
  username: string
  room: string
}

const ChatRoom: React.FC<chatProps> = ({ SendMessage, setMessage, message, messageList, username, room }) => {
  return (
    <>
      <div className="chat-room-container">
        <div className="chat-room-header">{room}</div>
        <div className="chat-wrapper">
          {messageList.map((item, index) => (
            <div
              key={index}
              className={item.username === username ? 'message-item you' : 'message-item other'}
            >
           
              <span className="username">{item.username === username ? "You" : item.username}</span>
              <div
                className={item.username === username ? 'message-content you' : 'message-content other'}
              >
                <p>{item.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="message-wrapper">
          <input
            type="text"
            value={message}
            placeholder="Enter message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="sendMessageBtn" onClick={SendMessage}>
            <img src={sendIcon} alt="" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </>
  );
};


export default App
