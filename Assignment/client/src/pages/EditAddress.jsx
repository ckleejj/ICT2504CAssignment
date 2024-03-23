import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditAddress() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        title: "",
        country: "",
        fullAddress: "",
        postalCode: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/address/${id}`).then((res) => {
            setAddress(res.data);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: address,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim().max(100, "Title must be at most 100 characters").required("Title is required"),
            country: yup.string().trim().max(100, "Country must be at most 100 characters").required("Country is required"),
            fullAddress: yup.string().trim().max(500, "Full Address must be at most 500 characters").required("Full Address is required"),
            postalCode: yup.string().trim().max(20, "Postal Code must be at most 100 characters").required("Postal Code is required")

        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.country = data.country.trim();
            data.fullAddress = data.fullAddress.trim();
            data.postalCode = data.postalCode.trim();
            http.put(`/address/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/addresses");
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAddress = () => {
        http.delete(`/address/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/addresses");
            });
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Address
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Country"
                            name="country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.country && Boolean(formik.errors.country)}
                            helperText={formik.touched.country && formik.errors.country}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={4}
                            label="Full Address"
                            name="fullAddress"
                            value={formik.values.fullAddress}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullAddress && Boolean(formik.errors.fullAddress)}
                            helperText={formik.touched.fullAddress && formik.errors.fullAddress}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Postal Code"
                            name="postalCode"
                            value={formik.values.postalCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                            helperText={formik.touched.postalCode && formik.errors.postalCode}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Address
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Address?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteAddress}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditAddress;