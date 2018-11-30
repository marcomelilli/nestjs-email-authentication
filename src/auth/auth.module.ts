import * as passport from 'passport';
import {
  Module
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserSchema } from '../users/schemas/user.schema';
import { EmailVerificationSchema } from '../auth/schemas/emailverification.schema';
import { ForgottenPasswordSchema } from './schemas/forgottenpassword.schema';
import { UsersService } from '../users/users.service';
import { JWTService } from './jwt.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'EmailVerification', schema: EmailVerificationSchema },
    { name: 'ForgottenPassword', schema: ForgottenPasswordSchema }
  ])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JWTService, JwtStrategy],
})
export class AuthModule {}