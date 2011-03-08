(function( $ ){

$.fn.opengrid = function( options ) {

    
    var data = new Array();
    data[0] = Array('Product','Salesman', 'Month', 'Client', 'Items', 'Money');
    data[1] = Array('Group','Group','Group','Group','Value','Value');

    data[2] = Array('A','John','Jan','Acme',1,3);
    data[3] = Array('A','John','Jan','dotCom',5,8);
    data[4] = Array('A','John','Feb','Acme',3,16);
    data[5] = Array('A','John','Feb','dotCom',6,7);
    data[6] = Array('A','Peter','Jan','Acme',2,24);
    data[7] = Array('A','Peter','Jan','dotCom',7,9);
    data[8] = Array('A','Peter','Feb','Acme',1,1);
    data[9] = Array('A','Peter','Feb','dotCom',2,12);

    data[10] = Array('B','John','Jan','Acme',4,6);
    data[11] = Array('B','John','Jan','dotCom',6,9);
    data[12] = Array('B','John','Feb','Acme',4,3);
    data[13] = Array('B','John','Feb','dotCom',8,14);
    data[14] = Array('B','Peter','Jan','Acme',2,4);
    data[15] = Array('B','Peter','Jan','dotCom',5,12);
    data[16] = Array('B','Peter','Feb','Acme',6,18);
    data[17] = Array('B','Peter','Feb','dotCom',3,7);

    data[18] = Array('C','John','Jan','Acme',9,11);
    data[19] = Array('C','John','Jan','dotCom',1,2);
    data[20] = Array('C','John','Feb','Acme',4,10);
    data[21] = Array('C','John','Feb','dotCom',7,20);
    data[22] = Array('C','Peter','Jan','Acme',3,5);
    data[23] = Array('C','Peter','Jan','dotCom',6,3);
    data[24] = Array('C','Peter','Feb','Acme',5,14);
    data[25] = Array('C','Peter','Feb','dotCom',2,9);


    var settings = {
        'css'         : 'css/defaultTheme.css',
        'uiCss'      : 'redmond/jquery-ui-1.8.4.custom.css'
      };

    if ( options ) {
        $.extend( settings, options );
    }


    var groupColumns = 0;
    var valueColumns = 0;
    var rows = 1;
    var columns = 1;
    var groupHeadersArray = new Array();
    var valueHeadersArray = new Array();
    var currentValue = -1;

    document.write('<link rel="stylesheet" type="text/css" href="'+settings.css+'" />');
    document.write('<link rel="stylesheet" type="text/css" href="'+settings.uiCss+'" />');

    var instructions = '<table><tr><td width="200px"><span>OpenGrid Instructions</span><ol><li>Drag Items to the horizontal and/or vertical containers</li><li>Select a value</li><li>Press the refresh button</li></ol></td></tr></table>';
    var containersHtml =         '<table>';
        containersHtml +=            '<tbody>';
        containersHtml +=                '<tr>';
        containersHtml +=                    '<td id="items" valign="top">';
        containersHtml +=                        '<ul id="pivotal-container" class="ui-widget-content  attribute-item-list ui-sortable" unselectable="on" style="-moz-user-select: none;">';
        containersHtml +=                        '</ul>';
        containersHtml +=                    '</td>';
        containersHtml +=                    '<td valign="top">';
        containersHtml +=                        '<ul id="horizontal-container" class="ui-widget-content  attribute-item-list ui-sortable" unselectable="on" style="-moz-user-select: none;">';
        containersHtml +=                            '<li class="default-info">Drag items here</li>';
        containersHtml +=                        '</ul>';
        containersHtml +=                    '</td>';
        containersHtml +=                    '<td id="grid" rowspan="2"></td>';
        containersHtml +=                '</tr>';
        containersHtml +=                '<tr>';
        containersHtml +=                    '<td valign="top">';
        containersHtml +=                        '<ul id="vertical-container" class="ui-widget-content  attribute-item-list ui-sortable" unselectable="on" style="-moz-user-select: none;">';
        containersHtml +=                            '<li class="default-info">Drag items here</li>';
        containersHtml +=                        '</ul>';
        containersHtml +=                    '</td>';
        containersHtml +=                    '<td>';
        containersHtml +=                        '<ul id="values-container" class="ui-widget-content  attribute-item-list ui-sortable" unselectable="on" style="-moz-user-select: none;">';
        containersHtml +=                        '</ul>';
        containersHtml +=                    '</td>';
        containersHtml +=                '</tr>';
        containersHtml +=            '</tbody>';
        containersHtml +=        '</table>';

    $(this).html(containersHtml, function(){alert('here');});

    $('#grid').append('<div id="run" title=".ui-icon-refresh" class="ui-state-default"><span class="ui-icon ui-icon-refresh"></span></div>');

    setItemsType(data);
    loadItems();
    setItemsValues(data);

    function unique(a)
    {
       var r = new Array();
       o:for(var i = 0, n = a.length; i < n; i++)
       {
          for(var x = 0, y = r.length; x < y; x++)
          {
             if(r[x]==a[i]) continue o;
          }
          r[r.length] = a[i];
       }
       return r;
    }


    function setItemsValues(items){
        for(var i=0; i<groupColumns; i++){
            var tempArray = [];
            for(var j=2; j<items.length; j++){
                tempArray[j-2]=items[j][i];
            }
            var distinctArray = unique(tempArray);
            $('#item'+i+' label').append(' ('+distinctArray.length+')');
            $('#item'+i).attr('values',distinctArray.length);
            for(var k in distinctArray){
	        $('#item'+i).append('<div filtered="0" style="display: none;" value="'+distinctArray[k]+'">'+distinctArray[k]+'<span class="filter ui-icon ui-icon-circle-check"></span><span class="unfilter ui-icon ui-icon-circle-close" style="display: none;"></span></div>');
	    }
        }

        $('.filter').click(function(){
            $(this).hide()
                   .parent().find('.unfilter').show().end()
                            .attr('filtered',1)
                            .parent().attr('values',$(this).parent().parent().attr('values')-1);
        });

        $('.unfilter').click(function(){
            $(this).hide()
                   .parent().find('.filter').show().end()
                            .attr('filtered',0)
                            .parent().attr('values',parseInt($(this).parent().parent().attr('values'))+1);
        });
    }

    function setItemsType(data){
        headersArray=data[0]
        rowTypesArray=data[1];
        for(var i in rowTypesArray){
            if(rowTypesArray[i]=='Group'){
                groupHeadersArray[groupHeadersArray.length]=headersArray[i];
                groupColumns++;
            }else if(rowTypesArray[i]=='Value'){
                valueHeadersArray[valueHeadersArray.length]=headersArray[i];
                valueColumns++;
            }
        }
    }

    function loadItems(){
        $('#items ul').html('');
        for(var i in groupHeadersArray){
            item  = '<li id="item'+i+'" class="group">';
            item += '   <span class="ui-icon ui-icon-arrowthick-2-n-s" style="float: left;"></span>';
            item += '   <label default-value="'+groupHeadersArray[i]+'">'+groupHeadersArray[i]+'</label>';
            item += '   <span class="open ui-icon ui-icon-carat-1-s"></span>';
            item += '   <span class="close ui-icon ui-icon-carat-1-n" style="display:none;"></span>';
            item += '</li>';
            $('#items ul').append(item);
        }
        var valuesHeader = 'Select a Value';
        if(valueColumns == 1){
            currentValue = groupColumns;
            valuesHeader = valueHeadersArray[0];
            openButton = '';
        }else{
            openButton = '   <span class="open ui-icon ui-icon-carat-1-s"></span>';
        }
        item  = '<li id="current-value">';
        item += '   <label default-value="Select a Value">'+valuesHeader+'</label>';
        item += openButton;
        for(var i in valueHeadersArray){
            idx=groupColumns+parseInt(i);
            item += '<div idx="'+idx+'" class="value-option" style="display:none;">'+valueHeadersArray[i]+'</div>';
        }
        item += '</li>';
        $('#values-container').append(item);

        $('.open').click(function(){
            $(this).hide();
            $(this).parent().find('label').html($(this).parent().find('label').attr('default-value')).end()
                            .find('div').show().end()
                            .find('.close').show().end()
                            .css('height','auto');
        });

        $('.close').click(function(){
            $(this).hide();
            $(this).parent().find('label').html($(this).parent().find('label').attr('default-value')).end()
                            .find('div').hide().end()
                            .find('.open').show().end()
                            .css('height','');
        });

        $('.value-option').click(function(){
            $(this).parent().find('label').html($(this).html()).end()
                            .find('div').hide().end()
                            .find('.open').show().end()
                            .css('height','');
            currentValue=$(this).attr('idx');
        });
    }

    

    $("#vertical-container, #horizontal-container, #pivotal-container").sortable({
            items: 'li:not(#current-value)',
            connectWith: '.attribute-item-list',
            update: function(event, ui) {
                if($(this).find('.group').size()>0)
                    $(this).find('.default-info').remove();
            }
    });

    $('#run').live('click', function(){
        if(currentValue != -1){
            $(this).remove();
            renderGrid()
        }else
            alert('Please Select a Value');
    });


    function renderGrid(){
        rows = 1;
        columns = 1;
        var tempArray = new Array();

        $('#vertical-container li').each(function(){
        	tempArray.push($(this).attr('values'));
        });

        for(var i = tempArray.length-1; i>=0; i--){
        	rows = rows*parseInt(tempArray[i])+1;
        }

        tempArray = new Array();
        $('#horizontal-container li').each(function(){
        	tempArray.push($(this).attr('values'));
        });

        for(var i = tempArray.length-1; i>=0; i--){
        	columns = columns*parseInt(tempArray[i])+1;
        }

        var table = '<table id="data-grid" cellpadding="5" cellspacing="0">';
        var printVal = '';
        var cellAttributes = '';
        var verticalItems = $('#vertical-container li').size();
        var horizontalItems = $('#horizontal-container li').size();
        var verticalItemsArray = new Array();
        for(var i = 1; i<= verticalItems; i++){
            verticalItemsArray[i] = new Array();
            var valuesInside = $('#vertical-container li:nth-child('+i+')').attr('values');
            for(var j=0; j< valuesInside; j++){
                verticalItemsArray[i][j]=$('#vertical-container li:nth-child('+i+') div[filtered=0]:eq('+j+')').attr('value');
            }
        }

        var horizontalItemsArray = new Array();
        for(var i = 1; i<= horizontalItems; i++){
            horizontalItemsArray[i] = new Array();
            var valuesInside = $('#horizontal-container li:nth-child('+i+')').attr('values');
            for(var j=0; j< valuesInside; j++){
                horizontalItemsArray[i][j]=$('#horizontal-container li:nth-child('+i+') div[filtered=0]:eq('+j+')').attr('value');
            }
        }

        var rowMappingArray = new Array(rows-1);
        var rowIndentingArray = new Array(rows-1);
        var step = rows;
        var indenting = '';
        for(var alpha=1; alpha<= verticalItems; alpha++){
            step = (step-1)/$('#vertical-container li:nth-child('+alpha+')').attr('values');
            var i = 1;
            var k = 0;
            while(i<rows){
                if(rowMappingArray[i-1]==null){
                    rowMappingArray[i-1]=verticalItemsArray[alpha][k];
                    rowIndentingArray[i-1]=alpha-1;
                    i+=step;
                    k++;
                    if(k>=verticalItemsArray[alpha].length){k=0;}
                }else{i++;}
            }
            indenting+='-';
        }

        var columnMappingArray = new Array(columns-1);
        var columnIndentingArray = new Array(columns-1);
        step = columns;
        indenting = '';
        for(var alpha=1; alpha<= horizontalItems; alpha++){
            step = (step-1)/$('#horizontal-container li:nth-child('+alpha+')').attr('values');
            var i = 1;
            var k = 0;
            while(i<columns){
                if(columnMappingArray[i-1]==null){
                    columnMappingArray[i-1]=horizontalItemsArray[alpha][k];
                    columnIndentingArray[i-1]=alpha-1;
                    i+=step;
                    k++;
                    if(k>=horizontalItemsArray[alpha].length){k=0;}
                }else{i++;}
            }
            indenting+='<br/>';
        }


        var lastRowAttributes='';
        var lastColumnAttributes='';
        var lastRowIndenting=0;
        var lastColumnIndenting=0;
        var currentColumnAttributesArray = new Array(columnIndentingArray.length);
        var currentRowAttributesArray = new Array(rowIndentingArray.length);
        for(var i = 0; i<=rows; i++){
            var rowAttributes;
            currentRowAttributesArray[rowIndentingArray[i-1]]=rowMappingArray[i-1];
            rowAttributes = getAttributes(currentRowAttributesArray,rowIndentingArray[i-1]);

            table += '<tr>';
        	for(var j = 0; j<=columns; j++){
        		if(i==0&&j==0)
        			printVal = '<div id="run" title=".ui-icon-refresh" class="ui-state-default"><span class="ui-icon ui-icon-refresh"></span></div>';
        		else if(i==0&&j==columns)
        			printVal = 'Total';
        		else if(i==rows&&j==0)
        			printVal = 'Total';
                        else if(i==0){
        	 		printVal = toStringIndenting(columnIndentingArray[j-1],true)+columnMappingArray[j-1];
                        }else if(j==0){
        	 		printVal = toStringIndenting(rowIndentingArray[i-1],false)+rowMappingArray[i-1];
                        }else{

                            var columnAttributes;
                            var cellFiltering='';
                            currentColumnAttributesArray[columnIndentingArray[j-1]]=columnMappingArray[j-1];
                            columnAttributes = getAttributes(currentColumnAttributesArray,columnIndentingArray[j-1]);
                            if(j==columns && i==rows){
                                cellAttributes='';
                                cellFiltering='';
                                $('#horizontal-container li div[filtered=1]').each(function(){
                                    cellFiltering += $(this).attr('value')+",";
                                });
                                $('#vertical-container li div[filtered=1]').each(function(){
                                    cellFiltering += $(this).attr('value')+",";
                                });
                            }else if(j==columns){
                                cellAttributes = rowAttributes;
                                cellFiltering='';
                                $('#horizontal-container li div[filtered=1]').each(function(){
                                    cellFiltering += $(this).attr('value')+",";
                                });

                            }else if(i==rows){
                                cellAttributes = columnAttributes;
                                cellFiltering='';
                                $('#vertical-container li div[filtered=1]').each(function(){
                                    cellFiltering += $(this).attr('value')+",";
                                });

                            }else{
                                cellAttributes =rowAttributes+','+columnAttributes;
                            }
                            if(cellAttributes=='')
                                var cellAttributesArray = new Array();
                            else
                                var cellAttributesArray = cellAttributes.split(',');

                            if(cellFiltering=='')
                                var cellFilteringArray = new Array();
                            else{
                                cellFiltering=cellFiltering.substr(0,cellFiltering.length-1)
                                var cellFilteringArray = cellFiltering.split(',');
                            }

                            printVal = getCellValue(cellAttributesArray,cellFilteringArray);
                        }
                        table += '<td i="'+i+'" j="'+j+'" attributes="'+cellAttributes+'" filtering="'+cellFiltering+'">'+printVal+'</td>';
        	}
        	table += '</tr>';
        }
        table += '</table>';

        $('#grid').html(table);
    }

    function getAttributes(attributesArray,depth){
        var result = '';
        for(var i = 0; i<=depth; i++){
            result += attributesArray[i]+",";
        }
        result = result.substr(0,result.length-1);
        return result;
    }

    function getCellValue(cellAttributesArray,cellFilteringArray){
        var value = 0;
        var attributesMatched = 0;

        for(var i = 2; i < data.length; i++){
            attributesMatched = 0;
            for(var j = 0; j < groupColumns; j++){
                if(data[i][j] in oc(cellAttributesArray)){
                    attributesMatched++;
                }
                if(data[i][j] in oc(cellFilteringArray)){
                    attributesMatched--;
                }
            }
            if(cellAttributesArray.length == attributesMatched){
                value+=data[i][currentValue];
            }
        }

        return value;
    }

    function oc(a){
      var o = {};
      for(var i=0;i<a.length;i++)
      {
        o[a[i]]='';
      }
      return o;
    }

    /*
     *
     **/
    function toStringIndenting(size,horizontal){
        var separator = '-';
        if(horizontal){
            separator = '<br/>';
        }
        if(size==0){
            return '';
        }else{
            for(var i = 2; i<=size; i++){
                separator += separator;
            }
            return separator;
        }
    }


};

})( jQuery );
