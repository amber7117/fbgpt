import { Fragment } from 'react';
import '../styles/Conversations.css';

const Conversations = ({conversations, selectedConversation, setSelectedConversation}) => {
    const formatDate = (date) => {
        const diff = new Date() - new Date(date);
        if(diff < 60000){
            return 'just now';
        }else if(diff < 3600000){
            return Math.floor(diff / 60000) + ' minutes ago';
        }else if(diff < 86400000){
            return Math.floor(diff / 3600000) + ' hours ago';
        }else{
            return Math.floor(diff / 86400000) + ' days ago';
        }
    }

    const getRecentMessage = (conversation) => {
        if(conversation.messages.length > 0){
            let msg = conversation.messages[conversation.messages.length - 1].message;
            if(msg.length > 20){
                return msg.substring(0, 20) + '...';
            }
            return msg;
        }else{
            return '';
        }
    }

    const handleClick = (e, index) => {
        setSelectedConversation(index);
    }

    return (
        <div className="conversations">
            <h2>Conversations</h2>
            <hr />
            <div className="conversations-container">
                {conversations.map((conversation, index) => {
                    return (
                        <Fragment key={conversation._id}>
                        {conversations[selectedConversation] && conversations[selectedConversation]._id === conversation._id
                            ? (
                                <div className="conversation selected" onClick={(e) => handleClick(e, index)}>
                                    <h5>{conversation.sender_name}
                                        <span className='time'>{formatDate(conversation.lastUpdated)}</span>
                                    </h5>
                                    <p>{getRecentMessage(conversation)}</p>
                                </div>
                            )
                            : (
                                <div className="conversation" onClick={(e) => handleClick(e, index)}>
                                    <h5>{conversation.sender_name}
                                        <span className='time'>{formatDate(conversation.lastUpdated)}</span>
                                    </h5>
                                    <p>{getRecentMessage(conversation)}</p>
                                </div>
                            )
                        }
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default Conversations;