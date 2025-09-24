
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { TrendingUp, Activity, Shield, Zap, BarChart3, Users, Twitter, Linkedin, Github, Mail } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      alert("Please log in to access the dashboard.")
      router.push("/#login")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation setIsLoggedInState={setIsLoggedIn} />

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Activity className="w-3 h-3 mr-1" />
            Real-time Monitoring
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
            Monitor Solana Funding
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Clusters</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Track active funding clusters, analyze trading patterns, and stay ahead of market movements with real-time
            Solana blockchain monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" onClick={handleDashboardClick}>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Advanced Trading Intelligence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the insights you need to make informed trading decisions on Solana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="relative">
                  <Activity className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>Track funding clusters as they form and evolve in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Live cluster detection</li>
                  <li>• 5-second polling intervals</li>
                  <li>• Instant status updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="relative">
                  <TrendingUp className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardTitle>Pattern Analysis</CardTitle>
                <CardDescription>Identify common trading patterns and wallet behaviors</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• DEX program tracking</li>
                  <li>• Wallet age analysis</li>
                  <li>• Amount pattern detection</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="relative">
                  <Shield className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Monitor spend rates and remaining balances for risk management</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• SOL spend rate tracking</li>
                  <li>• Time remaining estimates</li>
                  <li>• Low balance alerts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="relative">
                  <Zap className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardTitle>Fast Detection</CardTitle>
                <CardDescription>Detect clusters within 10-second windows with high precision</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Minimum 5 children required</li>
                  <li>• 20+ SOL threshold</li>
                  <li>• 10-second detection window</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="relative">
                  <Users className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardTitle>Child Wallet Tracking</CardTitle>
                <CardDescription>View and analyze all child wallets within each cluster</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Complete recipient lists</li>
                  <li>• One-click address copying</li>
                  <li>• Cluster relationship mapping</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="relative">
                  <BarChart3 className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardTitle>Advanced Filtering</CardTitle>
                <CardDescription>Filter and search clusters by multiple criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Status-based filtering</li>
                  <li>• Wallet address search</li>
                  <li>• Custom time ranges</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Monitoring?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join traders who use SolanaWatch to stay ahead of market movements
          </p>
          <Link href="/dashboard" onClick={handleDashboardClick}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              <Activity className="mr-2 h-5 w-5" />
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="h-8 w-8 text-primary" viewBox="0 0 397.7 311.7" fill="currentColor">
                  <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" />
                  <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1L333.1 73.8c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                  <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Solana
                  </span>
                  <span className="text-sm font-medium text-muted-foreground -mt-1">Watch</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Real-time Solana cluster monitoring for advanced traders. Track funding patterns, analyze wallet
                behaviors, and stay ahead of market movements.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" onClick={handleDashboardClick} className="hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-muted-foreground mb-4 md:mb-0">© 2024 SolanaWatch. All rights reserved.</div>
              <div className="flex space-x-6 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
