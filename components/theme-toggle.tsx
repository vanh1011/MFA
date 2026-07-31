'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mfa-site-theme')
    const nextDark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    setDark(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
  }, [])

  function toggle() {
    setDark(current => {
      const next = !current
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('mfa-site-theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <button className="content-theme-toggle" onClick={toggle} aria-label={dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}>
      {dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
    </button>
  )
}
