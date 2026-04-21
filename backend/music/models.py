from django.db import models
from django.contrib.auth.models import User


class Genre(models.Model):
    name=models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Track(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True)
    cover = models.ImageField(upload_to='covers/', blank=True, null=True)
    audio_file = models.FileField(upload_to='audio/', blank=True, null=True)  
    audio_url = models.URLField(blank=True)  
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.artist} - {self.title}"
    

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='ratings')
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) 

    class Meta:
        unique_together = ('user', 'track')


class SavedTrack(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'track')