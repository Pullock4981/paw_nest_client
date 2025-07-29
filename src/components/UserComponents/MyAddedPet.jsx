import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

const MyAddedPet = () => {
    const { user } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const navigate = useNavigate();
    const pageSize = 10;

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const res = await fetch(
                    `https://pet-adoption-server-wheat.vercel.app/pets?email=${user.email}`
                );
                const data = await res.json();
                setPets(data);
            } catch (err) {
                console.error("Failed to load pets:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) fetchPets();
    }, [user]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This pet will be deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await fetch(
                    `https://pet-adoption-server-wheat.vercel.app/pets/${id}`,
                    {
                        method: "DELETE",
                    }
                );
                setPets((prev) => prev.filter((p) => p._id !== id));
                Swal.fire("Deleted!", "Your pet has been deleted.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", "Failed to delete.", "error");
            }
        }
    };

    const handleAdopt = async (id) => {
        try {
            await fetch(
                `https://pet-adoption-server-wheat.vercel.app/pets/${id}/adopt`,
                {
                    method: "PATCH",
                }
            );
            setPets((prev) =>
                prev.map((p) => (p._id === id ? { ...p, adopted: true } : p))
            );
        } catch (err) {
            console.error("Failed to mark as adopted:", err);
        }
    };

    const columns = useMemo(
        () => [
            {
                header: "#",
                cell: (info) => pageIndex * pageSize + info.row.index + 1,
            },
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Category",
                accessorKey: "category",
            },
            {
                header: "Image",
                cell: ({ row }) => (
                    <img
                        src={row.original.image}
                        alt={row.original.name}
                        className="w-16 h-16 rounded object-cover"
                    />
                ),
            },
            {
                header: "Adoption Status",
                cell: ({ row }) =>
                    row.original.adopted ? "Adopted" : "Not Adopted",
            },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() =>
                                navigate(`/userDashboard/updatePet/${row.original._id}`)
                            }
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => handleDelete(row.original._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => handleAdopt(row.original._id)}
                            disabled={row.original.adopted}
                            className={`px-3 py-1 text-white rounded transition ${row.original.adopted
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            {row.original.adopted ? "Adopted" : "Adopt"}
                        </button>
                    </div>
                ),
            },
        ],
        [navigate, pageIndex]
    );

    const table = useReactTable({
        data: pets,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const currentPageRows = table
        .getRowModel()
        .rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

    if (loading)
        return <div className="text-center mt-6 animate-pulse">Loading pets...</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">My Added Pets</h2>
            <div className="w-full overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <div className="overflow-x-auto rounded-md border shadow-md">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-100">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                scope="col"
                                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap cursor-pointer"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === "asc"
                                                    ? " ↑"
                                                    : header.column.getIsSorted() === "desc"
                                                        ? " ↓"
                                                        : ""}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentPageRows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-purple-50 transition duration-300"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




            {/* Pagination */}
            {table.getRowModel().rows.length > pageSize && (
                <div className="flex justify-center items-center gap-3 mt-6 text-sm">
                    <button
                        disabled={pageIndex === 0}
                        onClick={() => setPageIndex((prev) => prev - 1)}
                        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>
                        Page {pageIndex + 1} of{" "}
                        {Math.ceil(table.getRowModel().rows.length / pageSize)}
                    </span>
                    <button
                        disabled={
                            (pageIndex + 1) * pageSize >= table.getRowModel().rows.length
                        }
                        onClick={() => setPageIndex((prev) => prev + 1)}
                        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyAddedPet;
