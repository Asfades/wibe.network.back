import { IsString } from "class-validator";

export class RefreshAccessTokenDto {
  @IsString()
  username: string;

  @IsString()
  refreshToken: string;
}