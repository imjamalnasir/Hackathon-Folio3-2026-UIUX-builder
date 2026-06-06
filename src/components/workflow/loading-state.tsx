"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}
