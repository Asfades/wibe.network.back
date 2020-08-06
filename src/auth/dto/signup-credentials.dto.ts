import { MinLength, MaxLength, IsEmail } from 'class-validator';
import { SignInCredentialsDto } from './signin-credentials.dto';

export class SignUpCredentialsDto extends SignInCredentialsDto {
  @IsEmail()
  @MinLength(6)
  @MaxLength(30)
  email: string;
}