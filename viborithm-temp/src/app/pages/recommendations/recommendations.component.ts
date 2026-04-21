import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrackService } from '../../services/track.service';
import { Track } from '../../interfaces/models';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recommendations.component.html',
})
export class RecommendationsComponent implements OnInit {
  tracks: Track[] = [];
  loading = true;

  constructor(private trackService: TrackService) {}

  ngOnInit() {
    this.trackService.getRecommendations().subscribe({
      next: (data) => { this.tracks = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}