import React from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Validation Schema
const validationSchema = Yup.object({
  invoiceNumber: Yup.string().required("Invoice Number is required"),
  type: Yup.string()
    .oneOf(["sale", "purchase", "expense"], "Invalid type selected")
    .required("Type is required"),
  customerName: Yup.string().when("type", {
    is: "sale",
    then: (schema) => schema.required("Customer Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vendorName: Yup.string().when("type", {
    is: "purchase",
    then: (schema) => schema.required("Vendor Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  date: Yup.date().required("Date is required"),
  totalAmount: Yup.number().required("Total Amount is required"),
  totalTax: Yup.number().required("Total Tax is required"),
  subTotal: Yup.number().required("Subtotal is required"),
  items: Yup.array()
    .of(
      Yup.object({
        itemName: Yup.string().required("Item Name is required"),
        itemPrice: Yup.number()
          .required("Item Price is required")
          .typeError("Item Price must be a number"),
        itemQty: Yup.number()
          .required("Quantity is required")
          .typeError("Quantity must be a number"),
        itemTotal: Yup.number()
          .required("Item Total is required")
          .typeError("Item Total must be a number"),
        itemCode: Yup.string().required("Item Code is required"),
      })
    )
    .min(1, "At least one item is required")
    .required("Items are required"),
});

const AddInvoiceModal = ({ open, onClose }) => {
  const handleSubmit = async (values, { resetForm }) => {
    // Calculate subtotal, total amount, and tax
    const subTotal = values.items.reduce(
      (sum, item) => sum + item.itemPrice * item.itemQty,
      0
    );
    const totalTax = subTotal * 0.1; // Example: 10% tax
    const totalAmount = subTotal + totalTax;

    // Calculate itemTotal for each item
    const updatedItems = values.items.map((item) => ({
      ...item,
      itemTotal: item.itemPrice * item.itemQty,
      itemCode: item.itemCode || `CODE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, // Generate item code if missing
    }));

    // Prepare the final payload
    const payload = {
      ...values,
      date: values.date || new Date().toISOString(),
      subTotal,
      totalTax,
      totalAmount,
      items: updatedItems,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/invoices`,
        payload
      );
      alert("Invoice added successfully");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add New Invoice
        </Typography>

        <Formik
          initialValues={{
            invoiceNumber: "",
            type: "",
            customerName: "",
            vendorName: "",
            date: "",
            totalAmount: 0,
            totalTax: 0,
            subTotal: 0,
            items: [{ itemName: "", itemPrice: "", itemQty: "", itemTotal: 0, itemCode: "" }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form>
              {/* Invoice Number */}
              <Field
                as={TextField}
                name="invoiceNumber"
                label="Invoice Number"
                fullWidth
                margin="normal"
                error={touched.invoiceNumber && !!errors.invoiceNumber}
                helperText={touched.invoiceNumber && errors.invoiceNumber}
              />

              {/* Type Dropdown */}
              <Field
                as={TextField}
                name="type"
                label="Type"
                select
                fullWidth
                margin="normal"
                error={touched.type && !!errors.type}
                helperText={touched.type && errors.type}
              >
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Field>

              {/* Conditional Customer Name */}
              {values.type === "sale" && (
                <Field
                  as={TextField}
                  name="customerName"
                  label="Customer Name"
                  fullWidth
                  margin="normal"
                  error={touched.customerName && !!errors.customerName}
                  helperText={touched.customerName && errors.customerName}
                />
              )}

              {/* Conditional Vendor Name */}
              {values.type === "purchase" && (
                <Field
                  as={TextField}
                  name="vendorName"
                  label="Vendor Name"
                  fullWidth
                  margin="normal"
                  error={touched.vendorName && !!errors.vendorName}
                  helperText={touched.vendorName && errors.vendorName}
                />
              )}

              {/* Date Field */}
              <Field
                as={TextField}
                name="date"
                label="Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={touched.date && !!errors.date}
                helperText={touched.date && errors.date}
              />

              {/* Items Section */}
              <Typography variant="subtitle1" gutterBottom>
                Items
              </Typography>
              <FieldArray name="items">
                {({ remove, push }) => (
                  <div>
                    {values.items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 2,
                          marginBottom: 2,
                        }}
                      >
                        <Field
                          as={TextField}
                          name={`items[${index}].itemName`}
                          label="Item Name"
                          fullWidth
                          error={
                            touched.items?.[index]?.itemName &&
                            !!errors.items?.[index]?.itemName
                          }
                          helperText={
                            touched.items?.[index]?.itemName &&
                            errors.items?.[index]?.itemName
                          }
                        />
                        <Field
                          as={TextField}
                          name={`items[${index}].itemPrice`}
                          label="Price"
                          fullWidth
                          error={
                            touched.items?.[index]?.itemPrice &&
                            !!errors.items?.[index]?.itemPrice
                          }
                          helperText={
                            touched.items?.[index]?.itemPrice &&
                            errors.items?.[index]?.itemPrice
                          }
                        />
                        <Field
                          as={TextField}
                          name={`items[${index}].itemQty`}
                          label="Quantity"
                          fullWidth
                          error={
                            touched.items?.[index]?.itemQty &&
                            !!errors.items?.[index]?.itemQty
                          }
                          helperText={
                            touched.items?.[index]?.itemQty &&
                            errors.items?.[index]?.itemQty
                          }
                        />
                        <Field
                          as={TextField}
                          name={`items[${index}].itemCode`}
                          label="Item Code"
                          fullWidth
                          error={
                            touched.items?.[index]?.itemCode &&
                            !!errors.items?.[index]?.itemCode
                          }
                          helperText={
                            touched.items?.[index]?.itemCode &&
                            errors.items?.[index]?.itemCode
                          }
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() =>
                        push({ itemName: "", itemPrice: "", itemQty: "", itemTotal: 0, itemCode: "" })
                      }
                    >
                      Add Item
                    </Button>
                  </div>
                )}
              </FieldArray>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
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
