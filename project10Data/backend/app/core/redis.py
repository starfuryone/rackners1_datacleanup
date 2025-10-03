"""
Redis Client Configuration
Async Redis client with connection pooling, resilience, and bulk operations

Features:
- Connection pooling with automatic retry
- Context manager support (async with)
- Bulk operations (mget/mset)
- Health check endpoint
- Type-safe return values
"""

from typing import Optional, List, Dict, Any
import redis.asyncio as redis
from redis.asyncio.connection import ConnectionPool

from app.core.config import settings
from app.core.logging import logger


class RedisClient:
    """
    Async Redis client wrapper with connection pooling and resilience.

    Supports:
    - Automatic connection management
    - Context manager (async with redis_client as r: ...)
    - Bulk operations for performance
    - Health checks for monitoring
    """

    def __init__(self):
        self._pool: Optional[ConnectionPool] = None
        self._client: Optional[redis.Redis] = None

    async def connect(self) -> redis.Redis:
        """
        Create Redis connection pool and client.

        Returns:
            Connected Redis client instance

        Raises:
            Exception: If connection fails
        """
        if self._client is not None:
            return self._client

        try:
            # Create connection pool with retry on timeout
            self._pool = ConnectionPool.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                max_connections=settings.REDIS_MAX_CONNECTIONS,
                socket_connect_timeout=5,
                socket_keepalive=True,
                retry_on_timeout=True,  # Automatic retry for resilience
            )

            # Create client
            self._client = redis.Redis(connection_pool=self._pool)

            # Test connection
            await self._client.ping()
            logger.info("✅ Redis connection established")

            return self._client

        except Exception as e:
            logger.error(f"❌ Redis connection failed: {e}", exc_info=True)
            raise

    async def close(self) -> None:
        """Close Redis connection and cleanup resources"""
        if self._client:
            await self._client.close()
            self._client = None

        if self._pool:
            await self._pool.disconnect()
            self._pool = None

        logger.info("🔌 Redis connection closed")

    async def __aenter__(self):
        """Context manager entry - returns connected client"""
        return await self.connect()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit - closes connection"""
        await self.close()

    async def ping(self) -> bool:
        """
        Ping Redis to check connection.

        Returns:
            True if connection is alive
        """
        client = await self.connect()
        return await client.ping()

    async def get(self, key: str) -> Optional[str]:
        """
        Get value from Redis.

        Args:
            key: Redis key

        Returns:
            Value as string, or None if key doesn't exist
        """
        client = await self.connect()
        return await client.get(key)

    async def set(
        self,
        key: str,
        value: str,
        ex: Optional[int] = None
    ) -> bool:
        """
        Set value in Redis with optional expiration.

        Args:
            key: Redis key
            value: Value to store
            ex: Optional expiration in seconds

        Returns:
            True if successful
        """
        client = await self.connect()
        return await client.set(key, value, ex=ex)

    async def delete(self, key: str) -> int:
        """
        Delete key from Redis.

        Args:
            key: Redis key

        Returns:
            Number of keys deleted (0 or 1)
        """
        client = await self.connect()
        return await client.delete(key)

    async def exists(self, key: str) -> bool:
        """
        Check if key exists.

        Args:
            key: Redis key

        Returns:
            True if key exists
        """
        client = await self.connect()
        return await client.exists(key) > 0

    async def incr(self, key: str) -> int:
        """
        Increment key (creates with value 1 if doesn't exist).

        Args:
            key: Redis key

        Returns:
            New value after increment
        """
        client = await self.connect()
        return await client.incr(key)

    async def expire(self, key: str, seconds: int) -> bool:
        """
        Set expiration on key.

        Args:
            key: Redis key
            seconds: TTL in seconds

        Returns:
            True if expiration was set, False if key doesn't exist
        """
        client = await self.connect()
        return await client.expire(key, seconds)

    async def ttl(self, key: str) -> Optional[int]:
        """
        Get time to live for key.

        Args:
            key: Redis key

        Returns:
            TTL in seconds, -1 if key exists but has no expiry,
            -2 if key doesn't exist, None on error
        """
        client = await self.connect()
        result = await client.ttl(key)
        return result if result >= -1 else None

    async def mget(self, keys: List[str]) -> List[Optional[str]]:
        """
        Get multiple values (bulk operation).

        Args:
            keys: List of Redis keys

        Returns:
            List of values (None for missing keys)
        """
        client = await self.connect()
        return await client.mget(keys)

    async def mset(self, mapping: Dict[str, str]) -> bool:
        """
        Set multiple key-value pairs (bulk operation).

        Args:
            mapping: Dictionary of key-value pairs

        Returns:
            True if successful
        """
        client = await self.connect()
        return await client.mset(mapping)

    async def healthcheck(self) -> Dict[str, Any]:
        """
        Health check for monitoring/readiness probes.

        Returns:
            Dictionary with status and ping result
        """
        try:
            pong = await self.ping()
            return {
                "status": "ok",
                "ping": pong,
                "connected": self._client is not None
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "connected": False
            }


# Global Redis client instance
redis_client = RedisClient()
