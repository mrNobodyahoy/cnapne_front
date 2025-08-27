// Este tipo reflete o seu ReadStudentDTO
export interface Student {
  id: string;
  completeName: string;
  email: string;
  registration: string;
  team: string;
  birthDate: string;
  phone: string;
  gender: string;
  ethnicity: string;
  status: string;
  responsibles?: ResponsibleDTO[];
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
  responsibles?: ResponsibleDTO[];
}

export interface UpdateStudentDTO {
  email: string;
  completeName: string;
  registration: string;
  team: string;
  birthDate: string;
  phone: string;
  gender: string;
  ethnicity: string;
}

export interface ResponsibleDTO {
  completeName: string;
  email: string;
  phone: string;
  kinship: string; 
}