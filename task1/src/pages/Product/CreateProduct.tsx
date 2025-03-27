"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import axios from "axios"// Import the image uploader component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader/Imageuploader";

// ✅ Define Form Schema Validation
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

// ✅ Fetch Categories Using TanStack Query
const fetchCategories = async () => {
    const res = await axios.get("https://dummyjson.com/products/categories");
    return res.data;
};

export default function CreateProduct() {
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
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

    const { data: categories, isLoading } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

    // ✅ Handle Image Selection
    const handleImagesSelected = (files: File[]) => {
        setValue("images", files);
    };

    // ✅ Handle Form Submission
    const onSubmit = (data: any) => {
        console.log("Product Data:", data);
        alert("Product Created Successfully!");
    };

    return (
        <Card className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Product Name */}
                <div>
                    <Label>Product Name</Label>
                    <Input placeholder="Enter product name" {...register("title")} />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Input placeholder="Enter product description" {...register("description")} />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                {/* Price */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label>Price ($)</Label>
                        <Input type="number" {...register("price")} />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                    </div>

                    <div className="flex-1">
                        <Label>Discount (%)</Label>
                        <Input type="number" {...register("discountPercentage")} />
                        {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage.message}</p>}
                    </div>
                </div>

                {/* Stock */}
                <div>
                    <Label>Stock Quantity</Label>
                    <Input type="number" {...register("stock")} />
                    {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <Label>Category</Label>
                    <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoading ? (
                                        <p className="px-4 py-2">Loading categories...</p>
                                    ) : (
                                        categories?.map((cat) =>
                                            cat.name && ( // Ensure name exists
                                                <SelectItem key={cat.slug} value={cat.name}>
                                                    {cat.name}  {/* 🔹 Fix: Render cat.name instead of full object */}
                                                </SelectItem>
                                            )
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>

                {/* Brand */}
                <div>
                    <Label>Brand</Label>
                    <Input placeholder="Enter brand name" {...register("brand")} />
                    {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
                </div>

                {/* Image Upload (Now in a Separate Component) */}
                <div>
                    <Label>Product Images</Label>
                    <ImageUploader onImagesSelected={handleImagesSelected} />
                    {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                    Create Product
                </Button>
            </form>
        </Card>
    );
}
