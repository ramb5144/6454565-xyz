"""Create a superuser non-interactively if one doesn't exist.

Reads DJANGO_SUPERUSER_USERNAME / EMAIL / PASSWORD from env.
Idempotent — safe to run on every release.
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a superuser from env vars if none exists"

    def handle(self, *args, **opts):
        User = get_user_model()
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@6454565.xyz")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not password:
            self.stdout.write("DJANGO_SUPERUSER_PASSWORD not set — skipping superuser creation.")
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(f"Superuser '{username}' already exists.")
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' created."))
