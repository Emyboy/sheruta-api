import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateLocationsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => {
    if (!value) return value;
    return value.trim().toLowerCase();
  })
  public name: string;

  @IsOptional()
  @IsBoolean()
  public is_published: boolean;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => {
    if (!value) return value;
    return value.trim().toLowerCase().replace(/\s+/g, "-");
  })
  public slug: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  public state: string;

  @IsOptional()
  @IsBoolean()
  public has_group: boolean;

  @IsOptional()
  @IsString()
  public image_url: string;

  @IsOptional()
  @IsString()
  public longitude: string;

  @IsOptional()
  @IsString()
  public latitude: string;
}
