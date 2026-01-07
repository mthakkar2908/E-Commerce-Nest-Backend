import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmailSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
