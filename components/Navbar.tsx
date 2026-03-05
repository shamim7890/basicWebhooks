'use client'

import { useAuth, useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease;
        }
        .nav-root.scrolled {
          background: rgba(12,12,14,0.85);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .nav-root.top {
          background: transparent;
          border-bottom: 1px solid transparent;
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ── Brand ── */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-brand-mark {
          width: 30px; height: 30px;
          border: 1.5px solid rgba(212,175,55,0.55);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(212,175,55,0.07);
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-brand:hover .nav-brand-mark {
          background: rgba(212,175,55,0.13);
          border-color: rgba(212,175,55,0.8);
        }
        .nav-brand-mark svg { width: 14px; height: 14px; stroke: #d4af37; fill: none; }
        .nav-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 500;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.02em;
        }

        /* ── Center links ── */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-links a {
          font-size: 13px; font-weight: 300;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.01em;
        }
        .nav-links a:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .nav-links a.active {
          color: #d4af37;
          background: rgba(212,175,55,0.08);
        }

        /* ── Right actions ── */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .nav-user-greeting {
          font-size: 13px; font-weight: 300;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.01em;
        }
        .nav-user-greeting strong {
          color: rgba(255,255,255,0.65);
          font-weight: 400;
        }

        .btn-ghost-nav {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 8px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .btn-ghost-nav:hover {
          border-color: rgba(255,255,255,0.28);
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.04);
        }

        .btn-gold-nav {
          background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
          border: none;
          border-radius: 10px;
          padding: 8px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: #0c0c0e;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .btn-gold-nav:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-gold-nav:active { transform: translateY(0); }

        /* ── UserButton override ── */
        .clerk-user-btn { display: flex; align-items: center; }

        /* ── Skeleton loader ── */
        .nav-skeleton {
          display: flex; gap: 8px; align-items: center;
        }
        .skel {
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .skel-btn { width: 72px; height: 34px; }
        .skel-btn-lg { width: 96px; height: 34px; border-radius: 10px; }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* ── Mobile hamburger ── */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .nav-hamburger:hover { background: rgba(255,255,255,0.06); }
        .nav-hamburger span {
          display: block;
          width: 20px; height: 1.5px;
          background: rgba(255,255,255,0.6);
          border-radius: 2px;
          transition: transform 0.25s, opacity 0.25s;
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .nav-mobile-drawer {
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: rgba(12,12,14,0.97);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
          padding: 20px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transform: translateY(-8px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease;
        }
        .nav-mobile-drawer.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .drawer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          padding: 11px 14px;
          border-radius: 10px;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.01em;
        }
        .drawer-link:hover, .drawer-link.active {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }
        .drawer-link.active { color: #d4af37; background: rgba(212,175,55,0.07); }
        .drawer-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; }
        .drawer-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
        .drawer-actions .btn-ghost-nav,
        .drawer-actions .btn-gold-nav {
          text-align: center;
          display: block;
          padding: 12px;
          border-radius: 12px;
        }
        .drawer-user {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
        }
        .drawer-user-info { flex: 1; }
        .drawer-user-name {
          font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.75);
        }
        .drawer-user-email {
          font-size: 11px; font-weight: 300;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
        }

        /* ── Spacer so content doesn't sit under fixed nav ── */
        .nav-spacer { height: 64px; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-actions { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className={`nav-root ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="nav-inner">

          {/* Brand */}
          <Link href="/" className="nav-brand">
            <div className="nav-brand-mark">
              <svg viewBox="0 0 16 16"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" strokeWidth="1.2"/></svg>
            </div>
            <span className="nav-brand-name">Acme</span>
          </Link>

          {/* Desktop center links */}
          <ul className="nav-links">
            {[
              { href: '/', label: 'Home' },
              { href: '/features', label: 'Features' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/about', label: 'About' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={pathname === href ? 'active' : ''}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right actions */}
          <div className="nav-actions">
            {!isLoaded ? (
              <div className="nav-skeleton">
                <div className="skel skel-btn" />
                <div className="skel skel-btn-lg" />
              </div>
            ) : isSignedIn ? (
              <>
                <span className="nav-user-greeting">
                  Hi, <strong>{user?.firstName ?? 'there'}</strong>
                </span>
                <div className="clerk-user-btn">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="btn-ghost-nav">Sign In</Link>
                <Link href="/sign-up" className="btn-gold-nav">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        {[
          { href: '/', label: 'Home' },
          { href: '/features', label: 'Features' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/about', label: 'About' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} className={`drawer-link ${pathname === href ? 'active' : ''}`}>
            {label}
          </Link>
        ))}

        <div className="drawer-divider" />

        {!isLoaded ? null : isSignedIn ? (
          <div className="drawer-user">
            <UserButton />
            <div className="drawer-user-info">
              <div className="drawer-user-name">{user?.fullName ?? user?.firstName ?? 'My Account'}</div>
              <div className="drawer-user-email">{user?.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
        ) : (
          <div className="drawer-actions">
            <Link href="/sign-in" className="btn-ghost-nav">Sign In</Link>
            <Link href="/sign-up" className="btn-gold-nav">Get Started</Link>
          </div>
        )}
      </div>

      <div className="nav-spacer" />
    </>
  )
}