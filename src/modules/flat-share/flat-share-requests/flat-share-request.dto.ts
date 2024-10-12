import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min
} from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateSeekerRequestDTO {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @Transform(({ value }) => {
    if (!value) return value;

    value = value.trim().toLowerCase();
    value = value.replace(/\s+/g, ' ');
    value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return value;
  })
  public description: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => {
    if (!value) return value;

    value = value.trim().toLowerCase();
    value = value.replace(/\s+/g, '-');
    value = value.replace(/[^a-z0-9-]/g, '');

    return value;
  })
  public category: string;

  @IsString()
  public property_type: string;

  @IsString()
  public service: string;

  @IsNumber()
  @Min(2000)
  public rent: number;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  public state: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  public location: string;
}
