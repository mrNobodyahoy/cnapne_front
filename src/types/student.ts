// Este tipo reflete o seu ReadStudentDTO
export interface Student {
  id: string;
  completeName: string;
  email: string;
  registration: string;
  team: string;
  birthDate: string; // A data virá como string no JSON
  phone: string;
  gender: string;
  ethnicity: string;
  status: string;
}
export interface CreateStudentDTO {
    email: string;
    password: string;
    completeName: string;
    registration: string;
    team: string;
    birthDate: string;
    phone: string;
    gender: string;
    ethnicity: string;
}