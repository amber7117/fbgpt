import { useState } from 'react';
import '../styles/Admin.css';
import Card from './Card';

const Admin = () => {

    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/api/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ email: email })
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('User added successfully');
                    setEmail('');
                } else {
                    alert('User already exists');
                }
            })
    }

    return (
        <div className="admin">
            <Card>
                <h2>Add users</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='email'>Email</label>
                    <input type="text" id='email' placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <button type='submit'>Add</button>
                </form>
            </Card>
        </div>
    );
}

export default Admin;