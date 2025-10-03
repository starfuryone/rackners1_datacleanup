// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage'

// Dashboard Pages
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage'
import FileCleanupPage from './pages/dashboard/FileCleanupPage'
import SQLGeneratorPage from './pages/dashboard/SQLGeneratorPage'
import ChatPage from './pages/chat/ChatPage'
import RegexPage from './pages/regex/RegexPage'
import {
  FormulasPage,
  PivotPage,
  ScriptsPage,
  TemplatesPage,
  UsagePage,
  BillingPage,
  SupportPage,
} from './pages/dashboard/ComingSoonPage'
import { AdminPage } from './pages/admin/AdminPage'

// Public Pages
import { HomePage } from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ContactPage } from './pages/ContactPage'
import { FAQPage } from './pages/FAQPage'

// Static Pages
import { LegalPage } from './pages/static/LegalPage'
import { PrivacyPage } from './pages/static/PrivacyPage'
import { CookiePage } from './pages/static/CookiePage'
import { DPAPage } from './pages/static/DPAPage'
import { SLAPage } from './pages/static/SLAPage'
import { GDPRPage } from './pages/static/GDPRPage'
import { LegalNoticePage } from './pages/static/LegalNoticePage'

// Route guards
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-secondary-900">404</h1>
      <p className="mt-2 text-xl text-secondary-600">Page not found</p>
      <a href="/dashboard" className="mt-4 inline-block link">
        Go to Dashboard
      </a>
    </div>
  </div>
)

function App() {
  return (
    <Routes>
      {/* Public routes (redirect to dashboard if authenticated) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Auth utility routes - no guard needed */}
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

      {/* Routes with layout */}
      <Route element={<Layout />}>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Public test routes (temporary - for demo) */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/regex" element={<RegexPage />} />

        {/* Static/Legal pages */}
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiePage />} />
        <Route path="/dpa" element={<DPAPage />} />
        <Route path="/sla" element={<SLAPage />} />
        <Route path="/gdpr" element={<GDPRPage />} />
      </Route>

      {/* Protected Dashboard routes with DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/dashboard/cleanup" element={<FileCleanupPage />} />
          <Route path="/dashboard/chat" element={<ChatPage />} />
          <Route path="/dashboard/formulas" element={<FormulasPage />} />
          <Route path="/dashboard/pivot" element={<PivotPage />} />
          <Route path="/dashboard/sql" element={<SQLGeneratorPage />} />
          <Route path="/dashboard/scripts" element={<ScriptsPage />} />
          <Route path="/dashboard/regex" element={<RegexPage />} />
          <Route path="/dashboard/templates" element={<TemplatesPage />} />
          <Route path="/dashboard/usage" element={<UsagePage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/support" element={<SupportPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>
      </Route>

      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
