'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation'; // Use hooks for client components
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  GraduationCap, 
  Save, 
  AlertTriangle,
  Loader2, // For loading state
  CheckCircle, // For success
  UserCheck,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdvisorSelectionModal from '@/components/AdvisorSelectionModal';

// --- Mock Data Fetching Functions ---
// In a real app, these would be API calls

// Simulate fetching advisor details
const fetchAdvisorDetails = async (advisorId) => {
  console.log("Fetching details for advisor:", advisorId);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Find the advisor from a simulated list (or return a default if not found)
  const mockAdvisors = [
      { id: "1", nombres: "Carlos Alberto", apellidoPaterno: "Ramírez", codigo: "20201234", estado: "Activo", tesisActivasCount: 2 },
      { id: "2", nombres: "Ana María", apellidoPaterno: "Torres", codigo: "20175678", estado: "Activo", tesisActivasCount: 0 },
      // ... other advisors
  ];
  const advisor = mockAdvisors.find(a => a.id === advisorId);
  if (!advisor) {
      throw new Error("Advisor not found");
  }
  // Ensure we only try to reassign from an advisor who *would* have active theses
  if (advisor.tesisActivasCount === 0 && advisorId === "1") {
      // Simulate finding theses for advisor 1 even if count is 0 in main list for demo
      console.warn("Mock data inconsistency: Advisor 1 showing 0 theses in list but fetching some for reassignment demo.");
  } else if (advisor.tesisActivasCount === 0) {
     console.log(`Advisor ${advisorId} has no active theses according to mock list.`);
     // Return advisor but fetchAdvisorActiveTheses should return empty later
  }
  return advisor;
};

// Simulate fetching active theses for a specific advisor
const fetchAdvisorActiveTheses = async (advisorId) => {
  console.log("Fetching active theses for advisor:", advisorId);
  await new Promise(resolve => setTimeout(resolve, 600));
  // Simulate a list of theses, only return those matching the advisorId
  const allMockTheses = [
    { 
      id: "T001", 
      titulo: "Sistema de Recomendación Basado en IA", 
      alumnoNombres: "Juan", 
      alumnoApellidos: "Pérez", 
      estadoTesis: "En Curso", 
      currentAdvisorId: "1",
      areaTematica: "Ciencias de la Computación" // Área temática actualizada
    },
    { 
      id: "T002", 
      titulo: "Optimización de Rutas Logísticas con Algoritmos Genéticos", 
      alumnoNombres: "Maria", 
      alumnoApellidos: "González", 
      estadoTesis: "Propuesta Aprobada", 
      currentAdvisorId: "1",
      areaTematica: "Ciencias de la Computación" // Área temática actualizada
    },
    { 
      id: "T003", 
      titulo: "Plataforma de E-learning Adaptativa", 
      alumnoNombres: "Luis", 
      alumnoApellidos: "Martínez", 
      estadoTesis: "En Curso", 
      currentAdvisorId: "4",
      areaTematica: "Tecnologías de Información" // Área temática actualizada
    },
    // Add more mock theses if needed
  ];
  return allMockTheses.filter(thesis => thesis.currentAdvisorId === advisorId && (thesis.estadoTesis === "En Curso" || thesis.estadoTesis === "Propuesta Aprobada")); // Filter only active states
};

// Simulate fetching eligible (active) advisors to reassign to
const fetchEligibleAdvisors = async (advisorIdToExclude) => {
  console.log("Fetching eligible advisors, excluding:", advisorIdToExclude);
  await new Promise(resolve => setTimeout(resolve, 400));
  // Add areaTematica and tesisActivasCount to all advisors here
  const mockAdvisors = [
      { id: "1", nombres: "Carlos Alberto", apellidoPaterno: "Ramírez", estado: "Activo", areaTematica: "Ciencias de la Computación", tesisActivasCount: 2 },
      { id: "2", nombres: "Ana María", apellidoPaterno: "Torres", estado: "Activo", areaTematica: "Ingeniería de Software", tesisActivasCount: 0 },
      { id: "3", nombres: "Jorge Luis", apellidoPaterno: "Mendoza", estado: "Inactivo", areaTematica: "Sistemas de Información", tesisActivasCount: 0 }, // Will be filtered out by status
      { id: "4", nombres: "Patricia", apellidoPaterno: "Sánchez", estado: "Activo", areaTematica: "Tecnologías de Información", tesisActivasCount: 1 },
      { id: "5", nombres: "Roberto", apellidoPaterno: "Díaz", estado: "Activo", areaTematica: "Sistemas de Información", tesisActivasCount: 3 },
      { id: "6", nombres: "Luisa", apellidoPaterno: "Fernández", estado: "Activo", areaTematica: "Ciencias de la Computación", tesisActivasCount: 1 }, // Otro asesor de Ciencias de la Computación
      { id: "7", nombres: "Miguel", apellidoPaterno: "Gómez", estado: "Activo", areaTematica: "Ingeniería de Software", tesisActivasCount: 4 },
  ];
  return mockAdvisors.filter(a => a.id !== advisorIdToExclude && a.estado === "Activo");
};

