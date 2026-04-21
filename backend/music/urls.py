from django.urls import path
from . import views

urlpatterns = [

    path('register/', views.register, name='register'),

    
    path('tracks/',        views.TrackListCreateView.as_view(), name='track-list'),
    path('tracks/<int:pk>/', views.TrackDetailView.as_view(),  name='track-detail'),

  
    path('tracks/rate/',   views.rate_track, name='rate-track'),

   
    path('saved/',                    views.SavedTrackView.as_view(), name='saved-list'),
    path('saved/<int:track_id>/',     views.SavedTrackView.as_view(), name='saved-delete'),

 
    path('genres/', views.GenreListView.as_view(), name='genre-list'),

  
    path('recommendations/', views.RecommendationView.as_view(), name='recommendations'),

    path('logout/', views.logout, name='logout'),
]