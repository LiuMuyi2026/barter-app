'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import styles from '../auth.module.css';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button className={`btn btn-primary ${styles.submitBtn}`} type="submit" disabled={pending}>
            {pending ? 'Logging in...' : 'Log in'}
        </button>
    );
}

export default function LoginPage() {
    const [errorMessage, formAction] = useActionState(authenticate, undefined);

    return (
        <div className="container">
            <div className={styles.wrapper}>
                <h1 className={styles.title}>
                    Barter
                </h1>
                <div className={styles.formContainer}>
                    <form action={formAction} className={styles.form}>
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
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        {errorMessage && (
                            <div className={styles.error}>
                                {errorMessage}
                            </div>
                        )}
                        <SubmitButton />
                    </form>
                    <p className={styles.footer}>
                        Don't have an account?
                        <Link href="/signup" className={styles.link}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
