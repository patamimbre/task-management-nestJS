export interface JwtPayload {
  userId: string;
  username: string;
}

export interface JwtResponse {
  accessToken: string;
}
