import * as passport from 'passport';
import {
  Module, MiddlewareConsumer, NestModule
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserSchema } from '../users/schemas/user.schema';
import { EmailVerificationSchema } from '../auth/schemas/emailverification.schema';
import { ForgottenPasswordSchema } from './schemas/forgottenpassword.schema';
import { ConsentRegistrySchema } from './schemas/consentregistry.schema';
import { UsersService } from '../users/users.service';
import { JWTService } from './jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'EmailVerification', schema: EmailVerificationSchema },
    { name: 'ForgottenPassword', schema: ForgottenPasswordSchema },
    { name: 'ConsentRegistry', schema: ConsentRegistrySchema }
  ])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JWTService, JwtStrategy],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(AuthController);
   }
}
