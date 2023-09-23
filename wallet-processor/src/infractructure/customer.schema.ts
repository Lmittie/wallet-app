import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Customer {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.Number,
    required: true,
  })
  public balance: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
