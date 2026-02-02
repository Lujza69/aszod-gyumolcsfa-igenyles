
import RequestForm from "@/components/RequestForm";

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-slate-50">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-green-600 to-emerald-800 text-white -skew-y-3 origin-top-left transform scale-110" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

            <div className="relative container mx-auto px-4 py-16 sm:py-24">

                {/* Header */}
                <div className="text-center mb-16 text-white space-y-4">
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 mb-2">
                        🌱 Aszód Zöldül 2024
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold font-outfit tracking-tight text-shadow-sm">
                        Gyümölcsfa és<br /> virághagyma igénylés
                    </h1>
                    <p className="text-lg sm:text-xl text-green-50 max-w-2xl mx-auto font-light leading-relaxed">
                        Igényeljen ingyenesen facsemetét és virághagymát Aszód Város Önkormányzatától.
                        Tegye zöldebbé otthonát és környezetét!
                    </p>
                </div>

                {/* Form Container */}
                <div className="relative z-10">
                    <RequestForm />
                </div>

                {/* Footer */}
                <footer className="mt-20 text-center text-slate-500 text-sm">
                    <p>© 2024 Aszód Város Önkormányzata. Minden jog fenntartva.</p>
                    <p className="mt-2">A program a "Zöld Aszódért" kezdeményezés része.</p>
                </footer>

            </div>
        </main>
    );
}
