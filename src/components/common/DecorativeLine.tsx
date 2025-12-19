"use client";

import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface DecorativeLineProps {
  className?: string;
}

export function DecorativeLine({ className }: DecorativeLineProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <Image
        src="/home/decorative line.png"
        alt="Decorative Line"
        width={150}
        height={20}
        className="rounded-2xl object-cover"
      />
    </div>
  );
}

export default DecorativeLine;
