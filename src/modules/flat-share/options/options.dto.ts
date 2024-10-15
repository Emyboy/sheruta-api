import { IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class OptionsDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => {
    if (!value) return value;

    value = value.trim();
    value = value.replace(/\s+/g, ' ');
    value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return value;
  })
  public name: string;

  @IsBoolean()
  public is_published: boolean;

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
  public slug: string;
}
