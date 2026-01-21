import { z } from "zod";

export const TransactionRegistrationFormSchema = z.object({
  personId: z.uuid({ message: "(*) Person is required." }),
  categoryId: z.uuid({ message: "(*) Category is required." }),
  type: z.string()
          .refine((value) => value === 'income' || value === 'expense', { message: "(*) Type is required. ('Income' or 'Expense')" }),
  amount: z.coerce
        .number({message: "(*) Amount must be an integer."})
        .int({message: "(*) Amount must be an integer."})
        .positive({error : "(*) Amount must be a positive integer."})
        .min(0.01, { message: "(*) Amount must be at least $0.01." })
        .max(100000, { message: "(*) Amount must be no more than $100.000." }),
  description: z.string()
                .min(3, { message: "(*) Description must be at least 3 characters long." })
                .max(200, { message: "(*) Description must be no more than 200 characters long." })  
});

export type TransactionRegistrationFormValues = z.infer<typeof TransactionRegistrationFormSchema>;