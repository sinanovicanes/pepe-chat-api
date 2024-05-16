import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Chat } from './chat.schema';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  avatar: string;

  @Prop({})
  @Exclude()
  password: string;

  @Prop({ default: 'local' })
  authStrategy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Chat.name }])
  chats: Chat[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModelDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
