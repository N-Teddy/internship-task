"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

type PostFilterProps = {
    onFilterChange: (filters: {
        search?: string;
        userId?: number;
        minReactions?: number;
    }) => void;
};

export function PostFilter({ onFilterChange }: PostFilterProps) {
    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState("");
    const [reactionsRange, setReactionsRange] = useState([0]);

    const applyFilters = () => {
        onFilterChange({
            search,
            userId: userId ? Number(userId) : undefined,
            minReactions: reactionsRange[0]
        });
        toast.success("Filters applied");
    };

    const resetFilters = () => {
        setSearch("");
        setUserId("");
        setReactionsRange([0]);
        onFilterChange({});
        toast.info("Filters reset");
    };

    return (
        <div className="w-72 p-4 border rounded-lg bg-background space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">User ID</label>
                    <Input
                        type="number"
                        placeholder="Filter by user"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Min Reactions: {reactionsRange[0]}
                    </label>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={reactionsRange}
                        onValueChange={(val) => setReactionsRange(val)}
                    />
                </div>

                <Button className="w-full" onClick={applyFilters}>
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}