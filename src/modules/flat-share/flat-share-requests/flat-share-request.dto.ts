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

  // @IsString()
  // @IsOptional()
  // public property_type: string;

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


export class CreateHostRequestDTO {
  @IsNumber()
  // @Min(1)
  public bedrooms: number;

  // @IsNumber()
  // // @Min(1)
  // @IsOptional()
  // public bathrooms: number;

  @IsNumber()
  // @Min(1)
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
  public house_rules: string[];

  // @IsEnum(AvailabilityStatus)
  // public availability_status: AvailabilityStatus;

  @IsNumber()
  @Min(0)
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
}
