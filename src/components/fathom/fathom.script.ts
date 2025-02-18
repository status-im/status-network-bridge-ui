const analyticsDomainName = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN
const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const fathomScript = `(function(f, a, t, h, o, m){
    a[h]=a[h]||function(){
      (a[h].q=a[h].q||[]).push(arguments)
    };
    if (typeof window !== 'undefined' && window.location.hostname === "${analyticsDomainName}"){
      o=f.getElementById('fathom-script');
      o.async=1; o.src=t;
    }
})(document, window, '//fathom.bi.status.im/tracker.js', 'fathom');
fathom('set', 'siteId', '${analyticsId}');
fathom('trackPageview');`


export default fathomScript
