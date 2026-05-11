"""API views - headless JSON for the Next.js front-end."""

from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_control
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Article
from .serializers import ArticleDetailSerializer, ArticleListSerializer


# Matches The Atlantic's response header: cache-control: s-maxage=180.
# Tells the edge (Cloudflare/Varnish) to cache for 3 minutes while letting
# browsers always revalidate.
EDGE_CACHE = cache_control(s_maxage=180, public=True)


@method_decorator(EDGE_CACHE, name="dispatch")
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only article API. Editors publish through the Django admin."""

    queryset = Article.objects.filter(is_published=True).select_related("author", "section")
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ArticleListSerializer
        return ArticleDetailSerializer

    @action(detail=False, methods=["get"], url_path="cover")
    def cover(self, request):
        """The current cover story - drives the hero slot on the homepage."""
        article = self.get_queryset().filter(is_cover=True).first()
        if article is None:
            raise Http404("No cover story set")
        return Response(ArticleDetailSerializer(article).data)
