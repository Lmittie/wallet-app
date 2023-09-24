import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class Customer {
  @Prop({
    type: ObjectId,
    required: true,
  })
  public _id: string;

  @Prop({
    type: String,
    required: true,
  })
  public first_name: string;

  @Prop({
    type: String,
    required: true,
  })
  public last_name: string;

  @Prop({
    type: Number,
    required: true,
  })
  public balance: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
