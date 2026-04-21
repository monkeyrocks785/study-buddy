'use client';

export default function PlanningPage() {
  const exams = [
    { date: '16 Dec', subject: 'PEM', type: 'Final Exam', room: 'Hall A' },
    { date: '18 Dec', subject: 'DAA', type: 'Final Exam', room: 'Lab 2' },
    { date: '20 Dec', subject: 'DM', type: 'Final Exam', room: 'Hall B' },
    { date: '23 Dec', subject: 'COA', type: 'Final Exam', room: 'Hall A' },
    { date: '26 Dec', subject: 'IOT', type: 'Final Exam', room: 'Lab 1' },
    { date: '31 Dec', subject: 'OS', type: 'Final Exam', room: 'Hall C' },
  ];

  const daysInMonth = 31;
  const startDay = 2; // Dec 1 2026 is a Tuesday (0-indexed starting from Sun=0, so Tue=2)

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h2 className="text-gradient" style={{ fontSize: '32px', fontWeight: '800' }}>Academic Calendar</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Your finalized exam schedule and study timeline.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
        {/* Calendar Grid */}
        <section className="premium-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800' }}>December 2026</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="glass nav-item" style={{ padding: '10px 14px', borderRadius: '10px' }}>←</button>
              <button className="glass nav-item" style={{ padding: '10px 14px', borderRadius: '10px' }}>→</button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
             {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
               <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>
                 {day}
               </div>
             ))}
             
             {/* Empty days before Dec 1 */}
             {Array.from({ length: startDay }).map((_, i) => (
               <div key={`empty-${i}`} style={{ minHeight: '110px' }}></div>
             ))}

             {/* Days of the month */}
             {Array.from({ length: daysInMonth }).map((_, i) => {
               const day = i + 1;
               const exam = exams.find(e => e.date === `${day} Dec`);
               
               return (
                 <div key={day} style={{ 
                   background: exam ? 'var(--accent-glow)' : 'var(--glass-bg)', 
                   minHeight: '110px', 
                   padding: '12px', 
                   borderRadius: '16px',
                   border: `1px solid ${exam ? 'var(--accent)' : 'var(--border)'}`,
                   transition: 'var(--transition)',
                   position: 'relative',
                   overflow: 'hidden'
                 }} className="calendar-day">
                   <span style={{ fontSize: '16px', fontWeight: '700', color: exam ? 'white' : 'var(--text-muted)' }}>{day}</span>
                   {exam && (
                     <div style={{ 
                       marginTop: '10px', 
                       background: 'var(--accent)', 
                       fontSize: '11px', 
                       padding: '6px 8px', 
                       borderRadius: '8px',
                       fontWeight: '800',
                       color: 'white',
                       boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                       animation: 'fadeIn 0.4s ease-out'
                     }}>
                       {exam.subject}
                     </div>
                   )}
                 </div>
               );
             })}
          </div>
        </section>

        {/* Sidebar: Upcoming Exams List */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Datesheet Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {exams.map((exam, i) => (
              <div key={i} className="premium-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ 
                  background: 'var(--accent)', 
                  padding: '12px', 
                  borderRadius: '12px', 
                  minWidth: '55px', 
                  textAlign: 'center',
                  boxShadow: '0 4px 15px var(--accent-glow)'
                }}>
                  <p style={{ fontSize: '18px', fontWeight: '800' }}>{exam.date.split(' ')[0]}</p>
                  <p style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Dec</p>
                </div>
                <div>
                  <p style={{ fontWeight: '800', fontSize: '16px', color: 'white' }}>{exam.subject}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{exam.type} • {exam.room}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>Need to study for PEM?</p>
            <button className="btn-primary" style={{ width: '100%' }}>Create Study Plan</button>
          </div>
        </section>
      </div>
    </div>
  );
}
