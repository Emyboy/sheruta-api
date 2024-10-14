import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum, ValidateNested, ArrayMinSize, ArrayMaxSize, IsArray, Min, Max, MaxLength } from 'class-validator';
// import { Type } from 'class-transformer';
import { EmploymentStatus, GenderPreference, PaymentType, Religion } from './flat-share-profile.model';
// import { EmploymentStatus, GenderPreference, PaymentType, Religion } from './enum';

export class AgePreferenceDTO {
  @IsNumber()
  @Min(18)
  @Max(100)
  min: number;

  @IsNumber()
  @Min(18)
  @Max(100)
  max: number;
}

export class UpdateFlatShareProfileDTO {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio: string;

  @IsOptional()
  @IsNumber()
  budget: number;

  @IsOptional()
  @IsEnum(EmploymentStatus)
  employment_status: EmploymentStatus;

  @IsOptional()
  @IsString()
  facebook: string;

  @IsOptional()
  @IsString()
  instagram: string;

  @IsOptional()
  @IsString()
  linkedin: string;

  @IsOptional()
  @IsString()
  occupation: string;

  @IsOptional()
  @IsEnum(GenderPreference)
  gender_preference: GenderPreference;

  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  // @ArrayMaxSize(5)
  @IsEnum(PaymentType, { each: true })
  payment_type: PaymentType[];

  @IsOptional()
  // @Type(() => AgePreferenceDTO)
  // @ValidateNested()
  age_preference: any;

  @IsOptional()
  @IsEnum(Religion)
  religion: Religion;

  @IsOptional()
  @IsBoolean()
  seeking: boolean;

  @IsOptional()
  @IsString()
  work_industry: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  // @ArrayMaxSize(10)
  @IsString({ each: true })
  interests: string[];

  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  // @ArrayMaxSize(10)
  @IsString({ each: true })
  habits: string[];

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  tiktok: string;

  @IsOptional()
  @IsString()
  twitter: string;


}
