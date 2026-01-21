import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import './TransactionRegistrationForm.css'
import type { Transaction } from "../models/transaction";
import { TransactionRegistrationFormSchema, type TransactionRegistrationFormValues } from "./TransactionRegistrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Person } from "../models/person";
import type { Category } from "../models/category";
import type { PagedResult } from "../../../../common/models/results/paged-result";
import type { RegisteredTransaction } from "../models/registered-transaction";

type TransactionRegistrationFormProps = {
    onNewTransactionRegistered?: (Transaction: Transaction) => void;
    onCancelTransactionRegistration?: () => void;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultPageSize = 50;

const TransactionRegistrationForm = ({onNewTransactionRegistered, onCancelTransactionRegistration} : TransactionRegistrationFormProps) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

    const [people, setPeople] = useState<Person[]>([]);
    const [loadingPeople, setLoadingPeople] = useState<boolean>(true);

    const [error, setError] = useState<Error | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<TransactionRegistrationFormValues>({
        resolver: zodResolver(TransactionRegistrationFormSchema),
        mode: "onTouched"
    });

    useEffect(() => {
    
            const abortController = new AbortController();
    
            const fetchCategoriesList = async () => {
    
                try {
                    const response = await fetch(
                        `${apiBaseUrl}/categories?pageNumber=1&pageSize=${defaultPageSize}&searchTerm=`,
                        { signal: abortController.signal });
                    
                    const pagedResult = await response.json() as PagedResult<Category>;
    
                    setCategories(pagedResult.items);
                } catch (error: unknown) {
                    if (error.name === 'AbortError') return;
    
                    setError(error as Error);
                    console.error('Error fetching categories list:', error);
                } finally {
                    setLoadingCategories(false);
                }
            }
    
            fetchCategoriesList();
    
            return () => abortController.abort();
    }, []);

    useEffect(() => {
    
            const abortController = new AbortController();
    
            const fetchPeopleList = async () => {
    
                try {
                    const response = await fetch(
                        `${apiBaseUrl}/people?pageNumber=1&pageSize=${defaultPageSize}&searchTerm=`,
                        { signal: abortController.signal });
                    
                    const pagedResult = await response.json() as PagedResult<Person>;
    
                    setPeople(pagedResult.items);
                } catch (error: unknown) {
                    if (error.name === 'AbortError') return;
    
                    setError(error as Error);
                    console.error('Error fetching people list:', error);
                } finally {
                    setLoadingPeople(false);
                }
            }
    
            fetchPeopleList();
    
            return () => abortController.abort();
    }, []);

    const onSubmit = async (transaction: Transaction) => {

        const registeredTransaction = await registerTransaction(transaction);

        if (registeredTransaction) onNewTransactionRegistered?.(transaction);
    }

    const registerTransaction = async (transaction: Transaction) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/people/transactions`,
                {
                    method : 'POST',
                    body: JSON.stringify(transaction),
                    headers: { 'Content-Type': 'application/json' }
                });

            if (response.ok) {
                const registeredTransaction = await response.json() as RegisteredTransaction;

                return registeredTransaction;
            }

            console.error('Error registering transaction:', response.statusText);
            window.alert('An error occurred while registering the transaction. Please check the console for details and try again.');

            return null;
        } catch (error) {
            console.error('Error registering transaction:', error);
            window.alert('An error occurred while registering the transaction. Please check the console for details and try again.');
            
            return null;
        }
    }

    if (loadingCategories || loadingPeople)
        return <p>Loading form data. Please wait...</p>

    if (error)
        return <p>{error.message}</p>

    return (
        <>
            <h2>Transaction registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="transaction-registration-form-container">
                <div>
                    <label htmlFor={"personId"}>Member:</label>
                    <div>
                        {people &&
                        <select id="personId" {...register("personId")}>
                            <option value="">-- Member --</option>
                            {people.map(person => <option key={person.id} value={person.id}>{person.fullName}</option>)}
                        </select>}
                        {errors.personId && <div>{errors.personId.message}</div>}
                    </div>
                </div>
                <div>
                    <label htmlFor={"categoryId"}>Category:</label>
                    <div>
                        {categories &&
                        <select id="categoryId" {...register("categoryId")}>
                            <option value="">-- Category --</option>
                            {categories.map(category => <option key={category.id} value={category.id}>{category.name} ({category.purpose.text})</option>)}
                        </select>}
                        {errors.categoryId && <div>{errors.categoryId.message}</div>}
                    </div>
                </div>
                <div>
                    <label htmlFor={"type"}>Type:</label>
                    <div>
                        <select id="type" {...register("type")}>
                            <option value="">-- Type --</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        {errors.type && <div>{errors.type.message}</div>}
                    </div>
                </div>
                <div>
                    <label htmlFor={"amount"}>Amount:</label>
                    <div>
                        <input id="amount" {...register("amount")} />
                        {errors.amount && <div>{errors.amount.message}</div>}
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
                    <button onClick={() => { if (onCancelTransactionRegistration) onCancelTransactionRegistration?.(); }} type="button">Cancel</button>
                </div>
            </form>
        </>)
}
export default TransactionRegistrationForm;