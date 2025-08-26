export interface ReadProfessionalDTO {
    id: string
    email: string;
    fullName: string;
    specialty: string;
    role: string;
    active: boolean;
}

export interface CreateProfessionalDTO {
    email: string;
    password: string;
    fullName: string;
    specialty: string;
    role: string;
    active: boolean;
}

export interface UpdateProfessionalDTO {
    email: string;
    fullName: string;
    specialty: string;
    role: string;
    active: boolean;
}