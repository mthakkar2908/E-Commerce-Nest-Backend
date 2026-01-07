import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { PrivacyPolicy, PrivacyPolicySchema } from './privacy.schema';
import { PrivacyPolicyService } from './privacy.service';
import { PrivacyPolicyController } from './privacy.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrivacyPolicy.name, schema: PrivacyPolicySchema },
    ]),
  ],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService],
})
export class PrivacyPolicyModule {}
