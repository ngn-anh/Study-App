import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import './index.less';

const PageContainerFixed = (props: any) => {
  return (
    <div className="page-container">
      <PageContainer
        title={false}
        {...props}
        breadcrumbRender={false}
      >
        {props.children}
      </PageContainer>
    </div>
  );
};
export default React.memo(PageContainerFixed);