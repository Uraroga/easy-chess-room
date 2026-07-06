# Easy Chess Room

Easy Chess Room è una scacchiera web installabile realizzata con React, TypeScript, Vite e chess.js. Il repository tecnico può chiamarsi `easy-chess-room`.

## Gioca dal browser

Apri Easy Chess Room qui:

```text
https://uraroga.github.io/easy-chess-room/
```

Questo è il link della versione pubblicata con GitHub Pages. Da telefono o computer, usa questo indirizzo per provare il gioco nel browser.

Il repository GitHub contiene invece il codice sorgente del progetto:

```text
https://github.com/Uraroga/easy-chess-room
```

Il repository serve per scaricare, studiare, modificare o contribuire al codice.

Questa versione è pensata per principianti, gioco locale nel browser, aiuto mosse e modalità stanza peer-to-peer. Il vecchio progetto `React-Offline-Chess-v1.6` rimane separato e non deve essere modificato da questa repository.

La modalità locale funziona senza database, login o account utente. La partita viene gestita nel browser e le regole degli scacchi sono validate da `chess.js`. La modalità stanza peer-to-peer è sperimentale, usa Trystero e WebRTC, e sincronizza la posizione tramite FEN.

## Funzioni principali

- Scacchiera interattiva nel browser.
- Mosse tramite clic su casella di partenza e arrivo.
- Mosse tramite trascinamento dei pezzi.
- Validazione delle regole con `chess.js`.
- Gestione turno Bianco/Nero.
- Rilevamento di scacco, scacco matto e patta.
- Promozione del pedone con scelta del pezzo.
- Nuova partita.
- Annullamento dell'ultima mossa.
- Cronologia mosse in formato SAN.
- Copia cronologia SAN e UCI.
- Copia della FEN corrente.
- Importazione di una FEN esterna.
- Download di un file `.txt` con FEN, cronologia SAN, cronologia UCI e PGN quando disponibile.
- Salvataggio locale con `localStorage`.
- Ripristino della partita al riavvio della pagina, se il salvataggio è valido.
- Cancellazione del salvataggio locale.
- Rotazione della scacchiera tra orientamento Bianco e Nero.
- Aiuto mosse per principianti.
- Modalità stanza peer-to-peer con ruoli Bianco, Nero e Spettatore.
- Sincronizzazione online sperimentale tramite FEN.
- Manifest PWA e service worker per installazione e uso offline dopo la prima visita.

## Modalità offline

La modalità offline è il funzionamento principale dell'app. La scacchiera gira nel browser e non richiede database, login o backend dedicato per gestire la partita locale.

Puoi usare Easy Chess Room per giocare sullo stesso dispositivo, provare posizioni, importare FEN, copiare la posizione corrente e conservare una partita nel salvataggio locale del browser.

Dopo una prima apertura riuscita della versione pubblicata, il service worker può permettere di riaprire la parte locale dell'app anche senza rete. La modalità stanza peer-to-peer richiede comunque connessione internet.

## Aiuto mosse per principianti

L'opzione Aiuto mosse è pensata per chi non conosce ancora bene le mosse degli scacchi.

Quando è attiva, selezionando un pezzo del giocatore di turno vengono mostrate le mosse legali disponibili per quel pezzo. Le caselle vuote raggiungibili sono indicate con un piccolo pallino; le catture possibili sono indicate con un cerchio leggero.

Questa funzione non è un motore scacchistico, non analizza la posizione e non suggerisce la mossa migliore. Mostra solo le mosse consentite dalle regole, calcolate da `chess.js`.

## Modalità stanza peer-to-peer

La modalità stanza peer-to-peer permette a due giocatori di aprire la stessa app, entrare nella stessa stanza e giocare online in modo sperimentale.

Un giocatore può scegliere Bianco, un altro può scegliere Nero. Eventuali altri utenti collegati restano Spettatori, se i due colori sono già occupati. Lo Spettatore può vedere la partita ma non può muovere.

Dopo ogni mossa valida, la nuova posizione viene sincronizzata inviando la FEN corrente agli altri peer. La comunicazione usa Trystero e WebRTC. Non è presente un backend applicativo dedicato, quindi la connessione può dipendere da browser, modem, firewall, NAT e rete mobile.

## FEN, cronologia e salvataggio

La FEN descrive una posizione precisa sulla scacchiera. Easy Chess Room mostra sempre la FEN corrente nel pannello laterale.

La FEN viene usata per copiare la posizione corrente, importare una posizione esterna, ripristinare lo stato della scacchiera e sincronizzare la posizione nella modalità stanza peer-to-peer.

La partita viene salvata automaticamente in `localStorage`. Il salvataggio include FEN corrente, orientamento della scacchiera, preferenza Aiuto mosse, PGN e cronologia quando disponibili.

