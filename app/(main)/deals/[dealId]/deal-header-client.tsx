'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PencilIcon, CheckIcon, XIcon, Trash2 } from 'lucide-react'; // Assuming lucide-react for icons
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Deal } from '@/lib/db/schema';
import { updateDealName, deleteDeal } from './actions'; 
import { useRouter } from 'next/navigation';


interface DealHeaderClientProps {
  initialDeal: Deal;
}

export function DealHeaderClient({ initialDeal }: DealHeaderClientProps) {
  const [deal, setDeal] = useState<Deal>(initialDeal);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(deal.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // For loading state on confirm delete
  const router = useRouter();

  const handleEdit = () => {
    setEditedName(deal.name);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(deal.name); // Reset to original name
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      toast.error('Deal name cannot be empty.');
      return;
    }
    if (editedName.trim() === deal.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateDealName(deal.id, editedName.trim());

      if (result.success && result.updatedDeal) {
        // The router.refresh() will cause the parent page to re-fetch the deal,
        // so we don't strictly need to setDeal here if initialDeal prop updates correctly.
        // However, for immediate UI feedback before refresh completes, it can be useful.
        setDeal(result.updatedDeal); 
        setIsEditing(false);
        toast.success('Deal name updated successfully.');
        router.refresh(); 
      } else {
        toast.error(result.error || 'Failed to update deal name.');
      }
    } catch (error) {
      console.error('Failed to update deal name:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDeal(deal.id);
      // The deleteDeal server action redirects on success, so we primarily handle errors here.
      // If it returns an error object, it means the redirect didn't happen.
      if (result && result.success === false) { // Check if result exists and success is explicitly false
        toast.error(result.error || 'Failed to delete deal.');
        setIsDeleting(false); // Only stop loading if there was an error and no redirect
        setIsDeleteDialogOpen(false); // Close modal on error too, or keep it open? User decision. Closing for now.
      }
      // If successful, the server action handles redirection, so no client-side navigation is strictly needed here.
      // If the server action *didn't* redirect, you'd do it here:
      // else {
      //   toast.success('Deal deleted successfully.');
      //   router.push('/deals'); // Or router.refresh() if staying on a different page
      // }
    } catch (error) {
      console.error('Failed to delete deal:', error);
      toast.error('An unexpected error occurred while trying to delete the deal.');
      setIsDeleting(false);
    }
    // setIsDeleteDialogOpen(false); // This might be set too early if an error occurs and we want to keep modal open.
    // Let's ensure it's only set to false if not already handled by error or success redirect.
    // However, the current server action always redirects or returns an error object.
    // If an error object is returned, we set isDeleting to false above.
    // If redirect happens, this component might unmount.
  };

  return (
    <div className="border-b pb-4">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="text-3xl font-bold h-auto p-0 border-0 focus-visible:ring-0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <Button onClick={handleSave} size="icon" variant="ghost" disabled={isSaving}>
            {isSaving ? <CheckIcon className="h-5 w-5 animate-spin" /> : <CheckIcon className="h-5 w-5" />}
          </Button>
          <Button onClick={handleCancel} size="icon" variant="ghost" disabled={isSaving}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">{deal.name}</h1>
          <Button onClick={handleEdit} size="icon" variant="ghost">
            <PencilIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50 hover:border-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      )}
      <p className="text-muted-foreground mt-2">
        Created on {new Date(deal.createdAt).toLocaleDateString()}
        {deal.updatedAt.toISOString() !== deal.createdAt.toISOString() && (
          <span className="text-xs ml-2">(Updated: {new Date(deal.updatedAt).toLocaleDateString()} {new Date(deal.updatedAt).toLocaleTimeString()})</span>
        )}
      </p>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this deal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the deal
              "{deal.name}" and all associated data, including any transcripts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
