import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInAdminDTO {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
