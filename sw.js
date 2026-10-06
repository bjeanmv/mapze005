const CACHE_PREFIX='mapeamento-eleitoral:'+self.registration.scope+':';
const CACHE=CACHE_PREFIX+'v3-supabase';
const ASSETS=['./mapeamento.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const PAGE=new URL('./mapeamento.html',self.location).href;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'&&url.pathname===new URL(PAGE).pathname){
 event.respondWith(fetch(event.request).then(response=>{if(!response.ok)throw Error('HTTP');const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(PAGE,copy)));return response;}).catch(()=>caches.match(PAGE)));return;
 }
 if(ASSETS.slice(1).some(path=>new URL(path,self.location).href===url.href))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
