import { z } from "zod";

export const CategoryRegistrationFormSchema = z.object({
  name: z.string()
          .min(3, { message: "(*) Name must be at least 3 characters long." })
          .max(50, { message: "(*) Name must be no more than 50 characters long." }),
  description: z.string()
                .max(500, { message: "(*) Description must be no more than 500 characters long." }),
  purpose: z.string()
            .refine((value) => value === 'income' || value === 'expense' || value === 'both', { message: "(*) Purpose is required. ('income', 'expense', or 'both')" })
});

export type CategoryRegistrationFormValues = z.infer<typeof CategoryRegistrationFormSchema>;