import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { CategoryForm } from "./category-form";
import { FormValue } from "hono/types";
import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateCategory } from "../api/use-create-category";
import { useNewCategory } from "../hooks/use-new-category";

const formSchema = insertCategoriesSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory();

    const mutation = useCreateCategory();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Sheet
            open={isOpen}
            onOpenChange={onClose}
        >
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>New Category</SheetTitle>
                    <SheetDescription>
                        Create a new category
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{ name: "" }}
                />
            </SheetContent>
        </Sheet>
    );
};
