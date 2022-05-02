import { useEffect, useState } from 'react';
import {Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import M from 'materialize-css'

const Signup = () =>{

    const nevigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url,setUrl] = useState(undefined);

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadProfilePic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","instagram")
        data.append("cloud_name","samsquare")

        fetch("https://api.cloudinary.com/v1_1/samsquare/image/upload",{
           method:"post",
           body:data
       }).then(res=>res.json())
       .then(data=>setUrl(data.url))
       .catch(err=>console.log(err))
    }

    const uploadFields = () =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        // console.log(name, email, password);
        Axios.post('http://localhost:3001/signup',{name,email,password,pic:url})
        .then(response=> {
            // console.log(response)
            if(response.data.message){
                M.toast({html: response.data.message, classes:"#43a047 green darken-1"})
                nevigate('/login');
            } else if(response.data.error) {
                // console.log(response.data.error);
                M.toast({html: response.data.error,classes:"#c62828 red darken-3"})
            }
        }).catch(err=>console.log(err))
    }


    const handleSignUp = (e) =>{
        e.preventDefault();

        if(image){
            uploadProfilePic()
        } else{
            uploadFields()
        }
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h3>Instagram Signup</h3>
                <input 
                    type="text"
                    placeholder="Name" 
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                />
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
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Uplaod profile image</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={handleSignUp}
                >
                    Signup  
                </button>
                <h5>
                    <Link to="/login">Already have an account ?</Link>
                </h5>
                {/* <h6>
                    <Link to="/reset">Forgot password ?</Link>
                </h6> */}
            </div>
        </div>
    )
}

export default Signup;