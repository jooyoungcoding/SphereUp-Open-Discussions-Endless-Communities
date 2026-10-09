"use client";

import React, { useEffect, useState } from "react";
import { ToastParam, ToastStatus } from "./Toast";
import { Check, AlertCircle, X } from "lucide-react";

const TOAST_COLOR: Record<ToastStatus, string> = {
  success: "#2AAA8A", // Xanh dịu
  warning: "#F4BB44", // Vàng ấm/hổ phách
  error: "#DE3163", // Đỏ gạch dịu
};

const StatusIcon = ({ status }: { status: ToastStatus }) => {
  const color = TOAST_COLOR[status];
  if (status === "success") return <Check size={18} color={color} />;
  if (status === "warning") return <AlertCircle size={18} color={color} />;
  if (status === "error") return <X size={18} color={color} />;
  return null;
};

const ToastContainer: React.FC = () => {
  const [toast, setToast] = useState<ToastParam | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleToast = (e: Event) => {
      clearTimeout(timer);
      setToast((e as CustomEvent<ToastParam>).detail);

      // Kích hoạt transition trượt vào
      setIsVisible(false);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      // Tự biến mất sau 3 giây (trượt ngược lại rồi dọn state)
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setToast(null), 250);
      }, 3000);
    };

    window.addEventListener("SHOW_TOAST", handleToast);
    return () => {
      window.removeEventListener("SHOW_TOAST", handleToast);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  const isLeft = toast.position.includes("left");

  const posStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
    padding: "20px",
    top: toast.position.includes("top") ? 0 : "auto",
    bottom: toast.position.includes("bottom") ? 0 : "auto",
    left: isLeft ? 0 : "auto",
    right: toast.position.includes("right") ? 0 : "auto",
    overflow: "hidden", // Đảm bảo không tạo scrollbar khi trượt
  };

  return (
    <div style={posStyle}>
      <div
        style={{
          backgroundColor: "#28282B",
          color: "#ffffff",
          border: `1.5px solid ${TOAST_COLOR[toast.status]}`,
          borderRadius: "6px",
          fontWeight: "600",
          boxShadow: "none",
          padding: "10px 14px",
          minWidth: "240px",
          maxWidth: "360px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          lineHeight: "1.4",
          // Hiệu ứng trượt ngang và mờ dần
          transition:
            "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateX(0)"
            : isLeft
              ? "translateX(-30px)" // Bay từ bên trái vào
              : "translateX(30px)", // Bay từ bên phải vào
        }}
      >
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <StatusIcon status={toast.status} />
        </div>
        <span style={{ flex: 1, wordBreak: "break-word" }}>
          {toast.message}
        </span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => setToast(null), 200);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ToastContainer;
