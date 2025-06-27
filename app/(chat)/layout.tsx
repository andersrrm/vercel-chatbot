import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';
import Script from 'next/script';
import { getAssistantsByUserId } from '@/lib/db/assistant-queries';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  // Get assistants data directly in the layout
  let assistants: any[] = [];
  if (session?.user?.id) {
    try {
      assistants = await getAssistantsByUserId(session.user.id);
    } catch (error) {
      console.error('Error fetching assistants:', error);
      assistants = [];
    }
  }

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
