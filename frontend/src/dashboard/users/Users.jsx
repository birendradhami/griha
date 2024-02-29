import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import moment from "moment";
import { grey } from "@mui/material/colors";
import UsersActions from "./UsersActions";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "./UsersActions";

const Users = ({ setSelectedLink, link }) => {
  const { currentUser, users } = useSelector((state) => state.user);

  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedLink(link);
    getUsers(dispatch, currentUser);
  }, [currentUser]);

  const processRowUpdate = (params) => {
    setRowId(params.id);
  };

  const columns = useMemo(
    () => [
      {
        field: "avatar",
        headerName: "Avatar",
        width: 60,
        renderCell: (params) => <Avatar src={params.row.avatar} />,
        sortable: false,
        filterable: false,
      },
      { field: "username", headerName: "Name", width: 170 },
      { field: "email", headerName: "Email", width: 200 },
      {
        field: "role",
        headerName: "Role",
        width: 100,
        type: "singleSelect",
        valueOptions: ["basic", "admin"],
        editable: true,
      },
      {
        field: "active",
        headerName: "Active",
        width: 100,
        type: "boolean",
        editable: true,
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  return (
    <Box
      sx={{
        height: 400,
        width: "fit-content",
        mx:'auto',
        "@media (max-width: 1024px)": {
          height: 350,
          width: "100%",
        },
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{
          fontSize: 38,
          fontWeight: 400,
          textAlign: "center",
          mt: 3,
          mb: 6,
          "@media (max-width: 1024px)": {
           fontSize:30,
           fontWeight:400
          },
        }}
      >
        Manage Users
      </Typography>
      <DataGrid
        columns={columns}
        rows={users || []}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        editMode="cell"
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        onCellEditStop={processRowUpdate}
      />
    </Box>
  );
};

export default Users;
