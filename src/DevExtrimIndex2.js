import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config/API/api.config";
import { PivotGrid } from "devextreme-react";
import { FieldChooser, FieldPanel } from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

const DevExtrimIndex2 = () => {
  const [chartTable, setChartTable] = useState([]);

  const getChartDataCount = () => {
    axios.get(API_BASE_URL + `/report/get_stage_history`).then((res) => {
      setChartTable(res?.data?.data);
    });
  };

  useEffect(() => {
    getChartDataCount();
  }, []);

  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: "category",
        dataField: "category",
        area: "filter",
      },
      {
        dataField: "targetdays",
        dataType: "number",
        summaryType: "sum",
        area: "data",
      },
      {
        dataField: "daystaken",
        dataType: "daystaken",
        summaryType: "sum",
        area: "data",
      },
      {
        dataField: "task",
        dataType: "task",
        area: "row",
      },
      {
        dataField: "stages",
        dataType: "stages",
        area: "row",
      },
      {
        caption: "Start Date",
        dataField: "startdate",
        dataType: "startdate",
        summaryType: "shortDate",
        area: "filter",
      },
      {
        caption: "End Date",
        dataField: "enddate",
        dataType: "enddate",
        area: "filter",
      },
      {
        dataField: "status",
        dataType: "status",
        area: "filter",
      },
      {
        caption: "daydiff",
        dataField: "daydiff",
        summaryType: "sum",
        area: "data",
      },
      {
        caption: "Department",
        dataField: "department",
        area: "column",
      },
    ],
    store: chartTable,
  });


  return (
    <div>
      <PivotGrid
        id="gridContainer"
        dataSource={dataSource}
        hoverStateEnabled={true}
        columnAutoWidth={true}
        allowSortingBySummary={true}
        allowFiltering={true}
        showBorders={true}
        allowSorting={true}
      >
        <FieldPanel allowFieldDragging={true} visible={true} />
        <FieldChooser />
      </PivotGrid>
    </div>
  );
};

export default DevExtrimIndex2;
