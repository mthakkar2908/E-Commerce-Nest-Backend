import { IsEmail, IsMongoId, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsMongoId({ message: 'Invalid user id format' })
  userId: string;

  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  post_description: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
}
