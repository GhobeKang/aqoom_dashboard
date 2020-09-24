import React, { useState, useEffect } from 'react';
import http from 'axios';
import { PieChart, Pie, Tooltip, Cell, Legend, LineChart, Line, XAxis, YAxis} from 'recharts';
import './App.css';

http.defaults.baseURL = 'http://localhost:4000/api/dashboard';

function App() {
  const [chatdata, setChatdata] = useState([]);
  const [chatStatusData, setChatStatusData] = useState([]);
  const [userIncreasedData, setUserIncreasedData] = useState([]);
  const [chatIncreasedData, setChatIncreasedData] = useState([]);
  const [messageHandling, setMessageHandling] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const fullWidth = window.screen.width;

  useEffect(() => {
    getChatInfos();
    getSupergroupState();
    getUserIncreasingData();
    getChatIncreasingData();
    getMessageHandling();
  }, [])

  const getSupergroupState = () => {
    http.get('/get-supergroup-state')
      .then((res) => {
        setChatStatusData(res.data);
      })
  }

  const getChatInfos = () => {
    http.get('/getchat')
      .then((res) => {
        setChatdata(res.data);
      })
  }
  const getUserIncreasingData = (type) => {
    http.get('/get-user-amount')
      .then((res) => {
        setUserIncreasedData(res.data);
      })
  }
  const getChatIncreasingData = (type) => {
    http.get('/get-chat-amount')
      .then((res) => {
        setChatIncreasedData(res.data);
      })
  }
  const getMessageHandling = () => {
    http.get('/get-message-amount')
      .then((res) => {
        setMessageHandling(res.data)
      })
  }
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }) => {
     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="App">
      <h2>DASHBOARD</h2>
      <div className="gap"></div>
      <div className="chart_chattype">
        <div className="gap"></div>
        <p>CHAT TYPES</p>
        <PieChart width={fullWidth / 2} height={500}>
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Pie data={chatdata} dataKey="cnt" nameKey="type" cx="50%" cy="50%" outerRadius={200} fill="#8884d8" label={renderCustomizedLabel} labelLine={false}>
            {
              chatdata.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
        </PieChart>
      </div>
      
      <div className="chart_supergroup">
        <div className="gap"></div>
        <p>SUPERGROUP STATUS</p>
        <PieChart width={fullWidth / 2} height={500} style={{display: 'inline-block'}}>
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Pie data={chatStatusData} dataKey="cnt" nameKey="status" cx="50%" cy="50%" outerRadius={200} fill="#8884d8" label={renderCustomizedLabel} labelLine={false}>
            {
              chatStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
        </PieChart>
      </div>

      <div className="gap"></div>
      <p>USER 증가 추이</p>
      <LineChart width={1500} height={500} data={userIncreasedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis />
        
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <Line name="user amount" type="monotone" dataKey="cnt_user" stroke="#f0ba51" />
      </LineChart>

      <div className="gap"></div>
      <p>CHAT 증가 추이</p>
      <LineChart width={1500} height={500} data={chatIncreasedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis />
        
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <Line name="chat amount" type="monotone" dataKey="cnt_chat" stroke="#ff7135" />
      </LineChart>

      <div className="gap"></div>
      <p>메세지 처리량 추이</p>
      <LineChart width={1500} height={500} data={messageHandling}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis />
        
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <Line name="message amount" type="monotone" dataKey="cnt" stroke="#e35984" />
      </LineChart>
    </div>
  );
}

export default App;
