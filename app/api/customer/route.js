import Customer from "@/models/Customer";

// Fetch all customers
export async function GET() {
  const customers = await Customer.find().sort({ createdAt: -1 }); // Sort as needed
  return Response.json(customers);
}

// Create a new customer
export async function POST(request) {
  const body = await request.json();
  const customer = new Customer(body);
  await customer.save();
  return Response.json(customer);
}

// Update a customer
export async function PUT(request) {
  const body = await request.json();
  const customer = await Customer.findByIdAndUpdate(body._id, body, { new: true });
  return Response.json(customer);
}

// Delete a customer
export async function DELETE(request) {
  const { id } = await request.json();
  await Customer.findByIdAndDelete(id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
