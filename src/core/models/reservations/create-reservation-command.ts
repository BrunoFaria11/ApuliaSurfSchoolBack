export interface CreateReservationCommand {
    clientId: string; 
    type: string; 
    time: string; 
    notes?: string; 
    date: Date;
}