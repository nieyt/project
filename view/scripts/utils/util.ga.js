export function ga(){
    // eb.ceair.com => GTM-KCDMZ8           保险
    // vacations.ceair.com => GTM-54J8VK    度假
    // shopping.ceair.com => GTM-NFKM96     积分商城
    // selfservice.ceair.com                所见即所得
    let pm = '';
    (function(w,d,s,l,i){
        switch(location.host){
            case 'eb.ceair.com':
                pm = 'GTM-KCDMZ8';
                break;
            case 'ebapp.ceair.com':
                pm = 'GTM-W5HZSZ';
                break;
            case 'shopping.ceair.com':
                pm = 'GTM-NFKM96';
                break;
            case 'car.ceair.com':
                pm = 'GTM-K5WFHGM';
                break;  
            case 'selfservice.ceair.com':
                pm = 'GTM-5ZLQ5DN';
                break;  
            case 'hotels.ceair.com':
                pm = 'GTM-TK6W7PP';
                break;    
            case 'mobile.ceair.com':
                pm = 'GTM-K2LSFTL';
                break;    
            default:
                pm = 'GTM-54J8VK';
        }
        w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//www.googletagmanager.com/gtm.js?id='+pm+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer');
}
