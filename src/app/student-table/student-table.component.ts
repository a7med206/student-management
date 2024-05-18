import { Component } from '@angular/core';
import { Guid } from "guid-typescript";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
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
  isAllSelected = new BehaviorSubject<boolean>(false);

  constructor(private modalService: BsModalService) { }

  openStudentForm(student?: Student) {
    const initialState = { student };
    this.modalRef = this.modalService.show(StudentFormComponent, { initialState });
    this.modalRef.content.onSave.subscribe((result: Student) => {
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
    const selectedStudentsIds = this.selectedStudents.map(s => s.id);
    this.students = this.students.filter(student => !selectedStudentsIds.includes(student.id));
    this.selectedStudents = [];
    this.isAllSelected.next(false);
  }

  onAllCheckBoxesChange(event: Event) {

    const checked = (event.target as HTMLInputElement).checked;
    this.isAllSelected.next(checked);
    if (checked) {
      this.selectedStudents = this.students;
      this.students = this.students.map(s => ({ ...s, selected: true }));
    } else {
      this.selectedStudents = [];
      this.students = this.students.map(s => ({ ...s, selected: false }));
    }
  }


  onCheckBoxChange(checked: boolean, student: Student) {
    if (checked) this.selectedStudents.push(student);
    else this.selectedStudents = this.selectedStudents.filter(s => s.id !== student.id);
  }



}
