// src/pages/Messages.jsx
import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { getSocket } from '../lib/socket';

export default function Messages() {
  const [threads, setThreads] = useState([]);
  const [activeOtherId, setActiveOtherId] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  async function loadThreads() {
    const { data } = await api.get('/messages/threads');
    setThreads(data);
    if (!activeOtherId && data[0]?.otherUserId) {
      selectThread(data[0].otherUserId);
    }
  }

  async function selectThread(otherUserId) {
    setActiveOtherId(otherUserId);
    const { data } = await api.get(`/messages/with/${otherUserId}?limit=50`);
    setMsgs(data);
    await api.post(`/messages/with/${otherUserId}/read`);
  }

  async function send() {
    const body = text.trim();
    if (!body || !activeOtherId) return;
    setText('');
    // realtime emit + HTTP fallback insert
    const socket = getSocket();
    socket.emit('message:send', { receiverId: activeOtherId, body });
    const { data } = await api.post(`/messages/with/${activeOtherId}`, { body });
    setMsgs(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data]);
  }

  useEffect(() => { loadThreads(); }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('message:new', (m) => {
      // if message belongs to open thread, append + mark read
      const involved = activeOtherId && (m.sender_id === activeOtherId || m.receiver_id === activeOtherId);
      if (involved) {
        setMsgs(prev => [...prev, m]);
        api.post(`/messages/with/${activeOtherId}/read`).catch(()=>{});
      }
      loadThreads();
    });
    socket.on('typing', ({ otherUserId, isTyping }) => {
      if (otherUserId === activeOtherId) setTyping(isTyping);
    });
    return () => {
      socket.off('message:new');
      socket.off('typing');
    };
  }, [activeOtherId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <aside className="col-span-4 bg-white rounded-2xl shadow divide-y">
        {threads.map(t => (
          <button
            key={t.otherUserId}
            onClick={() => selectThread(t.otherUserId)}
            className={`w-full text-left p-4 hover:bg-slate-50 ${activeOtherId===t.otherUserId ? 'bg-slate-50' : ''}`}>
            <div className="flex justify-between">
              <span className="font-semibold">User #{t.otherUserId}</span>
              {t.unread > 0 && (
                <span className="text-xs rounded-full px-2 py-0.5 bg-green-600 text-white">{t.unread}</span>
              )}
            </div>
            <div className="text-sm text-gray-500 truncate">{t.lastBody || 'No messages yet'}</div>
          </button>
        ))}
        {threads.length === 0 && (
          <div className="p-4 text-sm text-slate-500">No conversations yet.</div>
        )}
      </aside>

      <section className="col-span-8">
        {activeOtherId ? (
          <div className="bg-white rounded-2xl shadow h-[70vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {msgs.map(m => (
                <div
                  key={m.id}
                  className={`max-w-[70%] px-3 py-2 rounded-xl ${
                    m.sender_id === user?.id ? 'ml-auto bg-green-600 text-white' : 'bg-slate-100'
                  }`}>
                  {m.body}
                  <div className="text-[10px] opacity-60 mt-1">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t">
              {typing && <div className="text-xs text-gray-500 mb-1">typing…</div>}
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={e => {
                    setText(e.target.value);
                    const socket = getSocket();
                    socket.emit('typing', { otherUserId: activeOtherId, isTyping: e.target.value.length > 0 });
                  }}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  className="flex-1 border rounded-xl px-3 py-2 outline-none"
                  placeholder="Write a message…"
                />
                <button onClick={send} className="rounded-2xl px-4 py-2 bg-green-600 text-white">Send</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 text-slate-500">Select a conversation.</div>
        )}
      </section>
    </div>
  );
}
