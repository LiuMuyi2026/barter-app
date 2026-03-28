'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import styles from '../auth.module.css';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button className={`btn btn-primary ${styles.submitBtn}`} type="submit" disabled={pending}>
            {pending ? 'Creating Account...' : 'Sign Up'}
        </button>
    );
}

export default function SignupPage() {
    const [state, formAction] = useActionState(register, undefined);

    return (
        <div className="container">
            <div className={styles.wrapper}>
                <h1 className={styles.title}>
                    Join Barter
                </h1>
                <div className={styles.formContainer}>
                    <form action={formAction} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="name">
                                Name
                            </label>
                            <input
                                className={styles.input}
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                required
                                minLength={2}
                            />
                            {state?.errors?.name && <p className={styles.fieldError}>{state.errors.name}</p>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="email">
                                Email
                            </label>
                            <input
                                className={styles.input}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="hello@example.com"
                                required
                            />
                            {state?.errors?.email && <p className={styles.fieldError}>{state.errors.email}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="password">
                                Password
                            </label>
                            <input
                                className={styles.input}
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                required
                                minLength={6}
                            />
                            {state?.errors?.password && <p className={styles.fieldError}>{state.errors.password}</p>}
                        </div>

                        {state?.message && (
                            <div className={styles.error}>
                                {state.message}
                            </div>
                        )}
                        <SubmitButton />
                    </form>
                    <p className={styles.footer}>
                        Already have an account?
                        <Link href="/login" className={styles.link}>
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
