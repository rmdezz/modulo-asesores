
// 3. Función para eliminar un archivo adjunto
const eliminarArchivo = (id) => {
    setArchivosAdjuntos(archivosAdjuntos.filter(archivo => archivo.id !== id));
  };
  
  
const ArchivoAdjunto = ({ archivo, mostrarEliminar = false }) => (
    <div className="flex items-center justify-between p-2 bg-gray-50 border rounded-md mb-2">
      <div className="flex items-center">
        <FileText className="h-4 w-4 mr-2 text-blue-500" />
        <div>
          <p className="text-sm font-medium">{archivo.nombre}</p>
          <p className="text-xs text-gray-500">
            {(archivo.tamaño / 1024).toFixed(2)} KB • {format(new Date(archivo.fecha), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
      </div>
      {mostrarEliminar && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500"
          onClick={() => eliminarArchivo(archivo.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );