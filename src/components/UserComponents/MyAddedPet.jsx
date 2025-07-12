import React, { useEffect, useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
// import { useNavigate } from "react-router-dom";

const MyAddedPet = () => {
    const [pets, setPets] = useState([]);
    const [sorting, setSorting] = useState([]);
    const navigate = useNavigate();

    // Replace this with actual user email logic
    const userEmail = "demo@example.com";

    useEffect(() => {
        fetch(`http://localhost:5000/pets?email=${userEmail}`)
            .then(res => res.json())
            .then(data => {
                setPets(data);
            });
    }, []);

    const handleDelete = (petId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/pets/${petId}`, {
                    method: "DELETE",
                })
                    .then(res => res.json())
                    .then(() => {
                        setPets(pets.filter(pet => pet._id !== petId));
                        Swal.fire("Deleted!", "Your pet has been deleted.", "success");
                    });
            }
        });
    };

    const handleAdopt = (petId) => {
        fetch(`http://localhost:5000/pets/${petId}/adopt`, {
            method: "PATCH",
        })
            .then(res => res.json())
            .then(() => {
                setPets(pets.map(pet => pet._id === petId ? { ...pet, adopted: true } : pet));
                Swal.fire("Success!", "Pet has been marked as adopted.", "success");
            });
    };

    const columns = useMemo(() => [
        {
            header: "S/N",
            cell: ({ row, table }) =>
                table.getSortedRowModel().flatRows.findIndex(r => r.id === row.id) + 1,
        },

        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Category",
            accessorFn: row => row.category?.label || row.category,
        },
        {
            header: "Image",
            cell: ({ row }) => (
                <img src={row.original.image || "https://via.placeholder.com/50"} alt="pet" className="w-12 h-12 rounded" />
            ),
        },
        {
            header: "Adoption Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded text-sm ${row.original.adopted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {row.original.adopted ? "Adopted" : "Not Adopted"}
                </span>
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link to={`/userDashboard/updatePet/${row.original._id}`}>
                        <button
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        >
                            Update
                        </button>
                    </Link>
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                        Delete
                    </button>
                    {!row.original.adopted && (
                        <button
                            onClick={() => handleAdopt(row.original._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        >
                            Adopted
                        </button>
                    )}
                </div>
            ),
        }
    ], [navigate, pets]);

    const table = useReactTable({
        data: pets,
        columns,
        state: {
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
    });

    return (
        <div className="max-w-6xl mx-auto mt-6 p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">My Added Pets</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left border">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-gray-100">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="p-3 cursor-pointer select-none"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: " 🔼",
                                            desc: " 🔽"
                                        }[header.column.getIsSorted()] ?? ""}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-t">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAddedPet;
