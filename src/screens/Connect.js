import { useEffect, useState } from 'react';
import Card from '../components/Card';
import '../styles/Connect.css';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Connect = () => {
    const [isLoading, setIsLoading] = useState(true);

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
                    console.log(data)
                    if(data.success){
                        if(data.connected) {
                            window.location.href = '/manage';
                        }else{
                            setIsLoading(false);
                        }
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                })
        }else{
            window.location.href = '/login'
        }
    }, [])

    return (
        <>
        {
            isLoading ? <Loader />
            : (
                <div className="connect">
                    <Card>
                        <h3>Facebook Page Integration</h3>
                        <Link to={`${process.env.REACT_APP_API_URL}/api/auth/facebook`}><button>Connect Page</button></Link>
                    </Card>
                </div>
            )
        }
        </>
    )
}

export default Connect;