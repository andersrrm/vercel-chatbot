'use client';

import { FadeInUp } from '@/components/ui/animation/fade-in-up';

export function AssistantPageHeader() {
  return (
    <>
      <FadeInUp className="text-2xl font-bold mb-2">
        Create New Assistant
      </FadeInUp>
      <FadeInUp className="text-muted-foreground mb-6" delay={0.6}>
        Fill out the details below to create your custom AI assistant.
      </FadeInUp>
    </>
  );
}
