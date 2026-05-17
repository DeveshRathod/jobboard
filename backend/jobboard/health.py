from django.http import JsonResponse
from django.db import connection

def health_check(request):
    # Check DB connectivity
    try:
        connection.ensure_connection()
        db_status = "ok"
    except Exception:
        db_status = "unavailable"

    return JsonResponse({
        "status": "ok" if db_status == "ok" else "degraded",
        "db": db_status,
        "service": "jobboard-backend"
    })