import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({ example: 'https://novo-destino.com', description: 'Novo destino da URL encurtada.' })
  @IsUrl()
    destination!: string;
}
