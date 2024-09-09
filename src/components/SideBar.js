import "../styles/SideBar.css";
import InboxLogo from "../assets/inbox.svg";
import InboxSelectedLogo from "../assets/inbox-selected.svg";

const SideBar = ({currPage, setCurrPage}) => {
    
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <div className="sidebar">
            <div className="logo">
                <img src="/logo192.png" alt="logo" width={"100%"}/>
            </div>
            <div className="menu">
                {currPage === "inbox" ? (
                    <img className="menu-item selected" src={InboxSelectedLogo} alt="logo" width={"100%"}/>
                ) : (
                    <img className="menu-item" onClick={() => setCurrPage('inbox')} src={InboxLogo} alt="logo" width={"100%"}/>
                )}
                {currPage === "admin" ? (
                    <i className="material-icons menu-item selected" onClick={() => setCurrPage('admin')} style={{fontSize: '36px'}}>group</i>
                ) : (
                    <i className="material-icons menu-item" onClick={() => setCurrPage('admin')} style={{fontSize: '36px'}}>group</i>
                )}
                {currPage === "analytics" ? (
                    <i className="material-icons menu-item selected" onClick={() => setCurrPage('analytics')} style={{fontSize: '36px'}}>insights</i>
                    ) : (
                    <i className="material-icons menu-item" onClick={() => setCurrPage('analytics')} style={{fontSize: '36px'}}>insights</i>
                )}
                <i className="material-icons menu-item logout" onClick={logout} style={{fontSize: '36px'}}>logout</i>
            </div>
        </div>
    )
}

export default SideBar;