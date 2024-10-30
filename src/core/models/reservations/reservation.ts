export class Reservation {

    constructor(idReservation: string, idClient: string, date: string, type: string, hour: string, Comment: string, IsValidated: boolean,
        completed: boolean, IdPack: string, IsPaid: boolean,
        clientName: string, clientPhoneNumber: string,IsCanceled: boolean,
    ) {
        this.idReservation = idReservation
        this.idClient = idClient;
        this.idPack = IdPack;
        this.date = date;
        this.type = type;
        this.hour = hour;
        this.comment = Comment;
        this.IsValidated = IsValidated;
        this.completed = completed;
        this.IsPaid = IsPaid;
        this.clientName = clientName;
        this.clientPhoneNumber = clientPhoneNumber;
        this.IsCanceled = IsCanceled;

    }
    idReservation!: string;
    idClient!: string;
    date!: string;
    type!: string;
    hour!: string;
    comment!: string;
    IsValidated: boolean;
    IsPaid: boolean;
    IsCanceled: boolean;
    completed: boolean;
    idPack!: string;
    clientName!: string;
    clientPhoneNumber!: string;
}

