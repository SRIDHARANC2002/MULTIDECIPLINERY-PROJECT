import React from 'react'

function Header() {
  return (
    <header
      style={{
        textAlign: 'center',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: '600',
          color: '#0f172a'
        }}
      >
        Route Navigation System
      </h1>

      <p
        style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#475569'
        }}
      >
        Find the best and safest route between locations
      </p>
    </header>
  )
}

export default Header
