// src/pages/AboutPage.tsx
import { Link } from 'react-router-dom'
import {
  SparklesIcon,
  TableCellsIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Upload a messy spreadsheet and watch it get cleaned automatically',
    icon: TableCellsIcon,
  },
  {
    name: 'Standardize data across entire files instantly',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Generate pivot tables, formulas, and SQL queries with zero guesswork',
    icon: PresentationChartLineIcon,
  },
  {
    name: 'Analyze Excel/CSV files and actually see the insights hidden inside',
    icon: SparklesIcon,
  },
]

const platforms = [
  'Microsoft Excel',
  'Google Sheets',
  'LibreOffice Calc',
  'Airtable',
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            About Us
          </h1>
          <p className="text-xl text-secondary-600 leading-relaxed">
            At Datacleanup Pro, we've always believed that data should empower people—not hold them back.
            But too often, we saw the same frustration everywhere: brilliant professionals wasting hours cleaning
            spreadsheets instead of actually using them.
          </p>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-secondary-700 leading-relaxed mb-6">
            <strong className="text-secondary-900">Messy formats. Duplicate rows. Broken entries. Endless cleanup.</strong>
          </p>
          <p className="text-lg text-secondary-700 leading-relaxed mb-6">
            We knew there had to be a better way.
          </p>
          <p className="text-lg text-secondary-700 leading-relaxed mb-8">
            That's why we built DataCleanup Pro—an AI-powered tool that takes spreadsheets from chaos to clarity
            in seconds. No more grunt work. No more wasted hours. Just clean, usable data at your fingertips.
          </p>
        </div>
      </div>

      {/* What is DataCleanup Pro */}
      <div className="py-16 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            What is DataCleanup Pro?
          </h2>
          <p className="text-lg text-secondary-700 leading-relaxed mb-6">
            Let's be real… spreadsheets are a nightmare when they're messy. Hours wasted fixing formatting,
            deleting duplicates, and trying to make sense of the chaos.
          </p>
          <p className="text-lg text-secondary-700 leading-relaxed">
            That's why we created DataCleanup Pro—an <strong>AI-powered solution</strong> that cleans and organizes
            your spreadsheets instantly.
          </p>
        </div>
      </div>

      {/* What can I use it for */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            What can I use DataCleanup Pro for?
          </h2>
          <p className="text-lg text-secondary-700 leading-relaxed mb-8">
            Think about all the time you've lost wrestling with messy data… now imagine what happens when you get that time back.
          </p>

          <div className="mb-8">
            <p className="text-lg text-secondary-700 leading-relaxed mb-4">
              <strong className="text-secondary-900">With DataCleanup Pro you can:</strong>
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-start gap-4 p-6 bg-secondary-50 rounded-lg"
                >
                  <feature.icon className="h-8 w-8 text-primary-600 flex-shrink-0" />
                  <p className="text-secondary-800">{feature.name}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-secondary-700 leading-relaxed">
            Whether you're a business owner, freelancer, or analyst, this tool gives you back your most valuable resource: <strong>time</strong>.
          </p>
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            Which spreadsheet platforms and file formats are supported?
          </h2>
          <p className="text-lg text-secondary-700 leading-relaxed mb-8">
            We made this flexible because you don't live in just one tool. DataCleanup Pro works with:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {platforms.map((platform) => (
              <div
                key={platform}
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm"
              >
                <SparklesIcon className="h-6 w-6 text-primary-600" />
                <span className="text-lg font-medium text-secondary-900">{platform}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-secondary-700 leading-relaxed mb-4">
            Plus, it handles <strong className="text-secondary-900">CSV and XLSX files</strong> directly.
          </p>
          <p className="text-lg text-secondary-700 leading-relaxed">
            And if you're on <strong className="text-primary-600">Pro Plus</strong>—you can even clean <strong>multiple files at once</strong>.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Data Workflow?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join 10,000+ professionals who've already upgraded their data game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-primary-700 hover:bg-primary-800 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
