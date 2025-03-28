const Joi = require("joi");

exports.signUpSchema = Joi.object({
   firstName: Joi.string().min(3).max(60).required().messages({
      "string.base": "firstName mus be a string",
      "string.empty": "firstName can not be empty",
      "string.min": "firstName must be atleast 6 characters",
      "any.required": "firstName is required",
   }),
   lastName: Joi.string().min(3).max(60).required().messages({
      "string.base": "lastName mus be a string",
      "string.empty": "lastName can not be empty",
      "string.min": "lastName must be atleast 6 characters",
      "any.required": "lastName is required",
   }),
   email: Joi.string()
      .min(6)
      .max(60)
      .required()
      .email({
         tlds: { allow: ["com", "net"] },
      })
      .messages({
         "string.base": "Email must be a string.",
         "string.empty": "Email cannot be empty.",
         "string.min": "Email must be at least 6 characters long.",
         "string.max": "Email cannot exceed 60 characters.",
         "string.email": "Email must be a valid email address.",
         "any.required": "Email is required.",
      }),
   password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
      .messages({
         "string.pattern.base":
            "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
         "any.required": "Password is required.",
      }),
});

exports.signInSchema = Joi.object({
   email: Joi.string()
      .min(6)
      .max(60)
      .required()
      .email({
         tlds: { allow: ["com", "net"] },
      })
      .messages({
         "string.base": "Email must be a string.",
         "string.empty": "Email cannot be empty.",
         "string.min": "Email must be at least 6 characters long.",
         "string.max": "Email cannot exceed 60 characters.",
         "string.email": "Email must be a valid email address.",
         "any.required": "Email is required.",
      }),
   password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
      .messages({
         "string.pattern.base":
            "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
         "any.required": "Password is required.",
      }),
});

exports.emailverifySchema = Joi.object({
   email: Joi.string()
      .min(6)
      .max(60)
      .required()
      .email({
         tlds: { allow: ["com", "net"] },
      })
      .messages({
         "string.base": "Email must be a string.",
         "string.empty": "Email cannot be empty.",
         "string.min": "Email must be at least 6 characters long.",
         "string.max": "Email cannot exceed 60 characters.",
         "string.email": "Email must be a valid email address.",
         "any.required": "Email is required.",
      }),
   code: Joi.string()
      .length(6)
      .required()
      .pattern(/^\d{6}$/)
      .messages({
         "string.base": "Verification code must be a string.",
         "string.empty": "Verification code cannot be empty.",
         "string.length": "Verification code must be exactly 6 digits.",
         "string.pattern.base": "Verification code must contain only digits.",
         "any.required": "Verification code is required.",
      }),
});

exports.emailValidateSchema = Joi.object({
   email: Joi.string()
      .min(6)
      .max(60)
      .required()
      .email({
         tlds: { allow: ["com", "net"] },
      })
      .messages({
         "string.base": "Email must be a string.",
         "string.empty": "Email cannot be empty.",
         "string.min": "Email must be at least 6 characters long.",
         "string.max": "Email cannot exceed 60 characters.",
         "string.email": "Email must be a valid email address.",
         "any.required": "Email is required.",
      })
});

exports.resetPasswordSchema = Joi.object({
   email: Joi.string()
      .min(6)
      .max(60)
      .required()
      .email({
         tlds: { allow: ["com", "net"] },
      })
      .messages({
         "string.base": "Email must be a string.",
         "string.empty": "Email cannot be empty.",
         "string.min": "Email must be at least 6 characters long.",
         "string.max": "Email cannot exceed 60 characters.",
         "string.email": "Email must be a valid email address.",
         "any.required": "Email is required.",
      }),
   password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
      .messages({
         "string.pattern.base":
            "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
         "any.required": "Password is required.",
      }),
   code: Joi.string()
      .length(6)
      .required()
      .pattern(/^\d{6}$/)
      .messages({
         "string.base": "Verification code must be a string.",
         "string.empty": "Verification code cannot be empty.",
         "string.length": "Verification code must be exactly 6 digits.",
         "string.pattern.base": "Verification code must contain only digits.",
         "any.required": "Verification code is required.",
      }),
});

exports.tokenValidationSchema = Joi.object({
   refreshToken: Joi.string()
      .required()
      .messages({
         'string.base': 'Token must be a string',
         'string.empty': 'Token cannot be empty',
         'any.required': 'Token is required'
   })
})