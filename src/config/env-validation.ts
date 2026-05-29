import * as Joi from "joi";

export const envValidationSchema = Joi.object({
	PORT: Joi.number().default(3000),
	CORS_ORIGIN: Joi.string().required(),
	DATABASE_URL: Joi.string().required(),
});
