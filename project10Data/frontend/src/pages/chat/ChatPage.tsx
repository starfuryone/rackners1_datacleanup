// src/pages/chat/ChatPage.tsx
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  PaperclipIcon,
  PlusIcon,
  ArrowDownIcon,
  CornerDownLeftIcon,
  WandIcon,
  Settings2Icon,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  lastMessage: Date
}

const SUGGESTED_PROMPTS = [
  {
    title: "What's new in GPT-Excel?",
    subtitle: "What's new in GPT-Excel?",
    isNew: true,
  },
  {
    title: "List all your capabilities and features.",
    subtitle: "List all your capabilities and features.",
  },
  {
    title: "Create a table",
    subtitle: "for Tracking Investment Portfolio",
  },
  {
    title: "What kind of Charts",
    subtitle: "can you generate?",
  },
  {
    title: "How to extract text between",
    subtitle: "the first and last period in cell E2 on google sheets.",
  },
  {
    title: "Automate updating sales data",
    subtitle: "every Monday for specific cells like A2 to C100 on Excel.",
  },
]

const AGENTS = [
  { id: 'pivotAgent', name: 'Pivot Builder' },
  { id: 'formulaAgent', name: 'Formula Generator' },
  { id: 'scriptAgent', name: 'Script Writer' },
]

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const agentParam = searchParams.get('agent')

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    agentParam ? [agentParam] : ['pivotAgent']
  )
  const [files, setFiles] = useState<File[]>([])
  const [showScrollButton, setShowScrollButton] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 320) + 'px'
    }
  }, [inputValue])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle scroll to show/hide scroll button
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() && files.length === 0) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputValue('')
    setFiles([])

    // TODO: Send to API
    // Simulate assistant response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'This is a placeholder response. Connect to the backend API to get real responses.',
          timestamp: new Date(),
        },
      ])
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handlePromptClick = (prompt: typeof SUGGESTED_PROMPTS[0]) => {
    setInputValue(prompt.title + ' ' + prompt.subtitle)
    textareaRef.current?.focus()
  }

  const handleNewChat = () => {
    setMessages([])
    setInputValue('')
    setFiles([])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex size-full flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="">
        <div className={`z-30 h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r bg-background duration-300 ease-in-out lg:flex lg:w-[250px] xl:w-[300px] transition-transform`}>
          <div className="flex flex-col size-full">
            <div className="flex items-center justify-between p-4">
              <h4 className="text-sm font-medium">Chat History</h4>
            </div>

            {/* New Chat Button */}
            <div className="mx-2">
              <button
                onClick={handleNewChat}
                className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 flex items-center gap-3 group/new-chat px-4 w-full justify-start"
              >
                <PlusIcon className="size-4" />
                <span>New Chat</span>
                <div className="ml-auto gap-0.5 inline-flex group-hover/new-chat:opacity-100 opacity-0 transition-all duration-200">
                  <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none">
                    Ctrl
                  </kbd>
                  <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none">
                    Shift
                  </kbd>
                  <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none">
                    O
                  </kbd>
                </div>
              </button>
            </div>

            {/* Chat History List */}
            <div className="relative flex w-full min-w-0 flex-col p-2 h-[80vh]">
              <div className="w-full text-sm flex flex-col justify-between h-full">
                <ul className="flex w-full min-w-0 flex-col gap-1 h-full grow overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {chatHistory.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">No chat history</p>
                      </div>
                    ) : (
                      chatHistory.map(chat => (
                        <div
                          key={chat.id}
                          className="p-2 rounded-md hover:bg-accent cursor-pointer"
                        >
                          <p className="text-sm font-medium truncate">{chat.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {chat.lastMessage.toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </ul>

                {/* Clear History Button */}
                <div className="mt-2">
                  <button
                    className="mx-auto text-xs text-muted-foreground hover:underline"
                    disabled={chatHistory.length === 0}
                  >
                    Clear history
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mx-2 mt-2 inline-flex items-center justify-center rounded-md hover:bg-accent h-10 w-10"
        >
          <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">Toggle Sidebar</span>
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="size-full grow overflow-hidden">
        <div className="flex flex-col size-full mx-auto relative">
          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="group grow w-full overflow-y-auto"
          >
            <div className="pb-40 pt-2 md:pt-6 max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col min-w-0 flex-1 overflow-y-hidden pt-4">
                  {/* Empty state - will show suggested prompts below */}
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-4 px-4 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="relative px-2 pb-2 max-w-4xl mx-auto w-full">
            {/* Suggested Prompts (show only when no messages) */}
            {messages.length === 0 && (
              <div className="grid sm:grid-cols-2 gap-1 md:gap-2 my-auto pb-2 select-none">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <div key={index} className="cursor-pointer" onClick={() => handlePromptClick(prompt)}>
                    <div className="rounded-xl bg-card text-card-foreground shadow relative transition-all duration-300 border border-muted hover:border-primary/50 hover:shadow-md">
                      {prompt.isNew && (
                        <>
                          <span className="size-3 absolute top-2 right-2 animate-ping rounded-full bg-yellow-500 opacity-80" />
                          <span className="size-3 absolute top-2 right-2 rounded-full bg-yellow-500 opacity-75" />
                        </>
                      )}
                      <div className="p-2">
                        <h1 className="text-sm md:text-base font-semibold">{prompt.title}</h1>
                        <h3 className="text-xs md:text-sm text-muted-foreground">{prompt.subtitle}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 -top-6 z-10 bg-background border border-input hover:bg-accent h-10 w-10 rounded-md transition-opacity duration-300 sm:right-8 md:top-2"
              >
                <ArrowDownIcon className="size-4 mx-auto" />
                <span className="sr-only">Scroll to bottom</span>
              </button>
            )}

            {/* File Preview */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {files.map((file, index) => (
                  <div key={index} className="inline-flex items-center border rounded-md px-2 py-1 text-xs bg-secondary">
                    <PaperclipIcon className="size-3 mr-1" />
                    {file.name}
                  </div>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit}>
              <div className="border bg-card text-card-foreground shadow relative w-full flex flex-col p-4 rounded-2xl">
                <label className="sr-only" htmlFor="message">Message</label>
                <textarea
                  ref={textareaRef}
                  id="message"
                  className="flex w-full rounded-md bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none text-sm sm:text-base resize-none"
                  rows={2}
                  maxLength={2000}
                  placeholder="Type your message here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />

                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    {/* File Upload */}
                    <div>
                      <label htmlFor="file-upload" className="cursor-pointer h-8">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 w-10 pointer-events-none"
                          tabIndex={-1}
                        >
                          <PaperclipIcon className="size-4" />
                          <span className="sr-only">Attach file</span>
                        </button>
                      </label>
                      <input
                        id="file-upload"
                        className="sr-only"
                        aria-label="File attachment"
                        multiple
                        accept=".csv, .tsv, .xls, .xlsx, .xlsm, .xlsb, .xltx, .xltm, .png, .jpeg, .jpg, .gif, .webp"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>

                    {/* Agents Selector */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md px-3 h-10 border border-dashed border-input bg-background hover:bg-accent"
                    >
                      <Settings2Icon className="size-4" />
                      Agents
                      <div className="h-4 w-px bg-border mx-2" />
                      <div className="hidden space-x-1 lg:flex">
                        {selectedAgents.map(agentId => {
                          const agent = AGENTS.find(a => a.id === agentId)
                          return (
                            <div key={agentId} className="inline-flex items-center border rounded-sm px-1 py-0.5 text-xs bg-secondary">
                              {agent?.name}
                            </div>
                          )
                        })}
                      </div>
                      <div className="inline-flex items-center border rounded-sm px-1 py-0.5 text-xs bg-secondary lg:hidden">
                        {selectedAgents.length}
                      </div>
                    </button>

                    {/* Enhance Prompt */}
                    <label className="cursor-pointer">
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium text-primary hover:underline h-10 w-10 disabled:opacity-50"
                      >
                        <WandIcon className="size-4" />
                        <span className="sr-only">Enhance Prompt</span>
                      </button>
                    </label>
                  </div>

                  {/* Send Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={!inputValue.trim() && files.length === 0}
                      className="inline-flex items-center justify-center rounded-md px-3 h-9 gap-1.5 border border-input bg-background hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span className="sm:flex hidden">Send Message</span>
                      <CornerDownLeftIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
