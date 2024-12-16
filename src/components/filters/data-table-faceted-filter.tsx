"use client";

import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import * as Popover from "@radix-ui/react-popover";
import * as ScrollArea from "@radix-ui/react-scroll-area";

// Schemas Zod
const facetOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.function().optional(),
});

const dataTableFacetedFilterPropsSchema = z.object({
  column: z.any().optional(),
  title: z.string().optional(),
  options: z.array(facetOptionSchema),
});

interface FacetOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: FacetOption[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const parseResult = dataTableFacetedFilterPropsSchema.safeParse({
    column,
    title,
    options,
  });

  if (!parseResult.success) {
    console.error("Invalid DataTableFacetedFilter props:", parseResult.error);
    return null;
  }

  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="w-[200px] p-0" align="start" sideOffset={8}>
          <ScrollArea.Root className="h-[300px] rounded-md border bg-popover p-0 shadow-md">
            <ScrollArea.Viewport className="h-full w-full">
              <div className="relative h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
                <div className="flex items-center border-b px-3">
                  <input
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={title}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {options.length === 0 && (
                    <div className="py-6 text-center text-sm">
                      Nenhum resultado encontrado.
                    </div>
                  )}
                  <div className="overflow-hidden p-1 text-foreground">
                    {options.map((option) => {
                      const isSelected = selectedValues.has(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            if (isSelected) {
                              selectedValues.delete(option.value);
                            } else {
                              selectedValues.add(option.value);
                            }
                            const filterValues = Array.from(selectedValues);
                            column?.setFilterValue(
                              filterValues.length ? filterValues : undefined
                            );
                          }}
                          className={cn(
                            "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                            isSelected && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted opacity-50"
                            )}
                          >
                            <CheckIcon className={cn("h-4 w-4", { invisible: !isSelected })} />
                          </div>
                          {option.icon && (
                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{option.label}</span>
                          {facets?.get(option.value) && (
                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                              {facets.get(option.value)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
} 