from rest_framework                 import generics, permissions
from rest_framework.decorators      import api_view, permission_classes
from rest_framework.response        import Response
from rest_framework.views           import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts               import get_object_or_404
from django.db.models               import Q
from .models                        import Genre, Track, Rating, SavedTrack
from .serializers                   import (
    RegisterSerializer, RatingSerializer,
    TrackSerializer, SavedTrackSerializer, GenreSerializer,
)



@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': f'Пользователь {user.username} создан!'}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Вышел успешно.'})
    except Exception:
        return Response({'error': 'Неверный токен.'}, status=400)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def rate_track(request):
    serializer = RatingSerializer(data=request.data)
    if serializer.is_valid():
        track = Track.objects.get(id=serializer.validated_data['track_id'])
        score = serializer.validated_data['score']
        rating, created = Rating.objects.update_or_create(
            user=request.user, track=track,
            defaults={'score': score},
        )
        action = 'Оценка добавлена' if created else 'Оценка обновлена'
        return Response({'message': action, 'score': score})
    return Response(serializer.errors, status=400)




class TrackListCreateView(generics.ListCreateAPIView):
    serializer_class = TrackSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = Track.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(artist__icontains=search)
            )
        return queryset


class TrackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset         = Track.objects.all()
    serializer_class = TrackSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_context(self):
        return {'request': self.request}


class SavedTrackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        saved = SavedTrack.objects.filter(user=request.user).select_related('track')
        serializer = SavedTrackSerializer(saved, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        track = get_object_or_404(Track, id=request.data.get('track_id'))
        obj, created = SavedTrack.objects.get_or_create(user=request.user, track=track)
        if created:
            return Response({'message': 'Трек сохранён!'}, status=201)
        return Response({'message': 'Уже сохранён.'}, status=200)

    def delete(self, request, track_id):
        saved = get_object_or_404(SavedTrack, user=request.user, track_id=track_id)
        saved.delete()
        return Response({'message': 'Удалено из сохранённых.'}, status=204)


class GenreListView(generics.ListAPIView):
    queryset           = Genre.objects.all()
    serializer_class   = GenreSerializer
    permission_classes = [permissions.AllowAny]


class RecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        liked_genres = (
            Rating.objects
            .filter(user=request.user, score__gte=4)
            .values_list('track__genre_id', flat=True)
            .distinct()
        )
        recommended = (
            Track.objects
            .filter(genre_id__in=liked_genres)
            .exclude(ratings__user=request.user)
            .order_by('?')[:10]
        )
        serializer = TrackSerializer(recommended, many=True, context={'request': request})
        return Response(serializer.data)