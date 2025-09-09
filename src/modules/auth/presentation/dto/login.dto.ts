import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'E-mail do usuário cadastrado',
    format: 'email'
  })
  @IsEmail()
    email!: string;

  @ApiProperty({
    example: 'SenhaDoUsuario123!',
    description:
      'Senha definida no cadastro. Precisa seguir o mesmo padrão de complexidade: mínimo 8 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial.',
    minLength: 8,
    format: 'password',
    writeOnly: true
  })
  @IsString()
  @MinLength(8)
    password!: string;
}
