import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  className,
  variant = "default",
  size = "sm",
  children,
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary-100 text-primary-700",
    secondary: "bg-secondary-100 text-secondary-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    free: "bg-gray-100 text-gray-700",
    member: "bg-blue-100 text-blue-700",
    master: "bg-purple-100 text-purple-700",
    both: "bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;