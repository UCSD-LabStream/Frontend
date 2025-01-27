import React, { useState } from 'react';
import * as XLSX from "xlsx"; 

function MySlots() {
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [excelData, setExcelData] = useState(null);

    const handleFile = (e) => {
        let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && fileTypes.includes(selectedFile.type)) {
                setTypeError(null);
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFile(e.target.result);
                }
            } else {
                setTypeError("Please select an excel file");
                setExcelFile(null);
            }
        } else {
            console.log("Please select a file");
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (excelFile != null) {
            const workbook = XLSX.read(excelFile, { type: 'buffer' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            
            // Convert Excel date-time to JavaScript Date format
            const convertedData = data.map(item => {
                if (item["YourDateColumn"]) {
                    // Check if the cell contains a date (numeric format from Excel)
                    const date = new Date((item["YourDateColumn"] - (25567 + 2)) * 86400 * 1000);
                    item["YourDateColumn"] = date;
                }
                return item;
            });
            setExcelData(convertedData.slice(0, 10)); // Only show first 10 rows
        }
    };

    return (
        <div>
            <h3 style={{ color: "white"}} >Upload and view Excel sheets</h3>

            <form onSubmit={handleFormSubmit}>
                <input type="file" required onChange={handleFile} />
                <button type="submit">UPLOAD</button>
                {typeError && (
                    <div role="alert" style={{ color: "red", marginTop: "10px" }}>
                        {typeError}
                    </div>
                )}
            </form>

            <div>
                {excelData ? (
                    <div>
                        <table>
                            <thead>
                                <tr style={{ color: "white"}} >
                                    {Object.keys(excelData[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {excelData.map((individualExcelData, index) => (
                                    <tr key={index} style={{ color: "white"}}>
                                        {Object.keys(individualExcelData).map((key) => (
                                            <td key={key}>
                                                {key === "YourDateColumn" 
                                                    ? individualExcelData[key].toLocaleString()  // Format date
                                                    : individualExcelData[key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>No file uploaded yet!</div>
                )}
            </div>
        </div>
    );
}

export default MySlots;
