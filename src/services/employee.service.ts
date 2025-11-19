import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  setEmployees(employees: Employee[]) {
    this.employeesSubject.next(employees);
  }

  getEmployees(): Employee[] {
    return this.employeesSubject.value;
  }

  parseExcelData(data: any[]): Employee[] {
    return data.map((row, index) => ({
      id: `emp-${index + 1}`,
      name: row['name'] || row['Name'] || '',
      designation: row['designation'] || row['Designation'] || '',
      basicSalary: this.parseNumber(row['Basic Salary'] || row['basicSalary']),
      incomeTax: this.parseNumber(row['IncomeTax'] || row['Income Tax']),
      houseRentAllowance: this.parseNumber(row['House Rent Allowance'] || row['houseRentAllowance']),
      loanDeduction: this.parseNumber(row['Loan Deduction-'] || row['loanDeduction']),
      utilityAllowance: this.parseNumber(row['Utility Allowance'] || row['utilityAllowance']),
      eobi: this.parseNumber(row['EOBI'] || row['eobi']),
      medicalAllowance: this.parseNumber(row['Medical Allowance'] || row['medicalAllowance']),
      otherDeductions: this.parseNumber(row['Other deductions-'] || row['otherDeductions']),
      conveyanceAllowance: this.parseNumber(row['Conveyance Allowance'] || row['conveyanceAllowance']),
      arrears: this.parseNumber(row['Arrears-'] || row['arrears']),
      bonus: this.parseNumber(row['Bonus-'] || row['bonus']),
      increment: this.parseNumber(row['Increment'] || row['increment']),
      totalGrossSalary: this.parseNumber(row['Total Gross Salary'] || row['totalGrossSalary'])
    }));
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  }
}
