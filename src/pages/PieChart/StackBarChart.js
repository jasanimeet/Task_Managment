/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';
import axios from 'axios';
import { API_BASE_URL } from '../../config/API/api.config';
import { useRef } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Departmentwise Task Status',
      font: {
        size: 15, // Set your desired font size here
        // You can also set other font properties like family, weight, etc.
      },
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

 const StackBarChart = () => {
  const [secondChartData, setSecondChartData] = useState([]);

  const mapData = secondChartData.map((x)=> x)
  const itemDatass = mapData.filter(item => item.status === 'ACTIVE');
  useEffect(() => {
    axios
      .get(API_BASE_URL + `/report/getcurrenttaskstatus`)
      .then((res) => {
        setSecondChartData(res?.data?.data);
      });
  }, []);


  const result = secondChartData?.map((x)=> x?.department)
  const labels = [...new Set(result?.map(value => value?.toUpperCase()))];
  const resultSecond = secondChartData?.map((x)=> x?.Hold_Status)
  const labelsSecond = [...new Set(resultSecond?.filter(value => value !== null)?.map(value => value?.toUpperCase()))];
  // const labelsSecond = count.filter((item) => item.Hold_Status !== null && item.Hold_Status === status).length;

  const dataCount = mapData.filter((x)=> x.department === "SUNRISE" && x.Hold_Status === "OverDue").length
  const dataCount1 = mapData.filter((x)=> x.department === "SUNRISE" && x.Hold_Status === "ON TIME").length
  
  const dataSecondCount = mapData.filter((x)=> x.department === "BRAINWAVES" && x.Hold_Status === "OverDue").length
  const dataSecondCount1 = mapData.filter((x)=> x.department === "BRAINWAVES" && x.Hold_Status === "ON TIME").length

  const data = [{ id: dataCount ? dataCount : "", ui: dataCount1 ? dataCount1 : ""  }, { id: dataSecondCount ? dataSecondCount : "", ui: dataSecondCount1 ? dataSecondCount1 : "" }];
  const array = ['Over due', 'On Time'];
  
  const datasets = labels.map((labelas, index) => {
    const propertyName = labelas === 'SUNRISE' ? 'id' : 'ui'; // Match label with the corresponding property in 'data'
    const dataForLabel = data.map((item) => item[propertyName]); // Extract data for the specific label
  
    return {
      label: labelsSecond[index], // Use the corresponding label from the 'array'
      data: dataForLabel,
      backgroundColor: `rgb(${faker.datatype.number(255)}, ${faker.datatype.number(255)}, ${faker.datatype.number(255)})`,
    };
  });
  
  const data12= {
    labels,
    datasets,
  };

  return(
  <>
  <Bar style={{height: '250px'}} options={options} data={data12} />
 
  </>
)}

export default StackBarChart