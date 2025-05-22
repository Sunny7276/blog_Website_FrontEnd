import {useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from './auth/AuthContext'

export default function NavBar(){

    const {isLoggedIn,logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout =() =>{
        logout();
        navigate('/');
    }

    return(
        <div className="navbar">
            {/* Home button*/}
            <button onclick={()=> navigate('/')}>Home</button>
            
            {/* If Logged in true the display buttons */}
            {isLoggedIn &&(
                <button onclick={()=> navigate('/newposts')}>New Post</button>
            )&&(
                <button onclick={()=> navigate('/myposts')}>My Posts</button>
            )}

            {!isLoggedIn ? (
                <button onclick={()=> navigate('/login')}>Login</button>
            ):(
                <button onclick={handleLogout}>Logout</button>
            )}
           

        </div>
    );
}