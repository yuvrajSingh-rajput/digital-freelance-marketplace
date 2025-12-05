import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { setGlobalState, useGlobalState, truncate } from '../store'
import Identicon from 'react-identicons'
import { getMessages, sendMessage, listenForMessage } from '../services/chat'
import { Header } from '../components'
import { FaPaperPlane } from 'react-icons/fa'

const Chats = () => {
  const { id } = useParams()
  const [messages] = useGlobalState('messages')
  const [currentUser] = useGlobalState('currentUser')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getMessages(id).then((msgs) => setGlobalState('messages', msgs))
    handleListener()
  }, [currentUser])

  const onSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    await sendMessage(id, message).then((msg) => {
      setGlobalState('messages', (prevState) => [...prevState, msg])
      setMessage('')
      scrollToEnd()
    })
  }

  const handleListener = async () => {
    await listenForMessage(id).then((msg) => {
      setGlobalState('messages', (prevState) => [...prevState, msg])
      scrollToEnd()
    })
  }

  const scrollToEnd = () => {
    const elmnt = document.getElementById('messages-container')
    if (elmnt) {
      elmnt.scrollTop = elmnt.scrollHeight
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#D2C1B6]/20">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#1B3C53] to-[#234C6A] py-4 px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-white text-center">
              Chat Messages
            </h1>
          </div>

          {/* Messages Container */}
          <div
            id="messages-container"
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white"
          >
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <Message 
                  message={msg.text} 
                  uid={msg.sender.uid} 
                  timestamp={msg.timestamp}
                  key={index} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D2C1B6]/30 to-[#456882]/20 rounded-full flex items-center justify-center mb-4">
                  <FaPaperPlane className="text-3xl text-[#456882]" />
                </div>
                <p className="text-[#456882] text-lg">No messages yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Start the conversation by sending a message
                </p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <form 
            onSubmit={onSendMessage} 
            className="bg-white border-t border-gray-200 p-4"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-transparent transition-all bg-white hover:border-[#234C6A]/50"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:from-[#234C6A] hover:to-[#1B3C53] text-white p-3.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const Message = ({ message, uid, timestamp }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const isCurrentUser = uid === connectedAccount

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] ${
          isCurrentUser
            ? 'bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white rounded-2xl rounded-br-md'
            : 'bg-white text-[#1B3C53] rounded-2xl rounded-bl-md border border-gray-200'
        } shadow-sm hover:shadow-md transition-shadow duration-200 p-4`}
      >
        {/* User Info */}
        <div className="flex items-center gap-2 mb-2">
          <Identicon
            string={uid}
            size={24}
            className="rounded-full shadow-sm"
          />
          <div className="flex-1">
            <p className={`font-semibold text-xs ${isCurrentUser ? 'text-white/90' : 'text-[#456882]'}`}>
              {truncate(uid, 4, 4, 11)}
            </p>
          </div>
        </div>

        {/* Message Content */}
        <p className={`text-sm leading-relaxed break-words ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
          {message}
        </p>

        {/* Timestamp (optional - if you have it) */}
        {timestamp && (
          <p className={`text-xs mt-2 ${isCurrentUser ? 'text-white/60' : 'text-gray-400'}`}>
            {new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </div>
    </div>
  )
}

export default Chats