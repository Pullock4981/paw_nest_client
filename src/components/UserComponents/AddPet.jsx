import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { AuthContext } from "../../Context/AuthContext";

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
    category: Yup.string().required("Category is required"),
    location: Yup.string().required("Location is required"),
    shortDescription: Yup.string().required("Short description is required"),
    longDescription: Yup.string().required("Long description is required"),
    image: Yup.mixed().required("Image is required"),
});

const AddPet = () => {
    const { user } = useContext(AuthContext);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const imageData = new FormData();
            imageData.append("image", values.image);

            const uploadRes = await fetch(
                `https://api.imgbb.com/1/upload?key=145f5aeaf6a15c67199ff6c3ef4dbd4e`,
                { method: "POST", body: imageData }
            );
            const uploadResult = await uploadRes.json();
            const imageUrl = uploadResult?.data?.url;

            if (!imageUrl) throw new Error("Image upload failed.");

            Swal.fire({
                title: "Confirm Pet Details",
                html: `
          <img src="${imageUrl}" alt="Pet Image" class="w-32 h-32 mx-auto rounded mb-4"/>
          <p><strong>Name:</strong> ${values.name}</p>
          <p><strong>Age:</strong> ${values.age}</p>
          <p><strong>Category:</strong> ${values.category}</p>
          <p><strong>Location:</strong> ${values.location}</p>
          <p><strong>Short Description:</strong> ${values.shortDescription}</p>
          <p><strong>Long Description:</strong> ${values.longDescription}</p>
        `,
                showCancelButton: true,
                confirmButtonText: "Submit",
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
                        image: imageUrl,
                        userEmail: user?.email || "unknown",
                    };

                    const res = await fetch("https://pet-adoption-server-wheat.vercel.app/pets", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(petData),
                    });

                    if (!res.ok) throw new Error("Failed to submit pet data");

                    Swal.fire("Submitted!", "Pet data has been submitted.", "success");
                    resetForm();
                }
            });
        } catch (error) {
            console.error("Submission error:", error);
            Swal.fire("Error", "Something went wrong!", "error");
        }
    };

    return (
        <motion.div
            className="max-w-6xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold mb-6 text-center text-[#865B97]">Add a New Pet</h2>

            <Formik
                initialValues={{
                    name: "",
                    age: "",
                    category: "",
                    location: "",
                    shortDescription: "",
                    longDescription: "",
                    image: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values, errors, touched }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-3 gap-2">

                        {/* Image Upload - full width */}
                        <div className="md:col-span-3">
                            <label className="block font-semibold">Pet Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="mt-2 w-full border p-2 rounded"
                                onChange={(e) => setFieldValue("image", e.target.files[0])}
                            />
                            {errors.image && touched.image && (
                                <div className="text-red-500 text-sm">{errors.image}</div>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block font-semibold">Name</label>
                            <Field
                                name="name"
                                className="mt-1 w-full border p-2 rounded"
                                placeholder="Pet name"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block font-semibold">Age</label>
                            <Field
                                name="age"
                                className="mt-1 w-full border p-2 rounded"
                                placeholder="Pet age"
                            />
                            <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block font-semibold">Category</label>
                            <Select
                                options={petCategories}
                                name="category"
                                value={petCategories.find((cat) => cat.value === values.category)}
                                onChange={(option) => setFieldValue("category", option.value)}
                                className="mt-1"
                            />
                            {errors.category && touched.category && (
                                <div className="text-red-500 text-sm">{errors.category}</div>
                            )}
                        </div>

                        {/* Location + Short Description */}
                        <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block font-semibold">Location</label>
                                <Field
                                    name="location"
                                    className="mt-1 w-full border p-2 rounded"
                                    placeholder="City or area"
                                />
                                <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="flex-1">
                                <label className="block font-semibold">Short Description</label>
                                <Field
                                    name="shortDescription"
                                    className="mt-1 w-full border p-2 rounded"
                                    placeholder="Short summary"
                                />
                                <ErrorMessage name="shortDescription" component="div" className="text-red-500 text-sm" />
                            </div>
                        </div>

                        {/* Long Description */}
                        <div className="md:col-span-3">
                            <label className="block font-semibold">Long Description</label>
                            <Field
                                as="textarea"
                                name="longDescription"
                                rows="4"
                                className="mt-1 w-full border p-2 rounded"
                                placeholder="Details about the pet"
                            />
                            <ErrorMessage name="longDescription" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-3 text-right mt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                type="submit"
                                className="bg-[#865B97] hover:bg-purple-700 text-white px-6 py-2 rounded shadow"
                            >
                                Submit Pet
                            </motion.button>
                        </div>

                    </Form>
                )}
            </Formik>
        </motion.div>
    );
};

export default AddPet;
