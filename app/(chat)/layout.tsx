import { cookies } from 'next/headers';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';
import Script from 'next/script';
import { getAssistantsByUserId } from '@/lib/db/assistant-queries';
import type { LayoutProps } from '@/lib/types';

export const experimental_ppr = true;

const getAssistants = async (userId?: string) => {
  if (!userId) return [];

  try {
    return await getAssistantsByUserId(userId);
  } catch (error) {
    console.error('Error fetching assistants:', error);
    return [];
  }
};

export default async function Layout({ children }: LayoutProps) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';
  const assistants = await getAssistants(session?.user?.id);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} assistants={assistants} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
