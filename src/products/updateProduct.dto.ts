import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { CreateProductDTO } from './create-product.dto';

export class UpateProductDTO extends CreateProductDTO {
  @IsNotEmpty({ message: 'Product ID is required' })
  id!: string;
}

export class AddProductQuanDto {
  @IsMongoId()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}
