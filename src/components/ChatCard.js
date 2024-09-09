import '../styles/ChatCard.css';
import dateFormat from "dateformat";

const ChatCard = ({user, msg, conversation}) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${dateFormat(date, "mmm dd, hh:MM TT")}`
    }
    return (
        <div className={`chat-card ${msg.isSenderAgent === true? 'right': 'left'}`}>
            <div>
                {
                    msg.isSenderAgent === false ? 
                    <i className='material-icons' style={{fontSize: '30px'}}>account_circle</i>
                    : null
                }
                &nbsp;&nbsp;
                <div className="chat-card-content">
                    <p>{msg.message}</p>
                </div>
                &nbsp;&nbsp;
                {
                    msg.isSenderAgent === true ? 
                    <i className='material-icons' style={{fontSize: '36px', color: '#000'}}>account_circle</i>
                    : null
                }
            </div>
            <div>
                {
                    msg.isSenderAgent === false ? 
                    <p><b>{conversation.sender_name}</b> ● {formatDate(msg.timestamp)}</p>
                    : <p><b>{msg.agentName}</b> ● {formatDate(msg.timestamp)}</p>
                }
            </div>
        </div>
    );
}
export default ChatCard;