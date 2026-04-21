import { Component, NgZone, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShazamService } from '../../services/shazam.service';
 
@Component({
  selector: 'app-shazam',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shazam.component.html',
  styleUrl: './shazam.component.scss'
})
export class ShazamComponent {
  state: 'idle' | 'recording' | 'loading' | 'result' | 'notfound' | 'error' = 'idle';
  result: any = null;
  errorMessage = '';
  loadingMessage = 'Please wait...';
  countdown = 10;
 
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  private countdownInterval: any;
  private timeoutHandle: any;
  private loadingInterval: any;
  private loadingSeconds = 0;
 
  constructor(private shazam: ShazamService, private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    afterNextRender(() => { console.log('Shazam component ready'); });
  }
 
  startListening() {
    this.ngZone.run(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) this.audioChunks.push(e.data); };
        this.mediaRecorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.ngZone.run(() => this.identifySong(audioBlob));
        };
        this.mediaRecorder.start();
        this.state = 'recording';
        this.countdown = 10;
        this.cdr.detectChanges();
        this.countdownInterval = setInterval(() => {
          this.countdown--;
          this.cdr.detectChanges();
          if (this.countdown <= 0) { clearInterval(this.countdownInterval); this.stopListening(); }
        }, 1000);
      } catch (err) {
        this.state = 'error'; this.errorMessage = 'Microphone access denied.'; this.cdr.detectChanges();
      }
    });
  }
 
  stopListening() {
    clearInterval(this.countdownInterval);
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') this.mediaRecorder.stop();
    this.state = 'loading'; this.cdr.detectChanges();
  }
 
  identifySong(audioBlob: Blob) {
    this.loadingSeconds = 0; this.loadingMessage = 'Please wait...';
    this.loadingInterval = setInterval(() => {
      this.loadingSeconds += 5;
      if (this.loadingSeconds === 5) this.loadingMessage = 'Analyzing audio...';
      if (this.loadingSeconds === 10) this.loadingMessage = 'Almost there...';
      if (this.loadingSeconds === 15) this.loadingMessage = 'Still working...';
      this.cdr.detectChanges();
    }, 5000);
    this.timeoutHandle = setTimeout(() => {
      clearInterval(this.loadingInterval);
      if (this.state === 'loading') { this.state = 'error'; this.errorMessage = 'Request timed out.'; this.cdr.detectChanges(); }
    }, 20000);
    this.shazam.recognizeSong(audioBlob).subscribe({
      next: (data) => {
        clearTimeout(this.timeoutHandle); clearInterval(this.loadingInterval);
        const track = data?.track;
        if (track) {
          this.result = { title: track.title, subtitle: track.subtitle, coverart: track.images?.coverart || '', genres: { primary: track.genres?.primary || '' } };
          this.state = 'result';
        } else { this.state = 'notfound'; }
        this.cdr.detectChanges();
      },
      error: (err) => {
        clearTimeout(this.timeoutHandle); clearInterval(this.loadingInterval);
        if (err.status === 403) this.errorMessage = 'Invalid API key.';
        else if (err.status === 429) this.errorMessage = 'Free plan limit reached.';
        else this.errorMessage = `Error ${err.status}: ${err.message}`;
        this.state = 'error'; this.cdr.detectChanges();
      }
    });
  }
 
  reset() {
    clearTimeout(this.timeoutHandle); clearInterval(this.loadingInterval); clearInterval(this.countdownInterval);
    this.state = 'idle'; this.result = null; this.errorMessage = ''; this.loadingMessage = 'Please wait...';
    this.cdr.detectChanges();
  }
}