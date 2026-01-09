import React, { useEffect, useState } from "react";
import Logout from './../logout';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import "./profile.scss";

export default function ProfilePage() {
    let navigate = useNavigate();
    const [user, setUser] = useState();

    // fetching items from localstorage
    useEffect(() => {
        console.log("Rerender");
        if (!localStorage.getItem('curUser')) {
            navigate('/signin');
        }
        else
            setUser(JSON.parse(localStorage.getItem("curUser")));
    }, [user])


    const rows = [
        ['First Name', user ? user.firstName : null],
        ['Last Name', user ? user.lastName : null],
        ['User Name', user ? user.userName : null],
        ['Email', user ? user.email : null],
        ['Alt Email', user ? user.altEmail : null],
        ['Mobile', user ? user.mobile : null],
        ['Alt Mobile', user ? user.altMobile : null],
    ];

    return (
        <>
            {
                user
                    &&
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Change the size to fit the parent element of this div
                        width: '100%',
                        height: '100%',
                    }}>
                        <Paper sx={{ minWidth: 350, backgroundColor: '#fff', m: 2 }}>
                            <Typography variant="h4" component="h4" sx={{ mx: 2, pt: 3, mb: 2 }}>
                                User Profile
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {rows.map((e) => {
                                            return (
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography
                                                            sx={{ fontSize: 15 }}
                                                            variant="subtitle1"
                                                            color="textSecondary"
                                                        >
                                                            {e[0]}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            sx={{ fontSize: 15 }}
                                                            variant="subtitle1"
                                                            color="textSecondary"
                                                        >
                                                            :
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontSize: 15 }}> {e[1]}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <Button sx={{ m: 2 }} variant="contained" onClick={()=>{localStorage.clear(); setUser()}}>Logout</Button>
                                {/* <Logout /> */}
                            </TableContainer>
                        </Paper>
                    </div>}

        </>
    );
}
