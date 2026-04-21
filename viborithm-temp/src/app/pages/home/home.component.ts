import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TrackService } from '../../services/track.service';
import { AuthService } from '../../services/auth.service';
import { Track } from '../../interfaces/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  tracks: Track[] = [];
  featuredTracks: Track[] = [];
  activeIndex = 0;
  searchQuery = '';
  searchResults: Track[] = [];
  isSearching = false;
  error = '';

  constructor(
    public trackService: TrackService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  this.trackService.getTracks().subscribe({
    next: (data) => {
      this.tracks = data;
      this.featuredTracks = data.slice(0, 5);
    },
    error: () => {} // просто игнорируем ошибку на главной
  });
}

  

  search() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.isSearching = false;
      return;
    }
    this.isSearching = true;
    this.trackService.searchTracks(this.searchQuery).subscribe({
      next: (data) => { this.searchResults = data; },
      error: () => { this.error = 'Search failed'; }
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearching = false;
  }

  setActive(i: number) { this.activeIndex = i; }
  prev() { this.activeIndex = (this.activeIndex - 1 + this.featuredTracks.length) % this.featuredTracks.length; }
  next() { this.activeIndex = (this.activeIndex + 1) % this.featuredTracks.length; }
  goToTracks() { this.router.navigate(['/tracks']); }
  getRatingStars(rating: number | null): string {
    if (!rating) return '☆☆☆☆☆';
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }
}