// src/api/generated.ts
// This file contains type-safe API client methods
// In a real project, this would be auto-generated from OpenAPI spec

import { apiClient, handleApiError } from './client'

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: number
  email: string
  first_name?: string | null
  last_name?: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

export interface SignupRequest {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface OAuthCallbackRequest {
  code: string
  state: string | null
}

export interface FormulaRequest {
  description: string
  spreadsheet_type: 'excel' | 'google_sheets'
  sample_data?: string
  cell_range?: string
}

export interface FormulaResponse {
  formula: string
  explanation: string
  confidence_score: number
  provider_used: string
}

export interface SQLRequest {
  description: string
  database_type: 'postgresql' | 'mysql' | 'sqlite' | 'sqlserver'
  table_info?: string
  sample_data?: string
}

export interface SQLResponse {
  query: string
  explanation: string
  confidence_score: number
  provider_used: string
  database_type: string
}

export interface RegexRequest {
  description: string
  language: 'javascript' | 'python' | 'java' | 'php' | 'ruby'
  test_string?: string
  flags?: string
}

export interface RegexResponse {
  pattern: string
  explanation: string
  confidence_score: number
  provider_used: string
  language: string
  test_results?: Array<{
    input: string
    matched: boolean
    matches?: string[]
  }>
}

export interface InsightsRequest {
  data_description: string
  analysis_type: 'summary' | 'trends' | 'anomalies' | 'predictions' | 'correlations'
  focus_areas?: string
}

export interface InsightsResponse {
  summary: string
  key_findings: string[]
  recommendations: string[]
  confidence_score: number
  provider_used: string
  analysis_type: string
  statistics?: Record<string, any>
  data_quality_issues?: string[]
}

export interface UsageStats {
  formulas_used: number
  formulas_limit: number | null
  sql_queries_used: number
  sql_queries_limit: number | null
  regex_patterns_used: number
  regex_patterns_limit: number | null
  insights_generated: number
  insights_limit: number | null
}

// ============================================================================
// API Methods
// ============================================================================

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/signup', data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/refresh')
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  oauthCallback: async (data: OAuthCallbackRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/google/callback', data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}

export const assistantApi = {
  generateFormula: async (data: FormulaRequest): Promise<FormulaResponse> => {
    try {
      const response = await apiClient.post('/assistant/formula', data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  generateSQL: async (data: SQLRequest): Promise<SQLResponse> => {
    try {
      const response = await apiClient.post('/assistant/sql', data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  generateRegex: async (data: RegexRequest): Promise<RegexResponse> => {
    try {
      const response = await apiClient.post('/assistant/regex', data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  generateInsights: async (formData: FormData): Promise<InsightsResponse> => {
    try {
      const response = await apiClient.post('/assistant/insights', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}

export const usageApi = {
  getUsageStats: async (): Promise<UsageStats> => {
    try {
      const response = await apiClient.get('/usage/stats')
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
