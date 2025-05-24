'use server';

import { auth } from '@/app/(auth)/auth';
import { createTranscript } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function uploadTranscript(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
    const dealId = formData.get('dealId') as string;
    const file = formData.get('file') as File;
    const callDate = formData.get('callDate') as string;
    const callTime = formData.get('callTime') as string;

    if (!file || !dealId || !callDate || !callTime) {
      throw new Error('Missing required fields');
    }

    // Validate file type
    if (!file.type.includes('text') && !file.name.endsWith('.vtt')) {
      throw new Error('Please upload a .txt or .vtt file');
    }

    // Read file content
    const content = await file.text();
    
    if (!content.trim()) {
      throw new Error('File appears to be empty');
    }

    // Create transcript record
    const [transcript] = await createTranscript({
      dealId,
      fileName: file.name,
      content,
      callDate,
      callTime,
    });

    return { success: true, transcript };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to upload transcript'
    };
  }
}
