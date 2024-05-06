import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from 'src/database/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([UserModelDefinition])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
