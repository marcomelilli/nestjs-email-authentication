import { IsString, IsInt } from 'class-validator';

export class ResetPasswordDto {
  @IsString() readonly newPassword: string;
  @IsString() readonly newPasswordToken: string;
}