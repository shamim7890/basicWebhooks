// app/page.tsx — Public home page (no auth required)
import { auth } from '@clerk/nextjs/server'
import { getRole } from '@/utils/roles'

export default async function HomePage() {
  const { userId } = await auth()
  const role = userId ? await getRole() : null

  return (
    <div>
      <h1>🔔 Clerk Webhooks + Supabase + RBAC Demo</h1>
      <p>This app demonstrates how webhooks keep Clerk and Supabase in sync.</p>

      <hr />

      <h2>Your Status</h2>
      {userId ? (
        <div>
          <p>✅ Logged in</p>
          <p>🏷️ Your role: <strong>{role ?? 'none assigned yet'}</strong></p>
          <p>
            <a href="/dashboard">→ Go to Dashboard</a>
            {role === 'admin' && <span> | <a href="/admin">→ Go to Admin Panel</a></span>}
          </p>
        </div>
      ) : (
        <div>
          <p>❌ Not logged in</p>
          <p><a href="/sign-in">Sign in to continue</a></p>
        </div>
      )}

      <hr />

      <h2>How the Webhook Flow Works</h2>
      <ol>
        <li>Sign up → Clerk fires <code>user.created</code> → your app saves you to Supabase with role <code>user</code></li>
        <li>Admin changes your role → Clerk fires <code>user.updated</code> → Supabase is updated</li>
        <li>Role is read from your JWT on every request (fast, no DB query needed)</li>
      </ol>
    </div>
  )
}