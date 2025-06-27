import { FadeInUp } from '@/components/ui/animation/fade-in-up';
import type { Assistant } from '@/lib/db/schema';

interface GreetingProps {
  assistant?: Assistant | null;
}

export const Greeting = ({ assistant }: GreetingProps) => (
  <div
    key="overview"
    className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
  >
    <FadeInUp className="flex items-center gap-3 mb-4">
      {assistant ? (
        <>
          <div className="rounded-full bg-muted p-3">
            <span className="text-2xl">{assistant.avatar}</span>
          </div>
          <div className="text-2xl font-semibold">{assistant.name}</div>
        </>
      ) : (
        <div className="text-2xl font-semibold">Hello there!</div>
      )}
    </FadeInUp>
    <FadeInUp className="text-lg text-zinc-500 max-w-2xl" delay={0.6}>
      {assistant ? assistant.instructions : 'How can I help you today?'}
    </FadeInUp>
  </div>
);
