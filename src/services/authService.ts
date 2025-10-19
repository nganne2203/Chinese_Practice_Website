import * as yup from 'yup';
import type { LoginRequest } from '../types/Authentication';

export const AuthSchema = yup.object().shape({
  userName: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
});

export async function validateAuth(auth: LoginRequest) {
    try {
        await AuthSchema.validate(auth, { abortEarly: false });
        return { valid: true, errors: {} };
    } catch (err: unknown) {
        const errors: Record<string, string> = {};
        if (err instanceof yup.ValidationError) {
            if (err.inner && Array.isArray(err.inner)) {
                err.inner.forEach((e: yup.ValidationError) => {
                    if (e.path && !errors[e.path]) {
                        errors[e.path] = e.message;
                    }
                });
            } else if (err.path && err.message) {
                errors[err.path] = err.message;
            }
        }
        console.log('Validation errors:', errors); 
        return { valid: false, errors };
    }
}
