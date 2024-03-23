import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddAddress() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            country: "",
            fullAddress: "",
            postalCode: ""
        },
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
            http.post("/address", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/addresses");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Address
            </Typography>
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
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddAddress;