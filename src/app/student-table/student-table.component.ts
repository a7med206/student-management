import { Component } from '@angular/core';
import { Guid } from "guid-typescript";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StudentFormComponent } from '../student-form/student-form.component';


interface Student {
  id?: string;
  name: string;
  email: string;
  age: number;
  dob: Date;
  gender: string;
  selected: boolean;
}

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent {
  students: Student[] = [];
  selectedStudents: Student[] = [];
  modalRef?: BsModalRef;

  constructor(private modalService: BsModalService) { }

  openStudentForm(student?: Student) {
    const initialState = { student };
    this.modalRef = this.modalService.show(StudentFormComponent, { initialState });
    this.modalRef.content.onSave.subscribe((result: Student) => {
      console.log('result', result);
      if (student) {
        // Edit existing student
        const index = this.students.findIndex(s => s.id === student.id);
        if (index !== -1) {
          this.students[index] = result;
        }
      } else {
        // Add new student
        const student = { ...result, id: Guid.create().toString() };
        this.students.push(student);
      }
    });
  }

  deleteSelectedStudents() {
    this.students = this.students.filter(student => !this.selectedStudents.includes(student));
    this.selectedStudents = [];
  }

  onAllCheckBoxesChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedStudents = this.students;
    else this.selectedStudents = [];
  }


  onCheckBoxChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const studentId = (event.target as HTMLInputElement).value;
    const student = this.students.find(s => s.id === studentId);
    if (student && checked) this.selectedStudents.push(student);
    else this.selectedStudents = this.selectedStudents.filter(s => s.id !== studentId);
  }



}
