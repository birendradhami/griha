import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useCookies } from "react-cookie";
import PropTypes from "prop-types"; // Import PropTypes

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [cookies] = useCookies(["access_token"]);
  const accessToken = cookies["access_token"];
  const [onlineStatus, setOnlineStatus] = useState("Online");
  const [onOff, setOnOff] = useState(null);
  const [uid, setUid] = useState(null);
  const [colorA, setColorA] = useState(null);
  const [colorR, setColorR] = useState(null);
  const [colorAB, setColorAB] = useState(null);
  const [colorRB, setColorRB] = useState(null);
  

  useEffect(() => {
    if (accessToken) {
      const newSocket = io("http://localhost:5000", {
        auth: {
          token: accessToken,
        },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [accessToken]);
  useEffect(() => {
    const handleOnlineStatus = (data) => {
      // console.log(`User ${data.userID} is ${data.status}`);
      setOnlineStatus(data.status);
      setOnOff(data.onOff);
      setUid(data.userID);
      setColorR(data.colorR);
      setColorA(data.colorA);
      setColorRB(data.colorRB);
      setColorAB(data.colorAB);
      
    };
    if (socket) {
      socket.on("getOnlineUser", handleOnlineStatus);
      socket.on("getOfflineUser", handleOnlineStatus);

      return () => {
        socket.off("getOnlineUser", handleOnlineStatus);
        socket.off("getOfflineUser", handleOnlineStatus);
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{colorAB,colorRB, colorA, colorR,uid, onOff, onlineStatus, socket }}
    >
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
