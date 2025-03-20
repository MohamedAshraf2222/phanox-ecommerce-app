"use client"; // Mark this as a Client Component
import { StateContext } from "@/context/StateContext";

export default function ClientWrapper({ children }) {
  return <StateContext>{children}</StateContext>;
}
