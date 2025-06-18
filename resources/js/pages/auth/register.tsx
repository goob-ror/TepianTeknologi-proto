import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { PageLoader } from '../../components/Loader';

type RegisterForm = {
    name: string;
    phone: string;
    email: string;
    password: string;
};

export default function Register() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        phone: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        // Check if mobile on mount and handle resize
        const checkMobile = () => setIsMobile(window.innerWidth <= 900);
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password'),
        });
    };

    if (isLoading) {
        return <PageLoader text="Memuat halaman registrasi..." />;
    }

    return (
        <>
            <Head title="Sign Up - Tepian Teknologi">
                <link rel="icon" href="/favicon.png" type="image/png" />
            </Head>

            <div className="register-page min-h-screen font-main">
                <header>
                    <Navigation />
                </header>

                <main
                    className="register-main"
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#efefef',
                        padding: '60px 20px 60px 20px'
                    }}
                >
                    <div
                        className="register-container"
                        style={{
                            background: '#fff',
                            borderRadius: '18px',
                            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                            padding: isMobile ? '24px 8px' : '40px 32px 32px 32px',
                            minWidth: isMobile ? '0' : '500px',
                            maxWidth: isMobile ? '98vw' : '750px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '0 auto'
                        }}
                    >
                        <h2
                            className="register-title"
                            style={{
                                fontSize: '2rem',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '32px',
                                borderBottom: '3px solid #0b46f9',
                                display: 'inline-block',
                                paddingBottom: '6px',
                                textAlign: 'center'
                            }}
                        >
                            Sign Up
                        </h2>

                        <form
                            className="register-form"
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
                                htmlFor="name"
                                style={{
                                    fontSize: '1rem',
                                    color: '#222',
                                    marginBottom: '2px'
                                }}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    border: '1.5px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#0b46f9';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(11, 70, 249, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {errors.name && (
                                <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                    {errors.name}
                                </div>
                            )}

                            <label
                                htmlFor="phone"
                                style={{
                                    fontSize: '1rem',
                                    color: '#222',
                                    marginBottom: '2px'
                                }}
                            >
                                No Handphone/WhatsApp
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="081234567897"
                                required
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    border: '1.5px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#0b46f9';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(11, 70, 249, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {errors.phone && (
                                <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                    {errors.phone}
                                </div>
                            )}

                            <label
                                htmlFor="email"
                                style={{
                                    fontSize: '1rem',
                                    color: '#222',
                                    marginBottom: '2px'
                                }}
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email address"
                                required
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
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#0b46f9';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(11, 70, 249, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = 'none';
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
                                        transition: 'border-color 0.2s, box-shadow 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#0b46f9';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(11, 70, 249, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
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
                                className="register-button"
                                disabled={processing}
                                style={{
                                    marginTop: '10px',
                                    padding: '10px 0',
                                    background: processing ? '#6b7280' : '#0b46f9',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!processing) {
                                        e.currentTarget.style.background = '#0072ff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!processing) {
                                        e.currentTarget.style.background = '#0b46f9';
                                    }
                                }}
                            >
                                {processing ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>

                        <p
                            className="login-link"
                            style={{
                                marginTop: '16px',
                                fontSize: '0.98rem',
                                color: '#444'
                            }}
                        >
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="login-signup"
                                style={{
                                    color: '#1e90ff',
                                    textDecoration: 'underline'
                                }}
                            >
                                Login here
                            </Link>
                        </p>
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
        </>
    );
}
