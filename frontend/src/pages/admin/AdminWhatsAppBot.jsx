import React from 'react'

const AdminWhatsAppBot = () => {
  return (
    <div
      style={{
        minHeight: '78vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(16,185,129,0.2), transparent 45%), #f8fafc',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '760px',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(15,23,42,0.08)',
          boxShadow: '0 20px 60px rgba(2,6,23,0.12)',
          padding: 'clamp(24px, 5vw, 56px)',
          textAlign: 'center',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: '#0f766e',
            background: 'rgba(20,184,166,0.12)',
            padding: '8px 14px',
            borderRadius: '999px',
          }}
        >
          WhatsApp Bot
        </span>

        <h1
          style={{
            margin: '20px 0 12px',
            fontSize: 'clamp(30px, 6vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          Coming Soon
        </h1>

        <p
          style={{
            margin: '0 auto',
            maxWidth: '580px',
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7,
            color: '#334155',
          }}
        >
          We are building a powerful admin experience to manage the WhatsApp bot,
          monitor conversations, and streamline support workflows.
        </p>

        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {['Bot Controls', 'Broadcast Tools', 'Insights Dashboard'].map((item) => (
            <span
              key={item}
              style={{
                border: '1px solid rgba(15,23,42,0.12)',
                background: '#ffffff',
                color: '#1e293b',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminWhatsAppBot

