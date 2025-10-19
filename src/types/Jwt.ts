export type JWTPayload = {
    iss: string;
    sub: string;
    exp: number;
    iat: number;
    scope: string;
}