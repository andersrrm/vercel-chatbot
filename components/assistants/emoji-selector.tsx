'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EmojiSelectorProps {
  value: string;
  onChange: (emoji: string) => void;
  disabled?: boolean;
}

const EMOJI_OPTIONS = [
  '🤖',
  '🧠',
  '🚀',
  '💻',
  '✍️',
  '📚',
  '🎯',
  '🔧',
  '💡',
  '🌟',
  '📊',
  '🔬',
  '💼',
  '🎓',
  '🏆',
  '⚡',
  '🎪',
  '🎭',
  '🎮',
  '📱',
  '🌐',
  '🔍',
  '📝',
  '🎵',
  '🎬',
  '📷',
  '🎨',
  '🏠',
  '🍕',
];

export function EmojiSelector({
  value,
  onChange,
  disabled = false,
}: EmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>Avatar Emoji</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-10 text-lg"
            disabled={disabled}
          >
            <span className="mr-2">{value || '🤖'}</span>
            <span className="text-sm text-muted-foreground">
              {value ? 'Change emoji' : 'Select emoji'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-2">
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <DropdownMenuItem
                key={emoji}
                className="text-lg p-2 hover:bg-muted cursor-pointer"
                onClick={() => {
                  onChange(emoji);
                  setIsOpen(false);
                }}
              >
                {emoji}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-xs text-muted-foreground">
        Choose an emoji that represents your assistant's personality or
        function.
      </p>
    </div>
  );
}
