var itemList = new Array();
var tagList = new Array();
var installList = 'a', itemOver = false, countSelected = 0;
var commentBox, downloadBox, searchBox, searchBuBox, checkInstallBox, coverBox, mainContentBox, viewBox, selecterBox;
var selecterCheckBox, viewInstalledBox;
var installArea;

/*----------*/
function clearAllNode(parentNode)
{
    while (parentNode.firstChild)
	{
		var oldNode = parentNode.removeChild(parentNode.firstChild);
		oldNode = null;
	}
}

function getPorWidth()
{
	var viewportwidth;
	if(typeof window.innerWidth != 'undefined')
		viewportwidth = window.innerWidth;
	else if(typeof document.documentElement != 'undefined' && typeof
	document.documentElement.clientWidth !=      'undefined' &&
	document.documentElement.clientWidth != 0)
		viewportwidth = document.documentElement.clientWidth;
	else
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
	return viewportwidth;
}

function getPorHeight()
{
	var viewportheight;
	if(typeof window.innerWidth != 'undefined')
		viewportheight = window.innerHeight;
	else if(typeof document.documentElement != 'undefined' && typeof
	document.documentElement.clientWidth !=      'undefined' &&
	document.documentElement.clientWidth != 0)
		viewportheight = document.documentElement.clientHeight;
	else
		viewportheight = document.getElementsByTagName('body')[0].clientHeight;
	return viewportheight;
}

/*----------*/

function item(id, name, comment, tag, pic)
{
	this.id = id;
	this.selected = false;
	this.installed = false;
	this.name = name;
	this.comment = comment;
	this.tag = tag.split(';');
	this.pic = pic;
	
	tagList[0].child[tagList[0].child.length] = this.id;
	for(var i = 0;i < this.tag.length-1;i++)
		tagList[this.tag[i]].child[tagList[this.tag[i]].child.length] = this.id;
	
	this.html = document.createElement('div');
	this.html.id = 'item#'+this.id;
	this.html.className = 'item';
	this.html.style.backgroundImage = 'url(img/icon/'+this.pic+')';	
	this.html = document.getElementById('mainContent').appendChild(this.html);
	
	this.checkbox = document.createElement('div');
	this.checkbox.className = 'checkbox';
	this.checkbox = this.html.appendChild(this.checkbox);
	
	this.namebox = document.createElement('div');
	this.namebox.className = 'namebox';
	this.namebox.textContent = this.name;
	this.namebox = this.html.appendChild(this.namebox);
	
	this.tagbox = document.createElement('div');
	this.tagbox.className = 'tagbox';
	this.tagbox.textContent = tagList[this.tag[0]].name;
	for(var i = 1;i < this.tag.length-1;i++)
		this.tagbox.textContent += ',' + tagList[this.tag[i]].name;
	this.tagbox = this.html.appendChild(this.tagbox);
	
	this.setInstalled = function(value)
	{
		if(value)
		{
			this.installed = true;
			this.html.className = 'item installed';
		}
		else
		{
			this.installed = false;
			this.html.className = 'item';
		}
	};
	
	
	this.html.onmouseover = function()
	{
		commentBox.childNodes[1].textContent = itemList[this.id.split('#')[1]].name;
		commentBox.childNodes[3].textContent = itemList[this.id.split('#')[1]].comment;
		commentBox.style.backgroundImage = 'url(img/icon/'+itemList[this.id.split('#')[1]].pic+')';
		commentBox.style.display = 'block';
		itemOver = true;
	};
	
	this.html.onmouseout = function()
	{
		commentBox.style.display = 'none';
		itemOver = false;
	};
	
	this.html.onclick = function()
	{
		var self = itemList[this.id.split('#')[1]];
		
		if(self.installed)
			return;
		
		if(self.selected)
		{
			installList = installList.split('a'+self.id+'a')[0] +'a'+ installList.split('a'+self.id+'a')[1];
			self.selected = false;
			this.className = 'item';
			countSelected--;
			document.getElementById('countSelected').textContent = countSelected;
		}
		else
		{
			installList = installList + self.id + 'a';
			self.selected = true;
			this.className = 'item selected';
			countSelected++;
			document.getElementById('countSelected').textContent = countSelected;
		}
	};
}

function loadItem(id, name, comment, tag, pic)
{
	itemList[id] = new item(id, name, comment, tag, pic);
	return itemList[id];
}

function tag(id, name, selected)
{
	this.id = id;
	this.name = name;
	this.selected = selected;
	this.child = new Array();
	
	this.html = document.getElementById('tag#'+id);
}

function loadTag(id, name)
{
	if(id == 0)
		tagList[id] = new tag(id, name, true);
	else
		tagList[id] = new tag(id, name, false);
	return tagList[id];
}

/*----------*/

function tagPress(obj, evt)
{
	var e=(evt)?evt:window.event; 
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	
	var id = obj.id.split('#')[1];
	
	if(id == 0)
	{
		for(var i = 1;i < tagList.length;i++)
		{
			tagList[i].html.className = '';
			tagList[i].selected = false;
			document.getElementById('tagCheck#'+i).checked = false;
		}
	}
	else if(tagList[id].selected)
	{
		tagList[id].html.className = '';
		tagList[id].selected = false;
		document.getElementById('tagCheck#'+id).checked = false;
	}
	else
	{
		tagList[id].html.className = 'selected';
		tagList[id].selected = true;
		document.getElementById('tagCheck#'+id).checked = true;
	}
	
	checkTag();
}

