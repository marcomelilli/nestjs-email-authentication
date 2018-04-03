import * as passport from 'passport';
import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  components: [UsersService],
})
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer): void {
    consumer
      .apply(passport.authenticate('jwt', { session: false }))
      .forRoutes(
        { path: '/users', method: RequestMethod.ALL },
        { path: '/users/user/:email', method: RequestMethod.ALL }
      );
  }
}
