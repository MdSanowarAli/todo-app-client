export class TodoModel {
    id: number;
    date: Date;
    itemName: string;
    description: string;
    
    success: boolean;
    info: boolean;
    warning: boolean;
    message: string;
    valid: boolean;
    obj: any;
}
