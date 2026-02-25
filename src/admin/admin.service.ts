import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './admin.schema';
import { Model } from 'mongoose';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async create(email: string, password: string) {
    const newAdmin = new this.adminModel({ email, password });
    return newAdmin.save();
  }

  async signIn(email: string, password: string) {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: admin._id, email: admin.email };
    const token = await this.jwtService.signAsync(payload);
    admin.token = token;
    await admin.save();

    return { token, adminId: admin._id.toString(), email: admin.email };
  }

  async logout(email: string) {
    const admin = await this.adminModel.findOne({ email });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    admin.token = undefined;
    await admin.save();

    return {
      message: 'Admin logged out successfully',
    };
  }
}
