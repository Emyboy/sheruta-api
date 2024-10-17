import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsArray,
  ArrayMaxSize,
  IsOptional,
  ArrayMinSize,
  IsObject,
  IsEnum
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentType } from './flat-share-request.model';


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

  @IsObject()
  public google_location_object: Object;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  public google_location_text: string;

  @IsString()
  @IsEnum(PaymentType)
  payment_type: string;

}
export class UpdateSeekerRequestDTO {
  @IsOptional()
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
  @IsOptional()
  public service: string;

  @IsNumber()
  @Min(2000)
  @IsOptional()
  public rent: number;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  public state: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  public location: string;

  @IsObject()
  @IsOptional()
  public google_location_object: Object;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  public google_location_text: string;

  @IsString()
  @IsEnum(PaymentType)
  @IsOptional()
  payment_type: string;

}


export class CreateHostRequestDTO {
  @IsNumber()
  @IsOptional()
  public bedrooms: number;

  @IsNumber()
  @IsOptional()
  public bathrooms: number;

  @IsNumber()
  @IsOptional()
  public toilets: number;

  @IsNumber()
  @Min(2000)
  public rent: number;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  public description: string;

  @IsArray()
  @ArrayMaxSize(30)
  @IsOptional()
  public house_rules: string[];

  @IsNumber()
  @IsOptional()
  public service_charge: number;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(20)
  public image_urls: string[];

  @IsString()
  @IsOptional()
  public video_url: string;

  @IsString()
  public service: string;

  @IsString()
  @IsOptional()
  public category: string;

  @IsString()
  @IsOptional()
  public property_type: string;

  @IsString()
  @IsOptional()
  public location: string;

  @IsString()
  @IsOptional()
  public state: string;

  @IsString()
  @IsEnum(PaymentType)
  public payment_type: string;

  @IsNumber()
  @IsOptional()
  public living_rooms: number;

  @IsObject()
  public google_location_object: Object;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  public google_location_text: string;

  @IsArray()
  public amenities: string[];
}

export class UpdateHostRequestDTO {
  @IsNumber()
  @IsOptional()
  public bedrooms: number;

  @IsNumber()
  @IsOptional()
  public bathrooms: number;

  @IsNumber()
  @IsOptional()
  public toilets: number;

  @IsNumber()
  @Min(2000)
  @IsOptional()
  public rent: number;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsOptional()
  public description: string;

  @IsArray()
  @ArrayMaxSize(30)
  @IsOptional()
  public house_rules: string[];

  @IsNumber()
  @IsOptional()
  public service_charge: number;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(20)
  @IsOptional()
  public image_urls: string[];

  @IsString()
  @IsOptional()
  public video_url: string;

  @IsString()
  @IsOptional()
  public service: string;

  @IsString()
  @IsOptional()
  public category: string;

  @IsString()
  @IsOptional()
  public property_type: string;

  @IsString()
  @IsOptional()
  public location: string;

  @IsString()
  @IsOptional()
  public state: string;

  @IsString()
  @IsEnum(PaymentType)
  @IsOptional()
  public payment_type: string;

  @IsNumber()
  @IsOptional()
  public living_rooms: number;

  @IsObject()
  @IsOptional()
  public google_location_object: Object;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  public google_location_text: string;

  @IsArray()
  @IsOptional()
  public amenities: string[];
}
