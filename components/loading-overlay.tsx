import Image from "next/image";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Image src="/desk-lamp.gif" alt="logo" width={80} height={80} className="mx-auto"/>
        <p className="mt-4 text-muted-foreground text-md font-semibold animate-pulse">Loading...</p>
      </div>
    </div>
  );
}