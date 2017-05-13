class list{
	constructor(){
		this.searchList();
	}
	searchList(){
		$('#filterBox').on('click','ul>li',function () {
			$(this).addClass('checked');
		})
	}
	
}
new list();