import { useParams } from "react-router-dom";

export default function ProductDetails() {
    const { productName } = useParams();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Product Details: {decodeURIComponent(productName as string)}
            </h1>
            {/* Fetch and display product details using productName */}
        </div>
    );
}
