// src/pages/HomePage.tsx
import { Link } from 'react-router-dom'
import {
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  TableCellsIcon,
  CommandLineIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'AI-Powered Cleaning',
    description: 'Advanced machine learning algorithms automatically detect and fix data quality issues.',
    icon: SparklesIcon,
  },
  {
    name: 'Lightning Fast',
    description: 'Process thousands of rows in seconds with our optimized cleaning engine.',
    icon: BoltIcon,
  },
  {
    name: 'Enterprise Security',
    description: 'SOC 2 Type II certified with AES-256 encryption and automatic data deletion.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Excel/CSV Cleaning & Deduplication',
    description: 'One-click cleanup for XLSX/CSV • Exact & fuzzy dedupe (by columns, cross-sheet/file, merge rules) • Standardize case/whitespace/Unicode, trim/split/merge columns • Fix data types, normalize dates, phones, emails, IDs • Remove empty rows/columns, detect headers, validate required fields',
    icon: DocumentCheckIcon,
  },
  {
    name: 'General Cleanup & Analysis',
    description: 'Auto error detection & correction • Summary stats, outlier spotting, quick insights',
    icon: ChartBarIcon,
  },
  {
    name: 'Pivot Tables (Pivot Builder AI Agent)',
    description: 'Auto-build & modify pivots • Trend analysis without manual setup',
    icon: TableCellsIcon,
  },
  {
    name: 'Formulas',
    description: 'Generate Excel/Sheets formulas instantly • Explain & optimize existing formulas',
    icon: CodeBracketIcon,
  },
  {
    name: 'Scripts & Automation',
    description: 'Generate VBA (Excel) and Google Apps Scripts • Automate repetitive tasks with one click',
    icon: CommandLineIcon,
  },
  {
    name: 'SQL',
    description: 'Generate & explain queries • Works across multiple database types',
    icon: CommandLineIcon,
  },
  {
    name: 'Regex Assistant',
    description: 'Generate patterns, validate & filter text/data • Debug existing regex',
    icon: DocumentTextIcon,
  },
  {
    name: 'Template Generator',
    description: 'Create reusable Excel/Sheets table templates • Standardize data entry structures',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Import / Export & Workflow',
    description: 'Import: CSV/XLSX/Google Sheets • Export: CSV/XLSX; downloadable reports • Preview & Undo (dry-run before apply) • Batch/Bulk processing for large files • Audit log of changes',
    icon: ArrowPathIcon,
  },
]

const stats = [
  { label: 'Files Processed', value: '1M+' },
  { label: 'Time Saved', value: '500K hrs' },
  { label: 'Happy Users', value: '10K+' },
  { label: 'Accuracy Rate', value: '99.9%' },
]

