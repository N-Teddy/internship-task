import { useQuery } from "@tanstack/react-query";
import { X, Star, ShoppingCart } from "lucide-react";

const fetchProduct = async (productId: number) => {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
};

export default function ProductDetail({ productId, onClose, open }: { productId: number; open: boolean; onClose: () => void }) {
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId),
        enabled: open && !!productId,
    });

    if (!open) return null; // Ensure modal does not render when closed

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Product Details</h2>
                    <button
                        onClick={onClose}
                         className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                {isLoading ? (
                    <div className="p-8 flex flex-col items-center gap-4">
                        <div className="w-full h-64 bg-gray-200 animate-pulse rounded"></div>
                        <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded"></div>
                        <div className="w-1/2 h-6 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-500">Failed to load product</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                        </div>

                                <div className="space-y-4">
                                    
                            <h1 className="text-2xl font-bold">{product.title}</h1>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="fill-yellow-500" size={18} />
                                    <span>{product.rating || "4.5"}</span>
                                </div>
                                <span className="text-gray-500">({product.stock || "120"} in stock)</span>
                            </div>

                            <p className="text-2xl font-semibold">${product.price}</p>

                            <p className="text-gray-600">{product.description}</p>

                            <button
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
