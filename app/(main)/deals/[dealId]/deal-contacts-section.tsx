'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Button, buttonVariants } from '@/components/ui/button'; // Added buttonVariants
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'; // Added AlertDialog components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getContactsForDealAction, 
  addContactToDealAction, 
  type AddContactToDealInput,
  removeContactFromDealAction // Added removeContactFromDealAction
} from '@/app/(main)/contacts/actions';
import type { ContactWithRole } from '@/lib/db/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PersonIcon, TrashIcon } from '@radix-ui/react-icons'; // Added TrashIcon
import { toast } from 'sonner';

interface DealContactsSectionProps {
  dealId: string;
}

export function DealContactsSection({ dealId }: DealContactsSectionProps) {
  const [contacts, setContacts] = useState<ContactWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactToRemove, setContactToRemove] = useState<ContactWithRole | null>(null);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [isRemovingContact, setIsRemovingContact] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [roleInDeal, setRoleInDeal] = useState('');

  const fetchContacts = async () => {
    if (!dealId) return;
    // Keep setIsLoading(true) here to show loading skeleton on initial load and re-fetches
    setIsLoading(true); 
    setError(null);
    try {
      const result = await getContactsForDealAction({ dealId });
      if (result.success && result.data) {
        setContacts(result.data);
      } else {
        setError(result.error || 'Failed to load contacts.');
        setContacts([]);
      }
    } catch (e) {
      console.error('Error fetching contacts:', e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [dealId]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setJobTitle('');
    setRoleInDeal('');
    setFormError(null);
  };

  const handleAddContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const formData: AddContactToDealInput = {
      dealId,
      firstName,
      lastName,
      email,
      jobTitle: jobTitle || undefined,
      roleInDeal: roleInDeal || undefined,
    };

    try {
      const result = await addContactToDealAction(formData);
      if (result.success) {
        toast.success('Contact added successfully!');
        setIsDialogOpen(false);
        resetForm();
        await fetchContacts(); // Refresh the list
      } else {
        const errorMessage = result.error || 'Failed to add contact.';
        if (result.fieldErrors) {
          const fieldErrorMessages = Object.values(result.fieldErrors).flat().join(', ');
          setFormError(`Validation failed: ${fieldErrorMessages}`);
        } else {
          setFormError(errorMessage);
        }
        toast.error(errorMessage);
      }
    } catch (e) {
      console.error('Error submitting contact form:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveContact = (contact: ContactWithRole) => {
    setContactToRemove(contact);
    setIsRemoveConfirmOpen(true);
  };

  const confirmRemoveContact = async () => {
    if (!contactToRemove) return;
    setIsRemovingContact(true);
    try {
      const result = await removeContactFromDealAction({ dealId, contactId: contactToRemove.id });
      if (result.success) {
        toast.success(`Contact ${contactToRemove.firstName} ${contactToRemove.lastName} removed from deal.`);
        await fetchContacts(); // Refresh list
      } else {
        toast.error(result.error || 'Failed to remove contact.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unexpected error occurred during removal.');
    } finally {
      setIsRemovingContact(false);
      setIsRemoveConfirmOpen(false);
      setContactToRemove(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4"> {/* Added pt-4 for consistency */}
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent className="pt-4"> {/* Added pt-4 */}
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <> {/* Dialog needs to be a sibling or parent, not child of CardHeader for proper modal behavior */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm(); // Reset form when dialog is closed
      }}>
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => { /* resetForm() is called by onOpenChange now */ }}>Add Contact</Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No contacts added yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {contacts.map((contact) => (
                  <li key={contact.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <PersonIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                        {contact.jobTitle && (
                          <p className="text-xs text-muted-foreground">
                            {contact.jobTitle}
                          </p>
                        )}
                      </div>
                    </div>
                    {contact.roleInDeal && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {contact.roleInDeal}
                  </span>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveContact(contact)}
                  aria-label="Remove contact"
                >
                  <TrashIcon className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
            )}
          </CardContent>
        </Card>
        <DialogContent className="sm:max-w-[425px]"> {/* Add Contact Dialog Content */}
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Fill in the details for the new contact associated with this deal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddContactSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="firstName-modal">First Name</Label>
              <Input id="firstName-modal" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="lastName-modal">Last Name</Label>
              <Input id="lastName-modal" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="email-modal">Email</Label>
              <Input id="email-modal" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="jobTitle-modal">Job Title (Optional)</Label>
              <Input id="jobTitle-modal" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="roleInDeal-modal">Role in Deal (Optional)</Label>
              <Input id="roleInDeal-modal" value={roleInDeal} onChange={(e) => setRoleInDeal(e.target.value)} disabled={isSubmitting} />
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Contact'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Removing Contact */}
      {contactToRemove && (
        <AlertDialog open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove {contactToRemove.firstName} {contactToRemove.lastName} from this deal. 
                The contact record itself will not be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setContactToRemove(null)} disabled={isRemovingContact}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemoveContact} disabled={isRemovingContact} className={buttonVariants({ variant: "destructive" })}>
                {isRemovingContact ? "Removing..." : "Remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
