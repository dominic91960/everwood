import * as z from "zod";

const allowedSpecialChars = `^$*.[]{}()?\"!@#%&/\\,><':;|_~\``;
const specialCharRegex = new RegExp(
  `[${allowedSpecialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}]`,
);

// ----- ----- ----- START ----- ----- -----
const nameSchema = z
  .string({ message: "This field is required" })
  .min(1, "This field is required")
  .min(2, "Too short")
  .max(32, "Too long");

// ----- ----- ----- START ----- ----- -----
const emailSchema = z
  .email({ error: "Invalid format (e.g. john@doe.com)" })
  .min(1, "This field is required")
  .max(32, "Too long");

// ----- ----- ----- START ----- ----- -----
const telSchema = z
  .string({ message: "This field is required" })
  .regex(/^\d+$/, "Invalid format (e.g. 0701231234)")
  .length(10, "Must be exactly 10 digits");

// ----- ----- ----- START ----- ----- -----
const passwordSchema = z
  .string({ message: "This field is required" })
  .min(1, "This field is required")
  .min(8, "Too short")
  .max(32, "Too long")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/\d/, "Must contain at least one number")
  .regex(specialCharRegex, "Must contain at least one special character");

// ----- ----- ----- START ----- ----- -----
const addressSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  address: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(10, "Too short")
    .max(100, "Too long"),
  apartment: z
    .string({ message: "This field is required" })
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
  city: nameSchema,
  state: nameSchema,
  zip: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid format (e.g. 12345 or 12345-6789)"),
  tel: telSchema,
});

// ----- ----- ----- START ----- ----- -----
export const SignUpFormSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    username: z
      .string({ message: "This field is required" })
      .min(3, "Must be at least 3 characters")
      .max(32, "Must be at most 32 characters")
      .regex(
        /^[a-zA-Z][a-zA-Z0-9._]*$/,
        "Must start with a letter and contain only letters, numbers, dots, or underscores",
      )
      .regex(/^(?!.*[_.]{2})/, "Cannot contain consecutive dots or underscores")
      .regex(/^(?!.*[_.]$)/, "Cannot end with a dot or underscore"),
    tel: telSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });
export type SignUpType = z.infer<typeof SignUpFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const SignInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type SignInType = z.infer<typeof SignInFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const EmailResetFormSchema = z.object({
  email: emailSchema,
});
export type EmailResetType = z.infer<typeof EmailResetFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const PasswordResetFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
});
export type PasswordResetType = z.infer<typeof PasswordResetFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const PaymentFormSchema = z.object({
  email: emailSchema,
  shippingInfo: addressSchema,
  paymentMethod: z.enum(["cod", "card-payment", "bank-transfer"], {
    error: "This field is required",
  }),
  differentBillingAddress: z.boolean({ error: "This field is required" }),
  billingInfo: addressSchema.optional(),
  remeberAddressInfo: z.boolean(),
});
// .refine((val) => val.differentBillingAddress && val.billingInfo);
export type PaymentFormType = z.infer<typeof PaymentFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const CredentialNameFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  role: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid format"),
});
export type CredentialNameType = z.infer<typeof CredentialNameFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const CredentialEmailFormSchema = z
  .object({
    email: emailSchema,
    password: z.string({ message: "This field is required" }).optional(),
    validatePassword: z.boolean({ error: "This field is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.validatePassword) {
      const password = data.password;

      if (!password) {
        ctx.addIssue({
          path: ["password"],
          message: "This field is required",
          code: "custom",
        });
        return;
      }

      if (password.length < 8) {
        ctx.addIssue({
          path: ["password"],
          message: "Too short",
          code: "custom",
        });
      }

      if (password.length > 32) {
        ctx.addIssue({
          path: ["password"],
          message: "Too long",
          code: "custom",
        });
      }

      if (!/[A-Z]/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one uppercase letter",
          code: "custom",
        });
      }

      if (!/[a-z]/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one lowercase letter",
          code: "custom",
        });
      }

      if (!/\d/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one number",
          code: "custom",
        });
      }

      if (!specialCharRegex.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one special character",
          code: "custom",
        });
      }
    }
  });
