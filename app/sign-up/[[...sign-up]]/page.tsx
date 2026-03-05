'use client'

import { useAuth, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await signUp.password({ emailAddress, password })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }
    if (!error) await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async (formData: FormData) => {
    const code = formData.get('code') as string
    await signUp.verifications.verifyEmailCode({ code })
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) { console.log(session?.currentTask); return }
          const url = decorateUrl('/')
          if (url.startsWith('http')) { window.location.href = url } else { router.push(url) }
        },
      })
    } else {
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete' || isSignedIn) return null

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0c0c0e; }
    .auth-root {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0c0c0e;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
    }
    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
      animation: drift 12s ease-in-out infinite alternate;
    }
    .bg-orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%);
      top: -200px; left: -100px;
    }
    .bg-orb-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%);
      bottom: -150px; right: -150px;
      animation-delay: -6s;
    }
    @keyframes drift {
      from { transform: translate(0, 0) scale(1); }
      to { transform: translate(30px, -20px) scale(1.05); }
    }
    .card {
      position: relative;
      width: 100%;
      max-width: 440px;
      margin: 24px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 48px 40px;
      backdrop-filter: blur(20px);
      animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card-shine {
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
      pointer-events: none;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 36px;
    }
    .brand-mark {
      width: 32px; height: 32px;
      border: 1.5px solid rgba(212,175,55,0.6);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(212,175,55,0.08);
    }
    .brand-mark svg { width: 16px; height: 16px; stroke: #d4af37; fill: none; }
    .brand-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px; font-weight: 500;
      color: rgba(255,255,255,0.9);
      letter-spacing: 0.02em;
    }
    .heading {
      font-family: 'Cormorant Garamond', serif;
      font-size: 30px; font-weight: 300;
      color: #fff;
      letter-spacing: -0.01em;
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .subheading {
      font-size: 13px; font-weight: 300;
      color: rgba(255,255,255,0.4);
      margin-bottom: 32px;
      line-height: 1.5;
    }
    .field { margin-bottom: 16px; }
    .field label {
      display: block;
      font-size: 11px; font-weight: 500;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 8px;
    }
    .input-wrap { position: relative; }
    .input-wrap input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 14px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 300;
      color: #fff;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      letter-spacing: 0.02em;
    }
    .input-wrap input[type="password"],
    .input-wrap input[type="text"].pw-field { padding-right: 48px; }
    .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
    .input-wrap input:focus {
      border-color: rgba(212,175,55,0.5);
      background: rgba(255,255,255,0.06);
    }
    .toggle-pw {
      position: absolute; right: 14px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      cursor: pointer; padding: 4px;
      color: rgba(255,255,255,0.3);
      transition: color 0.2s;
      display: flex; align-items: center;
    }
    .toggle-pw:hover { color: rgba(255,255,255,0.7); }
    .toggle-pw svg { width: 16px; height: 16px; }
    .field-error {
      font-size: 11px; color: #ff6b6b;
      margin-top: 6px; font-weight: 300;
    }
    .pw-hints {
      display: flex; gap: 6px; flex-wrap: wrap;
      margin-top: 8px;
    }
    .pw-hint {
      font-size: 10px; font-weight: 300;
      color: rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 100px;
      padding: 3px 10px;
    }
    .btn-primary {
      width: 100%;
      background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
      border: none; border-radius: 12px;
      padding: 15px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 500;
      color: #0c0c0e;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      margin-top: 8px;
    }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:active:not(:disabled) { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
    .terms {
      text-align: center;
      margin-top: 16px;
      font-size: 11px; font-weight: 300;
      color: rgba(255,255,255,0.2);
      line-height: 1.6;
    }
    .terms a { color: rgba(212,175,55,0.6); text-decoration: none; }
    .terms a:hover { color: #d4af37; }
    .footer {
      text-align: center;
      margin-top: 28px;
      font-size: 13px; font-weight: 300;
      color: rgba(255,255,255,0.3);
    }
    .footer a {
      color: rgba(212,175,55,0.8);
      text-decoration: none;
      transition: color 0.2s;
      font-weight: 400;
    }
    .footer a:hover { color: #d4af37; }
    .divider { height: 1px; background: rgba(255,255,255,0.07); margin: 24px 0; }
    .btn-ghost {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 13px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 300;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.8); }
    .code-hint {
      font-size: 12px; font-weight: 300;
      color: rgba(255,255,255,0.3);
      margin-top: 6px;
    }
    .step-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(212,175,55,0.1);
      border: 1px solid rgba(212,175,55,0.2);
      border-radius: 100px;
      padding: 4px 12px;
      font-size: 11px; font-weight: 400;
      color: rgba(212,175,55,0.8);
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    .step-badge span {
      width: 5px; height: 5px; border-radius: 50%;
      background: #d4af37;
      display: inline-block;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="auth-root">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="card">
            <div className="card-shine" />
            <div className="brand">
              <div className="brand-mark">
                <svg viewBox="0 0 16 16"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" strokeWidth="1.2"/></svg>
              </div>
              <span className="brand-name">Acme</span>
            </div>
            <div className="step-badge"><span />Step 2 of 2</div>
            <h1 className="heading">Check your inbox</h1>
            <p className="subheading">We sent a 6-digit verification code to your email address. Enter it below to activate your account.</p>
            <form action={handleVerify}>
              <div className="field">
                <label htmlFor="code">Verification Code</label>
                <div className="input-wrap">
                  <input id="code" name="code" type="text" placeholder="000000" maxLength={6} autoComplete="one-time-code" inputMode="numeric" />
                </div>
                <p className="code-hint">The code expires in 10 minutes.</p>
                {errors.fields?.code && <p className="field-error">{errors.fields.code.message}</p>}
              </div>
              <button type="submit" className="btn-primary" disabled={fetchStatus === 'fetching'}>
                {fetchStatus === 'fetching' ? 'Verifying…' : 'Verify & Activate'}
              </button>
            </form>
            <div className="divider" />
            <button className="btn-ghost" onClick={() => signUp.verifications.sendEmailCode()}>Resend code</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="auth-root">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="card">
          <div className="card-shine" />
          <div className="brand">
            <div className="brand-mark">
              <svg viewBox="0 0 16 16"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" strokeWidth="1.2"/></svg>
            </div>
            <span className="brand-name">Acme</span>
          </div>
          <div className="step-badge"><span />Step 1 of 2</div>
          <h1 className="heading">Create your account</h1>
          <p className="subheading">Get started in seconds. No credit card required.</p>
          <form action={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrap">
                <input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" />
              </div>
              {errors.fields?.emailAddress && <p className="field-error">{errors.fields.emailAddress.message}</p>}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={showPassword ? 'pw-field' : ''}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPassword(p => !p)} aria-label="Toggle password visibility">
                  {showPassword
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l18 18M10.5 10.677A2 2 0 0113.323 13.5M6.362 6.227C4.61 7.4 3.26 9.04 2.458 11c1.274 3.196 4.471 5.5 9.043 5.5a10.9 10.9 0 003.29-.5M9.773 4.63A10.26 10.26 0 0111.5 4.5c4.572 0 7.769 2.304 9.043 5.5a10.09 10.09 0 01-1.9 2.9"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.458 11C3.732 7.804 6.929 5.5 11.5 5.5c4.572 0 7.769 2.304 9.043 5.5-1.274 3.196-4.471 5.5-9.043 5.5-4.572 0-7.769-2.304-9.043-5.5z"/><circle cx="11.5" cy="11" r="2"/></svg>
                  }
                </button>
              </div>
              <div className="pw-hints">
                <span className="pw-hint">8+ characters</span>
                <span className="pw-hint">Uppercase</span>
                <span className="pw-hint">Number</span>
                <span className="pw-hint">Symbol</span>
              </div>
              {errors.fields?.password && <p className="field-error">{errors.fields.password.message}</p>}
            </div>
            <button type="submit" className="btn-primary" disabled={fetchStatus === 'fetching'}>
              {fetchStatus === 'fetching' ? 'Creating account…' : 'Continue'}
            </button>
          </form>
          <p className="terms">
            By creating an account, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
          <div className="footer">
            Already have an account? <a href="/sign-in">Sign in</a>
          </div>
        </div>
        {/* Required for Clerk bot protection */}
        <div id="clerk-captcha" />
      </div>
    </>
  )
}