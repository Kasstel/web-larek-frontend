import { IProduct } from "../types";
import { Model } from "./base/Model";



export interface IAppState{
  catalog: IProduct[],
  preview: string| null
}


export class AppState extends Model<IAppState>{
  catalog: IProduct[]
}


