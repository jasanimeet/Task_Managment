/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import DataGrid, {
  Column,
  FilterRow,
  GroupPanel,
  HeaderFilter,
  Paging,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import axios from "axios";
import Chart from "react-google-charts";
import { API_BASE_URL } from "./config/API/api.config";
import FirstPieChart from "./pages/PieChart/FirstPieChart";
import StackBarChart from "./pages/PieChart/StackBarChart";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import DiscountCell from "./common/DiscountCell";
import "./css/Devextrim.css";
import { Box, CircularProgress } from "@mui/material";

const Devextrim = ({ setSelectedView, setSelectedData }) => {
  const [chartData, setChartData] = useState([]);
  const [chartDataCount, setChartDataCount] = useState([]);
  const [chartDataDepartment, setChartDataDepartment] = useState([]);
  const [clickIdGet, setClickIdGet] = useState("");
  const [chartTable, setChartTable] = useState([]);
  const [selectData, setSelectData] = useState("");
  const [selectOption, setSelectOption] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [loader, setLoader] = useState(true);
  const [userName, setUserName] = useState('');
  console.log("userName",userName);
  const handleInputChange = (event) => {
    // Update the userName state with the new value from the input field
    setUserName(event.target.value);
  };
  const countMap = {};
  selectOption?.forEach((item) => {
    countMap[item] = (countMap[item] || 0) + 1;
  });

  const getChartDataCount = () => {
    // setLoader(true);
    axios.get(API_BASE_URL + `/report/getcurrenttaskstatus`).then((res) => {
      const modifiedData = res?.data?.data?.map((item) => {
        // Check if task_status is "RUNNING" and whole_end_date is greater than today
        const taskIsRunning = item.task_status === "RUNNING";
        const endDateIsGreaterThanToday = item.whole_end_date
          ? new Date(item.whole_end_date) > new Date()
          : false;
        // Add a new field 'QueryStatus' with true/false value
        item.QueryStatus = taskIsRunning && endDateIsGreaterThanToday;

        return item;
      });
      setChartDataCount(modifiedData);
      setLoader(false);
    });
  };

  useEffect(() => {
    getChartDataCount();
  }, []);

  const getChartData = () => {
    axios
      .get(
        API_BASE_URL + `/report/getcurrenttaskstatus?status_flag=${clickIdGet}`
      )
      .then((res) => {
        setChartData(res?.data?.data);

        const ress = res?.data?.data?.map((x) => x.department);
        setSelectOption(ress);
      });
  };

  useEffect(() => {
    getChartData();
  }, [clickIdGet]);

  const getCountByStatusFlag = (statusFlag) => {
    return chartDataCount?.filter((x) => x?.status === statusFlag).length;
  };

  // Dynamic counts based on Status_Flag
  const activeData = getCountByStatusFlag("ACTIVE");
  const inActiveData = getCountByStatusFlag("INACTIVE");
  const finishedData = getCountByStatusFlag("CLOSE");

  const getChartDataDepart = () => {
    setLoader(true)
    axios
      .get(
        API_BASE_URL + `/report/getcurrenttaskstatus?department=${selectData}`
      )
      .then((res) => {
        setChartDataDepartment(res?.data?.data);
        setTimeout(() => {
          
          setLoader(false)
        }, 3000);
      });
  };

  useEffect(() => {
    getChartDataDepart();
  }, [selectData]);

  const applyFilterTypes = [
    {
      key: "auto",
      name: "Immediately",
    },
    {
      key: "onClick",
      name: "On Button Click",
    },
  ];

  const [currentFilter, setCurrentFilter] = useState(applyFilterTypes[0].key);
  const [itemData, setItemData] = useState(null);
  const dataGridRef = useRef(null);
  const options = {
    title: "Task Status",
    titleTextStyle: {
      fontSize: 15,
      color: "#6f6f6f",
    },
  };

  const convertApiDataToChartData = (data) => {
    const closefilter = data.map((x) => x.task_status);

    const closeCount = closefilter.filter((item) => item === "CLOSE").length;
    const counterCount = closefilter.filter((item) => item === "HOLD").length;
    const runningCount = closefilter.filter(
      (item) => item === "RUNNING"
    ).length;

    // const datafilter = data.status.filter((x)=>x.status)
    const chartdataConvert = [
      ["Task", "Count"],
      ["Close", closeCount],
      ["HOLD", counterCount],
      ["Running", runningCount],
    ];
    // console.log("chartdataConvert",chartdataConvert);
    //     const taskStatuses = [];
    //     data.forEach((item) => {
    //       if (!taskStatuses.includes(item.task_status)) {
    //         taskStatuses.push(item.task_status);
    //       }
    //     });
    //     taskStatuses.forEach((status) => {
    //       const count = data.filter((item) => item.task_status === status).length;
    //       chartdataConvert.push([status, count]);
    //     });
    //     console.log("taskStatuses****",chartdataConvert);
    return chartdataConvert;
  };

  const chartDataConvert = convertApiDataToChartData(chartDataDepartment);
  const [selectedChartData, setSelectedChartData] = useState(null);
  const [activChart, setActivChart] = useState('');

  const handleChartSelect = ({ chartWrapper }) => {
    const chart = chartWrapper?.getChart?.();
    const chartDataConverToNew = convertApiDataToChartData(chartDataDepartment);
  
    if (chart && chart.getSelection().length === 1) {
      const selection = chart.getSelection()[0];
      const category = chartDataConverToNew[selection.row + 1]?.[0];
      const value = chartDataConverToNew[selection.row + 1]?.[1];
  
      // Toggle selection status
      const isSelected = chartDataConvert[selection.row + 1]?.[3] === 1 ? 0 : 1;
      chartDataConvert[selection.row + 1][3] = isSelected;
  
      // Update the chart data to trigger a re-render with the new selection status
      setActivChart([...chartDataConvert]);
  
      // Handle the selected chart data
      setSelectedChartData({ category, value });
    }
  };
  

  useEffect(() => {
    // setLoader(true)
    axios
      .get(
        API_BASE_URL +
          `/report/getcurrenttaskstatus?task_Status=${selectedChartData?.category}`
      )
      .then((res) => {
        setChartTable(res?.data?.data);
        // setLoader(false)
      });
  }, [selectedChartData, clickIdGet]);

  const activeDataItem = (id) => {
    setItemData(null);
    setSelectedChartData(null);
    setClickIdGet(id);
    setActiveTab(id);
  };

  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false);

  const handleSelectionChanged = (selectedItems) => {
    if (selectedItems.length > 0) {
      setShowEmployeeInfo(true);
    } else {
      setShowEmployeeInfo(false);
    }
  };

  const renderGridCell = (data) => {
    if (data && data.displayValue === "HOLD") {
      return (
        <div style={{ color: "red", fontWeight: "bold" }}>
          {data.displayValue}
        </div>
      );
    } else {
      return <div>{data.displayValue}</div>;
    }
  };

  const renderGridCellDepartment = (data) => {
    if (data && data?.data?.prv_stage !== null) {
      return (
        <div style={{fontWeight: "bold" }}>
          {data.displayValue}
        </div>
      );
    } else {
      return <div>{data.displayValue}</div>;
    }
  };

  const renderGridCellTaskDelay = (data) => {
    if (data && data.displayValue === 0) {
      return (
        <div
          style={{ fontWeight: "bold", color: "black", background: "#1afc17" }}
        >
          {data.displayValue}
        </div>
      );
    } else {
      return (
        <div
          style={{
            fontWeight: "bold",
            color: "black",
            background: data?.displayValue > 0 ? "red" : "#3a9efc",
          }}
        >
          {data.displayValue}
        </div>
      );
    }
  };

  const renderGridCellOriginalDueDays = (data) => {
    if (data && data.displayValue === 0) {
      return (
        <div
          style={{ fontWeight: "bold", color: "black", background: "#1afc17" }}
        >
          {data.displayValue}
        </div>
      );
    } else {
      return (
        <div
          style={{
            fontWeight: "bold",
            color: "black",
            background: data?.displayValue > 0 ? "red" : "#3a9efc",
          }}
        >
          {data.displayValue}
        </div>
      );
    }
  };

  const renderGridCellTotalTaskDelay = (data) => {
    if (data && data.displayValue === 0) {
      return (
        <div
          style={{ fontWeight: "bold", color: "black", background: "#1afc17" }}
        >
          {data.displayValue}
        </div>
      );
    } else {
      return (
        <div
          style={{
            fontWeight: "bold",
            color: "black",
            background: data?.displayValue > 0 ? "red" : "#3a9efc",
          }}
        >
          {data.displayValue}
        </div>
      );
    }
  };

  // const renderGrideCellWholeTask = (data) =>{
  //   const today = Date.now();
  //   const toDayaDate = (new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(today));

  //   function formatDate(toDayaDate) {
  //     // Split the input date into components
  //     const dateComponents = toDayaDate.split('/');

  //     // Rearrange the components in the desired format (DD-MM-YYYY)
  //     const formattedDate = `${dateComponents[1]}-${dateComponents[0]}-${dateComponents[2]}`;
  //     return formattedDate;
  //   }

  //   // Example usage
  //   const formattedDate = formatDate(toDayaDate);
  // console.log("formattedDate",formattedDate);
  // console.log(">>>>>>>>>>",data.displayValue , formattedDate);

  //   if(data.displayValue){
  //     return <div style={{color: data.displayValue > formattedDate ? 'red' : 'black'}}>{data.displayValue}</div>
  //   }else{
  //     return <div >{data.displayValue}</div>

  //   }
  // }

  const renderGrideCellWholeTask = (data) => {
    const today = new Date();
    const formattedDate = new Date(data.displayValue);

    if (!isNaN(formattedDate.getTime())) {
      if (formattedDate > today) {
        return (
          <div
            style={{
              fontWeight: data?.data.task_status === "RUNNING" ? "bold" : "",
              color: data?.data.task_status === "RUNNING" ? "red" : "",
            }}
          >
            {data.displayValue}
          </div>
        );
      } else {
        return (
          <div
            style={{
              fontWeight: data?.data.task_status === "RUNNING" ? "bold" : "",
              color: data?.data.task_status === "RUNNING" ? "red" : "",
            }}
          >
            {data.displayValue}
          </div>
        );
      }
    } else {
      return (
        <div
          style={{
            fontWeight: data?.data.task_status === "RUNNING" ? "bold" : "",
            color: data?.data.task_status === "RUNNING" ? "red" : "",
          }}
        >
          {data.displayValue}
        </div>
      );
    }
  };

  //Right click popup open
  const handleContextMenuPreparing = (e) => {
    const customItems = [];
    if (e.target === "content" && e.column.dataField === "task") {
      {
        console.log("text", e.target, "***", e?.row?.data?.task);
      }
      customItems.push({
        text: e?.row?.data?.task,
        onItemClick: () => {
          const rowData = e.row.data.task;
          console.log("rowData", rowData);
          setSelectedView("Option 2");
          setSelectedData(rowData);
        },
      });
      e.items = customItems;
    }
  };


  const dataGrid = useRef(null);

// Saving the layout
const saveLayout = () => {
  console.log("savesave");
  const dataGridState = dataGridRef.current.instance.state();
  console.log("dataGridState",dataGridState);
  localStorage.setItem('datagrid_layout', JSON.stringify(dataGridState));
  localStorage.setItem('user_layout', userName);
};

// Loading the layout
const loadLayout = () => {
  const savedLayout = localStorage.getItem('datagrid_layout');
  console.log("savedLayout",savedLayout);
  if (savedLayout) {
    const parsedLayout = JSON.parse(savedLayout);
    console.log("parsedLayout",parsedLayout);
    dataGridRef?.current?.instance?.state(parsedLayout);
  }
};

// Ensure that the DataGrid uses the saved layout when the component loads
useEffect(() => {
  loadLayout();
}, []);


const handleDropDownChange = (event) => {
  const newUserName = event.target.value;
  setUserName(newUserName);
  // Save the new username in localStorage
  localStorage.setItem('user_name', newUserName);
};
  if(loader){
    return(
    <Box
            sx={{
              display: "flex",
              width: '100%',
              // height: '100vh',
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="secondary" />{" "}
          </Box>
    )
  }
  return (
    <div>
      {/* { loader ? "" :
         <> */}
      {/* {loader ?(
      <Box sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <CircularProgress />
      </Box>
      ):( <> */}
      {/* {loader ?
    <p>demo</p>  :  */}
     
      <div style={{ display: "flex", height: "250px" }}>
        <div style={{ width: "13%", paddingTop: "45px" }}>
          <table style={{ border: "1px solid black" }}>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  background: activeTab === "ACTIVE" ? "#ffff99" : "",
                  paddingRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => activeDataItem("ACTIVE")}
              >
                ACTIVE TASK - {activeData}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  background: activeTab === "INACTIVE" ? "#ffc299" : "",
                  paddingRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => activeDataItem("INACTIVE")}
              >
                INACTIVE TASK - {inActiveData}{" "}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  background: activeTab === "CLOSE" ? "#99ffbb" : "",
                  paddingRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => activeDataItem("CLOSE")}
              >
                FINISHED TASK - {finishedData}
              </td>
            </tr>
          </table>
        </div>
        {/* {loader ? (
          <Box
            sx={{
              display: "flex",
              width: '100%',
              // height: '100vh',
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <CircularProgress color="secondary" />{" "} */}
          {/* </Box> */}
        {/* ) : ( */} 
          <>
            <div style={{ width: "29%" }}>
              <Chart
                chartType="PieChart"
                data={ activChart ? activChart : chartDataConvert}
                options={options}
                width={"100%"}
                height={"250px"}
                chartEvents={[
                  {
                    eventName: "select",
                    callback: handleChartSelect,
                  },
                ]}
              />
            </div>
        
            <div style={{ width: "29%" }}>
              <FirstPieChart
                setChartTable={setChartTable}
                setItemData={setItemData}
              />
            </div>
            {!loader && (
                  <div style={{ width: "29%" }}>
          {/* <SecondPieChart /> */}
          <StackBarChart />
        </div>
         )}
        </>
         {/* )} */}
      </div>
      <input 
        name="user"
        type="text"
        value={userName}
        onChange={handleInputChange} 
      />
<datalist id="cars">
  <option>Volvo</option>
  <option>Saab</option>
  <option>Mercedes</option>
  <option>Audi</option>
</datalist>
      <button onClick={saveLayout}>Save Layout</button>
      <button onClick={loadLayout}>Load Layout</button>
      {/* } */}
      {!loader && (
      <DataGrid
        id="gridContainer"
        ref={dataGridRef}
        height={650}
        dataSource={selectedChartData || itemData ? chartTable : chartData}
        // keyExpr="due_days"
        allowColumnResizing
        allowColumnReordering={true}
        hoverStateEnabled={true}
        columnAutoWidth={true}
        // customizeColumns={customizeColumns}
        onSelectionChanged={handleSelectionChanged}
        showBorders={true}
        onContextMenuPreparing={handleContextMenuPreparing}
      >
        <GroupPanel visible={true} />
        <FilterRow visible applyFilter={currentFilter} />
        <HeaderFilter visible />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <Selection mode="single" />
        <Column
          dataField="status"
          fixed={true}
          caption="Active/Inactive"
          alignment="center"
          width={100}
          headerCellRender={() => (
            <div className="table-header">
              <div>Active/</div>
              <div style={{ textAlign: "center" }}>Inactive</div>
            </div>
          )}
        >
          <HeaderFilter />
        </Column>

        <Column
          dataField="category"
          alignment="center"
          width={105}
          headerCellRender={() => (
            <div className="table-header">
              <div>category</div>
            </div>
          )}
        ></Column>
        <Column alignment="center" dataField="task" width={100}  
        headerCellRender={() => (
            <div className="table-header">
              <div>Task</div>
            </div>
          )}>
          <HeaderFilter />
        </Column>
        <Column
          dataField="stage"
          alignment="center"
          dataType="stage"
          width={220}
          headerCellRender={() => (
            <div className="table-header">
              <div>Stage</div>
            </div>
          )}
        >
          <HeaderFilter />
        </Column>

        <Column alignment="center" dataField="department" width={130}  
         cellRender={renderGridCellDepartment}
          headerCellRender={() => (
            <div className="table-header">
              <div>Department</div>
            </div>
          )}>
          <HeaderFilter />
        </Column>
        <Column
          dataField="task_status"
          alignment="center"
          cellRender={renderGridCell}
          width={90}
          headerCellRender={() => (
            <div className="table-header">
              <div>Task</div>
              <div style={{ textAlign: "center" }}>Status</div>
            </div>
          )}
        />
        <Column
          dataField="comper"
          format="percent"
          alignment="right"
          allowGrouping={false}
          cellRender={DiscountCell}
          cssClass="bullet"
          dataType="stage"
          width={110}
          headerCellRender={() => (
            <div className="table-header">
              <div>Completion</div>
              <div style={{ textAlign: "center" }}>Status</div>
            </div>
          )}
        >
          <HeaderFilter />
        </Column>

        <Column alignment="center" caption="CURRENT STAGE PROGRESS">
          <Column
            alignment="center"
            caption="Original Duration"
            dataField="original_duration"
            width={90}
            headerCellRender={() => (
              <div className="table-header">
                <div>Original</div>
                <div style={{ textAlign: "center" }}>Duration</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            dataField="original_due_days"
            cellRender={renderGridCellOriginalDueDays}
            alignment="center"
            dataType="stage"
            width={80}
            headerCellRender={() => (
              <div className="table-header">
                <div>Original</div>
                <div style={{ textAlign: "center" }}>Due</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Original End Date"
            dataField="original_end_date"
            width={100}
            headerCellRender={() => (
              <div className="table-header">
                <div>Original</div>
                <div style={{ textAlign: "center" }}>End</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
        </Column>

        <Column
          alignment="center"
          cssClass="red-header"
          caption="COMPLETED STAGE(S) PROGRESS"
        >
          <Column
            alignment="center"
            dataField="target_days"
            width={90}
            headerCellRender={() => (
              <div className="table-header">
                <div>Target</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Days Taken"
            dataField="task_days"
            width={90}
            headerCellRender={() => (
              <div className="table-header">
                <div>Days</div>
                <div style={{ textAlign: "center" }}>Taken</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            cellRender={renderGridCellTaskDelay}
            caption="Task Delay Days"
            dataField="delay_days"
            width={90}
            headerCellRender={() => (
              <div className="table-header">
                <div>Task</div>
                <div style={{ textAlign: "center" }}>Delay</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Task Hold Days"
            dataField="hold_days"
            width={80}
            headerCellRender={() => (
              <div className="table-header">
                <div>Task</div>
                <div style={{ textAlign: "center" }}>Hold</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
        </Column>

        <Column alignment="center" caption="WHOLE TASK PROGRESS">
          <Column
            alignment="center"
            caption="Target Days"
            dataField="whole_target_days"
            width={90}
            headerCellRender={() => (
              <div className="table-header">
                <div>Target</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            cellRender={renderGridCellTotalTaskDelay}
            caption="Total Task Delay"
            dataField="whole_delay_days"
            width={90}
            headerCellRender={() => (
              <div className="table-header">
                <div>Total</div>
                <div style={{ textAlign: "center" }}>Task</div>
                <div style={{ textAlign: "center" }}>Delay</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            cellRender={renderGrideCellWholeTask}
            caption="Whole Task End Date"
            dataField="whole_end_date"
            width={100}
            headerCellRender={() => (
              <div className="table-header">
                <div>Whole</div>
                <div style={{ textAlign: "center" }}>Task</div>
                <div style={{ textAlign: "center" }}>End</div>
                <div style={{ textAlign: "center" }}>Date</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
        </Column>

        <Column alignment="center" caption="CURRENT STAGE PROGRESS">
          <Column
            alignment="center"
            caption="Hold Days"
            dataField="current_hold_days"
            width={90}
            headerCellRender={() => (
              <div className="table-header">
                <div>Hold</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Start Date"
            dataField="stage_start_date"
            width={80}
            headerCellRender={() => (
              <div className="table-header">
                <div>Start</div>
                <div style={{ textAlign: "center" }}>Date</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Expected End Date"
            dataField="stage_expected_date"
            width={110}
            headerCellRender={() => (
              <div className="table-header">
                <div>Expected</div>
                <div style={{ textAlign: "center" }}>End</div>
                <div style={{ textAlign: "center" }}>Date</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="No of Update(s)"
            dataField="no_updates"
            width={110}
            headerCellRender={() => (
              <div className="table-header">
                <div>No of</div>
                <div style={{ textAlign: "center" }}>Update(s)</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Updated Duration"
            dataField="whole_updated"
            width={110}
            headerCellRender={() => (
              <div className="table-header">
                <div>Updated</div>
                <div style={{ textAlign: "center" }}>Duration</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Updated Due Days"
            dataField="whole_updated_due_days"
            width={110}
            headerCellRender={() => (
              <div className="table-header">
                <div>Updated</div>
                <div style={{ textAlign: "center" }}>Due</div>
                <div style={{ textAlign: "center" }}>Days</div>
              </div>
            )}
          >
            <HeaderFilter />
          </Column>
          <Column
            alignment="center"
            caption="Remarks"
            dataField="remarks"
            width={100}
          >
            <HeaderFilter />
          </Column>
        </Column>

        <Paging enabled={false} />
      </DataGrid>
      )}
      {/* </>
          } */}
      {/* </> */}
      {/* )} */}
    </div>
  );
};

export default Devextrim;
