'use client';

import { FadeInUp } from '@/components/ui/animation/fade-in-up';

export function AssistantUpdatePageHeader() {
  return (
    <>
      <FadeInUp className="text-2xl font-bold mb-2">Update Assistant</FadeInUp>
      <FadeInUp className="text-muted-foreground mb-6" delay={0.6}>
        Modify the details below to update your AI assistant.
      </FadeInUp>
    </>
  );
}
