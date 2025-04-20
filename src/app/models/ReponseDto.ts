import { QuestionDto } from './QuestionDto';
export interface ReponseDto {
  idReponse?: number;
  responseText: string;
  createdby: string;
  creationDate?: Date;
  question ?: QuestionDto;

}
