import { Spinner } from "@chakra-ui/react";

export default function LoadingScreen({isLoading}: {isLoading: boolean}) {
    if(!isLoading) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <span className="flex flex-col justify-center items-center gap-4">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <h2 className="text-2xl">
      Cargando...
      </h2>
      </span>
    </div>
  );
}
