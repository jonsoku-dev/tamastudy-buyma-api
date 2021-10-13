import { OffsetPaginationQueryDto } from '../../common/dtos/offset-pagination.query.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum GetAllUsersQueryStatus {
  BLOCK = 'BLOCK',
  NON_BLOCK = 'NON_BLOCK',
}

export class GetAllUsersQueryDto extends OffsetPaginationQueryDto {
  @IsEnum(GetAllUsersQueryStatus)
  @IsOptional()
  status: GetAllUsersQueryStatus;
}
