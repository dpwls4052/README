import FindPWForm from "@/components/auth/FindPWForm";
import Image from "next/image";
import logo from "@/assets/logo.png";


export default function FindPWPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FEFAE0]">
            <Image
              src={logo}
              alt="README Logo"
              width={200}
              height={200}
              className="mb-8 object-contain py-25"
            />
      <FindPWForm />
    </div>
  );
}
