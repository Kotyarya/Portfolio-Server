import { IsEmail, IsNotEmpty } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  message: string;
}
