"""DRF serializers — the headless JSON shape consumed by Next.js."""

from rest_framework import serializers

from .models import Article, Author, Section


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ("name", "slug", "bio", "avatar_url")


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ("name", "slug", "kicker_color")


class ArticleListSerializer(serializers.ModelSerializer):
    """Lean payload for homepage cards."""

    author = AuthorSerializer(read_only=True)
    section = SectionSerializer(read_only=True)

    class Meta:
        model = Article
        fields = (
            "title",
            "slug",
            "dek",
            "author",
            "section",
            "hero_image_url",
            "template",
            "is_cover",
            "read_minutes",
            "published_at",
        )


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Full payload for the article page."""

    author = AuthorSerializer(read_only=True)
    section = SectionSerializer(read_only=True)

    class Meta:
        model = Article
        fields = (
            "title",
            "slug",
            "dek",
            "author",
            "section",
            "body",
            "hero_image_url",
            "hero_caption",
            "template",
            "read_minutes",
            "published_at",
        )
