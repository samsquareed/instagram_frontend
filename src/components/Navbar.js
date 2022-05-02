import React, {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../App'

const Navbar = ()=>{

    const {state, dispatch} = useContext(UserContext)
    const nevigate = useNavigate();
    const renderList = ()=>{
        if(state){
            return [
                <li key="0"><Link to="/profile"> {state.name} </Link></li>,
                <li key="1"><Link to="/profile">Profile</Link></li>,
                <li key="2"><Link to="/createpost">New Post</Link></li>,
                <li  key="5" className='logoutbtn'>
                    <button className="btn #c62828 red darken-3"
                        onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        nevigate('/login')
                        }}
                    >
                        Logout
                    </button>
                </li>
            ]
        } else{
            return [
                <li key="1"><Link to="/login">Login</Link></li>,
                <li key="2"><Link to="/signup">Sign up</Link></li>
            ]
        }
    }

    return(
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;