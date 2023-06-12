const PDFGenerator = require("pdfkit");
const fs = require("fs");

const Invoice = require("../models/invoiceModel");
const Product = require("../models/productModel");
const OrderItem = require("../models/orderItemModel");

class InvoiceGenerator {
  constructor(invoice) {
    this.invoice = invoice;
  }

  generateHeaders(doc) {
    console.log(this.invoice);
    const billingAddress = this.invoice.address;

    doc
      .fillColor("#000")
      .fontSize(20)
      .text("INVOICE", 275, 50, { align: "right" })
      .fontSize(10)
      .text(`Invoice Number: ${this.invoice.id}`, { align: "right" })
      .text(`Balance Due: $${this.invoice.totalPrice}`, {
        align: "right",
      })
      .moveDown()
      .text(`Billing Address:\n ${billingAddress}\n`, { align: "right" });

    const beginningOfPage = 50;
    const endOfPage = 550;

    doc.moveTo(beginningOfPage, 200).lineTo(endOfPage, 200).stroke();

    doc.moveTo(beginningOfPage, 250).lineTo(endOfPage, 250).stroke();
  }

  async generateTable(doc) {
    const tableTop = 270;
    const itemCodeX = 50;
    const descriptionX = 100;
    const quantityX = 250;
    const priceX = 300;
    const amountX = 350;

    doc
      .fontSize(10)
      .text("Item Code", itemCodeX, tableTop, { bold: true })
      .text("Description", descriptionX, tableTop)
      .text("Quantity", quantityX, tableTop)
      .text("Price", priceX, tableTop)
      .text("Amount", amountX, tableTop);

    const items = this.invoice.orderItems;
    const invoiceType = this.invoice.invoiceType;

    console.log(items);
    console.log(invoiceType);
    let i = 0;
    let y = 0;

    for (i = 0; i < items.length; i++) {
      const item = items[i];
      y = tableTop + 25 + i * 25;
      console.log(y);

      const orderItem = await OrderItem.findById(item);

      doc
        .fontSize(10)
        .text("AYO1", itemCodeX, y)
        .text("AYO2", descriptionX, y)
        .text("AYO3", quantityX, y);

      const product = await Product.findById(orderItem.product);

      if (invoiceType == "Purchase") {
        doc
          .fontSize(10)
          .text(product.productName, itemCodeX, y)
          .text(orderItem.quantity, quantityX, y)
          .text(`$ ${product.price}`, priceX, y);
      } else if (invoiceType == "DiscountRate") {
        doc
          .fontSize(10)
          .text(product.productName, itemCodeX, y)
          .text(orderItem.quantity, quantityX, y)
          .text(`$ ${product.discountPrice}`, priceX, y);
      } else if (invoiceType == "RefundApproval") {
        console.log("DEVASA DEBUG");
        doc
          .fontSize(10)
          .text(product.productName, itemCodeX, y)
          .text(orderItem.quantity, quantityX, y);
        console.log("DEVASA DEBUG1");
      }
    }

    if (invoiceType != "RefundApproval") {
      y = tableTop + 25 + i * 25;
      doc.text(`Total amount: $ ${this.invoice.totalPrice}`, amountX, y);
    }
  }

  generateFooter(doc) {
    const invoiceType = this.invoice.invoiceType;
    if (invoiceType == "Purchase") {
      doc.fontSize(10).text(`Payment due upon receipt. `, 50, 700, {
        align: "center",
      });
    } else if (invoiceType == "DiscountAlert") {
      doc.fontSize(10).text(`Items above have discount. `, 50, 700, {
        align: "center",
      });
    } else if (invoiceType == "RefundApproval") {
      doc
        .fontSize(10)
        .text(`Your refund request has been approved. `, 50, 700, {
          align: "center",
        });
    } else {
      doc.fontSize(10).text(`Payment due upon receipt. `, 50, 700, {
        align: "center",
      });
    }
  }

  generate() {
    let theOutput = new PDFGenerator();

    const fileName = `Invoice ${this.invoice.id}.pdf`;

    // pipe to a writable stream which would save the result into the same directory
    theOutput.pipe(fs.createWriteStream(fileName));

    this.generateHeaders(theOutput);

    theOutput.moveDown();

    this.generateTable(theOutput);

    this.generateFooter(theOutput);

    // write out file
    theOutput.end();
  }
}

module.exports = InvoiceGenerator;
