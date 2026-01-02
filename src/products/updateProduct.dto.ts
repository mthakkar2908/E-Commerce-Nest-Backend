import { IsNotEmpty } from 'class-validator';
import { CreateProductDTO } from './create-product.dto';

export class UpateProductDTO extends CreateProductDTO {
  @IsNotEmpty({ message: 'Product ID is required' })
  id: string;
}
