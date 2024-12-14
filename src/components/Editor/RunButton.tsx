import React from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

interface RunButtonProps {
  onRun: () => void;
  isRunning: boolean;
  canRun: boolean;
}

export function RunButton({ onRun, isRunning, canRun }: RunButtonProps) {
  return (
    <Button
      onClick={onRun}
      disabled={isRunning || !canRun}
      variant="primary"
      size="sm"
      className="ml-2"
      icon={isRunning ? <Loader2 className="animate-spin" /> : <Play />}
    >
      {isRunning ? 'Running...' : 'Run'}
    </Button>
  );
}