import { notFound } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { getAssistantById } from '@/lib/db/assistant-queries';
import {
  AssistantUpdateForm,
  AssistantUpdatePageHeader,
} from '@/components/assistants';
import type { EditAssistantPageProps } from '@/lib/types';

const getAssistant = async (assistantId: string, userId: string) => {
  const assistant = await getAssistantById(assistantId);

  if (!assistant || assistant.userId !== userId) {
    notFound();
  }

  return assistant;
};

const EditPageContent = ({ assistant }: { assistant: any }) => (
  <div
    key="overview"
    className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
  >
    <AssistantUpdatePageHeader />
    <AssistantUpdateForm assistant={assistant} />
  </div>
);

export default async function EditAssistantPage({
  params,
}: EditAssistantPageProps) {
  const session = await auth();
  const assistant = await getAssistant(
    params.assistantId,
    session?.user?.id || '',
  );

  return <EditPageContent assistant={assistant} />;
}
