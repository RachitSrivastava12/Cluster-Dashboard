"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BarChart3, Home, Menu, X, LogIn, LogOut, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // auth form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [solanaAddress, setSolanaAddress] = useState("")
  const [message, setMessage] = useState("")
  const [mode, setMode] = useState<"login" | "signup" | null>(null)
  const [walletDetected, setWalletDetected] = useState(false)

  // 🔹 Detect Solana wallet on mount
  useEffect(() => {
    if ('solana' in window) {
      setWalletDetected(true)
    }
  }, [])

  // 🔹 Check session on mount and protect routes
  useEffect(() => {
    fetch("https://solana-cluster-monitor-1.onrender.com/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
          if (pathname === "/dashboard") router.push("/") // Redirect if on dashboard without login
        }
      })
      .catch(() => {
        setIsLoggedIn(false)
        if (pathname === "/dashboard") router.push("/") // Redirect on fetch fail
      })
  }, [pathname, router])

  const handleLogout = async () => {
    await fetch("https://solana-cluster-monitor-1.onrender.com/logout", {
      method: "POST",
      credentials: "include"
    })
    setIsLoggedIn(false)
    setMode(null)
    router.push("/")
  }

  // 🔹 Connect Solana Wallet
  const connectWallet = async () => {
    if ('solana' in window) {
      const provider: any = window.solana
      if (provider.isPhantom) {
        try {
          const resp = await provider.connect({ onlyIfTrusted: true }).catch(() => provider.connect())
          setSolanaAddress(resp.publicKey.toString())
          setMessage(`✅ Connected wallet: ${resp.publicKey.toString().slice(0, 6)}...`)
        } catch (err) {
          setMessage('❌ Wallet connection failed')
        }
      } else {
        setMessage('❌ Unsupported Solana wallet')
      }
    } else {
      setMessage('❌ No Solana wallet detected. Install Phantom or similar.')
    }
  }

  // 🔹 Handle Signup
  const handleSignup = async (e: any) => {
    e.preventDefault()
    if (!email && !solanaAddress) {
      setMessage('❌ Provide email or connect Solana wallet')
      return
    }
    if (email && !password) {
      setMessage('❌ Password required for email signup')
      return
    }
    try {
      const res = await fetch("https://solana-cluster-monitor-1.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, solanaAddress }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(`✅ Signed up as ${data.user.email || data.user.solana_address}`)
        setIsLoggedIn(true)
        setMode(null)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch {
      setMessage("❌ Error connecting to backend")
    }
  }

  // 🔹 Handle Login
  const handleLogin = async (e: any) => {
    e.preventDefault()
    if (!email && !solanaAddress) {
      setMessage('❌ Provide email or connect Solana wallet')
      return
    }
    if (email && !password) {
      setMessage('❌ Password required for email login')
      return
    }
    try {
      const res = await fetch("https://solana-cluster-monitor-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, solanaAddress }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(`✅ Logged in as ${data.user.email || data.user.solana_address}`)
        setIsLoggedIn(true)
        setMode(null)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch {
      setMessage("❌ Error connecting to backend")
    }
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home, current: pathname === "/" },
    ...(isLoggedIn ? [{ name: "Dashboard", href: "/dashboard", icon: BarChart3, current: pathname === "/dashboard" }] : []),
  ]

  return (
    <>
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
              <div className="relative">
                <svg
                  className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 397.7 311.7"
                  fill="currentColor"
                >
                  <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" />
                  <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1L333.1 73.8c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                  <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7-7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                </svg>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/30 transition-all duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text hover:text-transparent transition-all duration-300">
                  Solana
                </span>
                <span className="text-sm font-medium text-muted-foreground -mt-1">Watch</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={item.current ? "default" : "ghost"}
                      size="sm"
                      className={cn("flex items-center space-x-2", item.current && "bg-primary text-primary-foreground")}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}

              {isLoggedIn ? (
                <Button onClick={handleLogout} variant="ghost" size="sm" className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              ) : (
                <>
                  <Button onClick={() => setMode("login")} variant="ghost" size="sm" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                  <Button onClick={() => setMode("signup")} variant="ghost" size="sm" className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </>
              )}

              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Forms Modal-like */}
      {mode && (
        <div className="p-6 max-w-md mx-auto bg-card rounded-xl shadow-md mt-6">
          <h2 className="text-lg font-bold mb-4">{mode === "login" ? "Login" : "Sign Up"}</h2>
          <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-3">
            <input
              type="email"
              placeholder="Email (optional if using wallet)"
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password (required if using email)"
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Solana Address (optional)"
                className="flex-1 border rounded p-2"
                value={solanaAddress}
                onChange={(e) => setSolanaAddress(e.target.value)}
              />
              {walletDetected && (
                <Button type="button" onClick={connectWallet} className="whitespace-nowrap">
                  Connect Wallet
                </Button>
              )}
            </div>
            <Button type="submit" className="w-full">{mode === "login" ? "Login" : "Sign Up"}</Button>
          </form>
          {message && <p className="mt-3 text-sm">{message}</p>}
          <Button variant="ghost" size="sm" onClick={() => setMode(null)} className="mt-3 w-full">
            Cancel
          </Button>
        </div>
      )}
    </>
  )
}
