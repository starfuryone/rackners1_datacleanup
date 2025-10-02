// src/pages/ContactPage.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField from '@/components/forms/FormField'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  inquiry_type: z.enum(['sales', 'support', 'partnership', 'other']),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: 'Email',
    details: ['support@datacleanup.pro', 'sales@datacleanup.pro'],
  },
  {
    icon: PhoneIcon,
    title: 'Phone',
    details: ['+44 20 1234 5678', '1-888-CLEAN-DATA'],
  },
  {
    icon: MapPinIcon,
    title: 'Address',
    details: [
      'Chatlogic Insights Ltd',
      '71-75 Shelton Street',
      'London WC2H 9JQ, UK',
    ],
  },
  {
    icon: ClockIcon,
    title: 'Business Hours',
    details: ['Monday - Friday: 9am - 6pm GMT', 'Weekend: Closed'],
  },
]

const inquiryTypes = [
  { value: 'sales', label: 'Sales & Pricing' },
  { value: 'support', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnerships' },
  { value: 'other', label: 'Other Inquiry' },
]

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiry_type: 'support',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // In a real implementation, this would call your backend API
      // await apiClient.post('/api/v1/contact', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success(
        'Message sent successfully! We\'ll get back to you within 24 hours.'
      )
      reset()
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Have a question? We're here to help. Reach out to our team and we'll
            respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form and Info Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Your Name"
                      error={errors.name?.message}
                      required
                    >
                      <input
                        {...register('name')}
                        type="text"
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </FormField>

                    <FormField
                      label="Email Address"
                      error={errors.email?.message}
                      required
                    >
                      <input
                        {...register('email')}
                        type="email"
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Company" error={errors.company?.message}>
                      <input
                        {...register('company')}
                        type="text"
                        className="input-field"
                        placeholder="Your Company (optional)"
                      />
                    </FormField>

                    <FormField
                      label="Inquiry Type"
                      error={errors.inquiry_type?.message}
                      required
                    >
                      <select {...register('inquiry_type')} className="input-field">
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField
                    label="Subject"
                    error={errors.subject?.message}
                    required
                  >
                    <input
                      {...register('subject')}
                      type="text"
                      className="input-field"
                      placeholder="How can we help you?"
                    />
                  </FormField>

                  <FormField
                    label="Message"
                    error={errors.message?.message}
                    required
                  >
                    <textarea
                      {...register('message')}
                      rows={6}
                      className="input-field"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-secondary-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-100 text-primary-600 mr-4 flex-shrink-0">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-1">
                          {info.title}
                        </h4>
                        {info.details.map((detail, index) => (
                          <p key={index} className="text-sm text-secondary-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
                <h3 className="text-lg font-bold text-secondary-900 mb-2">
                  Need Immediate Help?
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Check out our comprehensive documentation and FAQ section.
                </p>
                <a
                  href="/faq"
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  Visit FAQ
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-2">
                  Enterprise Solutions
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Need custom integrations or dedicated support? Contact our sales
                  team.
                </p>
                <a
                  href="mailto:sales@datacleanup.pro"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  sales@datacleanup.pro
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Optional - can be replaced with actual map) */}
      <div className="bg-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-secondary-200">
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <MapPinIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">
                    Interactive map would be displayed here
                  </p>
                  <p className="text-sm text-secondary-500 mt-2">
                    71-75 Shelton Street, London WC2H 9JQ, UK
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
