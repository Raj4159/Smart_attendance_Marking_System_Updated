import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';

function DisplayTable() {
  const [tableData, setTableData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [pieChartImage, setPieChartImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/display');
      const htmlData = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');
      const tableRows = doc.querySelectorAll('tbody tr');
      const data = Array.from(tableRows).map((row, index) => ({
        id: index + 1,
        Name: row.cells[0].textContent,
        Time: row.cells[1].textContent,
        Status: row.cells[2].textContent
      }));
      setTableData(data);

      // Extract unique names
      const uniqueNamesArray = Array.from(new Set(data.map(row => row.Name)));
      setUniqueNames(uniqueNamesArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNameChange = async (event) => {
    const selected = event.target.value;
    setSelectedName(selected);
    if (selected) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/attendance/${selected}`);
        const data = await response.json();
        setPieChartImage(data.image);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    } else {
      setPieChartImage(null);
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-3xl overflow-x-auto px-4 pt-16" style={{ marginLeft: '60px' }}>
      <div className="py-8">
        <h1 className="text-xl font-bold mb-4">Attendance Table</h1>
        <div className="overflow-x-auto">
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="w-full table-fixed border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-1/4 py-2 px-4 border-r border-gray-800">ID</th>
                <th className="w-1/4 py-2 px-4 border-r border-gray-800">Name</th>
                <th className="w-1/4 py-2 px-4 border-r border-gray-800">Time</th>
                <th className="w-1/4 py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="bg-white">
                  <td className="py-2 px-4 border-r border-gray-800">{row.id}</td>
                  <td className="py-2 px-4 border-r border-gray-800">{row.Name}</td>
                  <td className="py-2 px-4 border-r border-gray-800">{row.Time}</td>
                  <td className="py-2 px-4">{row.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 mt-8 mr-8 pt-20" style={{ height: '200px', width: '50%', marginRight: '-250px'  }}>
        <select value={selectedName} onChange={handleNameChange}>
          <option value="">Select Name</option>
          {uniqueNames.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
        {selectedName && pieChartImage && (
          <div className="mt-4">
            <img src={`data:image/png;base64,${pieChartImage}`} alt="Pie Chart" style={{ width: '50%', height: '40%' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayTable;
