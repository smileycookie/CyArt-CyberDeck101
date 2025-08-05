//  \components\feature03\header.tsx

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, FileText } from "lucide-react"
import Link from "next/link"
import { useSocket } from '@/hooks/useSocket'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { logs } = useSocket()
  const [showLogs, setShowLogs] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check current route to select the active tab
  const currentTab = pathname.startsWith('/individual_dashboard') ? 'Individual' : 'Unified'

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handleTabChange = (value: string) => {
    if (value === 'Unified') {
      router.push('/') // Goes to app/page.tsx
    } else if (value === 'Individual') {
      router.push('/individual_dashboard') // Goes to app/agents/page.tsx
    }
  }

  return (
    <Card className="border-b rounded-none sticky top-0 z-10">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Left Side - Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-22 h-8 bg-orange-600 rounded text-white font-bold flex items-center justify-center text-sm">
              CyberDeck
            </div>
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="Unified">Unified</TabsTrigger>
                <TabsTrigger value="Individual">Individual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/logs')}
              className="text-muted-foreground hover:text-foreground p-0 h-auto font-medium"
            >
              Logs
            </Button>
            
            <DropdownMenu open={showLogs} onOpenChange={setShowLogs}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <FileText className="h-4 w-4" />
                  Live ({mounted ? logs.length : 0})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto">
                <DropdownMenuLabel>Recent Wazuh Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {logs.length > 0 ? (
                  logs.slice(0, 8).map((log, index) => (
                    <DropdownMenuItem key={log.id || index} className="flex-col items-start p-3 border-b">
                      <div className="flex justify-between w-full mb-1">
                        <span className="font-medium text-sm">Rule {log.ruleId}</span>
                        <span className="text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        <strong>Agent:</strong> {log.agentName} ({log.agentId})
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        <strong>Level:</strong> {log.rule_level} | <strong>Type:</strong> {log.input_type}
                      </div>
                      <div className="text-xs text-gray-600 truncate w-full">
                        {log.rule_description || log.description || log.message}
                      </div>
                      {log.rule_groups && log.rule_groups.length > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          Groups: {Array.isArray(log.rule_groups) ? log.rule_groups.join(', ') : log.rule_groups}
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No recent alerts
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setShowLogs(false)
                  router.push('/logs')
                }}>
                  View All Logs →
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel onClick={() => {alert('CyArt Project')}}>  My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem></DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                alert('CyArt Team: \n\nBackend:\nAnujith\nDanish\ T\n\nFrontend:\nRipunjay\nRagini\nSwaraj\n\nData:\nJignesh\nHarish\nAbhinay \n\nSupport:\nAnujith\nSreenithi\nVineel')
              }}>
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
