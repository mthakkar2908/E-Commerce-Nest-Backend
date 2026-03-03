import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  image?: string;

  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;
}

export class UpdateCategoryDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  image?: string;

  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;
}
