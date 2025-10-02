// src/pages/dashboard/SQLGeneratorPage.tsx
import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import { LightBulbIcon } from '@heroicons/react/24/outline'

const SQL_PLATFORMS = [
  'SQL',
  'SQLite',
  'MySQL',
  'MariaDB',
  'PostgreSQL',
  'Oracle DB',
  'MSSQL Server',
  'Microsoft Access',
  'Amazon Aurora',
  'Google Cloud SQL',
  'CockroachDB',
  'Apache Derby',
  'IBM Db2',
  'SAP HANA',
  'Teradata',
  'Informix',
  'Sybase',
  'Firebird',
  'Snowflake',
  'HSQLDB (HyperSQL Database)',
  'MonetDB',
]

type ActionType = 'generator' | 'explainer'

export default function SQLGeneratorPage() {
  const [platform, setPlatform] = useState('PostgreSQL')
  const [action, setAction] = useState<ActionType>('explainer')
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult('')

    try {
      // TODO: Call backend API endpoint
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (action === 'explainer') {
        setResult(`### SQL Query Explanation\n\nYour query: \`${query}\`\n\nThis query would retrieve all rows from the table where the value is greater than 1000.\n\n**Breakdown:**\n- **SELECT ***: Selects all columns\n- **WHERE**: Filters rows based on condition\n- **> 1000**: Condition to match values greater than 1000`)
      } else {
        setResult(`### Generated SQL Query\n\n\`\`\`sql\nSELECT * \nFROM table_name \nWHERE value > 1000\nORDER BY value DESC;\n\`\`\`\n\n**Platform**: ${platform}`)
      }
    } catch (error) {
      setResult('❌ Error processing request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setResult('')
    setAction('explainer')
    setPlatform('PostgreSQL')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
  }

  return (
    <div className="size-full max-h-[91vh]">
      <div className="grid max-h-full justify-between xl:grid-cols-2 grid-cols-1 gap-4 p-4 lg:p-6 size-full xl:h-fit max-w-400 overflow-y-auto mx-auto">

        {/* Input Card */}
        <div className="card w-full">
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Input:</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 pt-0">
              <div className="grid w-full items-center gap-6">

                {/* Platform Selector */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm text-muted-foreground mb-2" htmlFor="platform">
                    I am using ...
                  </label>
                  <Listbox value={platform} onChange={setPlatform}>
                    <div className="relative">
                      <Listbox.Button className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring py-6">
                        <span className="font-semibold">{platform}</span>
                        <ChevronUpDownIcon className="h-4 w-4 opacity-50" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {SQL_PLATFORMS.map((plat) => (
                          <Listbox.Option
                            key={plat}
                            value={plat}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {plat}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* Action Toggle */}
                <div className="w-full font-semibold">
                  <label className="text-sm text-muted-foreground mb-2" htmlFor="action-toggle">
                    I want the SQL Query to be...
                  </label>
                  <div className="gap-2 mt-1 flex items-center flex-row">
                    <button
                      type="button"
                      onClick={() => setAction('generator')}
                      className={`flex-1 py-6 relative text-sm font-medium leading-none rounded-lg border transition-all ${
                        action === 'generator'
                          ? 'ring-1 ring-ring bg-secondary text-secondary-foreground'
                          : 'border-input hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      GENERATED
                      {action === 'generator' && (
                        <CheckIcon className="absolute w-3 h-3 top-2 right-2 text-primary" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAction('explainer')}
                      className={`flex-1 py-6 relative text-sm font-medium leading-none rounded-lg border transition-all ${
                        action === 'explainer'
                          ? 'ring-1 ring-ring bg-secondary text-secondary-foreground'
                          : 'border-input hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      EXPLAINED
                      {action === 'explainer' && (
                        <CheckIcon className="absolute w-3 h-3 top-2 right-2 text-primary" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Query Input */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm text-muted-foreground mb-2" htmlFor="prompt">
                    {action === 'generator'
                      ? 'Describe what you want your SQL query to do'
                      : 'Write your SQL Query below'}
                  </label>
                  <textarea
                    className="input resize-none min-h-40 text-base"
                    required
                    id="prompt"
                    maxLength={1400}
                    placeholder={action === 'generator'
                      ? 'Get all users who signed up in the last 30 days...'
                      : 'SELECT * FROM table WHERE ...'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="items-center p-6 pt-0 flex justify-between">
              <button
                className="btn-primary py-2 px-10"
                type="submit"
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? 'Processing...' : action === 'generator' ? 'generate' : 'explain'}
              </button>
            </div>
          </form>
        </div>

        {/* Result Card */}
        <div className="card w-full flex flex-col">
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Result:</h3>
          </div>

          <div className="p-6 pt-0 grow items-center gap-6">
            <div className="flex flex-col space-y-1.5 h-full">
              <label className="text-sm text-muted-foreground mb-2">
                Results will be displayed here
              </label>
              <div className="card min-h-92 grow h-full flex flex-col">
                <div className="grow p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                  ) : result ? (
                    <div className="prose prose-sm max-w-none">
                      {result.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">
                          {line.startsWith('###') ? (
                            <strong className="text-lg">{line.replace('###', '')}</strong>
                          ) : line.startsWith('**') ? (
                            <strong>{line.replace(/\*\*/g, '')}</strong>
                          ) : line.startsWith('`') ? (
                            <code className="bg-secondary-100 px-2 py-1 rounded text-sm">
                              {line.replace(/`/g, '')}
                            </code>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>Enter a query above and click "{action === 'generator' ? 'generate' : 'explain'}" to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="items-center p-6 pt-0 flex justify-between">
            <button
              className="btn-outline py-2 px-10 inline-flex items-center gap-2"
              type="button"
              onClick={handleReset}
              disabled={!query && !result}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <path d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
              reset
            </button>
            <button
              className="btn-primary py-2 px-10 inline-flex items-center gap-2"
              onClick={handleCopy}
              disabled={!result}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              copy
            </button>
          </div>
        </div>

        {/* Best Practices Button */}
        <div className="w-fit pb-10">
          <button
            className="btn-outline px-4 py-2 inline-flex items-center gap-2"
            type="button"
            onClick={() => alert('Best practices modal would open here')}
          >
            <LightBulbIcon className="w-5 h-5 text-yellow-500" />
            Best Practices
          </button>
        </div>
      </div>
    </div>
  )
}
