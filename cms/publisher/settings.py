"""Django settings for the 6454565 publishing platform.

Mirrors The Atlantic's approach: custom Django CMS, headless API consumed by a
Next.js front-end, with edge caching in front.

Configuration is env-driven so the same code runs locally (SQLite, DEBUG=True)
and on Railway (Postgres, DEBUG=False, custom domain, whitenoise statics).
"""

import os
from pathlib import Path

import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(name: str, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.lower() in {"1", "true", "yes", "on"}


SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "dev-only-not-for-prod-replace-me",
)
DEBUG = env_bool("DJANGO_DEBUG", default=True)

# Comma-separated. Includes '*' as a fallback for first-boot on Railway before
# you point the custom domain at the service. Tighten in production.
ALLOWED_HOSTS = [h.strip() for h in os.environ.get(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1,.railway.app,.6454565.xyz",
).split(",") if h.strip()]

# Trust the proxy in front (Railway's edge, Cloudflare) so request.is_secure()
# returns True for the cert-aware CSRF middleware.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
CSRF_TRUSTED_ORIGINS = [
    o.strip() for o in os.environ.get(
        "DJANGO_CSRF_TRUSTED_ORIGINS",
        "https://*.railway.app,https://*.6454565.xyz,https://6454565.xyz",
    ).split(",") if o.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "editorial",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    # whitenoise serves collected static files in prod with proper cache headers
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "publisher.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "publisher.wsgi.application"

# DATABASE_URL is set by Railway when you attach a Postgres plugin.
# Locally, fall back to SQLite for zero-setup dev.
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    ),
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}

# CORS — allow the Vercel preview/prod origins plus localhost
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get(
        "DJANGO_CORS_ORIGINS",
        ",".join([
            "http://localhost:3030",
            "http://127.0.0.1:3030",
            "https://6454565.xyz",
            "https://www.6454565.xyz",
            "https://6454565-xyz.vercel.app",
        ]),
    ).split(",") if o.strip()
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://6454565-.*-rishis-projects-7c853a9f\.vercel\.app$",
]

# Production hardening — only when DEBUG is off.
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30  # 30 days
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = False  # opt in later
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
    X_FRAME_OPTIONS = "DENY"
