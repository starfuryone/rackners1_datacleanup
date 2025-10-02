// src/pages/auth/LoginPage.tsx
import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import type { LoginRequest } from '@/api/generated'
import FormField from '@/components/forms/FormField'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember_me: z.boolean().optional(),
})

type FormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loginError, setLoginError] = useState<string | null>(null)

  // Get redirect from query param, fallback to dashboard
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember_me: false
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoginError(null)
      await login(data as LoginRequest)
      toast.success('Welcome back!')

      // Navigate to the original destination
      navigate(decodeURIComponent(redirectTo), { replace: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setLoginError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleGoogleLogin = () => {
    // Store redirect URL in sessionStorage for OAuth callback
    sessionStorage.setItem('oauth_redirect', redirectTo)
    // Redirect to backend OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google/login`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900">
            DataCleanup Pro
          </h1>
          <h2 className="mt-6 text-2xl font-semibold text-secondary-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8 space-y-6">
          {/* Global Error */}
          {loginError && (
            <div
              role="alert"
              className="p-4 bg-error-50 border border-error-200 rounded-lg"
            >
              <p className="text-sm text-error-800">{loginError}</p>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-secondary-300 rounded-lg shadow-sm bg-white hover:bg-secondary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-secondary-700">
                Continue with Google
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Email address"
              error={errors.email?.message}
              required
            >
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField
              label="Password"
              error={errors.password?.message}
              required
            >
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className="input"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </FormField>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  {...register('remember_me')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-secondary-700">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <p className="text-center text-xs text-secondary-500">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
