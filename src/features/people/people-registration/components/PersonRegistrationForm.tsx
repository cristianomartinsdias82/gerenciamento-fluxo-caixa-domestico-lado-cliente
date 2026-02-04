import { useForm } from "react-hook-form";
import './PersonRegistrationForm.css'
import type { Person } from '../models/person';
import { PersonRegistrationFormSchema, type PersonRegistrationFormValues } from "./PersonRegistrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import usePersonRegistration from "../hooks/usePersonRegistration";

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

    const { registerPerson } = usePersonRegistration(
                                onNewPersonRegistered,
                                error => {
                                    console.error('Error registering person:', error);
                                    window.alert('An error occurred while registering the person. Please check the console for details and try again.');
                                });

    const onSubmit = async (person: Person) => {

        registerPerson(person);
    }

    return (
        <>
        <h2>Family member registration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="person-registration-form-container">
            <div>
                <label htmlFor={"fullName"}>Full name:</label>
                <div>
                    <input id="fullName" {...register("fullName")} />
                    {errors.fullName && <div>{errors.fullName.message}</div>}
                </div>
            </div>
            <div>
                <label htmlFor={"age"}>Age:</label>
                <div>
                    <input type="number" defaultValue={5} id="age" {...register("age")} />
                    {errors.age && <div>{errors.age.message}</div>}
                </div>
            </div>
            <div className="buttons">
                <button disabled={!isValid} type="submit">Save</button>
                <button onClick={() => { if (onCancelPersonRegistration) onCancelPersonRegistration?.(); }} type="button">Cancel</button>
            </div>
        </form>
        </>)
}
export default PersonRegistrationForm;