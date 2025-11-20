import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { PayslipService } from '../services/payslip.service';
import { Employee } from '../models/employee.model';

type SortField = keyof Employee;
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      <div class="controls">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            placeholder="Search employees by name or designation..."
            class="search-input"
          />
          @if (searchTerm) {
            <button class="clear-btn" (click)="clearSearch()">✕</button>
          }
        </div>
        <div class="results-count">
          Showing {{ filteredEmployees.length }} of {{ employees.length }} employees
        </div>
      </div>

      @if (filteredEmployees.length === 0 && employees.length === 0) {
        <div class="no-data">
          <div class="no-data-icon">📋</div>
          <h3>No Employee Data</h3>
          <p>Import an Excel file to view employee records</p>
        </div>
      } @else if (filteredEmployees.length === 0) {
        <div class="no-data">
          <div class="no-data-icon">🔍</div>
          <h3>No Results Found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      } @else {
        <div class="table-wrapper">
          <table class="employee-table">
            <thead>
              <tr>
                <th (click)="sort('name')" class="sortable">
                  Name
                  <span class="sort-indicator">{{ getSortIndicator('name') }}</span>
                </th>
                <th (click)="sort('designation')" class="sortable">
                  Designation
                  <span class="sort-indicator">{{ getSortIndicator('designation') }}</span>
                </th>
                <th (click)="sort('basicSalary')" class="sortable">
                  Basic Salary
                  <span class="sort-indicator">{{ getSortIndicator('basicSalary') }}</span>
                </th>
                <th (click)="sort('totalGrossSalary')" class="sortable">
                  Gross Salary
                  <span class="sort-indicator">{{ getSortIndicator('totalGrossSalary') }}</span>
                </th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (employee of filteredEmployees; track employee.id) {
                <tr>
                  <td class="name-cell">{{ employee.name }}</td>
                  <td>{{ employee.designation }}</td>
                  <td class="amount">Rs. {{ employee.basicSalary.toLocaleString() }}</td>
                  <td class="amount">Rs. {{ employee.totalGrossSalary.toLocaleString() }}</td>
                  <td class="amount">Rs. {{ calculateAllowances(employee).toLocaleString() }}</td>
                  <td class="amount deduction">Rs. {{ calculateDeductions(employee).toLocaleString() }}</td>
                  <td class="amount net-salary">Rs. {{ calculateNetSalary(employee).toLocaleString() }}</td>
                  <td>
                    <button class="download-btn" (click)="downloadPayslip(employee)">
                        <span *ngIf="!employee.downloading">Download</span>
                        <div *ngIf="employee.downloading" class="loader"></div>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`


.loader {
  width: 22px;
  height: 22px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  justify-self: center;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {to{transform: rotate(1turn)}}
    .table-container {
      padding: 20px;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 20px;
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 300px;
      max-width: 500px;
    }

    .search-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
    }

    .search-input {
      width: 100%;
      padding: 12px 45px 12px 45px;
      background: #1a1a1a;
      border: 2px solid #5a7ea6;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #a2cd96;
      box-shadow: 0 0 0 3px rgba(162, 205, 150, 0.1);
    }

    .search-input::placeholder {
      color: #666;
    }

    .clear-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 18px;
      padding: 5px 10px;
      transition: color 0.2s;
    }

    .clear-btn:hover {
      color: #a2cd96;
    }

    .results-count {
      color: #5a7ea6;
      font-size: 14px;
      white-space: nowrap;
    }

    .table-wrapper {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #5a7ea6;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      background: #000;
    }

    .employee-table thead {
      background: #5a7ea6;
      color: #000;
    }

    .employee-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
    }

    .employee-table th.sortable {
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
    }

    .employee-table th.sortable:hover {
      background: #6a8eb6;
    }

    .sort-indicator {
      margin-left: 5px;
      font-size: 12px;
    }

    .employee-table tbody tr {
      border-bottom: 1px solid #333;
      transition: background 0.2s;
    }

    .employee-table tbody tr:hover {
      background: rgba(90, 126, 166, 0.1);
    }

    .employee-table td {
      padding: 15px;
      color: #fff;
      font-size: 14px;
    }

    .name-cell {
      font-weight: 500;
      color: #a2cd96;
    }

    .amount {
      text-align: right;
      font-family: 'Courier New', monospace;
    }

    .deduction {
      color: #ff6b6b;
    }

    .net-salary {
      color: #a2cd96;
      font-weight: 600;
    }

    .download-btn {
      background: linear-gradient(135deg, #5a7ea6, #4a6e96);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      width: 100px;
      height: 40px;
    }

    .download-btn:hover {
      background: linear-gradient(135deg, #6a8eb6, #5a7ea6);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(90, 126, 166, 0.4);
    }

    .download-btn:active {
      transform: translateY(0);
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-data-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .no-data h3 {
      color: #5a7ea6;
      margin-bottom: 10px;
      font-size: 20px;
    }

    .no-data p {
      color: #666;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .controls {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: 100%;
      }

      .results-count {
        text-align: center;
      }
    }
  `]
})
export class EmployeeTableComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  sortField: SortField | null = null;
  sortDirection: SortDirection = 'asc';
  downloading: boolean = true;

  constructor(
    private employeeService: EmployeeService,
    private payslipService: PayslipService
  ) { }

  ngOnInit() {
    this.employeeService.employees$.subscribe(employees => {
      this.employees = employees;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.employees];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term)
      );
    }

    if (this.sortField) {
      filtered.sort((a, b) => {
        const aVal = a[this.sortField!];
        const bVal = b[this.sortField!];

        let comparison = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        }

        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.filteredEmployees = filtered;
  }

  sort(field: SortField) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIndicator(field: SortField): string {
    if (this.sortField !== field) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  calculateAllowances(employee: Employee): number {
    return (
      employee.houseRentAllowance +
      employee.utilityAllowance +
      employee.medicalAllowance +
      employee.conveyanceAllowance +
      employee.arrears +
      employee.bonus +
      employee.increment
    );
  }

  calculateDeductions(employee: Employee): number {
    return (
      employee.incomeTax +
      employee.loanDeduction +
      employee.eobi +
      employee.otherDeductions
    );
  }

  calculateNetSalary(employee: Employee): number {
    return employee.totalGrossSalary - this.calculateDeductions(employee);
  }

  async downloadPayslip(employee: Employee) {
    employee.downloading = true
    await this.payslipService.generatePayslipPDF(employee);
    employee.downloading = false
  }
}
