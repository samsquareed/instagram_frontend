import { useEffect, useState, useContext } from 'react';
import img from '../assets/images/sam.jpg'
import Axios from 'axios'
import {UserContext} from '../../App'

const Profile = () =>{

    const [myData, setMyData] = useState([]);
    const {state, dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    useEffect(()=>{
        const authAxios = Axios.create({
            baseURL : 'http://localhost:3001',
            headers : {
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        authAxios.get('/myposts')
        .then(response=>{
            // console.log(response.data);
            setMyData(response.data.mypost);
        })
    },[])

    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","instagram")
            data.append("cloud_name","samsquare")

            fetch("https://api.cloudinary.com/v1_1/samsquare/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
            // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            // dispatch({type:"UPDATEPIC",payload:data.url})
            // window.location.reload()

            const authAxios = Axios.create({
                baseURL : 'http://localhost:3001',
                headers : {
                    Authorization : `Bearer ${localStorage.getItem("jwt")}`
                }
            });
            authAxios.put('/updatepic',{
            pic : data.url
            }).then(res=>{
                console.log(res);
                localStorage.setItem("user", JSON.stringify({...state, pic : res.data.pic}))
                dispatch({type : "UPDATEPIC", payload : res.data.pic})
            })
            .then(window.location.reload)
            
        })
        
        
        }
    },[image])

    // const uploadToDb = () =>{
    //     console.log(url);
    //     const authAxios = Axios.create({
    //         baseURL : 'http://localhost:3001',
    //         headers : {
    //             Authorization : `Bearer ${localStorage.getItem("jwt")}`
    //         }
    //     });
    //     authAxios.put('/updatepic',{
    //         pic : url
    //     })
    //     .then(res=>{
    //         // console.log(res);
    //     })
    // }

    const updateProfilePic = (file)=>{
        setImage(file)
        
    }

    return(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin : "1.1rem 0",
               borderBottom :"0.5px solid gray"  
            }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={state ? state.pic : "Loading"}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update profile pic</span>
                        <input type="file" onChange={(e)=>updateProfilePic(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div>
                <h4> {state? state.name : "Loading ..."} </h4>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{myData?myData.length:"0"} posts</h6>
                    <h6> {state?state.followers.length:"0"} followers</h6>
                    <h6>{state?state.following.length:"0"} following</h6>
                </div>
            </div>
            </div>
             <div className="gallery">
               {
                   myData?.map((pics)=>{
                       return(
                           <img src={pics.photo} className="item" key={pics._id} alt={pics.title} />
                       )
                   })
               }
           </div>
        </div>
    )
}

export default Profile;