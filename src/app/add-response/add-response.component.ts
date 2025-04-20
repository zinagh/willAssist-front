import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqServiceService } from '../services/faq-service.service';
import { ReponseDto } from '../models/ReponseDto';
import { QuestionDto } from '../models/QuestionDto'; // ✅ import QuestionDto
import { HttpErrorResponse } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.css']
})
export class AddResponseComponent implements OnInit {
  responseForm!: FormGroup;
  questionId!: number;
  private currentUser: string | undefined;

  question?: QuestionDto; // ✅ store the loaded question

  constructor(
    private fb: FormBuilder,
    private faqService: FaqServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    // Get questionId from route parameters
    this.questionId = +this.route.snapshot.paramMap.get('questionId')!;

    // Initialize the form
    this.responseForm = this.fb.group({
      responseText: ['', Validators.required],
    });

    // Load the question using the ID
    this.faqService.getQuestion(this.questionId).subscribe({
      next: (data) => {
        this.question = data;
        console.log('Loaded question:', this.question);
      },
      error: (err) => {
        console.error('Failed to load question:', err);
      }
    });

    // Get the authenticated user's details
    this.keycloakService.loadUserProfile().then(profile => {
      this.currentUser = profile.username;
      console.log('Authenticated user:', this.currentUser);
    }).catch(error => {
      console.error('Error loading user profile:', error);
    });
  }

  onSubmit(): void {
    if (this.responseForm.valid) {
      const formValues = this.responseForm.value;

      const response: ReponseDto = {
        responseText: formValues.responseText,
        createdby: this.currentUser || 'anonymous',
        creationDate: new Date(),
      };

      console.log('Form is valid. Sending response data:', JSON.stringify(response));

      this.faqService.addResponse(this.questionId, response).subscribe(
        response => {
          console.log('Response successfully added:', response);
          this.router.navigate(['/Faq']);
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
    Object.values(this.responseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  navigateToFaq() {
    this.router.navigate(['/Faq']);
  }
}
