import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShazamService {
  private apiKey = '9bd3324da4msh6f266b676d60db2p1db69djsn76312ef95323';

  constructor(private http: HttpClient) {}

  recognizeSong(audioBlob: Blob): Observable<any> {
    return this.http.post(
      'https://shazam-song-recognition-api.p.rapidapi.com/recognize/file',
      audioBlob,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/octet-stream',
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'shazam-song-recognition-api.p.rapidapi.com'
        })
      }
    );
  }
}