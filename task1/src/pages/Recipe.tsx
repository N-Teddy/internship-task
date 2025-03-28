// src/app/recipes/page.tsx
import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Clock, Flame, Soup, Utensils } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchRecipes = async (skip: number, limit: number) => {
    const response = await axios.get(`https://dummyjson.com/recipes?skip=${skip}&limit=${limit}`);
    return response.data;
};

export default function RecipesPage() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["recipes", page],
        queryFn: () => fetchRecipes(skip, limit),
        keepPreviousData: true,
    });

    const totalPages = data ? Math.ceil(data.total / limit) : 0;

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Soup className="w-6 h-6" /> Recipe Collection
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Utensils className="w-4 h-4 mr-2" />
                        Add Recipe
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                {isLoading ? (
                    <div className="space-y-4 p-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="p-6 text-center text-red-500">Failed to load recipes</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Cuisine</TableHead>
                                <TableHead className="text-right">
                                    <Clock className="inline w-4 h-4 mr-1" />
                                    Time
                                </TableHead>
                                <TableHead className="text-right">
                                    <Flame className="inline w-4 h-4 mr-1" />
                                    Calories
                                </TableHead>
                                <TableHead>Difficulty</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.recipes.map((recipe: Recipe) => (
                                <TableRow key={recipe.id}>
                                    <TableCell className="font-medium">{recipe.name}</TableCell>
                                    <TableCell>{recipe.cuisine}</TableCell>
                                    <TableCell className="text-right">{recipe.cookTimeMinutes} min</TableCell>
                                    <TableCell className="text-right">{recipe.caloriesPerServing}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-3 h-3 rounded-full ${i < recipe.difficulty ? "bg-primary" : "bg-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="mt-6">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                        </PaginationItem>
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                            const pageNumber = i + 1;
                            return (
                                <PaginationItem key={pageNumber}>
                                    <Button
                                        variant={page === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Button>
                                </PaginationItem>
                            );
                        })}
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}