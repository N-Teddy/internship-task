"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/ImageUploader/Imageuploader";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const productSchema = yup.object().shape({
    title: yup.string().required("Product name is required"),
    description: yup.string().required("Description is required"),
    price: yup.number().positive().required("Price is required"),
    discountPercentage: yup.number().min(0).max(100).required("Discount must be between 0-100%"),
    stock: yup.number().min(0).required("Stock is required"),
    category: yup.string().required("Category is required"),
    brand: yup.string().required("Brand is required"),
    images: yup.array().min(1, "At least one image is required"),
});

const fetchCategories = async () => {
    try {
        const { data } = await axios.get("https://dummyjson.com/products/category-list");
        return data;
    } catch (error) {
        throw new Error("Failed to fetch categories");
    }
};

const createProduct = async (productData: any) => {
    try {
        const response = await axios.post("https://dummyjson.com/products/add", {
            ...productData,
            images: productData.images.map((file: File) => file.name) // Convert files to image names for dummy API
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to create product");
    }
};

export default function CreateProduct() {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            discountPercentage: 0,
            stock: 0,
            category: "",
            brand: "",
            images: [],
        },
    });

    // Fetch categories
    const {
        data: categories,
        isLoading: isLoadingCategories,
        isError: isCategoriesError,
        error: categoriesError
    } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });

    // Create product mutation
    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: (data) => {
            toast.success("Product created successfully!");
            reset(); // Reset form after successful submission
            console.log("Created product:", data);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create product");
        }
    });

    const handleImagesSelected = (files: File[]) => {
        setValue("images", files);
    };

    const onSubmit = (data: any) => {
        createMutation.mutate(data);
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
                    <p className="text-muted-foreground">
                        Fill in the details below to add a new product to your inventory
                    </p>
                </div>

                <Separator className="my-6" />

                {isCategoriesError && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                        {categoriesError.message || "Failed to load categories. Please try again later."}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Product Name *</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter product name"
                                    {...register("title")}
                                    className={errors.title ? "border-red-500" : ""}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                            </div>

                            {/* Brand */}
                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand *</Label>
                                <Input
                                    id="brand"
                                    placeholder="Enter brand name"
                                    {...register("brand")}
                                    className={errors.brand ? "border-red-500" : ""}
                                />
                                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Input
                                id="description"
                                placeholder="Enter product description"
                                {...register("description")}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Pricing & Inventory Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Pricing & Inventory</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    {...register("price")}
                                    className={errors.price ? "border-red-500" : ""}
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                            </div>

                            {/* Discount */}
                            <div className="space-y-2">
                                <Label htmlFor="discountPercentage">Discount (%) *</Label>
                                <Input
                                    id="discountPercentage"
                                    type="number"
                                    {...register("discountPercentage")}
                                    className={errors.discountPercentage ? "border-red-500" : ""}
                                />
                                {errors.discountPercentage && <p className="text-red-500 text-sm mt-1">{errors.discountPercentage.message}</p>}
                            </div>

                            {/* Stock */}
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity *</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    {...register("stock")}
                                    className={errors.stock ? "border-red-500" : ""}
                                />
                                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Category & Images Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Category & Media</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label>Category *</Label>
                                {isLoadingCategories ? (
                                    <Skeleton className="h-10 w-full rounded-md" />
                                ) : (
                                    <Controller
                                        control={control}
                                        name="category"
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isLoadingCategories}
                                            >
                                                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories?.map((category: string) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                )}
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                            </div>
                        </div>
                    </div>

                    <ImageUploader
                        onImagesSelected={handleImagesSelected}
                        hasError={!!errors.images}
                    />
                    {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}

                    <Separator className="my-6" />

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full md:w-auto"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? "Creating..." : "Create Product"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}