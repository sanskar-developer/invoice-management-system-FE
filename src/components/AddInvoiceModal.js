import React from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem, Grid, IconButton } from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

const validationSchema = Yup.object({
  invoiceNumber: Yup.string().required('Invoice Number is required'),
  date: Yup.date().required('Date is required'),
  type: Yup.string().oneOf(['sale', 'purchase', 'expense'], 'Invalid type').required('Type is required'),
  customerName: Yup.string().when('type', {
    is: 'sale',
    then: ()=>Yup.string().required('Customer Name is required'),
    otherwise: ()=>Yup.string()
  }),
  vendorName: Yup.string().when('type', {
    is: (type) => type === 'purchase' || type === 'expense',
    then: ()=>Yup.string().required('Vendor Name is required'),
    otherwise: ()=>Yup.string()
  }),
  items: Yup.array()
    .of(
      Yup.object({
        itemName: Yup.string().required('Item Name is required'),
        itemPrice: Yup.number().required('Item Price is required'),
        itemQty: Yup.number().required('Quantity is required')
      })
    )
    .min(1, 'At least one item is required')
    .required(),
  taxDetails: Yup.object({
    cgst: Yup.number().required('CGST is required').min(0),
    sgst: Yup.number().required('SGST is required').min(0),
    igst: Yup.number().required('IGST is required').min(0)
  })
});

const AddInvoiceModal = ({ open, onClose }) => {
  const handleSubmit = (values) => {
    // Calculate subtotal and total tax
    const subTotal = values.items.reduce((sum, item) => sum + item.itemPrice * item.itemQty, 0);
    const totalTax = values.taxDetails.cgst + values.taxDetails.sgst + values.taxDetails.igst;
    const totalAmount = subTotal + totalTax;

    const payload = {
      ...values,
      subTotal,
      totalTax,
      totalAmount
    };

    axios
      .post('/api/invoices', payload)
      .then(() => {
        onClose();
        alert('Invoice added successfully');
      })
      .catch((error) => console.error('Error adding invoice:', error));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add New Invoice
        </Typography>

        <Formik
          initialValues={{
            invoiceNumber: '',
            date: '',
            type: '',
            customerName: '',
            vendorName: '',
            items: [{ itemName: '', itemPrice: '', itemQty: '' }],
            taxDetails: { cgst: 0, sgst: 0, igst: 0 }
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form>
              <TextField
                name="invoiceNumber"
                label="Invoice Number"
                value={values.invoiceNumber}
                onChange={handleChange}
                error={touched.invoiceNumber && Boolean(errors.invoiceNumber)}
                helperText={touched.invoiceNumber && errors.invoiceNumber}
                fullWidth
                margin="normal"
              />
              <TextField
                name="date"
                label="Date"
                type="date"
                value={values.date}
                onChange={handleChange}
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="type"
                label="Type"
                select
                value={values.type}
                onChange={handleChange}
                error={touched.type && Boolean(errors.type)}
                helperText={touched.type && errors.type}
                fullWidth
                margin="normal"
              >
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
              {values.type === 'sale' && (
                <TextField
                  name="customerName"
                  label="Customer Name"
                  value={values.customerName}
                  onChange={handleChange}
                  error={touched.customerName && Boolean(errors.customerName)}
                  helperText={touched.customerName && errors.customerName}
                  fullWidth
                  margin="normal"
                />
              )}
              {(values.type === 'purchase' || values.type === 'expense') && (
                <TextField
                  name="vendorName"
                  label="Vendor Name"
                  value={values.vendorName}
                  onChange={handleChange}
                  error={touched.vendorName && Boolean(errors.vendorName)}
                  helperText={touched.vendorName && errors.vendorName}
                  fullWidth
                  margin="normal"
                />
              )}

              <Typography variant="subtitle1" gutterBottom>
                Items
              </Typography>
              <FieldArray
                name="items"
                render={(arrayHelpers) => (
                  <>
                    {values.items.map((item, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item xs={4}>
                          <TextField
                            name={`items[${index}].itemName`}
                            label="Item Name"
                            value={item.itemName}
                            onChange={handleChange}
                            error={
                              touched.items?.[index]?.itemName &&
                              Boolean(errors.items?.[index]?.itemName)
                            }
                            helperText={
                              touched.items?.[index]?.itemName &&
                              errors.items?.[index]?.itemName
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            name={`items[${index}].itemPrice`}
                            label="Price"
                            type="number"
                            value={item.itemPrice}
                            onChange={handleChange}
                            error={
                              touched.items?.[index]?.itemPrice &&
                              Boolean(errors.items?.[index]?.itemPrice)
                            }
                            helperText={
                              touched.items?.[index]?.itemPrice &&
                              errors.items?.[index]?.itemPrice
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            name={`items[${index}].itemQty`}
                            label="Qty"
                            type="number"
                            value={item.itemQty}
                            onChange={handleChange}
                            error={
                              touched.items?.[index]?.itemQty &&
                              Boolean(errors.items?.[index]?.itemQty)
                            }
                            helperText={
                              touched.items?.[index]?.itemQty &&
                              errors.items?.[index]?.itemQty
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton onClick={() => arrayHelpers.remove(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      startIcon={<AddCircleIcon />}
                      onClick={() => arrayHelpers.push({ itemName: '', itemPrice: '', itemQty: '' })}
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Add Item
                    </Button>
                  </>
                )}
              />

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Tax Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="taxDetails.cgst"
                    label="CGST"
                    type="number"
                    value={values.taxDetails.cgst}
                    onChange={handleChange}
                    error={touched.taxDetails?.cgst && Boolean(errors.taxDetails?.cgst)}
                    helperText={touched.taxDetails?.cgst && errors.taxDetails?.cgst}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name="taxDetails.sgst"
                    label="SGST"
                    type="number"
                    value={values.taxDetails.sgst}
                    onChange={handleChange}
                    error={touched.taxDetails?.sgst && Boolean(errors.taxDetails?.sgst)}
                    helperText={touched.taxDetails?.sgst && errors.taxDetails?.sgst}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name="taxDetails.igst"
                    label="IGST"
                    type="number"
                    value={values.taxDetails.igst}
                    onChange={handleChange}
                    error={touched.taxDetails?.igst && Boolean(errors.taxDetails?.igst)}
                    helperText={touched.taxDetails?.igst && errors.taxDetails?.igst}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddInvoiceModal;