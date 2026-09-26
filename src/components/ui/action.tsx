import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-[10px] font-semibold transition-[background,box-shadow,color] duration-200";

const variants = {
  primary: "bg-rust text-white hover:bg-rust-dark hover:shadow-cta",
  outline: "border border-teal bg-transparent text-teal hover:bg-teal-soft hover:text-teal",
  outlineDark: "border border-ink bg-white text-ink hover:bg-slate-50",
  ghostLight: "border border-teal-soft/30 bg-white/5 text-cream hover:bg-white/10 hover:text-cream",
} as const;

const sizes = {
  sm: "px-5 py-3 text-[15px]",
  md: "px-[26px] py-[15px] text-[15px]",
  lg: "px-[30px] py-[17px] text-base",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

interface StyleProps {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
}

export function buttonClasses({ variant = "primary", size = "md" }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size]);
}

export function ActionLink({
  variant,
  size,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & StyleProps) {
  return <a className={cn(buttonClasses({ variant, size }), className)} {...props} />;
}

export function ActionButton({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return <button className={cn(buttonClasses({ variant, size }), className)} {...props} />;
}
