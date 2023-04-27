# Hvor mange filmer har jeg igjen før jeg har sett 1000?

Når jeg fant ut at jeg nærmer meg å ha sett 1000 filmer klarte jeg ikke å motstå fristelsen av å lage en countdown. Det er det dette er, helt enkelt og greit.

![remaining-movies-header](https://user-images.githubusercontent.com/33721320/234919059-55ebeea3-93aa-4f4a-affa-aafe4f7d8396.jpg)

Hva skjer når jeg når 1000? Vet ikke.

(eller... Helt spesifikt, hvis jeg ikke gjør noen endringer på siden før den tid, så vil siden fortsette akkurat som nå, bare at den viser et "-" tegn og hvor mange filmer over 1000 jeg har sett.)

# Teknologier

Det er en veldig enkel siden, men her er en kjapp oppsummering av hva jeg har brukt for å lage den.

## SvelteKit

Jeg har brukt SvelteKit, og siden er server rendered. Jeg laster inn dataen på serveren, med en funksjon som heter `load`. Selve fetchingen er gjort med en helt enkel `fetch`, med headers. Ingen error håndtering atm., beklager det. Dataen som returneres fra `load` blir servert til komponenten gjennom `data`-variabelen.

```html
<script lang="ts">
	export let data;
</script>
```

Siden det er en statisk side, så valgte jeg å skru av hydrering, slik at det ikke blir sendt noe JavaScript til klienten. Dette var gjort bare ved å eksportere en const kalt `csr` (client side rendering) og sette den til `false`.

```ts
export const csr = false;
```

Jeg brukte IKKE `dotenv` for miljøvariabler, men heller SvelteKit sin `$env/private/static`-route. Dette var veldig enkelt, og jeg kunne bare importere direkte `.env` variabelen herfra.

```ts
import { VITE_TRAKT_CLIENT_ID } from '$env/static/private';
```

Det funket også helt fint hos Vercel hosting etter jeg hadde lagt inn variablen som en secret der, uten noe mer avansert konfigurering.

## Vercel

Bruker Vercel for å hoste, som deployer når jeg pusher til `main`. Enkelt og greit.

## Trakt

API-et jeg bruker for å hente hvor mange filmer jeg har sett er fra [trakt.tv](https://trakt.docs.apiary.io/#). Var enkelt å bruke. Jeg måtte registrere en applikasjon hos dem, og så bruke riktige headers med bl.a. en client-id fra de, men så gikk det helt fint.
