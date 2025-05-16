'use client'

import { useState } from 'react'
import { FileUp, Search, CalendarDays, LibrarySquare, History } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload')
  const [contractText, setContractText] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([])
  const [userInput, setUserInput] = useState('')
  const [keyDates, setKeyDates] = useState<Array<{date: string, description: string}>>([])
  const [clauseIssues, setClauseIssues] = useState<Array<{clause: string, issue: string, severity: string}>>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would parse the file here
      // For demo purposes, we'll just set some sample text
      setContractText('Sample contract text loaded...')
      setKeyDates([
        { date: '2023-12-31', description: 'Contract expiration' },
        { date: '2023-06-30', description: 'Renewal notice deadline' }
      ])
      setClauseIssues([
        { clause: 'Termination', issue: 'No notice period specified', severity: 'high' },
        { clause: 'Liability', issue: 'Unlimited liability', severity: 'medium' }
      ])
    }
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: userInput }])
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Based on the contract, the termination notice period is 30 days. The auto-renewal clause requires written notice 60 days before expiration.'
      }])
    }, 1000)
    
    setUserInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">ContractAI</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Pricing</Button>
            <Button>Sign In</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="upload">
              <FileUp className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="chat">
              <Search className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="dates">
              <CalendarDays className="w-4 h-4 mr-2" />
              Key Dates
            </TabsTrigger>
            <TabsTrigger value="clauses">
              <LibrarySquare className="w-4 h-4 mr-2" />
              Clause Review
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="h-[calc(100vh-180px)]">
            <Card className="h-full flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-md">
                <FileUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Upload Your Contract</h2>
                <p className="text-gray-500 mb-6">
                  Drag and drop your PDF or Word document here, or click to browse files.
                </p>
                <input
                  type="file"
                  id="contract-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="contract-upload"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                  Select File
                </label>
              </div>
              {contractText && (
                <div className="mt-8 w-full">
                  <h3 className="text-lg font-medium mb-2">Contract Preview</h3>
                  <ScrollArea className="h-64 border rounded-md p-4 bg-white">
                    {contractText}
                  </ScrollArea>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="h-[calc(100vh-180px)]">
            <Card className="h-full flex flex-col">
              <ScrollArea className="flex-1 p-4">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Ask questions about your contract...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-3/4 rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-100 text-gray-900'}`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask about your contract..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="dates" className="h-[calc(100vh-180px)]">
            <Card className="h-full p-6">
              <h2 className="text-xl font-semibold mb-4">Key Dates</h2>
              {keyDates.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Upload a contract to see key dates
                </div>
              ) : (
                <div className="space-y-4">
                  {keyDates.map((date, i) => (
                    <div key={i} className="flex items-center p-3 border rounded-lg">
                      <div className="bg-indigo-100 p-2 rounded-full mr-4">
                        <CalendarDays className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">{date.date}</p>
                        <p className="text-sm text-gray-500">{date.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Add to Calendar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="clauses" className="h-[calc(100vh-180px)]">
            <Card className="h-full p-6">
              <h2 className="text-xl font-semibold mb-4">Clause Review</h2>
              {clauseIssues.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Upload a contract to analyze clauses
                </div>
              ) : (
                <div className="space-y-4">
                  {clauseIssues.map((clause, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-start">
                        <div className={`w-3 h-3 rounded-full mt-1 mr-3 ${
                          clause.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium">{clause.clause}</h3>
                          <p className="text-sm text-gray-600">{clause.issue}</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          View Standard
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="history" className="h-[calc(100vh-180px)]">
            <Card className="h-full p-6">
              <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
              <div className="flex items-center justify-center h-full text-gray-500">
                Your contract analysis history will appear here
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
