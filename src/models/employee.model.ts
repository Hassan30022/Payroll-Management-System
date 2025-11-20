export interface Employee {
  id?: string;
  name: string;
  designation: string;
  basicSalary: number;
  incomeTax: number;
  houseRentAllowance: number;
  loanDeduction: number;
  utilityAllowance: number;
  eobi: number;
  medicalAllowance: number;
  otherDeductions: number;
  conveyanceAllowance: number;
  arrears: number;
  bonus: number;
  increment: number;
  totalGrossSalary: number;
  downloading?: boolean;
}
