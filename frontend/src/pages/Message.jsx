import React, { useEffect, useState, useRef } from "react";
import Chat from "../components/Chat";
import { useDispatch, useSelector } from "react-redux";
import Conversations from "../components/Conversations";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

const Message = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [conversations, setConversation] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [error, setError] = useState(false);
  const [trackConversation, setTrackConversation] = useState({
    sender: "",
    receiver: "",
    conversationActive: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setConversationLoading(true);
        const res = await fetch(`/api/conversation/${currentUser._id}`);
        const getConversations = await res.json();

        if (getConversations.success === false) {
          setConversationLoading(false);
          toast.error(getConversations.message, {
            autoClose: 5000,
          });
          setError(true);
          dispatch(signoutSuccess());
        } else {
          setConversationLoading(false);
          setConversation(getConversations);
        }
      } catch (error) {
        setConversationLoading(false);
        toast.error(error.message, {
          autoClose: 5000,
        });
        setError(true);
        console.log(error);
      }
    })();
  }, [currentUser._id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [trackConversation.conversationActive]);
  
  

  return (
    <>
      <ToastContainer />
      <section className="main_container">
        {error ? (
          <div>
            <p className="bg-white text-center text-sm sm:text-xl mt-20 font-heading font-bold flex flex-col items-center justify-center max-w-3xl mx-auto py-10 text-black px-5 rounded shadow-md">
              <span className="text-red-600">
                Your session has expired. Please log in again to continue.{" "}
              </span>
              <button
                className="group relative inline-flex items-center overflow-hidden rounded bg-brand-blue px-6 py-2 mt-5 text-white "
                onClick={() => navigate("/login")}
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  <svg
                    className="h-5 w-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>

                <span className="text-sm font-medium transition-all  group-hover:me-4">
                  Login
                </span>
              </button>
            </p>
          </div>
        ) : (
          <div>
            {conversations.length === 0 ? (
              <div>
                <p className="bg-white text-center text-sm sm:text-2xl mt-20 mb-10 font-heading font-bold flex flex-col items-center justify-center max-w-3xl mx-auto py-10 text-black px-5 rounded shadow-md">
                  <span> No messages to display. Start a conversation!</span>
                </p>
              </div>
            ) : (
              <div className="chats_container custom_scrollbar grid grid-cols-12 ">
                <div className="chat_people_container bg-white col-span-3  py-4 sm:py-5 flex sm:items-start items-center justify-start flex-col gap-2 overflow-y-scroll ">
                  {conversationLoading ? (
                    <div className="w-full">
                      <p className="text-center mt-10 font-bold font-heading text-sm text-black">
                        Conversations Loading
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className=" mx-auto px-2 mb-3 sm:px-3 text-sm sm:text-[22px] font-medium text-black">
                        Conversations
                      </h3>
                      {conversations.length !== 0 &&
                        conversations.map((conversation) => (
                          <Conversations
                            conversationInfo={{
                              conversation,
                              trackConversation,
                              setTrackConversation,
                            }}
                            key={conversation._id}
                          />
                        ))}
                    </>
                  )}
                </div>

                <div
                  className="conversation_container col-span-9"
                  ref={chatContainerRef}
                >
                  {trackConversation.conversationActive ? (
                    <Chat
                      conversationInfo={{
                        trackConversation,
                        setTrackConversation,
                        conversations,
                        setConversation,
                      }}
                    />
                  ) : (
                    <p className="mt-20 text-sm sm:text-2xl font-medium text-center text-black ">
                      Select and Start Conversation!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Message;