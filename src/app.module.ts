import { MongooseModule } from '@nestjs/mongoose';
import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), UsersModule, AuthModule],
  controllers: [],
  components: [],
})
export class ApplicationModule {}