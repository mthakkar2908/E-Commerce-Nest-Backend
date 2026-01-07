import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { TermsConditions, TermsConditionsSchema } from './terms.schema';
import { TermsConditionsService } from './terms.service';
import { TermsConditionsController } from './terms.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TermsConditions.name, schema: TermsConditionsSchema },
    ]),
  ],
  controllers: [TermsConditionsController],
  providers: [TermsConditionsService],
})
export class TermsConditionsModule {}
