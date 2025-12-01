import React, { type JSX } from 'react';
import { DrawerForm } from '@ant-design/pro-components';
import type { DrawerFormProps } from '@ant-design/pro-form/es/layouts/DrawerForm';
import type { DrawerProps } from 'antd';
import { Divider } from 'antd';
import './index.less';
import { WIDTH_NUMBER } from '../../utils/size-constant';

export type EdufitDrawerFormProps = {
  titleHeader: JSX.Element | string | undefined;
  subTitleHeader?: JSX.Element | string | undefined;
  drawerFormProps?: DrawerFormProps;
  drawerProps: Omit<DrawerProps, 'open'>;
  children?: JSX.Element;
  formRef?: any;
  initialValues?: any;
  width?: number | string;
};

const EdufitDrawerForm: React.FC<EdufitDrawerFormProps> = (props) => {
  const { titleHeader, subTitleHeader, drawerFormProps, drawerProps, children, formRef, width } =
    props;

  return (
    <DrawerForm
      {...drawerFormProps}
      title={<>{titleHeader}</>}
      formRef={formRef}
      autoFocusFirstInput
      submitTimeout={2000}
      drawerProps={{
        ...drawerProps,
        destroyOnClose: true,
        className: 'custom-drawer-form',
      }}
      width={width ? width : WIDTH_NUMBER.drawerForm}
    >
      <div className="form-subtitle">{subTitleHeader}</div>
      <Divider />
      {children}
    </DrawerForm>
  );
};
export default React.memo(EdufitDrawerForm);