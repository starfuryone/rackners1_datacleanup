# Celery Configuration Guide

## Overview

This guide explains the enhanced Celery configuration for DataCleanup Pro, including improved reliability, monitoring, and error handling.

## Key Improvements

### 1. Database Result Backend

**Before:** Redis for both broker and result backend
**After:** Redis for broker + PostgreSQL for result backend

**Benefits:**
- Long-term result persistence (hours/days instead of seconds/minutes)
- Better audit trails for task execution
- Results survive Redis restarts
- Query task history from database

**Configuration:**
```python
celery_app = Celery(
    "datacleanup",
    broker=settings.CELERY_BROKER_URL,  # Redis
    backend=f"db+{settings.DATABASE_URL}",  # PostgreSQL
)
```

### 2. Enhanced Queue Management

**Improvement:** Using `kombu.Queue` objects instead of dict configuration

**Benefits:**
- Better queue management and flexibility
- Support for advanced features like dead-letter queues
- Easier to add priority queues in the future

**Configuration:**
```python
from kombu import Queue, Exchange

task_queues=[
    Queue("default", Exchange("default"), routing_key="default"),
    Queue("ai", Exchange("ai"), routing_key="ai"),
    Queue("data", Exchange("data"), routing_key="data"),
    Queue("billing", Exchange("billing"), routing_key="billing"),
]
```

### 3. Automatic Retry with Exponential Backoff

**All tasks include:**
- Automatic retries on failure
- Exponential backoff to avoid overwhelming external services
- Jitter to prevent thundering herd
- Custom retry limits per task type

**Example:**
```python
@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=600,  # Max 10 minutes
    retry_jitter=True,
    max_retries=5,
)
def process_ai_request(self, user_id: int, prompt: str):
    # Task implementation
    pass
```

### 4. Enhanced Logging and Metrics

**New features:**
- Execution time tracking for all tasks
- Detailed error logging with tracebacks
- Task lifecycle monitoring (start, complete, fail, revoke)
- Retry count tracking

**Example output:**
```json
{
  "task_id": "abc-123",
  "task_name": "process_ai_request",
  "execution_time": "2.34s",
  "retry_count": 1,
  "state": "SUCCESS"
}
```

### 5. Task Revocation Handling

**New signal handler:**
```python
@task_revoked.connect
def task_revoked_handler(request, terminated, signum, expired, **kwargs):
    """Log when tasks are revoked/cancelled"""
    logger.warning(f"Task {reason}: {request.id}")
```

**Use cases:**
- Graceful worker shutdown
- Task cancellation tracking
- Debugging stuck tasks

## Task Queues

### Queue Routing

Tasks are automatically routed to appropriate queues:

| Queue     | Task Type | Use Case |
|-----------|-----------|----------|
| `default` | General   | Low-priority background work |
| `ai`      | AI tasks  | LLM requests, embeddings |
| `data`    | Data processing | File uploads, exports, cleanup |
| `billing` | Payments  | Webhooks, subscriptions, invoices |

### Queue Priorities

Configure worker priorities:
```bash
# High priority for billing tasks
celery -A app.core.celery_app worker -Q billing,ai,data,default

# Dedicated AI worker
celery -A app.core.celery_app worker -Q ai --concurrency=4
```

## Task Examples

### AI Tasks
- `process_ai_request`: Process LLM requests
- `generate_embeddings`: Create text embeddings

**Retry config:** 5 retries, exponential backoff up to 10 minutes

### Data Tasks
- `cleanup_temp_files`: Clean old temporary files (scheduled hourly)
- `process_file_upload`: Process uploaded CSV/Excel files
- `export_data`: Export user data in various formats

**Retry config:** 3-5 retries, moderate backoff

### Billing Tasks
- `process_pending_webhooks`: Handle Stripe webhooks (scheduled every 5 min)
- `sync_subscription_status`: Sync user subscriptions with Stripe
- `send_invoice`: Email invoices to users
- `process_refund`: Handle refund requests

**Retry config:** 10 retries, exponential backoff up to 30 minutes (critical for payments)

## Scheduled Tasks (Celery Beat)

### Current Schedule

```python
beat_schedule={
    "cleanup-temp-files": {
        "task": "app.tasks.data_tasks.cleanup_temp_files",
        "schedule": 3600.0,  # Every hour
    },
    "process-webhooks": {
        "task": "app.tasks.billing_tasks.process_pending_webhooks",
        "schedule": 300.0,  # Every 5 minutes
    },
}
```

### Starting Celery Beat

```bash
celery -A app.core.celery_app beat --loglevel=info
```

## Running Celery Workers

### Development

```bash
# Single worker (all queues)
celery -A app.core.celery_app worker --loglevel=info

# With beat scheduler
celery -A app.core.celery_app worker --beat --loglevel=info
```

### Production

```bash
# Multiple workers with specific queues
celery -A app.core.celery_app worker -Q default,data --concurrency=4 --loglevel=info
celery -A app.core.celery_app worker -Q ai --concurrency=2 --loglevel=info
celery -A app.core.celery_app worker -Q billing --concurrency=1 --loglevel=info

# Beat scheduler (only one instance)
celery -A app.core.celery_app beat --loglevel=info
```