Il pulsante di download genera un file `easy-chess-room.txt` direttamente dal browser. Il file contiene FEN corrente, cronologia SAN, cronologia UCI e PGN quando disponibile.

## Web app installabile

Il progetto include i file minimi per essere installabile come PWA:

- `public/manifest.webmanifest`;
- `public/sw.js`;
- icone SVG provvisorie in `public/icons/`;
- registrazione del service worker nella build di produzione.

Dopo aver aperto il link pubblico dal browser, se il dispositivo lo consente, è possibile installare l'app o aggiungerla alla schermata iniziale. Alcuni browser possono mostrare il pulsante Installa app. Su telefono può comparire la voce Aggiungi alla schermata Home.

Il supporto all'installazione dipende dal browser e dal sistema operativo. Le icone incluse sono semplici e provvisorie; possono essere sostituite mantenendo gli stessi percorsi o aggiornando il manifest.

## Installazione

Prerequisito: Node.js con npm.

```bash
npm install
```

## Avvio rapido

Se vuoi avviare il progetto con un solo comando:

```bash
./avvia-server.sh
```

Oppure:

```bash
npm start
```

Lo script entra automaticamente nella cartella del progetto, installa le dipendenze se `node_modules` non esiste e avvia Vite sulla porta `3000`. Mostra anche gli indirizzi locali da aprire nel browser.

Di solito l'app è disponibile su:

```text
http://localhost:3000
```

## Avvio con Vite

Puoi avviare manualmente il server di sviluppo con:

```bash
npm run dev
```

La configurazione Vite usa la porta `3000` e host `0.0.0.0`.

## Build del progetto

Per controllare i tipi:

```bash
npm run typecheck
```

Per creare la versione compilata:

```bash
npm run build
```

Il risultato viene generato nella cartella `dist`.

## Pubblicazione con GitHub Pages

Il gioco pubblicato con GitHub Pages si apre da:

```text
https://uraroga.github.io/easy-chess-room/
```

Il repository con il codice sorgente è:

```text
https://github.com/Uraroga/easy-chess-room
```

Il progetto può essere compilato con `npm run build` e pubblicato come sito statico. Per GitHub Pages, la configurazione Vite usa in build:

```text
base: '/easy-chess-room/'
```

Questa repository non modifica automaticamente il deploy e non aggiunge una GitHub Action. Una possibile procedura manuale o automatizzata consiste nel pubblicare la cartella `dist` generata da `npm run build` tramite GitHub Pages.

Altri servizi adatti includono Vercel, Netlify o hosting statici simili. In quel caso potrebbe essere necessario adattare la base Vite se l'app non viene servita sotto `/easy-chess-room/`.

## Struttura del repository

- `App.tsx`: componente principale, collega scacchiera, pannelli, modali, logica locale e stanza peer-to-peer.
- `components/`: componenti dell'interfaccia, inclusi scacchiera, pannello informazioni, guida, promozione, fine partita e pannello peer-to-peer.
- `hooks/`: hook dedicati alla logica della partita e alla stanza peer-to-peer.
- `types.ts`: tipi condivisi per stato partita, promozione, ruoli online e messaggi peer-to-peer.
- `constants.tsx`: SVG dei pezzi.
- `index.tsx`: punto di ingresso React.
- `index.html`: pagina HTML usata da Vite.
- `vite.config.ts`: configurazione Vite.
- `package.json`: script npm e dipendenze.
- `public/manifest.webmanifest`: manifest PWA.
- `public/sw.js`: service worker per cache offline della parte locale.
- `public/icons/`: icone provvisorie della PWA.
- `avvia-server.sh`: script Bash per avviare il server locale.
- `README.md`: documentazione del progetto.
- `LICENSE`: licenza MIT.

## Tecnologie usate

- React
- TypeScript
- Vite
- chess.js
- Trystero
- WebRTC
- lucide-react
- Tailwind CSS via CDN
- localStorage del browser
- Web App Manifest
- Service Worker

## Limiti attuali

- Non esiste un motore scacchistico.
- Non esiste analisi automatica delle mosse.
- Non esistono suggerimenti sulla mossa migliore.
- Non esistono login, account o profili.
- Non esiste database.
- Non esiste salvataggio cloud.
- La cronologia non viene ricostruita completamente quando si importa solo una FEN.
- La modalità peer-to-peer è sperimentale e sincronizza la partita tramite FEN.
- La modalità peer-to-peer può dipendere da rete, browser, firewall, NAT e relay Trystero.
- Non ci sono chat, timer, matchmaking pubblico, classifiche o inviti avanzati.
- Il supporto PWA e installazione dipende dal browser e dal sistema operativo.
- Le icone PWA incluse sono provvisorie.
- Il service worker copre la parte locale dell'app dopo la prima visita; la stanza peer-to-peer richiede internet.

## Licenza

Il progetto è rilasciato con licenza MIT. Vedi il file `LICENSE` per il testo completo.
