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
import { activateEmailContent, welcomeEmailContent, sendTokenEmailContent } from '@/modules/auth/auth.content';

class AuthService {
  public users = userModel;
  public userSecrets = userSecretsModel;

  public generateToken(length = 6): string {
    try {
      const buffer = crypto.randomBytes(length);

      const token = parseInt(buffer.toString('hex'), 16).toString().slice(0, length);

      const numericToken = token.padStart(6, '0');

      return numericToken;
    } catch (error) {
      throw new HttpException(500, 'Error generating token');
    }
  }

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'request is empty');

    const findUser: User = await this.users.findOne({ email: userData.email.trim().toLowerCase() });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const token = this.generateToken();
    const activationToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, token });

    await this.userSecrets.create({
      password: hashedPassword,
      user: createUserData._id,
      activation_token: activationToken,
      token,
    });

    await sendEmail({
      subject: 'Verify your email',
      // html: activateEmailContent({ activation_token: activationToken, user: createUserData }),
      to: createUserData.email.trim().toLowerCase(),
      html: sendTokenEmailContent({
        user: createUserData,
        token,
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

  public async verifyToken(token: string): Promise<void> {
    if (isEmpty(token)) throw new HttpException(400, 'request is empty');

    const findUser = await this.users.findOne({ token });
    if (!findUser) throw new HttpException(404, 'Token is invalid');

    if (!findUser?.token_expiry) throw new HttpException(400, 'Validation token has expired');

    findUser.email_verified = true;
    findUser.token = null;

    await findUser.save();

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
