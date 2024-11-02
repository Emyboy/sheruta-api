import { IsNumber, IsPositive, IsString } from "class-validator";


export class CreateProfilePromotionDTO {
  @IsNumber()
  @IsPositive()
  public days: number;

  @IsString()
  public pitch: string;

  @IsString()
  public service: string;
}


export class CreateRequestPromotionDTO {
  @IsNumber()
  @IsPositive()
  public days: number;

  @IsString()
  public request_id: string;
}

