import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailSignupDto } from './create-email-signup.dto';

export class UpdateEmailSignupDto extends PartialType(CreateEmailSignupDto) {}
