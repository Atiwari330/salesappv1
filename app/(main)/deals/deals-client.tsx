'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Deal } from '@/lib/db/schema';
import { createDeal } from './actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DealsClientProps {
  deals: Deal[];
}

export function DealsClient({ deals }: DealsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealName, setDealName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealName.trim()) return;

    setIsLoading(true);
    try {
      await createDeal(dealName.trim());
      setIsModalOpen(false);
      setDealName('');
      toast.success('Deal created successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to create deal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deals</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>+ New Deal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <Label htmlFor="dealName">Deal Name</Label>
                <Input
                  id="dealName"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  placeholder="Enter deal name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Save Deal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg">
        {deals.length === 0 ? (
          <div className="p-4">
            <p className="text-muted-foreground">
              No deals yet. Create your first deal to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Deal Name</th>
                  <th className="text-left p-4 font-medium">Date Created</th>
                  <th className="text-left p-4 font-medium">Number of Transcripts</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr
                    key={deal.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/deals/${deal.id}`)}
                  >
                    <td className="p-4 font-medium">{deal.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-muted-foreground">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
