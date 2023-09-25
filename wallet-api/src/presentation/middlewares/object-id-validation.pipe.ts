import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: any): ObjectId {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Identifier must be ObjectId');
    }
    return value;
  }
}
