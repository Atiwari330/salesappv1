'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'; 
import { Sparkle } from 'lucide-react'; 
import { toast } from 'sonner';
import type { ActionItem } from '@/lib/db/schema';
import { 
  getActionItemsForTranscriptAction, 
  addUserActionItemAction, 
  updateUserActionItemAction, 
  deleteUserActionItemAction,
  scanSingleTranscriptForActionItemsAction
} from '../../actions'; // Corrected path for actions

interface TranscriptActionItemsClientProps {
  transcriptId: string;
  dealId: string; // dealId is needed for creating/scanning action items
}

export function TranscriptActionItemsClient({ transcriptId, dealId }: TranscriptActionItemsClientProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<ActionItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isScanning, setIsScanning] = useState(false);

  const fetchActionItems = async () => {
    if (!transcriptId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getActionItemsForTranscriptAction(transcriptId);
      if (result.success && result.items) {
        setActionItems(result.items);
      } else {
        setError(result.error || 'Failed to load action items for this transcript.');
        setActionItems([]);
      }
    } catch (e) {
      console.error('Error fetching transcript action items:', e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      setActionItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActionItems();
  }, [transcriptId]);

  const handleAddSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newItemDescription.trim()) {
      toast.error('Description cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Pass dealId and transcriptId
      const result = await addUserActionItemAction(dealId, newItemDescription.trim(), transcriptId);
      if (result.success && result.actionItem) {
        toast.success('Action item added!');
        setActionItems(prev => [...prev, result.actionItem!]);
        setNewItemDescription('');
        setIsAddDialogOpen(false);
      } else {
        toast.error(result.error || 'Failed to add action item.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (itemId: string, currentStatus: boolean) => {
    setUpdatingItemId(itemId);
    try {
      const result = await updateUserActionItemAction(itemId, { isCompleted: !currentStatus });
      if (result.success && result.actionItem) {
        toast.success(`Item ${!currentStatus ? 'marked as complete' : 'marked as incomplete'}.`);
        setActionItems(prevItems => 
          prevItems.map(item => item.id === itemId ? result.actionItem! : item)
        );
      } else {
        toast.error(result.error || 'Failed to update item status.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleOpenEditDialog = (item: ActionItem) => {
    setEditingItem(item);
    setEditDescription(item.description);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem || !editDescription.trim()) {
      toast.error('Description cannot be empty.');
      return;
    }
    setIsSubmittingEdit(true);
    try {
      const result = await updateUserActionItemAction(editingItem.id, { description: editDescription.trim() });
      if (result.success && result.actionItem) {
        toast.success('Action item updated!');
        setActionItems(prevItems =>
          prevItems.map(item => (item.id === editingItem.id ? result.actionItem! : item))
        );
        setIsEditDialogOpen(false);
        setEditingItem(null);
      } else {
        toast.error(result.error || 'Failed to update action item.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleOpenDeleteDialog = (item: ActionItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteUserActionItemAction(itemToDelete.id);
      if (result.success) {
        toast.success('Action item deleted!');
        setActionItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
      } else {
        toast.error(result.error || 'Failed to delete action item.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleScanThisTranscript = async () => {
    if (!transcriptId || !dealId) {
      toast.error('Transcript ID or Deal ID is missing. Cannot scan.');
      return;
    }
    setIsScanning(true);
    toast.info('Scanning this transcript for action items...');
    try {
      // Pass both dealId and transcriptId
      const result = await scanSingleTranscriptForActionItemsAction(dealId, transcriptId);
      if (result.success) {
        if (result.newItems && result.newItems.length > 0) {
          toast.success(`${result.newItems.length} new AI-suggested action item(s) added!`);
          setActionItems(prevItems => [...prevItems, ...result.newItems!]);
        } else if (result.error) { // Check for specific errors if any
            toast.error(result.error);
        }
         else {
          toast.info('No new action item suggestions found from this transcript.');
        }
      } else {
        toast.error(result.error || 'Failed to scan transcript or add suggestions.');
      }
    } catch (e) {
      console.error('Error scanning transcript:', e);
      toast.error(e instanceof Error ? e.message : 'An unexpected error occurred during scan.');
    } finally {
      setIsScanning(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Action Items for this Transcript</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Action Items for this Transcript</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleScanThisTranscript}
            disabled={isScanning || isLoading}
          >
            <Sparkle className="mr-2 h-4 w-4" />
            {isScanning ? 'Scanning...' : 'Scan this Transcript'}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Add Action Item</Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Action Item (for this transcript)</DialogTitle>
              <DialogDescription>
                Enter the description for your new action item. It will be linked to this transcript.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <Label htmlFor="item-description" className="sr-only">Description</Label>
                <Input
                  id="item-description"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="E.g., Follow up with client"
                  disabled={isSubmitting}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {error && ( 
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {actionItems.length === 0 && !error && (
          <p className="text-muted-foreground text-center py-4">
            No action items yet for this transcript.
          </p>
        )}
        {actionItems.length > 0 && (
          <ul className="space-y-3">
            {actionItems.map((item) => (
              <li key={item.id} className={`flex items-center space-x-3 p-3 rounded-md ${item.isCompleted ? 'bg-muted/30' : 'bg-muted/50'}`}>
                <Checkbox
                  id={`action-item-${item.id}`}
                  checked={item.isCompleted}
                  onCheckedChange={() => handleToggleComplete(item.id, item.isCompleted)}
                  disabled={updatingItemId === item.id}
                />
                <label
                  htmlFor={`action-item-${item.id}`}
                  className={`flex-grow text-sm ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.description}
                </label>
                {item.isAISuggested && (
                  <Sparkle className="h-4 w-4 text-blue-500 flex-shrink-0" aria-label="AI Suggested" />
                )}
                <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(item)} className="ml-auto h-7 w-7" disabled={updatingItemId === item.id || isDeleting}>
                  <Pencil1Icon className="h-4 w-4" />
                  <span className="sr-only">Edit Item</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(item)} className="h-7 w-7" disabled={updatingItemId === item.id || isDeleting}>
                  <TrashIcon className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete Item</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {editingItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open) setEditingItem(null); 
          setIsEditDialogOpen(open);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Action Item</DialogTitle>
              <DialogDescription>
                Update the description of your action item.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-item-description" className="sr-only">Description</Label>
                <Input
                  id="edit-item-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="E.g., Follow up with client"
                  disabled={isSubmittingEdit}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmittingEdit}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {itemToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
          if (!open) setItemToDelete(null);
          setIsDeleteDialogOpen(open);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the action item: "{itemToDelete.description}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}
