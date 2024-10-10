import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@/modules/users/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@/modules/auth/auth.interface';
import { User } from '@/modules/users/users.interface';
import userModel from '@/modules/users/users.model';
import { isEmpty } from '@utils/util';
import userSecretsModel, { UserSecrets } from '@/modules/users/users-secrets/user-secrets.model';
import { sendEmail } from '@utils/email';
import { sendTokenEmailContent } from '@/modules/auth/auth.content';
import { generateOTP } from '@/utils/random';

class AuthService {
  public users = userModel;
  public userSecrets = userSecretsModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'request is empty');

    const findUser: User = await this.users.findOne({ email: userData.email.trim().toLowerCase() });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData });

    await this.userSecrets.create({
      password: hashedPassword,
      user: createUserData._id,
    });

    this.sendOTP(createUserData._id);

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; user: { email: string; _id: string } }> {
    if (isEmpty(userData)) throw new HttpException(400, 'request is empty');

    const findUser: User = await this.users.findOne({ email: userData.email.trim() });
    if (!findUser || !findUser.email_verified) throw new HttpException(409, `Invalid email or password`);

    const userSecret: UserSecrets = await this.userSecrets.findOne({ user: findUser._id }).populate('password');

    const isPasswordMatching: boolean = await compare(userData.password.trim(), userSecret.password.trim());
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return {
      cookie,
      user: {
        email: findUser.email,
        _id: findUser._id,
      },
    };
  }

  public sendOTP = async (user_id: string) => {
    const otp = generateOTP();
    const user = await this.users.findById(user_id);

    if(user){
      await sendEmail({
        subject: 'Verify your email',
        to: user.email.trim().toLowerCase(),
        html: sendTokenEmailContent({
          user: user,
          token: otp,
        }),
      });


      await this.userSecrets.findOneAndUpdate({ user: user_id }, {
        otp,
        otp_expiry: new Date(Date.now() + 15 * 60 * 1000),
      });
    } else {
      throw new HttpException(404, 'User not found');
    }
  }

  public async verifyOTP(otp: string): Promise<User> {
    if (isEmpty(otp)) throw new HttpException(400, 'request is empty');

    const userSecret = await this.userSecrets.findOne({ otp }).populate('user');
    if (!userSecret) throw new HttpException(404, 'Token is invalid');

    const findUser = await this.users.findById({ _id: userSecret.user._id });

    if (!userSecret?.otp) throw new HttpException(400, 'Validation token has expired');

    findUser.email_verified = true;
    userSecret.otp = null;

    await findUser.save();
    await userSecret.save();

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    // return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    return tokenData.token;
  }
}

export default AuthService;
