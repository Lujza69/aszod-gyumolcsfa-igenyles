
import React from 'react';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-green-700 px-6 py-8 sm:px-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white font-outfit">
                        ADATKEZELÉSI TÁJÉKOZTATÓ
                    </h1>
                    <p className="text-green-100 mt-2 text-lg">
                        Gyümölcsfa és virághagyma igénylési program – Aszód
                    </p>
                </div>

                <div className="px-6 py-10 sm:px-10 space-y-8 text-slate-700 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">1. Az Adatkezelő adatai</h2>
                        <ul className="space-y-1 list-disc list-inside">
                            <li><strong>Adatkezelő megnevezése:</strong> Aszód Város Önkormányzata</li>
                            <li><strong>Székhely:</strong> 2170 Aszód Szabadság tér 9.</li>
                            <li><strong>Adószám:</strong> 15730435213</li>
                            <li><strong>E-mail:</strong> aszod.titkarsag@aszod.hu</li>
                            <li><strong>Telefonszám:</strong> 06 28 500 666</li>
                            <li className="mt-2 pt-2 border-t border-slate-100">
                                <strong>Adatkezelési ügyekben illetékes:</strong><br />
                                dr. Árva Zsuzsanna<br />
                                <span className="text-slate-600">Elérhetősége:</span> +36 20 363 7567<br />
                                <a href="mailto:arvazsuzsi@diamond-congress.hu" className="text-green-600 hover:underline">arvazsuzsi@diamond-congress.hu</a>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">2. Az adatkezelés célja</h2>
                        <p className="mb-2">Az adatkezelés célja az ingyenes lakossági gyümölcsfacsemete- és virághagyma-osztási program lebonyolítása, ezen belül:</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Az igénylések regisztrálása és a készletnyilvántartás (pl. hány darab barack-, szilva- vagy körtefa maradt).</li>
                            <li>A jogosultság ellenőrzése (lakcímenkénti 1 darabos korlát betartatása aszódi lakosok számára).</li>
                            <li>Az igénylőkkel való közvetlen kapcsolattartás az átvétel időpontjáról és helyszínéről.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">3. A kezelt adatok köre</h2>
                        <p className="mb-2">Az űrlap kitöltése során az alábbi személyes adatokat gyűjtjük:</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            <li><strong>Teljes név:</strong> Az igénylő azonosításához.</li>
                            <li><strong>Telefonszám:</strong> Operatív kapcsolattartáshoz az átvétel szervezése érdekében.</li>
                            <li><strong>Aszódi lakcím:</strong> A programban való részvétel feltételének (lakóhelyi kötöttség és lakcímenkénti korlát) ellenőrzéséhez.</li>
                            <li><strong>Igényelt termékek adatai:</strong> Választott fafajta és a virághagyma csomagra vonatkozó igény ténye.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">4. Az adatkezelés jogalapja</h2>
                        <p>
                            Az adatkezelés az igényelt fák teljesítéséhez kapcsolódó jogviszonyon alapul [GDPR 6. cikk (1) bekezdés b) pont].
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">5. Az adatkezelés időtartama</h2>
                        <p>
                            Az adatokat a program lezárásáig, de legkésőbb a facsemeték és virághagymák kiosztását követő elszámolási időszak végéig (maximum az adott naptári év dec. 31-ig) kezeljük, ezt követően az adatok törlésre kerülnek, kivéve, ha jogszabály (pl. számviteli kötelezettség) hosszabb megőrzést ír elő.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">6. Adattovábbítás és Adatfeldolgozás</h2>
                        <p>
                            Az adatok nem kerülnek továbbításra harmadik fél részére, kivéve a technikai üzemeltetést végző adatfeldolgozót (pl. a weboldalt hosztoló Vercel platform). Az adatokhoz csak a program lebonyolításáért felelős ügyintézők férhetnek hozzá.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">7. Az Ön jogai</h2>
                        <p className="mb-2">Ön bármikor kérheti:</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Tájékoztatást adatai kezeléséről.</li>
                            <li>Adatai helyesbítését, ha azok pontatlanok.</li>
                            <li>Adatai törlését (ez esetben az igénylése visszavonásra kerül).</li>
                            <li>Az adatkezelés korlátozását.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">8. Jogorvoslat</h2>
                        <p>
                            Amennyiben panasza van, kérjük, forduljon hozzánk a fenti elérhetőségeken. Jogainak megsértése esetén a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (1055 Budapest, Falk Miksa utca 9-11., <a href="https://www.naih.hu" target="_blank" className="text-green-600 underline">www.naih.hu</a>) fordulhat, vagy bírósági eljárást kezdeményezhet.
                        </p>
                    </section>

                </div>

                <div className="bg-slate-100 px-6 py-6 border-t border-slate-200">
                    <a href="/" className="text-green-700 font-bold hover:underline flex items-center justify-center gap-2">
                        ← Vissza az igényléshez
                    </a>
                </div>
            </div>
        </main>
    );
}
