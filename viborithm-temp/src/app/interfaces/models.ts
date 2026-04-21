

export interface Genre {
  id: number;
  name: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  genre: Genre;
  genre_id?: number;
  cover?: string;
  audio_file?: string;
  audio_url: string;
  description: string;
  created_at: string;
  avg_rating: number | null;
  is_saved: boolean;
}

export interface Rating {
  track_id: number;
  score: number;
}

export interface SavedTrack {
  id: number;
  track: Track;
  saved_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  username: string;
  email: string;
  password: string;
}