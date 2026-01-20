import { z } from "zod";

export const PersonRegistrationFormSchema = z.object({
  fullName: z.string()
              .min(10, { message: "(*) Full name is required" })
              .max(200, { message: "(*) Full name must be no more than 200 characters long." }),
  age: z.coerce
        .number({message: "(*) Age must be an integer."})
        .int({message: "(*) Age must be an integer."})
        .positive({error : "(*) Age must be a positive integer."})
        .min(5, { message: "(*) Age must be at least 5." })
        .max(100, { message: "(*) Age must be no more than 100." })
});

export type PersonRegistrationFormValues = z.infer<typeof PersonRegistrationFormSchema>;