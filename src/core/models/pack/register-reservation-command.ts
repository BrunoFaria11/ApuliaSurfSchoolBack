export interface RegisterReservationCommand {
    packId: string; 
    type: string; 
    time: string; 
    notes?: string; 
    date: Date;
}