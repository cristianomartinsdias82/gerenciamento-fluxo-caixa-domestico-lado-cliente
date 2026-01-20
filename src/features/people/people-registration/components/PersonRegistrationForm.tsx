import { useForm } from "react-hook-form";
import './PersonRegistrationForm.css'
import type { Person } from '../models/person';
import { PersonRegistrationFormSchema, type PersonRegistrationFormValues } from "./PersonRegistrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type PeopleRegistrationFormProps = {
    onNewPersonRegistered?: (person: Person) => void;
    onCancelPersonRegistration?: () => void;
};

const PersonRegistrationForm = ({onNewPersonRegistered, onCancelPersonRegistration} :PeopleRegistrationFormProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<PersonRegistrationFormValues>({
        resolver: zodResolver(PersonRegistrationFormSchema),
        mode: "onTouched"
    });

    const onSubmit = async (person: Person) => {

        const registeredPerson = await registerPerson(person);

        if (registeredPerson) onNewPersonRegistered?.(person);
    }

    const registerPerson = async (person: Person) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/people`,
                {
                    method : 'POST',
                    body: JSON.stringify(person),
                    headers: { 'Content-Type': 'application/json' }
                });

            if (response.ok) {
                const person = await response.json() as Person;

                return person;
            }

            console.error('Error registering person:', response.statusText);
            window.alert('An error occurred while registering the person. Please check the console for details and try again.');

            return null;
        } catch (error) {
            console.error('Error registering person:', error);
            window.alert('An error occurred while registering the person. Please check the console for details and try again.');
            
            return null;
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="person-registration-form-container">
            <div>
                <label htmlFor={"fullName"}>Full name:</label>
                <div>
                    <input id="fullName" {...register("fullName")} />
                    {errors.fullName && <div>{errors.fullName.message}
                </div>}
            </div>
            </div>
                <label htmlFor={"age"}>Age:</label>
                <div>
                    <input type="number" defaultValue={5} id="age" {...register("age")} />
                    {errors.age && <div>{errors.age.message}
                </div>}
            </div>
            <div className="buttons">
                <button disabled={!isValid} type="submit">Save</button>
                <button onClick={() => { if (onCancelPersonRegistration) onCancelPersonRegistration?.(); }} type="button">Cancel</button>
            </div>
        </form>)
}
export default PersonRegistrationForm;