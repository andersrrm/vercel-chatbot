import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { AssistantForm } from '@/components/assistants';
import { AssistantPageHeader } from '@/components/assistants';

export const metadata = {
  title: 'New Assistant',
};

export default async function NewAssistantPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/sign-in?next=/assistants/new`);
  }

  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
    >
      <AssistantPageHeader />
      <AssistantForm />
    </div>
  );
}
