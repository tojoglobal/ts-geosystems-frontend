import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import bwipjs from "bwip-js";

const generateBarcodeBase64 = (text) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
      resolve(canvas.toDataURL("image/png"));
    } catch (err) {
      reject(err);
    }
  });
};

export const GenerateInvoicePdf = async (order) => {
  console.log(order);

  const doc = new jsPDF();
  const logoUrl = "/favicon.png";

  // Load logo
  const logo = new Image();
  logo.src = logoUrl;

  // Generate barcode before PDF rendering
  const barcodeData = await generateBarcodeBase64(order.order_id);

  return new Promise((resolve) => {
    logo.onload = async () => {
      // Add logo
      doc.addImage(logo, "PNG", 15, 10, 50, 20);

      // Title
      doc.setFontSize(18);
      doc.text("Invoice", 105, 15, null, null, "center");

      // Barcode
      doc.addImage(barcodeData, "PNG", 150, 10, 50, 20);

      // Order + Customer Info
      doc.setFontSize(12);
      doc.text(`Order ID: ${order.order_id}`, 15, 40);
      doc.text(`Email: ${order.email}`, 15, 47);
      doc.text(`Payment Method: ${order.payment_method}`, 15, 54);
      doc.text(`Billing Address: ${order.billing_address}`, 15, 61);
      doc.text(
        `Shipping Address: ${order.shipping_address}, ${order.shipping_city} - ${order.shipping_zip}`,
        15,
        68
      );

      // Table
      const items = JSON.parse(order?.items);
      console.log(items);

      const tableData = items.map((item) => [
        item.product_name,
        item.quantity,
        `$${item.price}`,
        `$${item.price * item.quantity}`,
      ]);

      autoTable(doc, {
        startY: 80,
        head: [["Product", "Quantity", "Unit Price", "Total"]],
        body: tableData,
      });

      // Total
      const grandTotal = Number(order.total).toFixed(2);
      doc.text(`Total Paid: $${grandTotal}`, 15, doc.lastAutoTable.finalY + 10);

      resolve(doc);
    };
  });
};
