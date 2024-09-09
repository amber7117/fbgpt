import { Link } from 'react-router-dom';
import Card from '../components/Card';
import '../styles/Manage.css';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';

const Manage = () => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const handleDelete = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/delete`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => res.json())
            .then(data => {
                if(data.success){
                    window.location.href = '/connect';
                }
            })
    }

    useEffect(() => {
        if(localStorage.getItem('token') !== null){
            fetch(`${process.env.REACT_APP_API_URL}/api/userDetails`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        if(!data.connected) {
                            window.location.href = '/connect';
                        }
                        else {
                            console.log(data.user.organizationId)
                            setUser(data.user)
                            setIsLoading(false);
                        }
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                })
        }else{
            window.location.href = '/login';
        }
    }, [])

    return (
        <>
        {
            isLoading ? <Loader />
            : (
                <div className="manage">
                    <Card>
                        <h3>Facebook Page Integration<br/>Integrated Page: <b>{user.organizationId.pageName}</b></h3>
                        <button className='delete' onClick={handleDelete}>Delete Integration</button>
                        <Link to="/dashboard"><button>Reply to Messages</button></Link>
                    </Card>
                </div>  
            )
        }
        </>
    )
}

export default Manage