function getCheckArray()
{
	var tmp = new Array();
	for(var i = 1;i < tag_list.length;i++)
		if(document.getElementById('tagCheck#'+i).checked)
			tmp[tmp.length] = i;

	return tmp;
}

function checkTag()
{
	mainContentBox.style.opacity = 0;
	setTimeout("checkTagR();", 300);
}

function checkTagR()
{
	mainContentBox.style.opacity = 1;
	
	var counter = new Array();
	var counter2 = 0;
	var checkArray = getCheckArray();
	
	for(var i = 0;i < itemList.length;i++)
		counter[i] = 0;

	for(var i = 0;i < checkArray.length;i++)
		for(var j = 0;j < tagList[checkArray[i]].child.length;j++)
			counter[tagList[checkArray[i]].child[j]]++;
	
	
	var tmpUnselected = false;
	var tmpSelected = false;
	var tmpInstalled = false;
	
	for(var i = 0;i < itemList.length;i++)
		if(typeof(itemList[i]) != 'undefined')
			if(counter[i] == checkArray.length && (!itemList[i].installed || viewInstalledBox.value == 'true'))
			{
				itemList[i].html.style.display = 'block';
				counter2++;
				
				if(itemList[i].selected)
					tmpSelected = true;
				else if(itemList[i].installed)
					tmpInstalled = true;
				else
					tmpUnselected = true;
			}
			else
				itemList[i].html.style.display = 'none';
	
	if(tmpSelected && tmpUnselected)
	{
		selecterCheckBox.checked = true;
		selecterCheckBox.className = 'half';
	}
	else if(tmpSelected)
	{
		selecterCheckBox.checked = true;
		selecterCheckBox.className = '';
	}
	else if(tmpUnselected)
	{
		selecterCheckBox.checked = false;
		selecterCheckBox.className = '';
	}
	
	document.getElementById('allCount').textContent = counter2;
}

/*----------*/

function changeSelecter()
{
	if(selecterBox.value == 'selectAll')
	{
		selecterCheckBox.checked = true;
		selectAll();
	}
	else if(selecterBox.value == 'clearVisible')
	{
		selecterCheckBox.checked = false;
		clearVisible();
	}
	else if(selecterBox.value == 'clearAll')
	{
		selecterCheckBox.checked = false;
		clearAll();
	}
	
	selecterBox.value = 'default';
	selecterCheckBox.className = '';
}

function changeSelecterCheck()
{
	if(selecterCheckBox.checked)
		selectAll();
	else
		clearVisible();
		
	selecterCheckBox.className = '';
}

function selectAll()
{
	for(var i = 0;i < itemList.length;i++)
	{
		if(typeof(itemList[i]) != 'undefined')
		{
			if((itemList[i].html.style.display == 'block' || itemList[i].html.style.display == '') && !itemList[i].selected && !itemList[i].installed)
			{
				installList = installList + itemList[i].id + 'a';
				itemList[i].selected = true;
				itemList[i].html.className = 'item selected';
				downloadBox.href = './cgi-bin/install.cgi?installList=' + installList;
				countSelected++;
				document.getElementById('countSelected').textContent = countSelected;
			}
		}
	}
}

function clearVisible()
{
	for(var i = 0;i < itemList.length;i++)
	{
		if(typeof(itemList[i]) != 'undefined')
		{
			if((itemList[i].html.style.display == 'block' || itemList[i].html.style.display == '') && itemList[i].selected)
			{
				installList = installList.split('a'+itemList[i].id+'a')[0] +'a'+ installList.split('a'+itemList[i].id+'a')[1];
				itemList[i].selected = false;
				itemList[i].html.className = 'item';
				countSelected--;
				document.getElementById('countSelected').textContent = countSelected;
			}
		}
	}
}

function clearAll()
{
	for(var i = 0;i < itemList.length;i++)
	{
		if(typeof(itemList[i]) != 'undefined')
		{
			if(itemList[i].selected)
			{
				installList = installList.split('a'+itemList[i].id+'a')[0] +'a'+ installList.split('a'+itemList[i].id+'a')[1];
				itemList[i].selected = false;
				itemList[i].html.className = 'item';
				countSelected--;
				document.getElementById('countSelected').textContent = countSelected;
			}
		}
	}
}

/*----------*/

function searchList()
{
	mainContentBox.style.opacity = 0;
	setTimeout("searchListR();", 300);
}

