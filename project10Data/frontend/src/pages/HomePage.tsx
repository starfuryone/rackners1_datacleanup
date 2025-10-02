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
    name: 'Smart Insights',
    description: 'Get detailed reports on data quality issues and cleaning recommendations.',
    icon: ChartBarIcon,
  },
  {
    name: 'Format Detection',
    description: 'Automatically identifies and standardizes formats across your dataset.',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Save Time',
    description: 'Reduce manual data cleaning time by up to 95% with automated workflows.',
    icon: ClockIcon,
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
    features: [
      '5 files per month',
      'Up to 1,000 rows per file',
      'Basic cleaning features',
      'Email support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$39',
    period: 'per month',
    features: [
      'Unlimited files',
      'Up to 100,000 rows per file',
      'Advanced AI cleaning',
      'Priority support',
      'API access',
      'Custom rules',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Unlimited everything',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
      'On-premise deployment',
      'Training & onboarding',
    ],
    cta: 'Contact Sales',
    highlighted: false,
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
              <strong>Over 10,000 pros already upgraded. Why shouldn't you?</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-secondary-700 bg-white border-2 border-secondary-300 hover:border-primary-600 transition-all"
              >
                Watch Demo
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
      <div className="py-24 bg-white">
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
      <div className="py-24 bg-secondary-50">
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
                <div className="mb-6">
                  <span className="text-5xl font-bold text-secondary-900">
                    {plan.price}
                  </span>
                  <span className="text-secondary-600 ml-2">/{plan.period}</span>
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
