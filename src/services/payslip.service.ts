import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";

@Injectable({
  providedIn: 'root'
})
export class PayslipService {
generatePayslipPDF(employee: Employee) {
  const html = this.generatePayslipHTML(employee);

  // Create temp container
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.left = "0";
  container.style.top = "0";
  container.style.width = "800px"; 
  container.style.background = "#000"; 
  document.body.appendChild(container);

  html2canvas(container, {
    scale: 3, // High quality
    backgroundColor: null
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = 210;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${employee.name}_payslip.pdf`);
    container.remove();
  });
}


  generatePayslipHTML(employee: Employee): string {
    const totalEarnings =
      employee.basicSalary +
      employee.houseRentAllowance +
      employee.utilityAllowance +
      employee.medicalAllowance +
      employee.conveyanceAllowance +
      employee.arrears +
      employee.bonus +
      employee.increment;

    const totalDeductions =
      employee.incomeTax +
      employee.loanDeduction +
      employee.eobi +
      employee.otherDeductions;

    const netSalary = totalEarnings - totalDeductions;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: #000;
            color: #fff;
          }
          .payslip-container {
            max-width: 210mm;
            margin: 0 auto;
            background: #000;
            border: 2px solid #5a7ea6;
          }
          .header {
            background: #5a7ea6;
            color: #000;
            padding: 20px;
            text-align: center;
            border-bottom: 3px solid #a2cd96;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
            font-weight: bold;
          }
          .header p {
            font-size: 14px;
            margin-top: 5px;
          }
          .employee-info {
            padding: 20px;
            background: #1a1a1a;
            border-bottom: 2px solid #5a7ea6;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #333;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: bold;
            color: #a2cd96;
          }
          .info-value {
            color: #fff;
          }
          .salary-details {
            padding: 20px;
          }
          .section-title {
            background: #5a7ea6;
            color: #000;
            padding: 10px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
          }
          .salary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .salary-table tr {
            border-bottom: 1px solid #333;
          }
          .salary-table td {
            padding: 10px;
          }
          .salary-table td:first-child {
            color: #a2cd96;
            width: 70%;
          }
          .salary-table td:last-child {
            text-align: right;
            font-weight: bold;
            color: #fff;
          }
          .total-row {
            background: #1a1a1a;
            font-weight: bold;
            font-size: 16px;
          }
          .total-row td {
            padding: 15px 10px;
            border-top: 2px solid #5a7ea6;
          }
          .net-salary {
            background: #a2cd96;
            color: #000;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
          }
          .net-salary h2 {
            font-size: 18px;
            margin-bottom: 10px;
          }
          .net-salary .amount {
            font-size: 32px;
            font-weight: bold;
          }
          .footer {
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 12px;
            border-top: 2px solid #5a7ea6;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="payslip-container">
          <div class="header">
            <h1>SALARY SLIP</h1>
            <p>Pay Period: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div class="employee-info">
            <div class="info-row">
              <span class="info-label">Employee Name:</span>
              <span class="info-value">${employee.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Designation:</span>
              <span class="info-value">${employee.designation}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Employee ID:</span>
              <span class="info-value">${employee.id || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date Generated:</span>
              <span class="info-value">${new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div class="salary-details">
            <div class="section-title">EARNINGS</div>
            <table class="salary-table">
              <tr>
                <td>Basic Salary</td>
                <td>Rs. ${employee.basicSalary.toLocaleString()}</td>
              </tr>
              <tr>
                <td>House Rent Allowance</td>
                <td>Rs. ${employee.houseRentAllowance.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Utility Allowance</td>
                <td>Rs. ${employee.utilityAllowance.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Medical Allowance</td>
                <td>Rs. ${employee.medicalAllowance.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Conveyance Allowance</td>
                <td>Rs. ${employee.conveyanceAllowance.toLocaleString()}</td>
              </tr>
              ${employee.arrears > 0 ? `<tr><td>Arrears</td><td>Rs. ${employee.arrears.toLocaleString()}</td></tr>` : ''}
              ${employee.bonus > 0 ? `<tr><td>Bonus</td><td>Rs. ${employee.bonus.toLocaleString()}</td></tr>` : ''}
              ${employee.increment > 0 ? `<tr><td>Increment</td><td>Rs. ${employee.increment.toLocaleString()}</td></tr>` : ''}
              <tr class="total-row">
                <td>Total Earnings</td>
                <td>Rs. ${totalEarnings.toLocaleString()}</td>
              </tr>
            </table>

            <div class="section-title">DEDUCTIONS</div>
            <table class="salary-table">
              <tr>
                <td>Income Tax</td>
                <td>Rs. ${employee.incomeTax.toLocaleString()}</td>
              </tr>
              <tr>
                <td>EOBI</td>
                <td>Rs. ${employee.eobi.toLocaleString()}</td>
              </tr>
              ${employee.loanDeduction > 0 ? `<tr><td>Loan Deduction</td><td>Rs. ${employee.loanDeduction.toLocaleString()}</td></tr>` : ''}
              ${employee.otherDeductions > 0 ? `<tr><td>Other Deductions</td><td>Rs. ${employee.otherDeductions.toLocaleString()}</td></tr>` : ''}
              <tr class="total-row">
                <td>Total Deductions</td>
                <td>Rs. ${totalDeductions.toLocaleString()}</td>
              </tr>
            </table>

            <div class="net-salary">
              <h2>NET SALARY</h2>
              <div class="amount">Rs. ${netSalary.toLocaleString()}</div>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated payslip and does not require a signature.</p>
            <p>For any queries, please contact the HR department.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
