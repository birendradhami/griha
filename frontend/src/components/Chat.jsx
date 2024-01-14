import React, { useEffect, useRef, useState } from 'react';
import { BsFillSendFill, BsImage  ,BsX} from "react-icons/bs";
import { useSelector } from 'react-redux';
import { socket } from './SocketConnection';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import Conversations from './Conversations';
import userSlice from '../redux/user/userSlice';
import { RiRadioButtonLine } from "react-icons/ri";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';

const Chat = ({ conversationInfo }) => {
    const { currentUser } = useSelector(state => state.user)
    const [messageText, setMessageText] = useState([])
    const [typedMessage, setTypedMessage] = useState("")
    const [IsSendingError, setSendingError] = useState(false);
    const scrollRef = useRef();
    const [socketMessages, setSocketMessages] = useState([])
    const [messageLoading, setMessageLoading] = useState(false)

    const { trackConversation, setTrackConversation, conversations, setConversation, } = conversationInfo;
    const { chatCreator, chatPartner, _id } = trackConversation.conversation;
    const fileRef = React.createRef();

    //
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const emojiPickerRef = useRef(null);
    const socketRef =useRef();
    const [file, setFile] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [base64Image, setBase64Image] = useState(null);

    const handleEmojiClick = (emojiObject) => {
        setSelectedEmoji(emojiObject);
        setTypedMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };


    const handleIgnoreClick = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //----- Load User Messages
    useEffect(() => {
        (async () => {
            try {
                setMessageLoading(true)
                const res = await fetch(`/api/message?sender=${trackConversation.sender}&receiver=${trackConversation.receiver}`)
                const getMessages = await res.json();

                if (getMessages.success === false) {
                    setMessageLoading(false)
                    console.log(getMessages.message);
                }
                else {
                    setMessageLoading(false)
                    setMessageText(getMessages)
                }
            } catch (error) {
                setMessageLoading(false)
                console.log(error);
            }
        })()

    }, [trackConversation])



    //====== Join Sockets Room Here =======//
    useEffect(() => {
        socket.emit("join_room", trackConversation.chatId)
    }, [trackConversation])


    //----- Get Message from socket
    useEffect(() => {
        socket.on("receive_message", (socketMsg) => {
            setSocketMessages([...socketMessages,
            {
                message: socketMsg.message,
                type: "received",
                chatId: socketMsg.chatId,
                image: base64Image,
            }
            ])
        })
    })





    //====== Send Message To Socket ========//
    const sendMessageTOSocket = () => {
        socket.emit('send_message',
            {
                chatId: trackConversation.chatId,
                message: typedMessage,
                from: currentUser._id,
                to: trackConversation.conversationActive
            });


        setSocketMessages([...socketMessages,
        {
            message: typedMessage,
            type: "send",
            chatId: trackConversation.chatId
        }])

        setTypedMessage("")
    };







    // Handle Message Sending //
    const handleSendMsg = async (e) => {
        e.preventDefault();
        sendMessageTOSocket();
      
        try {
            
            const sendMsgToDB = await fetch("/api/message/create", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        sender: currentUser._id,
                        receiver: trackConversation.conversationActive,
                        message: typedMessage
                    }
                )
            });
        
            const response = await sendMsgToDB.json();
            //===checking Message request success or not ===//
            if (response.success === false) {
                setSendingError(true)
            }
            else {
                setSendingError(false)
            }
        } catch (error) {
            setSendingError(true)
            console.log(error);
        }
    
   
    }
  


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [socketMessages, messageText])


    const handleConversationDelete = async () => {
        try {
            const deleteChat = await fetch(`/api/conversation/delete/${_id}`, {
                method: 'DELETE'
            });
            if (deleteChat.ok) {
                const restConversation = conversations.filter(conversation => conversation._id !== _id)
                setConversation(restConversation)
                setTrackConversation({
                    ...trackConversation,
                    conversationActive: "",
                })
            } else {
                const errorRes = await deleteChat.json();
                toast.error(errorRes.message, {
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.error(error.message, {
                autoClose: 2000,
            });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    
        if (selectedFile) {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                // The result attribute contains the base64-encoded string
                const base64String = reader.result;
                // Do something with the base64String (e.g., set it in state)
                setBase64Image(base64String);
                console.log(base64String)
            };
    
            // Read the selectedFile as a Data URL (base64)
            reader.readAsDataURL(selectedFile);
    
            setShowImagePreview(true);
            console.log(selectedFile);
        }
    };
    

      const handleDiscardImage = () => {
        setFile(null);
        setShowImagePreview(false);
        // Optionally, you can clear the file input value
        if (fileRef.current) {
          fileRef.current.value = null;
        }
      };
    return (
        <>
            {
                messageLoading
                    ?
                    <div className='w-full'>
                        <p className='text-center mt-20 font-bold font-heading text-sm text-black'>Messages Loading...</p>
                    </div>
                    :
                    <div className="conversation_container bg-white  ">
                        <div className="chat_person_container  grid grid-cols-2 bg-white shadow-sm items-center px-5 py-3 border-b border-">
                            <div className="chat_user flex items-center justify-center sm:justify-start sm:flex-row sm:gap-4 gap-1 duration-300    ">
                                <img
                                    className='h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-brand-blue'
                                    src={chatPartner._id === currentUser._id ? chatCreator.avatar : chatPartner.avatar}
                                    alt="user image" />
                                <p className=' sm:block text-black font-semibold font-heading text-sm truncate'>
                                    {chatPartner._id === currentUser._id ? chatCreator.username : chatPartner.username}
                                </p>
                      
                            </div>
                            <div className="show_user_listing flex items-center justify-end">
                                <button
                                    onClick={handleConversationDelete}
                                    className='font-heading  text-sm py-2 px-5 text-red-700'>
                                    <span className='flex items-center'>
                                        <MdDelete className='text-red-700' />
                                        Delete
                                    </span>
                                </button>
                            </div>
                        </div>



                        <div className='textbar_message'>
                            <div className="message_container grid grid-rows-1 items-end overflow-y-scroll px-5 py-0 ">

                                {
                                    messageText.map((msg, index) =>
                                        msg.sender === currentUser._id ?
                                            <div
                                                key={index}
                                                className={`flex ${currentUser._id === msg.sender ? "items-end" : "items-start"} w-full flex-col justify-end`}
                                            >
                                                <div className="User_chat  mt-2 ">
                                                    <p
                                                        ref={scrollRef}
                                                        className='text-lg font-normal bg-blue-900/80 px-2 text-white py-1 rounded-md'>
                                                        {msg.message}
                                                    </p>

                                                </div>

                                            </div>
                                            :
                                            <div
                                                key={index}
                                                className={`flex ${currentUser._id === msg.sender ? "items-end" : "items-start"} w-full flex-col justify-end`}
                                            >
                                                <div className="User_chat flex items-center gap-2 mt-2 ">
                                                    <img
                                                        className='h-8 w-8 rounded-full'
                                                        src={chatPartner._id === currentUser._id ? chatCreator.avatar : chatPartner.avatar}
                                                        alt="chat partner image" />
                                                    <p
                                                        ref={scrollRef}
                                                        className='text-lg font-normal bg-blue-500 px-2 text-white py-1 rounded-md'>
                                                        {msg.message}
                                                    </p>
                                                    
                                                </div>
                                            </div>
                                    )

                                }

                                {
                                    socketMessages.length !== 0 && socketMessages.map((msg, index) => (
                                        msg.chatId === trackConversation.chatId &&
                                        <div key={index}>
                                            {
                                                msg.type === "send" ?
                                                    <div
                                                        key={index}
                                                        className={`flex items-end w-full flex-col justify-end`}
                                                    >
                                                        <div className="User_chat  mt-2 ">
                                                            <p
                                                                ref={scrollRef}
                                                                className='text-lg font-normal bg-blue-900/80 px-2 text-white py-1 rounded-md'>
                                                                {msg.message}
                                                            </p>

                                                        </div>

                                                    </div>
                                                    :
                                                    <div
                                                        key={index}
                                                        className={`flex items-start w-full flex-col justify-end`}
                                                    >
                                                        <div className="User_chat flex items-center gap-2 mt-2 ">
                                                            <img
                                                                className='h-8 w-8 rounded-full'
                                                                src={chatPartner._id === currentUser._id ? chatCreator.avatar : chatPartner.avatar}
                                                                alt="chat partner image" />
                                                            <p
                                                                className='text-lg font-normal bg-blue-500 px-2 text-white py-1 rounded-md'>
                                                                {msg.message}
                                                            </p>
                                                          
                                                        </div>
                                                        
                                                    </div>
                                            }
                                            
                                        </div>
                                    )

                                    )
                                }

                                {showImagePreview && (
                                    <div className="relative max-w-[100px] max-h-[100px] overflow-hidden">
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt="Selected"
                                        className="w-full h-auto"
                                      />
                                      <BsX
                                        onClick={handleDiscardImage}
                                        className="absolute top-0 right-0 cursor-pointer text-red-500"
                                      />
                                    </div>
                                  )}


                                {
                                    IsSendingError && <p className='text-red-700 font-content font-semibold'>Message sending failed!</p>
                                }
                                
                            </div>



                            <form onSubmit={handleSendMsg}>
                                <div className="textbar_container  w-full px-5 py-3 flex items-center gap-2 relative">
                                    <div className="attachment_container">
                                    
                                        <input
                                            onChange={handleFileChange}
                                            hidden accept='image/*'
                                            type="file" name="profile"
                                            id="profile_image"
                                            ref={fileRef}
                                        />
                                        <BsImage onClick={() => fileRef.current.click()} className='cursor-pointer'/>
                                      
                                    </div>
                                    <div className="input_container w-full">
                                    
                                
                                        <input
                                        
                                            onChange={(e) => setTypedMessage(e.target.value)}
                                            value={typedMessage}
                                            type="text"
                                            placeholder="Aa"
                                            className="w-full px-4 py-1 rounded-full border  placeholder:font-content placeholder:text-sm caret-h-2  bg-[#F0F2F5] caret-brand-blue border-brand-blue focus:outline-none"
                                          
                                        />
                                      

                                    </div>
                                    <div>
                                        <MdEmojiEmotions onClick={() => setShowEmojiPicker((prev) => !prev)} className="cursor-pointer transition-colors duration-300 hover:text-blue-500 " />
                                    </div>


                                    {showEmojiPicker && (
                                        <div ref={emojiPickerRef} className="absolute sm:bottom-5 md:bottom-6 lg:bottom-15 xl:bottom-[51px] 2xl:bottom-12 right-2 lg:left-50rem xl:left-50rem">

                                            <div className="relative ">

                                                <EmojiPicker
                                                    onEmojiClick={handleEmojiClick}
                                                    height={350}
                                                    width={300}
                                                   
                                                />

                                            </div>

                                        </div>
                                    )}

                                    <div className="send_btn ">
                                        <button
                                            type='submit'
                                            className='p-2 rounded-full hover:bg-gray-200 duration-300'>
                                            <BsFillSendFill className='text-brand-blue' />

                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <ToastContainer />

                    </div >
            }

        </>
    )
}

export default Chat