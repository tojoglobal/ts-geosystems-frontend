import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateBarcodeBase64 } from "./generateBarcodeBase64";
import "./../../src/BanglaFront/Nikosh-normal";
import { getCouponInfo } from "./getCouponInfo";
import QRCode from "qrcode";
import { formatBDT } from "./formatBDT";

export const GenerateInvoicePdf = async (order) => {
  const items = JSON.parse(order?.items || "[]");

  let subtotal = 0;
  let sl = 1;
  const tableData = [];
  items.forEach((item) => {
    const qty = item.quantity || 1;
    // Main product row
    tableData.push([
      sl++,
      `${item.product_name}`,
      qty,
      `৳ ${formatBDT(Number(item.priceIncVat))}`,
      `৳ ${formatBDT(Number(item.totalPrice))}`,
    ]);
    subtotal += Number(item.totalPrice) || 0;

    // Option rows (if any)
    if (Array.isArray(item.options) && item.options.length > 0) {
      item.options.forEach((opt, i) => {
        tableData.push([``, `↳(${sl - 1}.${i + 1}) ${opt.label}`, "", ``, ``]);
      });
    }
  });

  // Add shipping
  const shippingCost = parseFloat(order?.shipping_cost || 0);

  // Promo/discount
  let coupon = null;
  let discountAmount = 0;
  let couponLabel = "";
  if (order?.promo_code && typeof order.promo_code === "string") {
    const promoCode = JSON.parse(order.promo_code);
    coupon = await getCouponInfo(promoCode);
  }
  if (coupon?.code_name) {
    couponLabel = coupon?.code_name;
    if (coupon.type === "percentage") {
      discountAmount = (subtotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discountAmount = coupon.discount;
    }
  }

  const total = subtotal + shippingCost - discountAmount;

  const doc = new jsPDF("p", "mm", "a4");
  const logoUrl = "/TS-WEB-LOGO.png";
  const logo = new Image();
  logo.crossOrigin = "Anonymous";
  logo.src = logoUrl;
  const barcodeData = await generateBarcodeBase64(order.order_id);

  // Format date
  const formattedInvoiceDate = new Date(order.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const TAKA_SIGN = "৳";

  return new Promise((resolve) => {
    logo.onload = async () => {
      // Header
      doc.addImage(logo, "PNG", 12, 15, 65, 10);
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

      // Line
      doc.setDrawColor(160);
      doc.setLineWidth(0.3);
      doc.line(5, 49, 205, 49);

      // BILL TO
      doc.setTextColor(150);
      doc.setFont("helvetica", "normal");
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

      // Invoice Info (Right Side)
      doc.setFontSize(10);
      doc.text(`Invoice Number: ${order.order_id}`, 135, 57);
      doc.text(`Invoice Date: ${formattedInvoiceDate}`, 156, 63);
      doc.text(`Payment Due: ${formattedInvoiceDate}`, 156, 69);

      // 📦 Table
      doc.setFont("Nikosh", "normal");
      autoTable(doc, {
        startY: 85,
        tableWidth: "auto",
        margin: { left: 0, right: 0 },
        head: [["SL", "Item / Accessory", "Qty", "Unit Price", "Total"]],
        body: tableData,
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 15 },
          3: { cellWidth: 28 },
          4: { cellWidth: 28 },
        },
        styles: {
          font: "Nikosh",
          fontSize: 10,
          textColor: 50,
          halign: "left",
          valign: "middle",
          cellPadding: { left: 4, right: 2, top: 2, bottom: 2 },
        },
        headStyles: {
          fillColor: [21, 64, 107],
          textColor: 255,
          font: "Nikosh",
          fontStyle: "normal",
          fontSize: 11,
          halign: "left",
          valign: "middle",
        },
      });

      const tableEndY = doc.lastAutoTable.finalY + 10;
      const lineHeight = 6;
      const pageWidth = doc.internal.pageSize.getWidth();
      const summaryX = pageWidth - 80;
      let y = tableEndY;

      // === 💲 Total Summary Block ===
      doc.setFont("Nikosh", "normal");
      doc.setFontSize(10);
      const drawRightSummaryLine = (label, value) => {
        doc.text(label, summaryX, y);
        doc.text(`${TAKA_SIGN}${Number(value).toFixed(2)}`, pageWidth - 15, y, {
          align: "right",
        });
        y += lineHeight;
      };
      drawRightSummaryLine("Subtotal:", subtotal);
      if (shippingCost > 0) drawRightSummaryLine("Shipping:", shippingCost);

      if (couponLabel && discountAmount > 0) {
        doc.text(`Discount :`, summaryX, y);
        doc.text(
          `-${TAKA_SIGN}${discountAmount.toFixed(2)}`,
          pageWidth - 15,
          y,
          { align: "right" }
        );
        y += lineHeight;
      }
      doc.setDrawColor(180);
      doc.setLineWidth(0.5);
      doc.line(60, y, pageWidth - 15, y);
      y += lineHeight;

      doc.setFont("Nikosh", "bold");
      drawRightSummaryLine("Total:", total);

      // Payment status and Due
      const isPaid = order?.paymentStatus === "paid";
      doc.setFont("Nikosh", "normal");
      if (isPaid) {
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
        doc.setTextColor(200, 0, 0);
        doc.text("Payment not received yet.", 90, y);
        doc.setTextColor(0, 0, 0);
        doc.text(`${TAKA_SIGN}0.00`, pageWidth - 15, y, { align: "right" });
      }
      y += lineHeight;

      doc.setDrawColor(180);
      doc.line(60, y, pageWidth - 15, y);
      y += lineHeight;

      doc.setFont("Nikosh", "bold");
      doc.text("Amount Due (BDT):", summaryX, y);
      doc.text(
        `${TAKA_SIGN}${isPaid ? "0.00" : parseFloat(order.total).toFixed(2)}`,
        pageWidth - 15,
        y,
        { align: "right" }
      );

      // Notes / Terms
      const termsStartY = 220;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Notes / Terms", 15, termsStartY);
      const terms = [
        "* Please check and test instruments at the time of delivery.",
        "* Do not remove the service sticker to claim warranty.",
        "* No warranty for Battery, Charger & Data Cable.",
        "* After receiving, if you don't collect the instrument within 30 days, we are not responsible for any damage or missing.",
      ];
      terms.forEach((line, i) => {
        doc.text(line, 15, termsStartY + 6 + i * 5);
      });

      // Barcode and QR
      const barcodeY = termsStartY + 6 + terms.length * 5 + 10;
      const barcodeX = pageWidth - 60;
      doc.addImage(barcodeData, "PNG", barcodeX, barcodeY, 40, 20);
      const qrDataUrl = await QRCode.toDataURL(order.order_id);
      doc.addImage(qrDataUrl, "PNG", 15, barcodeY, 30, 30);

      // Watermark
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

      resolve(doc);
    };
  });
};
