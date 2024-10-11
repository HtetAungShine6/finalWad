import mongoose from "mongoose";

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Trim white spaces
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  member_number: {
    type: String,
    required: true,
    unique: true, // Ensure each member number is unique
    trim: true,
  },
  interests: {
    type: [String], // Array of strings to store multiple interests
    default: [],    // Default to an empty array if no interests are provided
  },
});

// Create Customer model
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
