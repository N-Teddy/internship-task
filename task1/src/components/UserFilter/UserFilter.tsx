"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

type UserFilterProps = {
    onFilterChange: (filters: any) => void;
};

export function UserFilter({ onFilterChange }: UserFilterProps) {
    const [ageRange, setAgeRange] = useState([18, 65]);

    const applyFilters = () => {
        onFilterChange({
            minAge: ageRange[0],
            maxAge: ageRange[1]
        });
    };

    const resetFilters = () => {
        setAgeRange([18, 65]);
        onFilterChange({});
    };

    return (
        <div className="w-full md:w-72 p-4 border rounded-lg bg-background shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Age Range: {ageRange[0]} - {ageRange[1]}
                    </label>
                    <Slider
                        min={18}
                        max={100}
                        step={1}
                        value={ageRange}
                        onValueChange={setAgeRange}
                        className="my-4"
                    />
                </div>

                <Button className="w-full" onClick={applyFilters}>
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}