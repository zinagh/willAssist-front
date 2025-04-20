// add-question.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FaqServiceService } from '../services/faq-service.service';
import { QuestionDto } from '../models/QuestionDto';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  questionForm!: FormGroup;
  private currentUser: string | undefined;

  constructor(
    private fb: FormBuilder,
    private faqService: FaqServiceService,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
    });

    this.keycloakService.loadUserProfile().then(profile => {
      this.currentUser = profile.username;
      console.log('Authenticated user:', this.currentUser);
    }).catch(error => {
      console.error('Error loading user profile:', error);
    });
  }

  navigateToFaq() {
    this.router.navigate(['/Faq']);
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const formValues = this.questionForm.value;

      const question: QuestionDto = {
        questionText: formValues.questionText,
        createdby: this.currentUser || 'anonymous',
        creationDate: new Date(),
      };

      console.log('Form is valid. Sending question data:', JSON.stringify(question));

      this.faqService.addQ(question).subscribe(
        (response: QuestionDto) => {
          console.log('Question successfully added:', response);
          // Navigate to AddResponseComponent with the question ID
          this.router.navigate(['/addReponse', response.idQuestion]);
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            console.error('HTTP error status:', error.status);
            console.error('HTTP error message:', error.message);
            console.error('Error details:', error.error);
          } else {
            console.error('An unknown error occurred:', error);
          }
        }
      );
    } else {
      console.log('Form is invalid, marking fields as touched...');
      this.markFormTouched();
    }
  }

  markFormTouched(): void {
    Object.values(this.questionForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
