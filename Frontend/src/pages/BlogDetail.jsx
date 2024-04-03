import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, CircularProgress, IconButton, Input } from '@mui/material';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import isObjectEmpty from "../functions/isObjectEmpty.";
import { toast } from "react-toastify";
import { addComment, addReply, updateComment } from "../redux/slices/currentBlogsSlice";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';



const BlogDetail = () => {
    const [blog, setBlog] = useState([]);
    const [comments, setComments] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [c, setC] = useState('');
    const replyFieldRef = useRef(null);
    const [replyContent, setReplyContent] = useState('');
    const [activeCommentId, setActiveCommentId] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const blogsInTheStore = useSelector((state) => state.currentBlogs.value);
    const userInTheStore = useSelector((state) => state.currentUser.value);
    const storeComments = useSelector((state) => state.currentBlogs.comments);
    const commentsInTheStore = Object.values(storeComments); //changing object to array
    const [emojiVisbility, setEmojiVisbility] = useState(false);

    const toggleReply = (commentId) => {
        setActiveCommentId(activeCommentId === commentId ? null : commentId);
    };

    const submitReply = async (commentId) => {
        if (isObjectEmpty(userInTheStore)) {
            toast.warn("Sign in or sign up to make a reply.")
        } else {
            if (replyContent.trim().length != '') {
                const newReplyForDb = {
                    content: replyContent,
                    userId: userInTheStore.userId,
                };

                const newReplyForStore = {
                    _id: Math.floor(1000 + Math.random() * 9000),
                    blogId: blog._id,
                    content: replyContent,
                    userId: {
                        _id: userInTheStore.userId,
                        avatar: userInTheStore.avatar,
                        name: userInTheStore.userName,
                    },
                }
                setReplyContent('');

                dispatch(addReply({ commentId: commentId, replyContent: newReplyForStore }))
                await axios.post(`http://localhost:5000/api/user/reply/${commentId}`, newReplyForDb);

                setActiveCommentId(null); // Close reply box
            }
        }
    };

    useEffect(() => {
        setBlog(blogsInTheStore.find(blog => blog._id == id));
    }, [])

    useEffect(() => {
        const filteredComments = commentsInTheStore.filter(comment => comment.blogId === id);
        if (JSON.stringify(comments) !== JSON.stringify(filteredComments)) {
            setComments(filteredComments);
        }
    }, [commentsInTheStore])

    useEffect(() => {
        function handleClickOutside(event) {
            if (replyFieldRef.current && !replyFieldRef.current.contains(event.target)) {
                setActiveCommentId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isObjectEmpty(userInTheStore)) {
            toast.warn("login or sign up to comment")
        } else {
            if (c.trim().length != "") {
                const commentForStore = {
                    _id: Math.floor(1000 + Math.random() * 9000),
                    content: c,
                    blogId: blog._id,
                    userId: {
                        _id: userInTheStore.userId,
                        name: userInTheStore.userName,
                        avatar: userInTheStore.avatar,
                    },
                    replies: [],
                }
                dispatch(addComment(commentForStore));

                const commentForDb = {
                    content: c,
                    blogId: blog._id,
                    userId: userInTheStore.userId,
                }

                try {
                    const postedComment = await axios.post("http://localhost:5000/api/user/comment", commentForDb)
                    dispatch(updateComment({ com: commentForStore._id, newCom: postedComment.data.postedComment }));
                    setC("");
                }
                catch (err) {
                    console.log("error", err)
                }
            }
        }

    }

    const toggleExpand = (id) => {
        if (expanded === id) {
            setExpanded(null);
        } else {
            setExpanded(id);
        }
    };


    if (!blog) {
        return <div className="flex justify-center items-center h-screen">
            <CircularProgress color="inherit" />
        </div>
    }

    // console.log("comments of this store", commentsInTheStore);
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 pb-8 mx-4">
            <Link to={'/'} className="block lg:ml-24 p-4">
                <ArrowBackIcon className="text-gray-600 hover:text-blue-500" style={{ fontSize: '2rem' }} />
            </Link>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <article className="max-w-4xl w-full p-8 lg:ml-20 bg-gray-950 text-gray-100 rounded-lg shadow-lg flex-shrink">
                    <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                    <span>Written by:</span>
                    <span className="font-bold mb-2 text-orange-700 capitalize"> {blog.author}</span>
                    <hr />
                    <div className=" text-lg whitespace-pre-line pt-4">
                        {blog.content}
                    </div>
                </article>

                <div className="p-8 lg:w-1/3 md:w-8/12 max-w-4xl h-screen bg-gray-950 text-gray-100 rounded-lg shadow-lg">
                    <div className="pb-4 pt-2">
                        <div className="bg-zinc-900 h-fit rounded-3xl p-4 h-32">
                            <h1 className="text-xl font-light text-orange-500">About the author</h1>
                            <div className="pl-3">

                                <p>{blog.author}</p>
                                <p></p>
                            </div>

                        </div>
                    </div>
                    <div className="mb-4">
                        <h1 className="text-xl font-light">Comments </h1>
                        <hr className="mt-1" />
                    </div>

                    <div className="h-96 overflow-y-scroll overflow-x-hidden">
                        {(comments.length < 1) ? (<h1 className="text-gray-400">No comments here yet.</h1>) :
                            comments.map((comment) => (<div key={comment._id}>

                                <div className="flex flex-col gap-1">
                                    <div className="flex rounded-lg text-sm ">
                                        <Avatar src={`http://localhost:5000/uploads/${comment.userId.avatar}`} sx={{ width: 24, height: 24 }} className="mt-1.5" />
                                        <div className="flex px-2 pt-1">
                                            <p className="mr-2 font-bold">{comment.userId.name}</p>
                                            <div>
                                                <p onClick={() => toggleExpand(comment._id)} className="max-w-[200px] break-words">
                                                    {expanded === comment._id ? comment.content : comment.content.length > 50 ? `${comment.content.substring(0, 50)}...` : comment.content}
                                                </p>

                                                <div className="ml-6 flex" >
                                                    <button className="text-xs text-gray-400 mr-2 hover:text-gray-200" onClick={() => toggleReply(comment._id)}>Reply</button>
                                                    {activeCommentId === comment._id && (
                                                        <div ref={replyFieldRef}>
                                                            <Input
                                                                placeholder="Reply here"
                                                                inputProps={{
                                                                    style: { color: 'white', fontSize: '0.8rem' },
                                                                }}
                                                                onChange={e => setReplyContent(e.target.value)}
                                                            />
                                                            <Button onClick={() => submitReply(comment._id)}>
                                                                Post
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div >
                                        {(comment.replies) ? comment.replies.map((reply, index) => (<div key={index} className="flex ml-16 my-1">

                                            <Avatar src={`http://localhost:5000/uploads/${reply.userId.avatar}`} sx={{ width: 24, height: 24 }} />

                                            <div className="flex pl-2 pr-2 mt-0.5 leading-none text-sm">
                                                <p className="mr-2 font-bold">{reply.userId.name}</p>
                                                <div className="">
                                                    <p onClick={() => toggleExpand(index)} className="max-w-[200px] break-words">
                                                        {expanded === index ? reply.content : reply.content.length > 50 ? `${reply.content.substring(0, 50)}...` : reply.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>)) : null
                                        }
                                    </div>
                                </div>
                            </div>
                            ))

                        }
                    </div>

                    <div>
                        <hr />
                        <IconButton>
                            <FavoriteOutlinedIcon sx={{ color: 'red' }} />
                        </IconButton>
                        <p className="text-sm pl-1"> {blog.likes} Likes</p>
                        <hr className="mb-3" />

                        <div className="flex">
                            <div className="relative" >
                                <button onClick={() => setEmojiVisbility(!emojiVisbility)} className="pt-1.5 z-10 mr-3"><SentimentSatisfiedIcon /></button>
                                <div className="absolute z-20 inset-x-0 top-10 mt-[buttonHeight]">
                                    {emojiVisbility && <Picker data={data} onEmojiSelect={e => setC(c => `${c}${e.native}`)} previewPosition="none" />}
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="flex">
                                <Input
                                    inputProps={{
                                        style: { color: 'white', width: '300px' },
                                        'aria-label': 'description'
                                    }}
                                    fullWidth
                                    placeholder="Add a comment..."
                                    value={c}
                                    onChange={e => setC(e.target.value)}
                                />
                                <Button type="submit">
                                    Post
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default BlogDetail;
