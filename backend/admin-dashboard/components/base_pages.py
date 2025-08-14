from enum import Enum as enum
from translations import get_text
from components.language_detector import detect_user_language
from config import LANGUAGE_BASE

class PagesEnum(str, enum):
    USERS = "users"
    PRODUCTS = "products"
    DASHBOARD = "dashboard"
    SETTINGS = "settings"
    REPORTS = "reports"

class PageSelector:
    @staticmethod
    def get_page_options(lang=None):
        if lang is None:
            lang = LANGUAGE_BASE

        return{
            get_text("dashboard", lang): PagesEnum.DASHBOARD,
            get_text("users", lang): PagesEnum.USERS,
            get_text("products", lang): PagesEnum.PRODUCTS,
            get_text("reports", lang): PagesEnum.REPORTS,
            get_text("settings", lang): PagesEnum.SETTINGS
        }