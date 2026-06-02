export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

// interfaces for github
export interface GithubTokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export interface GithubUserProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url?: string;
}

export interface GithubEmailRecord {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
