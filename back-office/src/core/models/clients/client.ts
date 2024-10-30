export class Client {
    constructor(
        Id: string,
        Name: string,
        Email: string,
        PhoneNumber: string,
        ActivePacks: string,
        NewLessons: string,
        TotalPacks: string,
        TotalLessons: string,
        Level: string,
        LevelColor: string,
        Notes: string
    ) {
        this.Id = Id;
        this.Name = Name;
        this.Email = Email;
        this.PhoneNumber = PhoneNumber;
        this.ActivePacks =ActivePacks,
        this.NewLessons = NewLessons,
        this.TotalPacks = TotalPacks,
        this.TotalLessons = TotalLessons,
        this.Level = Level
        this.LevelColor = LevelColor,
        this.Notes = Notes
    }
    Id!: string;
    Name!: string | null;
    Email!: string;
    PhoneNumber!: string;
    ActivePacks!: string;
    NewLessons!: string;
    TotalPacks!: string;
    TotalLessons!: string;
    Level!: string;
    LevelColor!: string;
    Notes!: string;
}

