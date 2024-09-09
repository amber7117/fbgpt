import { Link } from 'react-router-dom';
import Card from '../components/Card';
import '../styles/Register.css';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';

const Register = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, email, password)
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    window.location.href = '/login';
                } else {
                    alert(data.message);
                }
            })
    }

    useEffect(() => {
        if(localStorage.getItem('token') !== null){
            fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.connected) {
                        window.location.href = '/manage';
                    }else if (data.success) {
                        window.location.href = '/connect';
                    }else{
                        localStorage.removeItem('token');
                        setIsLoading(false);
                    }
                })
        }else {
            setIsLoading(false);
        }
    }, [])

    return (
        <>
        {
            isLoading 
            ? <Loader />
            : (
                <div className="connect">
                    <Card>
                        <h3>Create Account</h3>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="name">Name</label><br />
                            <input type="text" required id="name" name="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} /><br />
                            <label htmlFor="email">Email</label><br />
                            <input type="email" required id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                            <label htmlFor="password">Password</label><br />
                            <input type="password" required id='password' name='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                            <input type="checkbox" />
                            <label>Remember Me</label><br />
                            <button type='submit'>Sign Up</button>
                        </form>
                        <p>Already have an account? <span><Link to='/login'>Login</Link></span></p>
                    </Card>
                </div>
            )
        }
        </>
    )
}

export default Register;