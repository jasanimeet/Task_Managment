/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useRef, useEffect } from "react";
import DataGrid, {
  Column,
  GroupItem,
  GroupPanel,
  HeaderFilter,
  Paging,
  SearchPanel,
  Selection,
  SortByGroupSummaryInfo,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import axios from "axios";
import { API_BASE_URL } from "./config/API/api.config";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "./css/DevExtrimTwo.css";

const DevExtrimTwo = ({ selectedData, setSelectedData }) => {
  // console.log("selectedData",selectedData);

  const [tableData, setTableData] = useState([]);
  const [dropDownData, setDropDownData] = useState([]);
  const [clickIdGet, setClickIdGet] = useState("");
  const [stageStatue, setStageStatust] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [activeTabStatus, setActiveTabStatus] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const getChartDataCount = () => {
    axios
      .get(
        API_BASE_URL +
          `/report/get_new_task_detail?task=${
            selectedData ? selectedData : selectedValue
          }&task_Status=${clickIdGet}&stage_Status=${stageStatue}`
      )
      .then((res) => {
        setTableData(res?.data?.data);
      });
  };

  useEffect(() => {
    getChartDataCount();
  }, [selectedValue, clickIdGet, stageStatue]);

  const getDropDownData = () => {
    axios
      .get(API_BASE_URL + `/Report/get_task`)
      .then((res) => {
        setDropDownData(res?.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching dropdown data:", error);
      });
  };

  useEffect(() => {
    getDropDownData();
  }, [selectedValue]);

  const dataGridRef = useRef(null);

  const taskMap = {};

  const modifiedData = tableData?.map((item) => {
    const { task } = item;
    if (!taskMap[task]) {
      taskMap[task] = true;
      return item;
    }
    return { ...item, task: null };
  });

  const activeDataItem = (id) => {
    // setSelectedChartData(null)
    setClickIdGet(id);
  };
  const TaskStatusDataItem = (id) => {
    // setSelectedChartData(null)
    setStageStatust(id);
  };

  const totalDaysTakenGridCell = (data) => {
    if (data && data.displayValue === "RUNNING") {
      return (
        <div style={{ color: "red", fontWeight: "bold" }}>
          {data.displayValue}
        </div>
      );
    } else {
      return <div>{data.displayValue}</div>;
    }
  };
  // const [holdData,setHoldData] = useState([]);
  // console.log("holdData",holdData);

  // const totalDaysTakenGridCell2 = (data) => {
  //    if(data?.row?.data?.stages === "HOLD"){
  //     // console.log("data?.row?.data?.bw_daystaken",data?.row?.data);
  //     const newHoldData = data?.row?.data?.bw_daystaken;
  //     setHoldData((prevHoldData) => [...prevHoldData, newHoldData]);
  //   }
  //   if (data && data.displayValue === "RUNNING") {
  //     return (
  //       <div style={{ color: "red", fontWeight: "bold" }}>
  //         {data.displayValue}
  //       </div>
  //     );
  //   } else {
  //     return <div>{data.displayValue}</div>;
  //   }
  // };

  const totalDaysGridCell = (data) => {
    if (data && data.displayValue === 0) {
      return (
        <div style={{ color: "black", background: "#1afc17" }}>
          {data.displayValue}
        </div>
      );
    } else {
      return (
        <div
          style={{
            color: "black",
            background: data?.displayValue > 0 ? "red" : "",
          }}
        >
          {data.displayValue}
        </div>
      );
    }
  };

  const clearFilter = () => {
    setActiveTab("");
    setActiveTabStatus("");
    setStageStatust("");
    setClickIdGet("");
    setSelectedValue([""]);
    setSelectedData("");
  };

  const customizeDate = (data) => {
    return `${data.value}`;
  };

  // const calculateSelectedRow = (options) => {
  //   console.log("options",options?.value?.bw_daystaken);
  //   function convertToNumber(value) {
  //   if (value === null || value === "RUNNING" || typeof value === "undefined") {
  //     return 0;
  //   } else {
  //     return value;
  //   }
  // }
  //   console.log("12121",convertToNumber(options?.value?.bw_daystaken));
  //   if (options.name === "SelectedRowsSummary") {
  //     if (options.summaryProcess === "start") {
  //       options.totalValue = 0;
  //       // console.log("options.totalValue",options.totalValue);
  //     } else if (options.summaryProcess === "calculate") {
  //       // if (options?.value?.stage !== "HOLD") {
  //         options.totalValue += convertToNumber(options?.value?.bw_daystaken);
  //       // }
  //     }
  //   }
  // };

  // const calculateSelectedRow = (options) => {
  //   if (options.summaryProcess === "start") {
  //     options.totalValue = 0;
  //   } else if (options.summaryProcess === "calculate") {
  //     if (
  //       options.value.stage !== "HOLD" &&
  //       !isNaN(options.value.bw_daystaken) &&
  //       options.value.bw_daystaken !== null &&
  //       options.value.bw_daystaken !== "RUNNING" &&
  //       options.value.bw_daystaken !== "undefined"
  //     ) {
  //       // Add the valid bw_daystaken value to totalValue
  //       options.totalValue += parseFloat(options.value.bw_daystaken);
  //     }
  //   }
  // };

  // const calculateSelectedRowTotle = (options) => {
  //   if (options.summaryProcess === "start") {
  //     options.totalValue = 0;
  //   } else if (options.summaryProcess === "calculate") {
  //     if (
  //       options.value.stage !== "HOLD" &&
  //       !isNaN(options.value.tot_daystaken) &&
  //       options.value.tot_daystaken !== null &&
  //       options.value.tot_daystaken !== "RUNNING" &&
  //       options.value.tot_daystaken !== "undefined"
  //     ) {
  //       // Add the valid tot_daystaken value to totalValue
  //       options.totalValue += parseFloat(options.value.tot_daystaken);
  //     }
  //   }
  //   // }
  // };
  
  const calculateCustomSummary = (options) => {
    // if (options.name === "SelectedRowsSummary") {
      if (options.summaryProcess === "start") {
        options.totalValue = 0;
      } else if (options.summaryProcess === "calculate") {
        console.log("options.value.stage ",options.value.stage);
        if (options.value.stage !== "HOLD") {

          // Check the column name and apply the appropriate calculation function
          if (options.name === "bw_daystaken") {
            if (
              !isNaN(options.value.bw_daystaken) &&
              options.value.bw_daystaken !== null &&
              options.value.bw_daystaken !== "RUNNING" &&
              options.value.bw_daystaken !== "undefined"
            ) {
              options.totalValue += parseFloat(options.value.bw_daystaken);
            }
          } else if (options.name === "tot_daystaken") {
           if (
              !isNaN(options.value.tot_daystaken) &&
              options.value.tot_daystaken !== null &&
              options.value.tot_daystaken !== "RUNNING" &&
              options.value.tot_daystaken !== "undefined"
            ) {
              options.totalValue += parseFloat(options.value.tot_daystaken);
            }
          }
        }
      // }
    }
  };
  return (
    <div>
      <div className="filter-main">
        <p
          className={`filter-btn ${activeTab === "ACTIVE" ? "active" : ""}`}
          onClick={() => {
            activeDataItem("ACTIVE");
            setActiveTab("ACTIVE");
          }}
        >
          ACTIVE
        </p>
        <p
          className={`filter-btn ${activeTab === "INACTIVE" ? "active" : ""}`}
          onClick={() => {
            activeDataItem("INACTIVE");
            setActiveTab("INACTIVE");
          }}
        >
          INACTIVE
        </p>
        <p
          className={`filter-btn ${activeTab === "FINISHED" ? "active" : ""}`}
          onClick={() => {
            activeDataItem("FINISHED");
            setActiveTab("FINISHED");
          }}
        >
          FINISHED
        </p>

        <p
          className={`filter-btn ${
            activeTabStatus === "CLOSE" ? "active" : ""
          }`}
          onClick={() => {
            TaskStatusDataItem("CLOSE");
            setActiveTabStatus("CLOSE");
          }}
        >
          CLOSE
        </p>
        <p
          className={`filter-btn ${activeTabStatus === "HOLD" ? "active" : ""}`}
          onClick={() => {
            TaskStatusDataItem("HOLD");
            setActiveTabStatus("HOLD");
          }}
        >
          HOLD
        </p>
        <p
          className={`filter-btn ${
            activeTabStatus === "RUNNING" ? "active" : ""
          }`}
          onClick={() => {
            TaskStatusDataItem("RUNNING");
            setActiveTabStatus("RUNNING");
          }}
        >
          RUNNING
        </p>
        <div className="filter-btn">
          <button className="clear-button" onClick={clearFilter}>
            Clear
          </button>
        </div>
      </div>

      <select
        style={{
          height: "35px",
        }}
        value={selectedValue}
        onChange={(e) => {
          setSelectedData(), setSelectedValue(e.target.value);
        }}
      >
        {dropDownData?.map((item) => (
          <option value={item?.task}>{item?.task}</option>
        ))}
      </select>
      <DataGrid
        id="gridContainer"
        height={650}
        ref={dataGridRef}
        dataSource={tableData}
        allowColumnResizing
        hoverStateEnabled={true}
        columnAutoWidth={true}
        showRowLines={true}
        showBorders={true}
      >
        <GroupPanel visible={true} />
        <Selection mode="single" />

        <Column alignment="center" dataField="task" groupIndex={0} width={230}>
          <HeaderFilter />
        </Column>

        <Column dataField="stage" alignment="left" dataType="stage">
          <HeaderFilter />
        </Column>

        <Column alignment="center" caption="SUNRISE">
          <Column
            alignment="center"
            caption="Start Date"
            dataField="sun_startdate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>START</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            dataField="sun_target_days"
            caption="TARGET DAYS"
            alignment="center"
            width={70}
            headerCellRender={() => (
              <div>
                <div>TARGET</div>
                <div style={{ textAlign: "center" }}>DAYS</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="TARGET DATE"
            dataField="sun_targetdate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>TARGET</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="DAYS TAKEN"
            cellRender={totalDaysTakenGridCell}
            dataField="sun_daystaken"
            width={70}
            headerCellRender={() => (
              <div>
                <div>DAYS</div>
                <div style={{ textAlign: "center" }}>TAKEN</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="END DATE"
            dataField="sun_enddate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>END</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="(+/-DAYS)"
            cellRender={totalDaysGridCell}
            dataField="sun_extradays"
            width={80}
            headerCellRender={() => (
              <div>
                <div>(+/-DAYS)</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
        </Column>

        <Column alignment="center" cssClass="red-header" caption="BRAINWAVES">
          <Column
            alignment="center"
            caption="START DATE"
            dataField="bw_startdate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>START</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            dataField="bw_target_days"
            caption="TARGET DAYS"
            alignment="center"
            width={70}
            headerCellRender={() => (
              <div>
                <div>TARGET</div>
                <div style={{ textAlign: "center" }}>DAYS</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="TARGET DATE"
            dataField="bw_targetdate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>TARGET</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="DAYS TAKEN"
            cellRender={totalDaysTakenGridCell}
            dataField="bw_daystaken"
            width={70}
            headerCellRender={() => (
              <div>
                <div>DAYS</div>
                <div style={{textAlign: 'center'}}>TAKEN</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="END DATE"
            dataField="bw_enddate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>END</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="(+/-DAYS)"
            cellRender={totalDaysGridCell}
            dataField="bw_extradays"
            width={80}
            headerCellRender={() => (
              <div>
                <div>(+/-DAYS)</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
        </Column>

        <Column alignment="center" caption="TOTAL">
          <Column
            alignment="center"
            caption="START DATE"
            dataField="tot_startdate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>START</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            dataField="tot_target_days"
            caption="TARGET DAYS"
            alignment="center"
            dataType="tot_target_days"
            width={70}
            headerCellRender={() => (
              <div>
                <div>TARGET</div>
                <div style={{ textAlign: "center" }}>DAYS</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="TARGET DATE"
            dataField="tot_target_date"
            width={90}
            headerCellRender={() => (
              <div>
                <div>TARGET</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="DAYS TAKEN"
            cellRender={totalDaysTakenGridCell}
            dataField="tot_daystaken"
            width={70}
            headerCellRender={() => (
              <div>
                <div>DAYS</div>
                <div style={{ textAlign: "center" }}>TAKEN</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="END DATE"
            dataField="tot_enddate"
            width={90}
            headerCellRender={() => (
              <div>
                <div>END</div>
                <div style={{ textAlign: "center" }}>DATE</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="(+/-DAYS)"
            cellRender={totalDaysGridCell}
            dataField="tot_extradays"
            width={80}
            headerCellRender={() => (
              <div>
                <div>(+/-DAYS)</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
        </Column>
        <Column dataField="remark" alignment="center" dataType="stage">
          <HeaderFilter />
        </Column>
        {/* <Summary calculateCustomSummary={("bw_daystaken" && calculateSelectedRow)}> */}
        <Summary calculateCustomSummary={calculateCustomSummary}>
          <GroupItem
            column="sun_target_days"
            summaryType="sum"
            customizeText={customizeDate}
            showInGroupFooter={true}
          />
          <GroupItem
            column="sun_daystaken"
            customizeText={customizeDate}
            summaryType="sum"
            showInGroupFooter={true}
          />
          <GroupItem
            column="sun_extradays"
            customizeText={customizeDate}
            summaryType="sum"
            showInGroupFooter={true}
          />
          <TotalItem
            column="sun_target_days"
            customizeText={customizeDate}
            summaryType="sum"
          />
          <TotalItem
            column="sun_daystaken"
            customizeText={customizeDate}
            summaryType="sum"
          />
          <TotalItem
            column="sun_extradays"
            customizeText={customizeDate}
            summaryType="sum"
          />

          {/* BW */}
          <GroupItem
            name="bw_daystaken"
            showInGroupFooter={true}
            showInColumn="bw_daystaken"
            displayFormat="{0}"
            summaryType="custom"
          />
          <GroupItem
            column="bw_target_days"
            summaryType="sum"
            customizeText={customizeDate}
            showInGroupFooter={true}
          />
          <GroupItem
            column="bw_extradays"
            customizeText={customizeDate}
            summaryType="sum"
            showInGroupFooter={true}
          />
          <TotalItem
            column="bw_target_days"
            customizeText={customizeDate}
            summaryType="sum"
          />
          <TotalItem
            name="bw_daystaken"
            summaryType="custom"
            displayFormat="{0}"
            showInColumn="bw_daystaken"
          />
          <TotalItem
            column="bw_extradays"
            customizeText={customizeDate}
            summaryType="sum"
          />

          {/* Totle */}
          <GroupItem
            column="tot_target_days"
            summaryType="sum"
            customizeText={customizeDate}
            showInGroupFooter={true}
          />
          <GroupItem
            name="tot_daystaken"
            showInGroupFooter={true}
            showInColumn="tot_daystaken"
            displayFormat="{0}"
            summaryType="custom"
          />
          <GroupItem
            column="tot_extradays"
            customizeText={customizeDate}
            summaryType="sum"
            showInGroupFooter={true}
          />

          <TotalItem
            column="tot_target_days"
            customizeText={customizeDate}
            summaryType="sum"
          />
          <TotalItem
            name="tot_daystaken"
            summaryType="custom"
            displayFormat="{0}"
            showInColumn="tot_daystaken"
          />
          <TotalItem
            column="tot_extradays"
            customizeText={customizeDate}
            summaryType="sum"
          />
        </Summary>
       
        {/* <SortByGroupSummaryInfo summaryItem="count" /> */}
        {/* <Summary calculateCustomSummary={calculateSelectedRow}>
          <TotalItem
            name="SelectedRowsSummary"
            summaryType="custom"
            displayFormat="Sum: "
            showInColumn="sun_target_days"
            value={selectedAmount} />
        </Summary> */}
        <Paging enabled={false} />
      </DataGrid>
    </div>
  );
};

export default DevExtrimTwo;
