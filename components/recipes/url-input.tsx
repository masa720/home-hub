"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UrlInputProps = {
  name: string;
  placeholder: string;
  defaultValue?: string;
};

export function UrlInput({ name, placeholder, defaultValue }: UrlInputProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [copied, setCopied] = useState(false);
  const hasValue = value.trim().length > 0;

  return (
    <div className="flex gap-1.5">
      <Input
        name={name}
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {hasValue ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 size-12"
            onClick={async () => {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check className="size-4 text-green-400" aria-hidden /> : <Copy className="size-4 text-muted-foreground" aria-hidden />}
          </Button>
          <Button asChild variant="ghost" size="icon" className="shrink-0 size-12">
            <a href={value} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4 text-muted-foreground" aria-hidden />
            </a>
          </Button>
        </>
      ) : null}
    </div>
  );
}
