"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UpdateProductForm } from "../UpdateProductForm/UpdateProductForm";
import  ProductDetail  from "../ProductDetail/ProductDetail";

interface ProductActionButtonProps {
    id: number;
    productName: string;
}

export function ProductActionButton({ id, productName }: ProductActionButtonProps) {
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`https://dummyjson.com/products/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success(`${productName} deleted successfully`);
        },
        onError: () => {
            toast.error(`Failed to delete ${productName}`);
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setIsDetailModalOpen(true)}
                        className="cursor-pointer"
                    >
                        <Eye className="mr-2 h-4 w-4 text-blue-500" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsUpdateDialogOpen(true)}
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 h-4 w-4 text-amber-500" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => deleteMutation.mutate()}
                        className="cursor-pointer text-red-500"
                        disabled={deleteMutation.isPending}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UpdateProductForm
                productId={id}
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
            />

            <ProductDetail
                productId={id}
                open={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)} // Fixed: Pass a function that sets to false
            />
        </>
    );
}