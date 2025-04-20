import { ReponseDto } from "./ReponseDto";

export interface QuestionDto {
  idQuestion?: number;
  questionText: string;
  createdby: string;
  creationDate?: Date;
  reponse?: ReponseDto;
}
