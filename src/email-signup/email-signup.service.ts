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

  async sendInviteMail(email: string) {
    const signInLink = `${process.env.FRONTEND_URL}`;

    await this.mailService.sendMail({
      to: email,
      subject: 'You are invited to join us',
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px 0;">
        <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <h2 style="color:#111827; margin-bottom:20px;">
            You’ve Been Invited! 
          </h2>

          <p style="color:#4b5563; font-size:16px; line-height:1.6;">
            An administrator has invited you to join our platform.
          </p>

          <p style="color:#4b5563; font-size:16px; line-height:1.6;">
            Click the button below to sign in and complete your enrollment.
          </p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${signInLink}" 
               style="background-color:#2563eb; color:#ffffff; padding:12px 24px; 
                      text-decoration:none; border-radius:6px; font-size:16px; 
                      font-weight:600; display:inline-block;">
              Sign In & Enroll
            </a>
          </div>

          <p style="color:#6b7280; font-size:14px; line-height:1.6;">
            If you don’t have an account yet, simply sign up after clicking the button above.
          </p>

          <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

          <p style="color:#9ca3af; font-size:13px; line-height:1.6;">
            Alternatively, you can visit our website and enter your email in the footer section,
            then click <strong>"Subscribe"</strong> to receive another invitation link.
          </p>

          <p style="color:#9ca3af; font-size:12px; margin-top:20px;">
            If you did not expect this invitation, you can safely ignore this email.
          </p>

        </div>
      </div>
    `,
    });
  }

  async create(createEmailSignupDto: CreateEmailSignupDto, type?: string) {
    const { email, userId } = createEmailSignupDto;

    const existingEmail = await this.emailSignupModel.findOne({ email });

    if (existingEmail) {
      throw new ConflictException('Email already subscribed');
    }

    if (type === 'invite') {
      await this.sendInviteMail(email);

      return {
        message: 'Invitation email sent successfully',
      };
    }

    if (!userId) {
      throw new BadRequestException(
        'User Id is Required to perform this action',
      );
    }

    const savedEmail = await this.emailSignupModel.create({
      email,
      userId,
    });

    if (savedEmail) {
      await this.sendMail(email);
    }

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
