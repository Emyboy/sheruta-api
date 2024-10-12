import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserSettingsDTO {
  @IsOptional()
  @IsBoolean()
  receive_marketing_updates: boolean;

  @IsOptional()
  @IsBoolean()
  receive_platform_updates: boolean;

  @IsOptional()
  @IsBoolean()
  hide_profile: boolean;

  @IsOptional()
  @IsBoolean()
  hide_phone_number: boolean;
}
