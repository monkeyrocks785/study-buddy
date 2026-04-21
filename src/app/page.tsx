'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [stats, setStats] = useState([
    { title: "Knowledge Base", value: "0", icon: "📚", trend: "Syncing..." },
    { title: "Study Hours", value: "0", icon: "⏱️", trend: "Goal: 4h/day" },
    { title: "Pending Tasks", value: "0", icon: "✅", trend: "Syncing..." },
    { title: "Days to Exams", value: "24", icon: "⏳", trend: "First: PEM (16/12)" },
  ]);

  const [subjects, setSubjects] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const fetchJson = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
      };

      const notes = await fetchJson('/api/notes');
      const subs = await fetchJson('/api/subjects');
      const tasks = await fetchJson('/api/tasks');
      
      const pending = tasks.filter((t: any) => !t.completed).length;

      setSubjects(subs);
      setStats(prev => {
        const n = [...prev];
        n[0].value = notes.length.toString();
        n[0].trend = `${notes.length} items safe`;
        n[2].value = pending.toString();
        n[2].trend = pending > 0 ? "Action required" : "All clean!";
        return n;
      });
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '8px' }} className="text-gradient">Student Cockpit</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Everything is secure and synchronized across your account.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="glass" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: '600' }} onClick={fetchDashboardData}>Refresh</button>
          <button className="btn-primary" onClick={async () => { await fetch('/api/auth/logout', {method:'POST'}); window.location.href='/login'; }}>Sign Out</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="premium-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ background: 'var(--glass-bg)', padding: '14px', borderRadius: '14px', fontSize: '28px' }}>{stat.icon}</div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', background: 'var(--accent-glow)', padding: '6px 12px', borderRadius: '8px', textTransform: 'uppercase' }}>{stat.trend}</span>
            </div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>{stat.title}</h4>
            <p style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px' }}>
        <section className="premium-card" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '32px', fontSize: '22px', fontWeight: '800' }}>Live Subject Mastery</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {subjects.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--glass-bg)', borderRadius: '16px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Your academic garden is empty. Start by uploading notes!</p>
              </div>
            )}
            {subjects.map((sub, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>{sub.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{sub.progress}%</span>
                </div>
                <div style={{ height: '12px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${sub.progress}%`, 
                    background: `linear-gradient(90deg, ${sub.color}, #fff)`, 
                    borderRadius: '10px',
                    boxShadow: `0 0 10px ${sub.color}44`,
                    transition: 'width 1s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '800' }}>Mission Control</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <button className="btn-primary" onClick={() => window.location.href='/study'} style={{ width: '100%', padding: '16px' }}>🚀 Launch Study Studio</button>
               <button className="glass" onClick={() => window.location.href='/notes'} style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '700' }}>📝 Knowledge Library</button>
               <button className="glass" onClick={() => window.location.href='/homework'} style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '700' }}>🎯 Task Management</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
