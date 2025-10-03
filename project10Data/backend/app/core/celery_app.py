"""
Celery Application Configuration
Background task processing with Redis broker and database result backend
"""

from celery import Celery
from celery.signals import task_prerun, task_postrun, task_failure, task_revoked
from kombu import Queue, Exchange
import time

from app.core.config import settings
from app.core.logging import logger

# Create Celery app with database result backend for persistence
celery_app = Celery(
    "datacleanup",
    broker=settings.CELERY_BROKER_URL,
    backend=f"db+{settings.DATABASE_URL}",  # Use database for result persistence
    include=[
        "app.tasks.ai_tasks",
        "app.tasks.data_tasks",
        "app.tasks.billing_tasks",
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes hard limit
    task_soft_time_limit=240,  # 4 minutes soft limit
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_reject_on_worker_lost=True,
    task_default_queue="default",
    # Use kombu.Queue objects for better queue management
    task_queues=[
        Queue("default", Exchange("default"), routing_key="default"),
        Queue("ai", Exchange("ai"), routing_key="ai"),
        Queue("data", Exchange("data"), routing_key="data"),
        Queue("billing", Exchange("billing"), routing_key="billing"),
    ],
    task_routes={
        "app.tasks.ai_tasks.*": {"queue": "ai"},
        "app.tasks.data_tasks.*": {"queue": "data"},
        "app.tasks.billing_tasks.*": {"queue": "billing"},
    },
    beat_schedule={
        # Example: Clean up old temp files every hour
        "cleanup-temp-files": {
            "task": "app.tasks.data_tasks.cleanup_temp_files",
            "schedule": 3600.0,  # Every hour
        },
        # Example: Process pending webhooks every 5 minutes
        "process-webhooks": {
            "task": "app.tasks.billing_tasks.process_pending_webhooks",
            "schedule": 300.0,  # Every 5 minutes
        },
    },
)


# Task lifecycle hooks with enhanced metrics
_task_start_times = {}


@task_prerun.connect
def task_prerun_handler(task_id, task, **kwargs):
    """Log task start and track execution time"""
    _task_start_times[task_id] = time.time()
    logger.info(
        f"Task started: {task.name}",
        extra={
            "task_id": task_id,
            "task_name": task.name,
            "args": kwargs.get("args", []),
        }
    )


@task_postrun.connect
def task_postrun_handler(task_id, task, retval, **kwargs):
    """Log task completion with execution metrics"""
    execution_time = time.time() - _task_start_times.pop(task_id, time.time())
    logger.info(
        f"Task completed: {task.name}",
        extra={
            "task_id": task_id,
            "task_name": task.name,
            "execution_time": f"{execution_time:.2f}s",
            "state": kwargs.get("state", "SUCCESS"),
        }
    )


@task_failure.connect
def task_failure_handler(task_id, exception, traceback, **kwargs):
    """Log task failure with detailed error information"""
    execution_time = time.time() - _task_start_times.pop(task_id, time.time())
    logger.error(
        f"Task failed: {exception}",
        extra={
            "task_id": task_id,
            "error": str(exception),
            "execution_time": f"{execution_time:.2f}s",
            "traceback": str(traceback),
        },
        exc_info=True
    )


@task_revoked.connect
def task_revoked_handler(request, terminated, signum, expired, **kwargs):
    """Log when tasks are revoked/cancelled"""
    reason = "expired" if expired else "terminated" if terminated else "revoked"
    logger.warning(
        f"Task {reason}: {request.id}",
        extra={
            "task_id": request.id,
            "task_name": request.task,
            "reason": reason,
            "signal": signum,
        }
    )


if __name__ == "__main__":
    celery_app.start()
