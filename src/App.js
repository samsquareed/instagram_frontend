import Navbar from './components/Navbar';
import "./App.css"

import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import Home from "./components/screens/Home"
import Login from "./components/screens/Login"
import Signup from "./components/screens/Signup"
import Profile from "./components/screens/Profile"
import CreatePost from "./components/screens/CreatePost"
import { createContext, useEffect, useReducer, useContext } from 'react';

import {initialstate, reducer} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile';

export const UserContext = createContext();

const Routing = ()=>{
    const nevigate = useNavigate();

    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"))
        if(user){
            dispatch({type:"USER", payload : user})
            // nevigate('/')
        } else{
            nevigate('/login')
        }
    },[])
    
    return(
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/profile/:userid" element={<UserProfile />} />
        </Routes>
    )
}

function App() {    

    const [state, dispatch] = useReducer(reducer, initialstate)

    return(
        <UserContext.Provider value={{state, dispatch}}>
            <BrowserRouter>
                <Navbar />
                <Routing />
            </BrowserRouter>
        </UserContext.Provider>
    )
}

export default App;
