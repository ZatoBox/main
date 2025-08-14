from datetime import datetime
import pytz
from fastapi import Request

def get_user_timezone_from_request(request: Request):
    """
    Extracts the user's timezone from the request headers.
    If not found, defaults to 'UTC'.
    :param request:
    :return:
    """
    return request.headers.get("X-Timezone", "UTC")

def get_current_time_with_timezone(timezone_str: str = "UTC")->str:
    """
    Return user timestamp on timezone
    :param timezone_str:
    :return:
    """
    try:
        tz = pytz.timezone(timezone_str)
        now = datetime.now(tz)
        return now.isoformat()
    except:
        """Fallback to utc if invalid timezone"""
        return datetime.now(pytz.UTC).isoformat()

def convert_to_user_timezone(utc_datetime: datetime, user_timezone: str) -> str:

    try:
        user_tz = pytz.timezone(user_timezone)
        if utc_datetime.tzinfo is None:
            utc_datetime = pytz.UTC.localize(utc_datetime)
        return utc_datetime.astimezone(user_tz).isoformat()
    except:
        return utc_datetime.isoformat()