"""Editorial domain models.

Mirrors how The Atlantic's in-house Django CMS is structured at a
conceptual level: authors write under sections, articles pick from a small
set of templates (full-bleed / classic / immersive), and editors can flip
per-article switches like cloak_enabled to attach a third-party head
script to one specific story.
"""

from django.db import models
from django.utils import timezone


class Author(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)
    kicker_color = models.CharField(
        max_length=20,
        default="#A8231F",
        help_text="Hex color for the section kicker label",
    )
    order = models.PositiveIntegerField(default=100)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name


class Article(models.Model):
    """A single piece of editorial content.

    The body field is a list of typed blocks (paragraphs and section
    headings) so editors can compose stories without writing raw HTML, and
    so the front-end can render any template variant from the same data.
    """

    TEMPLATE_CLASSIC = "classic"
    TEMPLATE_FULL_BLEED = "full-bleed"
    TEMPLATE_IMMERSIVE = "immersive"
    TEMPLATE_CHOICES = [
        (TEMPLATE_CLASSIC, "Classic - narrow column, drop cap"),
        (TEMPLATE_FULL_BLEED, "Full-bleed - large hero image"),
        (TEMPLATE_IMMERSIVE, "Immersive - dark, image-driven"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    dek = models.TextField(
        help_text="One- or two-sentence subhead shown under the headline"
    )
    author = models.ForeignKey(Author, on_delete=models.PROTECT, related_name="articles")
    section = models.ForeignKey(Section, on_delete=models.PROTECT, related_name="articles")

    body = models.JSONField(default=list, blank=True)

    hero_image_url = models.URLField(blank=True)
    hero_caption = models.CharField(max_length=240, blank=True)

    template = models.CharField(
        max_length=20,
        choices=TEMPLATE_CHOICES,
        default=TEMPLATE_CLASSIC,
        help_text="Editorial layout variant for this story",
    )

    is_cover = models.BooleanField(
        default=False,
        help_text="Promote this article to the cover-story slot on the homepage",
    )

    read_minutes = models.PositiveIntegerField(default=0)
    published_at = models.DateTimeField(default=timezone.now)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at"]
        indexes = [
            models.Index(fields=["-published_at"]),
            models.Index(fields=["is_published", "-published_at"]),
        ]

    def __str__(self) -> str:
        return self.title
