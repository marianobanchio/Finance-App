import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { CategoryForm } from "./category-form";
import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";

import { Loader2 } from "lucide-react";

import useConfirm from "@/hooks/use-confirm";
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategories } from "../api/use-get-categories";
import { useGetCategory } from "../api/use-get-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";

const formSchema = insertCategoriesSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "You are about to delete your transaction"
    )

    const accountQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isPending = editMutation.isPending;
    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ""
    }

    return (
        <>
        <Sheet
            open={isOpen}
            onOpenChange={onClose}
        >
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>Edit Category</SheetTitle>
                    <SheetDescription>
                        Edit an existing category
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                      </div>  
                    ) : (
                        <CategoryForm
                            id={id}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            defaultValues={defaultValues}
                        />
                    )
                }

            </SheetContent>
        </Sheet>
        <ConfirmDialog/>
        </>
    );
};
