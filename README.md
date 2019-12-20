# Hell Display #

- [Use app](http://hell.vijon.it/)
- [Go to bot](https://telegram.me/HellDisplayBot)

## Overview ##

This experiment comes from a vision: a screen powered by a community that can display and automatically reproduce the various types of content: audio, video, photos, text ...

Of course there is no moderation or censorship, so the danger of incurring into inappropriate content is very high. 
Hence the name "Hell Display". A hellish monitor that not everyone will have the courage to keep open.

The contents are "launched" via Telegram. In fact, a bot has been built to receive content and turn it through websocket to the application.

Once the development of the SPA was finished I thought of packaging everything in a PWA desktop to allow installing the application. I have also implemented web push notification management.

***

# Hell Display #

## Panoramica ##

Questo esperimento nasce da una visione: uno schermo che viene alimentato da una community visualizzando e riproducendo in automatico le varie tipologie di contenuti: audio, video, foto, testo...

Naturalmente non è prevista una moderazione o censura, quindi il pericolo di incorrere in materiale sconveniente è altissimo.
Da qui, il nome "Hell Display". Un monitor infernale che non tutti avranno il coraggio di tenere aperto.

I contenuti vengono "lanciati" tramite Telegram. E' stato costruito infatti un bot apposta per ricevere contenuti e girarli tramite websocket all'applicativo.

Una volta finito lo sviluppo della SPA ho pensato di pacchettizzare il tutto in una PWA desktop per permettere di installare l'applicazione. Ho inoltre implementato la gestione delle web push notification.

***
## Tech ##

* COMPILING  
  * Typescript
  * Create React App

* CLIENT 
  * React
  * Glamorous
  * Socket IO
  * PWA

* SERVER 
  * NodeJS
  * RxJS
  * Socket IO

* EXTERNAL  
  * Telegram
