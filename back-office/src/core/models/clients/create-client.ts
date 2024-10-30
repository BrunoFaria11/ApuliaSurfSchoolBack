export class CreateClient {
    constructor(
        Name: string,
        Email: string,
        PhoneNumber: string,
        ExperienceLevel: string,
        Notes: string
    ) {
        this.Name = Name;
        this.Email = Email;
        this.PhoneNumber = PhoneNumber;
        this.ExperienceLevel = ExperienceLevel;
        this.Notes = Notes;
    }
    Name!: string | null;
    Email!: string;
    PhoneNumber!: string;
    ExperienceLevel!: string;
    Notes!: string;
}

