import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// import { DropdownModule } from 'primeng/dropdown';
// import { CalendarModule } from 'primeng/calendar';
// import { InputSwitchModule } from 'primeng/inputswitch';
// import { MessagesModule } from 'primeng/messages'; // For error messages
import { ToastModule } from 'primeng/toast'; // For toast notifications
import { MessageService } from 'primeng/api'; // For MessageService
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ApiWrapper } from '../../../../core/services/api.wrapper';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Account, Card, Upi } from '../../types/accounts.model';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-transaction-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    DatePickerModule,
    ToggleSwitchModule
  ],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm {

  apiWrapper = inject(ApiWrapper);

  transactionCreated = output();

  categories = signal([]);
  accounts = signal<Account[]>([]);
  cards = signal<Card[]>([])
  upis = signal<Upi[]>([])

  // --- New properties for the Add Transaction Form ---
  displayAddTransactionDialog: boolean = false;
  transactionForm!: FormGroup; // Use definite assignment assertion for non-null
  messages: any[] = []; // For displaying form-level error messages

  // Dropdown options (replace with actual data fetched from API if applicable)
  natures: DropdownOption[] = [
    { label: 'Normal', value: 'normal' },
    { label: 'UPI', value: 'upi' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Cash', value: 'cash' },
  ];

  types: DropdownOption[] = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];


  methods: DropdownOption[] = [
    { label: 'Account', value: 'account' },
    { label: 'Debit/Credit Card', value: 'card' },
    { label: 'UPI', value: 'upi' },
  ];

  // categories: DropdownOption[] = [
  //   { label: 'Groceries', value: '7d35dcea-df3f-4030-9643-80f8328fbab3' },
  //   { label: 'Rent', value: 'some-other-category-id-1' },
  //   { label: 'Salary', value: 'income-category-id-1' },
  //   { label: 'Utilities', value: 'some-other-category-id-2' },
  // ];

  // accounts: DropdownOption[] = [
  //   { label: 'Bank Account', value: '8445c3af-29d0-4fb7-8202-7150fe609002' },
  //   { label: 'Savings Account', value: 'another-account-id' },
  // ];

  constructor() {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAccounts();
    this.showAddTransactionDialog();
    this.autoLoadCardandUpi();
  }

  initTransactionForm(): void {
    this.transactionForm = new FormGroup({
      nature: new FormControl('normal', Validators.required),
      type: new FormControl('expense', Validators.required),
      category_id: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      amount: new FormControl(
        null,
        [Validators.required, Validators.min(0.01)],
      ), // Amount as number
      account_id: new FormControl('', Validators.required),
      card_id: new FormControl(''),
      upi_id: new FormControl(''),
      transaction_date: new FormControl(new Date(), Validators.required), // Default to current date
      is_paid: new FormControl(true), // Default to true
      method: new FormControl('account'), // Default to true
    });
  }

  autoLoadCardandUpi(): void {
    this.account_id?.valueChanges.subscribe({
      next: (account_id) => {
        this.cards.set(this.accounts().find((account: Account) => account.id === account_id)?.cards ?? [])
        this.upis.set(this.accounts().find((account: Account) => account.id === account_id)?.upis ?? [])
      }
    })
  }

  showAddTransactionDialog(): void {
    this.initTransactionForm(); // Re-initialize form to reset it when opening
    this.displayAddTransactionDialog = true;
    this.messages = []; // Clear any previous messages
  }

  hideAddTransactionDialog(): void {
    this.displayAddTransactionDialog = false;
    this.transactionForm.reset(); // Reset the form fields
    this.messages = []; // Clear messages
  }

  // Helper function to mark all controls in a FormGroup as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Getters for form controls to easily access them in template
  get nature() {
    return this.transactionForm.get('nature');
  }
  get type() {
    return this.transactionForm.get('type');
  }
  get category_id() {
    return this.transactionForm.get('category_id');
  }
  get description() {
    return this.transactionForm.get('description');
  }
  get amount() {
    return this.transactionForm.get('amount');
  }
  get account_id() {
    return this.transactionForm.get('account_id');
  }
  get card_id() {
    return this.transactionForm.get('card_id');
  }
  get upi_id() {
    return this.transactionForm.get('upi_id');
  }
  get transaction_date() {
    return this.transactionForm.get('transaction_date');
  }
  get is_paid() {
    return this.transactionForm.get('is_paid');
  }
  get method() {
    return this.transactionForm.get('method');
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      formData.transaction_date = formData.transaction_date.getTime();
      if(formData.method === 'account') {
        delete formData.card_id;
        delete formData.upi_id;
      }
      if(formData.method === 'card') {
        delete formData.card_id;
      }
      if(formData.method === 'upi') {
        delete formData.card_id;
      }
      delete formData.method;

      console.log('Form Submitted Data:', formData);
      this.apiWrapper.post('/transactions', formData).subscribe({
        next: (response: any) => {
          console.log("RESPONSE : ", response);
          this.hideAddTransactionDialog();
          this.transactionCreated.emit(response);
        },
        error: ({error}) => {
          console.log("ERROR : ", error)
        }
      })
      
      this.hideAddTransactionDialog();

    } else {
      console.log('Form is invalid.');
      this.messages = [
        { severity: 'error', summary: 'Error', detail: 'Please fill all required fields correctly.' }
      ];
      this.markFormGroupTouched(this.transactionForm); // Mark all fields as touched to show errors
    }
  }

  loadCategories() : void {
    this.apiWrapper.get('/categories').subscribe({
      next: (response: any) => {
        console.log("Categories: ", response);
        this.categories.set(response.data)
      },
      error: (error: any) => console.log("ERROR : ", error)
    })
  }

  loadAccounts() : void {
    this.apiWrapper.get('/accounts').subscribe({
      next: (response: any) => {
        console.log("Accounts: ", response);
        this.accounts.set(response.data)
      },
      error: (error: any) => console.log("ERROR : ", error)
    })
  }
}
