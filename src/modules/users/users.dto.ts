import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => {
    if (!value) return value;
    return value.trim().toLowerCase();
  })
  public email: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(6)
  @MaxLength(20)
  public password: string;

  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: "First name can only contain letters, spaces, and hyphens",
  })
  @Transform(({ value }) => {
    if (!value) return value;

    // value = value.toLowerCase().trim();
    value = value.trim();
    value = value.replace(/\s+/g, " ");
    // value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    value = value.split(" ")[0];

    return value;
  })
  @MinLength(2)
  @MaxLength(50)
  public first_name: string;

  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: "Last name can only contain letters, spaces, and hyphens",
  })
  @Transform(({ value }) => {
    if (!value) return value;

    // value = value.toLowerCase().trim();
    value = value.trim();
    value = value.replace(/\s+/g, " ");
    // value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    value = value.split(" ")[0];

    return value;
  })
  @MinLength(2)
  @MaxLength(50)
  public last_name: string;
}

export class UserLoginDto {
  @IsEmail()
  @Transform(({ value }) => {
    if (!value) return value;
    return value.trim().toLowerCase();
  })
  public email: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(6)
  @MaxLength(20)
  public password: string;
}

export class VerifyTokenDto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  public token: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  // @Matches(/^[a-zA-Z\s-]+$/, {
  //   message: 'First name can only contain letters, spaces, and hyphens',
  // })
  @Transform(({ value }) => {
    if (!value) return value;

    value = value.toLowerCase().trim();
    value = value.replace(/\s+/g, " ");
    // value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    value = value.split(" ")[0];

    return value;
  })
  public first_name: string;

  @IsString()
  @IsOptional()
  // @Matches(/^[a-zA-Z\s-]+$/, {
  //   message: 'First name can only contain letters, spaces, and hyphens',
  // })
  @Transform(({ value }) => {
    if (!value) return value;

    value = value.toLowerCase().trim();
    value = value.replace(/\s+/g, " ");
    // value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    value = value.split(" ")[0];

    return value;
  })
  public middle_name: string;

  @IsString()
  @IsOptional()
  // @Matches(/^[a-zA-Z\s-]+$/, {
  //   message: 'First name can only contain letters, spaces, and hyphens',
  // })
  @Transform(({ value }) => {
    if (!value) return value;

    value = value.toLowerCase().trim();
    value = value.replace(/\s+/g, " ");
    // value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    value = value.split(" ")[0];

    return value;
  })
  public last_name: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  public avatar_url: string;
}
