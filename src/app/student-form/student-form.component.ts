import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent {
  @Input() student?: any;
  @Output() onSave = new EventEmitter<any>();
  studentForm: FormGroup;
  genders = ['Male', 'Female'];
  minDob: Date;

  constructor(private fb: FormBuilder, public bsModalRef: BsModalRef) {
    this.minDob = this.calculateMinDob();
    this.studentForm = this.initForm();
  }

  ngOnInit() {
    if (this.student) {
      this.studentForm.patchValue(this.student);
    }
  }

  initForm() {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [1, [Validators.required, Validators.min(1)]],
      dob: [this.minDob, Validators.required],
      gender: ['', Validators.required]
    });
  }

  save() {
    if (this.studentForm.valid) {
      this.onSave.emit(this.studentForm.value);
      this.bsModalRef.hide();
    } else this.studentForm.markAllAsTouched();
  }

  calculateMinDob(): Date {
    const today = new Date();
    return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  }


}
