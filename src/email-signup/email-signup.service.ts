import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async deleteMail(email: string) {
    const message = `Subscribe this channel to get new arrivals first`;

    await this.mailService.sendMail({
      from: 'Malav Thakkar',
      to: email,
      subject: `Unsubscribe this channel`,
      text: message,
    });
  }

  async findByUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    const data = await this.emailSignupModel.find({ userId });

    return {
      message: 'User email data fetched successfully',
      data,
    };
  }

  async findAll(): Promise<EmailSignup[]> {
    return this.emailSignupModel
      .find()
      .populate('userId', 'name email profile_image')
      .exec();
  }

  async create(createEmailSignupDto: CreateEmailSignupDto) {
    const { email, userId } = createEmailSignupDto;

    const existingEmail = await this.emailSignupModel.findOne({ email });

    if (existingEmail) {
      throw new ConflictException('Email already subscribed');
    }
    if (!userId) {
      throw new BadRequestException(
        'User Id is Required to perform this action',
      );
    }

    const savedEmail = await this.emailSignupModel.create({ email, userId });

    if (savedEmail) {
      await this.sendMail(email);
    }

    if (savedEmail)
      return {
        message: 'Email subscribed successfully',
        data: savedEmail,
      };
  }

  async delete(createEmailSignupDto: CreateEmailSignupDto) {
    const { email, userId } = createEmailSignupDto;
    const emailIsThere = await this.emailSignupModel.findOne({ email });

    if (!emailIsThere) {
      throw new NotFoundException('Email not found');
    }

    if (!userId) {
      throw new BadRequestException(
        'User id is required to perform this action',
      );
    }

    const deleteEmail = await this.emailSignupModel.deleteOne({ email });
    if (deleteEmail) {
      await this.deleteMail(email);
    }
    if (deleteEmail)
      return {
        message: 'Email Unsubscribed.',
        data: deleteEmail,
      };
  }
}
