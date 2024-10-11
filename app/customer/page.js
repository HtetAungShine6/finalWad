"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Container, Grid } from "@mui/material";

export default function CustomerManagement() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCustomers() {
    const response = await fetch(`${API_BASE}/customer`);
    const data = await response.json();
    setCustomerList(data);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function handleCustomerFormSubmit(data) {
    if (editMode) {
      // Updating a customer
      await fetch(`${API_BASE}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      stopEditMode();
      fetchCustomers();
      return;
    }

    // Creating a new customer
    await fetch(`${API_BASE}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetchCustomers();
  }

  async function handleDelete(id) {
    await fetch(`${API_BASE}/customer`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    fetchCustomers();
  }

  function startEditMode(customer) {
    reset(customer);
    setEditMode(true);
    setEditingCustomer(customer);
  }

  function stopEditMode() {
    reset({
      name: "",
      date_of_birth: "",
      member_number: "",
      interests: [],
    });
    setEditMode(false);
    setEditingCustomer(null);
  }

  const columns = [
    { field: "name", headerName: "Customer Name", flex: 1 },
    { field: "date_of_birth", headerName: "Date of Birth", flex: 1 },
    { field: "member_number", headerName: "Member Number", flex: 1 },
    { field: "interests", headerName: "Interests", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => startEditMode(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
      flex: 1,
    },
  ];

  const rows = customerList.map((customer) => ({
    id: customer._id,
    name: customer.name,
    date_of_birth: new Date(customer.date_of_birth).toLocaleDateString(), // Format the date
    member_number: customer.member_number,
    interests: customer.interests.join(", "), // Join interests array into a string
  }));

  return (
    <Container>
      <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Customer Name"
              variant="outlined"
              fullWidth
              {...register("name", { required: true })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Date of Birth"
              type="date"
              variant="outlined"
              fullWidth
              {...register("date_of_birth", { required: true })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Member Number"
              variant="outlined"
              fullWidth
              {...register("member_number", { required: true })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Interests (comma separated)"
              variant="outlined"
              fullWidth
              {...register("interests")}
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            {editMode ? (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: 8 }}
                >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="default"
                  onClick={stopEditMode}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="submit" variant="contained" color="success">
                Add
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </div>
    </Container>
  );
}



// "use client";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation"; // For routing

// export default function CustomerPage() {
//   const APIBASE = process.env.NEXT_PUBLIC_API_URL; // Ensure this is set in your .env.local file
//   const { register, handleSubmit, reset, setValue } = useForm();
//   const [customers, setCustomers] = useState([]);
//   const [editMode, setEditMode] = useState(false);
  
//   // Fetch all customers
//   async function fetchCustomers() {
//     try {
//       const response = await fetch(`${APIBASE}/customer`);
//       const data = await response.json();
//       setCustomers(data);
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   }

//   // Add or update customer
//   const onSubmit = async (data) => {
//     try {
//       const method = editMode ? "PUT" : "POST"; // Determine if it's an update or addition
//       const url = editMode ? `${APIBASE}/customer/${data._id}` : `${APIBASE}/customer`;
      
//       // Sending the request
//       const response = await fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) throw new Error(`Failed to ${editMode ? "update" : "add"} customer`);
      
//       alert(`Customer ${editMode ? "updated" : "added"} successfully`);
//       setEditMode(false); // Reset edit mode
//       resetForm(); // Reset the form
//       fetchCustomers(); // Fetch updated customer list
//     } catch (error) {
//       console.error(error.message);
//       alert(`Failed to ${editMode ? "update" : "add"} customer`);
//     }
//   };

//   // Populate form for editing
//   const startEdit = (customer) => {
//     setEditMode(true);
//     setValue("_id", customer._id);
//     setValue("name", customer.name);
//     setValue("date_of_birth", new Date(customer.date_of_birth).toISOString().split("T")[0]);
//     setValue("member_number", customer.member_number);
//     setValue("interests", customer.interests.join(", "));
//   };

//   // Reset form
//   const resetForm = () => {
//     reset({
//       name: "",
//       date_of_birth: "",
//       member_number: "",
//       interests: "",
//     });
//     setEditMode(false);
//   };

//   // Delete all customers
//   const deleteAllCustomers = async () => {
//     if (confirm("Are you sure you want to delete all customers?")) {
//       try {
//         const response = await fetch(`${APIBASE}/customer`, {
//           method: "DELETE",
//         });
//         if (!response.ok) throw new Error("Failed to delete customers");
//         alert("All customers deleted successfully");
//         fetchCustomers(); // Refresh customer list
//       } catch (error) {
//         console.error("Error deleting customers:", error);
//         alert("Failed to delete customers");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchCustomers(); // Fetch customers when the component mounts
//   }, []);

//   return (
//     <main className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

//       {/* Customer Form */}
//       <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block">Name:</label>
//             <input
//               type="text"
//               {...register("name", { required: true })}
//               className="border p-2 w-full"
//             />
//           </div>
//           <div>
//             <label className="block">Date of Birth:</label>
//             <input
//               type="date"
//               {...register("date_of_birth", { required: true })}
//               className="border p-2 w-full"
//             />
//           </div>
//           <div>
//             <label className="block">Member Number:</label>
//             <input
//               type="text"
//               {...register("member_number", { required: true })}
//               className="border p-2 w-full"
//             />
//           </div>
//           <div>
//             <label className="block">Interests:</label>
//             <input
//               type="text"
//               {...register("interests")}
//               className="border p-2 w-full"
//               placeholder="Comma-separated interests"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-between">
//           <input
//             type="submit"
//             value={editMode ? "Update Customer" : "Add Customer"}
//             className="bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
//           />
//           {editMode && (
//             <button
//               type="button"
//               onClick={resetForm}
//               className="bg-gray-600 text-white py-2 px-4 rounded"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Delete All Customers Button */}
//       <button
//         onClick={deleteAllCustomers}
//         className="bg-red-600 text-white py-2 px-4 mb-4 rounded"
//       >
//         Delete All Customers
//       </button>

//       {/* List of Customers */}
//       <h2 className="text-xl font-semibold mb-2">Customer List</h2>
//       <ul className="list-disc ml-5">
//         {customers.map((customer) => (
//           <li key={customer._id}>
//             <span>
//               {customer.name} - {new Date(customer.date_of_birth).toLocaleDateString()} -{" "}
//               {customer.member_number} - {customer.interests.join(", ")}
//             </span>
//             <button
//               onClick={() => startEdit(customer)}
//               className="ml-4 bg-blue-500 text-white py-1 px-2 rounded"
//             >
//               Edit
//             </button>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }



// // "use client";
// // import { useState, useEffect } from "react";
// // import { useForm } from "react-hook-form";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation"; // For routing

// // export default function CustomerPage() {
// //   const APIBASE = process.env.NEXT_PUBLIC_API_URL;
// //   const { register, handleSubmit, reset, setValue } = useForm();
// //   const [customers, setCustomers] = useState([]);
// //   const [editMode, setEditMode] = useState(false);
// //   const router = useRouter();

// //   // Fetch all customers
// //   async function fetchCustomers() {
// //     try {
// //       const response = await fetch(`${APIBASE}/customer`);
// //       const data = await response.json();
// //       setCustomers(data);
// //     } catch (error) {
// //       console.error("Error fetching customers:", error);
// //     }
// //   }

// //   // Add or update customer
// //   const onSubmit = async (data) => {
// //     try {
// //       const method = editMode ? "PUT" : "POST";
// //       const url = editMode ? `${APIBASE}/customer/${data._id}` : `${APIBASE}/customer`;
// //       const response = await fetch(url, {
// //         method: method,
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(data),
// //       });
// //       if (!response.ok) throw new Error(`Failed to ${editMode ? "update" : "add"} customer`);
// //       alert(`Customer ${editMode ? "updated" : "added"} successfully`);
// //       setEditMode(false);
// //       resetForm();
// //       fetchCustomers();
// //     } catch (error) {
// //       console.error(error.message);
// //       alert(`Failed to ${editMode ? "update" : "add"} customer`);
// //     }
// //   };

// //   // Populate form for editing
// //   const startEdit = (customer) => {
// //     setEditMode(true);
// //     setValue("_id", customer._id);
// //     setValue("name", customer.name);
// //     setValue("date_of_birth", new Date(customer.date_of_birth).toISOString().split("T")[0]);
// //     setValue("member_number", customer.member_number);
// //     setValue("interests", customer.interests.join(", "));
// //   };

// //   // Reset form
// //   const resetForm = () => {
// //     reset({
// //       name: "",
// //       date_of_birth: "",
// //       member_number: "",
// //       interests: "",
// //     });
// //     setEditMode(false);
// //   };

// //   // Delete all customers
// //   const deleteAllCustomers = async () => {
// //     if (confirm("Are you sure you want to delete all customers?")) {
// //       try {
// //         const response = await fetch(`${APIBASE}/customer`, {
// //           method: "DELETE",
// //         });
// //         if (!response.ok) throw new Error("Failed to delete customers");
// //         alert("All customers deleted successfully");
// //         fetchCustomers();
// //       } catch (error) {
// //         console.error("Error deleting customers:", error);
// //         alert("Failed to delete customers");
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCustomers();
// //   }, []);

// //   return (
// //     <main className="p-4">
// //       <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

// //       {/* Customer Form */}
// //       <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
// //         <div className="grid grid-cols-2 gap-4 mb-4">
// //           <div>
// //             <label className="block">Name:</label>
// //             <input
// //               type="text"
// //               {...register("name", { required: true })}
// //               className="border p-2 w-full"
// //             />
// //           </div>
// //           <div>
// //             <label className="block">Date of Birth:</label>
// //             <input
// //               type="date"
// //               {...register("date_of_birth", { required: true })}
// //               className="border p-2 w-full"
// //             />
// //           </div>
// //           <div>
// //             <label className="block">Member Number:</label>
// //             <input
// //               type="text"
// //               {...register("member_number", { required: true })}
// //               className="border p-2 w-full"
// //             />
// //           </div>
// //           <div>
// //             <label className="block">Interests:</label>
// //             <input
// //               type="text"
// //               {...register("interests")}
// //               className="border p-2 w-full"
// //               placeholder="Comma-separated interests"
// //             />
// //           </div>
// //         </div>

// //         {/* Submit Button */}
// //         <div className="flex justify-between">
// //           <input
// //             type="submit"
// //             value={editMode ? "Update Customer" : "Add Customer"}
// //             className="bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
// //           />
// //           {editMode && (
// //             <button
// //               type="button"
// //               onClick={resetForm}
// //               className="bg-gray-600 text-white py-2 px-4 rounded"
// //             >
// //               Cancel
// //             </button>
// //           )}
// //         </div>
// //       </form>

// //       {/* Delete All Customers Button */}
// //       <button
// //         onClick={deleteAllCustomers}
// //         className="bg-red-600 text-white py-2 px-4 mb-4 rounded"
// //       >
// //         Delete All Customers
// //       </button>

// //       {/* List of Customers */}
// //       <h2 className="text-xl font-semibold mb-2">Customer List</h2>
// //       <ul className="list-disc ml-5">
// //         {customers.map((customer) => (
// //           <li key={customer._id}>
// //             <span>
// //               {customer.name} - {new Date(customer.date_of_birth).toLocaleDateString()} -{" "}
// //               {customer.member_number} - {customer.interests.join(", ")}
// //             </span>
// //             <button
// //               onClick={() => startEdit(customer)}
// //               className="ml-4 bg-blue-500 text-white py-1 px-2 rounded"
// //             >
// //               Edit
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //     </main>
// //   );
// // }
