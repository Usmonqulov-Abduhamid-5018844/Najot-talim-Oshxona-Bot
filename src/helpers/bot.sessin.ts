import { Context } from "telegraf";

export interface ISessin {
  price: string | null;
  name: string | null;
  description: string | null;
  image: string | null
  id: string | null

  osh:string | null
  bishtex: string | null
  xonim: string | null
  lagmon: string |null
  jarkop: string |null
  kfc: string | null
  somsa: string |null
  stepAdmin?: string
  stepUser?: string
  menuName?: string | null;


  data: {name?: string | null, price?: number | null, description?: string | null, image?: string | null} | null
}

export interface IMyContext extends Context {
  session: ISessin;
  match: RegExpExecArray | string[];
}


export interface CerateInterface {
  name?: string
  price?: number
  description?: string
  image?:string
}
