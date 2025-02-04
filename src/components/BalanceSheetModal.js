import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Divider, Grid, Paper } from "@mui/material";
import axios from "axios";

const BalanceSheetModal = ({ open, onClose }) => {
  const [balanceSheet, setBalanceSheet] = useState(null);

  useEffect(() => {
    if (open) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/reports/balance-sheet`) // Update with your backend URL
        .then((response) => setBalanceSheet(response.data))
        .catch((error) =>
          console.error("Error fetching balance sheet:", error)
        );
    }
  }, [open]);

  if (!balanceSheet) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Balance Sheet
          </Typography>
          <Typography>Loading...</Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Balance Sheet
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Assets Section */}
        <Typography variant="h6" gutterBottom>
          Assets
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Cash:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">{balanceSheet.assets.cash}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Accounts Receivable:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                {balanceSheet.assets.accountsReceivable}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Liabilities Section */}
        <Typography variant="h6" gutterBottom>
          Liabilities
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Accounts Payable:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                {balanceSheet.liabilities.accountsPayable}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>GST Payable (CGST):</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                {balanceSheet.liabilities.gstPayable.cgst}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>GST Payable (SGST):</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                {balanceSheet.liabilities.gstPayable.sgst}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>GST Payable (IGST):</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                {balanceSheet.liabilities.gstPayable.igst}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Equity Section */}
        <Typography variant="h6" gutterBottom>
          Equity
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Net Profit:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                {balanceSheet.equity.netProfit}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Expenses Section */}
        <Typography variant="h6" gutterBottom>
          Expenses
        </Typography>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Total Expenses:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                {balanceSheet.expenses.totalExpenses}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />
        <Typography align="center">
          <strong>Note:</strong> This is an autogenerated report.
        </Typography>
      </Box>
    </Modal>
  );
};

export default BalanceSheetModal;