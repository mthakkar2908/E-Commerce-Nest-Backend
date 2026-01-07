import { IsNotEmpty } from 'class-validator';

export class TermsConditionsDTO {
  @IsNotEmpty()
  TermsConditionsText: string;
}
