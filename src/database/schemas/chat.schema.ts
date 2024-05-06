import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ChatMessage } from './chat.message.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: ChatMessage.name }],
  })
  messages: ChatMessage[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatModelDefinition: ModelDefinition = {
  name: Chat.name,
  schema: ChatSchema,
};
