import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #121218 50%, #0a0a1a 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        top: '-200px',
        right: '-100px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,241,149,0.06) 0%, transparent 70%)',
        bottom: '-200px',
        left: '-100px',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 20,
        background: 'linear-gradient(135deg, #8b5cf6, #14f195)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        marginBottom: 24,
        boxShadow: '0 0 60px rgba(139, 92, 246, 0.3)',
      }}>
        ⬡
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 48,
        fontWeight: 800,
        background: 'linear-gradient(135deg, #f0f0f5, #9ca3b0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.03em',
        marginBottom: 12,
        textAlign: 'center',
      }}>
        Web3 Game Engine
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 18,
        color: '#9ca3b0',
        maxWidth: 480,
        textAlign: 'center',
        lineHeight: 1.6,
        marginBottom: 40,
      }}>
        Build interactive 2D & 3D games in your browser.
        Drag, drop, and deploy to any social platform.
      </p>

      {/* CTA */}
      <Link href="/new" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 36px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        color: 'white',
        fontSize: 16,
        fontWeight: 600,
        textDecoration: 'none',
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), 0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.25s ease',
        letterSpacing: '-0.01em',
      }}>
        Start Creating →
      </Link>

      {/* Tags */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginTop: 32,
      }}>
        {['Three.js', 'Solana', 'EVM', 'Zero Code'].map((tag) => (
          <span key={tag} style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: 12,
            color: '#5a5f6d',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
