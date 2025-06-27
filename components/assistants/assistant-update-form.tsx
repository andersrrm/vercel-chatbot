'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Assistant } from '@/lib/db/schema';
import { createAssistantSchema } from '@/lib/validations/assistant';
import { z } from 'zod';
import { EmojiSelector } from './emoji-selector';

interface AssistantUpdateFormProps {
  assistant: Assistant;
}

export function AssistantUpdateForm({ assistant }: AssistantUpdateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(assistant.avatar);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const instructions = formData.get('instructions') as string;

    try {
      const validatedData = createAssistantSchema.parse({
        name,
        instructions,
        avatar: selectedEmoji,
      });

      const response = await fetch(`/api/assistants/${assistant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update assistant.');
      }

      const updatedAssistant: Assistant = await response.json();

      toast.success('Assistant updated successfully!');

      // Navigate back to the assistant's chat
      router.push(`/chat/assistant/${updatedAssistant.id}`);
    } catch (error) {
      const err = error as any;
      toast.error(
        err?.errors?.[0]?.message ||
          err?.message ||
          'An unknown error occurred.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Assistant Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., 'Creative Writer Assistant'"
          required
          disabled={isSubmitting}
          defaultValue={assistant.name}
        />
        <p className="text-xs text-muted-foreground">
          Must have at least 2 words (e.g., "Creative Writer", "Code Helper")
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          name="instructions"
          placeholder="You are a helpful assistant that specializes in writing creative stories. You always provide engaging and original content that captures the reader's imagination."
          required
          disabled={isSubmitting}
          className="min-h-[150px]"
          defaultValue={assistant.instructions}
        />
        <p className="text-xs text-muted-foreground">
          Must have at least 2 sentences. Describe what your assistant does and
          how it should behave.
        </p>
      </div>
      <EmojiSelector
        value={selectedEmoji}
        onChange={setSelectedEmoji}
        disabled={isSubmitting}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Assistant'}
      </Button>
    </form>
  );
}
