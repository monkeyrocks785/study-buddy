'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StudyPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState('');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/subjects');
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
        if (data.length > 0 && !activeSubject) {
          setActiveSubject(data[0].name);
        }
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (e) {
      console.error("Study studio fetch error:", e);
    }
  };

  useEffect(() => {
    fetchData();

    const savedNote = localStorage.getItem('selected_note');
    if (savedNote) setSelectedNote(JSON.parse(savedNote));
    
    const savedVideo = localStorage.getItem('study_video_url');
    if (savedVideo) setVideoUrl(savedVideo);

    const savedMessages = localStorage.getItem('study_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ 
        id: 1, 
        role: 'ai', 
        text: `Hi! I'm Keren, your study companion. Ready to dive into your materials?` 
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('study_messages', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const aiMessage = { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: `Based on your studies in ${activeSubject}, I recommend focusing on the core principles discussed in ${selectedNote?.name || 'your notes'}. How can I help you clarify this topic further?` 
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('list=')) {
      const listId = new URL(url).searchParams.get('list');
      return `https://www.youtube.com/embed/videoseries?list=${listId}`;
    }
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  return (
    <div className="fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '28px', fontWeight: '800' }}>Study Studio</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Deep work with Keren AI Assistant.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {subjects.map(sub => (
            <button 
              key={sub.id}
              onClick={() => setActiveSubject(sub.name)}
              style={{ 
                background: activeSubject === sub.name ? 'var(--accent)' : 'var(--card-bg)', 
                color: 'white', 
                border: '1px solid var(--border)', 
                padding: '8px 14px', 
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', flexGrow: 1, minHeight: 0 }}>
        <section className="premium-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>{selectedNote?.name || 'No file selected'}</h3>
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => router.push('/notes')}>Library</button>
          </div>
          <div style={{ flexGrow: 1, background: '#0a0c10' }}>
            {selectedNote ? <iframe src={selectedNote.url} style={{ width: '100%', height: '100%', border: 'none' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Load a file from the library</div>}
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="premium-card" style={{ flex: '1.6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
             <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--glass-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ fontSize: '13px', fontWeight: '700' }}>📹 Lecture Player</h3>
               <button onClick={() => setIsEditingVideo(!isEditingVideo)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontWeight: '700' }}>{videoUrl ? 'Edit' : 'Add'}</button>
             </div>
             <div style={{ flexGrow: 1, background: '#000' }}>
               {isEditingVideo ? (
                 <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', height: '100%' }}>
                   <input type="text" placeholder="Video/Playlist URL..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: 'white' }} />
                   <button className="btn-primary" onClick={() => { localStorage.setItem('study_video_url', videoUrl); setIsEditingVideo(false); }}>Save</button>
                 </div>
               ) : videoUrl ? <iframe src={getEmbedUrl(videoUrl)} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>No video loaded</div>}
             </div>
          </section>

          <section className="premium-card" style={{ flex: '0.9', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
              <h3 style={{ fontSize: '13px', fontWeight: '700' }}>Keren AI Assistant</h3>
            </div>
            <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: msg.role === 'user' ? 'var(--accent)' : 'var(--glass-bg)', padding: '10px 14px', borderRadius: '14px', fontSize: '13px', lineHeight: '1.4' }}>{msg.text}</div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', background: 'var(--glass-bg)' }}>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask Keren..." style={{ flexGrow: 1, background: 'var(--background)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '10px', color: 'white', fontSize: '13px' }} />
              <button className="btn-primary" style={{ padding: '10px 14px' }} onClick={handleSendMessage}>➤</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
