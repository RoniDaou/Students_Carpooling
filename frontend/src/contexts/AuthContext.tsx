import {createContext,useContext,useEffect,useState,ReactNode} from "react";
import {User} from "@/types"; import {api} from "@/lib/api";
type RegisterData={universityEmail:string;password:string;confirmPassword:string;first_name:string;last_name:string;universityName:string;campusLocation:string;phoneNumber:string;location:string;role:"driver"|"passenger";vehicleNumber?:string;studentIdPic:File;driverLicensePic?:File};
interface Ctx {user:User|null;isAuthenticated:boolean;isLoading:boolean;userRole:User["role"]|null;login:(e:string,p:string)=>Promise<void>;register:(d:RegisterData)=>Promise<void>;logout:()=>void;updateProfile:(d:Partial<User>&{password?:string})=>Promise<void>;}
const AuthContext=createContext<Ctx|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){const[user,setUser]=useState<User|null>(null);const[isLoading,setLoading]=useState(true);
useEffect(()=>{const t=localStorage.getItem("token");if(!t){setLoading(false);return;}api<{user:User}>("/user/me").then(r=>setUser(r.user)).catch(()=>{localStorage.clear();}).finally(()=>setLoading(false));},[]);
const login=async(e:string,p:string)=>{const r=await api<{token:string;user:User}>("/user/login",{method:"POST",body:JSON.stringify({universityEmail:e,password:p})});localStorage.setItem("token",r.token);setUser(r.user)};
const register=async(d:RegisterData)=>{const f=new FormData();Object.entries(d).forEach(([k,v])=>{if(v!==undefined)f.append(k,v as string|Blob)});const r=await api<{token:string;user:User}>("/user/signup",{method:"POST",body:f});localStorage.setItem("token",r.token);setUser(r.user)};
const logout=()=>{localStorage.removeItem("token");setUser(null)};
const updateProfile=async(d:Partial<User>&{password?:string})=>{const r=await api<{user:User}>("/user/updateInfo",{method:"PATCH",body:JSON.stringify(d)});setUser(r.user)};
return <AuthContext.Provider value={{user,isAuthenticated:!!user,isLoading,userRole:user?.role||null,login,register,logout,updateProfile}}>{children}</AuthContext.Provider>}
export const useAuth=()=>{const c=useContext(AuthContext);if(!c)throw Error("useAuth must be used within AuthProvider");return c};
