import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Pencil,
    Trash2,
    Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Recipe } from "@/types/recipe";

interface RecipeTableProps {
    recipes: Recipe[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onSort: (field: keyof Recipe) => void;
    sortField: keyof Recipe | null;
    sortDirection: "asc" | "desc";
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
    onSearch: (term: string) => void;
    isLoading?: boolean;
    itemsPerPage: number;
}

export function RecipeTable({
    recipes,
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    onEdit,
    onDelete,
    onAdd,
    onSearch,
    isLoading = false,
    itemsPerPage,
}: RecipeTableProps) {
    const handleSort = (field: keyof Recipe) => {
        onSort(field);
    };

    const renderSortIcon = (field: keyof Recipe) => {
        if (sortField !== field) return <ChevronsUpDown className="ml-1 h-4 w-4" />;
        if (sortDirection === "asc") return <ChevronUp className="ml-1 h-4 w-4" />;
        return <ChevronDown className="ml-1 h-4 w-4" />;
    };

    // Calculate the range of items being displayed
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recipes</h2>
                <div className="flex space-x-2">
                    <Input
                        placeholder="Search recipes..."
                        className="max-w-sm"
                        onChange={(e) => onSearch(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button onClick={onAdd} disabled={isLoading}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Recipe
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <button
                                    className="flex items-center"
                                    onClick={() => handleSort("name")}
                                    disabled={isLoading}
                                >
                                    Name
                                    {renderSortIcon("name")}
                                </button>
                            </TableHead>
                            <TableHead>
                                <button
                                    className="flex items-center"
                                    onClick={() => handleSort("cuisine")}
                                    disabled={isLoading}
                                >
                                    Cuisine
                                    {renderSortIcon("cuisine")}
                                </button>
                            </TableHead>
                            <TableHead>
                                <button
                                    className="flex items-center"
                                    onClick={() => handleSort("prepTimeMinutes")}
                                    disabled={isLoading}
                                >
                                    Prep Time
                                    {renderSortIcon("prepTimeMinutes")}
                                </button>
                            </TableHead>
                            <TableHead>
                                <button
                                    className="flex items-center"
                                    onClick={() => handleSort("cookTimeMinutes")}
                                    disabled={isLoading}
                                >
                                    Cook Time
                                    {renderSortIcon("cookTimeMinutes")}
                                </button>
                            </TableHead>
                            <TableHead>
                                <button
                                    className="flex items-center"
                                    onClick={() => handleSort("difficulty")}
                                    disabled={isLoading}
                                >
                                    Difficulty
                                    {renderSortIcon("difficulty")}
                                </button>
                            </TableHead>
                            <TableHead>
                                <button
                                    className="flex items-center"
                                    onClick={() => handleSort("rating")}
                                    disabled={isLoading}
                                >
                                    Rating
                                    {renderSortIcon("rating")}
                                </button>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: itemsPerPage }).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[120px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[80px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[50px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[50px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[70px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <TableRow key={recipe.id}>
                                    <TableCell className="font-medium">{recipe.name}</TableCell>
                                    <TableCell>{recipe.cuisine}</TableCell>
                                    <TableCell>{recipe.prepTimeMinutes} min</TableCell>
                                    <TableCell>{recipe.cookTimeMinutes} min</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${recipe.difficulty === "Easy"
                                                    ? "bg-green-100 text-green-800"
                                                    : recipe.difficulty === "Medium"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {recipe.difficulty}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(recipe.rating)
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-1 text-sm text-gray-500">
                                                ({recipe.reviewCount})
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEdit(recipe)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDelete(recipe.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No recipes found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{startItem}</span> to{" "}
                    <span className="font-medium">{endItem}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> recipes
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                                className={
                                    currentPage === 1 || isLoading
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                                disabled={isLoading}
                            />
                        </PaginationItem>

                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <PaginationItem key={`pagination-skeleton-${index}`}>
                                    <Skeleton className="h-9 w-9" />
                                </PaginationItem>
                            ))
                        ) : (
                            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            isActive={pageNum === currentPage}
                                            onClick={() => onPageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })
                        )}

                        {!isLoading && totalPages > 5 && currentPage < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    currentPage < totalPages && onPageChange(currentPage + 1)
                                }
                                className={
                                    currentPage === totalPages || isLoading
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                                disabled={isLoading}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}