import Product from "@/models/Product";

export async function GET(request, { params }) {
  const id = params.id;
  const product = await Product.findById(id).populate("category");
  console.log({ product });
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  const id = params.id;
  return Response.json(await Product.findByIdAndDelete(id));
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  
  // Use { new: true } to return the updated document
  const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
  
  return Response.json(updatedProduct);
}