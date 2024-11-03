import { IsString } from "class-validator";

export class CreateReservationDTO {
  @IsString()
  public request_id: string;

  @IsString()
  public days: string;
}
