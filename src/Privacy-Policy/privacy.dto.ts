import { IsNotEmpty } from 'class-validator';

export class PrivacyPolicyDTO {
  @IsNotEmpty()
  PrivacyPolicyText: string;
}