// --- Component ---

export default function ReasignarTesis() {
  const router = useRouter();
  const params = useParams(); // Get advisorId from URL
  const advisorId = params?.advisorId;

  const [advisor, setAdvisor] = useState(null);
  const [theses, setTheses] = useState([]);
  const [eligibleAdvisors, setEligibleAdvisors] = useState([]);
  const [reassignments, setReassignments] = useState({}); // { thesisId: newAdvisorId }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- STATE FOR MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thesisToReassign, setThesisToReassign] = useState(null); // Store the whole thesis object

  useEffect(() => {
    if (!advisorId) {
      setError("ID de asesor no encontrado en la URL.");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setSaveSuccess(false); // Reset success state on load
      try {
        // Fetch all data in parallel
        const [advisorData, thesesData, eligibleAdvisorsData] = await Promise.all([
          fetchAdvisorDetails(advisorId),
          fetchAdvisorActiveTheses(advisorId),
          fetchEligibleAdvisors(advisorId)
        ]);

        setAdvisor(advisorData);
        setTheses(thesesData);
        setEligibleAdvisors(eligibleAdvisorsData);

        // Initialize reassignments state
        const initialReassignments = {};
        thesesData.forEach(thesis => {
          initialReassignments[thesis.id] = null; // Start with no selection
        });
        setReassignments(initialReassignments);

      } catch (err) {
        console.error("Error loading reassignment data:", err);
        setError(err.message || "Error al cargar los datos necesarios.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [advisorId]); // Reload if advisorId changes

  // --- MODAL HANDLING FUNCTIONS ---
  const handleOpenModal = (thesis) => {
    setThesisToReassign(thesis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setThesisToReassign(null); // Clear context when closing
  };

  const handleAdvisorSelected = (thesisId, selectedAdvisor) => {
     console.log(`Advisor ${selectedAdvisor.id} (${selectedAdvisor.nombres}) selected for Thesis ${thesisId}`);
    setReassignments(prev => ({
      ...prev,
      [thesisId]: selectedAdvisor.id // Store the selected advisor's ID
    }));
    setSaveSuccess(false); // Reset success if changes are made after saving
    // handleCloseModal(); // Modal closes itself via onAdvisorSelected -> onClose
  };
  // --- END MODAL HANDLING ---

  const getSelectedAdvisorName = (thesisId) => {
        const selectedId = reassignments[thesisId];
        if (!selectedId) return null;
        const advisor = eligibleAdvisors.find(a => a.id === selectedId);
        return advisor ? `${advisor.nombres} ${advisor.apellidoPaterno}` : "Desconocido";
    }


  const handleReassignmentChange = (thesisId, newAdvisorId) => {
    setReassignments(prev => ({
      ...prev,
      [thesisId]: newAdvisorId || null // Store null if "Seleccionar" is chosen back
    }));
    setSaveSuccess(false); // Reset success if changes are made after saving
  };

  const canSaveChanges = () => {
    if (theses.length === 0) return false; // No theses to reassign
    // Check if every thesis has a non-null advisor assigned
    return Object.values(reassignments).every(newAdvisorId => newAdvisorId !== null);
  };

  const handleSaveChanges = async () => {
    if (!canSaveChanges()) {
        alert("Por favor, seleccione un nuevo asesor para todas las tesis listadas.");
        return;
    }
    
    setIsSaving(true);
    setError(null); // Clear previous errors
    setSaveSuccess(false);

    console.log("Saving reassignments:", reassignments);
    
    // --- Simulate API Call to Save ---
    try {
      // In a real app, you'd loop through 'reassignments' and make API calls
      // to update each thesis record with the new advisor ID.
      // Example:
      // await Promise.all(Object.entries(reassignments).map(([thesisId, newAdvisorId]) => 
      //   api.updateThesisAdvisor(thesisId, newAdvisorId)
      // ));
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // --- Handle Success ---
      console.log("Reasignaciones guardadas exitosamente.");
      setSaveSuccess(true);
      
      // Optional: Redirect back after a short delay
      setTimeout(() => {
        router.push('/asesores'); // Redirect to the main advisors list
      }, 2000); 

    } catch (err) {
      console.error("Error saving reassignments:", err);
      setError("Ocurrió un error al guardar las reasignaciones. Inténtelo de nuevo.");
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
    // --- End Simulation ---
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#003A70]" />
        <span className="ml-2 text-lg">Cargando datos...</span>
      </div>
    );
  }

  if (error && !advisor) { // Show fatal error if advisor couldn't load
    return (
      <div className="container mx-auto p-6">
         <Button variant="outline" size="sm" onClick={() => router.push('/asesores')} className="mb-4">
           <ArrowLeft className="h-4 w-4 mr-1" /> Volver a Asesores
         </Button>
         <Alert variant="destructive">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header and Back Button */}
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => router.push('/asesores')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver a Asesores
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Reasignar Tesis</h1>
        </div>

        {/* Advisor Info and Instructions */}
        {advisor && (
          <Card className="mb-6 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Asesor a Reasignar: {advisor.nombres} {advisor.apellidoPaterno}
              </CardTitle>
              <CardDescription>Código: {advisor.codigo}</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                <AlertTriangle className="h-4 w-4 !text-amber-600" />
                <AlertTitle>Acción Requerida</AlertTitle>
                <AlertDescription>
                  Este asesor tiene tesis activas. Para poder marcarlo como 'Inactivo', debe reasignar cada una de las siguientes tesis a otro asesor activo.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Error display (non-fatal errors) */}
        {error && !saveSuccess && (
             <Alert variant="destructive" className="mb-4">
               <AlertTriangle className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
        )}
        
        {/* Success Message */}
        {saveSuccess && (
             <Alert variant="default" className="mb-4 bg-green-50 border-green-200 text-green-800">
               <CheckCircle className="h-4 w-4 !text-green-600" />
               <AlertTitle>Éxito</AlertTitle>
               <AlertDescription>
                 Las reasignaciones se han guardado correctamente. Redirigiendo a la lista de asesores...
               </AlertDescription>
             </Alert>
        )}

        {/* Theses Reassignment Table */}
        <Card className="bg-white shadow-sm">
            <CardHeader>
                <CardTitle className="text-md">Tesis Activas Asignadas</CardTitle>
            </CardHeader>
            <CardContent>
                {theses.length > 0 ? (
                    <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold w-[40%]">Título de Tesis</TableHead>
                            <TableHead className="font-semibold">Alumno</TableHead>
                            <TableHead className="font-semibold w-[35%]">Nuevo Asesor Asignado</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {theses.map((thesis) => {
                            const selectedName = getSelectedAdvisorName(thesis.id);
                            return (
                                <TableRow key={thesis.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium align-top">
                                    {/* ... (Thesis title and badge) ... */}
                                    <div className="flex items-center">
                                        <GraduationCap className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                        <span>{thesis.titulo}</span>
                                    </div>
                                    <Badge variant="outline" className="mt-1 text-xs font-normal bg-white">{thesis.estadoTesis}</Badge>
                                    <Badge variant="secondary" className="mt-1 ml-1 text-xs font-normal">{thesis.areaTematica}</Badge>
                                </TableCell>
                                <TableCell className="align-top text-sm">
                                    {thesis.alumnoNombres} {thesis.alumnoApellidos}
                                </TableCell>
                                <TableCell className="align-top">
                                    {/* --- Display selected advisor or button to select --- */}
                                    {selectedName ? (
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm flex items-center gap-1">
                                                <UserCheck className="h-4 w-4 text-green-600 flex-shrink-0" /> 
                                                {selectedName}
                                            </span>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="px-2 h-7"
                                                onClick={() => handleOpenModal(thesis)} // Allow changing
                                                disabled={isSaving || saveSuccess}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            variant="outline" 
                                            className="w-full justify-start text-muted-foreground"
                                            onClick={() => handleOpenModal(thesis)}
                                            disabled={isSaving || saveSuccess}
                                        >
                                            <Users className="h-4 w-4 mr-2" />
                                            Seleccionar asesor...
                                        </Button>
                                    )}
                                </TableCell>
                                </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                    </div>
                ) : (
                   /* ... No theses message ... */
                   <div className="text-center py-10 text-gray-500">
                        No se encontraron tesis activas para reasignar para este asesor.
                        <br /> Puede volver a la lista de asesores.
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Action Buttons */}
        {theses.length > 0 && (
            <div className="mt-6 flex justify-end gap-3">
            <Button 
                variant="outline" 
                onClick={() => router.push('/asesores')}
                disabled={isSaving} // Disable while saving
            >
                Cancelar
            </Button>
            <Button
                onClick={handleSaveChanges}
                disabled={!canSaveChanges() || isSaving || saveSuccess} // Disable if not ready, saving, or already succeeded
            >
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : saveSuccess ? (
                    <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                         Guardado
                    </>
                ) : (
                     <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                     </>
                )}
            </Button>
            </div>
        )}

        {/* --- RENDER THE MODAL --- */}
        <AdvisorSelectionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAdvisorSelected={handleAdvisorSelected}
            thesis={thesisToReassign} // Pass the specific thesis object
            eligibleAdvisors={eligibleAdvisors} // Pass the full list
        />
         {/* --- END MODAL RENDER --- */}
      </div>
    </div>
  );
}