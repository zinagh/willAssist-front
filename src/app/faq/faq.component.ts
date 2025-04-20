import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaqServiceService } from '../services/faq-service.service';
import { QuestionDto } from '../models/QuestionDto';
import { ReponseDto } from '../models/ReponseDto';

@Component({
  selector: 'app-Faq',
  templateUrl: './Faq.component.html',
  styleUrls: ['./Faq.component.css']
})
export class FaqComponent implements OnInit{

  constructor(private questionS: FaqServiceService ,  private router: Router) {}
  username: string = '' ;
  debounceTimer: any;
  isSpecificUser: boolean=false;


  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.trim();

    clearTimeout(this.debounceTimer); // ⏳ Clear previous timer

    this.debounceTimer = setTimeout(() => {
      if (searchTerm.length === 0) {
        // If search input is empty, retrieve all questions again
        this.retrieveAllQ();
      } else {
        this.isLoading = true;

        // First, try to search by "createdBy" (user name)
        this.questionS.searchQuestionsByCreatedBy(searchTerm).subscribe({
          next: (createdByResults: QuestionDto[]) => {
            if (createdByResults.length > 0) {
              // Found results by createdBy
              this.questions = createdByResults;
              console.log('Found questions by createdBy:', this.questions);
            } else {
              // If no results by createdBy, fallback to search by question text
              this.questionS.searchQuestions(searchTerm).subscribe({
                next: (questionTextResults: QuestionDto[]) => {
                  this.questions = questionTextResults;
                  console.log('Found questions by questionText:', this.questions);
                },
                error: (error: any) => {
                  console.error('Error while searching by question text:', error);
                }
              });
            }
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error while searching by createdBy:', error);
            this.isLoading = false;
          }
        });
      }
    }, 300); // wait 300ms after typing stops
  }




  ngOnInit(): void {
    this.retrieveAllQ();

  }
questions!: QuestionDto[];
question!: QuestionDto;
isLoading: boolean = false;  // Loading flag




retrieveAllQ(): void {
  console.log('Fetching all questions...');
  this.questionS.retrieveAllQ().subscribe({
    next: (data: QuestionDto[]) => {
      this.questions = data;
      console.log('Questions loaded:', this.questions);
    },
    error: (error: any) => {
      console.error('An error occurred while loading questions:', error);
    }
  });
}

confirmDelete(idQuestion: number | undefined): void {
  // Confirm deletion only if idQuestion is valid
  if (idQuestion === undefined || idQuestion === null) {
    console.error('Invalid question ID');
    return;
  }

  if (confirm('Are you sure you want to delete this question?')) {
    console.log(`Deleting question with ID: ${idQuestion}`);
    this.removeFaq(idQuestion);
  }
}


removeFaq(idQuestion: number): void {
  this.questionS.deleteQuestion(idQuestion).subscribe(
    (response) => {
      console.log('Response after deletion:', response);  // Log the response
      this.retrieveAllQ();  // Reload the questions after deletion
    },
    (error) => {
      console.error('Failed to remove question:', error);
    }
  );
}


}
