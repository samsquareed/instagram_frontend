import { useEffect, useState, useContext } from 'react';
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'
import img from '../assets/images/sam.jpg'
import Axios from 'axios'
import M from 'materialize-css'

const Home = () =>{

    const [data, setData] = useState([]);
    const [userComments, setuserComments] = useState([]);
    const {state,dispatch} = useContext(UserContext)

    const [comment, setComment] = useState("");

    useEffect(()=>{
        const authAxios = Axios.create({
            baseURL : 'http://localhost:3001',
            headers :{
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        authAxios.get('/allposts')
        .then(response=>{
            // console.log(response.data.posts);
            setData(response.data.posts);
            // console.log(data);
        })
    },[])


    const LikePost = (id)=>{
        //this id corresponds to Id of logged in user
        // console.log(id);
        const authAxios = Axios.create({
            baseURL : 'http://localhost:3001',
            headers :{
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        authAxios.put('/like',{
            postId : id
        }).then(response=>{
            // console.log(response.data);
            const newData = data.map(item=>{
                if(item._id == response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            //this is bcx after liking the pic, the data changes na, hence we are just updating that May be?
            setData(newData)
        }).catch(err=>console.log(err))
    }

     const UnLikePost = (id)=>{
         //this id corresponds to Id of logged in user
        //  console.log(id);
        const authAxios = Axios.create({
            baseURL : 'http://localhost:3001',
            headers :{
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        authAxios.put('/unlike',{
            postId : id
        }).then(response=>{
            // console.log(response);
            const newData = data.map(item=>{
                if(item._id == response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
            
        }).catch(err=>console.log(err))
    }

    const handleComment = (text,id)=>{
        // console.log(comment);
        // console.log(text, id);
        const authAxios = Axios.create({
            baseURL : 'http://localhost:3001',
            headers :{
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        authAxios.put('/comment',{
            text : text,
            postedBy : id
        }).then(response=>{
            // console.log("response.data._id : "+response.data._id);
            // setuserComments(response.data.comments);
            const newData = data.map(item=>{
                if(item._id == response.data._id){
                    // console.log("item._id : "+ item._id);
                    // console.log(response.data);
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
            // console.log(data);
        })
    }


    const handleDelete = (postId)=>{
        // console.log(postId);
        const authAxios = Axios.create({
            baseURL : 'http://localhost:3001',
            headers :{
                Authorization : `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        authAxios.delete(`/delete/${postId}`)
        .then(response=>{
            // console.log(response.data);
            if(response.data){
                M.toast({html:"Deleted post Successfully",classes:"#43a047 green darken-1"})
            }
            const updatedData = data.filter(item=>{
                return item._id !=response.data._id;
            })
            // here have to check what allposts route is returning so that same type of
            //data needs to be set after the delete
            setData(updatedData)
        })

    }

    return(
        <div className="home">
            {
                data?.map((item)=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> 
                            {item.postedBy._id == state._id 
                            && <i className="material-icons" style={{
                                float:"right"
                            }} 
                            onClick={()=>handleDelete(item._id)}
                            >delete</i>

                            }</h5>
                            <div className="card-image">
                                <img 
                                    src={item.photo} alt="" 
                                />
                            </div>
                            <div className="card-content">
                                <i className="material-icons like" style={{color : "red"}} >favorite</i>
                                {item.likes.includes(state._id)
                                ? 
                                <i className="material-icons"
                                    onClick={()=>{UnLikePost(item._id)}}
                                >thumb_down</i>
                                : 
                                <i className="material-icons"
                                onClick={()=>{LikePost(item._id)}}
                                >thumb_up</i>
                                }
                                <h6> {item.likes.length} likes </h6>
                                <h6>{item.title}</h6>
                                <p> {item.caption} </p>
                                {
                                    item.comments.map((record,id)=>{
                                        return(
                                            <h6 key={id}> <span style={{fontWeight:"500"}}>{record.postedBy.name}</span> : {record.text} </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    handleComment(e.target[0].value,item._id)
                                }}>
                                  <input type="text" placeholder="Leave a comment" />  
                                </form>
                            </div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}

export default Home;