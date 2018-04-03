import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ReflectMetadata,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<IResponse> {
    try {
      var users = await this.usersService.findAll();
      var usersDto = [];
      users.forEach(user => {
        usersDto.push(new UserDto(user));
      });
      return new ResponseSuccess("COMMON.SUCCESS", usersDto);
    } catch(error){
      return new ResponseError("COMMON.ERROR.GENERIC_ERROR", error);
    }
  }

  @Get('user/:email')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() params): Promise<IResponse>{
    try {
      var user =  await this.usersService.findByEmail(params.email);
      return new ResponseSuccess("COMMON.SUCCESS", new UserDto(user));
    } catch(error){
      return new ResponseError("COMMON.ERROR.GENERIC_ERROR", error);
    }
  }
  
}