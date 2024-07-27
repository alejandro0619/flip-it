import { useState } from "react";

export default function RightPanel() {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlipClick = () => {
    console.log('dasdaddd')
    setIsFlipped(!isFlipped);
  };
  return (
    <section className="hidden lg:flex w-1/2 h-full bg-gradient-to-r from-[#D8B4E2] to-[#BC96E6]   items-center justify-center pt-20 relative overflow-hidden">
      {/* Flashcards flotantes */}
      <div className="absolute top-10 left-10 w-[150px] h-[100px] perspective animate-float">
        <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
          <div className="absolute w-full h-full backface-hidden bg-[#AE759F] rounded-xl shadow-lg flex items-center justify-center text-white">
            <h1 className="text-6xl font-bold">⚕️</h1>
          </div>
        </div>
      </div>
      <div className="absolute top-20 right-1/4 w-[150px] h-[100px] perspective animate-float">
        <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
          <div className="absolute w-full h-full backface-hidden bg-[#D8B4E2] rounded-xl shadow-lg flex items-center justify-center text-white">
            <h1 className="text-6xl font-bold">🎒</h1>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/4 w-[150px] h-[100px] perspective animate-float">
        <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
          <div className="absolute w-full h-full backface-hidden bg-[#BC96E6] rounded-xl shadow-lg flex items-center justify-center text-white">
            <h1 className="text-6xl font-bold">💻</h1>
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 right-1/4 w-[150px] h-[100px] perspective animate-float">
        <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
          <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg flex items-center justify-center text-white">
            <h1 className="text-6xl font-bold">📚</h1>
          </div>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="relative w-[500px] h-[400px] perspective">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white border border-[#210B2C] rounded-xl shadow-lg">
            <h1
              className="text-5xl font-bold text-gradient cursor-pointer "
              onClick={(e) => handleFlipClick()}
            >
              Voltea
            </h1>
          </div>
          <div className="absolute w-full h-full rotate-y-180 backface-hidden flex items-center justify-center bg-[#BC96E6] rounded-xl border border-[#210B2C]">
            <h1
              className="text-5xl text-white font-bold cursor-pointer"
              onClick={(e) => handleFlipClick()}
            >
              Y conquista
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
