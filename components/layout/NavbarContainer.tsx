
"use client";

import Navbar from "./Navbar";

/**
 * Compatibility wrapper for layouts that render NavbarContainer.
 * Navbar manages its own Better Auth session and logout behavior.
 */
export default function NavbarContainer() {
  return <Navbar />;
}
