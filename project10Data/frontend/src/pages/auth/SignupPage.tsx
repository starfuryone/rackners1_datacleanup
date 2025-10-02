// src/pages/auth/SignupPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import FormField from '@/components/forms/FormField'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ChartBarIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const signupSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  accept_terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password']
})

type SignupFormData = z.infer<typeof signupSchema>

const passwordRequirements = [
  { label: 'At least 8 characters', test: (password: string) => password.length >= 8 },
  { label: 'One uppercase letter', test: (password: string) => /[A-Z]/.test(password) },
  { label: 'One lowercase letter', test: (password: string) => /[a-z]/.test(password) },
  { label: 'One number', test: (password: string) => /[0-9]/.test(password) },
]

export function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const password = watch('password', '')

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      await signup({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name
      })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center items-center space-x-2">
            <ChartBarIcon className="h-12 w-12 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              DataCleanup.pro
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                error={errors.first_name?.message}
                required
              >
                <input
                  {...register('first_name')}
                  type="text"
                  className="input-field"
                  placeholder="John"
                />
              </FormField>

              <FormField
                label="Last Name"
                error={errors.last_name?.message}
                required
              >
                <input
                  {...register('last_name')}
                  type="text"
                  className="input-field"
                  placeholder="Doe"
                />
              </FormField>
            </div>

            <FormField
              label="Email Address"
              error={errors.email?.message}
              required
            >
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
              />
            </FormField>

            <FormField
              label="Password"
              error={errors.password?.message}
              required
            >
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-secondary-400" />
                  )}
                </button>
              </div>
            </FormField>

            {password && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-secondary-700">
                  Password requirements:
                </p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, index) => {
                    const isMet = req.test(password)
                    return (
                      <li
                        key={index}
                        className={`text-sm flex items-center ${
                          isMet ? 'text-success-600' : 'text-secondary-500'
                        }`}
                      >
                        <span className="mr-2">{isMet ? '✓' : '○'}</span>
                        {req.label}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            <FormField
              label="Confirm Password"
              error={errors.confirm_password?.message}
              required
            >
              <div className="relative">
                <input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-secondary-400" />
                  )}
                </button>
              </div>
            </FormField>

            <FormField error={errors.accept_terms?.message}>
              <div className="flex items-center">
                <input
                  {...register('accept_terms')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label className="ml-2 block text-sm text-secondary-900">
                  I accept the{' '}
                  <Link
                    to="/legal"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </FormField>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
