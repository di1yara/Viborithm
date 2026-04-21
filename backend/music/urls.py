from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('register/', views.register, name='register'),

    # Треки  (полный CRUD)
    path('tracks/',        views.TrackListCreateView.as_view(), name='track-list'),
    path('tracks/<int:pk>/', views.TrackDetailView.as_view(),  name='track-detail'),

    # Рейтинг
    path('tracks/rate/',   views.rate_track, name='rate-track'),

    # Сохранённые
    path('saved/',                    views.SavedTrackView.as_view(), name='saved-list'),
    path('saved/<int:track_id>/',     views.SavedTrackView.as_view(), name='saved-delete'),

    # Жанры
    path('genres/', views.GenreListView.as_view(), name='genre-list'),

    # Рекомендации
    path('recommendations/', views.RecommendationView.as_view(), name='recommendations'),

    path('logout/', views.logout, name='logout'),
]