import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailSignup } from './emailSignup.schema';
import { CreateEmailSignupDto } from './dto/create-email-signup.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailSignupService {
  constructor(
    @InjectModel(EmailSignup.name)
    private readonly emailSignupModel: Model<EmailSignup>,
    private readonly mailService: MailerService,
  ) {}

  async sendMail(email: string) {
    const message = `Thank you for sign up , we will send you latest updates soon.`;

    await this.mailService.sendMail({
      from: 'Malav Thakkar',
      to: email,
      subject: `Email Sing up for more details`,
      text: message,
    });
  }

  async create(createEmailSignupDto: CreateEmailSignupDto) {
    const { email } = createEmailSignupDto;

    const existingEmail = await this.emailSignupModel.findOne({ email });

    if (existingEmail) {
      throw new ConflictException('Email already subscribed');
    }

    const savedEmail = await this.emailSignupModel.create({ email });

    if (savedEmail) {
      await this.sendMail(email);
    }

    if (savedEmail)
      return {
        message: 'Email subscribed successfully',
        data: savedEmail,
      };
  }
}
