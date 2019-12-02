export default class BbsNewsModel {
    public type: string;
    public title: string;
    public date: string;
    public author: string;
    public link: string;

    constructor(type: string, title: string, date: string, author: string, link: string) {
        this.type = type;
        this.title = title;
        this.date = date;
        this.author = author;
        this.link = link;
    }
}
