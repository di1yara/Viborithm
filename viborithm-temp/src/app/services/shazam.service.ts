import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShazamService {
  private apiToken = 'd53f999f593292f750f37cd3baa4a670';

  constructor(private http: HttpClient) {}

  recognizeSong(audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('api_token', this.apiToken);
    formData.append('return', 'spotify,apple_music');

    return this.http.post('https://api.audd.io/', formData);
  }
}