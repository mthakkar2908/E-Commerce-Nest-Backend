import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';

export class ContactDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsMobilePhone('en-IN')
  mobile_no: string;

  @IsNotEmpty()
  description: string;
}
