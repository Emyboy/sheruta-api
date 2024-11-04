import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NULL = null,
}

export class UpdateUserInfoDTO {
  @IsEnum(Gender)
  @Transform(({ value }) => {
    if (!value) return value;
    return value.toLowerCase();
  })
  public gender: Gender;

  @IsString()
  @Matches(/^[0-9+()-]+$/, {
    message: 'Primary phone number is null or invalid',
  })
  @MinLength(9)
  @MaxLength(15)
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    return value.trim();
  })
  public primary_phone_number: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9+()-]+$/, {
    message: "Whats app number is null or invalid",
  })
  @MinLength(8)
  @MaxLength(15)
  @Transform(({ value }) => {
    if (!value) return value;
    return value.trim();
  })
  public whatsapp_phone_number: string;
}
