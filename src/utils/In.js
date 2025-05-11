import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateBarcodeBase64 } from "./generateBarcodeBase64";
import "./../../src/BanglaFront/Nikosh-normal";
import { getCouponInfo } from "./getCouponInfo";

export const GenerateInvoicePdf = async (order) => {
  const items = JSON.parse(order?.items || "[]");

  let subtotal = 0;
  let vatAmount = 0;

  items.forEach((item) => {
    const qty = item.quantity || 1;
    const unitPrice = item.price || 0;
    const totalItemPrice = qty * unitPrice;
    subtotal += totalItemPrice;

    const vatPerUnit = item.vatPerUnit || 0;
    vatAmount += vatPerUnit * qty;
  });

  // 🚚 Add shipping cost
  const shippingCost = parseFloat(order?.shipping_cost || 0);

  // 📦 Handle promo code discount
  let coupon = null;
  let discountAmount = 0;
  let couponLabel = "";

  if (order?.promo_code && typeof order.promo_code === "string") {
    coupon = await getCouponInfo(order?.promo_code);
  }
  if (coupon?.code_name) {
    couponLabel = coupon?.code_name;
    if (coupon.type === "percentage") {
      discountAmount = (subtotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discountAmount = coupon.discount;
    }
  }

  // 🧮 Final total
  const total = subtotal + vatAmount + shippingCost - discountAmount;

  console.log(order);
  const doc = new jsPDF("p", "mm", "a4");
  const logoUrl = "/TS-WEB-LOGO.png";

  const logo = new Image();
  logo.crossOrigin = "Anonymous";
  logo.src = logoUrl;

  const barcodeData = await generateBarcodeBase64(order.order_id);

  // Helper function to draw label + value inline
  const drawLabelWithValue = (label, value, x, y) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(label, x, y);
    const labelWidth = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    doc.text(value, x + labelWidth + 2, y); // +2 for spacing
  };

  // Format date
  const formattedInvoiceDate = new Date(order.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const TAKA_SIGN = "৳";

  return new Promise((resolve) => {
    logo.onload = async () => {
      // === Header ===
      doc.addImage(logo, "PNG", 12, 15, 65, 10);

      // Right-aligned header content
      doc.setFontSize(30);
      doc.setFont("helvetica");
      doc.text("INVOICE", 200, 20, { align: "right" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("TS Geosystems Bangladesh", 200, 30, { align: "right" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "8B, 65 Mymensingh Lane (Biponon Plot 22), Banglamotor, Dhaka-1000",
        200,
        35,
        { align: "right" }
      );
      doc.text("Phone: 0255168061", 200, 40, { align: "right" });
      doc.text("www.ts-geosystems.com", 200, 45, { align: "right" });

      // === Horizontal line below header ===
      doc.setDrawColor(160);
      doc.setLineWidth(0.3);
      doc.line(5, 49, 205, 49);

      // 🧾 Barcode
      // doc.addImage(barcodeData, "PNG", 150, 10, 50, 20);

      // ℹ️ Order Info
      doc.setTextColor(150);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150);
      doc.text("BILL TO", 10, 57);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(order?.shipping_name || "", 10, 61);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Billing Address: ${order.billing_address}`, 10, 65);
      doc.text(
        `Shipping Address: ${order.shipping_address}, ${order.shipping_city} - ${order.shipping_zip}`,
        10,
        69
      );
      doc.text(order?.shipping_phone || "", 10, 73);
      doc.text(order?.email || "", 10, 77);

      // === Invoice Info (Right Side) ===
      drawLabelWithValue("Invoice Number:", order.order_id.toString(), 135, 57);
      drawLabelWithValue("Invoice Date:", formattedInvoiceDate, 156, 63);
      drawLabelWithValue("Payment Due:", formattedInvoiceDate, 156, 69);

      // 📦 Table
      doc.setFont("Nikosh", "normal");

      // Build table data
      const tableData = items.map((item) => [
        item.product_name,
        item.quantity.toString(),
        `৳ ${item.price.toFixed(2)}`,
        `৳ ${(item.quantity * item.price).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 85,
        // tableWidth: 210,
        tableWidth: "auto",
        margin: { left: 0, right: 0 },
        head: [["Item", "Qty", "Price", "Amount"]],
        body: tableData,
        // Full-width column sizing
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 20 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
        },
        styles: {
          font: "Nikosh",
          fontSize: 10,
          textColor: 50,
          halign: "left",
          valign: "middle",
          cellPadding: { left: 6, right: 2, top: 2, bottom: 2 },
        },
        headStyles: {
          fillColor: [21, 64, 107], // #15406B
          textColor: 255, // white
          font: "Nikosh",
          fontStyle: "normal",
          fontSize: 11,
          halign: "left",
          valign: "middle",
        },
        // Only apply Nikosh to price columns again if needed
        didParseCell: function (data) {
          if (
            data.section === "body" &&
            (data.column.index === 2 || data.column.index === 3)
          ) {
            data.cell.styles.fontSize = 10;
          }
        },
      });

      const tableEndY = doc.lastAutoTable.finalY + 10;

      // === 💲Total Summary  ===
      const lineHeight = 6;
      const pageWidth = doc.internal.pageSize.getWidth();
      const summaryX = pageWidth - 70;
      let y = tableEndY;

      // === 💲 Total Summary Block ===
      doc.setFont("Nikosh", "normal");
      doc.setFontSize(10);

      // Utility function for right-aligned summary lines
      const drawRightSummaryLine = (label, value) => {
        doc.text(label, summaryX, y);
        doc.text(`${TAKA_SIGN}${value.toFixed(2)}`, pageWidth - 15, y, {
          align: "right",
        });
        y += lineHeight;
      };

      drawRightSummaryLine("Subtotal:", subtotal);
      drawRightSummaryLine("VAT:", vatAmount);

      if (shippingCost > 0) {
        drawRightSummaryLine("Shipping:", shippingCost);
      }

      if (couponLabel && discountAmount > 0) {
        doc.text(`Discount (${couponLabel}):`, summaryX, y);
        doc.text(
          `-${TAKA_SIGN}${discountAmount.toFixed(2)}`,
          pageWidth - 15,
          y,
          {
            align: "right",
          }
        );
        y += lineHeight;
      }

      // === Line separator above total ===
      doc.setDrawColor(180);
      doc.setLineWidth(0.5);
      doc.line(60, y, pageWidth - 15, y);
      y += lineHeight;

      // === Total
      doc.setFont("Nikosh", "bold");
      drawRightSummaryLine("Total:", total);

      // ✅ Payment method and amount paid
      const isPaid = order?.paymentStatus === "paid";
      // Payment row
      doc.setFont("Nikosh", "normal");

      if (isPaid) {
        // If payment is made, show payment date and method
        doc.text(
          `Payment on ${formattedInvoiceDate} using ${order.payment_method}:`,
          90,
          y
        );
        doc.text(
          `${TAKA_SIGN}${parseFloat(order.total).toFixed(2)}`,
          pageWidth - 15,
          y,
          { align: "right" }
        );
      } else {
        // If unpaid, show a message clearly
        doc.setTextColor(200, 0, 0); // Red text
        doc.text("Payment not received yet.", 90, y);
        doc.setTextColor(0, 0, 0); // Reset color
        doc.text(`${TAKA_SIGN}0.00`, pageWidth - 15, y, { align: "right" });
      }
      y += lineHeight;

      // === Line separator
      // y += 3;
      doc.setDrawColor(180);
      doc.line(60, y, pageWidth - 15, y);
      y += lineHeight;

      // === Amount Due
      doc.setFont("Nikosh", "bold");
      doc.text("Amount Due (BDT):", summaryX, y);
      doc.text(
        `${TAKA_SIGN}${isPaid ? "0.00" : parseFloat(order.total).toFixed(2)}`,
        pageWidth - 15,
        y,
        { align: "right" }
      );

      // === Barcode and QR Code Above Terms ===
      const barcodeY = 250; // 250mm from top (bottom area)
      const barcodeX = pageWidth - 60; // Right side
      doc.addImage(barcodeData, "PNG", barcodeX, barcodeY, 40, 20); // width: 40mm, height: 20mm

      // Example QR code (you can generate real one or use a base64)
      const qrImage = new Image();
      qrImage.src = `https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${order.order_id}`;
      qrImage.crossOrigin = "Anonymous";

      // When QR image loads, draw it and then resolve PDF
      qrImage.onload = () => {
        doc.addImage(qrImage, "PNG", 15, barcodeY, 30, 30); // QR left side
        // === Notes / Terms ===
        const terms = [
          "* Please check and test instruments at the time of delivery.",
          "* Do not remove the service sticker to claim warranty.",
          "* No warranty for Battery, Charger & Data Cable.",
          "* After receiving, if you don't collect the instrument within 30 days, we are not responsible for any damage or missing.",
        ];
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text("Notes / Terms", 15, barcodeY + 38);
        terms.forEach((line, i) => doc.text(line, 15, barcodeY + 44 + i * 5));

        // ✅ Watermark
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

        // ✅ Finally, resolve
        resolve(doc);
      };
    };
  });
};
