"use client";

import React, { useState, useEffect } from 'react';
import { FileUp, Search, CalendarDays, LibrarySquare, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define types for contract data
interface Contract {
  id: string;
  name: string;
  text: string;
  keyDates: Array<{ date: string; description: string }>;
  clauseIssues: Array<{ clause: string; issue: string; severity: string; textSnippet: string }>;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [selectedClauseIssue, setSelectedClauseIssue] = useState<number | null>(null);

  // Effect to set the first contract as selected when contracts are loaded
  useEffect(() => {
    if (contracts.length > 0 && !selectedContractId) {
      setSelectedContractId(contracts[0].id);
    }
  }, [contracts, selectedContractId]);

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would parse the file here
      // For demo purposes, we'll simulate parsing and add a new contract
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        const newContract: Contract = {
          id: Date.now().toString(), // Simple unique ID
          name: file.name,
          text: fileContent || 'Sample contract text loaded from file...', // Use file content or sample
          keyDates: [ // Simulated data based on file upload
            { date: '2024-12-31', description: `Expiration of ${file.name}` },
            { date: '2024-06-30', description: `Renewal notice deadline for ${file.name}` }
          ],
          clauseIssues: [ // Simulated data based on file upload
            { clause: 'Termination', issue: 'No notice period specified', severity: 'high', textSnippet: '...This contract may be terminated by either party...' },
            { clause: 'Liability', issue: 'Unlimited liability', severity: 'medium', textSnippet: '...The company shall not be liable for any indirect damages...' },
            { clause: 'Payment Terms', issue: 'Vague payment schedule', severity: 'low', textSnippet: '...Payment shall be made in a timely manner...' }
          ]
        };
        setContracts(prev => [...prev, newContract]);
        setSelectedContractId(newContract.id); // Automatically select the new contract
        setActiveTab('chat'); // Switch to chat after upload (optional)
      };
      reader.readAsText(file); // Or use a library to parse PDF/DOCX
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || !selectedContract) return;

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: userInput }]);

    // Simulate AI response based on selected contract
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'ai',
        content: `AI response about "${selectedContract.name}": Based on the contract, the termination notice period is 30 days. The auto-renewal clause requires written notice 60 days before expiration.`
      }]);
    }, 1000);

    setUserInput('');
  };

  const handleClauseIssueClick = (index: number) => {
    setSelectedClauseIssue(index);
    // In a real app, you would scroll the contract text area to the relevant snippet
    // For this demo, we'll just highlight the selected issue in the list
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-slate-800 shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ContractAI</h1>
          {contracts.length > 0 && (
            <div className="w-64">
              <Select onValueChange={setSelectedContractId} value={selectedContractId || ''}>
                <SelectTrigger className="w-full dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600">
                  <SelectValue placeholder="Select a contract" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                  {contracts.map(contract => (
                    <SelectItem key={contract.id} value={contract.id} className="dark:text-gray-100 data-[state=checked]:text-indigo-400 data-[highlighted]:bg-slate-700">
                      {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="dark:text-gray-100 dark:border-gray-700 dark:hover:bg-slate-700">Pricing</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">Sign In</Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          {/* Applied glass class to TabsList */}
          <TabsList className="grid w-full grid-cols-5 glass mb-6">
            <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors duration-200">
              <FileUp className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors duration-200" disabled={!selectedContract}>
              <Search className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="dates" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors duration-200" disabled={!selectedContract}>
              <CalendarDays className="w-4 h-4 mr-2" />
              Key Dates
            </TabsTrigger>
            <TabsTrigger value="clauses" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors duration-200" disabled={!selectedContract}>
              <LibrarySquare className="w-4 h-4 mr-2" />
              Clause Review
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors duration-200" disabled={!selectedContract}>
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Applied animate-fade-in and glass class to TabsContent Cards */}
          <TabsContent value="upload" className="h-[calc(100vh-200px)] animate-fade-in">
            <Card className="h-full flex flex-col items-center justify-center p-8 glass">
              <div className="text-center max-w-md">
                {/* Applied animate-float */}
                <FileUp className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4 animate-float" />
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Upload Your Contract</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Drag and drop your PDF or Word document here, or click to browse files.
                </p>
                <input
                  type="file"
                  id="contract-upload"
                  className="hidden"
                  accept=".txt" // Changed to .txt for easier demo parsing
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="contract-upload"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                >
                  Select File
                </label>
              </div>
              {contracts.length > 0 && (
                <div className="mt-8 w-full animate-fade-in"> {/* Applied animate-fade-in */}
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">Uploaded Contracts</h3>
                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400">
                    {contracts.map(c => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Applied animate-fade-in and glass class to TabsContent Cards */}
          <TabsContent value="chat" className="h-[calc(100vh-200px)] animate-fade-in">
            <Card className="h-full flex flex-col glass">
              <ScrollArea className="flex-1 p-4">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    Ask questions about "{selectedContract?.name || 'your contract'}"...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-3/4 rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-indigo-600 text-white dark:bg-indigo-700' : 'bg-gray-200 text-gray-900 dark:bg-slate-600 dark:text-gray-100'}`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder={`Ask about "${selectedContract?.name || 'your contract'}"...`}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600"
                    disabled={!selectedContract}
                  />
                  <Button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600" disabled={!selectedContract}>Send</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Applied animate-fade-in and glass class to TabsContent Cards */}
          <TabsContent value="dates" className="h-[calc(100vh-200px)] animate-fade-in">
            <Card className="h-full p-6 glass">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Key Dates for "{selectedContract?.name || 'Selected Contract'}"</h2>
              {!selectedContract ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  Select a contract to see key dates
                </div>
              ) : (selectedContract.keyDates.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No key dates found for this contract.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedContract.keyDates.map((date, i) => (
                    <div key={i} className="flex items-center p-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                      <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mr-4">
                        <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{date.date}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{date.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto dark:text-gray-100 dark:border-gray-700 dark:hover:bg-slate-700">
                        Add to Calendar
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Applied animate-fade-in and glass class to TabsContent Cards */}
          <TabsContent value="clauses" className="h-[calc(100vh-200px)] animate-fade-in">
            <Card className="h-full flex glass">
              {!selectedContract ? (
                 <div className="flex items-center justify-center w-full text-gray-500 dark:text-gray-400">
                   Select a contract to analyze clauses
                 </div>
              ) : (
                <>
                  {/* Clause Issues List */}
                  <ScrollArea className="w-1/3 border-r border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Issues in "{selectedContract.name}"</h2>
                    {selectedContract.clauseIssues.length === 0 ? (
                       <div className="text-gray-500 dark:text-gray-400">
                         No clause issues found for this contract.
                       </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedContract.clauseIssues.map((clause, i) => (
                          <div
                            key={i}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                              selectedClauseIssue === i
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => handleClauseIssueClick(i)}
                          >
                            <div className="flex items-start">
                              <div className={`w-3 h-3 rounded-full mt-1 mr-3 ${
                                clause.severity === 'high' ? 'bg-red-500' : clause.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-100">{clause.clause}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{clause.issue}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Contract Text with Highlight */}
                  <ScrollArea className="flex-1 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Contract Text</h2>
                    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                      {/* Simple highlighting logic - replace with more robust parsing/rendering */}
                      {selectedClauseIssue !== null ? (
                        selectedContract.text.split(selectedContract.clauseIssues[selectedClauseIssue].textSnippet).map((part, index, arr) => (
                          <React.Fragment key={index}>
                            {part}
                            {index < arr.length - 1 && (
                              <span className="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-white px-1 rounded">
                                {selectedContract.clauseIssues[selectedClauseIssue].textSnippet}
                              </span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        selectedContract.text
                      )}
                    </div>
                     {selectedClauseIssue !== null && (
                       <div className="mt-6 p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                         <h3 className="font-semibold text-gray-800 dark:text-gray-100">Selected Issue Details:</h3>
                         <p className="text-sm text-gray-600 dark:text-gray-300">
                           <span className="font-medium">{selectedContract.clauseIssues[selectedClauseIssue].clause}:</span> {selectedContract.clauseIssues[selectedClauseIssue].issue} (Severity: {selectedContract.clauseIssues[selectedClauseIssue].severity})
                         </p>
                         <Button variant="outline" size="sm" className="mt-3 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-slate-700">
                           View Standard Clause
                         </Button>
                       </div>
                     )}
                  </ScrollArea>
                </>
              )}
            </Card>
          </TabsContent>

          {/* Applied animate-fade-in and glass class to TabsContent Cards */}
          <TabsContent value="history" className="h-[calc(100vh-200px)] animate-fade-in">
            <Card className="h-full p-6 glass">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Audit Trail</h2>
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Your contract analysis history will appear here
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
