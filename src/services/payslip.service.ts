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
    container.style.left = "-999";
    container.style.top = "-999";
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

    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Payslip</title>
    <style>
        /* GLOBAL FONT COLOR */
        body,
        .page,
        .page * {
            color: #000 !important;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }

        /* A4 page */
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: auto;
            background: #ffffff;
        }

        /* Logo placeholder */
        .logo {
            width: 100px;
            height: 100px;
            background: transparent;
            float: left;
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 10px;
            justify-items: center;
            margin-top: 40px;
        }

        .header h2 {
            font-size: 19px;
            font-weight: bold;
        }

        .title {
            text-align: center;
            font-size: 20px;
            margin: 15px 0;
            font-weight: bold;
            place-self: center;
        }

        /* Employee info table */
        .top-info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .top-info td {
            border: 1px solid #000;
            padding: 6px;
            width: 23%;
        }

        .top-info .label {
            font-weight: bold;
            width: 27%;
            background-color: #dae8f7;
        }

        /* Main tables */
        .main-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .main-table .label {
            width: 27%;
            font-weight: bold;
            background-color: #dae8f7;
        }

        .main-table .label2 {
            width: 23%;
            font-weight: bold;
            background-color: #dae8f7;
        }

        .main-table .value {
            width: 23%;
            font-weight: normal;
            text-align: right;
        }

        .main-table th,
        .main-table td {
            border: 1px solid #000;
            padding: 6px;
        }

        .header-row {
            text-align: center;
        }

        .main-table th {
            text-align: center;
            font-weight: bold;
            background: #f3f3f3;
        }

        .total-row td {
            font-weight: bold;
        }

        /* Net salary table */
        .net-table {
            width: 50%;
            border-collapse: collapse;
            margin-left: auto;
            margin-bottom: 20px;
        }

        .net-table td {
            border: 1px solid #000;
            padding: 6px;
        }

        .net-table .label {
            width: 54%;
            font-weight: bold;
            background-color: #dae8f7;
        }

        .net-table .value {
            width: 46%;
            text-align: right;
        }

        /* Generated date */
        .generated {
            font-size: 12px;
            margin-top: 10px;
            font-weight: bold;
        }

        /* Footer */
        .footer-note {
            text-align: center;
            font-size: 12px;
            margin-top: 25px;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <div class="page">

        <!-- HEADER -->
        <div class="header">
            <h2>The Synergates Business Solutions (PVT) Ltd.</h2>
            <p>Office # 406, 4th Floor, Kashif Center, Main Sharah-e-Faisal, Karachi 75230 - Pakistan</p>
        </div>

        <h3 class="title">Salary Slip</h3>

        <!-- EMPLOYEE INFO TABLE -->
        <table class="top-info">
            <tr>
                <td class="label">Employee Name</td>
                <td class="value"></td>
                <td class="label">Designation</td>
                <td class="value"></td>
            </tr>
            <tr>
                <td class="label">Employee ID</td>
                <td class="value"></td>
                <td class="label">Month/Year</td>
                <td class="value"></td>
            </tr>
        </table>

        <!-- MAIN EARNINGS/DEDUCTIONS TABLE -->
        <table class="main-table">
            <tbody>
                <tr class="header-row">
                    <td class="label">Earnings</td>
                    <td class="label2">Amount</td>
                    <td class="label">Deductions</td>
                    <td class="label2">Amount</td>
                </tr>
                <tr>
                    <td class="label">Basic Salary</td>
                    <td class="value"></td>
                    <td class="label">Income Tax</td>
                    <td class="value"></td>
                </tr>

                <tr>
                    <td class="label">House Rent Allowance</td>
                    <td class="value"></td>
                    <td class="label">Loan Deduction</td>
                    <td class="value"></td>
                </tr>

                <tr>
                    <td class="label">Utility Allowance</td>
                    <td class="value"></td>
                    <td class="label">EOBI</td>
                    <td class="value"></td>
                </tr>

                <tr>
                    <td class="label">Medical Allowance</td>
                    <td class="value"></td>
                    <td class="label">Other Deductions</td>
                    <td class="value"></td>
                </tr>

                <tr>
                    <td class="label">Conveyance Allowance</td>
                    <td class="value"></td>
                    <td class="value"></td>
                    <td class="value"></td>
                </tr>

                <tr>
                    <td class="label">Arrears</td>
                    <td class="value"></td>
                    <td class="value"></td>
                    <td class="value"></td>
                </tr>

                <tr>
                    <td class="label">Bonus</td>
                    <td class="value"></td>
                    <td class="value"></td>
                    <td class="value"></td>
                </tr>

                <tr>
                    <td class="label">Increment</td>
                    <td class="value"></td>
                    <td class="value"></td>
                    <td class="value"></td>
                </tr>

                <!-- Total Row -->
                <tr class="total-row">
                    <td class="label">Total Gross Salary</td>
                    <td class="value"></td>
                    <td class="label">Total Deductions</td>
                    <td class="value"></td>
                </tr>

            </tbody>
        </table>

        <!-- NET SALARY BOX -->
        <table class="net-table">
            <tr>
                <td class="label">Net Salary (Figures)</td>
                <td class="value"></td>
            </tr>
            <tr>
                <td class="label">Net Salary (Words)</td>
                <td class="value"></td>
            </tr>
        </table>

        <!-- GENERATED DATE -->
        <p class="generated">Generated on <span class="date"></span></p>

        <!-- FOOTER -->
        <p class="footer-note">
            This is a computer-generated payslip and does not require signature.
        </p>

    </div>

</body>

</html>`;

  }
}
