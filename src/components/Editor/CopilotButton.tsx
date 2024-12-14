import React from 'react';
import { Copilot } from 'lucide-react';
import { Button } from '../common/Button';

interface CopilotButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export function CopilotButton({ onClick, isActive }: CopilotButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={isActive ? 'primary' : 'secondary'}
      size="sm"
      className="ml-2"
      icon={<Copilot size={16} />}
    >
      Copilot
    </Button>
  );
}