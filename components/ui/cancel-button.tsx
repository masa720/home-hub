"use client";

import { Button } from "@/components/ui/button";

type CancelButtonProps = {
  children?: React.ReactNode;
};

export function CancelButton({ children = "キャンセル" }: CancelButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={(event) => {
        const form = event.currentTarget.closest("form");
        form?.reset();

        const details = event.currentTarget.closest("details");
        if (details) {
          details.open = false;
        }
      }}
    >
      {children}
    </Button>
  );
}
