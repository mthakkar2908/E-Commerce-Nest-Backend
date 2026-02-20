import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TermsConditions } from './terms.schema';
import { TermsConditionsDTO } from './terms.dto';

@Injectable()
export class TermsConditionsService {
  constructor(
    @InjectModel(TermsConditions.name)
    private readonly termsModel: Model<TermsConditions>,
  ) {}

  async createOrUpdate(termsDTO: TermsConditionsDTO) {
    const { TermsConditionsText } = termsDTO;

    const existingTermsData = await this.termsModel.findOne();

    if (existingTermsData) {
      existingTermsData.TermsConditionsText = TermsConditionsText;
      await existingTermsData.save();

      return {
        message: 'Terms & Condition data updated.',
        data: existingTermsData,
      };
    }

    const savedTermsText = await this.termsModel.create({
      TermsConditionsText,
    });

    return {
      message: 'Text Added successfully',
      data: savedTermsText,
    };
  }

  async getTermsData() {
    const termsData = await this.termsModel.find();
    return termsData;
  }

  async deleteTerms(id: string) {
    const deletedTerms = await this.termsModel.findByIdAndDelete(id);
    return { message: 'Terms & Condition data deleted', deletedTerms };
  }
}
