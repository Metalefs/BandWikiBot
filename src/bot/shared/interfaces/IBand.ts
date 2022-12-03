export interface IBand {
  name: string;
  startDate: string;
  members: IBandMember[];
  genres: string;
  themes?:string;
  discography: IDiscography;
  about: string;
  status: any;
  label?:string;
}

export interface IBandMember {
  name: string;
  role?:string;
  socials: [];
  wiki: any;
  age: string
  placeOfBirth: string
}

export interface IDiscography {
  albums: IAlbum[];
}

export interface IAlbum {
  name: string;
  date?: string;
  songs: ISong[] | any;
  link: string;
}

export interface ISong {
  duration: string;
  name: string;
  link?: string;
  lyrics?: string;
}
