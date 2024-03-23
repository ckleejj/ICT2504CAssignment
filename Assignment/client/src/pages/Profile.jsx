import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Typography, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import http from '../http';
import { useNavigate } from 'react-router-dom';

function Profile() {

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const nameFormik = useFormik({
        initialValues: {
            name: '' ,
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Name only allow letters, spaces and characters: ' - , ."),
        }),
        onSubmit: async (data) => {
            data.name = data.name.trim();
            await http.post("/user/profile", data)
                .then((res) => {
                    console.log(user);
                    let updatedUser = Object.assign({}, user);
                    updatedUser.name = data.name;
                    setUser(updatedUser);
                    toast(`Name successfully changed to ${updatedUser.name}`)
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                    console.log(err.response);
                });
        }});

        const emailFormik = useFormik({
            initialValues: {
                email: '',
            },
            validationSchema: yup.object({
                email: yup.string().trim()
                    .email('Enter a valid email')
                    .max(50, 'Email must be at most 50 characters')
                    .required('Email is required'),
            }),
            onSubmit: async (data) => {
                data.email = data.email.trim().toLowerCase();
                http.post("/user/profile", data)
                    .then((res) => {
                        console.log(res.data);
                        let updatedUser = Object.assign({}, user);
                        updatedUser.email = data.email;
                        setUser(updatedUser);
                        toast(`Email successfully changed to ${updatedUser.email}`)
                    })
                    .catch(function (err) {
                        toast.error(`${err.response.data.message}`);
                        console.log(err.response);
                    });
            }
    });

    return (
        <>
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Update Name
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={nameFormik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Name"
                    name="name"
                    value={nameFormik.values.name}
                    onChange={nameFormik.handleChange}
                    onBlur={nameFormik.handleBlur}
                    error={nameFormik.touched.name && Boolean(nameFormik.errors.name)}
                    helperText={nameFormik.touched.name && nameFormik.errors.name}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    type="submit">
                    Update Name
                </Button>
            </Box>
            <ToastContainer />
        </Box>

        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Update Email
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={emailFormik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Email"
                    name="email"
                    value={emailFormik.values.email}
                    onChange={emailFormik.handleChange}
                    onBlur={emailFormik.handleBlur}
                    error={emailFormik.touched.email && Boolean(emailFormik.errors.email)}
                    helperText={emailFormik.touched.email && emailFormik.errors.email}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    type="submit">
                    Update Email
                </Button>
            </Box>
            <ToastContainer />
        </Box>
        </>
    )
}

export default Profile;