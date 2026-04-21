'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: '📊', label: 'Dashboard' },
  { href: '/study', icon: '📖', label: 'Study Studio' },
  { href: '/notes', icon: '📝', label: 'Knowledge Base' },
  { href: '/planning', icon: '📅', label: 'Planning' },
  { href: '/homework', icon: '🏠', label: 'Homework' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              padding: '14px 18px', 
              borderRadius: '14px',
              transition: 'var(--transition)',
              fontSize: '15px',
              fontWeight: isActive ? '700' : '500',
              color: isActive ? 'white' : 'var(--text-muted)',
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
