'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  name: string;
  subject: string;
  size: string;
  type: string;
  url: string;
  date: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [subject, setSubject] = useState('');
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (e) {
      console.error("Notes fetch error:", e);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (file: File) => {
    if (!subject.trim()) {
      alert('Please enter a subject name first.');
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        setSubject('');
        fetchNotes();
      } else {
        const data = await res.json();
        alert(data.error || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openInStudio = (note: Note) => {
    localStorage.setItem('selected_note', JSON.stringify(note));
    router.push('/study');
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h2 className="text-gradient" style={{ fontSize: '32px', fontWeight: '800' }}>Knowledge Base</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Upload notes and define subjects dynamically.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        <section>
          {notes.length === 0 ? (
            <div className="glass" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '24px' }}>
              <span style={{ fontSize: '56px', display: 'block', marginBottom: '24px' }}>📚</span>
              <p style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>Library is empty</p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '12px' }}>Enter a subject and upload your first file.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {notes.map((note) => (
                <div key={note.id} className="premium-card" style={{ padding: '24px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                     <div style={{ fontSize: '40px' }}>
                       {note.type.toLowerCase() === 'pdf' ? '📕' : '📄'}
                     </div>
                     <span style={{ fontSize: '10px', fontWeight: '800', padding: '4px 8px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '6px', textTransform: 'uppercase' }}>
                       {note.subject}
                     </span>
                   </div>
                   <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.name}</h4>
                   <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{note.size} • {new Date(note.date).toLocaleDateString()}</p>
                   <button className="btn-primary" style={{ width: '100%', fontSize: '12px', padding: '10px' }} onClick={() => openInStudio(note)}>
                     Open in Studio
                   </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass" style={{ padding: '32px', height: 'fit-content', position: 'sticky', top: '40px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '800' }}>Upload New Material</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Subject Name</label>
            <input 
              type="text" 
              placeholder="e.g. Physics, Web Dev..." 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', padding: '12px', borderRadius: '12px', color: 'white' }}
            />
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
            }}
            style={{ 
              border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '20px',
              padding: '40px 20px',
              textAlign: 'center',
              background: dragActive ? 'var(--accent-glow)' : 'var(--glass-bg)',
              transition: 'var(--transition)',
              cursor: 'pointer',
              opacity: subject.trim() ? 1 : 0.5
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{uploading ? '⌛' : '📤'}</div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>
              {uploading ? 'Uploading...' : 'Drop file here'}
            </p>
            <input type="file" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} style={{ display: 'none' }} id="file-upload" disabled={!subject.trim()} />
            <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={() => document.getElementById('file-upload')?.click()} disabled={uploading || !subject.trim()}>
              {uploading ? 'Processing...' : 'Select File'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
