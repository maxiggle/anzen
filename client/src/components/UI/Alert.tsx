import React from "react";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import { clsx } from "../../utils";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
  type?: AlertType;
  children: React.ReactNode;
  className?: string;
}

interface AlertStyles {
  padding: string;
  borderRadius: string;
  marginBottom: string;
  fontWeight: string;
  display: string;
  alignItems: string;
}

interface AlertTypeStyles {
  backgroundColor: string;
  color: string;
  borderColor: string;
  icon: JSX.Element;
}

const alertStyles: AlertStyles = {
  padding: "10px 20px",
  borderRadius: "4px",
  marginBottom: "15px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
};

const alertTypes: Record<AlertType, AlertTypeStyles> = {
  info: {
    backgroundColor: "#e6f7ff",
    color: "#1890ff",
    borderColor: "#91d5ff",
    icon: <FaInfoCircle />,
  },
  success: {
    backgroundColor: "#f6ffed",
    color: "#52c41a",
    borderColor: "#b7eb8f",
    icon: <FaCheckCircle />,
  },
  warning: {
    backgroundColor: "#fffbe6",
    color: "#faad14",
    borderColor: "#ffe58f",
    icon: <FaExclamationTriangle />,
  },
  error: {
    backgroundColor: "#fff2f0",
    color: "#ff4d4f",
    borderColor: "#ffccc7",
    icon: <FaTimesCircle />,
  },
};

export default function Alert({
  type = "info",
  children,
  className,
}: AlertProps): JSX.Element {
  const style = {
    ...alertStyles,
    ...alertTypes[type],
    border: `1px solid ${alertTypes[type].borderColor}`,
  };

  return (
    <div
      style={style}
      className={clsx(["!rounded-md", className])}
      role="alert"
    >
      <span style={{ marginRight: "10px" }}>{alertTypes[type].icon}</span>
      {children}
    </div>
  );
}
