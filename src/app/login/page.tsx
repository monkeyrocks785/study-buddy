'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister ? { email, password, name } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--background)',
      padding: '20px'
    }}>
      <div className="premium-card fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }} className="text-gradient">
            {isRegister ? 'Join StudentHub' : 'Welcome Back'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'Start your academic journey today' : 'Log in to your student cockpit'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: 'white' }}
              />
            </div>
          )}
          
          <div>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: 'white' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: 'white' }}
            />
          </div>

          {!isRegister && (
            <div style={{ textAlign: 'right' }}>
              <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>
          )}

          <button className="btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: '700', cursor: 'pointer' }}
            >
              {isRegister ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
