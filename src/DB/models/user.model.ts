import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  EnumGender,
  EnumRole,
  EncryptionServices,
  HashingServices,
} from 'src/common/index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    maxlength: 15,
    minlength: 3,
    trim: true,
  })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  password: string;

  @Prop({ type: String, required: true, maxlength: 11, minlength: 11 })
  phone: string;

  @Prop({ type: String, required: true, enum: Object.values(EnumGender) })
  gender: EnumGender;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(EnumRole),
    default: EnumRole.user,
  })
  role: EnumRole;

  @Prop({ type: Date, required: true })
  DOB: Date;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Boolean, default: false })
  confrimed: boolean;

  @Prop({ type: Boolean })
  isDeleted: boolean;

  @Prop({ type: [Object] })
  otp: [
    {
      otp: string;
      expire: Date;
      type: string;
    },
  ];
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('phone'))
    this.phone = await EncryptionServices.getInstance().Encryption(this.phone);
  if (this.isModified('password'))
    this.password = await HashingServices.getInstance().Hashing(this.password);
  next();
});

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
export type UserDocument = HydratedDocument<User>;
