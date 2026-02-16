"use client";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: number;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function DeleteButton({ id, deleteAction }: DeleteButtonProps) {
  return (
    <form 
      action={deleteAction} 
      onSubmit={(e) => {
        // Confirmation popup browser side pr chale ga
        if (!confirm(`Are you sure you want to delete this customer record?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  );
}