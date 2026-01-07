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

  async create(termsDTO: TermsConditionsDTO) {
    const { TermsConditionsText } = termsDTO;

    const savedTermsText = await this.termsModel.create({
      TermsConditionsText,
    });

    if (savedTermsText)
      return {
        message: 'Text Added successfully',
        data: savedTermsText,
      };
  }

  async getTermsData() {
    const termsData = await this.termsModel.find();
    return termsData;
  }
}
