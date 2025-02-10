import React, { useState } from 'react';
import { Button, Typography, TextField, Box, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" color="white">
                Upload and view Excel sheets
            </Typography>

            <form onSubmit={handleFormSubmit}>
                <TextField
                    type="file"
                    required
                    onChange={handleFile}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" type="submit" fullWidth>
                    UPLOAD
                </Button>
                {typeError && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                        {typeError}
                    </Alert>
                )}
            </form>

            <Box sx={{ marginTop: 4 }}>
                {excelData ? (
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table aria-label="Excel Data Table">
                            <TableHead>
                                <TableRow>
                                    {Object.keys(excelData[0]).map((key) => (
                                        <TableCell key={key} sx={{ color: "white" }}>
                                            {key}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {excelData.map((individualExcelData, index) => (
                                    <TableRow key={index}>
                                        {Object.keys(individualExcelData).map((key) => (
                                            <TableCell key={key} sx={{ color: "white" }}>
                                                {key === "YourDateColumn"
                                                    ? new Date(individualExcelData[key]).toLocaleString()
                                                    : individualExcelData[key]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body1" color="white">
                        No file uploaded yet!
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default MySlots;
