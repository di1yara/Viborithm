from django.contrib import admin
from .models import Genre, Track, Rating, SavedTrack

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'artist', 'genre', 'created_at']
    list_filter = ['genre']
    search_fields = ['title', 'artist']

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'track', 'score']

@admin.register(SavedTrack)
class SavedTrackAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'track', 'saved_at']