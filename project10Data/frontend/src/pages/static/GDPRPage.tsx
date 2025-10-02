// src/pages/static/GDPRPage.tsx
import { Link } from 'react-router-dom'
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  KeyIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  UserCircleIcon,
  LockClosedIcon,
  GlobeEuropeAfricaIcon,
} from '@heroicons/react/24/outline'

const gdprRights = [
  {
    title: 'Right to Access',
    description: 'You have the right to request copies of your personal data.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Right to Rectification',
    description: 'You have the right to request correction of inaccurate or incomplete data.',
    icon: UserCircleIcon,
  },
  {
    title: 'Right to Erasure',
    description: 'You have the right to request deletion of your personal data.',
    icon: TrashIcon,
  },
  {
    title: 'Right to Data Portability',
    description: 'You have the right to receive your data in a structured, machine-readable format.',
    icon: ArrowDownTrayIcon,
  },
  {
    title: 'Right to Object',
    description: 'You have the right to object to processing of your personal data.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Right to Restrict Processing',
    description: 'You have the right to request limitation of processing your data.',
    icon: LockClosedIcon,
  },
]

const dataCategories = [
  {
    category: 'Account Information',
    examples: 'Name, email address, password (encrypted)',
    purpose: 'Account creation and authentication',
    retention: 'Until account deletion',
  },
  {
    category: 'Usage Data',
    examples: 'Files uploaded, cleaning operations, API usage',
    purpose: 'Service provision and improvement',
    retention: '30 days after processing',
  },
  {
    category: 'Payment Information',
    examples: 'Billing address, payment method (via Stripe)',
    purpose: 'Payment processing and invoicing',
    retention: '7 years (legal requirement)',
  },
  {
    category: 'Technical Data',
    examples: 'IP address, browser type, device information',
    purpose: 'Security, analytics, and service optimization',
    retention: '90 days',
  },
]

