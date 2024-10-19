import {
  IsMongoId,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class DirectMessageDTO {
  @IsMongoId()
  public conversation_id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @Matches(/^[^<>]*$/, {
    message: "Message content cannot contain HTML tags",
  })
  public content: string;
}
