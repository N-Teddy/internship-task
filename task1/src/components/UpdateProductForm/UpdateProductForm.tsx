"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ImageUploader from "@/components/ImageUploader/Imageuploader";

// Schema validation
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

// Fetch product data
const fetchProduct = async (id: number) => {
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`);
    return data;
};

// Fetch categories
const fetchCategories = async () => {
    const { data } = await axios.get("https://dummyjson.com/products/category-list");
    return data;
};

// Update product
const updateProduct = async ({ id, data }: { id: number; data: any }) => {
    const response = await axios.put(`https://dummyjson.com/products/${id}`, data);
    return response.data;
};

interface UpdateProductFormProps {
    productId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateProductForm({ productId, open, onOpenChange }: UpdateProductFormProps) {
    const queryClient = useQueryClient();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data: product, isLoading: isLoadingProduct } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId),
        enabled: open && !!productId,
    });

    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: product || {
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

    const updateMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            toast.success("Product updated successfully");
            queryClient.invalidateQueries({ queryKey: ["products"] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to update product");
        },
    });

    const handleImagesSelected = (files: File[]) => {
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        setValue("images", files);
    };

    const onSubmit = (data: any) => {
        updateMutation.mutate({ id: productId, data });
    };

    // Reset form when opening/closing dialog
    useState(() => {
        if (open && product) {
            reset(product);
            setImagePreviews(product.images || []);
        } else if (!open) {
            reset();
            setImagePreviews([]);
        }
    }, [open, product]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Update Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Basic Information */}
                    <div className="space-y-2">
                        <Label>Product Name *</Label>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Product name" />
                            )}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Description *</Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Description" />
                            )}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Price *</Label>
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => (
                                    <Input type="number" {...field} placeholder="Price" />
                                )}
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Discount (%) *</Label>
                            <Controller
                                name="discountPercentage"
                                control={control}
                                render={({ field }) => (
                                    <Input type="number" {...field} placeholder="Discount" />
                                )}
                            />
                            {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Stock *</Label>
                            <Controller
                                name="stock"
                                control={control}
                                render={({ field }) => (
                                    <Input type="number" {...field} placeholder="Stock" />
                                )}
                            />
                            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
                        </div>
                    </div>

                    {/* Category & Brand */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoadingCategories ? (
                                                <div className="p-2 text-center">Loading...</div>
                                            ) : (
                                                categories?.map((category: string) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Brand *</Label>
                            <Controller
                                name="brand"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Brand" />
                                )}
                            />
                            {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <Label>Product Images *</Label>
                        <ImageUploader
                            onImagesSelected={handleImagesSelected}
                            initialPreviews={imagePreviews}
                            hasError={!!errors.images}
                        />
                        {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                    </div>

                    <Separator />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? "Updating..." : "Update Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}