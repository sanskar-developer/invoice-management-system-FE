import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import InvoiceTable from "../components/InvoiceTable";
import AddInvoiceModal from "../components/AddInvoiceModal";
import BalanceSheetModal from "../components/BalanceSheetModal";

const LandingPage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openBalanceSheetModal, setOpenBalanceSheetModal] = useState(false);

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h3" gutterBottom>
        Invoice Management
      </Typography>

      {/* View Report Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: "20px" }}
        onClick={() => setOpenBalanceSheetModal(true)}
      >
        View Report (Balance Sheet)
      </Button>

      {/* Invoice Table */}
      <InvoiceTable />

      {/* Add New Invoice Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ marginTop: "20px" }}
        onClick={() => setOpenAddModal(true)}
      >
        Add New Invoice
      </Button>

      {/* Modals */}
      <AddInvoiceModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
      <BalanceSheetModal
        open={openBalanceSheetModal}
        onClose={() => setOpenBalanceSheetModal(false)}
      />
    </Box>
  );
};

export default LandingPage;