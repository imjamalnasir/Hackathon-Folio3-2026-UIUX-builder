"use client";

import { motion } from "framer-motion";
import { ChevronRight, FileText, Folder } from "lucide-react";
import type { SitemapNode } from "@/lib/types";
import { cn } from "@/lib/utils";

function TreeNode({ node, depth = 0 }: { node: SitemapNode; depth?: number }) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.05 }}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors",
          depth > 0 && "ml-6"
        )}
        style={{ marginLeft: depth * 24 }}
      >
        {hasChildren ? (
          <Folder className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{node.title}</span>
            <code className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
              {node.path}
            </code>
          </div>
          {node.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{node.description}</p>
          )}
        </div>
        {hasChildren && <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
      </div>
      {hasChildren &&
        node.children!.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </motion.div>
  );
}

interface SitemapTreeProps {
  nodes: SitemapNode[];
}

export function SitemapTree({ nodes }: SitemapTreeProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-1">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
}
