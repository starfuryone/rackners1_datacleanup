// src/pages/static/LegalNoticePage.tsx
import { Link } from 'react-router-dom'
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  ScaleIcon,
  GlobeEuropeAfricaIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

export function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-4">
            <ScaleIcon className="h-12 w-12 text-white" />
            <h1 className="text-4xl font-bold text-white">Legal Notice (Europe)</h1>
          </div>
          <p className="text-xl text-primary-100 max-w-3xl">
            Impressum & Regulatory Information for European Customers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Company Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            Company Information
          </h2>

          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Trademark Owner</p>
                <p className="text-lg font-semibold text-secondary-900">
                  DataCleanup Pro is a trademark of
                </p>
                <p className="text-2xl font-bold text-primary-600 mt-1">
                  Chatlogic Insights LTD
                </p>
              </div>

              <div className="border-t border-secondary-300 pt-4">
                <p className="text-sm text-secondary-600 mb-2">Registered Address</p>
                <address className="not-italic text-secondary-900 leading-relaxed">
                  71-75 Shelton Street<br />
                  Covent Garden<br />
                  London, WC2H 9JQ<br />
                  United Kingdom
                </address>
              </div>

              <div className="border-t border-secondary-300 pt-4">
                <p className="text-sm text-secondary-600 mb-2">Company Registration</p>
                <p className="text-secondary-900">
                  <strong>Registration Office:</strong> London Registration Office<br />
                  <strong>Registration Number:</strong> HRB 15593166
                </p>
              </div>

              <div className="border-t border-secondary-300 pt-4">
                <p className="text-sm text-secondary-600 mb-2">Chief Executive Officer</p>
                <p className="text-lg font-semibold text-secondary-900">
                  Frederic Desjardins
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
            <EnvelopeIcon className="h-8 w-8 text-primary-600" />
            Contact Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                General Inquiries
              </h3>
              <a
                href="mailto:info@datacleanup.pro"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
              >
                <EnvelopeIcon className="h-5 w-5" />
                info@datacleanup.pro
              </a>
              <p className="text-sm text-secondary-600 mt-2">
                For general questions and support
              </p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                Legal Contact
              </h3>
              <a
                href="mailto:legal@datacleanup.pro"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
              >
                <ScaleIcon className="h-5 w-5" />
                legal@datacleanup.pro
              </a>
              <p className="text-sm text-secondary-600 mt-2">
                For legal matters and inquiries
              </p>
            </div>
          </div>
        </section>

        {/* Online Dispute Resolution */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
            <GlobeEuropeAfricaIcon className="h-8 w-8 text-primary-600" />
            Online Dispute Resolution (ODR)
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-secondary-700 mb-4">
              <strong className="text-secondary-900">Article 14 para. 1 ODR Regulation</strong>
            </p>
            <p className="text-secondary-700 mb-4">
              The European Commission has established a platform for online dispute resolution (ODR).
              You can visit the platform at:
            </p>
            <a
              href="http://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium underline"
            >
              http://ec.europa.eu/consumers/odr
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <div className="mt-4 p-4 bg-white rounded border border-blue-300">
              <p className="text-sm text-secondary-600">
                <strong>Note:</strong> We are neither willing nor obligated to participate in a dispute
                resolution procedure before a consumer arbitration board.
              </p>
            </div>
          </div>
        </section>

        {/* EU Regulatory Contacts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
            EU Regulatory Contact Points
          </h2>

          {/* Regulation (EU) 2021/784 */}
          <div className="bg-white border border-secondary-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <DocumentTextIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Regulation (EU) 2021/784
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Contact Point According to Regulation (EU) 2021/784 of the European Parliament and of the Council
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-secondary-700">
                <strong className="text-secondary-900">Important:</strong> This email address is exclusively
                for communication purposes in accordance with Regulation (EU) 2021/784. Other requests will
                not be answered.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-secondary-600 mb-1">E-Mail</p>
                <a
                  href="mailto:compliance@datacleanup.pro"
                  className="text-primary-600 hover:text-primary-700 font-medium text-lg flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  compliance@datacleanup.pro
                </a>
              </div>
              <div>
                <p className="text-sm text-secondary-600 mb-1">Language of Communication</p>
                <p className="text-secondary-900">English</p>
              </div>
            </div>
          </div>

          {/* Regulation (EU) 2022/2065 (DSA) */}
          <div className="bg-white border border-secondary-200 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Digital Services Act (DSA) - Regulation (EU) 2022/2065
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Contact Point for Authorities According to Regulation (EU) 2022/2065
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-secondary-700">
                <strong className="text-secondary-900">For Authorities:</strong> Requests from authorities
                that are not covered under Regulation (EU) 2021/784 (see above) can be sent to the following
                email address, unless other contact channels have already been established.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-secondary-600 mb-1">E-Mail</p>
                <a
                  href="mailto:dsa-authorities@datacleanup.pro"
                  className="text-primary-600 hover:text-primary-700 font-medium text-lg flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  dsa-authorities@datacleanup.pro
                </a>
              </div>
              <div>
                <p className="text-sm text-secondary-600 mb-1">Language of Communication</p>
                <p className="text-secondary-900">English</p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Table */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            Contact Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-secondary-200 rounded-lg">
              <thead className="bg-secondary-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Email Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                <tr className="hover:bg-secondary-50">
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    General Inquiries
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a href="mailto:info@datacleanup.pro" className="text-primary-600 hover:underline">
                      info@datacleanup.pro
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-secondary-50">
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    Legal Contact
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a href="mailto:legal@datacleanup.pro" className="text-primary-600 hover:underline">
                      legal@datacleanup.pro
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-secondary-50">
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    EU Regulation 2021/784
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a href="mailto:compliance@datacleanup.pro" className="text-primary-600 hover:underline">
                      compliance@datacleanup.pro
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-secondary-50">
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    DSA Authorities (EU 2022/2065)
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a href="mailto:dsa-authorities@datacleanup.pro" className="text-primary-600 hover:underline">
                      dsa-authorities@datacleanup.pro
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-secondary-50">
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    Data Protection Officer
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a href="mailto:dpo@datacleanup.pro" className="text-primary-600 hover:underline">
                      dpo@datacleanup.pro
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Pages */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            Related Legal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/gdpr"
              className="flex items-center gap-3 p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <GlobeEuropeAfricaIcon className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-semibold text-secondary-900">GDPR Compliance</p>
                <p className="text-sm text-secondary-600">Your data protection rights</p>
              </div>
            </Link>

            <Link
              to="/privacy"
              className="flex items-center gap-3 p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <DocumentTextIcon className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-semibold text-secondary-900">Privacy Policy</p>
                <p className="text-sm text-secondary-600">How we protect your data</p>
              </div>
            </Link>

            <Link
              to="/legal"
              className="flex items-center gap-3 p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <ScaleIcon className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-semibold text-secondary-900">Terms of Service</p>
                <p className="text-sm text-secondary-600">Legal terms and conditions</p>
              </div>
            </Link>

            <Link
              to="/dpa"
              className="flex items-center gap-3 p-4 bg-white border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-semibold text-secondary-900">Data Processing Agreement</p>
                <p className="text-sm text-secondary-600">Enterprise data handling</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12">
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">
              Disclaimer
            </h3>
            <p className="text-sm text-secondary-700 leading-relaxed">
              The information provided on this page is for informational purposes and constitutes our legal
              notice (Impressum) as required by applicable European laws. Despite careful checking, we assume
              no liability for the content of external links. The operators of the linked pages are solely
              responsible for their content.
            </p>
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Questions About Our Legal Notice?
          </h2>
          <p className="text-lg text-primary-100 mb-6">
            Our legal team is here to help
          </p>
          <a
            href="mailto:legal@datacleanup.pro"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
          >
            Contact Legal Team
          </a>
        </div>
      </div>
    </div>
  )
}
