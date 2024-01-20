 oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    alert($("tr",$("#"+oTableTSC.row( rowIdx ).child().find("table")).dataTable()).html());
});


 oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    alert(oTableTSC.row( rowIdx ).child().find("table").attr("id"));
});


oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
alert($("#"+oTableTSC.row( rowIdx ).child().find("table").attr("id")).html());
});

oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    alert($("tr",$("#"+oTableTSC.row( rowIdx ).child().find("table").attr("id")).dataTable().fnGetNodes).html());
});


oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    dttble=$("#"+oTableTSC.row(rowIdx).child().find("table").attr("id")).dataTable();
    alert($("tr",dttble.fnGetNodes()).html());
});    

oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    alert($(oTableTSC.row(rowIdx).child().find("table")).html());
    
});    


oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    dttble=$(oTableTSC.row(rowIdx).child().find("table")).dataTable();
    alert($("tr",dttble.fnGetNodes()).html());
});    

oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    alert($("tr",$(oTableTSC.row(rowIdx).child().find("table")).dataTable()));
});    

oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    $("tr",$(oTableTSC.row(rowIdx).child().find("table")).dataTable()).find("tr").each(function(){  
        alert($(this).html());         
    });
});    

checkesChecked=new Array();
        oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
            oTableTSC.row( rowIdx ).child().find("input").each(function(){
                if($(this).prop("checked")){
                    checkesChecked.push($(this).attr("id").split("_")[1]);
                }
            });
            
                                
        });
        
        
checkesChecked=new Array();
oTableTSC.rows().eq( 0 ).each( function (rowIdx) {
    childTabla=oTableTSC.row( rowIdx ).child().find("table").dataTable();
    alert(childTabla instanceof DataTable);
    childTabla.rows().eq( 0 ).each( function (rowIdx2) {
        
    });

});



$(dataTableChild).each(function(index,val){
    val.rows().eq( 0 ).each( function (rowIdx){
        fila=val.row(rowIdx).cells().nodes();
        if($(fila).find("input").prop("checked")){
            alert($(fila).find("input").attr("id"));
        }

    });
});

$(dataTableChild).each(function(index,val){
    val.rows().eq( 0 ).each( function (rowIdx){
       fila=val.row(rowIdx).cell().nodes();
       $(fila).find("input").each(function(){
           
            console.log($(this).attr("id"));
           
       });
        
    });
});

$(dataTableChild).each(function(index,val){
       fila=val.rows().cell().nodes();
       $(fila).find("input").each(function(){
           if($(this).prop("checked")){
                console.log($(this).attr("id")+" Checked<------------------------------------------------");
           }else{
               console.log($(this).attr("id")+" No Checked");
           }
           
       });
});


$.each(osubTabla['Cuentas']['D'],function(index,filasS){
    filas+="<tr>";
    $.each(filasS,function(numFila,filaS){
        if(jQuery.inArray(numFila, encabezados)===-1){
           encabezados.push(numFila); 
        }
        alert(filasS.Id);
        return false;

    });
    filas+="</tr>";
});





























$(document).ready(function() {
	/* Apply the jEditable handlers to the table */
	$('#example tbody td').editable( function( sValue ) {
		/* Get the position of the current data from the node */
		var aPos = oTable.fnGetPosition( this );
		
		/* Get the data array for this row */
		var aData = oTable.fnGetData( aPos[0] );
		
		/* Update the data array and return the value */
		aData[ aPos[1] ] = sValue;
		return sValue;
	}, { "onblur": 'submit' } ); /* Submit the form when bluring a field */
	
	/* Init DataTables */
	oTable = $('#example').dataTable();
} );







