import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { EmailSignup, SignupSchema } from './emailSignup.schema';
import { EmailSignupController } from './email-signup.controller';
import { EmailSignupService } from './email-signup.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSignup.name, schema: SignupSchema },
    ]),
  ],
  controllers: [EmailSignupController],
  providers: [EmailSignupService],
})
export class EmailSignupModule {}
