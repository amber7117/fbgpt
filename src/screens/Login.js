import { Link } from "react-router-dom";
import Card from "../components/Card";
import '../styles/Login.css';
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password)
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    console.log(data.message);
                    window.location.href = '/connect';
                } else {
                    console.log(data.message);
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
                    if(data.success && data.connected){
                        window.location.href = '/manage';
                    }
                    else if (data.success) {
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
            isLoading ? <Loader />
            : (
                <div className="login">
                    <Card>
                        <h3>Login to your account</h3>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email</label><br />
                            <input type="email" required id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/><br />
                            <label htmlFor="password">Password</label><br />
                            <input type="password" required id='password' name='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                            <input type="checkbox" />
                            <label>Remember Me</label><br />
                            <button type='submit'>Sign Up</button>
                        </form>
                        <p>New to FB Helpdesk? <span><Link to='/register'>Sign Up</Link></span></p>
                    </Card>
                </div>
            ) 
        }
        </>
    )
}

export default Login;