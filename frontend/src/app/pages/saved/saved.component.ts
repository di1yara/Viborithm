import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrackService } from '../../services/track.service';
import { SavedTrack } from '../../interfaces/models';
 
@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './saved.component.html',
})
export class SavedComponent implements OnInit {
  saved: SavedTrack[] = [];
 
  constructor(private trackService: TrackService) {}
 
  ngOnInit() { this.trackService.getSaved().subscribe(data => this.saved = data); }
 
  remove(trackId: number) {
    this.trackService.removeSaved(trackId).subscribe(() => {
      this.saved = this.saved.filter(s => s.track.id !== trackId);
    });
  }
}
