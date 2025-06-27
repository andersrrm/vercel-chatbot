'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontalIcon, PenIcon, TrashIcon } from '@/components/icons';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenu,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import { toast } from 'sonner';
import type { Assistant } from '@/lib/db/schema';

interface SidebarAssistantsProps {
  assistants: Assistant[];
}

export function SidebarAssistants({
  assistants: initialAssistants,
}: SidebarAssistantsProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [assistants, setAssistants] = useState<Assistant[]>(initialAssistants);

  // Listen for custom events when a new assistant is created
  useEffect(() => {
    const handleNewAssistant = (event: CustomEvent) => {
      const newAssistant = event.detail;
      setAssistants((prev) => [newAssistant, ...prev]);
    };

    window.addEventListener(
      'newAssistantCreated',
      handleNewAssistant as EventListener,
    );

    return () => {
      window.removeEventListener(
        'newAssistantCreated',
        handleNewAssistant as EventListener,
      );
    };
  }, []);

  const handleUpdateAssistant = (assistantId: string) => {
    router.push(`/assistants/${assistantId}/edit`);
  };

  const handleDeleteAssistant = async (assistantId: string) => {
    const assistant = assistants.find((a) => a.id === assistantId);

    try {
      const response = await fetch(`/api/assistants/${assistantId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAssistants((prev) =>
          prev.filter((assistant) => assistant.id !== assistantId),
        );
        toast.success(`Assistant "${assistant?.name}" deleted successfully`);
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete assistant');
      }
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast.error('Error deleting assistant');
    }
  };

  if (assistants.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 px-2 text-sm">
      <span className="px-2 py-1 text-xs text-sidebar-foreground/50">
        My Assistants
      </span>
      <SidebarMenu>
        {assistants.map((assistant) => (
          <SidebarMenuItem key={assistant.id}>
            <SidebarMenuButton asChild>
              <Link
                href={`/chat/assistant/${assistant.id}`}
                onClick={() => setOpenMobile(false)}
              >
                <span>{assistant.avatar}</span>
                <span>{assistant.name}</span>
              </Link>
            </SidebarMenuButton>

            <DropdownMenu modal={true}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
                  showOnHover={true}
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleUpdateAssistant(assistant.id)}
                >
                  <PenIcon />
                  <span>Update</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
                  onSelect={() => handleDeleteAssistant(assistant.id)}
                >
                  <TrashIcon />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
