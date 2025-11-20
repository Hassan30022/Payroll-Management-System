export interface Employee {
  id?: string;
  name: string;
  designation: string;

  basicSalary: number;
  houseRentAllowance: number;
  utilityAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  arrears: number;

  grossSalary: number;             // Added
  bonus: number;
  increment: number;
  totalGrossSalary: number;

  incomeTax: number;
  loanDeduction: number;
  eobi: number;
  otherDeductions: number;

  totalDeductions: number;         // Added
  netPay: number;                  // Added
  inWords: string;                 // Updated to string (NOT number)

  downloading?: boolean;
}
