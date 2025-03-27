import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

type Category = {
  slug: string;
  name: string;
  url?: string;
};

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get("https://dummyjson.com/products/categories");
  return data.map((name: string) => ({
    slug: name.toLowerCase().replace(/\s+/g, "-"), // Create a slug for navigation
    name,
  }));
};

export default function Category() {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p className="text-center py-10">Loading categories...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load categories.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Product Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <div key={category.slug} className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
            <Link
              to={`/products/${category.slug}`}
              className="mt-3 inline-block px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              View Products
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
