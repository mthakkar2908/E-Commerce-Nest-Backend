import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivacyPolicy } from './privacy.schema';
import { PrivacyPolicyDTO } from './privacy.dto';

@Injectable()
export class PrivacyPolicyService {
  constructor(
    @InjectModel(PrivacyPolicy.name)
    private readonly privacyModel: Model<PrivacyPolicy>,
  ) {}

  async create(privacyDTO: PrivacyPolicyDTO) {
    const { PrivacyPolicyText } = privacyDTO;

    const savedPrivacyText = await this.privacyModel.create({
      PrivacyPolicyText,
    });

    if (savedPrivacyText)
      return {
        message: 'Text Added successfully',
        data: savedPrivacyText,
      };
  }

  async getPrivacyText() {
    const privacyData = await this.privacyModel.find();
    return privacyData;
  }
}