### Systemd Service

Create `/etc/systemd/system/celery-worker.service`:

```ini
[Unit]
Description=Celery Worker for DataCleanup Pro
After=network.target redis.service postgresql.service

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=/opt/datacleanup/backend
Environment="PATH=/opt/datacleanup/venv/bin"
ExecStart=/opt/datacleanup/venv/bin/celery -A app.core.celery_app worker \
    --loglevel=info \
    --concurrency=4 \
    --max-tasks-per-child=1000 \
    --pidfile=/var/run/celery/worker.pid \
    --logfile=/var/log/celery/worker.log

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## Monitoring with Flower

### Start Flower

```bash
celery -A app.core.celery_app flower --port=5555
```

### Access Dashboard

Navigate to: `http://localhost:5555`

**Features:**
- Real-time task monitoring
- Worker status and statistics
- Task history and details
- Retry and revoke tasks
- Queue length monitoring

## Configuration Options

### Time Limits

```python
task_time_limit=300,  # 5 minutes hard limit (kills task)
task_soft_time_limit=240,  # 4 minutes soft limit (raises exception)
```

### Acknowledgment

```python
task_acks_late=True,  # Acknowledge after task completion (safer)
worker_prefetch_multiplier=1,  # One task at a time (prevents task loss)
```

### Reject on Worker Lost

```python
task_reject_on_worker_lost=True,  # Requeue tasks if worker crashes
```

## Best Practices

### 1. Idempotent Tasks

Always design tasks to be idempotent (can be run multiple times safely):

```python
@shared_task
def process_payment(payment_id: str):
    # Check if already processed
    if Payment.query.filter_by(id=payment_id, status="processed").first():
        return {"status": "already_processed"}

    # Process payment
    # ...
```

### 2. Logging

Always log task execution:

```python
logger.info(
    f"Task started: {self.request.id}",
    extra={
        "task_id": self.request.id,
        "retry_count": self.request.retries,
    }
)
```

### 3. Error Handling

Use specific exceptions for different failure types:

```python
from celery.exceptions import Retry, Reject

@shared_task(bind=True)
def fetch_external_data(self, url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.Timeout:
        # Retry on timeout
        raise self.retry(exc=exc, countdown=60)
    except requests.HTTPError as e:
        if e.response.status_code == 404:
            # Don't retry on 404
            raise Reject(e, requeue=False)
        raise
```

### 4. Task Chaining

Chain related tasks:

```python
from celery import chain

# Process file, then send notification
result = chain(
    process_file.s(file_id),
    send_notification.s(user_id)
).apply_async()
```

### 5. Task Groups

Run tasks in parallel:

```python
from celery import group

# Process multiple files in parallel
job = group(
    process_file.s(file_id) for file_id in file_ids
).apply_async()

# Wait for all to complete
results = job.get()
```

## Troubleshooting

### Tasks Not Running

1. Check worker is running: `celery -A app.core.celery_app inspect active`
2. Check queue status: `celery -A app.core.celery_app inspect active_queues`
3. Verify Redis connection: `redis-cli ping`
4. Check logs: `/var/log/celery/worker.log`

### Tasks Stuck

1. View tasks: `celery -A app.core.celery_app inspect active`
2. Revoke stuck task: `celery -A app.core.celery_app control revoke <task-id>`
3. Check time limits are set appropriately

### Memory Issues

1. Reduce `worker_prefetch_multiplier` to 1
2. Set `max_tasks_per_child=1000` to restart workers periodically
3. Monitor with `celery -A app.core.celery_app inspect stats`

## Database Migrations

Celery will create a table for result storage. Run migrations:

```bash
# Celery creates its own tables automatically
# But you may want to create indexes for better performance
```

**Optional optimization:**
```sql
CREATE INDEX idx_celery_task_date ON celery_taskmeta(date_done);
CREATE INDEX idx_celery_task_status ON celery_taskmeta(status);
```

## Environment Variables

Required in `.env`:

```bash
# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2  # Overridden by db backend in code

# Database (for result backend)
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/datacleanup
```

## Security Considerations

1. **Task Signatures**: Only accept JSON-serializable arguments
2. **Input Validation**: Validate all task inputs
3. **Rate Limiting**: Use rate limits for external API calls
4. **Secrets**: Never log sensitive data (API keys, passwords)
5. **User Isolation**: Ensure tasks can't access other users' data

## Performance Tips

1. **Use Redis for hot data**: Cache frequently accessed data in Redis
2. **Batch operations**: Process multiple items in one task when possible
3. **Queue separation**: Use dedicated queues for different workloads
4. **Worker tuning**: Adjust concurrency based on CPU/IO workload
5. **Monitor metrics**: Use Flower or Prometheus to track performance

## Next Steps

1. **Add Prometheus metrics**: Integrate celery-exporter for metrics
2. **Dead-letter queues**: Handle poison messages
3. **Task priorities**: Implement task priorities within queues
4. **Result cleanup**: Schedule cleanup of old task results
5. **Distributed tracing**: Add OpenTelemetry for distributed tracing
