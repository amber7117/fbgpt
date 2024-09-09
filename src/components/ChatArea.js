import { useEffect, useState } from 'react';
import '../styles/ChatArea.css';
import ChatCard from './ChatCard';

const ChatArea = ({user, conversations, setConversations, selectedConversation, setSelectedConversation}) => {
    const [reply, setReply] = useState('');
    
    const sendReply = (e) => {
        e.preventDefault();
        if(reply === ''){
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/api/conversations/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                conversationId: conversations[selectedConversation]._id,
                message: reply
            })
        })
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setReply('');
                    let convs = [...conversations]
                    convs[selectedConversation] = data.conversation
                    setConversations(convs)
                }
            })
    }


    useEffect(() => {
        if(selectedConversation !== null){
            const element = document.querySelector('.chat-area-container');
            element.scrollTop = element.scrollHeight;
        }
    }, [selectedConversation, conversations])
    
    if(selectedConversation === null){
        return (
            <div className="chat-area not-selected">
                <p>Select a conversation to get started.</p>
            </div>
        )
    }
    return (
        <div className="chat-area">
            <h2><i className='material-icons' style={{fontSize: '40px'}}>account_circle</i>&nbsp;{conversations[selectedConversation].sender_name}</h2>
            <hr />
            <div className="chat-area-container">
                {conversations[selectedConversation].messages.map((msg, index) => {
                    return (
                        <ChatCard user={user} conversation={conversations[selectedConversation]} msg={msg} key={index} position={msg.position}/>
                    )
                })}
            </div>
            <form className='reply-area' onSubmit={sendReply}>
                <input type="text" className='reply-box' placeholder="Type a message..." value={reply} onChange={(e) => setReply(e.target.value)} />
                <button type='submit' className='send-reply'>Send</button>
            </form>
        </div>
    )
}

export default ChatArea;