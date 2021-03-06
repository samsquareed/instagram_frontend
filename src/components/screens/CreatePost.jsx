import React,{useState,useEffect} from 'react'
import M from 'materialize-css'
import {useNavigate} from 'react-router-dom'
import Axios from 'axios'


const CreatePost = () =>{

    const nevigate = useNavigate();
    const [title,setTitle] = useState("")
    const [caption,setCaption] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    // Axios.interceptors.request.use(
    //     config => {
    //         config.headers.Authorization = `Bearer ${localStorage.getItem("jwt")}`;
    //         return config;
    //     },
    //     error =>Promise.reject(error)
    // );

    useEffect(()=>{
        if(url){
            // console.log(localStorage.getItem("jwt"));
        const authAxios = Axios.create({
            baseURL : 'https://ingrammer.herokuapp.com/',
            headers :{
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            }
        })    
        authAxios.post('/createpost', {
           title,
           caption,
           pic : url
       })
       .then(response=>{
           if(response.data.error){
               M.toast({html: response.data.error,classes:"#c62828 red darken-3"})
           } else{
               M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
               nevigate('/');
           }  
       })
       .catch(err=>console.log(err))

        }
    },[url])

    // useEffect(()=>{
    //    if(url){
    //     fetch("http://localhost:6000/createpost",{
    //         method:"post",
    //         headers:{
    //             "Content-Type":"application/json",
    //             "Authorization":"Bearer "+localStorage.getItem("jwt")
    //         },
    //         body:JSON.stringify({
    //             title,
    //             caption,
    //             pic:url
    //         })
    //     }).then(res=>res.json())
    //     .then(data=>{
    
    //        if(data.error){
    //           M.toast({html: data.error,classes:"#c62828 red darken-3"})
    //        }
    //        else{
    //            M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
    //            nevigate('/')
    //        }
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    // }
    // },[url])


    const ImagePost = ()=>{
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

    return(
       <div className="card input-filed"
            style={{
                margin:"30px auto",
                maxWidth:"500px",
                padding:"20px",
                textAlign:"center"
            }}
       >
        <input 
           type="text"
            placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
        />
        <input
            type="text"
            placeholder="caption"
            value={caption}
            onChange={(e)=>setCaption(e.target.value)}
        />
        <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
            <span>Uplaod Image</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
        </div>
        </div>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={ImagePost}
        >
            Submit post
        </button>

       </div>
   )
}

export default CreatePost;