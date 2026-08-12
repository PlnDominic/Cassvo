import Image from "next/image";
import backgroundImage from "../../../public/images/auth/background.png";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(55.53deg, rgba(0,0,0,0.8) 14.629%, rgba(0,0,0,0) 50.44%)",
          }}
        />
      </div>

      <div className="relative hidden flex-1 flex-col justify-end p-10 md:flex">
        <p className="max-w-md text-3xl font-medium leading-snug text-white">
          Manage Trust,
          <br />
          Grow Businesses,
          <br />
          Empower communities
        </p>
      </div>

      <div className="relative flex w-full flex-col justify-center border-white/20 bg-black/80 px-6 py-12 backdrop-blur-[3px] sm:px-10 md:w-[520px] md:border-l lg:w-[590px]">
        {children}
      </div>
    </div>
  );
}
