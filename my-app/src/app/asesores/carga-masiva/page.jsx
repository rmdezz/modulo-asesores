'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BulkAdvisorUpload from "@/components/bulk-advisor/BulkAdvisorUpload";

export default function CargaMasiva() {
  const router = useRouter();
  
  // Manejar la cancelación de la carga
  const handleCancel = () => {
    router.push("/asesores");
  };
  
  // Manejar el éxito de la carga
  const handleSuccess = (data) => {
    // Aquí puedes hacer algo con los datos procesados si es necesario
    console.log("Datos procesados:", data);
  };
  
  return (
    <div className="bg-white min-h-screen">
     
      {/* Contenido principal */}
      <div className="pt-4">
        <BulkAdvisorUpload 
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          facultad="Ingeniería"
          especialidad="Informática"
        />
      </div>
    </div>
  );
}