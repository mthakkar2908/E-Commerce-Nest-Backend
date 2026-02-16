import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmailSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'User Id is required.' })
  userId: string;
}
