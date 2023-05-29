import { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import '../App.css'

const Chat = ({ socket, username, room }) => {

    const [currentMessage, setCurrentMessage] = useState("")
    const [messages, setMessages] = useState([])

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit('send_message', messageData)
            setMessages((allmessages) => [...allmessages, messageData])
            setCurrentMessage('');
        }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((allmessages) => [...allmessages, data])
        })
    }, [socket])

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>LIVE CHAT</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                    {messages.map((messageContent, index) => {
                        return (
                            <div key={index} className='message' id={username === messageContent.author ? 'you' : 'other'}>
                                <div className='message-content'>
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <p id='time'>{messageContent.time}</p>
                                    <p id='author'>{messageContent.author}</p>
                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input
                    type='text'
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => { e.key === 'Enter' && sendMessage() }}
                    placeholder='write your message...' />
                <button onClick={sendMessage}>➤</button>
            </div>

        </div>
    )
}

export default Chat