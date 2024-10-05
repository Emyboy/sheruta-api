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
import * as crypto from 'crypto';
import { sendEmail } from '@utils/email';
import { welcomeEmailContent } from '@/modules/auth/auth.content';

class AuthService {
  public users = userModel;
  public userSecrets = userSecretsModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'request is empty');

    const findUser: User = await this.users.findOne({ email: userData.email.trim().toLowerCase() });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const activationToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData });
    await this.userSecrets.create({
      password: hashedPassword,
      user: createUserData._id,
      activation_token: activationToken,
    });

    await sendEmail({
      subject: 'Verify your email',
      // html: activateEmailContent({ activation_token: activationToken, user: createUserData }),
      to: createUserData.email.trim().toLowerCase(),
      html: welcomeEmailContent({
        user: createUserData,
      }),
    });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; user: { email: string; _id: string } }> {
    if (isEmpty(userData)) throw new HttpException(400, 'request is empty');

    const findUser: User = await this.users.findOne({ email: userData.email.trim() });
    if (!findUser) throw new HttpException(409, `Invalid email or password`);

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
