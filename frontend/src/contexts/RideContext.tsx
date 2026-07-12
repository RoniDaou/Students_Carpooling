import {createContext,useContext,useState,ReactNode} from "react";import {Ride,RideRequest} from "@/types";import {api} from "@/lib/api";
interface Ctx{rides:Ride[];loading:boolean;loadRides:()=>Promise<void>;getRide:(id:string)=>Promise<Ride>;addRide:(d:Partial<Ride>)=>Promise<Ride>;deleteRide:(id:string)=>Promise<void>;requestRide:(id:string)=>Promise<void>;myRequests:()=>Promise<RideRequest[]>}
const RideContext=createContext<Ctx|undefined>(undefined);
export function RideProvider({children}:{children:ReactNode}){const[rides,setRides]=useState<Ride[]>([]);const[loading,setLoading]=useState(false);
const loadRides=async()=>{setLoading(true);try{setRides(await api<Ride[]>("/rides"))}finally{setLoading(false)}};
const getRide=(id:string)=>api<Ride>(`/rides/${id}`);const addRide=async(d:Partial<Ride>)=>{const r=await api<Ride>("/rides",{method:"POST",body:JSON.stringify(d)});setRides(x=>[r,...x]);return r};
const deleteRide=async(id:string)=>{await api(`/rides/${id}`,{method:"DELETE"});setRides(x=>x.filter(r=>r._id!==id))};const requestRide=async(id:string)=>{await api("/rides/request",{method:"POST",body:JSON.stringify({rideId:id})})};const myRequests=()=>api<RideRequest[]>("/rides/requests/mine");
return <RideContext.Provider value={{rides,loading,loadRides,getRide,addRide,deleteRide,requestRide,myRequests}}>{children}</RideContext.Provider>}
export const useRides=()=>{const c=useContext(RideContext);if(!c)throw Error("useRides must be used within RideProvider");return c};
