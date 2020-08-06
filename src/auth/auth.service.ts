import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { User } from './user.schema';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(
    authCredentialsDto: SignUpCredentialsDto
  ): Promise<AuthResponse> {
    const { email, password, username } = authCredentialsDto;

    const emailAlreadyExists = await this.findUserByEmail(email);
    if (emailAlreadyExists) {
      throw new ConflictException(`User with email "${email}" already exists`);
    }

    const usernameAlreadyExists = await this.findUserByUsername(username);
    if (usernameAlreadyExists) {
      throw new ConflictException(`User with username "${username}" already exists`);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await this.hashPassword(password, salt);

    const user = new this.userModel({
      email,
      username,
      password: hashedPassword,
      salt
    })

    try {
      await user.save();
    } catch (error) {
      throw new Error('fail to signup');
    }

    const { accessToken, expirationDate } = this.generateAccessToken(username);

    return { accessToken, username, expirationDate, refreshToken: user.refreshToken };
  }

  async signIn(
    authCredentialsDto: SignInCredentialsDto
  ): Promise<AuthResponse> {
    const { password, username } = authCredentialsDto;
    let foundUser;

    const emailPassed = this.validateEmail(username);

    if (emailPassed) {
      foundUser = await this.userModel.findOne({ email: username });
    } else {
      foundUser = await this.userModel.findOne({ username });
    }

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hash = await this.hashPassword(password, foundUser.salt);
    const hashAccepted = hash === foundUser.password;

    if (!hashAccepted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, expirationDate } = this.generateAccessToken(username);

    return { accessToken, username, expirationDate, refreshToken: foundUser.refreshToken };
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshAccessTokenDto
  ): Promise<AuthResponse> {
    const { username, refreshToken } = refreshTokenDto;

    const foundUser = await this.userModel.findOne({ username, refreshToken });

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, expirationDate } = this.generateAccessToken(username);

    return { accessToken, username, expirationDate, refreshToken };
  }

  private generateAccessToken(username: string): { accessToken: string, expirationDate: string } {
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000).toISOString();

    return {
      accessToken,
      expirationDate
    }
  }

  private async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  private async findUserByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

export interface AuthResponse {
  accessToken: string;
  username: string;
  expirationDate: string;
  refreshToken: string;
}
