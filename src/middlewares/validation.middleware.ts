import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import { HttpException } from "@exceptions/HttpException";
import { sanitize } from "class-sanitizer";

const validationMiddleware = (
  type: any,
  value: string | "body" | "query" | "params" = "body",
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    const obj = plainToClass(type, req[value]);

    // First sanitize the object
    sanitize(obj);

    // Then validate it
    validate(obj, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) =>
            Object.values(error.constraints)
          ).join(", ");
          next(new HttpException(400, message));
        } else {
          // Replace the request's value with the sanitized and validated object
          req[value] = obj;
          next();
        }
      });
  };
};

export default validationMiddleware;
