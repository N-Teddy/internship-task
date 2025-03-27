"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Star,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ProductFilter } from "@/components/ProductFilter/ProductFilter";
import { ProductActionButton } from "@/components/ProductActionButton/ProductActionButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const API_URL = "https://dummyjson.com/products";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
  category: string;
  brand: string;
}

export default function ProductList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", filters, currentPage],
    queryFn: async () => {
      try {
        let url = `${API_URL}?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;

        if (filters.category) url += `&category=${filters.category}`;
        if (filters.brand) url += `&brand=${filters.brand}`;
        if (filters.priceRange) {
          url += `&minPrice=${filters.priceRange[0]}&maxPrice=${filters.priceRange[1]}`;
        }
        if (filters.inStock) url += "&stock=gt:0";

        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      } catch (error) {
        toast.error("Failed to fetch products");
        throw error;
      }
    },
  });

  const requestSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    toast(`Sorted by ${key} (${direction})`);
  };

  const sortedProducts = data?.products?.slice().sort((a: Product, b: Product) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar - Fixed Width */}
        <div className="w-full md:w-72 flex-shrink-0">
          <ProductFilter onFilterChange={setFilters} />
        </div>

        {/* Main Content - Flexible Width */}
        <div className="flex-1 space-y-4">
          {/* Table with Horizontal Scroll Only */}
          <div className="rounded-md border shadow-sm">
            <ScrollArea className="w-full whitespace-nowrap">
              <Table className="min-w-full">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => requestSort("title")}
                    >
                      <div className="flex items-center">
                        Product
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => requestSort("category")}
                    >
                      <div className="flex items-center">
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => requestSort("price")}
                    >
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => requestSort("stock")}
                    >
                      <div className="flex items-center">
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => requestSort("rating")}
                    >
                      <div className="flex items-center">
                        <Star className="mr-2 h-4 w-4" />
                        Rating
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(pageSize)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Failed to load products
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedProducts?.map((product: Product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell>
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={product.stock > 0 ? "default" : "destructive"}
                          >
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            {product.rating}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ProductActionButton
                            id={product.id}
                            onEdit={(id) => navigate(`/products/${id}/edit`)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Pagination - Outside ScrollArea */}
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}