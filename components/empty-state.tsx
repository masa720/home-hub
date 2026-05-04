type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description ? <p className="mt-1 text-xs text-muted-foreground/70">{description}</p> : null}
      {action ? <div className="mt-3 flex justify-center">{action}</div> : null}
    </div>
  );
}
