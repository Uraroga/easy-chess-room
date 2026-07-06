import React from 'react';
import { X, WifiOff, Save, Download, Move, FileText, AlertTriangle, Lightbulb, Radio } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex animate-fadeIn items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
          <h2 className="text-lg font-bold text-slate-800 sm:text-xl">Guida e funzionamento</h2>
          <button
            onClick={onClose}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            title="Chiudi guida"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-4 text-sm leading-relaxed text-slate-600 sm:space-y-7 sm:p-6 sm:text-base">
          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <WifiOff className="shrink-0 text-blue-600" size={20} />
              Repository e avvio
            </h3>
            <p>
              Il repository GitHub è il punto di partenza per scaricare o studiare il codice. La pagina del
              repository non è il gioco avviato: per giocare bisogna avviare l'app in locale o aprire una
              versione pubblicata come sito statico. In locale, Easy Chess Room può essere usato nel browser
              senza login, database o servizi AI.
            </p>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <Download className="shrink-0 text-blue-600" size={20} />
              App installabile
            </h3>
            <p>
              Se l'app viene aperta da un link pubblico e il browser lo consente, può comparire il comando
              Installa app o Aggiungi alla schermata Home. Dopo la prima apertura, la parte locale del gioco può
              funzionare anche senza rete. La stanza peer-to-peer richiede invece una connessione internet.
            </p>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <Move className="shrink-0 text-blue-600" size={20} />
              Mosse e rotazione
            </h3>
            <p>
              Puoi muovere i pezzi trascinandoli oppure selezionando prima la casella di partenza e poi quella
              di arrivo. Il pulsante con le frecce ruota la scacchiera tra punto di vista del Bianco e del Nero.
            </p>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <Lightbulb className="shrink-0 text-blue-600" size={20} />
              Aiuto mosse
            </h3>
            <p>
              L’opzione Aiuto mosse è pensata per chi sta imparando. Quando è attiva, selezionando un pezzo
              del giocatore di turno vengono evidenziate le sue mosse legali: un pallino indica una casella
              libera, mentre un cerchio indica una cattura possibile. Non suggerisce la mossa migliore e non usa
              un motore scacchistico.
            </p>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <FileText className="shrink-0 text-blue-600" size={20} />
              FEN e cronologia
            </h3>
            <p>
              La FEN descrive una posizione precisa sulla scacchiera. Puoi copiare la FEN corrente, importarne
              una esterna e copiare la cronologia mosse in formato SAN o UCI. Importare una FEN imposta la
              posizione, ma non ricostruisce sempre la cronologia precedente.
            </p>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <Save className="shrink-0 text-blue-600" size={20} />
              Salvataggio locale
            </h3>
            <p>
              La partita viene salvata automaticamente in localStorage con FEN, orientamento e PGN quando
              disponibile. Alla riapertura della pagina l’app prova a ripristinarla; se il salvataggio è corrotto,
              avvia una nuova partita senza bloccare l’interfaccia. Il pulsante cestino cancella il salvataggio
              locale e riparte da una nuova partita.
            </p>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <Radio className="shrink-0 text-blue-600" size={20} />
              Modalità stanza peer-to-peer
            </h3>
            <p>
              Due utenti che aprono la stessa app possono entrare nella stessa stanza, scegliere Bianco o Nero
              e sincronizzare la posizione tramite FEN con Trystero e WebRTC. Quando un giocatore fa una mossa
              valida, la nuova FEN viene inviata agli altri peer. È una modalità sperimentale, senza backend
              dedicato per gestire la partita, e può dipendere da browser, rete, firewall e NAT. Per giocare
              online è importante che entrambi aprano la stessa versione pubblicata dell'app ed entrino nella
              stessa stanza.
            </p>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              <Download className="shrink-0 text-blue-600" size={20} />
              Esportazione
            </h3>
            <p>
              Il pannello laterale permette di copiare FEN e cronologia oppure scaricare un file di testo con
              FEN, mosse SAN, mosse UCI e PGN quando disponibile. Tutto avviene nel browser.
            </p>
          </section>

          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-amber-900 sm:text-lg">
              <AlertTriangle className="shrink-0 text-amber-700" size={20} />
              Limiti attuali
            </h3>
            <p>
              Non esistono motore scacchistico automatico, analisi delle mosse, account utente, salvataggio su
              cloud, timer o piattaforma online professionale. La stanza peer-to-peer è una prima versione
              minima e sperimentale.
            </p>
          </section>
        </div>

        <div className="flex shrink-0 justify-end border-t border-slate-100 p-4 sm:p-5">
          <button
            onClick={onClose}
            className="min-h-10 rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
