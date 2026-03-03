import { IsEmail, IsMobilePhone, IsMongoId, IsNotEmpty } from 'class-validator';
import { isValidObjectId } from 'mongoose';

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

export class UpdateContactDTO {
  @IsMongoId()
  id?: string;

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
