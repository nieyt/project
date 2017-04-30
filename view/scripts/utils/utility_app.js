import {DeviceType} from './device_type'
import {setCookie,getCookie} from './cookie'

export function bindTitle(title){
	try{
    	switch (DeviceType) {
            case "Android":
                gototitle.clickOntitle(title);
                break;
            case "IOS":
                clickOntitle(title);
                break;
            case "WP":
                external.notify('clickOntitle?' + title);
                break;
    	}
	}catch(e){
        console.log(e)
	}
}

export const bindBack=(()=>{
    window.historyBack=()=> history.go(-1);
    return (isFirst)=>{
        try{
           switch (DeviceType) {
                case "Android":
                    if(!isFirst){
                        gotoback.clickOnback('true', 'historyBack()');                      
                    }                       
                    else
                        gotoback.clickOnback('false', '');
                    break;
                case "IOS":
                    if(!isFirst)
                        clickOnback("true", "historyBack()");
                    else{          
                        clickOnback("false", "");
                    }
                    break;
                case "WP":
                    if(!isFirst)
                        external.notify('clickOnback?true&historyBack');
                    else
                        external.notify('clickOnback?true&');
                    break;
            }   
        }catch(e){
            console.log(e)
        }   
    }
})()


export function hybirdLogin(url=location.href, title) {
            url=url.replace(/\&/g,'&amp;');
            try{
                switch (DeviceType) {
                    case "Android":
                        Login.clickOnLogin(url, title, "mobile_login");
                        break;
                    case "IOS":
                        clickOnLogin(url, title, "mobile_login");
                        break;
                    case "WP":
                        external.notify("clickOnLogin?" + url + "&" + title + "&mobile_login");
                        break;
                }
            }catch(e){
                console.log(e);
            }
        }

export function saveAppParam(params={}){
    let {p,Entry}=params;
    p&&saveP(p);
    Entry&&saveEntry(Entry);
}

export function saveP(p){   
    p&&sessionStorage.setItem('p',p);
    //p&&setCookie('p',p,{path:'/'});    
}

export function getP(){
    return sessionStorage.getItem('p');
    //return getCookie('p');
}

export function saveEntry(Entry){
    Entry&&setCookie('Entry',Entry,{path:'/'});
}

export function getEntry(Entry){
    return getCookie('Entry');
}

export function isHybird(){
    switch (DeviceType) {
        case "Android":
            return !!window.Login&&!!window.gotoback;            
            
        case "IOS":
            return !!window.clickOnback&&!!window.clickOnLogin;
           
        case "WP":
            return !!window.external&&!!window.external.notify;
           
    }
}

export function isHybirdLogin(){
    return !!getP();
}


export function downloadPdf(title,url){
    if(!isHybird())return;
    try{
        switch (DeviceType) {
            case "Android":
            gotopdf.clickOnPdf(title,url);
            break;           
        }
    }catch(e){
        console.log(e);
    }
}


export function isHybirdAdroid(){
    return isHybird()&&DeviceType=='Android';
}