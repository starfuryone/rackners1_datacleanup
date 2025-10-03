"""
Plan limits configuration for Free, Premium, and Premium Plus tiers.

This module defines the usage limits and feature access for each subscription tier,
matching the pricing structure shown on the frontend.
"""
from typing import Dict, Any, List
from app.models.subscription import PlanType


class PlanLimits:
    """
    Configuration for subscription plan limits.

    Plans:
    - FREE: $0/forever - 10 AI messages/30 days, 4 tool uses/12 hours
    - PREMIUM (PRO): $6.30/mo - 3,000 messages/30 days, 3,000 tools/30 days
    - PREMIUM PLUS (PRO_PLUS): $12.60/mo - 10,000 messages/30 days, 10,000 tools/30 days
    """

    # Plan limits configuration
    LIMITS: Dict[PlanType, Dict[str, Any]] = {
        PlanType.FREE: {
            # AI Chat messages
            "ai_messages_per_period": 10,
            "ai_messages_reset_days": 30,

            # Tool usage
            "tool_usage_per_period": 4,
            "tool_usage_reset_hours": 12,  # Refreshes every 12 hours

            # File uploads
            "max_file_size_mb": 5,
            "max_files_per_chat": 5,

            # Features available in Free tier
            "features": [
                "data_cleaning",          # Excel/CSV data cleaning & deduplication
                "pivot_tables",           # Pivot Tables with AI — generate and modify pivots
                "formula_assistant",      # Formula Assistant AI (Excel, Sheets, LibreOffice, Airtable)
                "script_assistant",       # Scripts for Automation (VBA & Google Apps Scripts)
                "sql_assistant",          # SQL Query Assistant AI
                "regex_assistant",        # Regex Assistant AI
                "template_generator",     # Excel/Sheets Table Template Generator
            ]
        },
        PlanType.PRO: {  # Premium ($6.30/mo)
            # AI Chat messages
            "ai_messages_per_period": 3000,
            "ai_messages_reset_days": 30,

            # Tool usage
            "tool_usage_per_period": 3000,
            "tool_usage_reset_days": 30,  # Refreshes every 30 days

            # File uploads
            "max_file_size_mb": 50,
            "max_files_per_chat": 10,

            # Features available in Premium tier (same as Free, higher limits)
            "features": [
                "data_cleaning",
                "pivot_tables",
                "formula_assistant",
                "script_assistant",
                "sql_assistant",
                "regex_assistant",
                "template_generator",
            ]
        },
        PlanType.PRO_PLUS: {  # Premium Plus ($12.60/mo)
            # AI Chat messages
            "ai_messages_per_period": 10000,
            "ai_messages_reset_days": 30,

            # Tool usage
            "tool_usage_per_period": 10000,
            "tool_usage_reset_days": 30,  # Refreshes every 30 days

            # File uploads
            "max_file_size_mb": 100,
            "max_files_per_chat": 15,

            # Features available in Premium Plus tier (all features)
            "features": [
                "data_cleaning",
                "pivot_tables",
                "formula_assistant",
                "script_assistant",
                "sql_assistant",
                "regex_assistant",
                "template_generator",
            ]
        }
    }

    @classmethod
    def get_limits(cls, plan_type: PlanType) -> Dict[str, Any]:
        """
        Get all limits for a specific plan type.

        Args:
            plan_type: The plan type (FREE, PRO/Premium, PRO_PLUS/Premium Plus)

        Returns:
            Dictionary with all plan limits, defaults to FREE if plan not found
        """
        return cls.LIMITS.get(plan_type, cls.LIMITS[PlanType.FREE])

    @classmethod
    def get_ai_message_limit(cls, plan_type: PlanType) -> int:
        """
        Get AI message limit for plan.

        Returns:
            Number of AI messages allowed per period
        """
        return cls.get_limits(plan_type)["ai_messages_per_period"]

    @classmethod
    def get_tool_usage_limit(cls, plan_type: PlanType) -> int:
        """
        Get tool usage limit for plan.

        Returns:
            Number of tool uses allowed per period
        """
        return cls.get_limits(plan_type)["tool_usage_per_period"]

    @classmethod
    def get_file_size_limit(cls, plan_type: PlanType) -> int:
        """
        Get file size limit for plan.

        Returns:
            Maximum file size in megabytes
        """
        return cls.get_limits(plan_type)["max_file_size_mb"]

    @classmethod
    def get_files_per_chat_limit(cls, plan_type: PlanType) -> int:
        """
        Get maximum files per chat for plan.

        Returns:
            Maximum number of files that can be uploaded per chat session
        """
        return cls.get_limits(plan_type)["max_files_per_chat"]

    @classmethod
    def has_feature(cls, plan_type: PlanType, feature: str) -> bool:
        """
        Check if plan has access to a specific feature.

        Args:
            plan_type: The plan type to check
            feature: Feature identifier (e.g., 'data_cleaning', 'pivot_tables')

        Returns:
            True if feature is available in the plan, False otherwise
        """
        return feature in cls.get_limits(plan_type)["features"]

    @classmethod
    def get_all_features(cls, plan_type: PlanType) -> List[str]:
        """
        Get list of all features available in a plan.

        Args:
            plan_type: The plan type

        Returns:
            List of feature identifiers
        """
        return cls.get_limits(plan_type)["features"]
