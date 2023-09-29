import React, { useRef } from 'react';
import DataGrid, {
  Selection,
  FilterRow,
  GroupPanel,
  StateStoring,
  Pager,
  Column,
} from 'devextreme-react/data-grid';

import service from './data.js';

const allowedPageSizes = [5, 10, 20];

function LayoutChange() {
  const orders = service.getOrders();
  const dataGrid = useRef(null);

  const onRefreshClick = () => {
    window.location.reload();
  };

  const onStateResetClick = () => {
    dataGrid.current.instance.state(null);
  };

  return (
    <React.Fragment>
      <div id="descContainer">
     {' '}
        <a onClick={onRefreshClick}>RRRR</a> 
        <a onClick={onStateResetClick}>reset</a> 
      </div>
      <DataGrid
        id="gridContainer"
        ref={dataGrid}
        dataSource={orders}
        keyExpr="ID"
        allowColumnResizing={true}
        allowColumnReordering={true}
        width="100%"
        showBorders={true}
      >
        <Selection mode="single" />
        <FilterRow visible={true} />
        <GroupPanel visible={true} />
        <StateStoring enabled={true} type="localStorage" storageKey="storage" />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={allowedPageSizes}
        />
        <Column dataField="OrderNumber" caption="Invoice Number" width={130} />
        <Column dataField="OrderDate" sortOrder="desc" dataType="date" />
        <Column
          dataField="SaleAmount"
          alignment="right"
          format="currency"
        />
        <Column dataField="Employee" />
        <Column
          dataField="CustomerStoreCity"
          caption="City"
        />
        <Column
          dataField="CustomerStoreState"
          caption="State"
          groupIndex={0}
        />
      </DataGrid>
    </React.Fragment>
  );
}

export default LayoutChange;
