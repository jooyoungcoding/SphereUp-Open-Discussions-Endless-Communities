export type ToastStatus = "error" | "warning" | "success";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface ToastParam {
  position: ToastPosition;
  message: string;
  status: ToastStatus;
}

export const ToastNotify = (
  position: ToastPosition = "top-right",
  message: string,
  status: ToastStatus = "success",
) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("SHOW_TOAST", {
      detail: {
        position: position || "top-right",
        message,
        status,
      },
    }),
  );
};
