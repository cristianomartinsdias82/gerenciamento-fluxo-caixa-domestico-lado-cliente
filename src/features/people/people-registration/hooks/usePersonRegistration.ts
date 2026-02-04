import { useState } from "react";
import type { Person } from "../models/person";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const usePersonRegistration = (
    onRegistrationSuccessful?: (person: Person) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRegistrationFailure?: (error: any) => void) => {

    const [inProgress, setInProgress] = useState<boolean>(false);

    const registerPerson = (person: Person) => {

        setInProgress(true);

        return fetch(
                `${apiBaseUrl}/people`,
                {
                    method : 'POST',
                    body: JSON.stringify(person),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(jsonResponse => jsonResponse as Person)
                .then(person => onRegistrationSuccessful?.(person))
                .catch(error => onRegistrationFailure?.(error))
                .finally(() => setInProgress(false));
    }

    return {
        inProgress,
        registerPerson
    }
}

export default usePersonRegistration;
