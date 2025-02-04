"use client";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CounterInput = ({
  min,
  count,
  increase,
  decrease,
}: {
  min: number;
  count: number;
  increase: () => void;
  decrease: () => void;
}) => {
  return (
    <div className="flex items-center gap-0">
      <Button
        size="sm"
        variant="outline"
        onClick={decrease}
        disabled={count <= min}
        className="size-6 border-gray-600"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="text-md font-medium w-8 text-center">{count}</span>
      <Button
        size="sm"
        variant="outline"
        onClick={increase}
        className="size-6 border-gray-600"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
