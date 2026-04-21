import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackService } from '../../services/track.service';
import { Track, Genre } from '../../interfaces/models';
 
@Component({
  selector: 'app-tracks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracks.component.html',
})
export class TracksComponent implements OnInit {
  tracks: Track[] = [];
  genres: Genre[] = [];
  filtered: Track[] = [];
  searchQuery = '';
  selectedGenre = '';
  showAddForm = false;
  newTrack: any = { title: '', artist: '', genre_id: null, audio_url: '', description: '' };
  error = ''; success = ''; loading = false;
  selectedFile: File | null = null;
 
  constructor(private trackService: TrackService) {}
 
  ngOnInit() {
    this.loadTracks();
    this.trackService.getGenres().subscribe(g => this.genres = g);
  }
 
  loadTracks() {
    this.trackService.getTracks().subscribe({
      next: (data) => { this.tracks = data; this.applyFilter(); },
      error: () => { this.error = 'Failed to load tracks'; }
    });
  }
 
  applyFilter() {
    this.filtered = this.tracks.filter(t => {
      const matchSearch = !this.searchQuery ||
        t.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchGenre = !this.selectedGenre || t.genre?.name === this.selectedGenre;
      return matchSearch && matchGenre;
    });
  }
 
  rate(track: Track, score: number) {
    this.trackService.rateTrack(track.id, score).subscribe({ next: () => this.loadTracks() });
  }
 
  toggleSave(track: Track) {
    if (track.is_saved) {
      this.trackService.removeSaved(track.id).subscribe(() => this.loadTracks());
    } else {
      this.trackService.saveTrack(track.id).subscribe(() => this.loadTracks());
    }
  }
 
  onFileSelect(event: any) { this.selectedFile = event.target.files[0]; }
 
  addTrack() {
    if (!this.newTrack.title || !this.newTrack.artist) { this.error = 'Title and artist are required'; return; }
    this.loading = true; this.error = '';
    const formData = new FormData();
    formData.append('title', this.newTrack.title);
    formData.append('artist', this.newTrack.artist);
    formData.append('audio_url', this.newTrack.audio_url || '');
    formData.append('description', this.newTrack.description || '');
    if (this.newTrack.genre_id) formData.append('genre_id', this.newTrack.genre_id.toString());
    if (this.selectedFile) formData.append('audio_file', this.selectedFile);
    this.trackService.createTrack(formData).subscribe({
      next: () => {
        this.success = 'Track added!'; this.showAddForm = false; this.selectedFile = null;
        this.newTrack = { title: '', artist: '', genre_id: null, audio_url: '', description: '' };
        this.loading = false; this.loadTracks();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.error = 'Failed to add track'; this.loading = false; }
    });
  }
 
  deleteTrack(id: number) {
    if (!confirm('Delete this track?')) return;
    this.trackService.deleteTrack(id).subscribe(() => this.loadTracks());
  }
 
  getRatingStars(rating?: number | null): number[] { return [1, 2, 3, 4, 5]; }
  getFilledStars(rating: number | null): number { return Math.round(rating || 0); }
}
 
