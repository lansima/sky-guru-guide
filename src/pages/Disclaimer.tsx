import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container py-10 flex-1">
        <div className="max-w-4xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Terms and Conditions: Aviation Technical Library
            </h1>
            <p className="text-muted-foreground">
              Please review the following terms before using this site.
            </p>
          </div>

          <ol className="space-y-6">
            <li className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                1. Training and Educational Purpose Only
              </h2>
              <p className="text-muted-foreground">
                The Aviation Technical Library is an online information service
                dedicated to the sharing of aviation knowledge. All materials
                made available on this Site are to be used for training purposes
                only.
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Not an Official Manual:
                </span>{" "}
                This Site is an educational supplement and is not an official
                source of aviation documentation.
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Final Authority:
                </span>{" "}
                The primary reference source and final authority for all
                information regarding any aircraft is the latest revision of the
                official Manufacturer's Flight Manual (such as the FCOM or FCTM)
                and your specific Airline Approved Flight Manual (AFM),
                including Standard Operating Procedures (SOPs).
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Prohibited for Operational Use:
                </span>{" "}
                Under no circumstances should information from this library be
                used for real-world flight planning, aircraft maintenance, or
                flight operations.
              </p>
            </li>

            <li className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                2. Accuracy and Evolutions
              </h2>
              <p className="text-muted-foreground">
                Aviation systems, documentation, and operating procedures are
                constantly evolving.
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Currentness:
                </span>{" "}
                Even with careful monitoring, the contents of the Aviation
                Technical Library may not contain the latest technical
                information or revisions.
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  User Responsibility:
                </span>{" "}
                It is solely your responsibility to evaluate the accuracy,
                completeness, and usefulness of all information provided.
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  No Liability:
                </span>{" "}
                Neither the authors nor the Aviation Technical Library shall
                have any liability to any person or entity for any loss or
                damage caused, or alleged to be caused, directly or indirectly
                by the information contained on this Site or its application in
                practice.
              </p>
            </li>

            <li className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                3. Non-Affiliation
              </h2>
              <p className="text-muted-foreground">
                The Aviation Technical Library is an independent entity and is
                not affiliated in any way with any airplane manufacturer,
                including but not limited to Airbus, Boeing, Bombardier,
                Cessna, or Embraer. Official reference manuals provided by
                these companies remain the essential requirement for any
                qualified pilot or pilot in training and should be obtained
                through official channels.
              </p>
            </li>

            <li className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                4. Permitted Use
              </h2>
              <p className="text-muted-foreground">
                Because our philosophy is to share aviation knowledge, you may
                print and download portions of material from the Site solely for
                your own non-commercial, personal study. You agree not to change
                or delete any copyright or proprietary notices from the
                materials.
              </p>
            </li>

            <li className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                5. Disclaimer of Warranty
              </h2>
              <p className="text-muted-foreground">
                The Aviation Technical Library provides the Site and related
                information on an "as is" basis. We do not guarantee or warrant
                that files available for downloading through the Site will be
                free of infection, viruses, or other code that manifest
                contaminating or destructive properties. You are responsible for
                implementing sufficient procedures to satisfy your requirements
                for data accuracy and security.
              </p>
            </li>

            <li className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                6. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                In no event will the Aviation Technical Library be liable for
                any incidental, consequential, or indirect damages (including,
                but not limited to, loss of profits, business interruption, or
                loss of information) arising out of the use of or inability to
                use this service.
              </p>
            </li>
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  );
}