function searchListR()
{
	mainContentBox.style.opacity = 1;
	
	var counter = new Array();
	var counter2 = 0;
	var checkArray = getCheckArray();
	var reg = new RegExp(searchBox.value,"i");
	
	for(var i = 0;i < itemList.length;i++)
		counter[i] = 0;

	for(var i = 0;i < checkArray.length;i++)
		for(var j = 0;j < tagList[checkArray[i]].child.length;j++)
			counter[tagList[checkArray[i]].child[j]]++;
	
	for(var i = 0;i < itemList.length;i++)
		if(typeof(itemList[i]) != 'undefined')
			if(counter[i] == checkArray.length && itemList[i].name.match(reg)!=null)
			{
				itemList[i].html.style.display = 'block';
				counter2++;
			}
			else
				itemList[i].html.style.display = 'none';
				
	document.getElementById('allCount').textContent = counter2;
}

/*----------*/

function showCover()
{
	coverBox.style.top = '0px';
	coverBox.style.opacity = 0.7;
}

function hideCover()
{
	coverBox.style.opacity = 0;
	setTimeout("coverBox.style.top = '-99999px';",300);
}

/*----------*/

function changeView()
{
	if(viewBox.value == 'BIcon')
		rockBIcon();
	else if(viewBox.value == 'list')
		rockList();
}

function rockList()
{
	mainContentBox.className = 'list';
}

function rockBIcon()
{
	mainContentBox.className = 'BIcon';
}

/*----------*/

function showCheckInstall()
{	
	var tmp = installList.split('a');
	var tmp2;
	
	if(tmp.length == 2)
	{
		alert('你尚未選取欲安裝的軟體');
		return;
	}
	
	clearAllNode(document.getElementById('checkInstallList'));
	for(var i = 1;i < tmp.length-1;i++)
	{
		tmp2 = document.createElement('li');
		tmp2.style.backgroundImage = 'url(img/icon/'+itemList[tmp[i]].pic+')';
		tmp2.textContent = itemList[tmp[i]].name;
		document.getElementById('checkInstallList').appendChild(tmp2);
	}

	checkInstallBox.style.display = 'block';
	showCover();
}

function hideCheckInstall()
{
	checkInstallBox.style.display = 'none';
	hideCover();
}

/*----------*/

function initialList()
{
	for(var i = 1;i < list.length;i++)
		loadItem(list[i].id, list[i].name, list[i].comment, list[i].tag, list[i].pic);
	
	var installedArray = location.search.split('?installed=')[1];
	for(var i = 1;i < list.length;i++)
		itemList[i].setInstalled((installedArray.charAt(i)==1)?true:false);
		
	document.getElementById('allCount').textContent = (list.length-1);
}

function initialTag()
{
	for(var i = 0;i < tag_list.length;i++)
		loadTag(i, tag_list[i]);
}

/*----------*/

function changeViewInstalled()
{	
	if(viewInstalledBox.value == 'true')
	{
		
	}
	else if(viewInstalledBox.value == 'false')
	{
		
	}
	
	checkTag();
}

/*----------*/

function download()
{
	installArea.src = './cgi-bin/install.cgi?installList=' + installList;
	
	hideCheckInstall();
	//alert(installList);
}

function initial()
{
	commentBox = document.getElementById('comment');
	downloadBox = document.getElementById('download');
	searchBox = document.getElementById('search');
	searchBuBox = document.getElementById('searchBu');
	checkInstallBox = document.getElementById('checkInstall');
	coverBox = document.getElementById('cover');
	mainContentBox = document.getElementById('mainContent');
	viewBox = document.getElementById('view');
	selecterBox = document.getElementById('selecter');
	selecterCheckBox = document.getElementById('selecterCheck');
	viewInstalledBox = document.getElementById('viewInstalled');
	
	installArea = document.getElementById('installArea');
	
	downloadBox.onclick = download;
	searchBuBox.onclick = searchList;
	viewBox.onchange = changeView;
	selecterBox.onchange = changeSelecter;
	selecterCheckBox.onchange = changeSelecterCheck;
	viewInstalledBox.onchange = changeViewInstalled;
	
	resize();
	initialTag();
	initialList();
}

function moveCom(e)
{
	e = typeof event == "undefined"?e:event;
	var mouseX = e.clientX;
	var mouseY = e.clientY;
	if(itemOver)
	{
		commentBox.style.left = (mouseX-175) + 'px';
		if(document.documentElement.scrollTop == 0)
			commentBox.style.top = (mouseY+30+document.body.scrollTop) + 'px';
		else
			commentBox.style.top = (mouseY+30+document.documentElement.scrollTop) + 'px';
	}
}

function resize(e)
{
	var width = getPorWidth();
	var width2 = 940;
	var height = getPorHeight();
	
	document.getElementById('main').style.width = (width2-218) + 'px';
	document.getElementById('main').style.height = (height-145) + 'px';
	document.getElementById('mainContent').style.height = (height-180) + 'px';
	document.getElementById('side').style.height = (height-147) + 'px';
	
	document.getElementById('checkInstall').style.left = (width-500)/2 + 'px';
	document.getElementById('checkInstall').style.top = (height-420)/2 + 'px';
	
	document.getElementById('cover').style.width = (width) + 'px';
	document.getElementById('cover').style.height = (height) + 'px';
}

function keydown(e)
{
	if(e.keyCode == 13 && document.activeElement.id == "search")
		searchList();
}

window.onload = initial;
window.onresize = resize;
window.onmousemove = moveCom;
window.onkeydown = keydown;
