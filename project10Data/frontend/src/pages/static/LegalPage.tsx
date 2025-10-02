// src/pages/static/LegalPage.tsx
import { Link } from 'react-router-dom'
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ScaleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

export function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-secondary-600 mb-4">
          Last Updated: December 15, 2024 | Effective Date: January 1, 2025
        </p>
        <p className="text-sm font-medium text-secondary-700 mb-2">
          Datacleanup Pro trading as Datacleanup.pro™
        </p>
        <p className="text-sm text-secondary-600 mb-8">
          Operated by Chatlogic Insights Ltd (Company Registration Number: 15593166)
        </p>

        {/* Quick Navigation */}
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a href="#section-1" className="text-primary-600 hover:text-primary-500">1. Agreement to Terms</a>
            <a href="#section-2" className="text-primary-600 hover:text-primary-500">2. Important Restriction – United Kingdom</a>
            <a href="#section-3" className="text-primary-600 hover:text-primary-500">3. Description of Service</a>
            <a href="#section-4" className="text-primary-600 hover:text-primary-500">4. User Accounts and Responsibilities</a>
            <a href="#section-5" className="text-primary-600 hover:text-primary-500">5. Acceptable Use Policy</a>
            <a href="#section-6" className="text-primary-600 hover:text-primary-500">6. Payment Terms</a>
            <a href="#section-7" className="text-primary-600 hover:text-primary-500">7. Intellectual Property</a>
            <a href="#section-8" className="text-primary-600 hover:text-primary-500">8. Limitation of Liability</a>
            <a href="#section-9" className="text-primary-600 hover:text-primary-500">9. Disclaimers</a>
            <a href="#section-10" className="text-primary-600 hover:text-primary-500">10. Indemnification</a>
            <a href="#section-11" className="text-primary-600 hover:text-primary-500">11. Termination</a>
            <a href="#section-12" className="text-primary-600 hover:text-primary-500">12. Governing Law</a>
            <a href="#section-13" className="text-primary-600 hover:text-primary-500">13. Changes to Terms</a>
            <a href="#section-14" className="text-primary-600 hover:text-primary-500">14. Contact Information</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">

          {/* Section 1 */}
          <section id="section-1" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4 flex items-center gap-3">
              <DocumentTextIcon className="h-7 w-7 text-primary-600" />
              1. Agreement to Terms
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              By accessing or using Datacleanup.pro™ ("Service"), operated by Chatlogic Insights Ltd, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access or use the Service.
            </p>
            <p className="text-secondary-700 leading-relaxed">
              These Terms apply to all visitors, users, and others who access or use the Service, whether as a guest or registered user. Your use of the Service also constitutes acceptance of our <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 2 - UK Restriction */}
          <section id="section-2" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4 flex items-center gap-3">
              <ExclamationTriangleIcon className="h-7 w-7 text-red-600" />
              2. Important Restriction – United Kingdom
            </h2>
            <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-4">
              <p className="text-secondary-700 leading-relaxed mb-4 font-semibold">
                Although Chatlogic Insights Ltd is incorporated in the United Kingdom, the Service is not intended for use by customers or entities located in the United Kingdom, including England, Scotland, or Wales.
              </p>
              <p className="text-secondary-700 leading-relaxed mb-4">
                If you are a resident of the United Kingdom or accessing the Service from within the United Kingdom, you are not permitted to register, purchase, or otherwise use the Service.
              </p>
              <p className="text-secondary-700 leading-relaxed mb-4">
                By accepting these Terms, you confirm that you are not located in the United Kingdom and are not acting on behalf of any United Kingdom customer or entity.
              </p>
              <p className="text-secondary-700 leading-relaxed">
                Any accounts created in violation of this restriction may be suspended or terminated without prior notice, and any associated data may be deleted.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              3. Description of Service
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Datacleanup.pro™ provides automated data cleaning and processing services for spreadsheet files, including but not limited to CSV, Excel, and TSV formats. Our Service uses artificial intelligence and machine learning algorithms to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4 mb-4">
              <li>Identify and correct data quality issues</li>
              <li>Remove duplicate entries</li>
              <li>Standardize data formats</li>
              <li>Improve overall data integrity</li>
              <li>Generate detailed cleaning reports</li>
            </ul>
            <p className="text-secondary-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice, except in cases of emergency or security concerns.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4 flex items-center gap-3">
              <ShieldCheckIcon className="h-7 w-7 text-primary-600" />
              4. User Accounts and Responsibilities
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              To access certain features, you must create an account. By doing so, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Comply with all applicable laws (excluding the United Kingdom restriction above)</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-secondary-700">
                <strong>Account Security:</strong> You are solely responsible for safeguarding your password and API keys. We will never request your password via email or phone.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              5. Acceptable Use Policy
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              You may not use the Service to:
            </p>

            <h3 className="text-xl font-semibold text-secondary-900 mb-3">Prohibited Content</h3>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4 mb-4">
              <li>Upload malware or harmful code</li>
              <li>Process illegal, fraudulent, or unauthorized personal data</li>
              <li>Violate intellectual property rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-900 mb-3">Prohibited Actions</h3>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4 mb-4">
              <li>Attempt unauthorized system access</li>
              <li>Interfere with Service operations</li>
              <li>Reverse engineer the technology</li>
              <li>Resell or redistribute the Service without prior written consent</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-secondary-700">
                <strong>Warning:</strong> Violation may result in immediate termination without refund.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4 flex items-center gap-3">
              <CreditCardIcon className="h-7 w-7 text-primary-600" />
              6. Payment Terms
            </h2>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4 mb-4">
              <li>Subscription fees are billed in advance (monthly or annually).</li>
              <li>All fees are non-refundable except where required by law or expressly stated in these Terms.</li>
              <li>Prices may change with 30 days' notice.</li>
              <li>All prices exclude applicable taxes unless otherwise stated.</li>
            </ul>
            <p className="text-secondary-700 leading-relaxed">
              Payment processing is handled by third-party providers. By providing payment details, you authorize us to charge the corresponding amounts.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              All content, features, and functionality of the Service are the exclusive property of Datacleanup Pro and are protected by international intellectual property laws.
            </p>
            <p className="text-secondary-700 leading-relaxed">
              You retain rights to the data you upload. By using the Service, you grant us a limited license to process your data solely for Service delivery. This license ends when your data is deleted from our systems.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4 flex items-center gap-3">
              <ScaleIcon className="h-7 w-7 text-primary-600" />
              8. Limitation of Liability
            </h2>
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
              <p className="text-secondary-700 leading-relaxed mb-4 font-semibold uppercase text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHATLOGIC INSIGHTS LTD SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, OR GOODWILL.
              </p>
              <p className="text-secondary-700 leading-relaxed">
                Total liability under these Terms shall not exceed the amount you paid to us in the twelve months preceding the event giving rise to liability.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              9. Disclaimers
            </h2>
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
              <p className="text-secondary-700 leading-relaxed mb-4 font-semibold uppercase text-sm">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL IMPLIED WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-secondary-700 leading-relaxed">
                We do not guarantee uninterrupted or error-free operation of the Service.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              10. Indemnification
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              You agree to indemnify and hold harmless Datacleanup Pro, its affiliates, officers, and employees from claims, damages, or losses resulting from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4">
              <li>Your use of the Service outside permitted jurisdictions</li>
              <li>Your breach of these Terms</li>
              <li>Your violation of third-party rights</li>
              <li>Your non-compliance with applicable laws</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              11. Termination
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              We may suspend or terminate your account immediately, without notice, for violations of these Terms. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 ml-4">
              <li>You must cease using the Service</li>
              <li>We may delete your account data</li>
              <li>Provisions reasonably intended to survive will remain enforceable</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              12. Governing Law
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              These Terms shall be governed by the laws of <strong>Ireland</strong>, excluding its conflict of law rules. Any disputes shall be heard exclusively in the courts of Ireland.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-secondary-700">
                <strong>Note:</strong> These Terms explicitly exclude the United Kingdom. If you are based in the United Kingdom, you are not permitted to use the Service.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              We may update these Terms at any time. Material changes will be communicated at least 30 days before taking effect.
            </p>
            <p className="text-secondary-700 leading-relaxed">
              Continued use of the Service constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 14 - Contact */}
          <section id="section-14" className="mb-12 scroll-mt-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              14. Contact Information
            </h2>

            <div className="bg-white border border-secondary-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Legal Entity</h3>
              <p className="text-secondary-700 mb-1"><strong>Datacleanup Pro</strong></p>
              <p className="text-secondary-600 text-sm">Trading as: Datacleanup.pro™</p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Registered Office</h3>
              <address className="not-italic text-secondary-700">
                71-75 Shelton Street<br />
                Covent Garden<br />
                London WC2H 9JQ<br />
                United Kingdom
              </address>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contact Emails</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-secondary-600">Legal Inquiries</p>
                  <a href="mailto:legal@datacleanup.pro" className="text-primary-600 hover:underline">legal@datacleanup.pro</a>
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Compliance Contact</p>
                  <a href="mailto:compliance@datacleanup.pro" className="text-primary-600 hover:underline">compliance@datacleanup.pro</a>
                </div>
                <div>
                  <p className="text-sm text-secondary-600">DSA Authorities Contact</p>
                  <a href="mailto:dsa-authorities@datacleanup.pro" className="text-primary-600 hover:underline">dsa-authorities@datacleanup.pro</a>
                </div>
                <div>
                  <p className="text-sm text-secondary-600">General Support</p>
                  <a href="mailto:support@datacleanup.pro" className="text-primary-600 hover:underline">support@datacleanup.pro</a>
                </div>
              </div>
            </div>
          </section>

          {/* Related Pages */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Related Legal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/legal-notice" className="p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
                <p className="font-semibold text-secondary-900">Legal Notice (EU)</p>
                <p className="text-sm text-secondary-600">Company registration & contact details</p>
              </Link>
              <Link to="/privacy" className="p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
                <p className="font-semibold text-secondary-900">Privacy Policy</p>
                <p className="text-sm text-secondary-600">How we protect your data</p>
              </Link>
              <Link to="/gdpr" className="p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
                <p className="font-semibold text-secondary-900">GDPR Compliance</p>
                <p className="text-sm text-secondary-600">Your data protection rights</p>
              </Link>
              <Link to="/dpa" className="p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
                <p className="font-semibold text-secondary-900">Data Processing Agreement</p>
                <p className="text-sm text-secondary-600">Enterprise data handling</p>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
