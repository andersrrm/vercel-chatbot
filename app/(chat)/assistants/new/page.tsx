import { auth } from '@/app/(auth)/auth';
import { AssistantForm } from '@/components/assistants';
import { AssistantPageHeader } from '@/components/assistants';

const NewAssistantContent = () => (
  <div
    key="overview"
    className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
  >
    <AssistantPageHeader />
    <AssistantForm />
  </div>
);

export default async function NewAssistantPage() {
  await auth();
  return <NewAssistantContent />;
}
