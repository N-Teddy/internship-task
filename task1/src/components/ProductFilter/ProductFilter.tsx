"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { toast } from "sonner";

type FilterProps = {
  onFilterChange: (filters: {
    category?: string;
    brand?: string;
    priceRange?: [number, number];
    inStock?: boolean;
  }) => void;
};

export function ProductFilter({ onFilterChange }: FilterProps) {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStock, setInStock] = useState(false);

  const applyFilters = () => {
    onFilterChange({ category, brand, priceRange, inStock });
    toast.success("Filters applied successfully");
  };

  const resetFilters = () => {
    setCategory("");
    setBrand("");
    setPriceRange([0, 1000]);
    setInStock(false);
    onFilterChange({});
    toast.info("Filters reset");
  };

  return (
    <div className="w-72 p-4 border rounded-lg bg-background shadow-sm">
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

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Input
            placeholder="Electronics, Clothing..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Input
            placeholder="Apple, Nike..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-4"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStock}
            onCheckedChange={(checked) => setInStock(checked as boolean)}
          />
          <label htmlFor="inStock" className="text-sm font-medium">
            In Stock Only
          </label>
        </div>

        <Button className="w-full" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}