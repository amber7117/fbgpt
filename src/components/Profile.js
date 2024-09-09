import '../styles/Profile.css'


const Profile = ({conversations, selectedConversation}) => {
    return (
        <div className='profile'>
            <div className='upper'>
                <i className='material-icons' style={{fontSize: '80px'}}>account_circle</i>
                <h2>{conversations[selectedConversation].sender_name}</h2>
                <p>● Offline</p>
                <div>
                    <button><i className='material-icons'>call</i>&nbsp;&nbsp;Call</button>
                    <button><i className='material-icons'>account_circle</i>&nbsp;&nbsp;Profile</button>
                </div>
            </div>
            <div className='lower'>
                <div>
                    <h4>Customer Details</h4>
                    <p>Email: <span>{`sample@gmail.com`}</span></p>
                    <p>Name: <span>{conversations[selectedConversation].sender_name}</span></p>
                    <a href=''>View more details</a>
                </div>
            </div>
        </div>
    )
}

export default Profile