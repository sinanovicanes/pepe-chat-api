import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ChatMessage } from './chat.message.schema';
import { User } from './user.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner?: User;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: ChatMessage.name }],
  })
  messages: ChatMessage[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  users: User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatModelDefinition: ModelDefinition = {
  name: Chat.name,
  schema: ChatSchema,
};
