import {parse,serialize} from 'cookie'

export function setCookie(...args){
	document.cookie=serialize(...args);
}

export function getCookie(key){
	return (parse(document.cookie)||{})[key]
}

