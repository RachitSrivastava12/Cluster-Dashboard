"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Cluster {
  funding_wallet: string
  recipients: string[]
  token_mints: string[]
  fan_out_slot: number
  buy_slots: number[]
  common_patterns: {
    amounts: string
    wallet_age: string
    dex_programs: string[]
  }
  total_sol_funded: number
  total_sol_remaining: number
  spend_rate_sol_per_min: number | null
  time_remaining_sec: number | null
  last_update: number
  cluster_age_sec: number
  children_count: number
  created_at: number
  status: "active" | "forming"
}

interface ApiResponse {
  clusters: Cluster[]
  metadata: {
    total_active: number
    total_tracked: number
    timestamp: string
    requirements: {
      min_children: number
      min_total_sol: number
      min_transfer_sol: number
      detection_window_sec: number
      data_retention_min: number
    }
  }
}

export function ClusterDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "forming">("all")
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")
  const [sortBy, setSortBy] = useState<
    "total_sol_funded" | "total_sol_remaining" | "children_count" | "cluster_age_sec"
  >("total_sol_funded")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [minSolFilter, setMinSolFilter] = useState<string>("")
  const [minChildrenFilter, setMinChildrenFilter] = useState<string>("")
  const { toast } = useToast()

  const API_BASE = "https://solana-cluster-monitor-1.onrender.com"

  const fetchData = async () => {
    try {
      setConnectionStatus("connecting")
      console.log("[v0] Attempting to fetch data from:", `${API_BASE}/clusters`)

      const response = await fetch(`${API_BASE}/clusters`)
      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const json: ApiResponse = await response.json()
      console.log("[v0] Successfully fetched data:", json)

      setData(json)
      setLoading(false)
      setError(null) // Clear any previous errors on successful fetch
      setConnectionStatus("connected")
      setLastUpdateTime(new Date())
    } catch (err) {
      console.error("[v0] Fetch error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Connection failed: ${errorMessage}`)
      setLoading(false)
      setConnectionStatus("disconnected")

      toast({
        title: "Connection Error",
        description: `Unable to connect to API: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const startPolling = async () => {
    if (!isPolling) {
      await fetchData()
      const interval = setInterval(fetchData, 5000)
      setPollInterval(interval)
      setIsPolling(true)
      toast({
        title: "Polling Started",
        description: "Real-time monitoring is now active",
      })
    }
  }

  const stopPolling = async () => {
    

    try {
      const response = await fetch(`${API_BASE}/stop-polling`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to stop backend polling")
      }
      toast({
        title: "Polling Stopped",
        description: "Real-time monitoring has been paused",
      })
    } catch (err) {
      console.error("Error stopping backend polling:", err)
      setError("Failed to stop backend polling")
    }
  }

  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [pollInterval])

  const filteredAndSortedClusters =
    data?.clusters
      .filter((cluster) => {
        const matchesSearch = cluster.funding_wallet.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || cluster.status === statusFilter
        const matchesMinSol = !minSolFilter || cluster.total_sol_remaining >= Number.parseFloat(minSolFilter)
        const matchesMinChildren = !minChildrenFilter || cluster.children_count >= Number.parseInt(minChildrenFilter)
        return matchesSearch && matchesStatus && matchesMinSol && matchesMinChildren
      })
      .sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]
        const multiplier = sortOrder === "desc" ? -1 : 1
        return (aValue > bValue ? 1 : -1) * multiplier
      }) || []

  const exportToCSV = () => {
    if (!filteredAndSortedClusters.length) {
      toast({
        title: "No Data",
        description: "No clusters to export",
        variant: "destructive",
      })
      return
    }

    const headers = [
      "Funding Wallet",
      "Children Count",
      "Total SOL Funded",
      "Remaining SOL",
      "Spend Rate (SOL/min)",
      "Time Remaining (sec)",
      "Status",
      "Age (sec)",
      "Token Mints",
      "DEX Programs",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredAndSortedClusters.map((cluster) =>
        [
          cluster.funding_wallet,
          cluster.children_count,
          cluster.total_sol_funded.toFixed(2),
          cluster.total_sol_remaining.toFixed(2),
          cluster.spend_rate_sol_per_min?.toFixed(2) ?? "N/A",
          cluster.time_remaining_sec ?? "N/A",
          cluster.status,
          cluster.cluster_age_sec,
          `"${cluster.token_mints.join(", ")}"`,
          `"${cluster.common_patterns.dex_programs.join(", ")}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `solana-clusters-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Cluster data exported to CSV",
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setMinSolFilter("")
    setMinChildrenFilter("")
    setSortBy("total_sol_funded")
    setSortOrder("desc")
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        {status.toUpperCase()}
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-black">
        {status.toUpperCase()}
      </Badge>
    )
  }

  const summaryStats = {
    totalClusters: filteredAndSortedClusters.length,
    totalSolFunded: filteredAndSortedClusters.reduce((sum, cluster) => sum + cluster.total_sol_funded, 0),
    totalSolRemaining: filteredAndSortedClusters.reduce((sum, cluster) => sum + cluster.total_sol_remaining, 0),
    averageChildren:
      filteredAndSortedClusters.length > 0
        ? filteredAndSortedClusters.reduce((sum, cluster) => sum + cluster.children_count, 0) /
          filteredAndSortedClusters.length
        : 0,
    activeClusters: filteredAndSortedClusters.filter((c) => c.status === "active").length,
    formingClusters: filteredAndSortedClusters.filter((c) => c.status === "forming").length,
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Address copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        toast({
          title: "Copy Failed",
          description: "Unable to copy to clipboard",
          variant: "destructive",
        })
      })
  }



 

  return (
    <div className="max-w-6xl mx-auto p-5 bg-background rounded-lg shadow-lg space-y-5">
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="text-primary text-2xl font-bold mb-2">Solana Funding Cluster Dashboard</h1>
        <p className="text-muted-foreground text-base">
          Real-time monitoring of active funding clusters (≥5 children, ≥20 SOL total, 10s window). Total Active:{" "}
          <span className="text-green-500 font-semibold">{data?.metadata.total_active}</span> | Tracked:{" "}
          <span className="text-blue-500 font-semibold">{data?.metadata.total_tracked}</span> | Last Updated:{" "}
          <span className="font-semibold">
            {lastUpdateTime?.toLocaleString() || new Date(data?.metadata.timestamp || "").toLocaleString()}
          </span>
        </p>
        {error && <p className="text-destructive text-base mt-2">{error}</p>}
      </header>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between mb-4 gap-2">
        <Input
          type="text"
          placeholder="Search by Funding Wallet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 lg:w-1/2 p-2 text-base border border-border rounded"
        />

        <Select value={statusFilter} onValueChange={(value: "all" | "active" | "forming") => setStatusFilter(value)}>
          <SelectTrigger className="lg:w-1/4 p-2 text-base border border-border rounded bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="forming">Forming Only</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={startPolling}
          disabled={isPolling}
          className={`lg:w-32 p-2 text-base rounded cursor-pointer transition-colors ${
            isPolling ? "bg-green-500 text-white hover:bg-green-600" : "bg-muted hover:bg-muted/80 text-foreground"
          } ${isPolling ? "" : "hover:brightness-85"}`}
        >
          {isPolling ? "Stop Polling" : "Start Polling"}
        </Button>
      </div>

      {/* Clusters Table */}
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
          <TableHeader>
            <TableRow className="bg-primary text-primary-foreground">
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">Funding Wallet</TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">Children</TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">
                Total Funded SOL
              </TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">Remaining SOL</TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">
                Spend Rate (SOL/min)
              </TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">
                Time Remaining (sec)
              </TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">Token Mints</TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">DEX Programs</TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">Fan Out Slot</TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">Status</TableHead>
              <TableHead className="p-3 text-left font-bold text-sm text-primary-foreground">Age (sec)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedClusters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground p-5">
                  No clusters match your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedClusters.map((cluster, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors border-b border-border">
                  <TableCell className="p-3 text-left text-sm">{cluster.funding_wallet}</TableCell>
                  <TableCell className="p-3 text-left text-sm">
                    <div className="flex items-center gap-2">
                      <span>{cluster.children_count}</span>
                      <Button
                        size="sm"
                        onClick={() => setSelectedCluster(cluster)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded text-xs transition-colors"
                      >
                        View Children
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="p-3 text-left text-sm">{cluster.total_sol_funded.toFixed(2)}</TableCell>
                  <TableCell
                    className={`p-3 text-left text-sm font-semibold ${cluster.total_sol_remaining < 1 ? "text-destructive" : ""}`}
                  >
                    {cluster.total_sol_remaining.toFixed(2)}
                  </TableCell>
                  <TableCell className="p-3 text-left text-sm">
                    {cluster.spend_rate_sol_per_min?.toFixed(2) ?? "N/A"}
                  </TableCell>
                  <TableCell className="p-3 text-left text-sm">{cluster.time_remaining_sec ?? "N/A"}</TableCell>
                  <TableCell className="p-3 text-left text-sm">{cluster.token_mints.join(", ") || "None"}</TableCell>
                  <TableCell className="p-3 text-left text-sm">
                    {cluster.common_patterns.dex_programs.join(", ") || "None"}
                  </TableCell>
                  <TableCell className="p-3 text-left text-sm">{cluster.fan_out_slot}</TableCell>
                  <TableCell className="p-3 text-left text-sm">
                    <span
                      className={`font-semibold ${cluster.status === "active" ? "text-green-500" : "text-yellow-500"}`}
                    >
                      {cluster.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="p-3 text-left text-sm">{cluster.cluster_age_sec}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Child Addresses Modal */}
      <Dialog open={!!selectedCluster} onOpenChange={() => setSelectedCluster(null)}>
        <DialogContent className="bg-card rounded-lg p-5 max-w-2xl w-11/12 max-h-4/5 overflow-y-auto shadow-lg">
          <DialogHeader>
            <DialogTitle className="mt-0 text-primary text-xl">
              Child Addresses for {selectedCluster?.funding_wallet.slice(0, 6)}...
              {selectedCluster?.funding_wallet.slice(-4)}
            </DialogTitle>
          </DialogHeader>
          <div className="my-4 max-h-96 overflow-y-auto">
            {selectedCluster?.recipients.map((address, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 border-b border-border text-sm last:border-b-0"
              >
                <span className="flex-1 mr-4">{address}</span>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(address)}
                  className="bg-green-500 text-white hover:bg-green-600 px-2 py-1 rounded text-xs transition-colors"
                >
                  Copy
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setSelectedCluster(null)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded text-base block mx-auto mt-2 transition-colors"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
