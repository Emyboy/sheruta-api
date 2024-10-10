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
import { passwordResetEmailContent, sendTokenEmailContent, welcomeEmailContent } from '@/modules/auth/auth.content';
import { generateOTP } from '@/utils/random';
import crypto from 'crypto';

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

    this.sendOTP(createUserData.email);

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; user: { email: string; _id: string } }> {
    if (isEmpty(userData)) throw new HttpException(400, 'request is empty');

    const findUser: User = await this.users.findOne({ email: userData.email.trim() });
    if (!findUser || !findUser.email_verified) throw new HttpException(409, `Invalid email or password`);

    const userSecret: UserSecrets = await this.userSecrets.findOne({ user: findUser._id }).populate('password');

    const isPasswordMatching: boolean = await compare(userData.password.trim(), userSecret.password.trim());
    if (!isPasswordMatching) throw new HttpException(409, 'Incorrect email or password');

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

  public sendOTP = async (email: string) => {
    const otp = generateOTP();
    const user = await this.users.findOne({ email: email?.toLocaleLowerCase()?.trim() });

    if (user) {
      await this.userSecrets.findOneAndUpdate({ user: user._id }, {
        otp,
      });

      await sendEmail({
        subject: 'Verify your email',
        to: user.email.trim().toLowerCase(),
        html: sendTokenEmailContent({
          user: user,
          token: otp,
        }),
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

    sendEmail({
      subject: 'Welcome to the Sheruta Community',
      to: findUser.email.trim().toLowerCase(),
      html: welcomeEmailContent({
        user: findUser,
      }),
    })

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

  public async requestPasswordReset(email: string){
    const user = await this.users.findOne({ email: email?.toLocaleLowerCase()?.trim() });
    const reset_token = crypto.randomBytes(20).toString('hex');

    if (user) {
      await this.userSecrets.findOneAndUpdate({ user: user._id }, {
        reset_token
      });

      await sendEmail({
        subject: 'Password Reset',
        to: user.email.trim().toLowerCase(),
        html: passwordResetEmailContent({
          token: reset_token,
          user: user
        }),
      });
    } else {
      throw new HttpException(404, 'User not found');
    }
  }

  public async resetPassword(reset_token: string, password: string){
    const userSecret = await this.userSecrets.findOne({ reset_token }).populate('user');

    if (!userSecret) throw new HttpException(404, 'Token is invalid');

    const user = await this.users.findById({ _id: userSecret.user._id });
    const hashedPassword = await hash(password, 10);

    userSecret.reset_token = null;
    userSecret.password = hashedPassword;

    await userSecret.save();
    await user.save();

    return user;
  }
}

export default AuthService;
