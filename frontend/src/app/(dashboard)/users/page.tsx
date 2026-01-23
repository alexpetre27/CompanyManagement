// import { auth } from "@/auth";
// import api from "@/lib/api";
// import {
//   UserPlus,
//   Search,
//   Mail,
//   Shield,
//   MoreVertical,
//   Trash2,
//   UserCheck,
//   Users,
// } from "lucide-react";
// import { redirect } from "next/navigation";
// import { getInitials } from "@/lib/utils";

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: "ADMIN" | "USER";
//   active: boolean;
// }

// export default async function UsersPage() {
//   const session = await auth();

//   if (!session) {
//     redirect("/login");
//   }

//   let users: User[] = [];
//   try {
//     const response = await api.get("/users");
//     users = response.data;
//   } catch (error) {
//     console.error(error);
//   }

//   return (
//     <div className="space-y-8 animate-in fade-in duration-700">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
//             Membri Echipă
//           </h1>
//           <p className="text-slate-500 font-medium">
//             Gestionează utilizatorii și permisiunile de acces.
//           </p>
//         </div>
//         <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
//           <UserPlus size={20} />
//           Adaugă Membru
//         </button>
//       </div>

//       <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
//           <div className="relative flex-1 max-w-md">
//             <Search
//               className="absolute left-4 top-3 text-slate-400"
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="Caută după nume sau email..."
//               className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
//                   Utilizator
//                 </th>
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
//                   Rol
//                 </th>
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
//                   Acțiuni
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="hover:bg-slate-50/80 transition-colors group"
//                   >
//                     <td className="px-6 py-5">
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
//                           {getInitials(user.username)}
//                         </div>
//                         <div>
//                           <p className="font-bold text-slate-900 text-sm">
//                             {user.username}
//                           </p>
//                           <div className="flex items-center gap-1 text-slate-500">
//                             <Mail size={12} />
//                             <p className="text-xs">{user.email}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-5">
//                       <div className="flex items-center gap-2 text-slate-700">
//                         <Shield size={16} className="text-slate-400" />
//                         <span className="text-sm font-medium">{user.role}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-5">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={`w-2 h-2 rounded-full ${user.active ? "bg-emerald-500" : "bg-slate-300"}`}
//                         />
//                         <span className="text-sm font-medium text-slate-600">
//                           {user.active ? "Activ" : "Inactiv"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-5 text-right">
//                       <div className="flex justify-end gap-2">
//                         <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
//                           <UserCheck size={18} />
//                         </button>
//                         <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
//                           <Trash2 size={18} />
//                         </button>
//                         <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
//                           <MoreVertical size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center justify-center text-slate-400">
//                       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
//                         <Users size={32} className="opacity-20" />
//                       </div>
//                       <p className="font-bold text-slate-600">
//                         Niciun utilizator găsit
//                       </p>
//                       <p className="text-sm">
//                         Începe prin a invita colegi în platformă.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
