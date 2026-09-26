"use client";

import { useEffect } from "react";
import { ATTRIBUTION_STORAGE_KEY, captureAttribution, type Attribution } from "@/lib/attribution";

/**
 * Records where this visit came from, once, on the first page it renders on.
 *
 * Mounted in the root layout so it sees the true landing page. It writes only
 * if nothing is stored yet: a later internal navigation must not overwrite the
 * campaign that brought the visitor here, which is the one thing worth
 * knowing. A fresh tab is a fresh visit, which is what sessionStorage gives.
 *
 * Renders nothing.
 */
export function AttributionTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;

      const captured: Attribution = captureAttribution();
      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(captured));
    } catch {
      // Private mode, blocked storage, quota. Attribution is a nice-to-have;
      // it must never take a page down with it.
    }
  }, []);

  return null;
}
