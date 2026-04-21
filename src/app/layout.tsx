import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Student Hub | Your Personal Dashboard",
  description: "A centralized dashboard for students to manage notes, todos, and study effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="page-container">
          <aside className="sidebar">
            <div style={{ marginBottom: '48px', paddingLeft: '8px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-1px' }}>
                <span style={{ 
                  width: '36px', 
                  height: '36px', 
                  background: 'var(--accent)', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px var(--accent-glow)'
                }}>✦</span> 
                StudentHub
              </h1>
            </div>
            
            <Nav />

            <div className="glass" style={{ padding: '20px', marginTop: 'auto', border: '1px solid var(--accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px' }}>🔔</span>
                <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Exam</p>
              </div>
              <p style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>PEM in 5 days</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>16 Dec • 09:00 AM</p>
            </div>
          </aside>
          
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
