import React, { useEffect, useState } from "react";
import { BsSend } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

const Contact = ({ listing }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [ownerInfo, setOwnerInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [responseMsg, setResponseMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [messageSendSuccess, setMessageSendSuccess] = useState(false);
  const { colorAB, colorRB, colorA, colorR, uid, onOff, onlineStatus, socket } =
    useSocket();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/users/${listing.userRef}`);
      const json = await res.json();
      if (json.success === false) {
        setLoading(true);
      } else {
        setOwnerInfo(json);
        setLoading(false);
      }
    })();
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMsg = async () => {
    if (!currentUser) {
      localStorage.setItem("redirectPath", "/message");
      return navigate("/login");
    }

    const conversationApiData = {
      creatorId: currentUser._id,
      participantId: listing.userRef,
      chatPartner: ownerInfo,
      chatCreator: currentUser,
    };

    try {
      setSending(true);
      const res = await fetch("/api/conversation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversationApiData),
      });
      const json = await res.json();
      if (json.success === false) {
        setResponseMsg("Message sending failed. Try again!");
        setSending(false);
      } else {
        const resMsg = await fetch("/api/message/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: currentUser._id,
            receiver: listing.userRef,
            message: message,
          }),
        });
        const msgJson = await resMsg.json();
        if (msgJson.success === false) {
          setResponseMsg("Message sending failed. Try again!");
          setSending(false);
        } else {
          setResponseMsg(msgJson);
          setMessageSendSuccess(true);
          setSending(false);
          navigate(localStorage.getItem("redirectPath"));
          localStorage.removeItem("redirectPath");
        }
      }
    } catch (error) {
      console.log(error);
      setSending(false);
    }
  };

// online offline status
  useEffect(() => {
    if (uid === ownerInfo._id) {
      const element1 = document.getElementById(uid + "status");
      const element2 = document.getElementById(uid + "border");

      if (element1) {
        element1.innerHTML = onlineStatus;
        element1.classList.remove(colorR);
        element1.classList.add(colorA);
      }
      if (element2) {
        element2.classList.remove(colorRB);
        element2.classList.add(colorAB);
      }
    }
  }, [uid, colorAB, colorRB, colorR, colorA, onlineStatus]);

  return (
    <>
      {loading ? (
        "Loading"
      ) : (
        <div className="contact_component">
          <div className="property_owner mt-10">
            <div className="image_container flex items-center justify-start gap-2">
              {ownerInfo.onlineOffline == 1 ? (
                <div
                  className={`h-16 w-16 rounded-full border-[3px] shadow-lg border-green-500`}
                  id={`${ownerInfo._id}border`}
                >
                  <img
                    src={ownerInfo.avatar}
                    alt="Room Owner"
                    className="h-full w-full rounded-full"
                  />
                </div>
              ) : (
                <div
                  className={`h-16 w-16 rounded-full border-[3px] shadow-lg border-gray-500`}
                  id={`${ownerInfo._id}border`}
                >
                  <img
                    src={ownerInfo.avatar}
                    alt="Room Owner"
                    className="h-full w-full rounded-full"
                  />
                </div>
              )}
              <div className="title">
                {ownerInfo.onlineOffline == 1 ? (
                  <div className="text-green-500" id={`${ownerInfo._id}status`}>
                    Online
                  </div>
                ) : (
                  <div className="text-gray-500" id={`${ownerInfo._id}status`}>
                    Offline
                  </div>
                )}
               
                <h3 className="text-lg text-black font-bold capitalize truncate">
                  {ownerInfo.username}
                </h3>
                <p className="font-content font-bold ,text-sm text-gray-500">
                  Room Owner
                </p>
              </div>
            </div>
          </div>
          {sending ? (
            <div>
              <p className="text-black font-heading text-left flex items-center justify-start mt-5">
                <BsSend className="mr-2" />
                Sending
              </p>
            </div>
          ) : (
            <div className="contact_form mt-5">
              {messageSendSuccess ? (
                <div>
                  <p className="text-black font-heading text-left">
                    {responseMsg}
                  </p>
                  <Link to={"/message"}>
                    <button className="text-sm font-heading mt-2 px-5 py-2 bg-black text-white rounded-md duration-300">
                      Go to your  messages
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <textarea
                    id="message"
                    type="text"
                    placeholder="Write your message"
                    name="message"
                    className="form_input border-[1px] border-gray-400 text-black  focus:border-black h-44 rounded-md placeholder:text-sm mt-3"
                    onChange={handleChange}
                  />
                  {currentUser ? (
                    <button
                      disabled={!message}
                      onClick={handleSendMsg}
                      className="w-full px-2 py-3 text-lg font-heading text-white bg-black disabled:bg-black/60"
                    >
                      Send Messages
                    </button>
                  ) : (
                    <Link to="/login">
                      <button className="w-full px-2 py-3 text-lg font-heading text-white bg-black">
                        Login to Send
                      </button>
                    </Link>
                  )}
                  <p className="text-red-600 font-heading text-left">
                    {responseMsg}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Contact;
// export { ownerInfo };
