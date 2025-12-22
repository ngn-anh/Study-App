import { ProTable } from '@ant-design/pro-components';
import React from 'react';
import './index.less';
import PaginationShowTotal from '../PaginationShowTotal';
import { HEIGHT_NUMBER, WIDTH_NUMBER } from '../../utils/size-constant';
import { Empty } from 'antd';
import { FileX } from 'phosphor-react';

const ProTableFixed = (props: any) => {
  const stickyDefault = {
    offsetHeader:
      HEIGHT_NUMBER.navbarHeader + HEIGHT_NUMBER.titleHeader + HEIGHT_NUMBER.filterBarHeader,
  };

  const headerFixedHeightDefault =
    HEIGHT_NUMBER.navbarHeader +
    HEIGHT_NUMBER.titleHeader +
    HEIGHT_NUMBER.filterBarHeader +
    HEIGHT_NUMBER.paginationTable;

  const scrollDefault = {
    x: WIDTH_NUMBER.scrollTable,
    y: `calc(100vh - ${props?.headerFixedHeight ?? headerFixedHeightDefault}px)`,
  };

  return (
    <div className="edufit-table-fixed">
      <ProTable
        scroll={
          props.isFixed == false
            ? undefined
            : props.scroll == undefined
            ? scrollDefault
            : props.scroll
        }
        sticky={
          props.sticky == false
            ? undefined
            : props.sticky == undefined
            ? stickyDefault
            : props.sticky
        }
        revalidateOnFocus={false}
        bordered={props.bordered ?? false}
         locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Không có dữ liệu"} />
          ),
        }}
        headerTitle={false}
        search={false}
        options={{
          search: false,
          reload: true,
          setting: false,
          density: false,
        }}
        tableClassName={props.className}
        toolBarRender={false}
        pagination={
          props.pagination ?? {
            showSizeChanger: true,
            showTotal: (all: any, range: any) => <PaginationShowTotal all={all} range={range} />,
          }
        }
        onChange={props.onTableChange}
        {...props}
      />
    </div>
  );
};
export default React.memo(ProTableFixed);