import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { PageLoader } from '../components/Loader';
import { SharedData } from '../types';

type ProfileForm = {
    name: string;
    fullname: string;
    email: string;
    phone: string;
    address: string;
};

type PasswordForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileImage, setProfileImage] = useState<string>('/icons/Avatar-Logo.png');
    const { auth } = usePage<SharedData>().props;

    const { data: profileData, setData: setProfileData, patch: patchProfile, errors: profileErrors, processing: profileProcessing, recentlySuccessful: profileSuccess } = useForm<Required<ProfileForm>>({
        name: auth.user.name || '',
        fullname: (auth.user as any).fullname || '',
        email: auth.user.email || '',
        phone: (auth.user as any).phone || '',
        address: (auth.user as any).address || '',
    });

    const { data: passwordData, setData: setPasswordData, patch: patchPassword, errors: passwordErrors, processing: passwordProcessing, recentlySuccessful: passwordSuccess, reset: resetPassword } = useForm<Required<PasswordForm>>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        patchProfile(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        patchPassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) {
        return <PageLoader text="Memuat profil pengguna..." />;
    }

    return (
        <>
            <Head title="Profil -">
                <link rel="icon" href="/favicon.png" type="image/png" />
            </Head>

            <div className="profile-page min-h-screen font-main">
                <header>
                    <Navigation />
                </header>

                <main
                    className="profile-main"
                    style={{
                        minHeight: '100vh',
                        background: '#f8f9fa',
                        padding: '40px 20px'
                    }}
                >
                    <div
                        className="profile-container"
                        style={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            background: '#fff',
                            borderRadius: '18px',
                            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Profile Header */}
                        <div
                            className="profile-header"
                            style={{
                                background: 'linear-gradient(135deg, #0b46f9 0%, #1e90ff 100%)',
                                padding: '40px',
                                color: '#fff',
                                textAlign: 'center'
                            }}
                        >
                            <div
                                className="profile-avatar"
                                style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    marginBottom: '20px'
                                }}
                            >
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        border: '4px solid rgba(255, 255, 255, 0.3)',
                                        objectFit: 'cover'
                                    }}
                                />
                                <label
                                    htmlFor="profile-image"
                                    style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        right: '0',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                        color: '#0b46f9'
                                    }}
                                >
                                    📷
                                </label>
                                <input
                                    type="file"
                                    id="profile-image"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '8px' }}>
                                {(auth.user as any).fullname || auth.user.name}
                            </h1>
                            <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
                                {auth.user.email}
                            </p>
                        </div>

                        {/* Tab Navigation */}
                        <div
                            className="tab-navigation"
                            style={{
                                display: 'flex',
                                borderBottom: '1px solid #e5e7eb',
                                background: '#fff'
                            }}
                        >
                            <button
                                onClick={() => setActiveTab('profile')}
                                style={{
                                    flex: 1,
                                    padding: '16px 24px',
                                    border: 'none',
                                    background: activeTab === 'profile' ? '#0b46f9' : 'transparent',
                                    color: activeTab === 'profile' ? '#fff' : '#6b7280',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Informasi Profil
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                style={{
                                    flex: 1,
                                    padding: '16px 24px',
                                    border: 'none',
                                    background: activeTab === 'password' ? '#0b46f9' : 'transparent',
                                    color: activeTab === 'password' ? '#fff' : '#6b7280',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Ubah Password
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div
                            className="tab-content"
                            style={{
                                padding: '40px'
                            }}
                        >
                            {activeTab === 'profile' && (
                                <div className="profile-form">
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', color: '#333' }}>
                                        Informasi Profil
                                    </h2>

                                    {profileSuccess && (
                                        <div style={{
                                            background: '#10b981',
                                            color: 'white',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            marginBottom: '24px',
                                            fontSize: '0.875rem'
                                        }}>
                                            Profil berhasil diperbarui!
                                        </div>
                                    )}

                                    <form onSubmit={submitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div>
                                                <label htmlFor="name" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                    Nama Pengguna
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData('name', e.target.value)}
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
                                                {profileErrors.name && (
                                                    <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                        {profileErrors.name}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="fullname" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                    Nama Lengkap
                                                </label>
                                                <input
                                                    type="text"
                                                    id="fullname"
                                                    value={profileData.fullname}
                                                    onChange={(e) => setProfileData('fullname', e.target.value)}
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
                                                {profileErrors.fullname && (
                                                    <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                        {profileErrors.fullname}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div>
                                                <label htmlFor="email" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData('email', e.target.value)}
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
                                                {profileErrors.email && (
                                                    <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                        {profileErrors.email}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="phone" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                    No. Handphone
                                                </label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData('phone', e.target.value)}
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
                                                {profileErrors.phone && (
                                                    <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                        {profileErrors.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="address" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                Alamat
                                            </label>
                                            <textarea
                                                id="address"
                                                value={profileData.address}
                                                onChange={(e) => setProfileData('address', e.target.value)}
                                                rows={4}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 14px',
                                                    border: '1.5px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                    resize: 'vertical',
                                                    fontFamily: 'inherit'
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
                                            {profileErrors.address && (
                                                <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                    {profileErrors.address}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={profileProcessing}
                                            style={{
                                                padding: '12px 24px',
                                                background: profileProcessing ? '#6b7280' : '#0b46f9',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                cursor: profileProcessing ? 'not-allowed' : 'pointer',
                                                transition: 'background 0.2s',
                                                alignSelf: 'flex-start'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!profileProcessing) {
                                                    e.currentTarget.style.background = '#0072ff';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!profileProcessing) {
                                                    e.currentTarget.style.background = '#0b46f9';
                                                }
                                            }}
                                        >
                                            {profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'password' && (
                                <div className="password-form">
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', color: '#333' }}>
                                        Ubah Password
                                    </h2>

                                    {passwordSuccess && (
                                        <div style={{
                                            background: '#10b981',
                                            color: 'white',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            marginBottom: '24px',
                                            fontSize: '0.875rem'
                                        }}>
                                            Password berhasil diubah!
                                        </div>
                                    )}

                                    <form onSubmit={submitPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                                        <div>
                                            <label htmlFor="current_password" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                Password Saat Ini
                                            </label>
                                            <input
                                                type="password"
                                                id="current_password"
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData('current_password', e.target.value)}
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
                                            {passwordErrors.current_password && (
                                                <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                    {passwordErrors.current_password}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                Password Baru
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData('password', e.target.value)}
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
                                            {passwordErrors.password && (
                                                <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                    {passwordErrors.password}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" style={{ fontSize: '1rem', color: '#333', marginBottom: '8px', display: 'block' }}>
                                                Konfirmasi Password Baru
                                            </label>
                                            <input
                                                type="password"
                                                id="password_confirmation"
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
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
                                            {passwordErrors.password_confirmation && (
                                                <div style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '4px' }}>
                                                    {passwordErrors.password_confirmation}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={passwordProcessing}
                                            style={{
                                                padding: '12px 24px',
                                                background: passwordProcessing ? '#6b7280' : '#0b46f9',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                cursor: passwordProcessing ? 'not-allowed' : 'pointer',
                                                transition: 'background 0.2s',
                                                alignSelf: 'flex-start'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!passwordProcessing) {
                                                    e.currentTarget.style.background = '#0072ff';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!passwordProcessing) {
                                                    e.currentTarget.style.background = '#0b46f9';
                                                }
                                            }}
                                        >
                                            {passwordProcessing ? 'Mengubah...' : 'Ubah Password'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}