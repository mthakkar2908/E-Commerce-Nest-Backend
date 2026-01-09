import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact.schema';
import { ContactDTO } from './contact.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<Contact>,
    private readonly mailService: MailerService,
  ) {}

  async sendMail(
    email: string,
    name: string,
    title: string,
    mobile_no: string,
    description: string,
  ) {
    const message = `Thank you for contacting us , we will send you arrivals updates soon.

    Your Conatct Form details as per below : 

    Name : ${name}
    Email : ${email}
    Mobile no : ${mobile_no}
    Title : ${title}
    Description : ${description}
    `;

    await this.mailService.sendMail({
      from: 'Malav Thakkar',
      to: email,
      subject: `Thank you for contacting us`,
      text: message,
    });
  }

  async create(contactDTO: ContactDTO) {
    const { name, email, title, mobile_no, description } = contactDTO;

    const savedContact = await this.contactModel.create({
      name,
      email,
      title,
      mobile_no,
      description,
    });

    if (savedContact) {
      await this.sendMail(email, name, mobile_no, title, description);
    }

    if (savedContact)
      return {
        message: 'Contact form saved successfully',
        data: savedContact,
      };
  }
}
