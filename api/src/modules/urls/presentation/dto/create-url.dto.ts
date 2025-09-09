import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://google.com.br', description: 'URL de destino' })
  @IsUrl()
  @IsUrl(
    { require_protocol: true },
    { message: 'Destination must be a valid URL including http/https' }
  )
  @MaxLength(2048, { message: 'URL must be at most 2048 characters long' })
    destination: string;
}
