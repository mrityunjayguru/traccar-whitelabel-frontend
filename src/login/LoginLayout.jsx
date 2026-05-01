import { Paper } from "@mui/material";
import LogoImage from "./LogoImage";

const LoginLayout = ({ children }) => {
  return (
    <main className="flex justify-center items-center min-h-screen w-full bg-[#DDE1E8]  p-4 md:p-10">
      <div className="flex flex-col md:flex-row items-stretch w-full max-w-[1300px] gap-6 md:gap-10">
        <div className="relative flex flex-col justify-between items-start w-full md:w-[60%] min-h-[300px] md:min-h-[450px] p-8 md:p-12 bg-[#1A1C1E] rounded-[30px] overflow-hidden shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/src/resources/images/base.svg')" }}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 flex flex-col justify-between h-full w-full">
            <div className="mt-8">
              <div className="flex items-center gap-2">
                <LogoImage color="#E2E8F0" />
              </div>

              <h1 className="text-4xl md:text-7xl font-normal text-[#B5BAD2] leading-tight my-auto">
                Tracking Portal
              </h1>
            </div>
            <div>
              <p className="text-xs text-white/50 mt-8">
                Copyright © 2026 Brillovate | Marketed by DesignDemonz. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        <Paper
          square={false}
          elevation={0}
          className="flex flex-col justify-center items-center w-full md:w-[40%] bg-white dark:bg-[#1A1C1E]! p-8 md:p-12 rounded-[32px] shadow-xl"
          sx={{ borderRadius: '30px !important' }}
        >
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </Paper>
      </div>
    </main>
  );
};

export default LoginLayout;
