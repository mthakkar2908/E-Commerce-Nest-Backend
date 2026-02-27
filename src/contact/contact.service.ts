import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getTotalContactForms(): Promise<number> {
    return this.contactModel.find().countDocuments();
  }

  async getContactForms(): Promise<Contact[]> {
    return this.contactModel.find().exec();
  }

  async getLastContact() {
    return this.contactModel.findOne().sort({ createdAt: -1 }).exec();
  }

  async searchContacts(search: string): Promise<Contact[]> {
    if (!search) {
      return this.contactModel.find().exec();
    }

    return this.contactModel.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { mobile_no: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    });
  }

  async deleteContactForm(id: string): Promise<{
    message: string;
    deletedContact: Contact | null;
  }> {
    const deletedContact = await this.contactModel.findByIdAndDelete(id);
    return { message: 'Contact Form Deleted Successfully', deletedContact };
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

  async update(contactDTO: ContactDTO) {
    const { id, name, email, title, mobile_no, description } = contactDTO;

    if (!id) {
      throw new BadRequestException('ID is required to perform this action.');
    }

    const updatedContact = await this.contactModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        title,
        mobile_no,
        description,
      },
      { new: true },
    );

    if (!updatedContact) {
      throw new NotFoundException('Contact not found');
    }

    return {
      message: 'Contact Data Updated Successfully',
      data: updatedContact,
    };
  }
}
