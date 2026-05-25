export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}