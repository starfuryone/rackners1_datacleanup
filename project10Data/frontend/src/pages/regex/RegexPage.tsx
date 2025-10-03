// src/pages/regex/RegexPage.tsx
import { useState } from 'react'
import {
  CopyIcon,
  RotateCcwIcon,
  LightbulbIcon,
  CircleCheckIcon,
} from 'lucide-react'

interface RegexResult {
  pattern: string
  explanation: string
  matches?: string[]
}

const PLATFORMS = [
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Ruby',
  'Go',
  'Rust',
  'Perl',
]

export default function RegexPage() {
  const [platform, setPlatform] = useState('JavaScript')
  const [action, setAction] = useState<'generator' | 'explainer'>('generator')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<RegexResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)

    // TODO: Connect to backend API
    // Simulate API call
    setTimeout(() => {
      setResult({
        pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/',
        explanation: 'This regex pattern validates email addresses. It checks for a valid email format with alphanumeric characters, dots, and special characters before the @ symbol, followed by a domain name and extension.',
        matches: action === 'generator' ? ['example@email.com', 'user.name@domain.co.uk'] : undefined,
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleReset = () => {
    setPrompt('')
    setResult(null)
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!result) return

    try {
      await navigator.clipboard.writeText(result.pattern)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="size-full max-h-[91vh]">
      <div
        translate="no"
        className="grid max-h-full justify-between xl:grid-cols-2 grid-cols-1 gap-4 p-4 lg:p-6 size-full xl:h-fit max-w-400 overflow-y-auto mx-auto"
      >
        {/* Input Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow w-full">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight">Input:</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 pt-0">
              <div className="grid w-full items-center gap-6">
                {/* Platform Selector */}
                <div className="flex flex-col space-y-1.5">
                  <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 text-sm text-muted-foreground"
                    htmlFor="platform"
                  >
                    I am using ...
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 py-6"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Toggle */}
                <div className="w-full font-semibold">
                  <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 text-sm text-muted-foreground"
                    htmlFor="action-toggle"
                  >
                    I want the regex to be...
                  </label>
                  <div
                    className="gap-2 mt-1 flex items-center flex-row"
                    id="action-toggle"
                  >
                    <div className="flex items-center space-x-1 flex-1">
                      <input
                        type="radio"
                        id="generator"
                        value="generator"
                        checked={action === 'generator'}
                        onChange={() => setAction('generator')}
                        className="sr-only hidden"
                      />
                      <label
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 radio-outline py-6 relative cursor-pointer ${
                          action === 'generator'
                            ? 'ring-1 ring-ring bg-secondary'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        htmlFor="generator"
                      >
                        GENERATED
                        {action === 'generator' && (
                          <CircleCheckIcon className="absolute w-3 h-3 mr-2 top-2 right-1 text-primary brightness-75" />
                        )}
                      </label>
                    </div>
                    <div className="flex items-center space-x-1 flex-1">
                      <input
                        type="radio"
                        id="explainer"
                        value="explainer"
                        checked={action === 'explainer'}
                        onChange={() => setAction('explainer')}
                        className="sr-only hidden"
                      />
                      <label
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 radio-outline py-6 relative cursor-pointer ${
                          action === 'explainer'
                            ? 'ring-1 ring-ring bg-secondary'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        htmlFor="explainer"
                      >
                        EXPLAINED
                        {action === 'explainer' && (
                          <CircleCheckIcon className="absolute w-3 h-3 mr-2 top-2 right-1 text-primary brightness-75" />
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Prompt Input */}
                <div className="flex flex-col space-y-1.5">
                  <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 text-sm text-muted-foreground"
                    htmlFor="prompt"
                  >
                    {action === 'generator'
                      ? 'Describe the pattern you want to match'
                      : 'Paste the regex pattern you want explained'}
                  </label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-40 text-base"
                    required
                    id="prompt"
                    maxLength={1400}
                    placeholder={
                      action === 'generator'
                        ? 'Match email addresses, phone numbers, URLs, etc...'
                        : 'Paste your regex pattern here: /^[a-z]+$/'
                    }
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="items-center p-6 pt-0 flex justify-between">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-10"
                type="submit"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? 'Generating...' : 'generate'}
              </button>
            </div>
          </form>
        </div>

        {/* Result Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow w-full flex flex-col">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight">Result:</div>
          </div>

          <div className="p-6 pt-0 grow items-center gap-6">
            <div className="flex flex-col space-y-1.5 h-full">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 text-sm text-muted-foreground"
                htmlFor="result"
              >
                Results will be displayed here
              </label>

              <div className="rounded-xl border bg-card text-card-foreground shadow min-h-92 grow h-full flex flex-col">
                <div className="grow p-4">
                  {result ? (
                    <div className="markdown-body space-y-4">
                      {/* Pattern */}
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Pattern:</h3>
                        <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                          <code className="text-sm">{result.pattern}</code>
                        </pre>
                      </div>

                      {/* Explanation */}
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Explanation:</h3>
                        <p className="text-sm text-muted-foreground">
                          {result.explanation}
                        </p>
                      </div>

                      {/* Example Matches (if generator mode) */}
                      {result.matches && (
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Example Matches:</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {result.matches.map((match, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground">
                                {match}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p className="text-sm">No results yet. Submit a prompt to generate or explain a regex pattern.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="items-center p-6 pt-0 flex justify-between">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-10"
              type="button"
              disabled={!result}
              onClick={handleReset}
            >
              <RotateCcwIcon className="w-4 h-4 mr-2" />
              reset
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-10"
              disabled={!result}
              onClick={handleCopy}
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              {copied ? 'copied!' : 'copy'}
            </button>
          </div>
          <span></span>
        </div>

        {/* Best Practices Button */}
        <div className="w-fit pb-10">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            type="button"
          >
            <LightbulbIcon className="w-[18px] h-[18px] text-yellow-500 mr-2" />
            Best Practices
          </button>
        </div>
      </div>
    </div>
  )
}
