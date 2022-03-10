export class Item {
  id: number;
  name: string;
  date: Date;
  dateString: string;

  constructor() {
    this.id = 1;
    this.name = '';
    this.date = new Date();
    this.dateString = '';
  }
}
