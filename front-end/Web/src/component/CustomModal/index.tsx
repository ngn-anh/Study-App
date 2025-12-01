import React from "react";
import { Modal } from "antd";
import { WarningCircle, Info } from "phosphor-react";
import "./index.less";

export type ModalType = "default" | "warning";

interface CustomModalProps {
  open: boolean;
  type?: ModalType;
  icon?: React.ReactNode;
  title: string;
  content?: React.ReactNode;
  textOk?: string;
  textCancel?: string;
  handleOk?: () => void;
  handleCancel?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  type = "default",
  icon,
  title,
  content,
  textOk = "OK",
  textCancel = "Hủy",
  handleOk,
  handleCancel,
}) => {
  const renderIcon = () => {
    if (icon) return icon;

    if (type === "warning")
      return <WarningCircle size={22} weight="fill" className="icon-warning" />;

    return <Info size={22} weight="fill" className="icon-default" />;
  };

  return (
    <Modal
      centered
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      closable={true}
      className={`custom-modal ${type}`}
    >
      <div className="modal-header">
        {renderIcon()}
        <span className="modal-title">{title}</span>
      </div>

      <div className="modal-content">{content}</div>

      <div className="modal-footer">
        <button className="btn-cancel" onClick={handleCancel}>
          {textCancel}
        </button>

        <button className={`btn-ok ${type}`} onClick={handleOk}>
          {textOk}
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;
