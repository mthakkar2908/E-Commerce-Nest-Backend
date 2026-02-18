import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

@Schema()
export class Admin {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

export type AdminDocument = HydratedDocument<Admin>;

AdminSchema.pre('save', async function () {
  const admin = this as unknown as AdminDocument;
  if (!admin.isModified('password')) {
    return;
  }
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  admin.password = await hash(admin.password, salt);
});
