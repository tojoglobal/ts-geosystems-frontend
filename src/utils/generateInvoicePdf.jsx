import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateBarcodeBase64 } from "./generateBarcodeBase64";

export const GenerateInvoicePdf = async (order) => {
  console.log(order);

  const doc = new jsPDF();
  const logoUrl = "/favicon.png";

  const logo = new Image();
  logo.crossOrigin = "Anonymous";
  logo.src = logoUrl;

  const barcodeData = await generateBarcodeBase64(order.order_id);

  return new Promise((resolve) => {
    logo.onload = async () => {
      // 🖼️ Logo
      doc.addImage(logo, "PNG", 15, 10, 50, 20);

      // 🧾 Title
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.text("Invoice", 105, 15, null, null, "center");

      // 🧾 Barcode
      doc.addImage(barcodeData, "PNG", 150, 10, 50, 20);

      // ℹ️ Order Info
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

      // 📦 Table
      const items = JSON.parse(order?.items || "[]");
      const tableData = items.map((item) => [
        item.product_name,
        item.quantity,
        `$${item.price}`,
        `$${(item.price * item.quantity).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 80,
        head: [["Product", "Quantity", "Unit Price", "Total"]],
        body: tableData,
      });

      // 💲 Total
      const totalY = doc.lastAutoTable.finalY + 10;
      const grandTotal = Number(order.total).toFixed(2);
      doc.text(`Total Amount: $${grandTotal}`, 15, totalY);

      // ✅ Watermark BEFORE content
      const isPaid = order?.paymentStatus === "paid";
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.3 }));
      doc.setFontSize(60);
      doc.setTextColor(isPaid ? 0 : 200, isPaid ? 200 : 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(isPaid ? "PAID" : "UNPAID", 105, 150, {
        align: "center",
        angle: 40,
      });
      doc.restoreGraphicsState();
      // resolve the pdf file
      resolve(doc);
    };
  });
};