export type CredentialEmailType = z.infer<typeof CredentialEmailFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const CredentialUsernameFormSchema = z
  .object({
    username: z
      .string({ message: "This field is required" })
      .min(3, "Must be at least 3 characters")
      .max(32, "Must be at most 32 characters")
      .regex(
        /^[a-zA-Z][a-zA-Z0-9._]*$/,
        "Must start with a letter and contain only letters, numbers, dots, or underscores",
      )
      .regex(/^(?!.*[_.]{2})/, "Cannot contain consecutive dots or underscores")
      .regex(/^(?!.*[_.]$)/, "Cannot end with a dot or underscore"),
    password: z.string({ message: "This field is required" }).optional(),
    validatePassword: z.boolean({ error: "This field is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.validatePassword) {
      const password = data.password;

      if (!password) {
        ctx.addIssue({
          path: ["password"],
          message: "This field is required",
          code: "custom",
        });
        return;
      }

      if (password.length < 8) {
        ctx.addIssue({
          path: ["password"],
          message: "Too short",
          code: "custom",
        });
      }

      if (password.length > 32) {
        ctx.addIssue({
          path: ["password"],
          message: "Too long",
          code: "custom",
        });
      }

      if (!/[A-Z]/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one uppercase letter",
          code: "custom",
        });
      }

      if (!/[a-z]/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one lowercase letter",
          code: "custom",
        });
      }

      if (!/\d/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one number",
          code: "custom",
        });
      }

      if (!specialCharRegex.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one special character",
          code: "custom",
        });
      }
    }
  });
export type CredentialUsernameType = z.infer<
  typeof CredentialUsernameFormSchema
>;

// ----- ----- ----- START ----- ----- -----
export const CredentialPasswordFormSchema = z
  .object({
    password: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });
export type CredentialPasswordType = z.infer<
  typeof CredentialPasswordFormSchema
>;

// ----- ----- ----- START ----- ----- -----
export const CredentialTelFormSchema = z
  .object({
    tel: telSchema,
    password: z.string({ message: "This field is required" }).optional(),
    validatePassword: z.boolean({ error: "This field is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.validatePassword) {
      const password = data.password;

      if (!password) {
        ctx.addIssue({
          path: ["password"],
          message: "This field is required",
          code: "custom",
        });
        return;
      }

      if (password.length < 8) {
        ctx.addIssue({
          path: ["password"],
          message: "Too short",
          code: "custom",
        });
      }

      if (password.length > 32) {
        ctx.addIssue({
          path: ["password"],
          message: "Too long",
          code: "custom",
        });
      }

      if (!/[A-Z]/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one uppercase letter",
          code: "custom",
        });
      }

      if (!/[a-z]/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one lowercase letter",
          code: "custom",
        });
      }

      if (!/\d/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one number",
          code: "custom",
        });
      }

      if (!specialCharRegex.test(password)) {
        ctx.addIssue({
          path: ["password"],
          message: "Must contain at least one special character",
          code: "custom",
        });
      }
    }
  });
export type CredentialTelType = z.infer<typeof CredentialTelFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const CredentialAuthFormSchema = z.object({
  authType: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(4, "Too short")
    .max(14, "Too long"),
  password: passwordSchema,
});
export type CredentialAuthType = z.infer<typeof CredentialAuthFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const ShippingFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  tel: telSchema,
  address: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(10, "Too short")
    .max(100, "Too long"),
  apartment: z
    .string({ message: "This field is required" })
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
  city: nameSchema,
  state: nameSchema,
  zip: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid format (e.g. 12345 or 12345-6789)"),
});
export type ShippingType = z.infer<typeof ShippingFormSchema>;

// ----- ----- ----- START ----- ----- -----
const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
export const AvatarFormSchema = z.object({
  avatar: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "Please select a file",
    })
    .transform((files) => files[0])
    .refine((file) => file.size > 0, "File is required")
    .refine((file) => allowedFormats.includes(file.type), {
      message: `Image must be one of: ${allowedFormats
        .map((f) => f.split("/")[1].toUpperCase())
        .join(", ")}`,
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Image must be under 2MB",
    }),
});
export type AvatarType = z.infer<typeof AvatarFormSchema>;

// ----- ----- ----- START ----- ----- -----
export const ContactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: z
    .string({ message: "This field is required" })
    .min(1, "This field is required")
    .min(2, "Too short")
    .max(150, "Too long"),
});
export type ContactType = z.infer<typeof ContactFormSchema>;
