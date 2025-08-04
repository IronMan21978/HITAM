import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface SwipeAction {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  variant?: "default" | "destructive" | "success";
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  onSwipe?: (direction: 'left' | 'right') => void;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  className,
  onSwipe
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState<'left' | 'right' | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const startX = e.currentTarget.getBoundingClientRect().left;
    const currentX = touch.clientX;
    const offset = currentX - startX;
    
    setSwipeOffset(Math.max(-200, Math.min(200, offset)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(swipeOffset) > 80) {
      const direction = swipeOffset > 0 ? 'right' : 'left';
      setShowActions(direction);
      onSwipe?.(direction);
    } else {
      setSwipeOffset(0);
      setShowActions(null);
    }
  };

  const getActionVariantClass = (variant?: string) => {
    switch (variant) {
      case 'destructive': return 'bg-destructive text-destructive-foreground';
      case 'success': return 'bg-success text-success-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 h-full flex items-center z-10">
          {leftActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "h-full rounded-none px-4 min-w-[80px]",
                getActionVariantClass(action.variant)
              )}
              onClick={action.action}
            >
              <div className="flex flex-col items-center gap-1">
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 h-full flex items-center z-10">
          {rightActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "h-full rounded-none px-4 min-w-[80px]",
                getActionVariantClass(action.variant)
              )}
              onClick={action.action}
            >
              <div className="flex flex-col items-center gap-1">
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Main Card */}
      <Card
        className={cn(
          "transition-transform duration-200 touch-manipulation",
          isDragging && "transition-none",
          className
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-4 md:p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};