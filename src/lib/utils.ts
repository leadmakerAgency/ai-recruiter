import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const slugAgentMap: Record<string, string> = {
  edson: "agent_9501k7qamwsgf36s56prjq6g5b87",
  griffin: "agent_2301k7rssrjfe6hrz2q7p4px6355",
  tammy: "agent_8701k7t0e8kke03bgs229zwkzehe",
  sales: "agent_8901k329d3mxepqt8k5qv8kvzhv9",
  frickey: "agent_2001k84gjhd3frma6vfckjbrcn2f"
};
