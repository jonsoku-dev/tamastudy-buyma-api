import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class OffsetPaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  offset: number;
}
