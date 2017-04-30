/**
 * Created by Alan(000058) on 2017/01/10.
 * Email: 1480801@qq.com
 */
export default function crumbs(element,config) {
    element.find('li[data-key]').each(function () {
        let key = $(this).attr('data-key'),
            crumbName = $(this).text();
        if(config[key]){
            $(this).html($('<a>',{'href':config[key]}).text(crumbName));
        }
        $(this).removeAttr('data-key')
    });
}