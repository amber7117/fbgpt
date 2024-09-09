import SideBar from '../components/SideBar';
import Conversations from '../components/Conversations';
import '../styles/Dashboard.css'
import { useEffect, useState } from 'react';
import ChatArea from '../components/ChatArea';
import Admin from '../components/Admin';
import { io } from 'socket.io-client';
import Profile from '../components/Profile';
import Loader from '../components/Loader';

const socket = io(`${process.env.REACT_APP_API_URL}`)


const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currPage, setCurrPage] = useState('inbox')
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/userDetails`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if(data.success && data.connected){
                    setUser(data.user);
                    setIsLoading(false);
                }else if(data.success){
                    window.location.href = '/connect';
                }else{
                    window.location.href = '/login';
                }
            })
    }, [])

    useEffect(() => {
        if(user){
            fetch(`${process.env.REACT_APP_API_URL}/api/conversations`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setConversations(data.conversations);
                    socket.on(`new-message-${user.organizationId.pageId}`, () => {
                        console.log('new message')
                        setRefresh(!refresh)
                    })
                })
        }
    }, [user, refresh])

    return (
        <>
        {
            isLoading ? <Loader />
            : (
                <div className="dashboard">
                    <SideBar currPage={currPage} setCurrPage={setCurrPage} />
                    {currPage === 'inbox' &&
                        <>
                            <Conversations conversations={conversations} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
                            <ChatArea user={user} conversations={conversations} setConversations={setConversations} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation}/>
                            {selectedConversation != null ?
                                <Profile conversations={conversations} selectedConversation={selectedConversation} />
                                : <></>
                            }
                        </>
                    }
                    {
                        currPage === 'admin' &&
                        <Admin />
                    }
                </div>
            )
        }
        </>
    )
}

export default Dashboard;