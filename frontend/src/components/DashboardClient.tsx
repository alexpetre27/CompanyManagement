// "use client";

// import { Badge } from "@/components/ui/badge";
// import ServiceList from "@/components/ServiceList";
// import { useEffect, useState } from "react";

// type Props = {
//   services: any[];
// };

// export default function DashboardClient({ services }: Props) {
//   const [userRole, setUserRole] = useState<string | null>(null);

//   useEffect(() => {
//     setUserRole(localStorage.getItem("user_role"));
//   }, []);

//   return (
//     <div className="flex flex-col gap-6 p-8">
//       <header className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//             Microservices Fleet
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Connected as:{" "}
//             <span className="font-semibold text-slate-700 capitalize">
//               {userRole || "Guest"}
//             </span>
//           </p>
//         </div>

//         <Badge
//           variant="outline"
//           className={
//             userRole === "ADMIN"
//               ? "bg-amber-50 border-amber-200 text-amber-700"
//               : "bg-green-50 border-green-200 text-green-700"
//           }
//         >
//           {userRole === "ADMIN" ? "Admin Access" : "View Only"}
//         </Badge>
//       </header>

//       <ServiceList services={services} userRole={userRole} />
//     </div>
//   );
// }
