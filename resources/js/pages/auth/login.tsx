import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { PageLoader } from '../../components/Loader';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    rateLimitSeconds?: number;
    rateLimitEmail?: string;
}

export default function Login({ status, canResetPassword, rateLimitSeconds = 0, rateLimitEmail = '' }: LoginProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(rateLimitSeconds);
    const [isRateLimited, setIsRateLimited] = useState(rateLimitSeconds > 0);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: rateLimitEmail || '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        // Check if mobile on mount and handle resize
        const checkMobile = () => setIsMobile(window.innerWidth <= 700);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Simulate page loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Countdown timer for rate limiting
    useEffect(() => {
        if (remainingSeconds <= 0) {
            setIsRateLimited(false);
            return;
        }

        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    setIsRateLimited(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingSeconds]);

    // Format seconds to MM:SS
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isRateLimited) {
            return; // Prevent submission when rate limited
        }

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    if (isLoading) {
        return <PageLoader text="Memuat halaman login..." />;
    }

    return (
        <>
            <Head title="Login - Tepian Teknologi">
                <link rel="icon" href="/favicon.png" type="image/png" />
            </Head>

            <div className="login-page min-h-screen font-main">
                <header>
                    <Navigation />
                </header>

                <main
                    className="login-main"
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#efefef',
                        padding: '20px'
                    }}
                >
                    <div
                        className="login-bg-center"
                        style={{
                            background: 'url("/images/Login-bg.png") center center / cover no-repeat',
                            borderRadius: '18px',
                            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                            padding: isMobile ? '16px 2vw' : '40px 32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: isMobile ? '0' : '350px',
                            minHeight: '340px',
                            maxWidth: isMobile ? '98vw' : '800px',
                            width: '100%'
                        }}
                    >
                        <div
                            className="login-container"
                            style={{
                                background: '#fff',
                                borderRadius: '18px',
                                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                                padding: isMobile ? '24px 8px' : '40px 32px 32px 32px',
                                minWidth: '0',
                                maxWidth: isMobile ? '98vw' : '450px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginLeft: 'auto'
                            }}
                        >
                            <h2
                                className="login-title"
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: isRateLimited ? '16px' : '32px',
                                    borderBottom: '3px solid #0b46f9',
                                    display: 'inline-block',
                                    paddingBottom: '6px',
                                    textAlign: 'center'
                                }}
                            >
                                Login
                            </h2>

                            {isRateLimited && (
                                <div
                                    style={{
                                        background: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        borderRadius: '8px',
                                        padding: '12px 16px',
                                        marginBottom: '24px',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: '500' }}>
                                        Too many login attempts
                                    </div>
                                    <div style={{ color: '#7f1d1d', fontSize: '0.75rem', marginTop: '4px' }}>
                                        Please wait {formatTime(remainingSeconds)} before trying again
                                    </div>
                                </div>
                            )}

                            <form
                                className="login-form"
                                onSubmit={submit}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <label
                                    htmlFor="email"
                                    style={{
                                        fontSize: '1rem',
                                        color: '#222',
                                        marginBottom: '2px'
                                    }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    disabled={isRateLimited}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1.5px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        backgroundColor: isRateLimited ? '#f9fafb' : 'white',
                                        color: isRateLimited ? '#6b7280' : 'black'
                                    }}
                                    onFocus={(e) => {
                                        if (!isRateLimited) {
                                            e.target.style.borderColor = '#0b46f9';
                                            e.target.style.boxShadow = '0 0 0 2px rgba(11, 70, 249, 0.2)';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (!isRateLimited) {
                                            e.target.style.borderColor = '#d1d5db';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                />
                                {errors.email && (
                                    <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                        {errors.email}
                                    </div>
                                )}

                                <label
                                    htmlFor="password"
                                    style={{
                                        fontSize: '1rem',
                                        color: '#222',
                                        marginBottom: '2px'
                                    }}
                                >
                                    Password
                                </label>
                                <div
                                    className="password-input"
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        required
                                        disabled={isRateLimited}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            border: '1.5px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            transition: 'border-color 0.2s, box-shadow 0.2s',
                                            backgroundColor: isRateLimited ? '#f9fafb' : 'white',
                                            color: isRateLimited ? '#6b7280' : 'black'
                                        }}
                                        onFocus={(e) => {
                                            if (!isRateLimited) {
                                                e.target.style.borderColor = '#0b46f9';
                                                e.target.style.boxShadow = '0 0 0 2px rgba(11, 70, 249, 0.2)';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (!isRateLimited) {
                                                e.target.style.borderColor = '#d1d5db';
                                                e.target.style.boxShadow = 'none';
                                            }
                                        }}
                                    />
                                </div>
                                {errors.password && (
                                    <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                        {errors.password}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="login-button"
                                    disabled={processing || isRateLimited}
                                    style={{
                                        marginTop: '10px',
                                        padding: '10px 0',
                                        background: (processing || isRateLimited) ? '#6b7280' : '#0b46f9',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: (processing || isRateLimited) ? 'not-allowed' : 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!processing && !isRateLimited) {
                                            e.currentTarget.style.background = '#0072ff';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!processing && !isRateLimited) {
                                            e.currentTarget.style.background = '#0b46f9';
                                        }
                                    }}
                                >
                                    {processing
                                        ? 'Logging in...'
                                        : isRateLimited
                                        ? `Try again in ${formatTime(remainingSeconds)}`
                                        : 'Login'
                                    }
                                </button>
                            </form>

                            <p
                                className="register-link"
                                style={{
                                    marginTop: '16px',
                                    fontSize: '0.98rem',
                                    color: '#444'
                                }}
                            >
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="register-link"
                                    style={{
                                        color: '#1e90ff',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </main>

                <footer style={{ padding: '20px' }}>
                    <div className="copyright">
                        <p style={{ fontSize: 'large', textAlign: 'center', margin: 0 }}>
                            &copy; 2025 Tepian Teknologi
                        </p>
                    </div>
                </footer>
            </div>

            {status && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#10b981',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    zIndex: 1000
                }}>
                    {status}
                </div>
            )}
        </>
    );
}
