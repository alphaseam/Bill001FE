import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';

        if (!isLogin) {
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (isLogin) {
                const res = await authApi.login({
                    email: formData.email,
                    password: formData.password,
                });
                login(res.data.accessToken, res.data.refreshToken);
            } else {
                const res = await authApi.register({
                    email: formData.email,
                    password: formData.password,
                });
                login(res.data.accessToken, res.data.refreshToken);
            }
            toast.success(isLogin ? 'Logged in successfully!' : 'Registered successfully!');
            navigate('/dashboard');
        } catch (err) {
            setSubmitError('Invalid email or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>

                {submitError && <p className="text-red-500 text-center mb-2">{submitError}</p>}


                <div className="mb-4">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {!isLogin && (
                    <div className="mb-4">
                        <label>Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>
                )}

                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
                    {isLogin ? 'Login' : 'Register'}
                </button>

                <p className="text-center mt-4 text-sm">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;
