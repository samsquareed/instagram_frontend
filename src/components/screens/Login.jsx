import { useContext, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import M from 'materialize-css'
import Axios from 'axios'
import {UserContext} from '../../App'

const Login = () =>{
    const {state, dispatch} = useContext(UserContext)
    const nevigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) =>{
        e.preventDefault();
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return;
        }
        // console.log(email, password);
        Axios.post('http://localhost:3001/signin',{
            email,
            password
        }).then(response=>{
            if(response.data.token){
                // console.log(response);
                localStorage.setItem("jwt", response.data.token)
                localStorage.setItem("user", JSON.stringify(response.data.user))
                // console.log(response.data);
                dispatch({type:"USER", payload : response.data.user})
                M.toast({html: "login successful", classes:"#43a047 green darken-1"})
                nevigate('/');
            } else if(response.data.error) {
                // console.log(response.data.error);
                M.toast({html: response.data.error,classes:"#c62828 red darken-3"})
            }
        }).catch(err=>console.log(err))
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h3>Instagram Login</h3>
                <input 
                    type="email"
                    placeholder="Email" 
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="password" 
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <h5>
                    <Link to="/signup">Dont have an account ?</Link>
                </h5>
                <h6>
                    <Link to="/reset">Forgot password ?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Login;