export function GDPRPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-4">
            <GlobeEuropeAfricaIcon className="h-12 w-12 text-white" />
            <h1 className="text-4xl font-bold text-white">GDPR Compliance</h1>
          </div>
          <p className="text-xl text-primary-100 max-w-3xl">
            General Data Protection Regulation - Your Rights and Our Commitment
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-secondary-700 leading-relaxed">
            DataCleanup Pro is committed to protecting your privacy and ensuring compliance with the
            <strong> General Data Protection Regulation (GDPR)</strong>. This page outlines how we collect,
            use, and protect your personal data in accordance with EU data protection laws.
          </p>

          <p className="text-secondary-600 mt-4">
            <strong>Last Updated:</strong> October 2, 2025
          </p>
        </div>
      </div>

      {/* Data Controller Information */}
      <div className="bg-secondary-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Data Controller</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-secondary-700 mb-2">
              <strong>Company Name:</strong> DataCleanup Pro Ltd.
            </p>
            <p className="text-secondary-700 mb-2">
              <strong>Email:</strong> privacy@datacleanup.pro
            </p>
            <p className="text-secondary-700 mb-2">
              <strong>DPO Contact:</strong> dpo@datacleanup.pro
            </p>
            <p className="text-secondary-700">
              <strong>Address:</strong> [Your registered EU business address]
            </p>
          </div>
        </div>
      </div>

      {/* Your GDPR Rights */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4 text-center">Your GDPR Rights</h2>
          <p className="text-xl text-secondary-600 text-center mb-12 max-w-3xl mx-auto">
            Under GDPR, you have the following rights regarding your personal data:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gdprRights.map((right) => (
              <div
                key={right.title}
                className="bg-white rounded-lg border border-secondary-200 p-6 hover:shadow-lg transition-shadow"
              >
                <right.icon className="h-10 w-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {right.title}
                </h3>
                <p className="text-secondary-600">{right.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data We Collect */}
      <div className="bg-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Data We Collect</h2>
          <p className="text-lg text-secondary-600 mb-8">
            We collect and process the following categories of personal data:
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-secondary-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Data Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Examples
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Retention Period
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {dataCategories.map((item, index) => (
                  <tr key={index} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">
                      {item.examples}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">
                      {item.purpose}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">
                      {item.retention}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Legal Basis for Processing */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Legal Basis for Processing</h2>

          <div className="space-y-6">
            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                1. Contractual Necessity
              </h3>
              <p className="text-secondary-700">
                We process your data to provide the services you've requested (data cleaning, analysis, etc.)
                as part of our contract with you.
              </p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                2. Legitimate Interest
              </h3>
              <p className="text-secondary-700">
                We process certain data based on our legitimate interests to improve our services,
                prevent fraud, and ensure security. We balance these interests against your rights and freedoms.
              </p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                3. Consent
              </h3>
              <p className="text-secondary-700">
                For certain processing activities (e.g., marketing emails), we rely on your explicit consent.
                You can withdraw consent at any time.
              </p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                4. Legal Obligation
              </h3>
              <p className="text-secondary-700">
                We process data when required by law (e.g., tax records, response to legal requests).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* International Data Transfers */}
      <div className="bg-secondary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            International Data Transfers
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-secondary-700 mb-4">
              Your data may be transferred to and processed in countries outside the European Economic Area (EEA).
              When we transfer data internationally, we ensure adequate safeguards are in place:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4">
              <li>
                <strong>Standard Contractual Clauses (SCCs):</strong> We use EU-approved SCCs with our service providers
              </li>
              <li>
                <strong>Adequacy Decisions:</strong> We only transfer to countries recognized by the EU as providing adequate protection
              </li>
              <li>
                <strong>Certified Frameworks:</strong> We work with providers certified under recognized frameworks (e.g., Privacy Shield successors)
              </li>
            </ul>
            <p className="text-secondary-700 mt-4">
              <strong>Primary Data Locations:</strong> EU (primary), USA (cloud backup with SCCs)
            </p>
          </div>
        </div>
      </div>

      {/* Data Security */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Data Security Measures</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <LockClosedIcon className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Encryption
              </h3>
              <p className="text-secondary-700">
                AES-256 encryption for data at rest, TLS 1.3 for data in transit
              </p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <KeyIcon className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Access Controls
              </h3>
              <p className="text-secondary-700">
                Multi-factor authentication, role-based access, principle of least privilege
              </p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Regular Audits
              </h3>
              <p className="text-secondary-700">
                SOC 2 Type II certified, regular security assessments and penetration testing
              </p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <TrashIcon className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Automatic Deletion
              </h3>
              <p className="text-secondary-700">
                Your uploaded files are automatically deleted after 30 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercising Your Rights */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            How to Exercise Your Rights
          </h2>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-secondary-700 mb-6">
              To exercise any of your GDPR rights, you can:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-primary-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Use Your Account Dashboard</h3>
                  <p className="text-secondary-600">
                    Log in to your account and access the "Privacy Settings" section to download or delete your data
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-primary-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Email Our DPO</h3>
                  <p className="text-secondary-600">
                    Send a request to <a href="mailto:dpo@datacleanup.pro" className="text-primary-600 hover:underline">dpo@datacleanup.pro</a> with
                    "GDPR Request" in the subject line
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-primary-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Contact Support</h3>
                  <p className="text-secondary-600">
                    Use our <Link to="/contact" className="text-primary-600 hover:underline">contact form</Link> or email{' '}
                    <a href="mailto:privacy@datacleanup.pro" className="text-primary-600 hover:underline">privacy@datacleanup.pro</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-700">
                <strong>Response Time:</strong> We will respond to your request within <strong>30 days</strong> as
                required by GDPR. In complex cases, we may extend this by an additional 60 days and will notify you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            Right to Lodge a Complaint
          </h2>

          <div className="bg-white border border-secondary-200 rounded-lg p-6">
            <p className="text-secondary-700 mb-4">
              If you believe we have not complied with GDPR, you have the right to lodge a complaint with your
              local supervisory authority. Contact information for EU supervisory authorities can be found at:
            </p>
            <a
              href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline font-medium"
            >
              European Data Protection Board - Supervisory Authorities
            </a>
            <p className="text-secondary-700 mt-4">
              However, we encourage you to contact us first so we can address your concerns directly.
            </p>
          </div>
        </div>
      </div>

      {/* Cookies */}
      <div className="bg-secondary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Cookies and Tracking</h2>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-secondary-700 mb-4">
              We use cookies and similar technologies in compliance with GDPR and the ePrivacy Directive.
              You can manage your cookie preferences at any time.
            </p>
            <Link
              to="/cookies"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View Our Cookie Policy
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Updates to This Policy */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Updates to This Policy</h2>

          <div className="bg-white border border-secondary-200 rounded-lg p-6">
            <p className="text-secondary-700 mb-4">
              We may update this GDPR compliance page from time to time. When we make material changes,
              we will notify you by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4">
              <li>Email notification to your registered email address</li>
              <li>Prominent notice on our website and dashboard</li>
              <li>Updating the "Last Updated" date at the top of this page</li>
            </ul>
            <p className="text-secondary-700 mt-4">
              Your continued use of our services after such notification constitutes acceptance of the changes.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Questions About GDPR?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Our Data Protection Officer is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:dpo@datacleanup.pro"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
            >
              Email Our DPO
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-primary-700 hover:bg-primary-800 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
