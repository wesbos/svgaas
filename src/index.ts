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
    const path = url.pathname.replace('/', '');
    if(!path.endsWith('.svg')) {
      return new Response('You should end your url with .svg', { status: 404 });
    }
    const searchTerm = path.replace(/\.svg$/, '');
    // otherwise fetch the SVG
    // This endpoint will probably change, you are supposed to pay for it
    const res = await fetch(`https://api.svgapi.com/v1/Ty5WcDa63E/list/?search=${searchTerm}&limit=10`);
    const data = await res.json() as SVGAPIREsponse;
    const { icons } = data;
    console.log(icons)
    // return a random one
    return fetch(icons[Math.floor(Math.random() * icons.length)].url);
  },
};
