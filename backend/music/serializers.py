from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Genre, Track, Rating, SavedTrack




class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )


class RatingSerializer(serializers.Serializer):
    track_id = serializers.IntegerField()
    score    = serializers.IntegerField(min_value=1, max_value=5)

    def validate_track_id(self, value):
        if not Track.objects.filter(id=value).exists():
            raise serializers.ValidationError("Трек не найден.")
        return value




class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Genre
        fields = ['id', 'name']


class TrackSerializer(serializers.ModelSerializer):
    genre      = GenreSerializer(read_only=True)
    genre_id   = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(), source='genre', write_only=True
    )
    avg_rating = serializers.SerializerMethodField()
    is_saved   = serializers.SerializerMethodField()

    class Meta:
        model  = Track
        fields = [
            'id', 'title', 'artist', 'genre', 'genre_id',
            'cover', 'audio_url', 'description',
            'created_at', 'avg_rating', 'is_saved',
        ]

    def get_avg_rating(self, obj):
        ratings = obj.ratings.all()
        if not ratings:
            return None
        return round(sum(r.score for r in ratings) / len(ratings), 1)

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by.filter(user=request.user).exists()
        return False


class SavedTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)

    class Meta:
        model  = SavedTrack
        fields = ['id', 'track', 'saved_at']