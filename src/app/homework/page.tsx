'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  subject: string;
  due: string;
  completed: boolean;
}

export default function HomeworkPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim() || !dueDate || !subject.trim()) {
      alert('Please fill all fields');
      return;
    }
    
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, due: dueDate }),
    });

    if (res.ok) {
      setTitle('');
      setDueDate('');
      setSubject('');
      fetchTasks();
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !currentStatus }),
    });
    if (res.ok) fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const res = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchTasks();
  };

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Loading tasks...</div>;

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h2 className="text-gradient" style={{ fontSize: '32px', fontWeight: '800' }}>Homework & Assignments</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Manage your workload with database-backed persistence.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {tasks.length === 0 ? (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>🎯</span>
              <p style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>No tasks found</p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>Add a new assignment on the right.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="premium-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', opacity: task.completed ? 0.5 : 1, borderLeft: `4px solid ${task.completed ? 'var(--success)' : 'var(--accent)'}` }}>
                <div onClick={() => toggleTask(task.id, task.completed)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: task.completed ? 'var(--accent)' : 'transparent', transition: 'var(--transition)' }}>
                  {task.completed && '✓'}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '17px', fontWeight: '700', color: 'white', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h4>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '700' }}>{task.subject}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📅 Due: {task.due}</span>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>🗑️</button>
              </div>
            ))
          )}
        </section>

        <section className="glass" style={{ padding: '32px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '800' }}>Add Task</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input placeholder="Task Description..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: 'white' }} />
            <input placeholder="Subject..." value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: 'white' }} />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: 'white' }} />
            <button className="btn-primary" style={{ width: '100%' }} onClick={addTask}>Create</button>
          </div>
        </section>
      </div>
    </div>
  );
}
