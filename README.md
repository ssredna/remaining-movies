# Mitt personlige film-dashboard

Da jeg fant ut at jeg nærmet meg å ha sett 1000 filmer klarte jeg ikke å motstå fristelsen av å lage en nedtelling. Det var det dette var, helt enkelt og greit:

![remaining-movies-header](https://user-images.githubusercontent.com/33721320/234919059-55ebeea3-93aa-4f4a-affa-aafe4f7d8396.jpg)

Men så la jeg også til en liten liste av de siste filmene jeg hadde sett, og etter hvert også mulighet for å foreslå hvilken film jeg skulle se som nummer 1000, med mulighet for å stemme.

Og så skjedde det jo, jeg nådde film 1000! Det var [Sauen Shaun filmen: Farmageddon](https://www.imdb.com/title/tt6193408/) som vant, med 37(!) stemmer.

Men hva skulle jeg gjøre nå? Det ble litt rart å legge ned siden etter at jeg hadde lagt ned såpass mye arbeid i den. Så da tenkte jeg at det kan jo hende det kommer noen nye tall å telle ned til etterhvert. Og frem til det så fungerer det som et personlig film-dashboard, med mulighet til å forslå og stemme på filmer jeg burde se.

![movies-dashboard](https://github.com/ssredna/remaining-movies/assets/33721320/4069b51a-4bbf-4cbe-851c-7d46b71941d4)

# Teknologier

Her er en kjapp oppsummering av hva jeg har brukt for å lage siden, og litt at det jeg har lært.

## SvelteKit

Jeg har brukt SvelteKit, og siden er server rendered. Jeg laster inn data på serveren med `load`-funksjonen i `+page.server.ts`. Selve fetchingen er gjort med `fetch`. Ingen error håndtering atm., beklager det.

Dataen som returneres fra `load` blir servert til komponenten gjennom `data`-variabelen i `+page.svelte`.

```html
<script lang="ts">
	export let data;
</script>
```

Den er også tilgjengelig gjennom `page`-storen i andre komponenter på samme side. F.eks. bruker jeg den i `ConfirmSuggestedModal.svelte`:

```html
<script lang="ts">
	import { page } from '$app/stores';

	$: selectedMovieAlreadySuggested = $page.data.suggestedMovies
		? $page.data.suggestedMovies.map((movie: movie) => movie.id).includes(suggestedMovie.id)
		: false;
</script>
```

### Miljøvariabler

Jeg brukte IKKE `dotenv` for miljøvariabler, men heller SvelteKit sin `$env/private/static`-route. Dette var veldig enkelt, og jeg kunne bare importere direkte `.env` variabelen herfra.

```ts
import { VITE_TRAKT_CLIENT_ID } from '$env/static/private';
```

Det funket også helt fint hos Vercel hosting etter jeg hadde lagt inn variablen som en secret der, uten noe mer avansert konfigurering.

### SVGs

En annen ting som var super-smooth å jobbe med var SVGs. Det var jo bare å importere de, og bruke de som `src` i en `<img>` tag:

```html
<script lang="ts">
	import traktLogo from '$lib/images/trakt-logo.svg';
</script>

<img src="{traktLogo}" />
```

### Bilde med fallback

Noe jeg viser ganske mye i denne applikasjonen er poster-bilder av filmene. Disse poster-url-ene henter jeg fra tmdb, som har postere tilgjengelig i mange ulike størrelser.

Problemet er at ikke alle filmer har poster i alle størrelser. Dette resulterer i en error når en `<img>` får en link som ikke eksisterer:

<img src="https://github.com/ssredna/remaining-movies/assets/33721320/196c1923-fa6d-4faf-bd41-1f17de7aad29" alt="broken img without fallback" width=200>

Siden jeg vet at en del av posterene kommer til å være ødelagt på denne måten, vil jeg heller at det vises en fallback i de tilfellene, slik som dette:

<img src="https://github.com/ssredna/remaining-movies/assets/33721320/96c51586-9058-4d92-b04f-9538a55845ff" alt="broken img with fallback" width=200>

Dette var ganske tricky å få til, og jeg så på forskjellige mulige løsninger.

En var å ha en `<object>` over `<img>` taggen. Da kunne `<img>` alltid vise fallbacken, og når `<object>` hadde en link som fungerte overskygget den dette.

```html
<object data="{posterUrl}" type="image/jpeg" {title}>
	<img src="{noImage}" alt="{title}" />
</object>
```

Dette funket, og det var det jeg brukte en stund, men etterhvert ble det litt trøbbel med styling og ulikheter på web og ios. I tillegg så likte jeg det ikke helt, for det føles veldig som en work-around.

En annen mulig løsning jeg så på var å bruke [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)-elementet. Med denne kan man ha flere ulike bilde-kilder på samme bilde. Det så veldig lovende ut, men jeg sleit med å få det til å fungere.

Til slutt endte jeg opp med en annen løsning som også føles som en workaround, men som fungerer. Jeg bruker en vanlig `<img>` med en `on:error` som setter `src` til en fallback:

```html
<script lang="ts">
	import noImage from '$lib/images/no-image.png';

	let image: HTMLImageElement;
</script>

<img bind:this={image} src={posterUrl} on:error={() => { image.src = noImage; }} />
```

`bind:this={image}` binder `<img>`-elementet til `image`-variabelen, slik at jeg kan endre `src` direkte inne i `on:error`. Dette er Svelte syntaks.

Dette kan potensielt føre til et problem med en endless loop om det skulle være en error på fallback-bildet også. Siden jeg importerer dette bildet direkte så håper jeg ikke det blir et problem for meg.

### Modals

Jeg bruker en modal for å søke etter film, og for å bekrefte valgte film. Disse har jeg implementert selv (på godt og vondt). Det er veldig rett frem og enkel løsning. Jeg har en variabel som styrer om modalen skal vises eller ikke, og bruker en `#if`-blokk for å vise og skjule den.

```html
<script lang="ts">
	import SuggestMoviesModal from './SuggestMoviesModal.svelte';

	let showModal = false;
</script>

{#if showModal}
	<button on:click={() => (showModal = true)}>Åpne</button>
	<SuggestMoviesModal on:close={() => (showModal = false)} />
{/if}
```

Selve modalen implementeres slik at den sender en `close`-event når den lukkes, altså kan jeg reagere på denne eventen her, og sette `showModal = false` når den trigges.

Selve modal-komponenten er i all hovedsak en `<dialog>`, som settes til å vises med en gang komponenten vises.

```html
<script lang="ts">
	import { onMount } from 'svelte';

	let modal: HTMLDialogElement;

	onMount(() => {
		modal.showModal();
	});
</script>

<dialog bind:this="{modal}" on:close>...</dialog>
```

Siden modalen ikke er bundet til `modal`-variabelen før komponenten er ferdig mountet, så må vi kjøre `modal.showModal()` inne i Svelte sin `onMount`-funksjon.

`on:close` sender `close`-eventen til dialogen videre slik at vi kan reagere på den et lag opp. `<dialog>` sender close-event når den blir lukket, f.eks. med `esc`-tasten.

## Vercel

Bruker Vercel for å hoste, som deployer når jeg pusher til `main`. Enkelt og greit.

## Film-API-er

API-et jeg bruker for å hente hvor mange filmer jeg har sett er fra [trakt.tv](https://trakt.docs.apiary.io/#). Var enkelt å bruke. Jeg måtte registrere en applikasjon hos dem, og så bruke riktige headers med bl.a. en client-id fra de, og så gikk det helt fint.

```ts
fetch('https://api.trakt.tv/users/ssredna/stats', {
		headers: {
			'Content-Type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': VITE_TRAKT_CLIENT_ID
		}
	}
```

API-et jeg bruker for å hente posters er fra [TMDB](https://developers.themoviedb.org/3), og denne var også veldig rett frem. Her måtte jeg også registrere en applikasjon, men client-id puttes her direkte i url-en.

```ts
fetch(`https://api.themoviedb.org/3/movie/${ids.tmdb}?api_key=${VITE_TMDB_CLIENT_ID}`);
```
