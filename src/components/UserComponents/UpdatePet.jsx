import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router";

const petCategories = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "other", label: "Other" },
];

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    age: Yup.string().required("Age is required"),
    category: Yup.object().required("Category is required"),
    location: Yup.string().required("Location is required"),
    shortDescription: Yup.string().required("Short description is required"),
    longDescription: Yup.string().required("Long description is required"),
});

const UpdatePet = () => {
    const { id } = useParams();
    const [petData, setPetData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/pets/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPetData({
                    name: data.name,
                    age: data.age,
                    category: petCategories.find((cat) => cat.value === data.category),
                    location: data.location,
                    shortDescription: data.shortDescription,
                    longDescription: data.longDescription,
                });
            })
            .catch((err) => {
                console.error("Failed to fetch pet data:", err);
                Swal.fire("Error", "Failed to load pet data", "error");
            });
    }, [id]);

    const handleSubmit = (values) => {
        fetch(`http://localhost:5000/pets/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...values,
                category: values.category.value,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                Swal.fire("Updated!", "Pet details updated successfully.", "success");
                navigate("/userDashboard/myPets");
            })
            .catch((err) => {
                console.error("Update failed:", err);
                Swal.fire("Error", "Failed to update pet", "error");
            });
    };

    if (!petData) return <p className="text-center mt-10">Loading pet details...</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Update Pet</h2>
            <Formik
                initialValues={petData}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, errors, touched, values }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold">Pet Name</label>
                            <Field
                                name="name"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Enter pet name"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block font-semibold">Pet Age</label>
                            <Field
                                name="age"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Enter pet age"
                            />
                            <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block font-semibold">Category</label>
                            <Select
                                options={petCategories}
                                name="category"
                                value={values.category}
                                onChange={(option) => setFieldValue("category", option)}
                                className="mt-2"
                            />
                            {errors.category && touched.category && (
                                <div className="text-red-500 text-sm">{errors.category}</div>
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold">Location</label>
                            <Field
                                name="location"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Enter pickup location"
                            />
                            <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block font-semibold">Short Description</label>
                            <Field
                                name="shortDescription"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Short description or owner note"
                            />
                            <ErrorMessage
                                name="shortDescription"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block font-semibold">Long Description</label>
                            <Field
                                as="textarea"
                                name="longDescription"
                                rows="5"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Detailed info about the pet"
                            />
                            <ErrorMessage
                                name="longDescription"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div className="md:col-span-2 text-right">
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-6 py-2 rounded"
                            >
                                Update Pet
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdatePet;
