import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: 'uuid-gerado',
        name: 'Lucas Fernandes',
        email: 'usuario@example.com',
        createdAt: '2025-09-07T20:45:12.123Z',
        updatedAt: '2025-09-07T20:45:12.123Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'E-mail já em uso'
  })
  async create(@Body() dto: CreateUserDto) {
    const data = await this.users.create(dto);
    return { data };
  }
}
