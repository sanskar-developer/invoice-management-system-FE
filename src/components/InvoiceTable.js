import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Chip } from "@mui/material";

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/invoices`) 
      .then((response) => setInvoices(response.data))
      .catch((error) => console.error("Error fetching invoices:", error));
  }, []);

  const renderTypeChip = (params) => {
    const type = params.value; 

    let chipProps;
    if (type === "sale") {
      chipProps = { label: "Credit", color: "success" }; 
    } else if (type === "purchase") {
      chipProps = { label: "Purchase", color: "primary" }; 
    } else if (type === "expense") {
      chipProps = { label: "Debit", color: "error" }; 
    }

    return <Chip {...chipProps} size="small" />;
  };

  const columns = [
    { field: "invoiceNumber", headerName: "Invoice #", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: renderTypeChip,
    },
    { field: "customerName", headerName: "Customer Name", width: 200 },
    { field: "vendorName", headerName: "Vendor Name", width: 200 },
    { field: "totalAmount", headerName: "Total Amount", width: 150 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={invoices} columns={columns} getRowId={(row) => row._id} />
    </div>
  );
};

export default InvoiceTable;