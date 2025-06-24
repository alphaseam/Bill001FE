import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const { login, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await api.post('/auth/login', formData);
            console.log(res)
            login(res.data.access_token, res.data.email);
            navigate('/dashboard');
        } catch (err) {
            setSubmitError('Invalid email or password');
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

                {submitError && <p className="text-red-500 text-center mb-2">{submitError}</p>}

                <div className="mb-4">
                    <label>Email</label>
                    <input name="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border px-3 py-2 rounded" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="mb-6">
                    <label>Password</label>
                    <input name="password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full border px-3 py-2 rounded" />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