const useCases = [
  {
    title: 'Data Analysts',
    description: 'Clean messy datasets before analysis',
    benefits: ['Remove duplicates', 'Standardize formats', 'Fill missing values'],
  },
  {
    title: 'Business Teams',
    description: 'Prepare CRM and sales data',
    benefits: ['Validate emails', 'Normalize addresses', 'Merge records'],
  },
  {
    title: 'Developers',
    description: 'Sanitize data for applications',
    benefits: ['API integration', 'Bulk processing', 'Custom rules'],
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with essential features at no cost.',
    features: [
      'Up to 10 AI Chat messages (reset every 30 days)',
      '4 tool uses (refresh every 12 hours)',
      'Upload size: 5MB/file (up to 5 files per chat)',
      'Excel/CSV data cleaning & deduplication',
      'Pivot Tables with AI — generate and modify pivots easily',
      'Formula Assistant AI (Excel, Sheets, LibreOffice, Airtable)',
      'Scripts for Automation (VBA & Google Apps Scripts)',
      'SQL Query Assistant AI',
      'Regex Assistant AI',
      'Excel/Sheets Table Template Generator',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$6.30',
    originalPrice: '$9.00',
    period: 'mo',
    savings: 'Save 30%',
    billingNote: 'billed annually',
    annualTotal: 'Annual total: $75.60 (was $108.00)',
    description: 'Essential AI tools for smarter Excel/CSV workflows and data analysis.',
    features: [
      'Up to 3,000 AI Chat messages (reset every 30 days)',
      '3,000 tool uses (refresh every 30 days)',
      'Upload size: 50MB/file (up to 10 files per chat)',
      'Excel/CSV data cleaning & deduplication',
      'Pivot Tables with AI — generate and modify pivots easily',
      'Formula Assistant AI (Excel, Sheets, LibreOffice, Airtable)',
      'Scripts for Automation (VBA & Google Apps Scripts)',
      'SQL Query Assistant AI',
      'Regex Assistant AI',
      'Excel/Sheets Table Template Generator',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Premium Plus',
    price: '$12.60',
    originalPrice: '$18.00',
    period: 'mo',
    savings: 'Save 30%',
    billingNote: 'billed annually',
    annualTotal: 'Annual total: $151.20 (was $216.00)',
    description: 'Unlock full AI-powered Excel/CSV capabilities and advanced analysis.',
    features: [
      'Up to 10,000 AI Chat messages (reset every 30 days)',
      '10,000 tool uses (refresh every 30 days)',
      'Upload size: 100MB/file (up to 15 files per chat)',
      'Excel/CSV data cleaning & deduplication',
      'Pivot Tables with AI — generate and modify pivots easily',
      'Formula Assistant AI (Excel, Sheets, LibreOffice, Airtable)',
      'Scripts for Automation (VBA & Google Apps Scripts)',
      'SQL Query Assistant AI',
      'Regex Assistant AI',
      'Excel/Sheets Table Template Generator',
    ],
    cta: 'Upgrade to Premium Plus',
    highlighted: true,
  },
]

export function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-secondary-900 mb-6">
              Your Spreadsheet, Fixed
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Before You Finish Coffee
              </span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
              AI that instantly cleans, corrects, and organizes your data. No stress. No wasted hours. Just clean, ready-to-roll spreadsheets.
              <br /><br />
              <strong>Thousands of pros quietly upgraded. Why shouldn't you?</strong>
            </p>
            <div className="flex justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started Free
                <ArrowRightIcon className="ml-2 h-6 w-6" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-secondary-500">
              No credit card required • Free tier available • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-secondary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-secondary-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Clean Data
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Powerful features that save you time and ensure data quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary-600">
              Clean your data in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-600 text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Upload Your File
              </h3>
              <p className="text-secondary-600">
                Drag and drop your CSV, Excel, or TSV file. We support files up to
                100,000 rows.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-600 text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                AI Does the Magic
              </h3>
              <p className="text-secondary-600">
                Our AI analyzes your data, identifies issues, and applies intelligent
                cleaning rules automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-600 text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Download Clean Data
              </h3>
              <p className="text-secondary-600">
                Get your cleaned file with a detailed report showing exactly what was
                fixed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Built for Every Team
            </h2>
            <p className="text-xl text-secondary-600">
              From analysts to developers, everyone loves clean data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="card p-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-secondary-600 mb-6">{useCase.description}</p>
                <ul className="space-y-3">
                  {useCase.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start">
                      <CheckCircleIcon className="h-6 w-6 text-success-600 mr-2 flex-shrink-0" />
                      <span className="text-secondary-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-secondary-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 ${
                  plan.highlighted
                    ? 'ring-2 ring-primary-600 shadow-xl scale-105'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary-700 bg-primary-100 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="text-sm text-secondary-600 mb-4">{plan.description}</p>
                )}
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl text-secondary-400 line-through">
                        {plan.originalPrice}
                      </span>
                      {plan.savings && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-success-700 bg-success-100 rounded">
                          {plan.savings}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-secondary-900">
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-secondary-600">/{plan.period}</span>}
                  </div>
                  {plan.billingNote && (
                    <p className="text-sm text-secondary-500 mt-1">{plan.billingNote}</p>
                  )}
                  {plan.annualTotal && (
                    <p className="text-sm text-secondary-600 mt-2 font-medium">{plan.annualTotal}</p>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircleIcon className="h-6 w-6 text-success-600 mr-2 flex-shrink-0" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700'
                      : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Clean Your Data?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who trust DataCleanup Pro
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-secondary-50 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
