import { useState, useEffect, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from '../api/authApi'
import { useNavigate } from 'react-router-dom'

const SOCKET_URL = 'http://localhost:5000'
const API_URL = 'http://localhost:5000/api/chat'

let socket

export default function App() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [dark, setDark] = useState(true)
  const [showNewChat, setShowNewChat] = useState(false)
  const [newChatUsername, setNewChatUsername] = useState('')
  const [newChatError, setNewChatError] = useState('')
  const messagesEndRef = useRef(null)

  const myProfile = {
    username: user?.username || '',
    email: user?.email || '',
    avatar: `https://api.dicebear.com/10.x/avataaars/svg?seed=${user?.username}`,
    joined: 'May 2024'
  }

  const t = {
    bg:        dark ? 'bg-gradient-to-r from-[#3D5970] to-[#132A40]'       : 'from-[#e8f4fd] to-[#cce6f5]',
    sidebar:   dark ? 'bg-[#07111e]'                       : 'bg-[#f0f8ff]',
    sidebarBorder: dark ? 'border-[rgba(0,212,255,0.15)]'  : 'border-[rgba(0,120,200,0.2)]',
    panel:     dark ? 'bg-[#07111e]'                       : 'bg-white',
    mainBg:    dark ? 'bg-[#050a0f]'                       : 'bg-[#f5fbff]',
    text:      dark ? 'text-[#c8e6f0]'                     : 'text-[#0d2a3a]',
    accent:    dark ? 'text-[#00d4ff]'                     : 'text-[#0078c8]',
    muted:     dark ? 'text-[#4a7a8a]'                     : 'text-[#5a9ab8]',
    chatHover: dark ? 'hover:bg-[rgba(0,212,255,0.02)]'    : 'hover:bg-[rgba(0,120,200,0.04)]',
    chatActive:dark ? 'bg-[rgba(0,212,255,0.06)] shadow-[inset_4px_0_0_#00ff88]' : 'bg-[rgba(0,120,200,0.08)] shadow-[inset_4px_0_0_#00a86b]',
    inputBg:   dark ? 'bg-[#050a0f]'                       : 'bg-white',
    inputBorder: dark ? 'border-[rgba(0,212,255,0.2)]'     : 'border-[rgba(0,120,200,0.25)]',
    bubbleOther: dark ? 'bg-[#07111e] text-[#c8e6f0] border border-[rgba(0,212,255,0.1)]' : 'bg-white text-[#0d2a3a] border border-[rgba(0,120,200,0.15)] shadow-md',
    footer:    dark ? 'bg-[#040a12]'                       : 'bg-[#e8f4fd]',
  }

  useEffect(() => {
    if (!user) return
    socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token')
      }
    })
    socket.on('connect', () => console.log('Socket connected'))
    socket.on('connect_error', (err) => console.error('Socket error:', err.message))
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, {
        id: msg._id,
        sender: msg.sender,
        text: msg.content,
        mine: msg.sender === user.username,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    })
    return () => socket.disconnect()
  }, [user])

  useEffect(() => {
    if (!user) return
    fetch(`${API_URL}/chats/${user.username}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(chat => ({
          id: chat._id,
          name: chat.participants.find(p => p !== user.username) || 'Unknown',
          preview: chat.lastMessage || 'No messages yet',
          avatar: `https://api.dicebear.com/10.x/avataaars/svg?seed=${chat._id}`,
          offline: false
        }))
        setChats(formatted)
        if (formatted.length > 0) switchChat(formatted[0])
      })
      .catch(() => setChats([]))
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function switchChat(chat) {
    setShowProfilePage(false)
    setActiveChat(chat)
    if (socket) socket.emit('join_room', chat.id)
    fetch(`${API_URL}/messages/${chat.id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setMessages(data.map(msg => ({
          id: msg._id,
          sender: msg.sender,
          text: msg.content,
          mine: msg.sender === user.username,
          time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })))
      })
      .catch(() => setMessages([]))
  }

  function sendMessage() {
    if (!input.trim() || !activeChat || !socket) return
    socket.emit('send_message', { chatId: activeChat.id, message: input })
    setInput('')
  }

  async function startNewChat() {
    if (!newChatUsername.trim()) return
    setNewChatError('')
    try {
      const res = await fetch(`${API_URL}/chats`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: [user.username, newChatUsername.trim()] })
      })
      const chat = await res.json()
      if (!res.ok) {
        setNewChatError(chat.error || 'Failed to create chat')
        return
      }
      const formatted = {
        id: chat._id,
        name: chat.participants.find(p => p !== user.username) || 'Unknown',
        preview: chat.lastMessage || 'No messages yet',
        avatar: `https://api.dicebear.com/10.x/avataaars/svg?seed=${chat._id}`,
        offline: false
      }
      setChats(prev => {
        const exists = prev.find(c => c.id === formatted.id)
        return exists ? prev : [formatted, ...prev]
      })
      switchChat(formatted)
      setNewChatUsername('')
      setShowNewChat(false)
    } catch (err) {
      setNewChatError('Something went wrong')
    }
  }

  async function handleLogout() {
    await logoutUser()
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <div
      className={`flex h-screen ${t.text} antialiased overflow-hidden select-none`}
      style={{
        background: dark
          ? 'linear-gradient(135deg, #12253a 30%, #050a0f 70%)'
          : 'linear-gradient(135deg, #e8f4fd 30%, #cce6f5 70%)'
      }}
    >
      {/* Sidebar */}
      <div className={`w-[340px] border-r ${t.sidebarBorder} ${t.sidebar} flex flex-col gap-3 z-10 shrink-0`}>
        <div className={`p-4 border-b ${t.sidebarBorder} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span className={`font-bold text-[13px] tracking-[3px] ${t.accent}`}>MESSAGES</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider border transition-all ${
                dark
                  ? 'border-[rgba(0,255,136,0.3)] text-[#00ff88] hover:bg-[rgba(0,255,136,0.08)]'
                  : 'border-[rgba(0,150,100,0.3)] text-[#00a86b] hover:bg-[rgba(0,150,100,0.05)]'
              }`}
            >
              + NEW
            </button>
            <button
              onClick={() => setDark(!dark)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider border transition-all ${
                dark
                  ? 'border-[rgba(0,212,255,0.3)] text-[#00d4ff] hover:bg-[rgba(255,255,255,0.1)]'
                  : 'border-[rgba(0,120,200,0.3)] text-[#0078c8] hover:bg-[rgba(0,0,0,0.05)]'
              }`}
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {showNewChat && (
          <div className="px-3 pb-2 flex flex-col gap-2">
            <input
              value={newChatUsername}
              onChange={e => setNewChatUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && startNewChat()}
              placeholder="Enter username..."
              className={`w-full ${t.inputBg} border ${t.inputBorder} ${t.text} p-3 text-[13px] outline-none rounded-2xl focus:border-[#00ff88] transition-all`}
            />
            {newChatError && <div className="text-red-400 text-[11px] px-1">{newChatError}</div>}
            <button
              onClick={startNewChat}
              className="bg-[#00ff88] text-[#050a0f] font-bold text-[12px] tracking-wider py-2 rounded-xl active:scale-95 transition-all"
            >
              START CHAT
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-2 px-2">
          {chats.length === 0 ? (
            <div className={`text-center text-[13px] mt-8 ${t.muted}`}>No chats yet</div>
          ) : (
            chats.map(chat => {
              const isActive = !showProfilePage && activeChat?.id === chat.id
              return (
                <div
                  key={chat.id}
                  onClick={() => switchChat(chat)}
                  className={`p-4 cursor-pointer rounded-2xl relative transition-all duration-150 ${
                    isActive ? t.chatActive : t.chatHover
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className={`w-12 h-12 rounded-full border-2 object-cover ${
                          chat.offline ? 'border-gray-500' : 'border-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.4)]'
                        }`}
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                        dark ? 'border-[#07111e]' : 'border-[#f0f8ff]'
                      } ${chat.offline ? 'bg-gray-500' : 'bg-[#00ff88] shadow-[0_0_6px_#00ff88]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[15px] font-bold tracking-wide truncate ${t.text}`}>{chat.name}</div>
                      <div className={`text-[12px] mt-0.5 truncate ${t.muted}`}>{chat.preview}</div>
                    </div>
                    {!chat.offline && isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#00ff88] shrink-0" />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div
          onClick={() => setShowProfilePage(true)}
          className={`flex gap-3 items-center p-4 border-t ${t.sidebarBorder} cursor-pointer ${t.footer} transition-colors hover:opacity-90 ${
            showProfilePage ? (dark ? 'shadow-[inset_4px_0_0_#00d4ff]' : 'shadow-[inset_4px_0_0_#0078c8]') : ''
          }`}
        >
          <div className="relative">
            <img src={myProfile.avatar} alt="Me" className={`w-12 h-12 rounded-full border-2 ${dark ? 'border-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.4)]' : 'border-[#0078c8] shadow-[0_0_10px_rgba(0,120,200,0.3)]'} object-cover`} />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00ff88] border-2 border-[#040a12]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`text-[14px] font-bold tracking-wide truncate ${t.accent}`}>{myProfile.username}</div>
            <div className={`text-[11px] tracking-wider font-medium ${t.muted}`}>⚙️ MY SETTINGS</div>
          </div>
          <span className={`text-xl ${t.muted}`}>›</span>
        </div>
      </div>

      {/* Main */}
      {showProfilePage ? (
        <div className={`flex-1 flex flex-col z-10 min-w-0 ${t.mainBg}`}>
          <div className={`p-5 border-b ${t.sidebarBorder} ${t.panel} flex items-center gap-3`}>
            <span className="text-xl">👤</span>
            <div className={`text-[15px] font-bold tracking-wider ${t.accent}`}>MY PROFILE ~ {myProfile.username}</div>
          </div>
          <div className="flex-1 flex justify-center items-center p-6">
            <div className={`w-full max-w-[560px] p-8 ${t.panel} border ${t.sidebarBorder} rounded-3xl flex flex-col gap-3 items-center shadow-[0_0_40px_rgba(0,212,255,0.1)]`}>
              <img src={myProfile.avatar} alt="Large Profile" className={`w-32 h-32 rounded-full border-2 ${dark ? 'border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.4)]' : 'border-[#0078c8]'} bg-[#050a0f] p-1`} />
              <div className="w-full flex flex-col gap-1.5">
                <label className={`text-[11px] tracking-wider font-bold ${t.muted}`}>USERNAME</label>
                <input type="text" value={myProfile.username} readOnly
                  className={`${t.inputBg} border ${t.inputBorder} ${t.accent} p-3 text-[14px] outline-none rounded-2xl w-full`} />
              </div>
              <div className="w-full flex flex-col gap-1.5">
                <label className={`text-[11px] tracking-wider font-bold ${t.muted}`}>EMAIL</label>
                <input type="email" value={myProfile.email} readOnly
                  className={`${t.inputBg} border ${t.inputBorder} ${t.accent} p-3 text-[14px] outline-none rounded-2xl w-full`} />
              </div>
              <div className={`text-[11px] tracking-wider mt-2 ${t.muted}`}>📅 JOINED: {myProfile.joined}</div>
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold text-[12px] tracking-wider px-10 py-3 rounded-xl active:scale-95 transition-all shadow-lg w-full"
              >
                🚪 LOGOUT
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex flex-col z-10 min-w-0 ${t.mainBg}`}>
          <div className={`p-4 px-6 border-b ${t.sidebarBorder} ${t.panel} flex items-center gap-4 shadow-sm`}>
            {activeChat ? (
              <>
                <div className="relative">
                  <img src={activeChat.avatar} alt={activeChat.name}
                    className={`w-11 h-11 rounded-full border-2 object-cover ${activeChat.offline ? 'border-gray-500' : 'border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]'}`} />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${dark ? 'border-[#07111e]' : 'border-white'} ${activeChat.offline ? 'bg-gray-500' : 'bg-[#00ff88]'}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-[15px] tracking-wide ${t.text}`}>{activeChat.name}</div>
                  <div className={`text-[11px] font-medium tracking-wider mt-0.5 ${activeChat.offline ? 'text-gray-500' : 'text-[#00ff88]'}`}>
                    {activeChat.offline ? '● OFFLINE' : '● ONLINE · Last seen just now'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className={`text-xl p-2 rounded-xl transition-all ${dark ? 'hover:bg-[rgba(0,212,255,0.08)] text-[#4a7a8a] hover:text-[#00d4ff]' : 'hover:bg-[rgba(0,120,200,0.08)] text-[#5a9ab8]'}`}>📞</button>
                  <button className={`text-xl p-2 rounded-xl transition-all ${dark ? 'hover:bg-[rgba(0,212,255,0.08)] text-[#4a7a8a] hover:text-[#00d4ff]' : 'hover:bg-[rgba(0,120,200,0.08)] text-[#5a9ab8]'}`}>🎮</button>
                  <button className={`text-xl p-2 rounded-xl transition-all ${dark ? 'hover:bg-[rgba(0,212,255,0.08)] text-[#4a7a8a] hover:text-[#00d4ff]' : 'hover:bg-[rgba(0,120,200,0.08)] text-[#5a9ab8]'}`}>⋯</button>
                </div>
              </>
            ) : (
              <div className={`text-[14px] ${t.muted}`}>Select a chat or start a new one</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.mine ? 'items-end' : 'items-start'}`}>
                <div className={`text-[11px] tracking-wider mb-1.5 font-bold px-2 ${t.muted}`}>
                  {msg.mine ? 'YOU' : msg.sender.toUpperCase()}
                </div>
                <div className={`p-4 px-6 text-[16px] max-w-[65%] leading-relaxed rounded-2xl transition-all ${
                  msg.mine
                    ? 'bg-[#00e5a3] text-[#040a12] font-semibold rounded-tr-none shadow-[0_4px_24px_rgba(0,229,163,0.35)]'
                    : `${t.bubbleOther} rounded-tl-none shadow-lg`
                }`}>
                  {msg.text}
                </div>
                {msg.time && <div className={`text-[10px] mt-1.5 px-2 ${t.muted}`}>🕐 {msg.time}</div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-5 px-6 border-t ${t.sidebarBorder} ${t.panel} flex gap-4 items-center shadow-[0_-8px_32px_rgba(0,0,0,0.25)]`}>
            <button className={`text-2xl p-2 rounded-xl shrink-0 transition-all ${dark ? 'text-[#4a7a8a] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)]' : 'text-[#5a9ab8] hover:text-[#0078c8]'}`}>📎</button>
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="💬  Type a message..."
                className={`w-full ${t.inputBg} border-2 ${t.inputBorder} ${t.text} p-5 px-7 text-[15px] outline-none rounded-3xl focus:border-[#00d4ff] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.2)]`}
              />
            </div>
            <button className={`text-2xl p-2 rounded-xl shrink-0 transition-all ${dark ? 'text-[#4a7a8a] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)]' : 'text-[#5a9ab8] hover:text-[#0078c8]'}`}>😊</button>
            <button
              onClick={sendMessage}
              className={`${dark ? 'bg-[#00d4ff] hover:bg-[#33ddff] shadow-[0_0_20px_rgba(0,212,255,0.5)]' : 'bg-[#0078c8] hover:bg-[#0090e8] shadow-[0_0_20px_rgba(0,120,200,0.4)]'} text-[#050a0f] font-black text-[13px] tracking-widest py-4 px-8 cursor-pointer rounded-2xl active:scale-95 transition-all shrink-0`}
            >
              SEND▶
            </button>
          </div>
        </div>
      )}
    </div>
  )
}