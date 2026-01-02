import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  profile_image: string;

  @Prop()
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

UserSchema.pre('save', async function () {
  const user = this as unknown as UserDocument;
  if (!user.isModified('password')) {
    return;
  }
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  user.password = await hash(user.password, salt);
});
