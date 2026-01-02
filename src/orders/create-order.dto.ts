import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDTO {
  @IsMongoId({ message: 'Invalid product id format' })
  @IsNotEmpty({ message: 'Product Id is required.' })
  product_id: string;

  @IsMongoId({ message: 'Invalid user id format' })
  @IsNotEmpty({ message: 'User id is required.' })
  user_id: string;

  @IsNotEmpty({ message: "User's First Name is required." })
  user_first_name: string;

  @IsNotEmpty({ message: "User's Last Name is required." })
  user_last_name: string;

  @IsNotEmpty({ message: 'Product name is required' })
  product_name: string;

  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsNotEmpty({ message: 'status is required' })
  status: string;

  @IsNotEmpty({ message: 'Address is required.' })
  address: string;

  @IsNotEmpty({ message: 'Mobile no is required.' })
  @IsNumber({}, { message: 'Mobile no must be a number' })
  mobile_no: number;

  @IsNotEmpty({ message: 'price is required.' })
  @IsNumber({}, { message: 'Price must be a number' })
  total_price: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  product_quan: number;
}
