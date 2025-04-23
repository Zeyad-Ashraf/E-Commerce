import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { confrimDto, LoginDto, UserDto } from './dto/userDto';
import { AuthRepoServices } from 'src/DB';
import {
  HashingServices,
  TokenServices,
  EnumRole,
  sendEmailService,
} from 'src/common/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly authReop: AuthRepoServices,
    private readonly hashingServices: HashingServices,
    private readonly tokenServices: TokenServices,
  ) {}

  async SignUpService(body: UserDto): Promise<object> {
    const { email, password, name, phone, gender, DOB, address } = body;
    const findUser = await this.authReop.findOne({ email });
    if (findUser) throw new ConflictException('User already exists');
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpire = new Date(Date.now() + 1000 * 60 * 10);
    const user = await this.authReop.createNewUser({
      email,
      password,
      name,
      phone,
      gender,
      DOB,
      address,
      otp: [
        {
          otp: await this.hashingServices.Hashing(otp + ''),
          expire: otpExpire,
          type: 'confirmEmail',
        },
      ],
    });
    await sendEmailService({
      to: email,
      subject: 'Confirm your email',
      html: `${otp}`,
    });
    return { message: 'done', user };
  }

  async ConfrimEmailService(body: confrimDto): Promise<object> {
    const { email, code } = body;
    if (!email || !code)
      throw new BadRequestException('Email and code are required');
    const findUser = await this.authReop.findOne({
      email,
      confrimed: false,
    });
    if (!findUser)
      throw new NotFoundException('User not found or already confirmed');

    const findOtp = findUser.otp.find((item) => item.type === 'confirmEmail');
    if (
      !findOtp ||
      !(
        (await this.hashingServices.Comparing(code, findOtp.otp)) ||
        findOtp.expire < new Date()
      )
    )
      throw new BadRequestException('Invalid code');

    await this.authReop.findOneAndUpdate(
      {
        email,
      },
      {
        confrimed: true,
        $unset: {
          otp: '',
        },
      },
    );
    return { message: 'done' };
  }

  async LoginService(body: LoginDto): Promise<object> {
    const { email, password } = body;
    if (!email || !password)
      throw new BadRequestException('Email and password are required');
    const findUser = await this.authReop.findOne({
      email,
      confrimed: true,
    });
    if (!findUser) throw new NotFoundException('invalid email or password');
    if (!(await this.hashingServices.Comparing(password, findUser.password)))
      throw new BadRequestException('invalid email or password');
    let secret: string | undefined = undefined;
    if (findUser.role === EnumRole.admin)
      secret = process.env.JWT_SECRET_ACCESS_ADMIN;
    else if (findUser.role === EnumRole.user)
      secret = process.env.JWT_SECRET_ACCESS_USER;
    else throw new BadRequestException('Invalid role');
    const token = await this.tokenServices.GenerateToken(
      {
        id: findUser._id,
        email: findUser.email,
      },
      {
        expiresIn: process.env.JWT_SECRET_EXP,
        secret,
      },
    );
    return { message: 'done', token };
  }

  getProfileService(req: Request): object {
    if (!req['user'])
      throw new BadRequestException('Invalid token or user not found');
    return { message: 'done', user: req['user'] as object };
  }
}
