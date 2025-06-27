import type { User } from 'next-auth';
import type { Assistant } from '@/lib/db/schema';

export type DataPart = { type: 'append-message'; message: string };

export type LayoutProps = {
  children: React.ReactNode;
};

export type EditAssistantPageProps = {
  params: {
    assistantId: string;
  };
};

export type AssistantChatPageProps = {
  params: Promise<{ assistantId: string }>;
};

export type ChatComponentProps = {
  id: string;
  session: any;
  assistant: any;
  model: string;
};

// API Route types
export type AssistantRouteParams = {
  params: Promise<{ assistantId: string }>;
};

export type ApiErrorResponse = {
  error: string;
};

export type ApiSuccessResponse<T = any> = {
  success?: boolean;
  data?: T;
};

// Component types
export type AppSidebarProps = {
  user: User | undefined;
  assistants: Assistant[];
};

export type AssistantUpdateFormProps = {
  assistant: Assistant;
};
