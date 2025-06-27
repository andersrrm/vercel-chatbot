import { createAssistant } from '@/lib/db/assistant-queries';
import { auth } from '@/app/(auth)/auth';
import { createAssistantSchema } from '@/lib/validations/assistant';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  const { name, instructions, avatar } = createAssistantSchema.parse(json);

  const newAssistant = await createAssistant({
    userId: session.user.id,
    name,
    instructions,
    avatar,
  });

  return Response.json(newAssistant, { status: 201 });
}
