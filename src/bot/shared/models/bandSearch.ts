import { IBand, IBandMember, IDiscography } from "../interfaces/IBand";
export class bandSearch implements IBand{
  startDate: string;
  members: IBandMember[];
  genres: string;
  themes?:string;
  discography: IDiscography;
  about: string;
  status: any;
  name = '';
  link: externalRef;
  label?:string;
}
interface externalRef {
  name: string;
  link: string;
}
