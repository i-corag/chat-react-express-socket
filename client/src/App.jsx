import { useState } from 'react'
import { io } from 'socket.io-client'
import Chat from './components/Chat';
import './App.css'


// establish a connection to socket io server
const socket = io("http://localhost:5955");

function App() {

  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room)
      setShowChat(true);
    }
  }

  return (
    <div className='App'>
      {!showChat ? (
        <div className='joinChat'>
          <h3>CHAT</h3>
          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder='enter your name' />
          <input type="text" onChange={(e) => setRoom(e.target.value)} placeholder='enter room id' />
          <button onClick={joinRoom}>JOIN ROOM</button>
        </div>
      ) :
        (<Chat socket={socket} username={username} room={room} />)
      }
    </div>
  )
}

export default App
