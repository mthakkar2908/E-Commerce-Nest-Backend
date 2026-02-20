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

  async createOrUpdate(privacyDTO: PrivacyPolicyDTO) {
    const { PrivacyPolicyText } = privacyDTO;

    const existingPrivacy = await this.privacyModel.findOne();

    if (existingPrivacy) {
      existingPrivacy.PrivacyPolicyText = PrivacyPolicyText;
      await existingPrivacy.save();

      return {
        message: 'Privacy Policy updated successfully',
        data: existingPrivacy,
      };
    }

    const newPrivacy = await this.privacyModel.create({
      PrivacyPolicyText,
    });

    return {
      message: 'Privacy Policy created successfully',
      data: newPrivacy,
    };
  }

  async getPrivacyText() {
    const privacyData = await this.privacyModel.find();
    return privacyData;
  }

  async deletePrivacy(id: string) {
    const deletedPrivacy = await this.privacyModel.findByIdAndDelete(id);
    return { message: 'Privacy Policy Deleted', deletedPrivacy };
  }
}
