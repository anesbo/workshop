import React from 'react';

export default function Home() {
  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#1e293b' }}>🚀 Workshop API (Next.js)</h1>
        <p style={{ margin: 0, color: '#64748b' }}>Production-ready Next.js REST API with Supabase (PostgreSQL) and Prisma ORM.</p>
      </header>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', color: '#334155' }}>📡 Available Endpoints</h2>
        <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#2563eb' }}>POST</span> <code>/workshops/register</code> — Create a new attendee registration
          </div>
          <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#16a34a' }}>GET</span> <code>/workshops/register</code> — List all registrations (descending)
          </div>
          <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#16a34a' }}>GET</span> <code>/workshops/register/:id</code> — Get a single registration by ID
          </div>
          <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#d97706' }}>PUT</span> <code>/workshops/register/:id</code> — Full update (all 5 fields required)
          </div>
          <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#d97706' }}>PATCH</span> <code>/workshops/register/:id</code> — Partial update (non-empty subset)
          </div>
          <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#dc2626' }}>DELETE</span> <code>/workshops/register/:id</code> — Delete registration
          </div>
          <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#0891b2' }}>GET</span> <code>/health</code> — Health check status
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', color: '#94a3b8', fontSize: '14px' }}>
        Status: Online • Framework: Next.js App Router • Database: Supabase PostgreSQL
      </footer>
    </main>
  );
}

