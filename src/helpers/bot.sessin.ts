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


  data: {name?: string, price?: number, description?: string, image?: string} | null
}

export interface IMyContext extends Context {
  session: ISessin;
}


export interface CerateInterface {
  name?: string
  price?: number
  description?: string
  image?:string
}
