export class Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

export class Customer {
  /* firstName: string;
  lastName: string;
  email: string;
  password: string;
  myCategories: Array<string>;
 */
  constructor(
    public _id: string = null,
    private _firstName: string,
    private _lastName: string,
    private _email: string,
    private _password: string,
    public myCategories: Array<string>,
    ) { }

    get email(): string {
      return this._email;
    }

    get firstName(): string {
      return this._firstName;
    }

    get lastName(): string {
      return this._lastName;
    }
}


export class Publication {
  constructor(
    private _title: string,
    private _description: string,
    private _fecPublic: Date,
    private _fecIni: Date,
    private _fecFin: Date,
    private _image: Buffer,
    private _categories: Array<string>
    ) { }

    get title(): string {
      return this._title;
    }

    get description(): string {
      return this._description;
    }

    get fecPublic(): Date {
      return this._fecPublic;
    }

    get fecIni(): Date {
      return this._fecIni;
    }

    get fecFin(): Date {
      return this._fecFin;
    }

    get image(): Buffer {
      return this._image;
    }

    get categories(): Array<string> {
      return this._categories;
    }
}
