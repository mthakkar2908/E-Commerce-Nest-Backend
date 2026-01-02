import { IsNotEmpty } from 'class-validator';
import { CreateOrderDTO } from './create-order.dto';

export class UpdateOrderDTO extends CreateOrderDTO {
  @IsNotEmpty({ message: 'Id is required.' })
  id: string;
}
