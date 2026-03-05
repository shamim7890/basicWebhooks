// app/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────
// Protected route: any logged-in user can access this.
// The middleware already ensures only logged-in users reach here.
// ─────────────────────────────────────────────────────────────
import { auth } from '@clerk/nextjs/server'
import { getRole } from '@/utils/roles'
import { supabaseAdmin } from '@/lib/supabase'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { userId } = await auth()
  const role = await getRole()
  const params = await searchParams

  // Fetch this user's record from Supabase to show it was synced by the webhook
  const { data: userRecord } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', userId!)
    .single()

  return (
    <div>
      <h1>📊 Dashboard</h1>

      {/* Show error if redirected from admin without permission */}
      {params.error === 'unauthorized' && (
        <div style={{ background: '#fee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          ⛔ You don&apos;t have permission to access the admin panel.
          Your role must be <strong>admin</strong>.
        </div>
      )}

      <h2>Your Session Info</h2>
      <p>
        🏷️ Role (from JWT): <strong>{role ?? 'none'}</strong>
      </p>
      <p>
        This role is read directly from your session token — no database query needed!
      </p>

      <h2>Your Supabase Record</h2>
      <p>
        This was created automatically when you signed up, via the <code>user.created</code> webhook:
      </p>
      {userRecord ? (
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
          {JSON.stringify(userRecord, null, 2)}
        </pre>
      ) : (
        <p style={{ color: 'orange' }}>
          ⚠️ No Supabase record found. Make sure your webhook is configured and working.
        </p>
      )}

      <h2>Access Control</h2>
      <ul>
        <li>✅ <strong>/dashboard</strong> — you&apos;re here (any logged-in user)</li>
        <li>{role === 'admin' ? '✅' : '🔒'} <strong>/admin</strong> — {role === 'admin' ? <a href="/admin">go to admin panel</a> : 'requires admin role'}</li>
        <li>{role === 'admin' || role === 'moderator' ? '✅' : '🔒'} <strong>/moderate</strong> — {role === 'admin' || role === 'moderator' ? 'accessible' : 'requires moderator or admin role'}</li>
      </ul>
    </div>
  )
}