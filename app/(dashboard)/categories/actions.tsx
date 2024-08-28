"use client"

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger

} from "@/components/ui/dropdown-menu"
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import useConfirm from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash2Icon } from "lucide-react";

type Props = {
    id: string;
}

export const Actions = ({id}: Props) => {
    const deleteMutation = useDeleteCategory(id);
    const {onOpen} = useOpenCategory();
    
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "You are about to delete your category"
    )

    const onDelete = async () => {
        const ok = await confirm();
        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    
                }
            });
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => {onOpen(id)}}
                    >
                        <Edit className="size-4 mr-2"/> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={onDelete}
                    >
                        <Trash2Icon className="size-4 mr-2"/> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDialog/>
        </>
    )
}