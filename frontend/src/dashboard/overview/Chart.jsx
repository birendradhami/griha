import moment from "moment";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import isAdmin from "../utils/isAdmin.js";
import { Box } from "@mui/material";

const months = 5;
const today = new Date();
const tempData = [];
for (let i = 0; i < months; i++) {
  const date = new Date(
    today.getFullYear(),
    today.getMonth() - (months - (i + 1))
  );
  tempData.push({
    date,
    name: moment(date).format("MMM YYYY"),
    users: 0,
    rooms: 0,
  });
}

export default function Chart() {
  const { currentUser, users, rooms } = useSelector((state) => state.user);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (isAdmin(currentUser)) {
      for (let i = 0; i < months; i++) {
        tempData[i].users = 0;
      }
      users.forEach((user) => {
        for (let i = 0; i < months; i++) {
          if (moment(tempData[i].date).isSame(user?.createdAt, "month"))
            return tempData[i].users++;
        }
      });
      setData([...tempData]);
    }
  }, [users, currentUser]);

  useEffect(() => {
    for (let i = 0; i < months; i++) {
      tempData[i].rooms = 0;
    }

    if (isAdmin(currentUser)) {
      rooms.forEach((room) => {
        for (let i = 0; i < months; i++) {
          if (moment(tempData[i].date).isSame(room?.createdAt, "month"))
            return tempData[i].rooms++;
        }
      });
    } else {
      rooms
        .filter((room) => room.userRef === currentUser._id)
        .forEach((room) => {
          for (let i = 0; i < months; i++) {
            if (moment(tempData[i].date).isSame(room?.createdAt, "month"))
              return tempData[i].rooms++;
          }
        });
    }

    setData([...tempData]);
  }, [rooms, currentUser]);

  return (
    <Box sx={{ width: "100%", height: 290, minWidth: 250,"@media (max-width: 600px)": {
      height:250
    }, }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {isAdmin(currentUser) && (
            <Area
              type="monotone"
              dataKey="users"
              stackId="1"
              stroke="#000000"
              fill="#000000"
            />
          )}

          <Area
            type="monotone"
            dataKey="rooms"
            stackId="1"
            stroke="#0000000"
            fill="#808080"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
