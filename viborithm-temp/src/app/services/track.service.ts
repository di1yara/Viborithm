// src/app/services/track.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Track, Genre, SavedTrack } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class TrackService {
  private base = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getTracks() {
    return this.http.get<Track[]>(`${this.base}/tracks/`);
  }

  getTrack(id: number) {
    return this.http.get<Track>(`${this.base}/tracks/${id}/`);
  }

  createTrack(data: any) {
  return this.http.post<Track>(`${this.base}/tracks/`, data);
}

  updateTrack(id: number, data: Partial<Track>) {
    return this.http.put<Track>(`${this.base}/tracks/${id}/`, data);
  }

  deleteTrack(id: number) {
    return this.http.delete(`${this.base}/tracks/${id}/`);
  }

  searchTracks(query: string) {
    return this.http.get<Track[]>(`${this.base}/tracks/?search=${query}`);
  }

  rateTrack(trackId: number, score: number) {
    return this.http.post(`${this.base}/tracks/rate/`, { track_id: trackId, score });
  }

  getSaved() {
    return this.http.get<SavedTrack[]>(`${this.base}/saved/`);
  }

  saveTrack(trackId: number) {
    return this.http.post(`${this.base}/saved/`, { track_id: trackId });
  }

  removeSaved(trackId: number) {
    return this.http.delete(`${this.base}/saved/${trackId}/`);
  }

  getGenres() {
    return this.http.get<Genre[]>(`${this.base}/genres/`);
  }

  getRecommendations() {
    return this.http.get<Track[]>(`${this.base}/recommendations/`);
  }
}