-- ============================================================================
-- DataCleanup Pro - Performance Indexes
-- ============================================================================
-- These indexes improve query performance for common operations
-- Run this in your Supabase SQL editor after the initial schema migration
-- ============================================================================

-- Users Table Indexes (already created in schema, but added here for reference)
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
-- CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active);
-- CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- Additional Users Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users (last_login DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_users_verified_active ON users (is_verified, is_active) WHERE is_active = TRUE;

-- Subscriptions Table Indexes (additional performance indexes)
CREATE INDEX IF NOT EXISTS idx_subscriptions_active_users ON subscriptions (user_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiring_soon ON subscriptions (current_period_end) WHERE current_period_end > NOW() AND current_period_end < NOW() + INTERVAL '7 days';
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_status ON subscriptions (plan_type, status);

-- Usage Table Indexes (for analytics and reporting)
CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage (user_id, date DESC) WHERE date >= DATE_TRUNC('month', CURRENT_DATE);
CREATE INDEX IF NOT EXISTS idx_usage_files_processed ON usage (files_processed DESC) WHERE files_processed > 0;
CREATE INDEX IF NOT EXISTS idx_usage_storage ON usage (storage_used_mb DESC) WHERE storage_used_mb > 0;

-- File Jobs Table Indexes (for job tracking and history)
CREATE INDEX IF NOT EXISTS idx_file_jobs_pending ON file_jobs (created_at DESC) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_file_jobs_processing ON file_jobs (started_at DESC) WHERE status = 'processing';
CREATE INDEX IF NOT EXISTS idx_file_jobs_completed ON file_jobs (completed_at DESC) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_file_jobs_failed ON file_jobs (created_at DESC) WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_file_jobs_user_status_date ON file_jobs (user_id, status, created_at DESC);

-- API Keys Table Indexes (for API authentication)
CREATE INDEX IF NOT EXISTS idx_api_keys_user_active ON api_keys (user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_api_keys_expires ON api_keys (expires_at) WHERE expires_at IS NOT NULL AND expires_at > NOW();

-- Sessions Table Indexes (for session management and cleanup)
CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions (user_id, expires_at) WHERE expires_at > NOW();
CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions (expires_at) WHERE expires_at <= NOW();
CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions (created_at DESC);

-- Composite Indexes for Common Queries
CREATE INDEX IF NOT EXISTS idx_users_subscriptions_lookup ON subscriptions (user_id, plan_type, status);
CREATE INDEX IF NOT EXISTS idx_file_jobs_recent_by_user ON file_jobs (user_id, created_at DESC, status);

-- ============================================================================
-- Cleanup Old Expired Sessions (Optional - Run Periodically)
-- ============================================================================
-- DELETE FROM sessions WHERE expires_at < NOW() - INTERVAL '30 days';

-- ============================================================================
-- Index Statistics (Optional - Check index usage)
-- ============================================================================
-- SELECT
--     schemaname,
--     tablename,
--     indexname,
--     idx_scan as index_scans,
--     idx_tup_read as tuples_read,
--     idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- ============================================================================
-- Table Statistics (Optional - Check table sizes)
-- ============================================================================
-- SELECT
--     schemaname,
--     tablename,
--     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
--     n_live_tup as row_count
-- FROM pg_stat_user_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
