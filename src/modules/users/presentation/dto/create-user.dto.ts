import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Lucas Fernandes',
    description: 'Nome completo do usuário'
  })
  @IsString()
  @IsNotEmpty()
    name!: string;

  @ApiProperty({
    example: 'usuario@example.com',
    description: 'E-mail único do usuário',
    format: 'email'
  })
  @IsEmail()
    email!: string;

  @ApiProperty({
    example: 'SenhaForte@2025',
    description:
      'Senha com no mínimo 8 caracteres, incluindo: letra maiúscula, letra minúscula, número e caractere especial.',
    minLength: 8,
    format: 'password',
    writeOnly: true,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$'
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
    message:
      'Password must have at least 8 characters, including uppercase, lowercase, number and special character'
  })
    password!: string;
}
