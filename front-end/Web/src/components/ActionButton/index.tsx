import { Button, Space, Popconfirm, Tooltip } from "antd";
import { ReactNode } from "react";
import { hasPermission } from "../../utils/permission";

interface ActionButtonProps {
  /**
   * Quyền cần có để hiển thị button
   * Ví dụ: "user.create", "role.delete"
   */
  permission: string;
  /**
   * Text hiển thị trên button
   */
  text: string;
  /**
   * Callback khi click button
   */
  onClick?: () => void;
  /**
   * Button type (primary, default, dashed, text, link)
   */
  type?: "primary" | "default" | "dashed" | "text" | "link";
  /**
   * Button danger (red color)
   */
  danger?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Size của button
   */
  size?: "large" | "middle" | "small";
  /**
   * Icon component
   */
  icon?: ReactNode;
  /**
   * Nếu có, sẽ hiển thị confirm dialog trước khi execute
   */
  popconfirm?: {
    title: string;
    description?: string;
    okText?: string;
    cancelText?: string;
  };
  /**
   * Tooltip text khi user không có quyền
   */
  tooltipTitle?: string;
}

/**
 * Component button tự động check quyền
 * Nếu user không có quyền, button sẽ bị disabled
 * 
 * Ví dụ:
 * <ActionButton
 *   permission="user.delete"
 *   text="Xoá"
 *   danger
 *   onClick={() => handleDelete()}
 * />
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  permission,
  text,
  onClick,
  type = "default",
  danger = false,
  loading = false,
  disabled = false,
  size = "middle",
  icon,
  popconfirm,
  tooltipTitle,
}) => {
  const hasAccess = hasPermission(permission);
  const isDisabled = disabled || !hasAccess;

  const buttonElement = (
    <Button
      type={type}
      danger={danger}
      loading={loading}
      disabled={isDisabled}
      size={size}
      icon={icon}
      onClick={onClick}
    >
      {text}
    </Button>
  );

  // Nếu có confirm, wrap với Popconfirm
  if (popconfirm && hasAccess) {
    return (
      <Popconfirm
        title={popconfirm.title}
        description={popconfirm.description}
        onConfirm={onClick}
        okText={popconfirm.okText || "OK"}
        cancelText={popconfirm.cancelText || "Hủy"}
      >
        {buttonElement}
      </Popconfirm>
    );
  }

  // Nếu user không có quyền, hiển thị tooltip
  if (!hasAccess && tooltipTitle) {
    return (
      <Tooltip title={tooltipTitle}>
        <span>{buttonElement}</span>
      </Tooltip>
    );
  }

  return buttonElement;
};

export default ActionButton;
