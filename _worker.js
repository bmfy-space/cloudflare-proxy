addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  const actualUrlStr = url.pathname.slice(1) + url.search + url.hash;
  const actualUrl = new URL(actualUrlStr, request.url); // Construct the URL correctly using the base URL

  const init = {
    headers: request.headers,
    method: request.method,
    body: request.method === 'GET' || request.method === 'HEAD' ? null : request.body, // Only include the body if the method supports it
    redirect: 'follow'
  };

  const modifiedRequest = new Request(actualUrl, init);

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  // Only set 'Access-Control-Allow-Origin' if not already present
  if (!modifiedResponse.headers.has('Access-Control-Allow-Origin')) {
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  }

  return modifiedResponse;
}
