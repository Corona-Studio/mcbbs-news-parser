export default class BbsNewsModel {
    public type: string;
    public title: string;
    public date: string;
    public author: string;

    constructor(type: string, title: string, date: string, author: string) {
        this.type = type;
        this.title = title;
        this.date = date;
        this.author = author;
    }
}
