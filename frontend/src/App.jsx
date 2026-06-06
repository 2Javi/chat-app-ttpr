import { useState } from 'react'

const chats = [
  { id: 1, name: 'Person 1', preview: 'Sure, what time?', avatar: 'https://api.dicebear.com/10.x/avataaars/svg?seed=Person1' },
  { id: 2, name: 'Person 2', preview: 'Hey there!', avatar: 'https://api.dicebear.com/10.x/avataaars/svg?seed=Person2' },
  { id: 3, name: 'Person 3', preview: 'Game build uploading', offline: true, avatar: 'https://api.dicebear.com/10.x/avataaars/svg?seed=Person3' },
]
const initMessages = [
  { id: 1, sender: 'Person 1', text: 'Hey, what are you doing today?', mine: false },
  { id: 2, sender: 'me', text: 'Going out, wanna join?', mine: true },
  { id: 3, sender: 'Person 1', text: 'Sure, what time?', mine: false },
]

export default function App() {
  const [pendingMessage, setPendingMessage] = useState(null)
  const [gameActive, setGameActive] = useState(false)
  const [activeChat, setActiveChat] = useState(chats[0])
  const [messages, setMessages] = useState(initMessages)
  const [input, setInput] = useState('')
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [dark, setDark] = useState(true)

  const [myProfile, setMyProfile] = useState({
    username: 'Enxhi Jonuzi',
    email: 'jonuzienxhi@gmail.com',
    avatar: 'https://api.dicebear.com/10.x/avataaars/svg?seed=Me',
    joined: 'May 2024'
  })

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

  function sendMessage() {
  if (!input.trim()) return
  const msg = input.trim()
  setPendingMessage(msg)
  setInput('')
  setGameActive(true)
  window.onGameResult = (won) => {
    if (won) {
      const now = new Date()
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      setMessages(prev => [...prev, { id: Date.now(), sender: 'me', text: msg, mine: true, time }])
    }
    setGameActive(false)
    setPendingMessage(null)
  }
}

  function switchChat(chat) {
    setShowProfilePage(false)
    setActiveChat(chat)
    setMessages([{ id: 1, sender: chat.name, text: chat.preview, mine: false }])
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

        {/* Sidebar Header */}
        <div className={`p-4 border-b ${t.sidebarBorder} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span className={`font-bold text-[13px] tracking-[3px] ${t.accent}`}>MESSAGES</span>
          </div>
          {/* Dark/Light toggle */}
          <button
            onClick={() => setDark(!dark)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider border transition-all ${
  dark
    ? 'border-[rgba(0,212,255,0.3)] text-[#00d4ff] hover:bg-[rgba(255,255,255,0.1)]'
    : 'border-[rgba(0,120,200,0.3)] text-[#0078c8] hover:bg-[rgba(0,0,0,0.05)]'
}`}
          >
            {dark ? '☀️ LIGHT' : '🌙 DARK'}
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-2 px-2">
          {chats.map(chat => {
            const isActive = !showProfilePage && activeChat.id === chat.id
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
                  {/* Unread dot decoration */}
                  {!chat.offline && isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#00ff88] shrink-0" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* User Footer */}
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
            <div className={`w-full max-w-[560px] p-8 ${t.panel} border ${t.sidebarBorder} rounded-3xl flex flex-col gap-3 items-center gap-5 shadow-[0_0_40px_rgba(0,212,255,0.1)]`}>
              <img src={myProfile.avatar} alt="Large Profile" className={`w-32 h-32 rounded-full border-2 ${dark ? 'border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.4)]' : 'border-[#0078c8]'} bg-[#050a0f] p-1`} />
              <div className="w-full flex flex-col gap-1.5">
                <label className={`text-[11px] tracking-wider font-bold ${t.muted}`}>USERNAME</label>
                <input type="text" value={myProfile.username} onChange={(e) => setMyProfile({...myProfile, username: e.target.value})}
                  className={`${t.inputBg} border ${t.inputBorder} ${t.accent} p-3 text-[14px] outline-none rounded-2xl focus:border-[#00d4ff] transition-colors w-full`} />
              </div>
              <div className="w-full flex flex-col gap-1.5">
                <label className={`text-[11px] tracking-wider font-bold ${t.muted}`}>EMAIL</label>
                <input type="email" value={myProfile.email} onChange={(e) => setMyProfile({...myProfile, email: e.target.value})}
                  className={`${t.inputBg} border ${t.inputBorder} ${t.accent} p-3 text-[14px] outline-none rounded-2xl focus:border-[#00d4ff] transition-colors w-full`} />
              </div>
              <div className={`text-[11px] tracking-wider mt-2 ${t.muted}`}>📅 JOINED: {myProfile.joined}</div>
              <button className={`mt-2 ${dark ? 'bg-[#00d4ff] hover:bg-[#33ddff]' : 'bg-[#0078c8] hover:bg-[#0090e8]'} text-[#050a0f] font-bold text-[12px] tracking-wider px-10 py-3 rounded-xl active:scale-95 transition-all shadow-lg`}>
                💾 SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex flex-col z-10 min-w-0 ${t.mainBg}`}>

          {/* Chat Header */}
          <div className={`p-4 px-6 border-b ${t.sidebarBorder} ${t.panel} flex items-center gap-4 shadow-sm`}>
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
            {/* Header icons */}
            <div className="flex items-center gap-3">
              <button className={`text-xl p-2 rounded-xl transition-all ${dark ? 'hover:bg-[rgba(0,212,255,0.08)] text-[#4a7a8a] hover:text-[#00d4ff]' : 'hover:bg-[rgba(0,120,200,0.08)] text-[#5a9ab8]'}`}>📞</button>
              <button className={`text-xl p-2 rounded-xl transition-all ${dark ? 'hover:bg-[rgba(0,212,255,0.08)] text-[#4a7a8a] hover:text-[#00d4ff]' : 'hover:bg-[rgba(0,120,200,0.08)] text-[#5a9ab8]'}`}>🎮</button>
              <button className={`text-xl p-2 rounded-xl transition-all ${dark ? 'hover:bg-[rgba(0,212,255,0.08)] text-[#4a7a8a] hover:text-[#00d4ff]' : 'hover:bg-[rgba(0,120,200,0.08)] text-[#5a9ab8]'}`}>⋯</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.mine ? 'items-end' : 'items-start'}`}>
                <div className={`text-[11px] tracking-wider mb-1.5 font-bold px-2 ${t.muted}`}>
                  {msg.mine ? 'YOU' : ` ${msg.sender.toUpperCase()}`}
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
          </div>

          {/* Input Bar */}
          <div className={`p-5 px-6 border-t ${t.sidebarBorder} ${t.panel} flex gap-4 items-center shadow-[0_-8px_32px_rgba(0,0,0,0.25)]`}>
            {/* Attachment icon */}
            <button className={`text-2xl p-2 rounded-xl shrink-0 transition-all ${dark ? 'text-[#4a7a8a] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)]' : 'text-[#5a9ab8] hover:text-[#0078c8]'}`}>📎</button>
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="💬  Type a message..."
                className={`w-full ${t.inputBg} border-2 ${t.inputBorder} ${t.text} p-5 px-7 text-[15px] outline-none rounded-3xl placeholder:${t.muted} focus:border-[#00d4ff] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.2)]`}
              />
            </div>
            {/* Emoji icon */}
            <button className={`text-2xl p-2 rounded-xl shrink-0 transition-all ${dark ? 'text-[#4a7a8a] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)]' : 'text-[#5a9ab8] hover:text-[#0078c8]'}`}>😊</button>
            {/* Send button */}
            <button
              onClick={sendMessage}
              className={`${dark ? 'bg-[#00d4ff] hover:bg-[#33ddff] shadow-[0_0_20px_rgba(0,212,255,0.5)]' : 'bg-[#0078c8] hover:bg-[#0090e8] shadow-[0_0_20px_rgba(0,120,200,0.4)]'} text-[#050a0f] font-black text-[13px] tracking-widest py-4 px-8 cursor-pointer rounded-2xl active:scale-95 transition-all shrink-0`}
            >
              SEND▶
            </button>
          </div>
        </div>
      )}

{gameActive && (
  <div className="fixed inset-0 z-50 bg-black">
    <iframe
      src="/webgl-build/index.html"
      className="w-full h-full border-0"
    />
  </div>
)}

    </div>
  )
}
