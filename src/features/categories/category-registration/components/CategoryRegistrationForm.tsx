import { useForm } from "react-hook-form";
import './CategoryRegistrationForm.css'
import type { Category } from "../models/category";
import { CategoryRegistrationFormSchema, type CategoryRegistrationFormValues } from "./CategoryRegistrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type CategoryRegistrationFormProps = {
    onNewCategoryRegistered?: (category: Category) => void;
    onCancelCategoryRegistration?: () => void;
};

const CategoryRegistrationForm = ({onNewCategoryRegistered, onCancelCategoryRegistration} : CategoryRegistrationFormProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<CategoryRegistrationFormValues>({
        resolver: zodResolver(CategoryRegistrationFormSchema),
        mode: "onTouched"
    });

    const onSubmit = async (category: Category) => {

        const registeredCategory = await registerCategory(category);

        if (registeredCategory) onNewCategoryRegistered?.(category);
    }

    const registerCategory = async (category: Category) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/categories`,
                {
                    method : 'POST',
                    body: JSON.stringify(category),
                    headers: { 'Content-Type': 'application/json' }
                });

            if (response.ok) {
                const category = await response.json() as Category;

                return category;
            }

            console.error('Error registering category:', response.statusText);
            window.alert('An error occurred while registering the category. Please check the console for details and try again.');

            return null;
        } catch (error) {
            console.error('Error registering category:', error);
            window.alert('An error occurred while registering the category. Please check the console for details and try again.');
            
            return null;
        }
    }

    return (
        <>
            <h2>Category registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="category-registration-form-container">
                <div>
                    <label htmlFor={"name"}>Name:</label>
                    <div>
                        <input id="name" {...register("name")} />
                        {errors.name && <div>{errors.name.message}</div>}
                    </div>
                </div>
                <div>
                    <label htmlFor={"purpose"}>Purpose:</label>
                    <div>
                        <select id="purpose" {...register("purpose")}>
                            <option value="">-- Purpose --</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="both">Both</option>
                        </select>
                        {errors.purpose && <div>{errors.purpose.message}</div>}
                    </div>
                </div>
                <div>
                    <label htmlFor={"description"}>Description:</label>
                    <div>
                        <textarea rows={10} cols={40} id="description" {...register("description")} />
                        {errors.description && <div>{errors.description.message}</div>}
                    </div>
                </div>
                <div className="buttons">
                    <button disabled={!isValid} type="submit">Save</button>
                    <button onClick={() => { if (onCancelCategoryRegistration) onCancelCategoryRegistration?.(); }} type="button">Cancel</button>
                </div>
            </form>
        </>)
}
export default CategoryRegistrationForm;