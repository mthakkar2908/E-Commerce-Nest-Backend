import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsNotEmpty({ message: 'Basic description about product is required' })
  about_product: string;

  @IsNotEmpty({ message: 'Price is required.' })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsNotEmpty({ message: 'Quantity required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quan: number;

  @IsOptional()
  is_fav?: boolean;
}
