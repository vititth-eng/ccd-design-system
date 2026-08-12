"use client";

import { Dialog } from "@base-ui/react/dialog";

/**
 * Base UI smoke test, deliberately unstyled.
 *
 * The point is not how it looks — it is whether the behaviour static HTML
 * could never show actually works: focus moves into the dialog on open, Tab
 * is trapped inside it, Escape closes, and focus returns to the trigger.
 * Press Tab on the mock in explore/shell-concept.html and none of that
 * happens; that gap is the entire reason for this stack.
 */
export default function ProbePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-semibold">Base UI — behaviour probe</h1>
      <p className="text-base text-muted-foreground mt-2">
        Open it, then press Tab repeatedly. Focus should cycle inside the dialog and never reach
        the page behind. Escape closes and returns focus to the trigger.
      </p>

      <Dialog.Root>
        <Dialog.Trigger className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Open dialog
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-scrim" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6">
            <Dialog.Title className="text-lg font-semibold">ยืนยันการบันทึก</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mt-1">
              Three focusable controls, so a trap is observable rather than assumed.
            </Dialog.Description>

            <input
              className="mt-4 w-full rounded-md border border-border bg-background px-3 py-2 text-base"
              placeholder="พิมพ์อะไรก็ได้"
            />

            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
                ยกเลิก
              </Dialog.Close>
              <Dialog.Close className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                บันทึก
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
