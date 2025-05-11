import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateBarcodeBase64 } from "./generateBarcodeBase64";

export const GenerateInvoicePdf = async (order) => {
  const doc = new jsPDF("p", "mm", "a4");
  const logoUrl = "/favicon.png";

  const logo = new Image();
  logo.crossOrigin = "Anonymous";
  logo.src = logoUrl;

  const barcodeData = await generateBarcodeBase64(order.order_id);

  return new Promise((resolve) => {
    logo.onload = () => {
      // === Header ===
      doc.addImage(logo, "PNG", 15, 10, 30, 30);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("TS Geosystems Bangladesh", 55, 15);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        "8B, 65 Mymensingh Lane (Biponon Plot 22), Banglamotor, Dhaka-1000",
        55,
        22
      );
      doc.text("Phone: 0255168061", 55, 27);
      doc.text("www.ts-geosystems.com", 55, 32);

      // === Barcode & Invoice title ===
      doc.setFontSize(18);
      doc.text("INVOICE", 160, 20);
      doc.addImage(barcodeData, "PNG", 150, 25, 50, 15);

      // === Customer Info ===
      doc.setFont("helvetica", "bold");
      doc.text("BILL TO", 15, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(order.customer_name || "", 15, 56);
      doc.text(order.billing_address || "", 15, 61);
      doc.text(order.phone || "", 15, 66);
      doc.text(order.email || "", 15, 71);

      // === Invoice Info ===
      doc.text(`Invoice Number: ${order.order_id}`, 150, 50);
      doc.text(`Invoice Date: ${order.invoice_date}`, 150, 56);
      doc.text(`Payment Due: ${order.due_date}`, 150, 61);

      // === Product Table ===
      const items = JSON.parse(order?.items || "[]");
      const tableData = items.map((item) => [
        item.product_name,
        item.quantity,
        `৳${item.price.toFixed(2)}`,
        `৳${(item.quantity * item.price).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 80,
        head: [["Item", "Qty", "Price", "Amount"]],
        body: tableData,
        styles: { halign: "left" },
        headStyles: { fillColor: [22, 160, 133] },
      });

      const tableEndY = doc.lastAutoTable.finalY + 10;

      // === Summary ===
      doc.setFont("helvetica", "bold");
      doc.text(
        `Subtotal: ৳${parseFloat(order.subtotal).toFixed(2)}`,
        150,
        tableEndY
      );
      doc.text(
        `VAT 10%: ৳${parseFloat(order.vat).toFixed(2)}`,
        150,
        tableEndY + 6
      );
      doc.text(
        `Total: ৳${parseFloat(order.total).toFixed(2)}`,
        150,
        tableEndY + 12
      );

      doc.setFont("helvetica", "normal");
      doc.text(
        `Payment on ${order.invoice_date} using ${
          order.payment_method
        }: ৳${parseFloat(order.total).toFixed(2)}`,
        15,
        tableEndY + 22
      );
      doc.setFont("helvetica", "bold");
      doc.text(
        `Amount Due (BDT): ৳${parseFloat(order.due_amount).toFixed(2)}`,
        15,
        tableEndY + 30
      );

      // === Notes / Terms ===
      const terms = [
        "* Please check and test instruments at the time of delivery.",
        "* Do not remove the service sticker to claim warranty.",
        "* No warranty for Battery, Charger & Data Cable.",
        "* After receiving, if you don't collect the instrument within 30 days, we are not responsible for any damage or missing.",
      ];
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Notes / Terms", 15, tableEndY + 40);
      terms.forEach((line, i) => doc.text(line, 15, tableEndY + 46 + i * 5));

      resolve(doc);
    };
  });
};
