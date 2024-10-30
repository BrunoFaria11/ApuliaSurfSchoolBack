import { Reservation } from "../reservations/reservation";

export class Pack {
    constructor(Id: string,classesAttended: number, totalClasses: number, type: string,isActive: boolean, reservations: Reservation[],creationDate: string,isPaid: boolean) {
        this.id = Id;
        this.type = type;
        this.classesAttended = classesAttended;
        this.totalClasses = totalClasses;
        this.isActive = isActive;
        this.reservations = reservations;
        this.creationDate = creationDate;
        this.isPaid = isPaid;
    }
    id!: string;
    type!: string;
    classesAttended!: number;
    totalClasses!: number;
    isActive: boolean;
    reservations!: Reservation[];
    creationDate!: string;
    isPaid!: boolean;
}

