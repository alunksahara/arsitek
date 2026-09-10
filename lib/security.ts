import { NextResponse } from "next/server";
export function jsonError(message:string,status=400){return NextResponse.json({error:message},{status,headers:{"Cache-Control":"no-store"}})}
export function normalizePhone(v:string){return v.replace(/[^0-9+]/g,"").trim()}
export function whatsappUrl(phone:string){const digits=normalizePhone(phone).replace(/^\+/,""); return `https://wa.me/${digits}`}
