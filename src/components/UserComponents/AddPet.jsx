import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Swal from "sweetalert2";

const petCategories = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "other", label: "Other" },
];

// ✅ Updated schema: Removed image validation
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    age: Yup.string().required("Age is required"),
    category: Yup.object().required("Category is required"),
    location: Yup.string().required("Location is required"),
    shortDescription: Yup.string().required("Short description is required"),
    longDescription: Yup.string().required("Long description is required"),
});

const AddPet = () => {
    // const handleSubmit = (values, { resetForm }) => {
    //     Swal.fire({
    //         title: "Confirm Pet Details",
    //         html: `
    //     <img src="https://via.placeholder.com/150" alt="Pet Image" class="w-32 h-32 mx-auto rounded mb-4"/>
    //     <p><strong>Name:</strong> ${values.name}</p>
    //     <p><strong>Age:</strong> ${values.age}</p>
    //     <p><strong>Category:</strong> ${values.category.label}</p>
    //     <p><strong>Location:</strong> ${values.location}</p>
    //     <p><strong>Short Description:</strong> ${values.shortDescription}</p>
    //     <p><strong>Long Description:</strong> ${values.longDescription}</p>
    //   `,
    //         showCancelButton: true,
    //         confirmButtonText: "Submit",
    //         cancelButtonText: "Cancel",
    //         confirmButtonColor: "#865B97",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             console.log("Confirmed Pet Data:", values);
    //             Swal.fire("Submitted!", "Pet data has been submitted.", "success");
    //             resetForm();
    //         }
    //     });
    // };

    const handleSubmit = async (values, { resetForm }) => {
        Swal.fire({
            title: "Confirm Pet Details",
            html: `
        <img src="https://via.placeholder.com/150" alt="Pet Image" class="w-32 h-32 mx-auto rounded mb-4"/>
        <p><strong>Name:</strong> ${values.name}</p>
        <p><strong>Age:</strong> ${values.age}</p>
        <p><strong>Category:</strong> ${values.category.label}</p>
        <p><strong>Location:</strong> ${values.location}</p>
        <p><strong>Short Description:</strong> ${values.shortDescription}</p>
        <p><strong>Long Description:</strong> ${values.longDescription}</p>
      `,
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#865B97",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const petData = {
                    name: values.name,
                    age: values.age,
                    category: values.category,
                    location: values.location,
                    shortDescription: values.shortDescription,
                    longDescription: values.longDescription,
                    image: "https://via.placeholder.com/150", // Default or placeholder image
                };

                try {
                    const res = await fetch("http://localhost:5000/pets", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(petData),
                    });

                    if (!res.ok) {
                        throw new Error("Failed to submit pet data");
                    }

                    const result = await res.json();
                    console.log("Server response:", result);

                    Swal.fire("Submitted!", "Pet data has been submitted.", "success");
                    resetForm();
                } catch (error) {
                    console.error("Submission error:", error);
                    Swal.fire("Error", "Something went wrong!", "error");
                }
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Add a New Pet</h2>

            <Formik
                initialValues={{
                    name: "",
                    age: "",
                    category: null,
                    location: "",
                    shortDescription: "",
                    longDescription: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, errors, touched, values }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block font-semibold">Pet Name</label>
                            <Field
                                name="name"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Enter pet name"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block font-semibold">Pet Age</label>
                            <Field
                                name="age"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Enter pet age"
                            />
                            <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Category */}
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

                        {/* Location */}
                        <div>
                            <label className="block font-semibold">Location</label>
                            <Field
                                name="location"
                                className="mt-2 block w-full border p-2 rounded"
                                placeholder="Enter pickup location"
                            />
                            <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Short Description */}
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

                        {/* Long Description */}
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

                        {/* Submit Button */}
                        <div className="md:col-span-2 text-right">
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-6 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddPet;
