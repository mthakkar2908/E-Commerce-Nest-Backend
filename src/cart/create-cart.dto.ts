import {
  IsMongoId,
  IsNumber,
  ValidateNested,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class AddMultiplsCarts {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export class AddQuantityDTO {
  @IsMongoId()
  @IsNotEmpty({ message: 'Cart Id is required.' })
  cartId: string;

  @IsMongoId()
  @IsNotEmpty({ message: 'Product Id is required.' })
  productId: string;

  @IsNotEmpty({ message: 'Qunaity nit empty' })
  quantity: number;
}
