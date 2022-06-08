export interface Env { }

export interface Icon {
  id: string;
  slug: string;
  title: string;
  url: string;
}

export interface SVGAPIREsponse {
  term: string;
  count: number;
  limit: number;
  start: number;
  response_time: number;
  icons: Icon[];
  next: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname).replace('/', '');
    if(!path.endsWith('.svg')) {
      return new Response(/*html*/`
      <head>
        <meta charset="UTF-8">
        <link rel="icon" href="https://fav.farm/💩" />
      </head>
      <p>You should end your url with .svg, like <a href="/cat.svg">/cat.svg</a></p>
      <style>
        body {
          text-align: center;
          font-family: sans-serif;
          height: 100vh;
          display: grid;
          place-items: center;
          font-size: 2em;
        }
      </style>

        `, { status: 404, headers: { 'Content-Type': 'text/html' } });
    }
    console.log(path);
    console.log('----')
    const searchTerm = path.replace('.svg', '').replaceAll(' ', '');
    // otherwise fetch the SVG
    // This endpoint will probably change, you are supposed to pay for it
    const res = await fetch(`https://api.svgapi.com/v1/Ty5WcDa63E/list/?search=${searchTerm}&limit=10`);
    const data = await res.json() as SVGAPIREsponse;
    const { icons } = data;
    if(!icons.length) {
      return fetch(`https://cdn.svgapi.com/vector/94277/blank-file.svg`);
    }
    // return a random one
    return fetch(icons[Math.floor(Math.random() * icons.length)].url);
  },
};
