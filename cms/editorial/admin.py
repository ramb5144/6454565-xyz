"""Editorial admin - the surface editors actually use to push articles."""

from django.contrib import admin

from .models import Article, Author, Section


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("order",)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "section",
        "author",
        "template",
        "is_cover",
        "is_published",
        "published_at",
    )
    list_filter = ("section", "template", "is_cover", "is_published")
    list_editable = ("is_cover", "is_published")
    search_fields = ("title", "slug", "dek")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_at"
    autocomplete_fields = ("author",)

    fieldsets = (
        ("Headline", {"fields": ("title", "slug", "dek")}),
        ("Byline", {"fields": ("author", "section", "read_minutes")}),
        ("Layout", {"fields": ("template", "hero_image_url", "hero_caption")}),
        ("Body", {"fields": ("body",), "description":
            "JSON list of typed blocks. Example: "
            '[{\"type\":\"p\",\"text\":\"...\",\"dropcap\":true},{\"type\":\"h2\",\"text\":\"Values\"}]'
        }),
        ("Promotion", {"fields": ("is_cover",)}),
        ("Publication", {"fields": ("is_published", "published_at")}),
    )
