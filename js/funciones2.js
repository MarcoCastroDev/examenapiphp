// JavaScript Document

$(function()
{

/********************************variables Globales*****************************************************/
	var idRegistroFecha; //variable para obtener el id de la fecha del calendario a eliminar o editar
	var idRegistroParticipacion; //variable para obtener el id de la participacion
	var idRegistro;
	var idTabla;//variable para obtener el id de la tabla
	var table; //variable de la tabla dataTable
	var idInput;
	var totalCalculadoV=0;//total variable 
	var totalPresupuesto=0;//total presupuesto
	var costoPTInversion=0; //Inversion costo pt 
	var costoTPInversion=0; //costo promedio de tienda
	var totalVariableCal=0; //total variable al modificar detalle
	var totalCalculado=0; // totalCalculado 
    var totalCalculadoModificar=0; //total calculado a modificar
	var allC=0; //variable para guardar el porcentaje total de calculado
	var allV=0; //variable para guardar el porcentaje total de variable
	var allPL=0; //variable para guardar el presupuesto local 
	var tPresupuesto=0; // variable que guarda el presupuesto de cada clase articulo al momento de guardar
	var alto=""; //variable para guargar el alto en pixeles de una ventana
	var PPAAV=0; //variable para guardar el porcentaje permitido variable
	var PPAAC=0;
	var TPLG=0;//variable para guardar presupuesto local que no se altera
	var nnAjax=0;//variable para guardar el numero de registros que seran enviados por ajax
    var nAjax=0;//variable para guardar el numero de registros que seran enviados por ajax
	var tituloVentanaDialogoET=""; //variable que guarda el titulo de la ventana
	var accionFiltro=""; //varable que guarda la bandera de la accion a realizar deacuerdo al filtro seleccionado
	var costoXPiezas=0; // variable que guarda el costo por piezas que se calcula costoXPiezas=Ingreso/nPiezas 
	var baseName=window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);   
    var idcmb="";
	var nameUsuario="";
	var emailEnTabla="";
    var flagActive=-1;
	var tr;
	var cell;
/********************************variables Globales*****************************************************/



/*******************************************************************preguntasFrecuentes.php*******************************************************************/
if(baseName=='preguntasFrecuentes.php')
{
	$(document).on('click','#btnSearchEngine',function()
	{
		var pregunta=$.trim($('#txtBuscarFAQ').val());
		
			var data=
			{
				accion:'buscarPregunta',
				pregunta:pregunta,
			}
			
			$.ajax(
			{
				url:'../Php_Scripts/s_accionesPFUsuarios.php',
				data:data,
				dataType:'json',
				type:'POST',
				beforeSend: function(response)
				{
					$('#acordionPreguntasFrecuentes').html('<div style="text-align:center;" ><img src="Imagenes/loader3.gif" width="32" height="32" /></div>');
					
				},success: function(response)
				{
					$('#acordionPreguntasFrecuentes').html(response.tabla);
					if(response.respuesta=="si"){
					$('#acordionPreguntasFrecuentes').accordion("refresh");
					}
				},error:function(response)
				{
					$('#acordionPreguntasFrecuentes').html('');
		          alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				}
				
			});
			
		
		
	});
}
/*******************************************************************preguntasFrecuentes.php*******************************************************************/






/********************************************************************autorizacionesPresupuestos.php******************************************************************/

if(baseName=='autorizacionesPresupuestos.php')
{

/*revivir sesion*/
intervalo=15*1000;
setInterval(reviveSession,intervalo);
/*revivir sesion*/

/************************Funcion para reactivar sesion*****************************/
		function reviveSession(){
       
        $.ajax({
                
                url:'../Php_Scripts/revivesesion.php',
                type:  'GET',
				async:false,
                success:  function (ttr) {
                        //$("#sessionMsg").text(ttr);
                            console.log(ttr);
                        },
                 error: function(){
                          //$("#sessionMsg").text("Error al refrescar la session");
                          console.log("Error al refrescar la session");
                        },
                
                
        });
       
   } 
/************************Funcion para reactivar sesion*****************************/	


/*******************************Ver Presupuesto*******************************/
$(document).on('click','.verPresup',function()
{
	$(document).find('.disableEncLinPpto,.encLinPpto,.presupuestoAutorizado').removeClass('presupuestoSeleccionado'); //remover  la clase de presupuesto seleccionado del documento
	$(this).closest('.encLinIconPpto').closest('.disableEncLinPpto,.encLinPpto,.presupuestoAutorizado').addClass('presupuestoSeleccionado'); //poner clase de seleccion
	var idPresupuestoEnc=$(this).data('idpresupuestoenc');
	var encabezadoPresupuesto=$(this).data('preenc');
	
	
	cargaPPTO(idPresupuestoEnc);
	
});


/*ventana de dialogo para vizualizar presupuesto*/
$("#vtnDialogoVizualizarPresupuesto").dialog({
	autoOpen: false,
	title:'Visualización De Presupuesto',
	show:cea(),
	closeOnEscape: false,
        hide: {
			
            effect: cea(),
            duration: 500
        },
	draggable: true,
        modal:true,
	resizable: false,
         height:$(window).height()-($(window).height()*1/100),
        width:"99%",
	buttons: {
                'Cerrar': function(){
                     $(this).dialog('close');               
		 	},
		
		'Exportar Excel':function(event,ui)
		{
			if(!($('#tablePPTO').is(':visible')))
			{
				alertt("No hay datos para exportar.");
				
			}else
			{
			
			/*obtener encabezados de tabla*/
   				 encabezadosDeTabla=new Array();
  			     cuerpoDeTabla=new Array();
				 var count=0;
   			    $("#tablePPTO thead").find("th").each(function(){
        		if($(this).parent().attr("role")=='row'){
				if(count!=21){
					
            	encabezadosDeTabla.push($(this).text());
				}
					count++;
			
        		}
    		});
           /*obtener encabezados de tabla*/
		   
		   
		   /*obtener datos de cuerpo de tabla*/
		   $('#tablePPTO tbody tr').each(function(index, element) {
			
		
			if($(this).attr('class')!=undefined){
			/*btener datos*/   
            var oneOrCero=($(this).find('td').eq(0).hasClass('details-control'))?1:0;
			var cuenta=$(this).find('td').eq(1).text();
			var nCuenta=$(this).find('td').eq(2).text();
			var norma=$(this).find('td').eq(3).text();
			var nNorma=$(this).find('td').eq(4).text();
			var mCuenta=$(this).find('td').eq(5).text();
			var nCuentaMaestra=$(this).find('td').eq(6).text();
			var enero=$(this).find('td').eq(7).text();
			var febrero=$(this).find('td').eq(8).text();
			var marzo=$(this).find('td').eq(9).text();
			var abril=$(this).find('td').eq(10).text();
			var mayo=$(this).find('td').eq(11).text();
			var junio=$(this).find('td').eq(12).text();
			var julio=$(this).find('td').eq(13).text();
			var agosto=$(this).find('td').eq(14).text();
			var septiembre=$(this).find('td').eq(15).text();
			var octubre=$(this).find('td').eq(16).text();
			var noviembre=$(this).find('td').eq(17).text();
			var diciembre=($(this).find('td').eq(18).text());
			var totalAnual=$(this).find('td').eq(19).text();
			var filial=$(this).find('td').eq(20).find('select option:selected').text();
			/*obtener datos*/   
			
			
		   
			
			
			
			/*agregamos al array*/
			cuerpoDeTabla.push({oneOrCero:oneOrCero,cuenta:cuenta,nCuenta:nCuenta,norma:norma,nNorma:nNorma,mCuenta:mCuenta,nCuentaMaestra:nCuentaMaestra,enero:enero,febrero:febrero,marzo:marzo,abril:abril,mayo:mayo,junio:junio,julio:julio,agosto:agosto,septiembre:septiembre,octubre:octubre,noviembre:noviembre,diciembre:diciembre,totalAnual:totalAnual,filial:filial})
			/*agregamos al array*/
			}
        });
		   
		   
		   /*obtener datos de cuerpo de tabla*/
		   
		   
		   /*mandar datos via ajax*/
		   data=
		   {
			   accion:'gt',
			   encabezadosDeTabla:encabezadosDeTabla,
			   cuerpoDeTabla:cuerpoDeTabla
		   }
		   
		   $.post('../Php_Scripts/s_descargarPlantillaExcelVizualizar.php',data,function(response)
		   {
			   
			 
			  $(location).attr('href','../Php_Scripts/s_descargarPlantillaExcelVizualizar.php?accion=crearExcel');
		   });
		    /*mandar datos via ajax*/
   
		}
	  }
		
	}
	

}); 




/*******************************Ver Presupuesto*******************************/

/*Autorizar todos los presupuestos*/
$(document).on('click','.autorizarTodosPre',function()
{
	
	var content=$(this).closest('.rowPpto');
	var bandera=-1;
	var presupuestoNombre=$(this).data('presupuestonombre');
	var respuesta=false;
	$(content).find('.encLinPpto').each(function(index, element) {
		 bandera=index;
		
		 
	});
	if(bandera!=-1){
	$('#vtnDialogoEnvioDeEmail').html('<img src="Imagenes/questionMsj.png" style=" float:left; margin:10px;" /> Estas seguro que deseas autorizar todos los presupuestos de '+presupuestoNombre+'.');
	
							
							$('#vtnDialogoEnvioDeEmail').dialog(
								{
									title:'Mensaje Del Sistema',
									width:300,//TAMAÑO DEL FORM
									autoOpen:true,
									buttons:
									{
										'Si':function(event,ui)
										{
											var autorizarTodos = new Array();
											var enviarCorreos=new Array();
										   $(this).dialog('close');
										   /*recorrer todos los presupuestos para autorizar*/
										$(content).find('.encLinPpto').each(function(index, element) {
                                              
											/*obtener datos para autorizar presupuesto*/
											var autorizar='Y';
											var idRegistro=$(this).find('.autoPres').data('idautorizacion');
											var preEnc=$(this).find('.autoPres').data('preenc');
											var idUsuarioAutoriza=$(this).find('.autoPres').data('idnextuserautorized');
											var idPresupuestoEnc=$(this).find('.autoPres').data('idpresupuestoenc');
											var idPresupuestoGral=$(this).find('.autoPres').data('idpresupuestogral');
											/*obtener datos para autorizar presupuesto*/
											
									 /*agregar al array los datos del presupuesto a autorizar*/
									 autorizarTodos.push({idRegistro:idRegistro,autorizar:autorizar,comentario:''});
									 /*agregar al array los datos del presupuesto a autorizar*/		
											
											
						            /***********************************Agregar dayos a array para enviar correos*************************************/
															if(autorizar=='Y' && idUsuarioAutoriza!="" ){
																
												enviarCorreos.push({idPresupuestoEnc:idPresupuestoEnc,preEnc:preEnc,idUsuarioAutoriza:idUsuarioAutoriza,idPresupuestoGral:idPresupuestoGral});					
															
															
															}
									/***********************************Agregar dayos a array para enviar correos*************************************/	
													
								
    										});
									 /*recorrer todos los presupuestos para autorizar*/
									 
                                          	/***********enviar información por ajax***********/
											
											var data=
											{  
											    accion:'autorizarTodosPresup',
											    autorizarTodos:autorizarTodos,
												enviarCorreos:enviarCorreos
												
											}
											
											$.ajax({
														url:'../Php_Scripts/s_accionesAutorizacionesPresupuestos.php',
														type:'POST',
														dataType:'json',
														data:data,
														beforeSend: function(response)
														{
															$('#loader').bPopup({
															 onClose: function() {
															  response.abort();   
																   
																	}
														});
															
														},success: function(response)
														{
															$('#loader').bPopup().close();
															alertt('<img src="Imagenes/successMsj.png" style=" float:left; margin:10px;" /> ' + response.mensaje);
															setTimeout(function()
															{
																$('#customAlert').dialog("close");
																/*cargar todos los presupuestos*/
																var verSoloPresupuestoAutorizar=($('#chkVerPresupuestosParaAutorizar').is(':checked'))?1:0;
																cargarPresupuestos($('#txtNombrePresGralAP').data('id'),verSoloPresupuestoAutorizar,$('#txtNamePresupEnc').val())
																/*cargar todos los presupuestos*/
															},2500);
															
															
															
														},error:function(response)
														{
															$('#loader').bPopup().close();
														   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
														}
														});
											/***********enviar información por ajax***********/
									 
										},
										'No':function(event,ui)
										{
											
											$(this).dialog("close");
											
										}
									}
									
									
								});
								
								
	}else{
		alertt('<img src="Imagenes/exclamationMsj.png" style=" float:left; margin:10px;" /> No hay presupuestos que autorizar.');
	}
	
});
/*Autorizar todos los presupuestos*/



	
	
/*crear data dialog*/
$('#vtnDialogoEnvioDeEmail').dialog(
{
	
                closeOnEscape: true,
                scrollable: true,
				resizable: false,
				show:cea(),
				hide:cea(),
                modal: true,
				autoOpen:false,
				
				
				
				
});
/*crear data dialog*/	
	
	/*funcion para cargar presupuestos*/
	function cargarPresupuestos(idPresupuestoGral,verSoloPresupuestoAutorizar,nombre)
	{
		data=
		{
			accion:'cargarPresupuestos',
			clave:idPresupuestoGral,
			verSoloPresupuestoAutorizar:verSoloPresupuestoAutorizar,
			nombre:nombre
		}
		
		$.ajax({
			url:'../Php_Scripts/s_accionesAutorizacionesPresupuestos.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				$('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
				
			},success: function(response)
			{
				
				
				$('#loader').bPopup().close();
				$('#contentRowsPresupuesto').html(response.tabla); 
			},error:function(response)
			{
				$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			});
	}
	/*funcion para cargar presupuestos*/
	
	/*cargar presupuesto*/
	cargarPresupuestos($('#txtNombrePresGralAP').data('id'),0,$('#txtNamePresupEnc').val());
	/*cargar presupuesto*/
	
	/*crear ventana de dialogo*/
	$('#VtnDialogAutDesPres').dialog(
	{
	type:'modal',
	autoOpen:false,
	show:cea(),
	hide:cea(),
    modal: true,
	width:450,
	height:210,
	resizable:false,
	});
	/*crear ventana de dialogo*/
	
	
	
	/*enviar email para autorizacion de presupuesto*/
	
	$(document).on('click','.sendEmailAut',function()
	{
		var idUserAutoriza=$(this).data('userautoriza');
		var preEnc=$(this).data('preenc'); 
		var idPresupuestoEnc=$(this).data('idpresupuestoenc');
		var idPresupuestoGral=$(this).data('idpresupuestogral');
		
		$('#vtnDialogoEnvioDeEmail').html('<img src="Imagenes/questionMsj.png" style=" float:left; margin:10px;" /> Deseas enviar un correo para solicitar que se autorize el presupuesto '+preEnc+'?');
			
			$('#vtnDialogoEnvioDeEmail').dialog(
								{
									title:'Mensaje Del Sistema',
									width:300,//TAMAÑO DEL FORM
									autoOpen:true,
									buttons:
									{
										'Si':function(event,ui)
										{
											$(this).dialog('close');
											var data=
												{
													accion:'enviarCorreoAut',
													clave:idPresupuestoEnc,
													nombre:preEnc,
													idRegistro:idUserAutoriza,
													idPresupuestoGral:idPresupuestoGral
													
													
												}
												$.ajax(
												{
													url:'../Php_Scripts/s_accionesAutorizacionesPresupuestos.php',
													dataType:'json',
													data:data,
													type:'POST',
													beforeSend: function(response)
													{
															   $('#loader').bPopup({
														   onClose: function() {
															response.abort();   
																 
																  }
																});
													},success: function(response)
													{
														  
														   $('#loader').bPopup().close();
														   alertt('<img src="Imagenes/sendEmailAut.png" style="float:left; margin:10px;" />' + response.mensaje);
															setTimeout(function()
															{
																$('#customAlert').dialog("close");
															},2500);
													},error: function(response)
													{
														 $('#loader').bPopup().close();
														 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
													}
													
												});	
																			},
																			'No':function(event,ui)
																			{
																				$(this).dialog('close');
																			}
																		},
																	});
	});
	
	/*enviar email para autorizacion de presupuesto*/
	
	
	
	
	
	
	
	$(document).on('click','.findPresGral',function()
	{
		if(!($('.conTSearch').is(':visible'))){
		
		 /*Esconder menu desplegable*/
		 if($('#menuEscondible').is(':visible')){
		 $('#linkMenuEscondible').click(); 
		 }
		 /*Esconder menu desplegable*/
		 
		 $(document).find(".conTSearch").remove();
          var posicion = $(this).position();
          divBusqueda = '<div style="left:'+(posicion.left+-20)+'px;top:'+(posicion.top+30)+'px; height:310px; display:block;" class="conTSearch">';
          divBusqueda += '<div class="flechitaApunta"></div>';
          divBusqueda += '<div style="overflow:auto;height:300px;width:99%">';
          divBusqueda += '<table  style="background-color:transparent;position:relative;" id="tBusquedaPresupGral" align="center"  class="table" >';
          divBusqueda += '<thead>';
          divBusqueda += '<tr>';
          divBusqueda += '<th class="pintar-td-titulos-verde" >Clave De Presupuesto General</th>';
		  divBusqueda += '<th class="pintar-td-titulos-verde" >Nombre De Presupuesto General</th>';
          divBusqueda += '</tr>';
          divBusqueda += '<tr class="filaBusqueda">';
          divBusqueda += '<td  ><input placeholder="Clave."  id="txtClavePresupGral" maxlength="250" name="txtClavePresupGral" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
		  divBusqueda += '<td  ><input placeholder="Nombre."  id="txtNombreDePresupGral" maxlength="250" name="txtNombreDePresupGral" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '</tr>';
          divBusqueda += '</thead>';
          divBusqueda += '<tbody>';
          divBusqueda += '</tbody>';
          divBusqueda += '</table>';
          divBusqueda += '<img class="closeWind" src="Imagenes/close.png" />';
          divBusqueda += '</div>';
          $('#tFrmBusquedaPresuAP').append(divBusqueda);
          $('#txtClavePresupGral,#txtNombreDePresupGral').keyup();
		}
	});
	
	
	
	
	
	
	/*busqueda de presupuesto general*/
	$(document).on('keyup','#txtClavePresupGral,#txtNombreDePresupGral',function()
	{
		nombre=$('#txtNombreDePresupGral').val();
		clave=$('#txtClavePresupGral').val();
		
		data=
		{
			accion:'cargarTablaDePresupGral',
			clave:clave,
			nombre:nombre
		}
		
		$.ajax(
		{
			url:'../Php_Scripts/s_accionesAutorizacionesPresupuestos.php',
			dataType:'json',
			data:data,
			type:'POST',
			beforeSend: function(response)
			{
				$('#tBusquedaPresupGral tbody').html('<tr  data-nr="si" align="center"><td colspan="2" ><img src="Imagenes/loader3.gif" width="32" height="32" /></td></tr>');
			},success: function(response)
			{
				$('#tBusquedaPresupGral tbody').html(response.tabla);
				
			},error: function(response)
			{
				$('#tBusquedaPresupGral').html("");
				   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			
			
		});
		
		
	});
	/*busqueda de presupuesto general*/
	
	
	
	/*cerrar ventana de busqueda*/
	$(document).on('click','.closeWind',function()
	{
		 $(document).find(".conTSearch").remove();
	});
	/*cerrar ventana de busqueda*/
	
	
	/*poner nombre de presupuesto general y id*/
	$(document).on('click','#tBusquedaPresupGral tbody tr',function()
	{
		var nr=$(this).data('nr');
	    
		if(nr==undefined)
		{
			var nombre=$(this).data("nombre");
			var clave=$(this).data("clave");
			var anio=$(this).data("ano");
			var categoriapresupuesto=$(this).data("categoriapresupuesto");
			 
			$('#txtNombrePresGralAP').val((nombre.length>33)?nombre.substring(0,33)+'...':nombre);
			$('#txtNombrePresGralAP').data('id',clave);
			$('#txtNombrePresGralAP').data('ano',anio);
			$('#txtNombrePresGralAP').data('categoriapresupuesto',categoriapresupuesto);
			$(document).find(".conTSearch").remove();	
			$('#titlePresupuestoGral').text(nombre);
			var verSoloPresupuestoAAutorizar=($('#chkVerPresupuestosParaAutorizar').is(':checked'))?1:0;
			cargarPresupuestos(clave,verSoloPresupuestoAAutorizar,$('#txtNamePresupEnc').val());
			
			
			
			
			
		}
	});
	/*poner nombre de presupuesto general y id*/
	
	/*autorizar presupuesto*/
	$(document).on('click','.autoPres',function()
	{
		
    $(document).find('.disableEncLinPpto,.encLinPpto').removeClass('presupuestoSeleccionado'); //remover  la clase de presupuesto seleccionado del documento
	$(this).closest('.encLinIconPpto').closest('.disableEncLinPpto,.encLinPpto').addClass('presupuestoSeleccionado'); //poner clase de seleccion
		
	   ($(this).data('autorizado')=='Y')?$('#chkAutDesPres').prop('checked',false):$('#chkAutDesPres').prop('checked',true);
		var idRegistro=$(this).data('idautorizacion');
	    var preEnc=$(this).data('preenc');
		$('#txtComentarioPresupuestoAutDes').val($(this).data('comentario'));
		var idUsuarioAutoriza=$(this).data('idnextuserautorized');
        var idPresupuestoEnc=$(this).data('idpresupuestoenc');
		var idPresupuestoGral=$(this).data('idpresupuestogral');
		
		
			$('#VtnDialogAutDesPres').dialog(
			{
				title:'Acciones De Autorizacion De Presupuesto',
				autoOpen:true,
				buttons:
				{
					'Aceptar':function(event,ui)
					{
						/*modificamos el estatus del pesupuesto a autorizado o no*/
						//if(confirm("Estas seguro que deseas "+($('#chkAutDesPres').is(':checked')?'autorizar':'desautorizar')+" el presupuesto "+preEnc+"?")){
							
							$('#vtnDialogoEnvioDeEmail').html('<img src="Imagenes/questionMsj.png" style=" float:left; margin:10px;" /> Estas seguro que deseas '+($('#chkAutDesPres').is(':checked')?'autorizar':'desautorizar')+' el presupuesto '+preEnc+'?');
							
							$('#vtnDialogoEnvioDeEmail').dialog(
								{
									title:'Mensaje Del Sistema',
									width:300,//TAMAÑO DEL FORM
									autoOpen:true,
									buttons:
									{
										'Si':function(event,ui)
										{
											$(this).dialog('close');
											/***********/
											
											autorizar=($('#chkAutDesPres').is(':checked'))?'Y':'N';
							data=
							{
								accion:'autorizarPresupuesto',
								idRegistro:idRegistro,
								autorizar:autorizar,
								comentario:$('#txtComentarioPresupuestoAutDes').val(),
								idUsuarioAutoriza:idUsuarioAutoriza,
								idPresupuestoEnc:idPresupuestoEnc,
								
							}
							
							$.post('../Php_Scripts/s_accionesAutorizacionesPresupuestos.php',data,function(response)
							{
								var idPresupuestoGral=$('#txtNombrePresGralAP').data('id');
								var verSoloPresupuestoAutorizar =($('#chkVerPresupuestosParaAutorizar').is(':checked'))?1:0;
								
								if(response.respuesta=="si")
								{
									alertt('<img src="Imagenes/successMsj.png" style=" float:left; margin:10px;" />' + response.mensaje);
									setTimeout(function()
								{
									$('#customAlert').dialog("close");
									$('#VtnDialogAutDesPres').dialog("close");
									
									/***********************************enviar correo automatico*************************************/
									if(autorizar=='Y' && idUsuarioAutoriza!="" ){
									var data=
									{
										accion:'enviarCorreoAut',
									    clave:idPresupuestoEnc,
										nombre:preEnc,
										idRegistro:idUsuarioAutoriza,
										idPresupuestoGral:idPresupuestoGral
				
				
									}
									$.ajax(
									{
										url:'../Php_Scripts/s_accionesAutorizacionesPresupuestos.php',
										dataType:'json',
										data:data,
										type:'POST',
										beforeSend: function(response)
										{
												   $('#loader').bPopup({
											   onClose: function() {
												response.abort();   
													 
													  }
													});
										},success: function(response)
										{
											   
											   $('#loader').bPopup().close();
											   alertt('<img src="Imagenes/sendEmailAut.png" style=" float:left; margin:10px;" />' + response.mensaje);
												setTimeout(function()
												{
													$('#customAlert').dialog("close");
												},2500);
										},error: function(response)
										{
											 $('#loader').bPopup().close();
											 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
										}
										
									});	
									}
									/***********************************enviar correo automatico*************************************/
								},2500);
									cargarPresupuestos(idPresupuestoGral,verSoloPresupuestoAutorizar,$('#txtNamePresupEnc').val());
									
								}else
								{
								      
									  alertt('<img src="Imagenes/exclamationMsj.png" style=" float:left; margin:10px;" />' + response.mensaje);	
									  
								}
								
								
							},'json');
											
											/***********/
										},
										'No':function(event,ui)
										{
											
											$(this).dialog("close");
										}
									}
									
									
								});
							
							
							
						/*modificamos el estatus del pesupuesto a autorizado o no*/
					},
					'Cerrar':function(event,ui)
					{
						$(this).dialog('close')
					}
				}
			});
	});
	/*autorizar presupuesto*/
	
	
	/*ver solo presupuestos a autorizar*/
	$(document).on('change','#chkVerPresupuestosParaAutorizar',function()
	{
		var verSoloPresupuestoAAutorizar=($('#chkVerPresupuestosParaAutorizar').is(':checked'))?1:0;
		
		 var clave=$('#txtNombrePresGralAP').data('id')
		 cargarPresupuestos(clave,verSoloPresupuestoAAutorizar,$('#txtNamePresupEnc').val());
		 
		
		
	});
	/*ver solo presupuestos a autorizar*/
	
	
	
	/*buscar presupuesto enc*/
	$(document).on('keyup paste','#txtNamePresupEnc',function()
	{
		
		setTimeout(function(){
			
		var nombreEncPresupuesto=$('#txtNamePresupEnc').val();
		clave=$('#txtNombrePresGralAP').data('id');
		var verSoloPresupuestoAutorizar=($('#chkVerPresupuestosParaAutorizar').is(':checked'))?1:0;

		data=
		{
			accion:'cargarPresupuestos',
			clave:clave,
			nombre:nombreEncPresupuesto,
			verSoloPresupuestoAutorizar:verSoloPresupuestoAutorizar
		}
		
		$.ajax({
			url:'../Php_Scripts/s_accionesAutorizacionesPresupuestos.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				$('#contentRowsPresupuesto').html('<div style=" text-align:center;"><img src="Imagenes/loader3.gif" width="32" height="32" /></div>'); 
			},
			success: function(response)
			{
				
				
				$('#contentRowsPresupuesto').html(response.tabla); 
			},error:function(response)
			{
				$('#contentRowsPresupuesto').html("");
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			})
			
		},100);
		
	});
	/*buscar presupuesto enc*/
	
	
	
	
	
}


/********************************************************************autorizacionesPresupuestos.php******************************************************************/


















/****************************************************confYAsignacionDeCuentas.php********************************************************/

if(baseName=='confYAsignacionDeCuentas.php')
{
	$('#tabsAYCC').tabs(); //crear tabs
	$('#vtnDialogoConfCue').dialog(
	{
	type:'modal',
	autoOpen:false,
	show:cea(),
	hide:cea(),
    modal: true,
	width:1000,
	   height:720,
	resizable:false,
	});//creamos ventana de dialogo
	var active = $('#tabsAYCC').tabs( "option", "active" );
	flagActive=active;
	var oTableConfCue=DataTableEspanolByObj($('.tConfCue'));//crear data table 
	var oTableCuentasDet=DataTableEspanolByObjNonPagination($('#tCuentasDest'));//crear data table 
	var oTableCuentasOri=DataTableEspanolByObjNonPagination($('#tCuentasOri'));
	
	cargarConfiguracionYAsignacionDeCuentas("TO","-1"); //cargar catalogo de configuracion de cuentas
	
	
	
	/*eliminar configuracion y asignacion de cuentas*/
	$(document).on('click','.deleteConfCueDest',function()
	{
		var empresaD=$('#cmbEmpresaCuentaDest option:selected').val();
		var cuentaD=$(this).closest('table tbody tr').find('td').eq(0).text();
		var normaD=$(this).closest('table tbody tr').find('td').eq(1).text();
		if(confirm("Está seguro de eliminar todos los datos de configuración que conciernen a la cuenta "+cuentaD+"  de la empresa "+$('#cmbEmpresaCuentaDest option:selected').text()+"? \n  Todos los datos serán eliminados. ")){
		data=
		{
			accion:'deleteConfCueDest',
			empresaDestino:empresaD,
			cuentaDestino:cuentaD,
			normaDestino:normaD
		}
		
		$.post('../Php_Scripts/s_accionesConfCue.php',data,function(response)
		{
			alertt(response.mensaje);
			 setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							$('#vtnDialogoConfCue').dialog("close");
			                 
						   },2500);
			
		},'json');
		}
		
	});

	
	
	/*modificar configuracion y asignacion de cuentas*/
	$(document).on('click','.modificarConfCue',function()
	{
		/*obtener valores*/
		var idRegistro=$(this).closest('table tbody tr').find('td').eq(0).text();
		var empresaD=$(this).data("empresad");
		var empresaO=$(this).data("empresao");
		var cuentaD=$(this).closest('table tbody tr').find('td').eq(5).text();
		var normaD=$(this).closest('table tbody tr').find('td').eq(6).text();
		var cuentaO=$(this).closest('table tbody tr').find('td').eq(2).text();
		var normaO=$(this).closest('table tbody tr').find('td').eq(3).text();
		/*obtener valores*/
		
		
		$('#vtnDialogoConfCue').dialog(
		{
			autoOpen:true,
			title:'Modificar Configuración y Asignación De Cuentas',
			width:1000,
	        height:720,
			open:function(event,ui)
			{
				$('#contVtnConfCueAdd').show();
				//poner valores en de empresas combobox
				$('#tFrmCuentaDestino #cmbEmpresaCuentaDest').val(empresaD);
				$('#tFrmCuentaDestino #cmbEmpresaCuentaDest').attr('disabled',true);
				$('#tFrmCuentaDestino #cmbEmpresaCuentaDest').addClass('disabled');
				$('#tFrmCuentaOrigen #cmbEmpresaCuentaOri').val(empresaO)
				$('#tFrmCuentaOrigen #cmbEmpresaCuentaOri').attr('disabled',true);
				$('#tFrmCuentaOrigen #cmbEmpresaCuentaOri').addClass('disabled');
				
				//poner valores en de empresas combobox
				
				data=
				{
					accion:'sacarDatosDeCuenta',
					empresa:empresaD,
					numeroCuenta:cuentaD,
                                        idRegistro:idRegistro
				}
				
				//traer demas valores de cuenta destino
				$.post('../Php_Scripts/s_accionesConfCue.php',data,function(response)
				{
				 //agregar fila for dafault al catalogo de cuentas origen
				
				oTableCuentasDet.clear();  
	            oTableCuentasDet.row.add(
			    [
	  			cuentaD,
	  			normaD,
	  			response.tabla['nombreDeCuenta'],
			    response.tabla['cuentaMaestra'],
			    response.tabla['nombreDeCuentaMaestra'],
				'<img src="Imagenes/delete.png" width="16" height="16" alt="EliminarConfiguracionCue" style=" cursor:pointer;" class="deleteConfCueDest" title="Eliminar configuración  y asignación de cuentas."/>', 
				]
				).draw();
				oTableCuentasDet.columns.adjust();
			    //agregar fila for dafault al catalogo de cuentas origen	
                            
                            $("#cmbTipoAdr").val( response.tabla['tipox']);
				},'json');
				
				
				data=
				{
					accion:'sacarDatosDeCuenta',
					empresa:empresaO,
					numeroCuenta:cuentaO
				}
				
				//traer demas valores de cuenta destino
				$.post('../Php_Scripts/s_accionesConfCue.php',data,function(response)
				{
				
			     oTableCuentasOri.clear();  
			     oTableCuentasOri.row.add(
			    [
	  			cuentaO+' '+'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaOrigen" style=" cursor:pointer;"  />',
	  		    response.tabla['nombreDeCuenta'],
			    response.tabla['cuentaMaestra'],
			    response.tabla['nombreDeCuentaMaestra'],
			    '',
				]
				).draw();
			   oTableCuentasOri.columns.adjust();
				 		
				},'json');
				
				
				
				//cargar normas  destino
			   cargarNormasOrigenUPD($('#cmbEmpresaCuentaOri option:selected').val(),cuentaO);
			   $(document).find(".conTSearch").remove();//quitar ventana de busqueda
				//cargar normas  destino
				
			},
			buttons:
			{
				'Modificar':function(event,ui)
				{
					/********************************************validaciones********************************************/
					
					if($('#tCuentasDest tbody tr').find('td').eq(0).text()=='')
					{
						$('#tCuentasDest tbody tr').css({'background-color':'#f8cc41'});
						alertt("Agrega los datos de la  cuenta destino.");
						return false;
					}else if($.trim($('#tCuentasDest tbody tr').find('td').eq(1).text())=="")
					{
						
						$('#tCuentasDest tbody tr').find('td').eq(1).css({'background-color':'#f8cc41'});
						alertt("Agrega la norma a la cuenta destino.");
						return false;
					}
					 if($('#tCuentasOri tbody tr').find('td').eq(0).text()=='')
					{
						$('#tCuentasOri tbody tr').css({'background-color':'#f8cc41'});
						alertt("Agrega los datos de la  cuenta origen.");
						return false;
					
						
					}
					
					 
					 var normasOriPorcent=new Array();
					 var nuevosNormasOriPorcent=new Array();
					 
					 /*agregar normas destino que seran modificadas*/
					 $('#tNormasOri tbody tr').each(function(index, element) {
						 var checkBox=$(this).find('td').eq(3).find('input');
						 var inputText=$(this).find('td').eq(2).find('input');
						 var normaOrigen=$(this).find('td').eq(0).text();
						 var id=$(this).find('td').eq(3).find('input').data('id');
						 
                        if(id!=undefined)
						{
							var checked=($(checkBox).is(':checked'))?'N':'Y';
							var valor=($(inputText).val()=="")?'17':$(inputText).val();
							normasOriPorcent.push({porcentaje:valor,normaOrigen:normaOrigen,id:id,checked:checked}); 
							
							
						}else
						{
							if($(checkBox).is(':checked')){
							nuevosNormasOriPorcent.push({porcentaje:$(inputText).val(),normaOrigen:normaOrigen});
							
						}
						}
						
                    });
					 /*agregar normas destino*/
					
					 
					 
					 data=
					 {
						 normasOrigenPorcent:normasOriPorcent,
						 normaDestino:$('#tCuentasDest tbody tr').find('td').eq(1).text(),
						 empresaOrigen:$('#cmbEmpresaCuentaOri option:selected').val(),
						 empresaDestino:$('#cmbEmpresaCuentaDest').val(),
						 cuentaOrigen:$('#tCuentasOri tbody tr').find('td').eq(0).text(),
						 cuentaDestino:$('#tCuentasDest tbody tr').find('td').eq(0).text(),
						 nuevasNormasOrigenPorcent:nuevosNormasOriPorcent,
						 accion:'modificarConfiguracionYAsignacionDeCuentas',
                                                  tipoConfig:$('#cmbTipoAdr').val(),
					 }
					 
					
					$.ajax(
		            {
			url:'../Php_Scripts/s_accionesConfCue.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
						
					
						
            });
				
			},success:function(response)
			{
				
				
				$('#loader').bPopup().close();
				if(response.respuesta=="si")
				{
					alertt(response.mensaje);
					 setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							$('#vtnDialogoConfCue').dialog("close");
			                var active=$('#tabsAYCC').tabs('option','active');
		                    $('#tabsAYCC ul li').each(function(index, element) {
			                if(active==index){
				            var empresa=($(this).find('a').attr('href')).substring(1);
							
				cargarConfiguracionYAsignacionDeCuentas(empresa,$('#cmbEmpresaDestinoConfCue option:selected').val());
				 
			 }
		});
						   },2500);
				}else
				{
					if(response.fo=='noNormasSelec')
					{
						 $('#tNormasOri tbody tr').each(function(index, element) {
                         $(this).find('td').eq(3).css({'background-color':'#f8cc41'});
							
                        });
						
						$('.chkNormasOrigen').click(function()
							{
								 $('#tNormasOri tbody tr').each(function(index, element) {
								$(this).find('td').eq(3).removeAttr('style');
								 });
							}); 	
					}else if(response.fo=='porcentaje')
					{
						$('#tNormasOri tbody tr').each(function(index, element) {
							var idInputText=$(this).find('td').eq(2).find('input').attr('id');
							var checkBox=$(this).find('td').eq(3).find('input');
							var inputText=$(this).find('td').eq(2).find('input');
							
							if($(checkBox).is(':checked')){
							if($.trim($(inputText).val())=="")
							{
								$('#'+idInputText).addClass('formulario-inputs-alert');
								$('#'+idInputText).focus();
							}
							
							if(!($.isNumeric($(inputText).val())))
							{
								$('#'+idInputText).addClass('formulario-inputs-alert');
								$('#'+idInputText).focus();
							}
							 if(parseFloat($(inputText).val())<=0)
							 {
								 $('#'+idInputText).addClass('formulario-inputs-alert');
								 $('#'+idInputText).focus();
							 }
							
							}
						});
						$(document).on('input keyup','#tNormasOri input[type="text"]',function()
						{
							$('#tNormasOri input[type="text"]').removeClass('formulario-inputs-alert');
						});
					}else if(response.fo=='porcentajeMayor')
					{
						$('#tNormasOri tbody tr').each(function(index, element) {
							var idInputText=$(this).find('td').eq(2).find('input').attr('id');
							var checkBox=$(this).find('td').eq(3).find('input');
							var inputText=$(this).find('td').eq(2).find('input');
							
							if($(checkBox).is(':checked')){
							if($.trim($(inputText).val())!="")
							{
								$('#'+idInputText).addClass('formulario-inputs-alert');
								$('#'+idInputText).focus();
							}
							
							}
						});
						
						$(document).on('input keyup','#tNormasOri input[type="text"]',function()
						{
							$('#tNormasOri input[type="text"]').removeClass('formulario-inputs-alert');
						});
						
					}
					alertt(response.mensaje);
				}
			
            
				
			},error:function(response)
			{
				$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		});
					
				},'Cerrar':function(event,ui)
				{
					$(this).dialog('close');
				}
			}
		});
	});
	/*modificar configuracion y asignacion de cuentas*/
	
	
	
	
	
	
	
	/*eliminar configuracion Y asignacion De Cuentas*/
	$(document).on('click','.deleteConfCue',function()
	{
		var tr =$(this).closest('table tbody tr');
		var idRegistro=$(this).closest('table tbody tr').find('td').eq(0).text();
		
		data=
		{
			accion:'eliminarConfAsig',
			idRegistro:idRegistro
		}
		
		if(confirm("Esta seguro que desea eliminar la configuracion y asignacion de cuenta con Id "+idRegistro+"?"))
		{
			$.post('../Php_Scripts/s_accionesConfCue.php',data,function(response)
			{
				$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
	            $('.mensajeSatisfactorio').fadeOut(15000);
				oTableConfCue.row(tr).remove().draw();
				oTableConfCue.columns.adjust();//ajustar contenido a la tabla
				
			},'json');
		}
		
	});
	/*eliminar configuracion Y asignacion De Cuentas*/
	
	
	
	
	
	
	
	/*funcion para cargar tabla de configuraciones y asignación de cuentas*/
	function cargarConfiguracionYAsignacionDeCuentas(empresaOrigen,empresaDestino)
	{
		
		
		data=
		{
			accion:'cargarCatalgoConfCuentas',
			empresaOrigen:empresaOrigen,
			empresaDestino:empresaDestino,
		}
		$.ajax(
		{
			url:'../Php_Scripts/s_accionesConfCue.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
			},success:function(response)
			{
				
			
			$('#loader').bPopup().close();
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
	        $('.mensajeSatisfactorio').fadeOut(15000);
			oTableConfCue.clear().draw();//limpiar tabla
            oTableConfCue.rows.add(response.tabla);//agregar datos a la tabla
			oTableConfCue.draw();
            oTableConfCue.columns.adjust();//ajustar contenido a la tabla
				
			},error:function(response)
			{
				$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		});
		
	}
	/*funcion para cargar tabla de configuraciones y asignación de cuentas*/
	
	
	$(document).on('click','.ui-tabs-anchor',function()
	{
		var empresaOrigen=($(this).closest('a').attr('href')).substr(1);
		var empresaDestino=$('#cmbEmpresaDestinoConfCue option:selected').val();
		var active = $('#tabsAYCC').tabs( "option", "active" );
		if(flagActive!=active){
		flagActive=active;
		cargarConfiguracionYAsignacionDeCuentas(empresaOrigen,empresaDestino);
		
		}
		
	});
	
	
	/*cargar datos de catalogo al seleccionar empresa destino*/
	$(document).on('change','#cmbEmpresaDestinoConfCue',function()
	{
		var empresaDestino=$('#cmbEmpresaDestinoConfCue option:selected').val();
		var active = $('#tabsAYCC').tabs( "option", "active" );
		$('#tabsAYCC ul li').each(function(index, element) {
             
			 if(active==index)
			 {
				var empresaOrigen=($(this).find('a').attr('href')).substring(1);
				
				cargarConfiguracionYAsignacionDeCuentas(empresaOrigen,empresaDestino);
				return false;
				 
			 }
        });
		
	});
	/*cargar datos de catalogo al seleccionar empresa destino*/
	
	
	
	
	
	/*tabla para normas destino*/
	var oTableNormasOrigen=$('#tNormasOri').DataTable(
		{
			"iDisplayLength": -1,
		     "scrollY": 150,
			
			"bJQueryUI":false,
			
			"sPaginationType": "full_numbers",
			
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious":"Anterior"
                },

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

} 
			
		});
/*tabla para normas destino*/	
	
	
	//agregamos conf de cuentas
	
	$(document).on('click','#btnAgregarConfCue',function()
	{
                $("#cmbTipoAdr").val(0);
		$('#vtnDialogoConfCue').dialog(
		{
			autoOpen:true,
			title:'Agregar Configuración y Asignación De Cuentas',
			width:1000,
	           height:720,
			open:function(event,ui)
			{
				$('#contVtnConfCueAdd').show();
				//resetar combobox
				$('#tFrmCuentaDestino #cmbEmpresaCuentaDest').children().removeAttr('selected');
				$('#tFrmCuentaOrigen #cmbEmpresaCuentaOri').children().removeAttr('selected');
				$('#tFrmCuentaDestino #cmbEmpresaCuentaDest').attr('disabled',false);
				$('#tFrmCuentaDestino #cmbEmpresaCuentaDest').removeClass('disabled');
			    $('#tFrmCuentaOrigen #cmbEmpresaCuentaOri').attr('disabled',false);
				$('#tFrmCuentaOrigen #cmbEmpresaCuentaOri').removeClass('disabled');
				//resetar combobox
				//cargar normas  destino
			   cargarNormasOrigen($('#cmbEmpresaCuentaOri option:selected').val());
			   oTableNormasOrigen.columns.adjust();//ajustar contenido a la tabla
			   $(document).find(".conTSearch").remove();//quitar ventana de busqueda
				//cargar normas  destino
				
				
				//agregar fila for dafault al catalogo de cuentas origen
				
				oTableCuentasDet.clear();  
	            oTableCuentasDet.row.add(
			    [
	  			'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaDestino" style=" cursor:pointer;"   />',
	  			'',
	  			'',
			    '',
			    '',
				'', 
				]
				).draw();
				oTableCuentasDet.columns.adjust();
			  
			   
			     oTableCuentasOri.clear();  
			     oTableCuentasOri.row.add(
			    [
	  			'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaOrigen" style=" cursor:pointer;"  />',
	  			'',
	  			'',
			    '',
			    '',
				]
				).draw();
			   oTableCuentasOri.columns.adjust();
			   
				
				
			},
			buttons:
			{
				'Agregar':function(event,ui)
				{
					/********************************************validaciones********************************************/
					
					if($('#tCuentasDest tbody tr').find('td').eq(0).text()=='')
					{
						$('#tCuentasDest tbody tr').css({'background-color':'#f8cc41'});
						alertt("Agrega los datos de la  cuenta destino.");
						return false;
					}else if($.trim($('#tCuentasDest tbody tr').find('td').eq(1).text())=="")
					{
						
						$('#tCuentasDest tbody tr').find('td').eq(1).css({'background-color':'#f8cc41'});
						alertt("Agrega la norma a la cuenta destino.");
						return false;
					}
					 if($('#tCuentasOri tbody tr').find('td').eq(0).text()=='')
					{
						$('#tCuentasOri tbody tr').css({'background-color':'#f8cc41'});
						alertt("Agrega los datos de la  cuenta origen.");
						return false;
					
						
					}
					
					 
					 var normasOriPorcent=new Array();
					 
					 /*agregar normas destino*/
					 $('#tNormasOri tbody tr').each(function(index, element) {
						 var checkBox=$(this).find('td').eq(3).find('input');
						 var inputText=$(this).find('td').eq(2).find('input');
						 var normaOrigen=$(this).find('td').eq(0).text();
                        if($(checkBox).is(':checked'))
						{
							
							normasOriPorcent.push({porcentaje:$(inputText).val(),normaOrigen:normaOrigen});
							
						}
                    });
					 /*agregar normas destino*/
					 
					 
					 
					 data=
					 {
						 normasOrigenPorcent:normasOriPorcent,
						 normaDestino:$('#tCuentasDest tbody tr').find('td').eq(1).text(),
						 empresaOrigen:$('#cmbEmpresaCuentaOri option:selected').val(),
						 empresaDestino:$('#cmbEmpresaCuentaDest').val(),
						 cuentaOrigen:$('#tCuentasOri tbody tr').find('td').eq(0).text(),
						 cuentaDestino:$('#tCuentasDest tbody tr').find('td').eq(0).text(),
						 accion:'agregarConfiguracionYAsignacionDeCuentas',
                                                 tipoConfig:$('#cmbTipoAdr').val(),
					 }
					 
					
					$.ajax(
		            {
			url:'../Php_Scripts/s_accionesConfCue.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
						
					
						
            });
				
			},success:function(response)
			{
				$('#loader').bPopup().close();
				if(response.respuesta=="si")
				{
					alertt(response.mensaje);
					 setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							
							var active=$('#tabsAYCC').tabs('option','active');
		                    $('#tabsAYCC ul li').each(function(index, element) {
			                if(active==index){
				            var empresa=($(this).find('a').attr('href')).substring(1);
				cargarConfiguracionYAsignacionDeCuentas(empresa,$('#cmbEmpresaDestinoConfCue option:selected').val())
			
				 
			 }
		});
							
						   },2500);
				}else
				{
					if(response.fo=='noNormasSelec')
					{
						 $('#tNormasOri tbody tr').each(function(index, element) {
                         $(this).find('td').eq(3).css({'background-color':'#f8cc41'});
							
                        });
						
						$('.chkNormasOrigen').click(function()
							{
								 $('#tNormasOri tbody tr').each(function(index, element) {
								$(this).find('td').eq(3).removeAttr('style');
								 });
							}); 	
					}else if(response.fo=='porcentaje')
					{
						$('#tNormasOri tbody tr').each(function(index, element) {
							var idInputText=$(this).find('td').eq(2).find('input').attr('id');
							var checkBox=$(this).find('td').eq(3).find('input');
							var inputText=$(this).find('td').eq(2).find('input');
							
							if($(checkBox).is(':checked')){
							if($.trim($(inputText).val())=="")
							{
								$('#'+idInputText).addClass('formulario-inputs-alert');
								$('#'+idInputText).focus();
							}
							
							if(!($.isNumeric($(inputText).val())))
							{
								$('#'+idInputText).addClass('formulario-inputs-alert');
								$('#'+idInputText).focus();
							}
							 if(parseFloat($(inputText).val())<=0)
							 {
								 $('#'+idInputText).addClass('formulario-inputs-alert');
								 $('#'+idInputText).focus();
							 }
							
							}
						});
						$(document).on('input keyup','#tNormasOri input[type="text"]',function()
						{
							$('#tNormasOri input[type="text"]').removeClass('formulario-inputs-alert');
						});
					}else if(response.fo=='porcentajeMayor')
					{
						$('#tNormasOri tbody tr').each(function(index, element) {
							var idInputText=$(this).find('td').eq(2).find('input').attr('id');
							var checkBox=$(this).find('td').eq(3).find('input');
							var inputText=$(this).find('td').eq(2).find('input');
							
							if($(checkBox).is(':checked')){
							if($.trim($(inputText).val())!="")
							{
								$('#'+idInputText).addClass('formulario-inputs-alert');
								$('#'+idInputText).focus();
							}
							
							}
						});
						
						$(document).on('input keyup','#tNormasOri input[type="text"]',function()
						{
							$('#tNormasOri input[type="text"]').removeClass('formulario-inputs-alert');
						});
						
					}
					alertt(response.mensaje);
				}
			
            
				
			},error:function(response)
			{
				$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		});
					
				},'Cerrar':function(event,ui)
				{
					$(this).dialog('close');
				}
			}
		});
	});
	//agregamos conf de cuentas
	
	
	
	function cargarNormasOrigenUPD(empresaOrigen,numeroCuenta)
	{
		
		data=
		{
			accion:'cargarCatalogoCuentasOrigenUPD',
			empresaOrigen:empresaOrigen,
			numeroCuenta:numeroCuenta
			
		}
		$.ajax(
		{
			url:'../Php_Scripts/s_accionesConfCue.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
			},success:function(response)
			{
				
			
			 $('#loader').bPopup().close();
			oTableNormasOrigen.clear();//limpiar tabla
            oTableNormasOrigen.rows.add(response.tabla);//agregar datos a la tabla
			oTableNormasOrigen.draw();
			oTableNormasOrigen.columns.adjust();//ajustar contenido a la tabla
			},error:function(response)
			{
				$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		});
		
	}
	
	
	
	
	
	
	/*funcion para cargar normas de cuenta destino*/
	function cargarNormasOrigen(empresaOrigen)
	{
		data=
		{
			accion:'cargarCatalogoCuentasOrigen',
			empresaOrigen:empresaOrigen,
			
		}
		$.ajax(
		{
			url:'../Php_Scripts/s_accionesConfCue.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
			},success:function(response)
			{
				
			
			 $('#loader').bPopup().close();
			oTableNormasOrigen.clear();//limpiar tabla
            oTableNormasOrigen.rows.add(response.tabla);//agregar datos a la tabla
			oTableNormasOrigen.draw();
			oTableNormasOrigen.columns.adjust();//ajustar contenido a la tabla
			var normaCodeDestino=$('#tCuentasDest tbody tr').find('td').eq(1).text();
			/*buscar norma code origen en norma code destino y ponerle en estado por default*/
			$('#tNormasOri tbody tr').each(function(index, element) {
                var normaCodeOrigen=$.trim($(this).find('td').eq(0).text());
				var inputText=$(this).find('td').eq(2).find('input');
				var checkBox=$(this).find('td').eq(3).find('input');
				if(normaCodeDestino==normaCodeOrigen)
				{
					$(inputText).removeClass('disabled');
					$(inputText).attr('readonly',false);
					$(checkBox).prop('checked',true);
					$(inputText).val(100);
					
				}
            });
            
				
			},error:function(response)
			{
				$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		});
		
	}
	/*funcion para cargar normas de cuenta destino*/
	
	
	/*desplegar cuenta destino busqueda*/
	$(document).on('click','.searchCuentaDestino',function()
	{
		/*quitamos mensajes informativos*/
		$('#tCuentasDest tbody tr').removeAttr('style'); 
		/*quitamos mensajes informativos*/
		 $(document).find(".conTSearch").remove();
		  tr=$(this).closest('table tr');
          var posicion = $(this).position();
          divBusqueda = '<div style="left:'+(posicion.left+-20)+'px;top:'+(posicion.top+30)+'px; height:310px; display:block;" class="conTSearch">';
          divBusqueda += '<div class="flechitaApunta"></div>';
          divBusqueda += '<div style="overflow:auto;height:300px;width:99%">';
          divBusqueda += '<table  style="background-color:transparent;position:relative;" id="tBusquedaCuentaDestino" align="center"  class="table"   >';
          divBusqueda += '<thead>';
          divBusqueda += '<tr>';
          divBusqueda += '<th class="pintar-td-titulos-verde" >Cuenta Destino</th>';
		  divBusqueda += '<th class="pintar-td-titulos-verde" >Nombre De Cuenta Destino</th>';
          divBusqueda += '</tr>';
          divBusqueda += '<tr class="filaBusqueda">';
          divBusqueda += '<td  ><input placeholder="Cuenta."  id="txtCuentaDestino" maxlength="250" name="txtCuentaDestino" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
		  divBusqueda += '<td  ><input placeholder="Nombre De Cuenta."  id="txtNombreDeCuentaDestino" maxlength="250" name="txtNombreDeCuentaDestino" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '</tr>';
          divBusqueda += '</thead>';
          divBusqueda += '<tbody>';
          divBusqueda += '</tbody>';
          divBusqueda += '</table>';
          divBusqueda += '<img class="closeWind" src="Imagenes/close.png" />';
          divBusqueda += '</div>';
          $('#tCuentasDest').append(divBusqueda);
          $('#txtCuentaDestino,#txtNombreDeCuentaDestino').keyup();
		  
		
	});
	/*desplegar cuenta destino busqueda*/
	
	
	/*desplegar norma destino*/
	$(document).on('click','.searchNormaDestino',function()
	{
	    /*quitar mensajes de alerta*/
		$('#tCuentasDest tbody tr').find('td').eq(1).removeAttr('style');
		/*quitar mensajes de alerta*/

		 $(document).find(".conTSearch").remove();
          cell=oTableCuentasDet.cell($(this).closest('table tr').find('td').eq(1)); //obtenemos la celda que queremos modificar
          var posicion = $(this).position();
          divBusqueda = '<div style="left:'+(posicion.left+-20)+'px;top:'+(posicion.top+30)+'px; height:310px; display:block;" class="conTSearch">';
          divBusqueda += '<div class="flechitaApunta"></div>';
          divBusqueda += '<div style="overflow:auto;height:300px;width:99%">';
          divBusqueda += '<table  style="background-color:transparent;position:relative;" id="tfiltraNormasDestino" align="center"  class="table"   >';
          divBusqueda += '<thead>';
          divBusqueda += '<tr>';
		  divBusqueda += '<th class="pintar-td-titulos-verde" >Código De Norma Destino</th>';
          divBusqueda += '<th class="pintar-td-titulos-verde" >Nombre De Norma Destino</th>';
          divBusqueda += '</tr>';
          divBusqueda += '<tr class="filaBusqueda">';
		  divBusqueda += '<td  ><input placeholder="Código de norma."  id="txtCodNormaDestino" maxlength="250" name="txtCodNormaDestino" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '<td  ><input placeholder="Nombre de norma."  id="txtNomNormaDestino" maxlength="250" name="txtNomNormaDestino" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '</tr>';
          divBusqueda += '</thead>';
          divBusqueda += '<tbody>';
          divBusqueda += '</tbody>';
          divBusqueda += '</table>';
          divBusqueda += '<img class="closeWind"   src="Imagenes/close.png" />';
          divBusqueda += '</div>';
          $('#tCuentasDest').append(divBusqueda);
          $('#txtNomNormaDestino,#txtCodNormaDestino').keyup();
	});
	/*desplegar norma destino*/
	
	/*cargar normas de empresas*/
	$(document).on('keyup','#txtNomNormaDestino,#txtCodNormaDestino',function()
	{
		var norma=$('#txtCodNormaDestino').val();
		var nombreNorma=$('#txtNomNormaDestino').val();
		
		 data=
	   {
		   accion:'cargarNormasDeEmpresas',
		   norma:norma,
		   nombreNorma:nombreNorma,
		   empresaOrigen:$('#cmbEmpresaCuentaDest option:selected').val()
	   }
	   
	  
	   $.ajax({
	    type:'POST',
		dataType:'json',
		data:data,
		url:'../Php_Scripts/s_accionesConfCue.php',
		beforeSend: function(response)
		{
			$('#tfiltraNormasDestino tbody').html('<tr  align="center" data-nr="si"><td colspan="2" ><img src="Imagenes/loader3.gif" width="32" height="32" /></td></tr>');
			
		},success: function(response)
		
		{
			
			
			 $('#tfiltraNormasDestino tbody').html(response.tabla);
		},error: function(response)
		{
			$('#tfiltraNormasDestino tbody').html("");
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	   });
		
	});
/*cargar normas de empresas*/
	
	
	
	
	 /*buscar cuenta destino*/
	$(document).on('keyup','#txtCuentaDestino,#txtNombreDeCuentaDestino',function()
	{
		var empresa=$('#cmbEmpresaCuentaDest option:selected').val();
		var  numeroCuenta=$('#txtCuentaDestino').val();
		var nombreCuenta=$('#txtNombreDeCuentaDestino').val();
		
		cargarCuentasOrigenDestino(empresa,numeroCuenta,nombreCuenta,1)
		
	});
	/*buscar cuenta destino*/
	
	
	
	//funcion para cargar cuentas origen
	function cargarCuentasOrigenDestino(empresa,numeroCuenta,nombreCuenta,bandera)
	{
		
		data=
		{
			accion:'cargarCatalogoCuentasOrigenDest',
			empresa:empresa,
			numeroCuenta:numeroCuenta,
			nombreCuenta:nombreCuenta,
		}
		
		$.ajax(
		{
			url:'../Php_Scripts/s_accionesConfCue.php',
			type:'POST',
			dataType:'json',
			data:data,
			beforeSend: function(response)
			{
				 $('#tBusquedaCuentaDestino tbody,#tBusquedaCuentaOrigen tbody').html('<tr align="center" data-nr="si"><td colspan="2"><img src="Imagenes/loader3.gif" width="32" height="32" /></td></tr>');
			},success:function(response)
			{
			
				$('#tBusquedaCuentaDestino tbody,#tBusquedaCuentaOrigen tbody').html("");
			switch(bandera)
			{
				case 1:
			$('#tBusquedaCuentaDestino tbody').html(response.tabla);
			    break;
				
				case 2:
			$('#tBusquedaCuentaOrigen tbody').html(response.tabla);
			    break;
			}
				
			},error:function(response)
			{
				 $('#tBusquedaCuentaOrigen tbody,#tBusquedaCuentaDestino tbody').html("");
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		});
		
	}
	//funcion para cargar cuentas origen
	
	
	//cerrar ventana
	$(document).on('click','.closeWind',function()
	{
		$(document).find(".conTSearch").remove();
	});
	//cerrar ventana
	
	
	
	//agregar norma origen
    $(document).on('click','#tfiltraNormasDestino tbody tr',function()
	{
		
	  if($(this).data('nr')=="no"){
	    var normaCodeDestino=$(this).data('normacode');
		cell.data(normaCodeDestino+' '+'<img src="Imagenes/find.png" width="16" heigth="16" class="searchNormaDestino" style=" cursor:pointer;"/>');
		$(document).find(".conTSearch").remove();
		/*buscar norma code origen en norma code destino y ponerle en estado por default*/
			$('#tNormasOri tbody tr').each(function(index, element) {
                var normaCodeOrigen=$.trim($(this).find('td').eq(0).text());
				var inputText=$(this).find('td').eq(2).find('input');
				var checkBox=$(this).find('td').eq(3).find('input');
				if(normaCodeDestino==normaCodeOrigen)
				{
                                        $(".chkNormasOrigen").prop("checked",false);
                                        $(".porcentNormaOri").val("");
                                        $(".chkNormasOrigen").change();
					$(inputText).removeClass('disabled');
					$(inputText).attr('readonly',false);
					$(checkBox).prop('checked',true);
					$(inputText).val(100);
				}
            });
			/*buscar norma code origen en norma code destino y ponerle en estado por default*/
	  }
	  
	  
	});
	//agregar norma origen
	
	
	//agregar cuenta origen
	
	$(document).on('click','#tBusquedaCuentaDestino tbody tr',function()
	{
	  
	  if($(this).data('nr')=="no"){
      var normaDestino=$('#tCuentasDest tbody tr').find('td').eq(1).text();
	  /*obtener datos a agregar*/
	  var numCue=$(this).data('numcuenta');
	  var nomCue=$(this).data('nomcuenta');
	  var numCueMaestra=$(this).data('numcuemaestra');
	  var nomCueMaestra=$(this).data('nomcuemaestra');
	  /*obtener datos a agregar*/
	
	
	    
	oTableCuentasDet.row(tr).remove();
	oTableCuentasDet.row.add(
	[
	  numCue+' '+'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaDestino" style=" cursor:pointer;" />',
	  '<img src="Imagenes/find.png" width="16" heigth="16" class="searchNormaDestino" style=" cursor:pointer;"   />', 
	  nomCue,
	  numCueMaestra,
	  nomCueMaestra,
	  ''
	]
	).draw();
	oTableCuentasDet.columns.adjust();
	
	 /*buscar norma code origen en norma code destino y ponerle en estado por default*/
	
			$('#tNormasOri tbody tr').each(function(index, element) {
                var normaCodeDestino=$.trim($(this).find('td').eq(0).text());
				var inputText=$(this).find('td').eq(2).find('input');
				var checkBox=$(this).find('td').eq(3).find('input');
				if(normaDestino==normaCodeDestino)
				{
					$(inputText).addClass('disabled');
					$(inputText).attr('readonly',true);
					$(checkBox).prop('checked',false);
					$(inputText).val("");
				}
            });
			/*buscar norma code origen en norma code destino y ponerle en estado por default*/
	 
	
	$(document).find(".conTSearch").remove();
			}
	});
	//agregar cuenta origen
	
	
	/*limpiar datos de cuenta origen*/
	
	$(document).on('click','.cleanCueOri',function()
	{
		var idTabla=$(this).closest('table').attr('id');
		switch(idTabla)
		{		
				case 'tCuentasOri':
				
				 oTableCuentasOri.row($(this).closest('table tr')).remove(); 
			     oTableCuentasOri.row.add(
			    [
	  			'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaOrigen" style=" cursor:pointer;"  />',
	  			'',
	  			'',
			    '',
			    '',
				]
				).draw();
			    oTableCuentasOri.columns.adjust();
				break;
		}
		
	});
	/*limpiar datos de cuenta origen*/
	
	
	/*limpiar datos de empresa origen y cargar las nuevas normas */
	$(document).on('change','#cmbEmpresaCuentaOri',function()
	{
		$('#tCuentasOri').find('.conTSearch').remove();
		 var empresaOrigen=$('#cmbEmpresaCuentaOri option:selected').val();
		 var titleWindow=$('#vtnDialogoConfCue').dialog('option','title');
		
		if(titleWindow=="Agregar Configuración y Asignación De Cuentas")
		{
		   cargarNormasOrigen(empresaOrigen);
		   oTableCuentasOri.clear();
		   oTableCuentasOri.row.add(
			    [
	  			'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaOrigen" style=" cursor:pointer;"  />',
	  			'',
	  			'',
			    '',
			    '',
				]
				).draw();
			    oTableCuentasOri.columns.adjust();
		   
		}else
		{
			var cuentaO=$('#tCuentasOri tbody tr').find('td').eq(0).text();
			cargarNormasOrigenUPD(empresaOrigen,cuentaO);
		}
		
         
				
				
				
	});
	/*limpiar datos de empresa origen y cargar las nuevas normas */
	
	
	
	
	
	/*limpiar datos de empresa destino si cambiamos de empresa*/
	$(document).on('change','#cmbEmpresaCuentaDest',function()
	{
		$('#tCuentasDest').find('.conTSearch').remove();
		
		/*poner mismo valor seleccionado en combo empresa origen*/
		$('#cmbEmpresaCuentaOri').val($('#cmbEmpresaCuentaDest option:selected').val());
		$('#cmbEmpresaCuentaOri').change();
		/*poner mismo valor seleccionado en combo empresa origen*/
		
		
		//reetablecemos valores por default
		oTableCuentasDet.clear();  
	            oTableCuentasDet.row.add(
			    [
	  			'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaDestino" style=" cursor:pointer;"   />',
	  			'',
	  			'',
			    '',
			    '',
				'', 
				]
				).draw();
				oTableCuentasDet.columns.adjust();
	});
	
	/*desplegar cuentas origen*/
	$(document).on('click','.searchCuentaOrigen',function()
	{
		 $(document).find(".conTSearch").remove();
		 /*quitamos mensajes informativos*/
		$('#tCuentasOri tbody tr').removeAttr('style'); 
		/*quitamos mensajes informativos*/
          tr=$(this).closest('table tr');
          var posicion = $(this).position();
          divBusqueda = '<div style="left:'+(posicion.left+-20)+'px;top:'+(posicion.top+30)+'px; height:310px; display:block;" class="conTSearch">';
          divBusqueda += '<div class="flechitaApunta"></div>';
          divBusqueda += '<div style="overflow:auto;height:300px;width:99%">';
          divBusqueda += '<table  style="background-color:transparent;position:relative;" id="tBusquedaCuentaOrigen" align="center"  class="table"   >';
          divBusqueda += '<thead>';
          divBusqueda += '<tr>';
		  divBusqueda += '<th class="pintar-td-titulos-verde" >Código De Cuenta Origen</th>';
          divBusqueda += '<th class="pintar-td-titulos-verde" >Nombre De Cuenta Origen</th>';
          divBusqueda += '</tr>';
          divBusqueda += '<tr class="filaBusqueda">';
		  divBusqueda += '<td  ><input placeholder="Código de norma."  id="txtCuentaOrigen" maxlength="250" name="txtCuentaOrigen" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '<td  ><input placeholder="Nombre de norma."  id="txtNombreDeCuentaOrigen" maxlength="250" name="txtNombreDeCuentaOrigen" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '</tr>';
          divBusqueda += '</thead>';
          divBusqueda += '<tbody>';
          divBusqueda += '</tbody>';
          divBusqueda += '</table>';
          divBusqueda += '<img class="closeWind"   src="Imagenes/close.png" />';
          divBusqueda += '</div>';
          $('#tCuentasOri').append(divBusqueda);
          $('#txtCuentaOrigen,#txtNombreDeCuentaOrigen').keyup();
		  
	});
		/*desplegar cuentas origen*/
		
		
		
	/*buscar cuenta origen*/
	$(document).on('keyup','#txtCuentaOrigen,#txtNombreDeCuentaOrigen',function()
	{
		var empresa=$('#cmbEmpresaCuentaOri option:selected').val();
	
		var  numeroCuenta=$('#txtCuentaOrigen').val();
		var nombreCuenta=$('#txtNombreDeCuentaOrigen').val();
		cargarCuentasOrigenDestino(empresa,numeroCuenta,nombreCuenta,2);
		
	});
	/*buscar cuenta origen*/
	
	
	//agregar cuenta de norma origen
	$(document).on('click','#tBusquedaCuentaOrigen tbody tr',function()
	{
		var windowTitle=$('#vtnDialogoConfCue').dialog('option','title');
		
		if($(this).data('nr')=="no"){
	  /*obtener datos a agregar*/
	  var numCue=$(this).data('numcuenta');
	  var nomCue=$(this).data('nomcuenta');
	  var numCueMaestra=$(this).data('numcuemaestra');
	  var nomCueMaestra=$(this).data('nomcuemaestra');
	  /*obtener datos a agregar*/
	;
	/*Agregar Configuración y Asignación De Cuentas*/
	/*Modificar Configuración y Asignación De Cuentas*/
	
	    
	oTableCuentasOri.row(tr).remove();
	oTableCuentasOri.row.add(
	[
	  (windowTitle=='Modificar Configuración y Asignación De Cuentas')?numCue+' '+'<img src="Imagenes/find.png" width="16" heigth="16" class="searchCuentaOrigen" style=" cursor:pointer;"/>':numCue,
	  nomCue,
	  numCueMaestra,
	  nomCueMaestra,
	   (windowTitle!='Modificar Configuración y Asignación De Cuentas')?'<img src="Imagenes/cleaner.png" style="cursor:pointer" alt="limpiar datos de tabla"   width="16" heigth="16" class="cleanCueOri"  />':''
	]
	).draw();
	
	$(document).find(".conTSearch").remove();
	
		}
	});
	//agregar cuenta de norma origen
	
	
	/*seleccionar norma destino*/
	$(document).on('change','.chkNormasOrigen',function()
	{
		var inputText=$(this).closest('table tr').find('td').eq(2).find('input');
		var windowTitle=$('#vtnDialogoConfCue').dialog('option','title');
      
		
		if($(this).is(':checked'))
		{
			
			  $(inputText).removeClass('disabled');
			  $(inputText).attr('readonly',false);
			  $(inputText).focus();
			
		}else
		{
			$(inputText).val("");
			$(inputText).addClass('disabled');
			$(inputText).attr('readonly',true);
			/*quitar clase de alerta input si es que la tiene*/
			$(inputText).removeClass('formulario-inputs-alert');
			/*quitar clase de alerta input si es que la tiene*/
			if(windowTitle=='Modificar Configuración y Asignación De Cuentas')
			{
				
			}
			
		}
	});
	/*seleccionar norma destino*/
	
	
	
}
/****************************************************confYAsignacionDeCuentas.php********************************************************/






/**************************************************rolesYAutorizaciones.php*******************************************************/
if(baseName=='rolesYAutorizaciones.php')
{
	
    
	/*crear DataTable de catalogos de roles y otros*/
	var oTableCatalogosAR=DataTableEspanolByObj($('#tCatalogoAR'));
	var oTableAutorAR= DataTableEspanolByObj($('#tAutorAR'));
	var oTableEmpresasAr=DataTableEspanolByObj($('#tEmpresasAR'));
	var oTableEtapasAr=DataTableEspanolByObj($('#tEtapasAR'));
	/*crear DataTable de catalogos de roles*/
	
    $('#tabsAR').tabs();	//crear tabs
	
	/*crear dialogo*/
	$('#vtnDialogoAccionsAR').dialog(
	{
	type:'modal',
	autoOpen:false,
	show:cea(),
	hide:cea(),
    modal: true,
	width:1000,
	height:900,
	resizable:false,
		
	})
	/*crear dialogo*/
	
	/*funcion para cargar catalogo*/
	function cargarCatalogoAr(){
	$.ajax(
	{
		url:'../Php_Scripts/s_accionesAutorizacionesRoles.php',
		type:'POST',
		dataType:'json',
		data:'accion=cargarCatalogoAR',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
		},success: function(response)
		{
			
			$('#loader').bPopup().close();
			oTableCatalogosAR.clear();//limpiar tabla
            oTableCatalogosAR.rows.add(response.tabla);//agregar datos a la tabla
			oTableCatalogosAR.draw();
            oTableCatalogosAR.columns.adjust();//ajustar contenido a la tabla
			
			
		},error: function()
		{
			$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		
	});
	}
	/*funcion para cargar catalogo*/
	
	/*cargamos el catalogo de autorizaciones via ajax*/
	cargarCatalogoAr();
	/*cargamos el catalogo de autorizaciones via ajax*/
	
	

/*agregar nuevo rol y autorizaciones*/
$(document).on('click','#btnAgregarAR',function()
{
	   
		$('#vtnDialogoAccionsAR').dialog(
		{
			title:'Agregar roles y autorizaciones',
			autoOpen:true,
			open:function(event,ui)
			{
				 $('#contCodigo').hide();
				   $('#tabsAR').tabs({ active: 0 });
				 
				 /*limpiar valores inputs y mensajes de alerta*/
				  
				 $('#tFrmAR input[type="text"]').val("");
				 $('#tFrmAR input[type="checkbox"]').prop('checked',true);
				 $('#tFrmAR textarea').val("");
				 $('#tAutorAR').find(".conTSearch").remove();
		         $('#tEtapasAR').find(".conTSearch").remove(); 
				 $('#tFrmAR input').removeClass("formulario-inputs-alert");
				 $('#tFrmAR textarea').removeClass("formulario-inputs-alert");
				 $('#contAccionChkAr input[type="checkbox"]').prop('checked',false);
				 
				 
				 /*limpiar valores inputs y mensajes de alerta*/
				 
	  //cargar empresas en dataTable//
	  $.post('../Php_Scripts/s_accionesAutorizacionesRoles.php','accion=cargarEmpresasAR',function(response)
	  {
		    oTableEmpresasAr.clear();//limpiar tabla
            oTableEmpresasAr.rows.add(response.tabla);//agregar datos a la tabla
		    oTableEmpresasAr.draw();
			oTableEmpresasAr.columns.adjust();//ajustar contenido a la tabla
	  },'json')
	  //cargar empresas en dataTable//
	  
	  /*agregar primera fila por default*/
	oTableAutorAR.clear();  
	oTableAutorAR.row.add(
	[
	  '<img src="Imagenes/find.png" width="16" heigth="16" class="searchUserDataARAu" style=" cursor:pointer;" title="Buscar usuario para agregar."  />',
	  '',
	  '',
	  '',
	  '', 
	]
	).draw();
	oTableAutorAR.columns.adjust();
	/*agregar primera fila por default*/
	
	/*agregar primera fila por default*/
	oTableEtapasAr.clear();
	oTableEtapasAr.row.add(
	[
	  '<img src="Imagenes/find.png" width="16" heigth="16" class="searchUserDataAREt" style=" cursor:pointer;" title="Buscar usuario para agregar."  />',
	  '',
	  '',
	  '',
	  '',
	  '',
	  '',
	]
	).draw();
	oTableEtapasAr .columns.adjust();
	/*agregar primera fila por default*/
				
			},
			buttons:
			{
				'Agregar':function(event, ui)
				{
					var nombre=$('#txtNombreDeAR').val();
		var descripcion=$('#txtDescripcionAR').val();
		var activo=($('#chkActivoAR').is(':checked'))?'Y':'N';
		var generacion=($('#chkGeneracionAr').is(':checked'))?'Y':'N';
		var limite=($('#chkLimiteAr').is(':checked'))?'Y':'N';
		var facultades=($('#chkFacultadesAr').is(':checked'))?'Y':'N';
		var arrayUsuariosAR=new Array();
		var arrayEmpresasAR=new Array();
		var arrayEtapasAr=new Array();
		
		if($.trim(nombre)!="" && $.trim(descripcion)){
		/*validar que meta por lo menos un usuario*/
		if(parseInt($('#tAutorAR tbody tr').length)==1)
		{
			   alertt('Agregue por lo menos un usuario.');
		       $('#tAutorAR tbody tr').css({'background-color':'#f8cc41'});
			   $('#tabsAR').tabs({ active: 0 });
				
				return false;
		}else if(parseInt($('#tEtapasAR tbody tr').length)==1)
		{
			   alertt('Agregue por lo menos un usuario.');
		       $('#tEtapasAR tbody tr').css({'background-color':'#f8cc41'});
			   $('#tabsAR').tabs({ active: 2 });
				
				return false;
		}
		}
		/*validar que meta por lo menos un usuario*/
		
		
		/*agregar lista de usuario a Array*/
		$('#tAutorAR tbody tr').each(function(index, element) {
			var idUsuario=$(this).find('td').eq(0).text();
			if(!(isNaN(parseInt(idUsuario)))){
               
			   arrayUsuariosAR.push(idUsuario);
			  
			}
        });
		/*agregar lista de usuario a Array*/
		
		/*agregar empresas seleccionadas*/
		$('.chkEmpresasAR').each(function(index, element) {
            if($(this).is(':checked'))
			{
				arrayEmpresasAR.push($(this).val());
				
			}
        });
		/*agregar empresas seleccionadas*/
		
		/*agregar etapas*/
		$('#tEtapasAR tbody tr').each(function(index, element) {
			var idUsuario=$(this).find('td').eq(0).text();
			var nivel=$(this).find('td').eq(4).find('input').val();
			var obligatorio=($(this).find('td').eq(5).find('input').is(':checked'))?'Y':'N';
			if(!(isNaN(parseInt(idUsuario)))){
               
			   arrayEtapasAr.push({idUsuario:idUsuario,nivel:nivel,obligatorio:obligatorio});
		
			  
			}
        });
		/*agregar etapas*/
		
		
		data=
		{
			accion:'agregarRolesYAutorizaciones',
			nombre:nombre,
			descripcion:descripcion,
			usuarios:arrayUsuariosAR,
			activo:activo,
			generacion:generacion,
			limite:limite,
			facultades:facultades,
			empresas:arrayEmpresasAR,
			etapas:arrayEtapasAr
			
		}
		
	
		
		$.ajax(
		{
			type:'post',
			url:'../Php_Scripts/s_accionesAutorizacionesRoles.php',
			data:data,
			dataType:'json',
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
			},success: function(response)
			{
				
				$('#loader').bPopup().close();
				
				if(response.respuesta=="si")
				{
				    alertt(response.mensaje);
			             setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
						    $('#vtnDialogoAccionsAR').dialog("close");
			                 cargarCatalogoAr();
						   },2500);
					
					
				}else
				{
					
					
					if(response.fo=="nombre")
					{
						$('#tFrmAR #txtNombreDeAR').addClass('formulario-inputs-alert');
						$('#tFrmAR #txtNombreDeAR').focus();
						$(document).on('input keyup','#tFrmAR #txtNombreDeAR',function()
						{
							$('#tFrmAR #txtNombreDeAR').removeClass('formulario-inputs-alert');
							
						});
					}else if(response.fo=="descripcion")
					{
						$('#tFrmAR #txtDescripcionAR').addClass('formulario-inputs-alert');
						$('#tFrmAR #txtDescripcionAR').focus();
						$(document).on('input keyup','#tFrmAR #txtDescripcionAR',function()
						{
							$('#tFrmAR #txtDescripcionAR').removeClass('formulario-inputs-alert');
						
						});
					}else if(response.fo=="nivel")
					{
						$('#tEtapasAR tbody tr').each(function(index, element) {
						var id=$(this).find('td').eq(4).find('input').attr('id');
							
							if(!($.isNumeric($(this).find('td').find('input').val())) || $(this).find('td').find('input').val()==0)
							{
								
								$('#'+id).addClass('formulario-inputs-alert');
								$('#tabsAR').tabs({ active: 2 });
								$('#'+id).focus();
							}
							if($.trim($(this).find('td').find('input').val())=="")
							{
								
								$('#'+id).addClass('formulario-inputs-alert');
								$('#tabsAR').tabs({ active: 2 });
								$('#'+id).focus();
								
							}
							 
						  $(document).on('input keyup','#tEtapasAR tbody input',function()
						  {
							  
							  $('#tEtapasAR tbody input').removeClass('formulario-inputs-alert');
							  
						  });
						});
					}
				
					alertt(response.mensaje);
			        
					
				}
				
				
			},error: function(response)
			{
				 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			
		})
					
					
				},
				
				'Cerrar':function(event,ui)
				{
					$(this).dialog("close");
				},
				
				
			}
		});
	
});
/*agregar nuevo rol y autorizaciones*/	


/*agregar o modificar empresa de rol y autorizacion*/
$(document).on('click','.chkEmpresasAR',function()
{
	
	if($(this).data('id')!=undefined)
	{
		
		if($(this).data('id')!="-1" && !($(this).is(':checked')))
		{
			
			
			/*se manda a actualizar la seleccion en la base de datos*/
			var idEmpresaAR=$(this).data('id');
			var idAr=$('#tFrmAR #txtCodigoAr').val();
			
			
			
			data=
			{
				accion:'actualizarEmpresaAR',
				idRegistro:idAr,
				idRegistro2:idEmpresaAR,
			}
			/*mandamos la peticion para actualizar empresaAr*/
			$.ajax(
			{
			type:'post',
			url:'../Php_Scripts/s_accionesAutorizacionesRoles.php',
			data:data,
			dataType:'json',
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
			},success: function(response)
			{
				 $('#loader').bPopup().close();
				   oTableEmpresasAr.clear();//limpiar tabla
                   oTableEmpresasAr.rows.add(response.tabla);//agregar datos a la tabla
		           oTableEmpresasAr.draw();
				    oTableEmpresasAr.columns.adjust();//ajustar contenido a la tabla
				 
				
			},error: function(response)
			{
				
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
				
			})
			/*mandamos la peticion para actualizar empresaAr*/
			
			
			
			/*se manda a actualizar la seleccion en la base de datos*/
		}else
		{
			
			/*se manda a agregar a la base de datos*/
				var idEmpresaAR=$(this).data('id');
			    var idAr=$('#tFrmAR #txtCodigoAr').val();
			    var empresa=$(this).val();
				
				data=
			{
				accion:'agregarEmpresaAr',
				idRegistro:idAr,
				idRegistro2:idEmpresaAR,
				empresas:empresa
			}
				
				
					$.ajax(
			{
			type:'post',
			url:'../Php_Scripts/s_accionesAutorizacionesRoles.php',
			data:data,
			dataType:'json',
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
			},success: function(response)
			{
			
				 $('#loader').bPopup().close();
				   oTableEmpresasAr.clear();//limpiar tabla
                   oTableEmpresasAr.rows.add(response.tabla);//agregar datos a la tabla
		           oTableEmpresasAr.draw();
				   oTableEmpresasAr.columns.adjust();//ajustar contenido a la tabla
				 
				
			},error: function(response)
			{
				$('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
				
			})
				
			/*se manda a agregar a la base de datos*/
		}
		
		
	}
	
});



/*modificar rol y autorizacion*/

$(document).on('click','.modificAR',function()
{
	 var idRegistro=$(this).closest('table tr').find('td').eq(0).text();//id de rol y autorizaciones
	 
	 var nombreAR=$(this).closest('table tr').find('td').eq(1).text();
	 var descripcionAR=$(this).data('descripcion');
	 var activo=$(this).data("activo");
	 var generacion=$(this).data("generacion");
	 var limite=$(this).data("limite");
	 var facultades=$(this).data("facultades");
	 
	 
	
		$('#vtnDialogoAccionsAR').dialog(
		{
			title:'Modificar roles y autorizaciones',
			autoOpen:true,
			open:function(event,ui)
			{
				 $('#contCodigo').show();
				   $('#tabsAR').tabs({ active: 0 });
				 
				 /*limpiar valores inputs y mensajes de alerta*/
				(activo=='Y')?$('#tFrmAR input[type="checkbox"]').prop('checked',true):$('#tFrmAR input[type="checkbox"]').prop('checked',false);
				(generacion=='Y')?$('#contAccionChkAr #chkGeneracionAr').prop('checked',true):$('#contAccionChkAr #chkGeneracionAr').prop('checked',false);
				(limite=='Y')?$('#contAccionChkAr #chkLimiteAr').prop('checked',true):$('#contAccionChkAr #chkLimiteAr').prop('checked',false);
				(facultades=='Y')?$('#contAccionChkAr #chkFacultadesAr').prop('checked',true):$('#contAccionChkAr #chkFacultadesAr').prop('checked',false);
				 $('#tAutorAR').find(".conTSearch").remove();
		         $('#tEtapasAR').find(".conTSearch").remove();
				 $('#tFrmAR  #txtCodigoAr').val(idRegistro);//poner codigo
	             $('#tFrmAR  #txtNombreDeAR').val(nombreAR);//poner nombre de autorizacion
	             $('#tFrmAR textarea').val(descripcionAR); //poner descripcion en input
				 $('#tFrmAR input').removeClass("formulario-inputs-alert");
				 $('#tFrmAR textarea').removeClass("formulario-inputs-alert");
				 /*limpiar valores inputs y mensajes de alerta*/
				 
				 data=
				 {
					 accion:'cargarEmpresasARupd',
					 idRegistro:idRegistro
				 }
				 
	  //cargar empresas en dataTable//
	  $.post('../Php_Scripts/s_accionesAutorizacionesRoles.php',data,function(response)
	  {
		 
		    oTableEmpresasAr.clear();//limpiar tabla
            oTableEmpresasAr.rows.add(response.tabla);//agregar datos a la tabla
		    oTableEmpresasAr.draw();
			oTableEmpresasAr.columns.adjust();//ajustar contenido a la tabla
	  },'json')
	  //cargar empresas en dataTable//
	  
	  /*agregar usuarios autores de roles y autorizaciones*/
	
	data=
				 {
					 accion:'cargarUsuariosAutorARupd',
					 idRegistro:idRegistro
				 }
	
	 $.post('../Php_Scripts/s_accionesAutorizacionesRoles.php',data,function(response)
	  {
		 
		    oTableAutorAR.clear();//limpiar tabla
            oTableAutorAR.rows.add(response.tabla);//agregar datos a la tabla
		    oTableAutorAR.draw();
			oTableAutorAR.columns.adjust();//ajustar contenido a la tabla
	  },'json');
	
	/*agregar usuarios autores de roles y autorizaciones*/
	
	/*agregar usuarios de estapas*/
	
	data=
				 {
					 accion:'cargarUsuariosEtapas',
					 idRegistro:idRegistro
				 }
	
	 $.post('../Php_Scripts/s_accionesAutorizacionesRoles.php',data,function(response)
	  {
		
		    oTableEtapasAr.clear();//limpiar tabla
            oTableEtapasAr.rows.add(response.tabla);//agregar datos a la tabla
		    oTableEtapasAr.draw();
			oTableEtapasAr.columns.adjust();//ajustar contenido a la tabla
	  },'json');
	

		/*agregar usuarios de estapas*/
				
			},
			buttons:
			{
				'Modificar':function(event, ui)
				{
				
		var nombre=$('#txtNombreDeAR').val();
		var descripcion=$('#txtDescripcionAR').val();
		var activo=($('#chkActivoAR').is(':checked'))?'Y':'N';
		var generacion=($('#chkGeneracionAr').is(':checked'))?'Y':'N';
		var limite=($('#chkLimiteAr').is(':checked'))?'Y':'N';
		var facultades=($('#chkFacultadesAr').is(':checked'))?'Y':'N';
		var arrayUsuariosAR=new Array();
		var arrayEtapasAR=new Array();
		var arrayNuevasEtapasAR=new Array();
		
		/*if($.trim(nombre)!="" && $.trim(descripcion)){
		/*validar que meta por lo menos un usuario*/
		/*if(parseInt($('#tAutorAR tbody tr').length)==1)
		{
			   alertt('Agregue por lo menos un usuario.');
		       $('#tAutorAR tbody tr').css({'background-color':'#f8cc41'});
			   $('#tabsAR').tabs({ active: 0 });
				
				return false;
		}else if(parseInt($('#tEtapasAR tbody tr').length)==1)
		{
			   alertt('Agregue por lo menos un usuario.');
		       $('#tEtapasAR tbody tr').css({'background-color':'#f8cc41'});
			   $('#tabsAR').tabs({ active: 2 });
				
				return false;
		}
		}*/
		/*validar que meta por lo menos un usuario*/
		
		
		/*agregar lista de usuario a Array*/
		$('#tAutorAR tbody tr').each(function(index, element) {
			var idUsuario=$(this).find('td').eq(0).text();
			var isAddForUser=$(this).find('td').eq(4).find('img').data('id');
			
			if(!(isNaN(parseInt(idUsuario)))&& isAddForUser==undefined){
               
			   arrayUsuariosAR.push(idUsuario);
			  
			}
        });
		/*agregar lista de usuario a Array*/
		
		
		
		/*agregar etapas para su modificacion*/
		$('#tEtapasAR tbody tr').each(function(index, element) {
			var idUsuario=$(this).find('td').eq(0).text();
			var nivel=$(this).find('td').eq(4).find('input').val();
			var obligatorio=($(this).find('td').eq(5).find('input').is(':checked'))?'Y':'N';
			var idEtapa=($(this).find('td').eq(6).find('img').data('id'));
			
			
			if(!(isNaN(parseInt(idUsuario))) && idEtapa!=undefined){
               
			  
			   /*Etapas para modificar  en roles y autorizaciones*/
			   arrayEtapasAR.push({idUsuario:idUsuario,nivel:nivel,obligatorio:obligatorio,idEtapa:idEtapa});
			   /*Etapas para modificar  en roles y autorizaciones*/
		
			  
			} 
			if(!(isNaN(parseInt(idUsuario))) && idEtapa==undefined)
			{
				/*Etapas nuevas para agregar en roles y autorizaciones*/
				 arrayNuevasEtapasAR.push({idUsuario:idUsuario,nivel:nivel,obligatorio:obligatorio});
				/*Etapas nuevas para agregar en roles y autorizaciones*/
			}
        });
		
	
		/*modificar etapas para su modificacion*/
		
		/*agregar */
		
		
		data=
		{
			accion:'modificarRolesYAutorizaciones',
			idRegistro:idRegistro,
			nombre:nombre,
			descripcion:descripcion,
			usuarios:arrayUsuariosAR,
			activo:activo,
			generacion:generacion,
			limite:limite,
			facultades:facultades,
			etapas:arrayEtapasAR,
			nuevasEtapas:arrayNuevasEtapasAR
			
		}
		
	
		
		$.ajax(
		{
			type:'post',
			url:'../Php_Scripts/s_accionesAutorizacionesRoles.php',
			data:data,
			dataType:'json',
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			     onClose: function() {
				  response.abort();   
				       
					    }
            });
			},success: function(response)
			{
				
				$('#loader').bPopup().close();
				
				if(response.respuesta=="si")
				{
				    alertt(response.mensaje);
			             setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
						    $('#vtnDialogoAccionsAR').dialog("close");
			                 cargarCatalogoAr();
						   },2500);
					
					
				}else
				{
					
					
					if(response.fo=="nombre")
					{
						$('#tFrmAR #txtNombreDeAR').addClass('formulario-inputs-alert');
						$('#tFrmAR #txtNombreDeAR').focus();
						$(document).on('input keyup','#tFrmAR #txtNombreDeAR',function()
						{
							$('#tFrmAR #txtNombreDeAR').removeClass('formulario-inputs-alert');
							
						});
					}else if(response.fo=="descripcion")
					{
						$('#tFrmAR #txtDescripcionAR').addClass('formulario-inputs-alert');
						$('#tFrmAR #txtDescripcionAR').focus();
						$(document).on('input keyup','#tFrmAR #txtDescripcionAR',function()
						{
							$('#tFrmAR #txtDescripcionAR').removeClass('formulario-inputs-alert');
						
						});
					}else if(response.fo=="nivel")
					{
						$('#tEtapasAR tbody tr').each(function(index, element) {
							var id=$(this).find('td').eq(4).find('input').attr('id');
							
							
							if(!($.isNumeric($(this).find('td').find('input').val())) || $(this).find('td').find('input').val()==0)
							{
								
								$('#'+id).addClass('formulario-inputs-alert');
								$('#tabsAR').tabs({ active: 2 });
								$('#'+id).focus();
							}
							if($.trim($(this).find('td').find('input').val())=="")
							{
								
								$('#'+id).addClass('formulario-inputs-alert');
								$('#tabsAR').tabs({ active: 2 });
								$('#'+id).focus();
								
							}
							 
						  $(document).on('input keyup','#tEtapasAR tbody input',function()
						  {
							  
							  $('#tEtapasAR tbody input').removeClass('formulario-inputs-alert');
							  
						  });
						});
					}
				
					alertt(response.mensaje);
			        
					
				}
				
				
			},error: function(response)
			{
				 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			
		})
					
					
				},
				
				'Cerrar':function(event,ui)
				{
					$(this).dialog("close");
				},
				
				
			}
		});
	
});

/*modificar rol y autorizacion*/



/*eliminar roles y autorizaciones*/
$(document).on('click','.deleteAR',function()
{
	var IdRegistroAR=$(this).closest('table tr').find('td').eq(0).text();
	var trEliminar=$(this).closest('table tr');
	if(confirm("Desea eliminar los roles y autorizaciones " +$(this).closest('table tr').find('td').eq(1).text()+"?")){
	data=
	{
		accion:'eliminarDatoCatalogoAR',
		idRegistro:IdRegistroAR,
	}
	
	$.post('../Php_Scripts/s_accionesAutorizacionesRoles.php',data,function(response)
	{
		$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
	    $('.mensajeSatisfactorio').fadeOut(15000);
		oTableCatalogosAR.row(trEliminar).remove().draw();
		
	},'json');
	
	}

	
});
/*eliminar roles y autorizaciones*/	

	
	
	/*quitar fila de datos*/
	$(document).on('click','.deleteUserDataARAu',function()
	{
		var idRegistro=$(this).data('id');
		tr=$(this).closest('table tr');
		$('#tAutorAR').find(".conTSearch").remove();
	    $('#tEtapasAR').find(".conTSearch").remove(); 
		if(idRegistro!=undefined)
		{
			if(confirm ("Esta seguro de eliminar al usuario "+$(this).closest('table tr').find('td').eq(2).text().toLowerCase()+ " del catalogo de autores?")){
			data=
			{
				accion:'eliminarUsuarioAutor',
				idRegistro:idRegistro
			}
			
			/*eliminamos de la base de datos*/
			$.post('../Php_Scripts/s_accionesAutorizacionesRoles.php',data,function(response)
	{
		oTableAutorAR
        .row(tr)
        .remove()
        .draw();	
		
	},'json');
			/*eliminamos de la base de datos*/
			}
		}
		else{
		oTableAutorAR
        .row(tr)
        .remove()
        .draw();	
		}
		
	});
	/*quitar fila de datos*/
	
	/*quitar fila de datos*/
	$(document).on('click','.deleteUserDataAREt',function()
	{
		var idRegistro=$(this).data('id');
		tr=$(this).closest('table tr');
		$('#tAutorAR').find(".conTSearch").remove();
	    $('#tEtapasAR').find(".conTSearch").remove(); 
		
		if(idRegistro!=undefined)
		{
			if(confirm ("Esta seguro de eliminar al usuario "+$(this).closest('table tr').find('td').eq(2).text().toLowerCase()+ " del catalogo de etapas?")){
			data=
			{
				accion:'eliminarEtapa',
				idRegistro:idRegistro
			}
			
			/*eliminamos de la base de datos*/
			$.post('../Php_Scripts/s_accionesAutorizacionesRoles.php',data,function(response)
	{
		oTableEtapasAr
        .row(tr)
        .remove()
        .draw();	
		
	},'json');
			/*eliminamos de la base de datos*/
			}
		}
		else{
	     oTableEtapasAr
        .row(tr)
        .remove()
        .draw();
		}
		
		
			
		
	});
	/*quitar fila de datos*/
	
	
	 $(document).on('click','.searchUserDataARAu',function()
	{
		/*quitar clases de alerta*/
		$('#tAutorAR tbody tr').removeAttr('style');
		$('#tEtapasAR tbody tr').removeAttr('style');
		$('.me').text("");
		$('#tFrmAR input').removeClass('formulario-inputs-alert');
		 $('#tEtapasAR tbody input').removeClass('formulario-inputs-alert');
		/*quitar clases de alerta*/
		   $('#tAutorAR').find(".conTSearch").remove();
		   $('#tEtapasAR').find(".conTSearch").remove();
		  tr=$(this).closest('table tr');
          var posicion = $(this).position();
          divBusqueda = '<div style="left:'+(posicion.left+-20)+'px;top:'+(posicion.top+30)+'px; height:310px; display:block;" class="conTSearch">';
          divBusqueda += '<div class="flechitaApunta"></div>';
          divBusqueda += '<div style="overflow:auto;height:300px;width:99%">';
          divBusqueda += '<table  style="background-color:transparent;position:relative;" id="tfiltraUsuariosAR" align="center"  class="table"   >';
          divBusqueda += '<thead>';
          divBusqueda += '<tr>';
		   divBusqueda += '<th class="pintar-td-titulos-verde" >Usuario</th>';
          divBusqueda += '<th class="pintar-td-titulos-verde" >Nombre Completo De Usuario</th>';
          divBusqueda += '</tr>';
          divBusqueda += '<tr class="filaBusqueda">';
		    divBusqueda += '<td><input placeholder="Nombre de usuario."  id="txtUserNameAR" maxlength="250" name="txtUserNameAR" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '<td  ><input placeholder="Nombre completo de usuario."  id="txtNombreDeUsuarioAR" maxlength="250" name="txtNombreDeUsuarioAR" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
		     
          divBusqueda += '</tr>';
          divBusqueda += '</thead>';
          divBusqueda += '<tbody>';
          divBusqueda += '</tbody>';
          divBusqueda += '</table>';
          divBusqueda += '<img class="closeWind" title="Cerrar Búsqueda."  src="Imagenes/close.png" />';
          divBusqueda += '</div>';
          $('#tAutorAR').append(divBusqueda);
          $('#txtNombreDeUsuarioAR,#txtUserNameAR').keyup();
	});
	
	
	
    $(document).on('click','.searchUserDataAREt',function()
	{
		/*quitar clases de alerta*/
		$('#tAutorAR tbody tr').removeAttr('style');
		$('#tEtapasAR tbody tr').removeAttr('style');
		$('.me').text("");
		$('#tFrmAR input').removeClass('formulario-inputs-alert');
		$('#tEtapasAR tbody input').removeClass('formulario-inputs-alert');
		/*quitar clases de alerta*/
		  $('#tAutorAR').find(".conTSearch").remove();
		  $('#tEtapasAR').find(".conTSearch").remove();
		  tr=$(this).closest('table tr');
          var posicion = $(this).position();
          divBusqueda = '<div style="left:'+(posicion.left+-20)+'px;top:'+(posicion.top+30)+'px; height:310px; display:block;" class="conTSearch">';
          divBusqueda += '<div class="flechitaApunta"></div>';
          divBusqueda += '<div style="overflow:auto;height:300px;width:99%">';
          divBusqueda += '<table  style="background-color:transparent;position:relative;" id="tfiltraUsuariosAR" align="center"  class="table"   >';
          divBusqueda += '<thead>';
          divBusqueda += '<tr>';
         divBusqueda += '<th class="pintar-td-titulos-verde" >Usuario</th>';
          divBusqueda += '<th class="pintar-td-titulos-verde" >Nombre Completo De Usuario</th>';
          divBusqueda += '</tr>';
          divBusqueda += '<tr class="filaBusqueda">';
          divBusqueda += '<td><input placeholder="Nombre de usuario."  id="txtUserNameAR" maxlength="250" name="txtUserNameAR" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '<td  ><input placeholder="Nombre completo de usuario."  id="txtNombreDeUsuarioAR" maxlength="250" name="txtNombreDeUsuarioAR" style="width:100%;border:none;background: transparent;text-align: center; font-size:14px; 	font-weight:bold;" type="text"/></td>';
          divBusqueda += '</tr>';
          divBusqueda += '</thead>';
          divBusqueda += '<tbody>';
          divBusqueda += '</tbody>';
          divBusqueda += '</table>';
          divBusqueda += '<img class="closeWind" title="Cerrar Búsqueda."  src="Imagenes/close.png" />';
          divBusqueda += '</div>';
          $('#tEtapasAR').append(divBusqueda);
          $('#txtNombreDeUsuarioAR,#txtUserNameAR').keyup();
	});

 
   /*cerrar ventana de busqueda*/
   $(document).on('click','.closeWind',function()
   {
	    $('#tAutorAR').find(".conTSearch").remove();
		$('#tEtapasAR').find(".conTSearch").remove();
   });
   /*cerrar ventana de busqueda*/
   
   
   /*buscar usuario*/
   $(document).on('keyup','#txtNombreDeUsuarioAR,#txtUserNameAR',function()
   {
	   var nombreCompletoDeUsuario=$('#txtNombreDeUsuarioAR').val();
	   var userName=$('#txtUserNameAR').val();
	  
	   data=
	   {
		   accion:'filtrarDatosEnTabla',
		   datoABuscar:nombreCompletoDeUsuario,
		   userName:userName
	   }
	   
	  
	   $.ajax({
	    type:'POST',
		dataType:'json',
		data:data,
		url:'../Php_Scripts/s_accionesAutorizacionesRoles.php',
		beforeSend: function(response)
		{
			$('#tfiltraUsuariosAR tbody').html('<tr align="center"><td colspan="2"><img src="Imagenes/loader3.gif" width="32" height="32" /></td></tr>');
			
		},success: function(response)
		{ 
		 
		$('#tfiltraUsuariosAR tbody').html(response.tabla);
		},error: function(response)
		{
			$('#tfiltraUsuariosAR tbody').html("");
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	   });
	   
	  
	   
   });
   /*buscar usuario*/
   
   
   /*agregar nueva fila a tabla*/
 var n=0;
$(document).on('click','#tfiltraUsuariosAR tbody tr',function()
{   
     n++;
	 encontrado=false;
	 active=$('#tabsAR').tabs('option','active');
 
	switch(active)
	{
	 case 0:	
	if($(this).data('nr')=="no"){
	var nombreUsuario=$(this).data("nombredeusuario");
	var nombreCompleto=$(this).data("nombrecompleto");
	var tipoDePerfil=$(this).data("tipodeusuario");
	var idUsuario=$(this).data("idusuario");
	
	/*buscamos datos a agregar en la tabla para que no se agregen datos repetidos*/
	$('#tAutorAR tbody tr').each(function(index, element) {
        if($(this).find('td').eq(0).text()==idUsuario)
		{
			alertt("El usuario "+nombreCompleto.toLowerCase()+" ya se encuentra agregado en el catálogo.");
			encontrado=true;
			return false;
		}
    });
	/*buscamos datos a agregar en la tabla para que no se agregen datos repetidos*/
	
	if(!(encontrado)){
		
	/*cerramos la ventana*/
    $('#tAutorAR').find(".conTSearch").remove();
	/*cerramos la ventana*/
	/*se agregan los nuevos datos al dataTable*/
	    
	    oTableAutorAR
        .row(tr)
        .remove();
		oTableAutorAR.row.add(
	[
	  idUsuario,
	  nombreUsuario,
	  nombreCompleto,
	   tipoDePerfil,
	  '<img src="Imagenes/delete.png" width="16" heigth="16" class="deleteUserDataARAu" style=" cursor:pointer;" title="Quitar usuario de la lista."  />', 
	]
	).draw();
	oTableAutorAR.row.add(
	[
	  '<img src="Imagenes/find.png" width="16" heigth="16" class="searchUserDataARAu" style=" cursor:pointer;" title="Buscar usuario para agregar."  />',
	  '',
	  '',
	  '',
	  '', 
	]
	).draw();
	oTableAutorAR.columns.adjust();
	
	/*se agregan los nuevos datos al dataTable*/
	}
	}
	break;
	
	case 2:
	
	if($(this).data('nr')=="no"){
	var nombreUsuario=$(this).data("nombredeusuario");
	var nombreCompleto=$(this).data("nombrecompleto");
	var tipoDePerfil=$(this).data("tipodeusuario");
	var idUsuario=$(this).data("idusuario");
	
	
	/*buscamos datos a agregar en la tabla para que no se agregen datos repetidos*/
	$('#tEtapasAR tbody tr').each(function(index, element) {
        if($(this).find('td').eq(0).text()==idUsuario)
		{
			alertt("El usuario "+nombreCompleto.toLowerCase()+" ya se encuentra agregado en el catálogo.");
			encontrado=true;
			return false;
		}
    });
	/*buscamos datos a agregar en la tabla para que no se agregen datos repetidos*/
	
	if(!(encontrado)){
	/*cerramos la ventana*/
    $('#tEtapasAR').find(".conTSearch").remove();
	/*cerramos la ventana*/
	/*se agregan los nuevos datos al dataTable*/
	    
	    oTableEtapasAr
        .row(tr)
        .remove();
		oTableEtapasAr.row.add(
	[
	  idUsuario,
	  nombreUsuario,
	  nombreCompleto,
	   tipoDePerfil,
	  '<input type="text" name="txtNivel'+n+'" id="txtNivel'+n+'" class="formulario-inputs" style="width:50px; text-align:center;"  />',
	  '<input type="checkbox" name="chkObli'+n+'" id="chkObli'+n+'" checked="checked"  />',
	  '<img src="Imagenes/delete.png" width="16" heigth="16" class="deleteUserDataAREt" style=" cursor:pointer;" title="Quitar usuario de la lista."   />', 
	]
	).draw();
	 oTableEtapasAr.row.add(
	[
	  '<img src="Imagenes/find.png" width="16" heigth="16" class="searchUserDataAREt" style=" cursor:pointer;" title="Buscar usuario para agregar."  />',
	  '',
	  '',
	  '',
	  '', 
	  '',
	  '',
	]
	).draw();
	 oTableEtapasAr.columns.adjust();
	 $('#txtNivel'+n).focus();
	
	/*se agregan los nuevos datos al dataTable*/
	}
	}
	break;
	
	}
});


	





}


/**************************************************rolesYAutorizaciones.php*******************************************************/







/****************************************varios.php****************************************************/

if(baseName=='varios.php')
{
	
	
	/*abrir ventana para descargar excel*/
	
	$(document).on('click','.dwExcelPlantillaEx',function()
	{
		var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
		var empresa="";
		$('#idPlantillaExcelDw').text(idRegistro);
		$('#vtnSelectClaseParaExcelDw').dialog(
		{
			autoOpen:true,
			title:"Descargar Plantilla De Excel",
			width:780,
	        height:480,
			open:function(event,ui)
			{
				
				
				data=
				{
				    accion:	'cargarEmpresasDePlantillaDw',
					idRegistro:idRegistro
				}
				
				
				
				$.post('../Php_Scripts/s_accionesVarios.php',data,function(response)
				{   
				   
					$('#contEmpresasSelecExPlanDw').html(response.tabla);
					$('#contEmpresasSelecExPlanDw').find('input').first().attr('checked',true);
	                $('#contEmpresasSelecExPlanDw').find('input').first().click();
				
					
				},'json')
			
				
				
				
			}
		})
		
		
		
	  
		
	});
	/*abrir ventana para descargar excel*/
	
	/*descargar excel*/
	$(document).on('click','.dwExcelEscenario',function()
	{
		escenarioEx=$(this).closest('table tr').find('td').eq(0).text();
        plantillaExcel=$('#idPlantillaExcelDw').text();
		window.open('Php_Scripts/plantillaExcelPPTO.php?escenario='+escenarioEx+'&plantilla='+plantillaExcel, '_blank');
	});
	/*descargar excel*/

	
	/*Crear DataTable*/
	var oTableDwExcel=DataTableEmpresas($('#tCatalogoEscenariosDwExcel'));
	/*Crear DataTable*/
	
	/*funcion para mostrar childs rows*/
	$('#tCatalogoEscenariosDwExcel tbody').on( 'click', 'td.details-control', function () {
	              
	            var tr = $(this).closest('tr');
                var child = oTableDwExcel.row(tr).child;
				
				
                if ( child.isShown() ) {
                    child.hide();
                    $(tr).removeClass('shown');
                }
                else {
                    child.show();
                    $(tr).addClass('shown');
                }
            } );
	/*funcion para mostrar childs rows*/
	
	/*cargar catalogo de escenarios para descarga de excel*/
	
	$(document).on('click','.rdbEmpresasSelectDwEx',function()
	{
		if($(this).is(':checked'))
		{
			empresa=$(this).val();
			
		    idPlantilla=$('#idPlantillaExcelDw').text();
			data=
				{
				    accion:	'detalladoParaDescargaDeExcel',
					cmbEmpresasSeleccionadas:empresa,
					idRegistro:idPlantilla
				}
				$.post('../Php_Scripts/s_accionesVarios.php',data,function(response)
				{   
			oTableDwExcel.clear();//limpiar tabla
            oTableDwExcel.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableDwExcel.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaTipoDeCambio'+rowIdx+'" ><thead><th>Id</th><th>Nombre De Escenario</th><th>Nombre De Plantilla</th><th>Tipo De Presupuesto</th><th>Descargar Excel</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableDwExcel.row( rowIdx ).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableDwExcel.row(rowIdx).child().find("table"));
                                
                            });
			     /*agregamos las subtablas*/
		    oTableDwExcel.draw();
			oTableDwExcel.columns.adjust();//ajustar contenido a la tabla
					
				},'json');
			
		}
	});
	/*cargar catalogo de escenarios para descarga de excel*/
	
	
	
	function cargarCatalogoTipoDeGeneracion(){	
	/*crear dataTables*/
	$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:'accion=cargarCatalgoTipoG',
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();   
				       
					    }
            });
		},
		success: function(response)
		{
		
			$('#loader').bPopup().close();
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('.mensajeSatisfactorio').fadeOut(15000);
			oTableTipoGen.fnClearTable();//limpiar tabla
            oTableTipoGen.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableTipoGen.fnAdjustColumnSizing();//ajustar contenido a la tabla 
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	/*cargar catalogo*/
} 
	
	/*generar calendario para tipo de cambio*/
	$("#txtFechaDeCambio").datepicker({
			dateFormat:"yy-mm-dd",
			showOn: "button",
			buttonImage: "./Imagenes/calendario.png",
			buttonImageOnly: true,
			showAnim: "drop",
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
dayNames:['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
nextText: "Adelante",
prevText: "Atras"
	});
/*generar calendario para tipo de cambio*/	
	
	
	
	

    
	
	$('#vtnDialogoVarios').dialog( //creamos dilogo para la ventana
	{
	type:'modal',
	autoOpen:false,
	show:cea(),
	hide:cea(),
    modal: true,
	width:450,
	height:250,
	resizable:false,
	});
	
	$('#vtnDialogoEmpresasClasesEx,#vtnSelectClaseParaExcelDw').dialog(
	{
		type:'modal',
	autoOpen:false,
	show:cea(),
	hide:cea(),
    modal: true,
	width:550,
	height:250,
	resizable:false,
	});
	
	
	
	
	
	

	
	
	
	
	/*eliminar clase presupuesto de plantilla*/
	$(document).on('click','.checksClasesPresDePlantilla',function()
	{
		var idPlantilla=$.trim($('#IdPlantilla').text());
		var idRegistro=($(this).data('is')=="")?$(this).val():$(this).data('is')
		var accion=($(this).data('is')=="")?'AgregarClasePlan':'ModificarClasePlan'
		
		
		if($(this).is(':checked'))
		{
		data=
				{
					accion:accion,
					idRegistro:idRegistro,
					idRegistro2:idPlantilla
				}
			
			$.ajax({
				type:"POST",
				url:"../Php_Scripts/s_accionesVarios.php",
				dataType:"json",
				data:data,
				success: function(response)
				{
					   alertt(response.mensaje);
					
						oTableTipoPlantillaExcelClasePre.fnClearTable();//limpiar tabla
                        oTableTipoPlantillaExcelClasePre.fnAddData(response.arrayTabla);//agregar datos a la tabla
                        oTableTipoPlantillaExcelClasePre.fnAdjustColumnSizing();//ajustar contenido a la tabla
						
					
					setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
			               },2500)
					
				}
				});

		}else
		{
			
			if(confirm("¿Esta seguro que desea eliminar la clase de presupuesto de la plantilla "+$('#txtNombredePlantillaClasePreEx').val()+"?")){
		
		data=
				{
					accion:'eliminarClaseDePlantilla',
					idRegistro:idRegistro,
					idRegistro2:idPlantilla
				}
			
				$.post('../Php_Scripts/s_accionesVarios.php',data,function(response)
				{
					    oTableTipoPlantillaExcelClasePre.fnClearTable();//limpiar tabla
                        oTableTipoPlantillaExcelClasePre.fnAddData(response.arrayTabla);//agregar datos a la tabla
                        oTableTipoPlantillaExcelClasePre.fnAdjustColumnSizing();//ajustar contenido a la tabla
					
				},'json');
		}
			else
			{
			
			   $(this).attr('checked',true);
			}
			
		}
		
		 
        
		
		
		
	});
	/*eliminar clase presupuesto de plantilla*/
	
	
	/*agregar clase de presupuestos a plantilla*/
	$(document).on('click','.agregarClasePresupuestoExcel',function()
	{
		
		var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
		var nombreDePlantilla=$(this).closest('table tr').find('td').eq(1).text();
		$('#IdPlantilla').text($.trim(idRegistro))
		
		
		$('#contVtnEmpresasEx').hide();
		$('#contVtnClasePresEx').show();
		$('#vtnDialogoEmpresasClasesEx').dialog(
		{
			width:600,
	        height:420,
			
			close: function (event, ui) {
                 
				 /*volvemos a cargar el catalogo*/
				 cargarCatalogoTipoDePlantillaExcel();
				 /*volvemos a cargar el catalogo*/
				 
              },
			autoOpen:true,
			title:"Agregar Clases De Presupuesto.",
			open:function(event, ui)
			{
				/*agregar nombre de plantilla*/
				$('#txtNombredePlantillaClasePreEx').val(nombreDePlantilla);
				/*agregar nombre de plantilla*/
				
				data=
				{
					accion:'cargarChecksPlantillaClasesPre',
					idRegistro:$('#IdPlantilla').text()
				}
			
				$.post('../Php_Scripts/s_accionesVarios.php',data,function(response)
				{
					
					oTableTipoPlantillaExcelClasePre.fnClearTable();//limpiar tabla
                    oTableTipoPlantillaExcelClasePre.fnAddData(response.arrayTabla);//agregar datos a la tabla
                    oTableTipoPlantillaExcelClasePre.fnAdjustColumnSizing();//ajustar contenido a la tabla
				},'json');
				
				
				/*cargar empresas y nombre de plantilla*/
				
			},buttons:
			{
				'Cerrar':function(event, ui)
				{
					$(this).dialog("close");
				}
			}
			
		})
		
	});
	/*agregar clase de presupuestos a plantilla*/
	
	
	/*crear dataTable clases de presupuesto*/
	var oTableTipoPlantillaExcelClasePre=dataTableEspanolById('tClasePresupuesto');
	/*crear dataTable clases de presupuesto*/

	
	
	
	/*agregar empresas a plantilla*/
	$(document).on('click','.agregarEmpresasExcel',function()
	{
		var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
		var nombreDePlantilla=$(this).closest('table tr').find('td').eq(1).text();
		$('#IdPlantilla').text($.trim(idRegistro));
		
		$('#contVtnEmpresasEx').show();
		$('#contVtnClasePresEx').hide();
		$('#vtnDialogoEmpresasClasesEx').dialog(
		{
			width:550,
	        height:255,
			close: function (event, ui) {
                 
				 /*volvemos a cargar el catalogo*/
				 cargarCatalogoTipoDePlantillaExcel();
				 /*volvemos a cargar el catalogo*/
				 
              },
			autoOpen:true,
			title:"Agregar Empresas A Plantilla",
			open:function(event, ui)
			{
				/*cargar empresas y nombre de plantilla*/
				$('#txtNombredePlantillaEmp').val(nombreDePlantilla);
				data=
				{
					accion:'cargarDetalladoDeEmpresasEx',
					idRegistro:idRegistro
				}
				
				$.post('../Php_Scripts/s_accionesVarios.php',data,function(response)
				{
					$('#contEmpresasSelecExPlan').html(response.tabla);
				},'json');
				
				/*cargar empresas y nombre de plantilla*/
				
			},buttons:
			{
				'Cerrar':function(event, ui)
				{
					$(this).dialog("close");
				}
			}
			
		})
	});
	/*agregar empresas a plantilla*/
	
	
	
	/*actualizar empresas de plantillas*/
	
	$(document).on('click','.chkEmpresasEx',function()
	{
		var idRegistro=parseInt($(this).data('id'));
		var idPlantilla=$('#IdPlantilla').text();
		var empresa=$(this).data("empresa");
		if(idRegistro!=-1)
		{
			
			data={ //actualizar empresa de excel a Eliminado=Y
				
				
				accion:'actualizarEmpresaDeEx',
				idRegistro:idRegistro,
				idRegistro2:idPlantilla,
				cmbEmpresasSeleccionadas:empresa,
				
				
				}
		}else
		{
			
			data={
				
				 accion:'agregarEmpresaDeEx',
			     idRegistro2:idPlantilla,
				 cmbEmpresasSeleccionadas:empresa,
				 idRegistro:idRegistro,
				 
				
				}
		}
		
		
		$.post('../Php_Scripts/s_accionesVarios.php',data,function(response)
				{   
				        
					$('#contEmpresasSelecExPlan').html(response.tabla);
					
				},'json');
		
	});
	
	/*actualizar empresas de plantillas*/
	
	
	
	/*crear dataTables*/
	var oTableTipoGen=dataTableEspanolById('tTipoDeGen'); //tabla tipo de generacion}
	/*crear dataTables*/
	/*crear data table con child rows*/
	var oTableTipoConsul=DataTableEmpresas($('#tTipConsultas'));
	var oTableTipoPlantillaExcel=dataTableEspanolById('tTipExcel');
	var oTableTipoCam =$('#tTipDeCam').DataTable({
	"iDisplayLength": 50,	
    "columns": [
            {
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
			
            {},{},{},
			
            ],
			
			
			
			"bJQueryUI":false,
			
			"sPaginationType": "full_numbers",
			
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious": "Anterior"
                },

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="100">100</option>'+ 
'<option value="150">150</option>'+ 
'<option value="200">200</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

} 
    

}); 
	/*crear data table con child rows*/

/*funcion para desplegar chils rows de la tabla*/
$('#tTipDeCam tbody').on( 'click', 'td.details-control', function () {
	              
	            var tr = $(this).closest('tr');
                var child = oTableTipoCam.row(tr).child;
				
				
                if ( child.isShown() ) {
                    child.hide();
                    $(tr).removeClass('shown');
                }
                else {
                    child.show();
                    $(tr).addClass('shown');
                }
            } );
			
	$('#tTipConsultas tbody').on( 'click', 'td.details-control', function () {
	              
	            var tr = $(this).closest('tr');
                var child = oTableTipoConsul.row(tr).child;
				
				
                if ( child.isShown() ) {
                    child.hide();
                    $(tr).removeClass('shown');
                }
                else {
                    child.show();
                    $(tr).addClass('shown');
                }
            } );	
				
			
/*funcion para desplegar chils rows de la tabla*/

/*crear data table con child rows*/	

	
	
	

	
	$('#tabsVarios').tabs(); //generar tabs
	var active = $('#tabsVarios').tabs( "option", "active" );
	flagActive=active;
	cargarCatalogoTipoDeGeneracion();
	
	
	/*!!!!!!!!!!!!!!!!!!!!!!!!!!------funciones para cargar catalogos------!!!!!!!!!!!!!!!!!!!!!!!!!!*/
	
	function cargarCatalogoTipoDeCambio()
	{
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:'accion=cargarCatalogoTipoDeCambio',
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();   
				       
					    }
            });
		},
		success: function(response)
		{
		
		    
			$('#loader').bPopup().close();
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('.mensajeSatisfactorio').fadeOut(15000);
			
			oTableTipoCam.clear();//limpiar tabla
            oTableTipoCam.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
			
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
			  
             var dataTableChild=new Array();
			
                            oTableTipoCam.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas[rowIdx];
                                cuentasTable='<table id="subTablaTipoDeCambio'+rowIdx+'" ><thead><th>Id</th><th>Tipo De Cambio</th><th>Fecha De Cambio</th><th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableTipoCam.row( rowIdx ).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableTipoCam.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableTipoCam.draw();
			oTableTipoCam.columns.adjust();//ajustar contenido a la tabla
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
	
	
	function cargarCatalogoTipoDePlantillaExcel()
	{
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:'accion=cargarCatalogoPlantillasExcel',
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();   
				       
					    }
            });
		},
		success: function(response)
		{
	        

			$('#loader').bPopup().close();
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('.mensajeSatisfactorio').fadeOut(15000);
			oTableTipoPlantillaExcel.fnClearTable();//limpiar tabla
            oTableTipoPlantillaExcel.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableTipoPlantillaExcel.fnAdjustColumnSizing();//ajustar contenido a la tabla
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
	
	
	
	
	
	
	
	
	
	
	function cargarCatalogoTipoDeConsultas()
	{
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:'accion=cargarCatalogoConsultas',
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();   
				       
					    }
            });
		},
		success: function(response)
		{
		
			$('#loader').bPopup().close();
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('.mensajeSatisfactorio').fadeOut(15000);
			
			oTableTipoConsul.clear();//limpiar tabla
            oTableTipoConsul.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
            
			
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
			 
             var dataTableChild=new Array();
			
                            oTableTipoConsul.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaConsulta'+rowIdx+'" ><thead><th>Id</th><th>Nombre De Consulta</th><th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableTipoConsul.row(rowIdx).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableTipoConsul.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableTipoConsul.draw();
			oTableTipoConsul.columns.adjust();//ajustar contenido a la tabla
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
	
	
	
	
    
	

/*!!!!!!!!!!!!!!!!!!!!!!!!!!------funciones para cargar catalogos------!!!!!!!!!!!!!!!!!!!!!!!!!!*/



/*modificar plantilla de excel*/

$(document).on('click','.modificarPlantillaExcel',function()
{
	         $('#contVtnTipoConsul').hide();
			 $('#contVtnTipoCam').hide();
			 $('#contVtnTipoG').hide();
			 $('#contVtnTipoPlantillaExcel').show();
			 
			 /*obtener valores de la row seleccionada*/
			 
			 var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
			 var nombrePlantilla=$(this).closest('table tr').find('td').eq(1).text();
			
			 
			 
			
			 
			 /*obtener valores de la row seleccionada*/
			
			  
			  $('#vtnDialogoVarios').dialog(
			 {
				 title:'Agregar Plantilla Excel',
				  width:890,
                  height:550,
				  open:function(event,ui)
				  {
					  /*resetear inputs*/
			           $('#tFrmTipoPlantillaExcel input[type=text]').val("");
			           $('#tFrmTipoPlantillaExcel input[type=text]').removeClass('formulario-inputs-alert');
					  
					
			         /*resetear inputs*/
					 
					 /*cargar valores a modificar en inputs*/
					 $('#txtNombreDePlantilla').val(nombrePlantilla);
					 /*cargar valores a modificar en inputs*/
					 
					 data=
					 {
						 idRegistro:idRegistro,
						 accion:'cargarDetalladoDePlantillaEx'
					 }
					 
					 /*cargamos detallados si es que tiene*/
					  $.post( "../Php_Scripts/s_accionesVarios.php",data, function(response) {
						  
                      $('#subTCeldas tbody ').html(response.tabla);
                      },'json');
					  /*cargamos detallados si es que tiene*/
				  },
				 autoOpen:true,
				 buttons:
				 {
					 
					 'Modificar':function(event,ui)
					 {
						var arrayColumnasDeExcel=new Array();
						var arrayColumnasNuevasDeExcel=new Array();
					   $('#subTCeldas tbody tr').each(function(index, element) { 
					      var orientacion=$.trim($(this).find('td').eq(0).find('select option:selected').val()); 
						  var posicion=$.trim($(this).find('td').eq(1).find('input').val());
					      var origen=$.trim($(this).find('td').eq(2).find('input').val());
						  var destino=$.trim($(this).find('td').eq(3).find('input').val());
						  var tipoDeDato=$.trim($(this).find('td').eq(4).find('input').val());
						  var ordenamiento=$.trim($(this).find('td').eq(5).find('input').val());
						  var id=$(this).attr('id').substring(4);
						  
						  
						
						
					     if($(this).data('addforuser')==0){ //comprobamos si es informacion agregada por el usuaroi
							 arrayColumnasDeExcel.push({orientacion:orientacion,posicion:posicion,origen:origen,destino:destino,tipoDeDato:tipoDeDato,ordenamiento:ordenamiento,id:id});
						 }
						 
						 if($(this).data('addforuser')==1){
							arrayColumnasNuevasDeExcel.push({orientacion:orientacion,posicion:posicion,origen:origen,destino:destino,tipoDeDato:tipoDeDato,ordenamiento:ordenamiento});
						 }
                    });
							 
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'modificarPlantillaDeExcel',
							 txtNombre:$('#txtNombreDePlantilla').val(),
							 txtConsultas: arrayColumnasDeExcel,
							 txtNuevasConsultas:arrayColumnasNuevasDeExcel,
							 idRegistro:idRegistro
							 
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
				
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoPlantillaExcel.fnClearTable();//limpiar tabla
            oTableTipoPlantillaExcel.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableTipoPlantillaExcel.fnAdjustColumnSizing();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='nombreDePlantilla')
				{
					$('#tFrmTipoPlantillaExcel #txtNombreDePlantilla').addClass('formulario-inputs-alert');
					$('#tFrmTipoPlantillaExcel #txtNombreDePlantilla').focus();
					$(document).on('input keyup','#tFrmTipoPlantillaExcel #txtNombreDePlantilla',function()
					{
						$('#tFrmTipoPlantillaExcel #txtNombreDePlantilla').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=="origenDestino")
				{
					  $('#subTCeldas tbody tr').each(function(index, element) {
						var posicion=$.trim($(this).find('td').eq(1).find('input').val())
						var idPosicion=$.trim($(this).find('td').eq(1).find('input').attr('id'))
						var origen=$.trim($(this).find('td').eq(2).find('input').val());
						var idOrigen=$.trim($(this).find('td').eq(2).find('input').attr('id'));
						var destino=$.trim($(this).find('td').eq(3).find('input').val());
						var idDestino=$.trim($(this).find('td').eq(3).find('input').attr('id'));
						var idTipoDeDato=$.trim($(this).find('td').eq(4).find('input').attr('id'));
						var tipoDeDato=$.trim($(this).find('td').eq(4).find('input').val());
						var idOrdenamiento=$.trim($(this).find('td').eq(5).find('input').attr('id'));
						var ordenamiento=$.trim($(this).find('td').eq(5).find('input').val());
						
						if(origen=="")
						{
							$('#'+idOrigen).addClass('formulario-inputs-alert');
							
						}
						
						if(destino=="")
						{
							$('#'+idDestino).addClass('formulario-inputs-alert');
						}
						
						if(posicion=="")
						{
							$('#'+idPosicion).addClass('formulario-inputs-alert');
						}
						
						if(tipoDeDato=="")
						{
							$('#'+idTipoDeDato).addClass('formulario-inputs-alert');
						}
						
						if(ordenamiento=="")
						{
							$('#'+idOrdenamiento).addClass('formulario-inputs-alert');
						}
						
						if(isNaN(parseInt(ordenamiento)))
						{
							$('#'+idOrdenamiento).addClass('formulario-inputs-alert');
						}
						
						if(posicion=="a1" || posicion=="A1")
						{
							$('#'+idPosicion).addClass('formulario-inputs-alert');
							
						}
						
					 });
					 
					$(document).on('input keyup','#tFrmTipoPlantillaExcel  input',function()
					{
						$('#tFrmTipoPlantillaExcel input').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 }); 
});


/*modificar plantilla de excel*/






   /*modificar consulta*/
$(document).on('click','.modificarTipoDeConsulta',function()				
{
	
	         $('#contVtnTipoConsul').show();
			 $('#contVtnTipoCam').hide();
			 $('#contVtnTipoG').hide();
	          $('#contVtnTipoPlantillaExcel').hide();
			 
			 /*obtener informacion para mostrar*/
			 var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
			 
			 var nombreConsulta=$(this).closest('table tr').find('td').eq(1).text();
			 var valEmpresa=$(this).data('empresa');
			 /*obtener informacion para mostrar*/		 
			 
			  $('#vtnDialogoVarios').dialog(
			 {
				 title:'Modificar Consulta',
				 width:450,
                  height:350,
				  open:function(event,ui)
				  {
					  /*resetear inputs*/
			           $('#tFrmTipoConsul #cmbMiltipleEmpresasTipoCon').children().removeAttr('selected');
			           $('#tFrmTipoConsul input[type=text]').val("");
			           $('#tFrmTipoConsul input[type=text]').removeClass('formulario-inputs-alert');
					   /*quitar inputs agregados dinamicamente*/
					   $('#subTConsultas tbody tr').each(function(index, element) {
                        $(this).remove(); 
                    });
					/*quitar inputs agregados dinamicamente*/
					 /*resetear inputs*/
					 
					 /*poner valores en inputs*/
					$('#tFrmTipoConsul #txtNombreDeConsulta').val(nombreConsulta);
					$('#tFrmTipoConsul #cmbMiltipleEmpresasTipoCon').val(valEmpresa)
					 /*poner valores en inputs*/
					 
					 /*agregar consultas si es que las tiene*/
					 data=
					 {
						 accion:'agregarDetalladosConsulta',
						 idRegistro:idRegistro
					 }
					 
					 $.post( "../Php_Scripts/s_accionesVarios.php",data, function(response) {
                      $('#subTConsultas tbody ').html(response.tabla);
                      },"json");
					 /*agregar consultas si es que las tiene*/
					 
				  },
				 autoOpen:true,
				 buttons:
				 {
					 
					 'Modificar':function(event,ui)
					 {
						var arrayConsultas=new Array();
						var arrayNuevasConsultas=new Array();
						
					 $('#subTConsultas tbody tr').each(function(index, element) {
                          if($(this).find('textarea').data('addforuser')==1) //agregar nuevas consultas
						  {
							  var valor=$(this).find('textarea').val();
							  arrayNuevasConsultas.push($.trim(valor));
						  }
						  if($(this).find('textarea').data('addforuser')==0){ 
						  var id=($(this).find('textarea').attr('id').split("-"));
						  var valor=$(this).find('textarea').val();
						  
						 arrayConsultas.push({
							 id:id[1],
							 valor:$.trim(valor)}
							 );
						  }
                    });
								
								
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'modificarConsulta',
							 txtNombre:$('#txtNombreDeConsulta').val(),
							 cmbEmpresasSeleccionadas:$('#cmbMiltipleEmpresasTipoCon option:selected').val(),
							 txtNuevasConsultas: arrayNuevasConsultas,
							 txtConsultas:arrayConsultas,
							 idRegistro:idRegistro
							 
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
		
	        
		   
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoConsul.clear();//limpiar tabla
            oTableTipoConsul.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
           
			
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableTipoConsul.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaConsulta'+rowIdx+'" ><thead><th>Id</th><th>Nombre De Consulta</th><th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableTipoConsul.row(rowIdx).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableTipoConsul.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableTipoConsul.draw();
			 oTableTipoConsul.columns.adjust();//ajustar contenido a la tabla
			}else
			{
				
				if(response.fo=='nombreConsulta')
				{
					$('#tFrmTipoConsul #txtNombreDeConsulta').addClass('formulario-inputs-alert');
					$('#tFrmTipoConsul #txtNombreDeConsulta').focus();
					$(document).on('input keyup','#tFrmTipoConsul #txtNombreDeConsulta',function()
					{
						$('#tFrmTipoConsul #txtNombreDeConsulta').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=="consultas")
				{
					 $('#subTConsultas tbody tr').each(function(index, element) {
						var valor=$.trim($(this).find('textarea').val());
						var id=$(this).find('textarea').attr('id');
						
						if(valor=="")
						{
							$('#'+id).addClass('formulario-inputs-alert');
						}
					 });
					 
					$(document).on('input keyup','#tFrmTipoConsul  textarea',function()
					{
						$('#tFrmTipoConsul textarea').removeClass('formulario-inputs-alert');
					});
				}
				/***************************validar consultas repetidas en listado ********************************/
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 }); 
            
			 
});

/*modificar consulta*/


    /*modificar tipo de cambio*/
	$(document).on('click','.modificarTipoDeCambio',function()
	{
		
		var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
		var tipoCambio=($(this).closest('table tr').find('td').eq(1).text());
		var fechaDeCambio=$(this).closest('table tr').find('td').eq(2).text();
		var valEmpresa=$(this).data('empresa');
		
		
		
		     $('#contVtnTipoCam').show();
	          $('#contVtnTipoG').hide();
			  	$('#contVtnTipoConsul').hide();
				 $('#contVtnTipoPlantillaExcel').hide();
			
			 $('#vtnDialogoVarios').dialog(
			 {
				 title:'Modificar Tipo De Cambio',
				 width:450,
				 height:250,
				  open:function(event,ui)
				  {
					  /*aparecer controles segun accion a realizar*/
					  $('#contEmpresasSelecTipoDeCambio').hide();
					  $('#cmbMiltipleEmpresasTipoCam').show();
					   /*aparecer controles segun accion a realizar*/
					  
					  /*resetear inputs*/
			           $('#cmbMiltipleEmpresasTipoCam').children().removeAttr('selected');
			           $('#tFrmTipoCam input[type=text]').val("");
			           $('#tFrmTipoCam input[type=text]').removeClass('formulario-inputs-alert');
			         /*resetear inputs*/
					 /*poner valores a inputs*/
					 $('#txtNombreTipoDeCambio').val(tipoCambio);
					 $('#txtFechaDeCambio').val(fechaDeCambio);
					 $('#cmbMiltipleEmpresasTipoCam').val(valEmpresa);
					 /*poner valores a inputs*/
					 
				  },
				 autoOpen:true,
				 buttons:
				 {
					 
					 'Modificar':function(event,ui)
					 {
						 
						
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'modificarTipoDeCambio',
							 txtNombre:$('#txtNombreTipoDeCambio').val(),
							 txtFecha:$('#txtFechaDeCambio').val(),
							 cmbEmpresasSeleccionadas:$('#cmbMiltipleEmpresasTipoCam option:selected').val(),
							 idRegistro:idRegistro
							 
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoCam.clear();//limpiar tabla
            oTableTipoCam.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
           
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableTipoCam.rows().eq(0).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaTipoDeCambio'+rowIdx+'" ><thead><th>Id</th><th>Tipo De Cambio</th><th>Fecha De Cambio</th><th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableTipoCam.row( rowIdx ).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableTipoCam.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableTipoCam.draw();
			 oTableTipoCam.columns.adjust();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='nombreCambio')
				{
					$('#tFrmTipoCam #txtNombreTipoDeCambio').addClass('formulario-inputs-alert');
					$('#tFrmTipoCam #txtNombreTipoDeCambio').focus();
					$(document).on('input keyup','#tFrmTipoCam #txtNombreTipoDeCambio',function()
					{
						$('#tFrmTipoCam #txtNombreTipoDeCambio').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=='fechaCambio')
				{
					$('#tFrmTipoCam #txtFechaDeCambio').addClass('formulario-inputs-alert');
					$('#tFrmTipoCam #txtFechaDeCambio').focus();
					$(document).on('input keyup change','#tFrmTipoCam #txtFechaDeCambio',function()
					{
						$('#tFrmTipoCam #txtFechaDeCambio').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=='empresasSelectGen')
				{
					$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').addClass('formulario-inputs-alert');
					$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').focus();
					$(document).on('click','#tFrmTipoG #cmbMiltipleEmpresasTipoG',function()
					{
						$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 }); 
	});
	/*modificar tipo de cambio*/

	
	
	/*modificar tipo de generacion*/
	$(document).on('click','.modificarTipoDeGeneracion',function()
	{
		var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
		var nombre=$(this).closest('table tr').find('td').eq(1).text();
		$('#contVtnTipoG').show();
		$('#contVtnTipoCam').hide();	
	    $('#contVtnTipoConsul').hide();	
		$('#contVtnTipoPlantillaExcel').hide();
		$('#vtnDialogoVarios').dialog(
			 {
				 title:'Modificar Tipo De Generación',
				 width:450,
				 height:250,
				 open:function(event,ui)
				 {
					 /*resetear inputs*/
			           $('#cmbMiltipleEmpresasTipoG').children().removeAttr('selected');
			           $('#txtNombreTipoDeGeneracion').val("");
			           $('#tFrmTipoG input[type=text]').removeClass('formulario-inputs-alert');
		               $('#tFrmTipoG select').removeClass('formulario-inputs-alert');
			         /*resetear inputs*/
					 
					 /*poner valores que se han seleccionado en los inputs*/
					 $('#txtNombreTipoDeGeneracion').val(nombre);
					 /*poner valores que se han seleccionado en los inputs*/
					 
					 
					 /*obtener inpust seleccionados llamada ajax*/
					 
					 data=
					 {
						 accion:'cargarEmpresasSeleccionadas',
						 idRegistro:idRegistro
					 }
					 	 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
			$('#loader').bPopup().close();
			$.each(response.arrayTabla,function(index,value)
			{
				
				$('#cmbMiltipleEmpresasTipoG option').each(function(index, element) {
                    if($(this).val()==value)
					{
						$(this).attr('selected',true);
					}
                });
			});
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
					 /*obtener inpust seleccionados llamada ajax*/
				 },
				 autoOpen:true,
				 buttons:
				 {
					 
					 
					 'Modificar':function(event,ui)
					 {
						 var arrayEmpresas=new Array();
						 
						 $('#cmbMiltipleEmpresasTipoG option:selected').each(function(index, element) {
							 
                            arrayEmpresas.push($(element).val());
							
                        });
						
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'ModificarTipoDeGeneracion',
							 txtNombre:$('#txtNombreTipoDeGeneracion').val(),
							 cmbEmpresasSeleccionadas:arrayEmpresas,
							 idRegistro:idRegistro
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoGen.fnClearTable();//limpiar tabla
            oTableTipoGen.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableTipoGen.fnAdjustColumnSizing();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='nombreGeneracion')
				{
					$('#tFrmTipoG #txtNombreTipoDeGeneracion').addClass('formulario-inputs-alert');
					$('#tFrmTipoG #txtNombreTipoDeGeneracion').focus();
					$(document).on('input keyup','#tFrmTipoG #txtNombreTipoDeGeneracion',function()
					{
						$('#tFrmTipoG #txtNombreTipoDeGeneracion').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=='empresasSelectGen')
				{
					$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').addClass('formulario-inputs-alert');
					$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').focus();
					$(document).on('click','#tFrmTipoG #cmbMiltipleEmpresasTipoG',function()
					{
						$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 });
	});
	/*modificar tipo de generacion*/
	
	
	/*eliminar plantilla excel*/
	
	$(document).on('click','.deletePlantillaExcel',function()
	{
		var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	    var row=$(this).closest('table tr').get([0]);
	if(confirm("Esta seguro que desea eliminar la plantilla de excel?"))
	{
		
		data=
	{
		accion:'eliminarPlantillaEx',
		idRegistro:idRegistro
	}
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
             oTableTipoPlantillaExcel.fnDeleteRow(row);//eliminar dato de data table
			
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
	});
	
	/*eliminar plantilla excel*/
	
	
	
	
	
	/*eliminar tipo de consulta*/
$(document).on('click','.deleteTipoDeConsulta',function()
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var row=$(this).closest('table tr').get([0]);
	var idTabla=$(this).closest('table').attr('id');
	var rowCount=parseInt($('#'+idTabla+' tbody tr').length);

	
	if(confirm("Esta seguro que desea eliminar la consulta?"))
	{
		
		data=
	{
		accion:'eliminarConsulta',
		idRegistro:idRegistro
	}
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		success: function(response)
		{
			
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('.mensajeSatisfactorio').fadeOut(15000);
            $('#'+idTabla).dataTable().fnDeleteRow(row);//eliminar dato de data table
			
		},error: function(response)
		
		{
			
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		},complete: function(response)
		{
			if((rowCount-1)==0)
			{
				cargarCatalogoTipoDeConsultas();
			}
		}
		
		});
	}
});
	
	/*eliminar tipo de consulta*/
	
	
	
	/*eliminar tipo de cambio*/
	$(document).on('click','.deleteTipoDecambio',function()
	{
		
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var row=$(this).closest('table tr').get([0]);
	var idTabla=$(this).closest('table').attr('id');
	var rowCount=parseInt($('#'+idTabla+' tbody tr').length);
	
	if(confirm("Esta seguro que desea eliminar el tipo de cambio?"))
	{
		
		data=
	{
		accion:'eliminarTipoCambio',
		idRegistro:idRegistro
	}
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		success: function(response)
		{
			
			
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			 $('#'+idTabla).dataTable().fnDeleteRow(row);
            
			
		},error: function(response)
		
		{
			 
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		},complete: function(response)
		{
			if((rowCount-1)==0){
		   cargarCatalogoTipoDeCambio();
			}
		}
		});
	}
	});
	/*eliminar tipo de cambio*/
	
	
	
	/*eliminar tipo de generación*/
$(document).on('click',	'.deleteTipoDeGeneracion',function()
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var row=$(this).closest('table tr').get([0]);
	if(confirm("Esta seguro que desea eliminar el tipo de generación?"))
	{
		
		data=
	{
		accion:'eliminarTipoDeGeneracion',
		idRegistro:idRegistro
	}
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
             oTableTipoGen.fnDeleteRow(row);//eliminar dato de data table
			
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
	
});
	/*eliminar tipo de generación*/
	
	
	
	
	/*cargar contenido en data table segun la tab seleccionada*/
 
 $(document).on('click','.ui-tabs-anchor',function()
 {
	 var active=$('#tabsVarios').tabs('option','active');
	if(flagActive!=active){
		flagActive=active;
	 switch(active)
	 {
		 case 0://Tipo De Generación
		 cargarCatalogoTipoDeGeneracion();
		 break;
		 
		 case 1://Tipo De Cambio
		 cargarCatalogoTipoDeCambio();
		 break;
		 
		 case 2://Tipo De Consulta
		 cargarCatalogoTipoDeConsultas();
		 break;
		 
		 case 3: //tipo Plantilla
         cargarCatalogoTipoDePlantillaExcel();
   		 break;
	 }
	 
	}
	 
 });
 	
    
	/*cargar contenido en data table segun la tab seleccionada*/
	
	/*poner formato de moneda en tipo de cambio*/
			$(document).on('focusout','#txtNombreTipoDeCambio',function()
			{
				var newVal=((parseFloat(($(this).val()).split(",").join(""))).formatMoney(2, '.', ','));
				
				$(this).val(newVal);
				
				
			}); 
			/*poner formato de moneda en tipo de cambio*/
	

	
	/*mostrar dialogo segun boton seleccionado*/
	$(document).on('click','.vDialogVarios',function()
	{
		var idVentana=$(this).closest('a').attr('id');
		
	
		
		switch(idVentana)
		{
			case 'agregarTipoDeGeneracion': //abrir ventana tipo de generacion
			
			 $('#contVtnTipoG').show();
			 $('#contVtnTipoCam').hide();
			 $('#contVtnTipoConsul').hide();
			 $('#contVtnTipoPlantillaExcel').hide();
			 $('#vtnDialogoVarios').dialog(
			 {
				 title:'Agregar Tipo De Generación',
				 width:450,
                 height:250,
				  open:function(event,ui)
				  {
					  /*resetear inputs*/
			           $('#cmbMiltipleEmpresasTipoG').children().removeAttr('selected');
			           $('#txtNombreTipoDeGeneracion').val("");
			           $('#tFrmTipoG input[type=text]').removeClass('formulario-inputs-alert');
		               $('#tFrmTipoG select').removeClass('formulario-inputs-alert');
			         /*resetear inputs*/
				  },
				 autoOpen:true,
				 buttons:
				 {
					 
					 'Agregar':function(event,ui)
					 {
						 var arrayEmpresas=new Array();
						 
						 $('#cmbMiltipleEmpresasTipoG option:selected').each(function(index, element) {
							 
                            arrayEmpresas.push($(element).val());
							
                        });
						
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'agregarTipoDeGeneracion',
							 txtNombre:$('#txtNombreTipoDeGeneracion').val(),
							 cmbEmpresasSeleccionadas:arrayEmpresas
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoGen.fnClearTable();//limpiar tabla
            oTableTipoGen.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableTipoGen.fnAdjustColumnSizing();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='nombreGeneracion')
				{
					$('#tFrmTipoG #txtNombreTipoDeGeneracion').addClass('formulario-inputs-alert');
					$('#tFrmTipoG #txtNombreTipoDeGeneracion').focus();
					$(document).on('input keyup','#tFrmTipoG #txtNombreTipoDeGeneracion',function()
					{
						$('#tFrmTipoG #txtNombreTipoDeGeneracion').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=='empresasSelectGen')
				{
					$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').addClass('formulario-inputs-alert');
					$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').focus();
					$(document).on('click','#tFrmTipoG #cmbMiltipleEmpresasTipoG',function()
					{
						$('#tFrmTipoG #cmbMiltipleEmpresasTipoG').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 });
			 
			break;
			
			
			/*agregar tipo de cambio*/
			case 'agregarTipoDeCambio':
			
			$('#contVtnTipoCam').show();
			$('#contVtnTipoG').hide();
			$('#contVtnTipoConsul').hide();
			$('#contVtnTipoPlantillaExcel').hide();
			
			
			 $('#vtnDialogoVarios').dialog(
			 {
				 title:'Agregar Tipo De Cambio',
				 height: 350,
			     width: 550,
				  open:function(event,ui)
				  {
					  /*aparecer controles segun accion a realizar*/
					  $('#contEmpresasSelecTipoDeCambio').show();
					  $('#cmbMiltipleEmpresasTipoCam').hide();
					   /*aparecer controles segun accion a realizar*/
					   
					  /*resetear inputs*/
			           $('#tFrmTipoCam input[type=text]').val("");
			           $('#tFrmTipoCam input[type=text]').removeClass('formulario-inputs-alert');
					   $('#tFrmTipoCam #contEmpresasSelecTipoDeCambio').removeClass('formulario-inputs-alert');
			         /*resetear inputs*/
					 
					 /*cargar empresas*/
					 
					 data=
					 {
						 accion:'obtenerEmpresasChecksTDC'
					 }
					 
					 $.post('../Php_Scripts/s_accionesVarios.php',data,function(response)
					 {
						 $('#contEmpresasSelecTipoDeCambio').html(response.tabla);
						 
					 },'json');
					 /*cargar empresas*/
				  },
				 autoOpen:true,
				 buttons:
				 {
					 
					 'Agregar':function(event,ui)
					 {
						 var arrayEmpresas=new Array();
						 
						 /*agregar empresas seleccionadas array*/
						 $('.chkAgregarEmpresaTipoCambio').each(function(index, element) {
                            if($(this).is(':checked'))
							{
								arrayEmpresas.push($(this).val());
							}
							
                        });
						
						 /*agregar empresas seleccionadas array*/
						
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'agregarTipoDeCambio',
							 txtNombre:$('#txtNombreTipoDeCambio').val(),
							 txtFecha:$('#txtFechaDeCambio').val(),
							 cmbEmpresasSeleccionadas:arrayEmpresas
							 
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoCam.clear();//limpiar tabla
            oTableTipoCam.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
            
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableTipoCam.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="stabla'+rowIdx+'" ><thead><th>Id</th><th>Tipo De Cambio</th><th>Fecha De Cambio</th><th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableTipoCam.row( rowIdx ).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableTipoCam.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableTipoCam.draw();
			oTableTipoCam.columns.adjust();//ajustar contenido a la tabla
			}else
			{
				
				if(response.fo=='nombreCambio')
				{
					$('#tFrmTipoCam #txtNombreTipoDeCambio').addClass('formulario-inputs-alert');
					$(document).on('input keyup','#tFrmTipoCam #txtNombreTipoDeCambio',function()
					{
						$('#tFrmTipoCam #txtNombreTipoDeCambio').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=='fechaCambio')
				{
					$('#tFrmTipoCam #txtFechaDeCambio').addClass('formulario-inputs-alert');
					$(document).on('input keyup change','#tFrmTipoCam #txtFechaDeCambio',function()
					{
						$('#tFrmTipoCam #txtFechaDeCambio').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=='empresa')
				{
					$('#tFrmTipoCam #contEmpresasSelecTipoDeCambio').addClass('formulario-inputs-alert');
					$(document).on('click','#tFrmTipoCam #contEmpresasSelecTipoDeCambio :input:checkbox',function()
					{
						$('#tFrmTipoCam #contEmpresasSelecTipoDeCambio').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 }); 
			 
			 
			
			break;
		   
		   case 'agregarTipoDeConsulta': //agregar consulta
		     $('#contVtnTipoConsul').show();
			 $('#contVtnTipoCam').hide();
			 $('#contVtnTipoG').hide();
			  $('#contVtnTipoPlantillaExcel').hide();
			 
			  $('#vtnDialogoVarios').dialog(
			 {
				 title:'Agregar Consulta',
				 width:450,
                 height:350,
				  open:function(event,ui)
				  {
					  /*resetear inputs*/
			           $('#tFrmTipoConsul #cmbMiltipleEmpresasTipoCon').children().removeAttr('selected');
			           $('#tFrmTipoConsul input[type=text]').val("");
			           $('#tFrmTipoConsul input[type=text]').removeClass('formulario-inputs-alert');
					   /*quitar inputs agregados dinamicamente*/
					   $('#subTConsultas tbody tr').each(function(index, element) {
                        $(this).remove(); 
                    });
					/*quitar inputs agregados dinamicamente*/
					
			         /*resetear inputs*/
				  },
				 autoOpen:true,
				 buttons:
				 {
					 
					 'Agregar':function(event,ui)
					 {
						var arrayConsultas=new Array();
						
						
					 $('#subTConsultas tbody tr').each(function(index, element) {
                         
						 arrayConsultas.push($.trim($(this).find('textarea').val()));
			
                    });
								
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'agregarConsulta',
							 txtNombre:$('#txtNombreDeConsulta').val(),
							 cmbEmpresasSeleccionadas:$('#cmbMiltipleEmpresasTipoCon option:selected').val(),
							 txtConsultas: arrayConsultas
							 
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
		
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoConsul.clear();//limpiar tabla
            oTableTipoConsul.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
          
			
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableTipoConsul.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaConsulta'+rowIdx+'" ><thead><th>Id</th><th>Nombre De Consulta</th><th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableTipoConsul.row(rowIdx).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableTipoConsul.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableTipoConsul.draw();
		    oTableTipoConsul.columns.adjust();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='nombreConsulta')
				{
					$('#tFrmTipoConsul #txtNombreDeConsulta').addClass('formulario-inputs-alert');
					$('#tFrmTipoConsul #txtNombreDeConsulta').focus();
					$(document).on('input keyup','#tFrmTipoConsul #txtNombreDeConsulta',function()
					{
						$('#tFrmTipoConsul #txtNombreDeConsulta').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=="consultas")
				{
					 $('#subTConsultas tbody tr').each(function(index, element) {
						var valor=$.trim($(this).find('textarea').val());
						var id=$(this).find('textarea').attr('id');
						
						if(valor=="")
						{
							$('#'+id).addClass('formulario-inputs-alert');
						}
					 });
					 
					$(document).on('input keyup','#tFrmTipoConsul  textarea',function()
					{
						$('#tFrmTipoConsul textarea').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 }); 
		   break;
		   
		   
		   case 'agregarPlantillaExcel'://Plantilla de excel
		     $('#contVtnTipoConsul').hide();
			 $('#contVtnTipoCam').hide();
			 $('#contVtnTipoG').hide();
			 $('#contVtnTipoPlantillaExcel').show();
			
			  
			  $('#vtnDialogoVarios').dialog(
			 {
				 title:'Agregar Plantilla Excel',
				  width:890,
                  height:550,
				  open:function(event,ui)
				  {
					  /*resetear inputs*/
			           $('#tFrmTipoPlantillaExcel input[type=text]').val("");
			           $('#tFrmTipoPlantillaExcel input[type=text]').removeClass('formulario-inputs-alert');
					  
					
			         /*resetear inputs*/
					 
					 /*agregar valores por default  a plantilla de excel*/
					 
					 $.post('../Php_Scripts/s_accionesVarios.php','accion=cargarValoresDefaultPlantilla',function(response)
					 {
						  $('#subTCeldas tbody').html(response.tabla);
					 },'json')
					 
					 /*agregar valores por default a plantilla de excel*/
				  },
				 autoOpen:true,
				 buttons:
				 {
					 
					 'Agregar':function(event,ui)
					 {
						var arrayColumnasDeExcel=new Array();
					   $('#subTCeldas tbody tr').each(function(index, element) {
						  var orientacion=$.trim($(this).find('td').eq(0).find('select option:selected').val()); 
						  var posicion=$.trim($(this).find('td').eq(1).find('input').val());
					      var origen=$.trim($(this).find('td').eq(2).find('input').val());
						  var destino=$.trim($(this).find('td').eq(3).find('input').val());
						  var tipoDeDato=$.trim($(this).find('td').eq(4).find('input').val());
						  var ordenamiento=$.trim($(this).find('td').eq(5).find('input').val());
						 
						
						   arrayColumnasDeExcel.push({orientacion:orientacion,posicion:posicion,origen:origen,destino:destino,tipoDeDato:tipoDeDato,ordenamiento:ordenamiento});
			
                    });
							
							
						 /*peticion ajax agregar Tipo Generacion*/
						 var data=
						 {
							 accion:'agregarPlantillaDeExcel',
							 txtNombre:$('#txtNombreDePlantilla').val(),
							 txtConsultas: arrayColumnasDeExcel
							 
						 }
						 
						
						 $.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
				
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoVarios').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableTipoPlantillaExcel.fnClearTable();//limpiar tabla
            oTableTipoPlantillaExcel.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableTipoPlantillaExcel.fnAdjustColumnSizing();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='nombreDePlantilla')
				{
					$('#tFrmTipoPlantillaExcel #txtNombreDePlantilla').addClass('formulario-inputs-alert');
					$('#tFrmTipoPlantillaExcel #txtNombreDePlantilla').focus();
					$(document).on('input keyup','#tFrmTipoPlantillaExcel #txtNombreDePlantilla',function()
					{
						$('#tFrmTipoPlantillaExcel #txtNombreDePlantilla').removeClass('formulario-inputs-alert');
					});
				}else if(response.fo=="origenDestino")
				{
					 $('#subTCeldas tbody tr').each(function(index, element) {
						var posicion=$.trim($(this).find('td').eq(1).find('input').val())
						var idPosicion=$.trim($(this).find('td').eq(1).find('input').attr('id'))
						var origen=$.trim($(this).find('td').eq(2).find('input').val());
						var idOrigen=$.trim($(this).find('td').eq(2).find('input').attr('id'));
						var destino=$.trim($(this).find('td').eq(3).find('input').val());
						var idDestino=$.trim($(this).find('td').eq(3).find('input').attr('id'));
						var idTipoDeDato=$.trim($(this).find('td').eq(4).find('input').attr('id'));
						var tipoDeDato=$.trim($(this).find('td').eq(4).find('input').val());
						var idOrdenamiento=$.trim($(this).find('td').eq(5).find('input').attr('id'));
						var ordenamiento=$.trim($(this).find('td').eq(5).find('input').val());
						
						if(origen=="")
						{
							$('#'+idOrigen).addClass('formulario-inputs-alert');
							
						}
						
						if(destino=="")
						{
							$('#'+idDestino).addClass('formulario-inputs-alert');
						}
						
						if(posicion=="")
						{
							$('#'+idPosicion).addClass('formulario-inputs-alert');
						}
						
						if(tipoDeDato=="")
						{
							$('#'+idTipoDeDato).addClass('formulario-inputs-alert');
						}
						
						if(ordenamiento=="")
						{
							$('#'+idOrdenamiento).addClass('formulario-inputs-alert');
						}
						
						if(posicion=="a1" || posicion=="A1")
						{
							$('#'+idPosicion).addClass('formulario-inputs-alert');
							
						}
					
						
					 });
					 
					$(document).on('input keyup','#tFrmTipoPlantillaExcel  input',function()
					{
						$('#tFrmTipoPlantillaExcel input').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
						 
						 
					 },
					 
					 'Cerrar':function(event,ui)
					 {
						 $(this).dialog("close");
						
					 }
				 }
				
			 }); 
		   break;
 		
		}
	});
	
}


var idInput=0;
/*agregar inputs dinamico a plantilla excel*/
$(document).on('click','.addColumnasOD',function()
{
	 idInput++;
$('#subTCeldas  tbody').prepend('<tr   data-addforuser="1" id="txtI'+idInput+'" ><td style="border-right:1px #CCC solid;"><select style="width:120px;" class="formulario-inputs-selects" name="cmbOrientacion'+idInput+'" id="cmbOrientacion'+idInput+'" ><option value="R">Derecha</option><option value="L">Izquierda</option><option value="U">Arriba</option><option value="D">Abajo</option></select></td><td style="border-right:1px #CCC solid;"><input type="text" style="width:120px; font-size:12px;"  maxlength="10" id="txtPosicion'+idInput+'" name="txtPosicion'+idInput+'" class="formulario-inputs" placeholder="Posición."/></td><td style="border-right:1px #CCC solid;"><input  name="txtOrigen-'+idInput+'"  id="txtOrigen-'+idInput+'"  class="formulario-inputs"  style="width:120px; font-size:12px;" maxlength="250" placeholder="Origen." /></td><td style="border-right:1px #CCC solid;"><input  name="txtDestino-'+idInput+'"  id="txtDestino-'+idInput+'"  class="formulario-inputs"  placeholder="Destino."  style="width:120px; font-size:12px;" maxlength="250" /></td><td style="border-right:1px #CCC solid;"> <input  name="txtTipoDeDato-'+idInput+'"  id="txtTipoDeDato-'+idInput+'"  class="formulario-inputs"  placeholder="Tipo De Dato."  style="width:120px; font-size:12px;" maxlength="250" /></td> <td style="border-right:1px #CCC solid;"> <input  name="txtOrdenamiento-'+idInput+'"  id="txtOrdenamiento-'+idInput+'"  class="formulario-inputs"  placeholder="Ordenamiento."  style="width:103px; font-size:12px;" maxlength="250" /></td> <td><img class="deleteOrigenDestino"  data-loadofdb="0"; data-eliminar="1";  style=" cursor:pointer;"    src="Imagenes/delete.png" /></tr>');
$('#txtPosicion'+idInput+'').focus();
	 
});

$(document).on('click','.deleteOrigenDestino',function()
{
	var data=$(this).data('loadofdb');
	var eliminar=$(this).data('eliminar');
	
	
	
	if(eliminar==0)
	{
		alertt("No se puede eliminar ya que es un campo obligatorio que debe llenar.");
	}
	else{
	switch(data)
	{
		
		case 0: //eliminar input html
		$(this).closest('table tr').fadeOut('fast',function()
		{
			$(this).remove();
		});
		break;
		
		case 1: //eliminar input html y bd
		var idRegistro=$(this).closest('table tr').attr('id').substring(4);
		
	    var row=$(this).closest('table tr').get([0]);
		/*peticion ajax para eliminar detalle desde bd*/
		
	
	if(confirm("¿Esta seguro que desea eliminar el origen y destino de la plantilla?")){
		 
		 var data=
		{
			accion:'eliminarOrigenDestinoDet',
			idRegistro:idRegistro
		}
	
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			if(response.respuesta=="si"){
			
			 
             $(row).fadeOut('fast',function()
			 {
				 $(this).remove();
			 });
			
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
		/*peticion ajax para eliminar detalle desde bd*/
		break;	
		
	}
	}
});





/*agregar input dinamico  a consulta*/

$(document).on('click','.addConsulta',function()
{ 
     idInput++;
	$('#subTConsultas  tbody').prepend('<tr><td style="border-right:1px #CCC solid;"><textarea data-addforuser="1" name="txtConsulta-'+idInput+'"  id="txtConsulta-'+idInput+'"  class="formulario-textarea"  style="width:200px; height:100px;"></textarea></td><td><img class="deleteConsultt"  data-loadofdb="0";  style=" cursor:pointer;"    src="Imagenes/delete.png" /></td></tr>');
	
$('#txtConsulta-'+idInput+'').focus();
});
/*agregar input dinamico  a consulta*/

/*eliminar consulta*/
$(document).on('click','.deleteConsultt',function()
{
	var data=$(this).data('loadofdb');
	
	
	switch(data)
	{
		
		case 0: //eliminar input html
		$(this).closest('table tr').fadeOut('fast',function()
		{
			$(this).remove();
		});
		break;
		
		case 1: //eliminar input html y bd
		var idRegistro=$(this).closest('table tr').find('textarea').attr('id').split("-");
		var row=$(this).closest('table tr').get([0]);
		/*peticion ajax para eliminar detalle desde bd*/
		
	
	if(confirm("¿Esta seguro que desea eliminar la consulta de la base de datos?")){
		 
		 var data=
		{
			accion:'eliminarConsultaDet',
			idRegistro:idRegistro[1]
		}
	
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesVarios.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			if(response.respuesta=="si"){
			
			 
             $(row).fadeOut('fast',function()
			 {
				 $(this).remove();
			 });
			
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
		/*peticion ajax para eliminar detalle desde bd*/
		break;	
		
	}
	
	
});
/*eliminar consulta*/


/****************************************varios.php****************************************************/












/********************************************indicadores.php*****************************************************/
if(baseName=='indicadores.php'){
$('#tabsAccioneesIndicadores').tabs();//crear tabs
var oTableCI=dataTableEspanolById('tCatalogoIndicadores');
var oTableCEI=$('#tCuentasDeEmpresaIndi').DataTable({
	"iDisplayLength": 50,
    "columns": [
            {
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
            {},{},{}
            ]
    

});   //crear dataTable    //crear dataTable  

/*cargar cuentas de tipo de empresa*/
$(document).on('change','#cmbSelectEmpresaInd',function()
{
	var idRegistro=$('#cmbSelectEmpresaInd option:selected').val();
	
	data=
	{
		idRegistro:idRegistro,
		accion:'cargarCuentasDeEmpresa'
	};
	
	alert(data.accion)
	
	$.ajax({
		url:'../Php_Scripts/s_accionesIndicadores.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
			$('#loader').bPopup().close();
			                oTableCEI.clear();//limpiar tabla
                            oTableCEI.rows.add(response.titulo);//agregar datos a la tabla
                            oTableCEI.columns.adjust();//ajustar contenido a la tabla
                            cuentas=$("#selectCuentas").val().split(",");
                            subTablas=response.tabla;
							
                            $(cuentas).each(function(index,val){
                                
                                $("#NumCuenta_"+val,oTableCEI.table().node()).click();
                            });
							
                            oTableCEI.rows().eq( 0 ).each( function (rowIdx) {
                                todasCuentas=subTablas.shift();
                                cuentasTable="<table id='subTabla"+rowIdx+"' ><thead><th>Cuenta</th><th>Nombre Cuenta</th><th>Seleccionar Cuenta</th></thead><tbody>";
                                $(todasCuentas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+="<td>"+val2+"</td>";
                                        });
                                    cuentasTable+="</tr>";
                                });
                                cuentasTable+="</tbody></table>";
                               // alert(cuentasTable);
                                oTableCEI.row( rowIdx ).child(cuentasTable);
                                oTableCEI.row( rowIdx ).child().removeClass('shown');
                                combierteDatatableTempReferencia(oTableCEI.row(rowIdx).child().find("table"));
                                oTableCEI.row( rowIdx ).child().addClass('shown');
                            } );
                           oTableCEI.draw();
			
		},error:function(response)
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		
	});
	
});
/*cargar cuentas de tipo de empresa*/










/*modificar indicador*/
$(document).on('click','.modificarIndicador',function()
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var indicador=$(this).closest('table tr').find('td').eq(1).text();
	var empresa=$(this).closest('table tr').find('td').eq(2).text();
	var cuenta=$(this).closest('table tr').find('td').eq(3).text();
	
	

	
	
	/*abrir dialogo para modificar datos*/
	$('#vtnDialogoIndicadores').dialog(
    {
	title:'Modificar Indicador',
	open:function(event,ui)
	{
		/*reiniciar inputs*/
	$('#tFrmAcionesIndicadores #txtIndicador').removeClass('formulario-inputs-alert');
	$('#tFrmAcionesIndicadores #txtIndicador').val("");
	$('#tFrmAcionesIndicadores #cmbEmpresaIndicador').val($('option:first', $('#cmbEmpresaIndicador')).val()); //resetear cmb
	$('#tFrmAcionesIndicadores #cmbClaseDeCuentaInd').val($('option:first', $('#cmbClaseDeCuentaInd')).val()); //resetear cmb
	/*reiniciar inputs*/
		
		/*poner valores que vamos a modificar*/
		$(' #tFrmAcionesIndicadores #txtIndicador').val(indicador);
		$('#tFrmAcionesIndicadores #cmbEmpresaIndicador').val($(' #tFrmAcionesIndicadores #cmbEmpresaIndicador option:contains('+empresa+')').val());
		$('#tFrmAcionesIndicadores #cmbClaseDeCuentaInd').val($(' #tFrmAcionesIndicadores #cmbClaseDeCuentaInd option:contains('+cuenta+')').val());
	},
	autoOpen:true,
	buttons:
	{
		'Modificar':function(event,ui)
		{
			
			data={	
				  accion:'modificarIndicador',
				  txtIndicador:$('#txtIndicador').val(),
				  cmbEmpresa:$('#cmbEmpresaIndicador option:selected').val(),
				  cmbClaseCuenta:$('#cmbClaseDeCuentaInd option:selected').val(),
				  idRegistro:idRegistro
				  
				 }
					
			/*llamada ajax para agregar datos*/
			$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesIndicadores.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoIndicadores').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableCI.fnClearTable();//limpiar tabla
            oTableCI.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableCI.fnAdjustColumnSizing();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='indicador')
				{
					$('#tFrmAcionesIndicadores #txtIndicador').addClass('formulario-inputs-alert');
					$('#tFrmAcionesIndicadores #txtIndicador').focus();
					$(document).on('input keyup','#tFrmAcionesIndicadores #txtIndicador',function()
					{
						$('#tFrmAcionesIndicadores #txtIndicador').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
			/*llamada ajax para agregar datos*/
		},
		'Cerrar':function(event, ui)
		{
			$(this).dialog("close");
		}
	}
});
	/*abrir dialogo para modificar datos*/
	

});
/*modificar indicador*/








/*eliminar indicador*/
$(document).on('click','.deleteIndicador',function()
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var row=$(this).closest('table tr').get([0]);
	if(confirm("¿Esta seguro que desea eliminar el indicador?")){
		
	data=
	{
		accion:'eliminarIndicador',
		idRegistro:idRegistro
	}
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesIndicadores.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			if(response.respuesta=="si"){
			
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
            oTableCI.fnDeleteRow(row);//eliminar dato de data table
			
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
	}
});

/*eliminar indicador*/









/*crear ventana dialogo*/
$('#vtnDialogoIndicadores').dialog(
{
	type:'modal',
	autoOpen:false,
	show:cea(),
	hide:cea(),
    modal: true,
	width:450,
	height:250,
	resizable:false,
})


/*cargar datos en catalogo*/
$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesIndicadores.php',
		data:'accion=cargarCatalogo',
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
			$('#loader').bPopup().close();
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('.mensajeSatisfactorio').fadeOut(15000);
			oTableCI.fnClearTable();//limpiar tabla
            oTableCI.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableCI.fnAdjustColumnSizing();//ajustar contenido a la tabla 
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
/*cargar datos en catalogo*/


/*abrir ventana dialogo*/
$(document).on('click','#btnAgregarIndicador',function()
{
	/*reiniciar inputs*/
	$('#tFrmAcionesIndicadores #txtIndicador').removeClass('formulario-inputs-alert');
	$('#tFrmAcionesIndicadores #txtIndicador').val("");
	$('#tFrmAcionesIndicadores #cmbEmpresaIndicador').val($('option:first', $('#cmbEmpresaIndicador')).val()); //resetear cmb
	$('#tFrmAcionesIndicadores #cmbClaseDeCuentaInd').val($('option:first', $('#cmbClaseDeCuentaInd')).val()); //resetear cmb
	/*reiniciar inputs*/
	$('#vtnDialogoIndicadores').dialog(
	{
		title:'Agregar Nuevo Indicador',
		autoOpen:true,
		buttons:
	{
		'Agregar':function(event,ui)
		{
			
			var data=
			{
				accion:'agregarIndicador',
				txtIndicador:$('#txtIndicador').val(),
				cmbEmpresa:$('#cmbEmpresaIndicador option:selected').val(),
				cmbClaseCuenta:$('#cmbClaseDeCuentaInd option:selected').val()
				
			};
			
			/*llamada ajax para agregar datos*/
			$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesIndicadores.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			if(response.respuesta=="si"){
			alertt(response.mensaje);
			 setTimeout(function()
			 {
			   $('#vtnDialogoIndicadores').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			oTableCI.fnClearTable();//limpiar tabla
            oTableCI.fnAddData(response.arrayTabla);//agregar datos a la tabla
            oTableCI.fnAdjustColumnSizing();//ajustar contenido a la tabla
			}else
			{
				if(response.fo=='indicador')
				{
					$('#tFrmAcionesIndicadores #txtIndicador').addClass('formulario-inputs-alert');
					$('#tFrmAcionesIndicadores #txtIndicador').focus();
					$(document).on('input keyup','#tFrmAcionesIndicadores #txtIndicador',function()
					{
						$('#tFrmAcionesIndicadores #txtIndicador').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		});
			/*llamada ajax para agregar datos*/
		},
		'Cerrar':function(event, ui)
		{
			$(this).dialog("close");
		}
	}
	});
});



}
/********************************************indicadores.php*****************************************************/




/************************************************************administracionDePresupuestos.php*************************************************************************/



if(baseName=='administracionDePresupuestos.php')
{
	$('#tabsADP').tabs();//creamos  tabs
	
	
	
     /*modificar presupuesto*/
	$(document).on('click','.modificPresEnc',function()
	{
		/*checamos si hay un valor por get en la página*/
		var get=(window.location.search).substring(1,9);
		/*checamos si hay un valor por get en la página*/
		var idPresEnc=$(this).closest('table tbody tr').find('td').eq(0).text();;
		if(get!="")
		{ 
			var newGet=get.split('=');
			
			$(location).attr('href','../modificacionPresupuesto.php?pptoGral='+newGet[1]+'&pptoEnc='+idPresEnc+'&idGral='+newGet[1]);	
		}else
		{
			$(location).attr('href','../modificacionPresupuesto.php');
		}
	});
	/*modificar presupuesto*/
	
	
	
	
	/*ver presupuesto solo vizualización*/
		$(document).on('click','.verPreEnc',function()
		{
			$(document).find('.nombrePresup').removeClass('nombrePresup');
			$(this).closest('table tbody tr').find('td').eq(1).addClass('nombrePresup');
			var idPresupuestoEnc=$(this).closest('table tbody tr').find('td').eq(0).text();
			cargaPPTO(idPresupuestoEnc);
		});
	/*ver presupuesto solo vizualización*/
	
	
	
	/*Funciones para visualizar y modificar el presupuesto*/
	
	/*ventana de dialogo para vizualizar presupuesto*/
$("#vtnDialogoVizualizarPresupuesto").dialog({
	autoOpen: false,
	title:'Visualización De Presupuesto',
	show:cea(),
	closeOnEscape: false,
        hide: {
			
            effect: cea(),
            duration: 500
        },
	draggable: true,
        modal:true,
	resizable: false,
         height:$(window).height()-($(window).height()*1/100),
        width:"99%",
	buttons: {
                'Cerrar': function(){
                     $(this).dialog('close');               
		 	},
		
		'Exportar Excel':function(event,ui)
		{
			if(!($('#tablePPTO').is(':visible')))
			{
				alertt("No hay datos para exportar.");
				
			}else
			{
			
			/*obtener encabezados de tabla*/
   				 encabezadosDeTabla=new Array();
  			     cuerpoDeTabla=new Array();
				 var count=0;
   			    $("#tablePPTO thead").find("th").each(function(){
        		if($(this).parent().attr("role")=='row'){
				if(count!=21){
					
            	encabezadosDeTabla.push($(this).text());
				}
					count++;
			
        		}
    		});
           /*obtener encabezados de tabla*/
		   
		   
		   /*obtener datos de cuerpo de tabla*/
		   $('#tablePPTO tbody tr').each(function(index, element) {
			
		
			if($(this).attr('class')!=undefined){
			/*btener datos*/   
            var oneOrCero=($(this).find('td').eq(0).hasClass('details-control'))?1:0;
			var cuenta=$(this).find('td').eq(1).text();
			var nCuenta=$(this).find('td').eq(2).text();
			var norma=$(this).find('td').eq(3).text();
			var nNorma=$(this).find('td').eq(4).text();
			var mCuenta=$(this).find('td').eq(5).text();
			var nCuentaMaestra=$(this).find('td').eq(6).text();
			var enero=$(this).find('td').eq(7).text();
			var febrero=$(this).find('td').eq(8).text();
			var marzo=$(this).find('td').eq(9).text();
			var abril=$(this).find('td').eq(10).text();
			var mayo=$(this).find('td').eq(11).text();
			var junio=$(this).find('td').eq(12).text();
			var julio=$(this).find('td').eq(13).text();
			var agosto=$(this).find('td').eq(14).text();
			var septiembre=$(this).find('td').eq(15).text();
			var octubre=$(this).find('td').eq(16).text();
			var noviembre=$(this).find('td').eq(17).text();
			var diciembre=($(this).find('td').eq(18).text());
			var totalAnual=$(this).find('td').eq(19).text();
			var filial=$(this).find('td').eq(20).find('select option:selected').text();
			/*obtener datos*/   
			
			
		   
			
			
			
			/*agregamos al array*/
			cuerpoDeTabla.push({oneOrCero:oneOrCero,cuenta:cuenta,nCuenta:nCuenta,norma:norma,nNorma:nNorma,mCuenta:mCuenta,nCuentaMaestra:nCuentaMaestra,enero:enero,febrero:febrero,marzo:marzo,abril:abril,mayo:mayo,junio:junio,julio:julio,agosto:agosto,septiembre:septiembre,octubre:octubre,noviembre:noviembre,diciembre:diciembre,totalAnual:totalAnual,filial:filial})
			/*agregamos al array*/
			}
        });
		   
		   
		   /*obtener datos de cuerpo de tabla*/
		   
		   
		   /*mandar datos via ajax*/
		   data=
		   {
			   accion:'gt',
			   encabezadosDeTabla:encabezadosDeTabla,
			   cuerpoDeTabla:cuerpoDeTabla
		   }
		   
		   $.post('../Php_Scripts/s_descargarPlantillaExcelVizualizar.php',data,function(response)
		   {
			   
			 
			  $(location).attr('href','../Php_Scripts/s_descargarPlantillaExcelVizualizar.php?accion=crearExcel');
		   });
		    /*mandar datos via ajax*/
   
		}
	  }
		
	}
	

}); 
	
	
	
	
	/*Funciones para visualizar y modificar el presupuesto*/
	
	
	
	
	/*Eliminar presupuesto hijo*/
	
	$(document).on('click','.deletePresupuestoEnc',function()
	{
		var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
		var empresa=$(this).closest('table').data('empresa');
		var idTabla=$(this).closest('table').attr('id');
		var tr=$(this).closest('table tbody tr');
		
	
		if(confirm("Esta seguro que desea eliminar el presupuesto " + $(this).closest('table tr').find('td').eq(1).text()+'?')){
		
		data=
		{
			idRegistro:idRegistro,
			accion:'eliminarPresupuestoHijo'
		}
		
	$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesAdminPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			alertt(response.mensaje);
		    if(response.respuesta=="si"){
		    setTimeout(function()
			{
				  $('#customAlert').dialog("close");
				  $('#'+idTabla).DataTable().row(tr).remove().draw();
                  $('#'+idTabla).DataTable().columns.adjust();//ajustar contenido a la tabla
				  
				  
			},2500);
			
			
		   }

		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		
		});
		
		
		
		
		
		
		
		
		}
		
		
		
		
		
	});
	
	/*Eliminar presupuesto hijo*/
	
	
	
	
	
	
	
	
	/*eliminar presupuesto  padre*/
	$(document).on('click','.deletePresupuestoAdmin',function()
	{
		var idRegistro=$(this).closest('table tr').find('td').eq(1).text();
		var empresa=$(this).closest('table').attr('id').substring(1);
		
		
	
		
		if(confirm("Esta seguro que desea eliminar el presupuesto " + $(this).closest('table tr').find('td').eq(3).text()+'?')){
		
		data=
		{
			idRegistro:idRegistro,
			accion:'eliminarPresupuestoPadre'
		}
		
	$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesAdminPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
		 
			$('#loader').bPopup().close();
		    $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('.mensajeSatisfactorio').fadeOut(15000); 
	
			cargarCatalogoDePresupuestos($('#cmbAnoPres option:selected').val(),$('#cmbTipoPresupuesto option:selected').val(),empresa,$('#cmbTipoPresupuestoConf option:selected').val());
			
			
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		
		});
		
		
		
		
		
		
		
		
		}
	});
	/*eliminar presupuesto  padre*/
	

	
	
	/*crear data tables*/
	
$('.tAdminPres').each(function(index, element) {
        
		var idTablasDataTable=$(this).attr('id');
		
		
		$('#'+idTablasDataTable).DataTable({
			 "iDisplayLength": 50,
    "columns": [
            {
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
			
            {},{},{},{},{},{},{},{}
			
            ],
			
			
			
			"bJQueryUI":false,
			
			"sPaginationType": "full_numbers",
			
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious": "Anterior"
                },

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="100">100</option>'+ 
'<option value="150">150</option>'+ 
'<option value="200">200</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

} 
    

}).draw(); 
});
	
	
	

/*mostrar child rows de la tabla*/
$('.tAdminPres tbody').on('click', 'td.details-control', function () {
	            
		var idTabla=$(this).closest('table').attr('id');
		var tr = $(this).closest('tr');
        var child = $('#'+idTabla).DataTable().row(tr).child;
				
				
                if ( child.isShown() ) {
                    child.hide();
                    $(tr).removeClass('shown');
                }
                else {
                    child.show();
                    $(tr).addClass('shown');
                }
            } );	
/*mostrar child rows de la tabla*/

	
	var active=$('#tabsADP').tabs('option','active'); 
    flagActive=active;
		
     cargarCatalogoDePresupuestos($('#cmbAnoPres option:selected').val(),$('#cmbTipoPresupuesto option:selected').val(),'TO',$('#cmbTipoPresupuestoConf option:selected').val());
	
	$(document).on('click','.ui-tabs-anchor',function()
	{
		var active=$('#tabsADP').tabs('option','active');
		var empresa=($(this).closest('a').attr('href')).substr(1);
		if(flagActive!=active){
	     flagActive=active;
		/*datos a enviar*/	
		cargarCatalogoDePresupuestos($('#cmbAnoPres option:selected').val(),$('#cmbTipoPresupuesto option:selected').val(), empresa,$('#cmbTipoPresupuestoConf option:selected').val());
		
		/*datos a enviar*/
		/*****************************Envio de peticion Ajax**************************************/
		}
		
	});
	
	
	/*mandar consulta de catalogo cuando cambia el valor de un combobox*/
	$(document).on('change','.cmbPres',function()
	{
		var active=$('#tabsADP').tabs('option','active');
		$('#tabsADP ul li').each(function(index, element) {
             
			 if(active==index)
			 {
				var empresa=($(this).find('a').attr('href')).substring(1);
				
				cargarCatalogoDePresupuestos($('#cmbAnoPres option:selected').val(),$('#cmbTipoPresupuesto option:selected').val(),empresa,$('#cmbTipoPresupuestoConf option:selected').val());
				return false;
				 
			 }
        });
		
		
		
	});
	/*mandar consulta de catalogo cuando cambia el valor de un combobox*/
	
	
	
	
	

	
	
	/**********************************************************cargarCatalogoDePresupuestos*******************************************************/
	function cargarCatalogoDePresupuestos(ano,tipoDePresupuesto,empresa,categoria) 
	{
		
		
		data=
		{
			
			accion:'cargarDatos',
			ano:ano,
			tipoDePresupuesto:tipoDePresupuesto,
			empresa:empresa,
			categoria:categoria
			
		};
		/*datos a enviar*/

		
		/*****************************Envio de peticion Ajax**************************************/
		
		
		
		$.ajax(
		{
		type:"POST",
		url:'../Php_Scripts/s_accionesAdminPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			
		
			$('#loader').bPopup().close();
		    $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000); 
	
			       $('#t'+empresa).DataTable().clear();
                   $('#t'+empresa).DataTable().rows.add(response.tabla["titulos"]);//agregar datos a la tabla
				   
                   $('#t'+empresa).DataTable().columns.adjust();//ajustar contenido a la tabla
			       
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
			
			 var dataTableChild=new Array();
			 
                            $('#t'+empresa).DataTable().rows().eq(0).each(function(rowIdx) {
                             var empresas=subTablas[rowIdx];
   cuentasTable='<table data-empresa="'+empresa+'" id="subTablaPresupuestosEnc'+rowIdx+'" ><thead><th>Id</th><th>Nombre</th><th>Clase De Presupuesto</th>  <th>Tipo De Presupuesto</th>  <th>Categoria</th><th>Estatus</th> <th>Monto</th> <th>Escenario</th> <th>Acciones</th> </thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
								
                                 $('#t'+empresa).DataTable().row(rowIdx).child(cuentasTable);
								
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia( $('#t'+empresa).DataTable().row(rowIdx).child().find("table"));
								
                                
                            });
			/*agregamos las subtablas*/
			 $('#t'+empresa).DataTable().draw();
                          //alert('#t'+empresa);
			
			
			
		},error: function(response)
		
		{
			 $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		
		});
	}
	/**********************************************************cargarCatalogoDePresupuestos*******************************************************/
	
	

	
	
}


/************************************************************administracionDePresupuestos.php*************************************************************************/







/**************************************************confPresupuesto.php******************************************************************/



if(baseName=='confPresupuestos.php'){
	
/*eliminar datos de data table*/	
$(document).on('click','.eliminarClasePre',function() //eliminar clase de presupuesto
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var row = $(this).closest("tr").get([0]); //row a eliminar del data tabale
	var idTabla=$(this).closest('table').attr('id');
	var rowCount=parseInt($('#'+idTabla+' tbody tr').length);
	
	data=
	{
		accion: 'eliminarClasePresupuesto',
		idRegistro: idRegistro
	}

	if(confirm("¿Esta seguro que desea eliminar la clase de presupuesto?"))
	{
		//peticion ajax eliminar registro
		$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			if(response.respuesta=="si"){
				
		     $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
   			 $('#'+idTabla).dataTable().fnDeleteRow(row);//eliminar dato de data table
			 
			
			 
			
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		},complete: function(response)
		{ 
		   /*contamos rows de tabla que se elimino y si es 0 refrescamos la tabla padre para que la clase de presupuesto se elimine*/
			
			
			if((rowCount-1)==0)
			{
				
				data=
		{
			accion:'cargarClaseDePresupuestos'
		}
				/*refrescamos el padre*/
				$.post('../Php_Scripts/s_acciones_confPresupuestos.php',data,function(response)
				{
				  if(response.respuesta=="si"){	
				  oTableCDP.clear();//limpiar tabla
                  oTableCDP.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
                  
			
			      /*agregamos las subtablas*/
			      var subTablas=response.tabla['contenidoTabla'];
                  var dataTableChild=new Array();
			
                            oTableCDP.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaClaseDePresupuesto'+rowIdx+'" ><thead><th>Id</th><th>Compañia</th>  <th>Tipo De Presupuesto</th> <th>Escenarios</th> <th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableCDP.row(rowIdx).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableCDP.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableCDP.draw();
			oTableCDP.columns.adjust();//ajustar contenido a la tabla
				  }
				},'json');
				/*refrescamos el padre*/
			}
			 
		   /*contamos rows de tabla que se elimino y si es 0 refrescamos la tabla padre para que la clase de presupuesto se elimine*/
			
		}
	});
	}

});


$(document).on('click','.eliminarTipoPresupuesto',function()//eliminar tipo de presupuesto
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var row = $(this).closest("tr").get([0]); //row a eliminar del data tabale
		
	data=
	{
		accion: 'eliminarTipoDePresupuestos',
		idRegistro: idRegistro
	}

	if(confirm("¿Esta seguro que desea eliminar el tipo de presupuesto?"))
	{
		//peticion ajax eliminar registro
		$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			if(response.respuesta=="si"){
				
		     $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			
			oTableTDP.fnDeleteRow(row);//eliminar dato de data table
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
	}
	
})

$(document).on('click','.deleteCategoriaPre',function()//aliminar categoria de presupuesto
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();//id a eliminar de la base de datos
    var row = $(this).closest("tr").get([0]); //row a eliminar del data tabale
	data=
	{
		accion: 'eliminarCategoriaDePresupuestos',
		idRegistro: idRegistro
	}

	if(confirm("¿Esta seguro que desea eliminar la categoría?"))
	{
		//peticion ajax eliminar registro
		$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			 onClose: function() {
				  response.abort();        
					    }
            });
		},
		success: function(response)
		{
			if(response.respuesta=="si"){
				
		     $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			 oTableTCDP.fnDeleteRow(row);//eliminar dato de data table
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
	}
	
});
/*eliminar datos de data table*/

/*modificar datos de data table*/
$(document).on('click','.ModificarClasePre',function()//modificar clase de presupuestos
{
	
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();//id a eliminar de la base de datos
	var name=$(this).data("clase");//nombre clase presupuesto
	var nombreEmpresa=$(this).closest('table tr').find('td').eq(1).text(); //compañia  
	var idEmpresa=$('#cmbTipoEmpresaClaseP option:contains('+nombreEmpresa+')').val(); 
	var nombrePresupuesto=$(this).data("tipopresupuesto"); 
	
	$('#tdp').hide();
    $('#cdp').hide();
    $('#cldp').show();
		$('#vAgregarDatosPresupuesto').dialog(
		{
			title:"Modificar clase de presupuesto.",
			autoOpen:true,
			height: 250,
		    width: 400,
			open:function(event,ui)
			{
				 /*aparecer controles segun ventana*/
				$('#cmbTipoEmpresaClaseP').show();
				$('#contEmpresasSelecClasePresConf').hide();
				/*aparecer controles segun ventana*/
				
				/*llamada ajax*/
				   $.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:'accion=cargarListaTipoDePresupuestos',
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			   $('#cmbTipoPres').html(response.tabla);//cargamos los option en select
			   idPresupuesto=$('#cmbTipoPres option:contains('+nombrePresupuesto+')').val();//obtenemos el value del texto
			   $('#cmbTipoPres').val(idPresupuesto);//seleccionamos el texto con el valor
				
			}
		},error: function(response)
		{       $('#loader').bPopup().close();
			    alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
				
	/*llamada ajax*/			
			
				
				/*agregar valores a inputs*/
				$('#txtClaseDePresupuesto').removeClass('formulario-inputs-alert');
				$('#txtClaseDePresupuesto').val(name);
				$('#cmbTipoEmpresaClaseP').val(idEmpresa);
				/*agregar valores a inputs*/
			},
			buttons:{
					'Modificar':function(event,ui )
					{
						
						data=
						{
							accion:'modificarClaseDePresupuesto',
							name:$('#txtClaseDePresupuesto').val(),
							empresa:$('#cmbTipoEmpresaClaseP option:selected').val(),
							tipoPresupuesto:$('#cmbTipoPres option:selected').val(),
							idRegistro:idRegistro
						};
						//llamada ajax para agregar categoria de presupuesto
						$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			if(response.respuesta=="si"){
				
		          alertt(response.mensaje);
			      oTableCDP.clear();//limpiar tabla
                  oTableCDP.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
                
			
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableCDP.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaClaseDePresupuesto'+rowIdx+'" ><thead><th>Id</th><th>Compañia</th>  <th>Tipo De Presupuesto</th> <th>Escenarios</th>  <th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableCDP.row(rowIdx).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableCDP.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			  oTableCDP.draw();
			  oTableCDP.columns.adjust();//ajustar contenido a la tabla
			 setTimeout(function()
			 {
			   $('#vAgregarDatosPresupuesto').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			}else
			{
				if(response.fo=="name")
				{
					$('#txtClaseDePresupuesto').focus();
					$('#txtClaseDePresupuesto').addClass('formulario-inputs-alert');
					$(document).on('input keyup','#tFrmAccionesClaseDePresupuesto #txtClaseDePresupuesto',function()
					{
						$('#txtClaseDePresupuesto').removeClass('formulario-inputs-alert');
					});
					
				}
				
				alertt(response.mensaje);
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
						//llamada ajax para agregar categoria de presupuesto
													
					},'Cerrar':function(event,ui )
					{
						$(this).dialog("close");
					}
				}
		});
	
	
});


$(document).on('click','.modificarTipoPresupuesto',function() //modificar tipo de presupuesto
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();//id a eliminar de la base de datos
	var name=$(this).closest('table tr').find('td').eq(1).text();//nombre de color
	
	$('#cdp').hide();
	$('#cldp').hide();
	$('#tdp').show();
		$('#vAgregarDatosPresupuesto').dialog(
		{
			title:"Modificar Tipo De Presupuesto.",
			autoOpen:true,
			height: 210,
		    width: 400,
			open:function(event,ui)
			{
				/*agregar valores a inputs*/
				$('#tFrmAccionesTipoDePresupuesto input').removeClass('formulario-inputs-alert');
				$('#txtTipoDePresupuesto').val(name);
				
				/*agregar valores a inputs*/
			},
			buttons:{
					'Modificar':function(event,ui )
					{
						var data = new FormData();
						var img=document.getElementById($("#txtImagenTipoDePresupuesto").attr("id"));
						img=img.files;
						data.append("Imagen", img[0]);
						data.append("name",$('#txtTipoDePresupuesto').val());
						data.append("accion","modificarTipoDePresupuesto");
						data.append("idRegistro",idRegistro);
						
						//llamada ajax para agregar categoria de presupuesto
						$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		processData: false,
        contentType: false,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			 
			if(response.respuesta=="si"){
				
		     alertt(response.mensaje);
			 oTableTDP.fnClearTable();//limpiar tabla
             oTableTDP.fnAddData(response.arrayTabla);//agregar datos a la tabla
             oTableTDP.fnAdjustColumnSizing();//ajustar contenido a la tabla
			 setTimeout(function()
			 {
			   $('#vAgregarDatosPresupuesto').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			}else
			{
				if(response.fo=="name")
				{
					$('#txtTipoDePresupuesto').focus();
					$('#txtTipoDePresupuesto').addClass('formulario-inputs-alert');
					$(document).on('input keyup','#tFrmAccionesTipoDePresupuesto #txtTipoDePresupuesto',function()
					{
						$('#txtTipoDeCategoriaPresupuesto').removeClass('formulario-inputs-alert');
					});
					
				}else if(response.fo=='file')
				{
					$('#txtImagenTipoDePresupuesto').addClass('formulario-inputs-alert');
					$(document).on('change','#tFrmAccionesTipoDePresupuesto #txtImagenTipoDePresupuesto',function()
					{
						$('#txtImagenTipoDePresupuesto').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
						//llamada ajax para agregar categoria de presupuesto
													
					},'Cerrar':function(event,ui )
					{
						$(this).dialog("close");
					}
				}
		});
	
});

$(document).on('click','.modificarCategoriaPre',function() //modificar categoria presupuesto
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();//id a eliminar de la base de datos
	var name=$(this).closest('table tr').find('td').eq(1).text();//nombre de color 
	

	$('#cdp').show();
	$('#cldp').hide();
	$('#tdp').hide();
		$('#vAgregarDatosPresupuesto').dialog(
		{
			title:"Modificar categoria.",
			autoOpen:true,
			height: 230,
		    width: 420,
			open:function(event,ui)
			{
				
				/*limpiar mesajes de error y valores en formulario*/
		       /*limpiar mesajes de error y valores en formulario*/
				/*agregar valores a inputs*/
				$('#txtTipoDeCategoriaPresupuesto').val(name);
				$('#txtTipoDeCategoriaPresupuesto').removeClass('formulario-inputs-alert');
				$('#tFrmAccionesCategoria #txtImagenTipoDeCategoriaPresupuesto').val("");
				/*agregar valores a inputs*/
			},
			buttons:{
					'Modificar':function(event,ui )
					{
					     
						var data = new FormData();
						var img=document.getElementById($("#txtImagenTipoDeCategoriaPresupuesto").attr("Id"));
						img=img.files;
						data.append("Imagen", img[0]);
						data.append("name",$('#txtTipoDeCategoriaPresupuesto').val());
						data.append("accion","modificarCategoriasDePresupuestos");
						data.append("idRegistro",idRegistro);
						
						
						
						
						//llamada ajax para agregar categoria de presupuesto
						$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		dataType:'json',
		processData: false,
        contentType: false,
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			 
			if(response.respuesta=="si"){
				
		     alertt(response.mensaje);
			 oTableTCDP.fnClearTable();//limpiar tabla
             oTableTCDP.fnAddData(response.arrayTabla);//agregar datos a la tabla
             oTableTCDP.fnAdjustColumnSizing();//ajustar contenido a la tabla
			 setTimeout(function()
			 {
			   $('#vAgregarDatosPresupuesto').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			}else
			{
				if(response.fo=="name")
				{
					$('#txtTipoDeCategoriaPresupuesto').focus();
					$('#txtTipoDeCategoriaPresupuesto').addClass('formulario-inputs-alert');
					$(document).on('input keyup','#tFrmAccionesCategoria #txtTipoDeCategoriaPresupuesto',function()
					{
						$('#txtTipoDeCategoriaPresupuesto').removeClass('formulario-inputs-alert');
					});
					
				}else if(response.fo=='file')
				{
					$('#txtImagenTipoDeCategoriaPresupuesto').addClass('formulario-inputs-alert');
					$(document).on('change','#tFrmAccionesCategoria #txtImagenTipoDeCategoriaPresupuesto',function()
					{
						$('#txtImagenTipoDeCategoriaPresupuesto').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
						//llamada ajax para agregar categoria de presupuesto
													
					},'Cerrar':function(event,ui )
					{
						$(this).dialog("close");
					}
				}
		});
});
/*modificar datos de data table*/



/*agregar escenarios a clases*/
$(document).on('click','.agregarEscenarioAClasePresup',function()
{
	$('#contVtnEscenarios').show();
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var empresa=$(this).data('empresa');
	$('#clasePresParaEs').text(idRegistro);
	$('#empresaParaEs').text(empresa);
	
	
	$('#vtnDialogEscenariosClasePresup').dialog(
	{
		title:"Agregar Escenarios",
		autoOpen:true,
		width:600,
		height:450,
		open:function(event,ui)
		{
			data=
			{
				accion:'cargarEscenariosDeClase',
				idRegistro:idRegistro,
				empresa:empresa
				
			}
			
			$.post('../Php_Scripts/s_acciones_confPresupuestos.php',data,function(response)
			{
				oTableEscenariosClasePresup.fnClearTable();//limpiar tabla
                oTableEscenariosClasePresup.fnAddData(response.tabla);//agregar datos a la tabla
                oTableEscenariosClasePresup.fnAdjustColumnSizing();//ajustar contenido a la tabla
			},'json');
		},
		buttons:
		{
			'Cerrar':function()
			{
				$(this).dialog("close");
			}
		}
	})
});
/*agregar escenarios a clases*/

/*agregar o eliminar clases de presupuestos*/
$(document).on('click','.ChecksEscenariosClasesPresup',function()
{
        var empresa=$('#empresaParaEs').text();
		var clasePresupuesto=$('#clasePresParaEs').text();
		var inputAmodificar=$(this).val();
		var idEscenario=$(this).closest('table tr').find('td').eq(0).text();
		var idRegistro=($(this).val()=="")?-1:$(this).val();
		
		
         
		if($(this).is(':checked'))
		{
		data=
				{
					accion:'agregarEscenarioClasePresupuesto',
					idRegistro:idRegistro,
					empresa:empresa,
					idEscenario:idEscenario,
					clasePresupuesto:clasePresupuesto
				}
			
			$.ajax({
				type:"POST",
				url:"../Php_Scripts/s_acciones_confPresupuestos.php",
				dataType:"json",
				data:data,
				success: function(response)
				{
					
				
			    oTableEscenariosClasePresup.fnClearTable();//limpiar tabla
                oTableEscenariosClasePresup.fnAddData(response.tabla);//agregar datos a la tabla
                oTableEscenariosClasePresup.fnAdjustColumnSizing();//ajustar contenido a la tabla
						
					
					setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
			               },2500)
					alertt(response.mensaje);
				}
				});

		}else
		{
			
			if(confirm("¿Esta seguro que desea eliminar el escenario de la clase?")){
		
		data=
				{
					accion:'eliminarEscenarioDeClase',
					idRegistro:idRegistro,
					empresa:empresa,
					clasePresupuesto:clasePresupuesto
					
				}
			
				$.post('../Php_Scripts/s_acciones_confPresupuestos.php',data,function(response)
				{
			    oTableEscenariosClasePresup.fnClearTable();//limpiar tabla
                oTableEscenariosClasePresup.fnAddData(response.tabla);//agregar datos a la tabla
                oTableEscenariosClasePresup.fnAdjustColumnSizing();//ajustar contenido a la tabla
					
				},'json');
		}
			else
			{
			
			   $(this).attr('checked',true);
			}
			
		}
		
});

/*agregar o eliminar clases de presupuestos*/




$('#tabsPresupuesto').tabs();//crear tabs

/*crear data dialog*/
$('#vAgregarDatosPresupuesto,#vtnDialogEscenariosClasePresup').dialog(
{
	
                closeOnEscape: true,
                scrollable: true,
				resizable: false,
				show:cea(),
				hide:cea(),
                modal: true,
				autoOpen:false,
				
});
/*crear data dialog*/
$('.vDialogCdp').click(function()
{
	var idBoton=$(this).closest('a').attr('id');
	
	switch(idBoton)
	{
		case 'btnAgregarCategoriaPresupuesto':
		$('#cdp').show();
		$('#tdp').hide();
		$('#cldp').hide();
		$('#vAgregarDatosPresupuesto').dialog(
		{
			title:"Agregar nueva categoria.",
			autoOpen:true,
			height: 230,
		    width: 420,
			open:function(event,ui)
			{
				$('#tFrmAccionesCategoria input').val("");
				/*limpiar mesajes de error y valores en formulario*/
		        $('#tFrmAccionesCategoria input').removeClass('formulario-inputs-alert');
		       /*limpiar mesajes de error y valores en formulario*/
		
			},
			buttons:{
					'Agregar':function(event,ui )
					{
						
						var data = new FormData();
						var img=document.getElementById($("#txtImagenTipoDeCategoriaPresupuesto").attr("id"));
						img=img.files;
						data.append("Imagen", img[0]);
						data.append("name",$('#txtTipoDeCategoriaPresupuesto').val());
						data.append("accion","agregarCategoriasDePresupuestos");
						
						
		$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		processData: false,
        contentType: false,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			
			
			if(response.respuesta=="si"){
				
		     alertt(response.mensaje);
			 oTableTCDP.fnClearTable();//limpiar tabla
             oTableTCDP.fnAddData(response.arrayTabla);//agregar datos a la tabla
             oTableTCDP.fnAdjustColumnSizing();//ajustar contenido a la tabla
			 setTimeout(function()
			 {
			   $('#vAgregarDatosPresupuesto').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			}else
			{
				if(response.fo=="name")
				{
					$('#txtTipoDeCategoriaPresupuesto').focus();
					$('#txtTipoDeCategoriaPresupuesto').addClass('formulario-inputs-alert');
					$(document).on('input keyup','#tFrmAccionesCategoria #txtTipoDeCategoriaPresupuesto',function()
					{
						$('#txtTipoDeCategoriaPresupuesto').removeClass('formulario-inputs-alert');
					});
					
				}else if(response.fo=='file')
				{
					$('#txtImagenTipoDeCategoriaPresupuesto').addClass('formulario-inputs-alert');
					$(document).on('change','#tFrmAccionesCategoria #txtImagenTipoDeCategoriaPresupuesto',function()
					{
						$('#txtImagenTipoDeCategoriaPresupuesto').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
						//llamada ajax para agregar categoria de presupuesto
													
					},'Cerrar':function(event,ui )
					{
						$(this).dialog("close");
					}
				}
		});
		break;
		
		case 'btnTipoDePresupuesto': //abrir dialogo para agregar tipo de presupuesto
		$('#tdp').show();
		$('#cdp').hide();
		$('#cldp').hide();
		$('#vAgregarDatosPresupuesto').dialog(
		{
			title:"Agregar nuevo tipo de presupuesto.",
			autoOpen:true,
			height: 210,
			width: 400,
			open:function(event,ui)
			{
				$('#tFrmAccionesTipoDePresupuesto input').val("");
				/*limpiar mesajes de error y valores en formulario*/
		        $('#tFrmAccionesTipoDePresupuesto input').removeClass('formulario-inputs-alert');
		       /*limpiar mesajes de error y valores en formulario*/
		
			},
			buttons:{
					'Agregar':function(event,ui )
					{
						
						var data = new FormData();
						var img=document.getElementById($("#txtImagenTipoDePresupuesto").attr("id"));
						img=img.files;
						data.append("Imagen", img[0]);
						data.append("name",$('#txtTipoDePresupuesto').val());
						data.append("accion","agregarTipoDePresupuesto");
						
						
						//llamada ajax para agregar categoria de presupuesto
						$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		processData: false,
        contentType: false,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
		
			if(response.respuesta=="si"){
				
		     alertt(response.mensaje);
			     oTableTDP.fnClearTable();//limpiar tabla
                 oTableTDP.fnAddData(response.arrayTabla);//agregar datos a la tabla
                 oTableTDP.fnAdjustColumnSizing();//ajustar contenido a la tabla
			 setTimeout(function()
			 {
			   $('#vAgregarDatosPresupuesto').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			}else
			{
				if(response.fo=="name")
				{
					$('#txtTipoDePresupuesto').focus();
					$('#txtTipoDePresupuesto').addClass('formulario-inputs-alert');
					$(document).on('input keyup','#tFrmAccionesTipoDePresupuesto #txtTipoDePresupuesto',function()
					{
						$('#txtTipoDePresupuesto').removeClass('formulario-inputs-alert');
					});
					
				}else if(response.fo=='file')
				{
					$('#txtImagenTipoDePresupuesto').addClass('formulario-inputs-alert');
					$(document).on('change','#tFrmAccionesTipoDePresupuesto #txtImagenTipoDePresupuesto',function()
					{
						$('#txtImagenTipoDePresupuesto').removeClass('formulario-inputs-alert');
					});
				}
				
				alertt(response.mensaje);
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
						//llamada ajax para agregar categoria de presupuesto
													
					},'Cerrar':function(event,ui )
					{
						$(this).dialog("close");
					}
				}
		});
		
		
		break;
		
		case 'btnAgregarClasePresupuesto': //agregar clase de presupuesto
        $('#tdp').hide();
		$('#cdp').hide();
		$('#cldp').show();
		
		
		
		$('#vAgregarDatosPresupuesto').dialog(
		{
			title:"Agregar Nueva Clase De Presupuesto.",
			autoOpen:true,
			height: 350,
			width: 550,
			open:function(event,ui)
			{
				/*aparecer controles segun ventana*/
				$('#cmbTipoEmpresaClaseP').hide();
				$('#contEmpresasSelecClasePresConf').show();
				/*aparecer controles segun ventana*/
				
				$('#txtClaseDePresupuesto').val("");
				/*limpiar mesajes de error y valores en formulario*/
		        $('#tFrmAccionesClaseDePresupuesto input').removeClass('formulario-inputs-alert');
				$('#tFrmAccionesClaseDePresupuesto select').removeClass('formulario-inputs-selects-alert');
				$('#tFrmAccionesClaseDePresupuesto  #contEmpresasSelecClasePresConf').removeClass('formulario-inputs-alert');
				
				
		       /*limpiar mesajes de error y valores en formulario*/
			   
			   /*llamada ajax cargar tipos de presupuestos y empresas para seleccionar*/
			   $.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:'accion=cargarListaTipoDePresupuestosYEmpresas',
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			$('#loader').bPopup().close();
			
			
			   $('#cmbTipoPres').html(response.tabla);
			   $('#contEmpresasSelecClasePresConf').html(response.tabla2);
			
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
			   /*llamada ajax cargar tipos de presupuestos y empresas para seleccionar*/
		
			},
			buttons:{
					'Agregar':function(event,ui )
					{
						var arrayEmpresas=new Array();
						/*agregar empresas a array*/
						$('.chkAgregarEmpresasClasePresConf').each(function(index, element) {
							if($(this).is(':checked')){
                             arrayEmpresas.push($(this).val());
							}
                        });
						/*agregar empresas a array*/
						
						
						data=
						{
							accion:'agregarClasePre',
							name:$('#txtClaseDePresupuesto').val(),
							empresa:arrayEmpresas,
							tipoPresupuesto:$('#cmbTipoPres option:selected').val()
						};
						//llamada ajax para agregar categoria de presupuesto
						$.ajax({
		type:"POST",
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		dataType:'json',
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			
			if(response.respuesta=="si"){
				
		        alertt(response.mensaje);
			      oTableCDP.clear();//limpiar tabla
                  oTableCDP.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
                  
			
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableCDP.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaClaseDePresupuesto'+rowIdx+'" ><thead><th>Id</th><th>Compañia</th>  <th>Tipo De Presupuesto</th> <th>Escenarios</th> <th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableCDP.row(rowIdx).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableCDP.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableCDP.draw();
			oTableCDP.columns.adjust();//ajustar contenido a la tabla
			 setTimeout(function()
			 {
			   $('#vAgregarDatosPresupuesto').dialog("close");
			   $('#customAlert').dialog("close");
			 },2500);
			}else
			{
				if(response.fo=="name")
				{
					$('#txtClaseDePresupuesto').focus();
					$('#txtClaseDePresupuesto').addClass('formulario-inputs-alert');
					$(document).on('input keyup','#tFrmAccionesClaseDePresupuesto #txtClaseDePresupuesto',function()
					{
						$('#txtClaseDePresupuesto').removeClass('formulario-inputs-alert');
					});
					
				}else if(response.fo=="empresa")
				{
					$('#tFrmAccionesClaseDePresupuesto  #contEmpresasSelecClasePresConf').addClass('formulario-inputs-alert');
					$('#tFrmAccionesClaseDePresupuesto #contEmpresasSelecClasePresConf :input:checkbox').on('click',function()
					{

						$('#tFrmAccionesClaseDePresupuesto  #contEmpresasSelecClasePresConf').removeClass('formulario-inputs-alert');
					});
					
				}else if(response.fo=="np")
				{
					$('#cmbTipoPres').addClass('formulario-inputs-selects-alert');
					$(document).on('change','#tFrmAccionesClaseDePresupuesto #cmbTipoPres',function()
					{
						$('#cmbTipoPres').removeClass('formulario-inputs-selects-alert');
					});
				}
				
				alertt(response.mensaje);
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
						//llamada ajax para agregar categoria de presupuesto
													
					},'Cerrar':function(event,ui )
					{
						$(this).dialog("close");
					}
				}
		});
		break;
	}
});
/*crear data dialog*/



/*crear data tables*/
var oTableEscenariosClasePresup =dataTableEspanolById('tEscenariosClasePresupuesto');//tabla categorias de presupuestos
var oTableTCDP =dataTableEspanolById('tCategoriaDePresupuestos');//tabla categorias de presupuestos
var oTableTDP=dataTableEspanolById('tTipoDePresupuestos');//tabla categorias de presupuestos
var oTableCDP=DataTableEmpresas($('#tClaseDePresupuestos'));//tabla clase de presupuestos
var active=$('#tabsPresupuesto').tabs('option','active');

flagActive=active;


/*agregar accion  childs rows para tabla*/

$('#tClaseDePresupuestos tbody').on( 'click', 'td.details-control', function () {
	              
	            var tr = $(this).closest('tr');
                var child = oTableCDP.row(tr).child;
				
				
                if ( child.isShown() ) {
                    child.hide();
                    $(tr).removeClass('shown');
                }
                else {
                    child.show();
                    $(tr).addClass('shown');
                }
            } );
/*agregar accion  childs rows para tabla*/

/*cargar dataTabla de la primera pestaña*/

$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:'accion=cargarCategoriasDePresupuestos',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();  
					    }
            });
		},
		success: function(response)
		{
		
			 $('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			     oTableTCDP.fnClearTable();//limpiar tabla
                 oTableTCDP.fnAddData(response.arrayTabla);//agregar datos a la tabla
                 oTableTCDP.fnAdjustColumnSizing();//ajustar contenido a la tabla
			}
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});

/*cargar dataTabla de la primera pestaña*/

/*crear data tables*/
$('.ui-tabs-anchor').click('tabsselect',function()
{
	var active=$('#tabsPresupuesto').tabs('option','active');
     
	 var data={};
	//var idContenedor=$(this).attr('href').substring(1);
	//var idTabla=$('#'+idContenedor).find('table').attr('id');
	if(flagActive!=active){
	flagActive=active;	
	$('.mee').html("");
	switch(active)
	{
		case 0:
		data={
		
		accion:'cargarCategoriasDePresupuestos',
		}
		break;
		
		case 1:
		data=
		{
			accion:'cargarTipoDePresupuesto'
			
			
		}
		break;
		 
		case 2:
		data=
		{
			accion:'cargarClaseDePresupuestos'
		}
		break;
	}
	//llamada ajax 
	
	$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_acciones_confPresupuestos.php',
		data:data,
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
		},
		success: function(response)
		{
			
		
			 $('#loader').bPopup().close();
			
			if(response.respuesta=="si"){
				
				
		   
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			
			
			  switch(active)
			  {
				  case 0:
				  oTableTCDP.fnClearTable();//limpiar tabla
                  oTableTCDP.fnAddData(response.arrayTabla);//agregar datos a la tabla
                  oTableTCDP.fnAdjustColumnSizing();//ajustar contenido a la tabla
				  break;
				  
				  
				  case 1:
				  oTableTDP.fnClearTable();//limpiar tabla
                  oTableTDP.fnAddData(response.arrayTabla);//agregar datos a la tabla
                  oTableTDP.fnAdjustColumnSizing();//ajustar contenido a la tabla
				  break;
				  
				  case 2:
				
				  oTableCDP.clear();//limpiar tabla
                  oTableCDP.rows.add(response.tabla["titulos"]);//agregar datos a la tabla
                  
			
			/*agregamos las subtablas*/
			 var subTablas=response.tabla['contenidoTabla'];
             var dataTableChild=new Array();
			
                            oTableCDP.rows().eq( 0 ).each( function (rowIdx) {
                                var empresas=subTablas.shift();
                                cuentasTable='<table id="subTablaClaseDePresupuesto'+rowIdx+'" ><thead><th>Id</th><th>Compañia</th>  <th>Tipo De Presupuesto</th> <th>Escenarios</th> <th>Acciones</th></thead><tbody>';
                                $(empresas).each(function(index,val){
                                    cuentasTable+="<tr>";
                                        $(val).each(function(index2,val2){
                                            cuentasTable+='<td>'+val2+'</td>';
                                        });
                                    cuentasTable+='</tr>';
                                });
                                cuentasTable+='</tbody></table>';
                                oTableCDP.row(rowIdx).child(cuentasTable);
                                dataTableChild[rowIdx]=combierteDatatableTempReferencia(oTableCDP.row(rowIdx).child().find("table"));
                                
                            });
			/*agregamos las subtablas*/
			oTableCDP.draw();
			oTableCDP.columns.adjust();//ajustar contenido a la tabla
				  break;
			  }
			  
			}
		},error: function(response)
		{       $('#loader').bPopup().close();
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
   //llamada ajax
	}
	
});













}
//cargar contenidos de tabla segun la tabla seleccionada



/**************************************************confPresupuesto.php******************************************************************/




/*********************************************Control presupuestal******************************************************/
//$(document).on('click','#mtt3',function()
//	{
//		alertt('<span><img src="Imagenes/vlc.png" style="float:left;" /><h4>Esta página se encuentra en construcción!!</h4></span>');
//		return false;
//	});
	
	
	$(document).on('click','#mtt2',function()
	{
		alertt('<span><img src="Imagenes/vlc.png" style="float:left;" /><h4>Esta página se encuentra en construcción!!</h4></span>');
		return false;
	});


/*mostrar menus*/
$(document).on('mouseover','#mtt1,#mtt2,#mtt3',function()
{
	var val=$(this).attr('id');
	
	switch(val)
	{
	case'mtt1':	
	if($('#ttm1').is(':hidden')){
	$('#ttm1').show('slow');
	$('#ttm2').hide('slow');
	$('#ttm3').hide('slow');
	}
	break;
	case'mtt2':	
	if($('#ttm2').is(':hidden')){
	$('#ttm2').show('slow');
	$('#ttm1').hide('slow');
	$('#ttm3').hide('slow');
	}
	break;
	
	case'mtt3':	
	if($('#ttm3').is(':hidden')){
	$('#ttm3').show('slow');
	$('#ttm2').hide('slow');
	$('#ttm1').hide('slow');
	}
	break;
	
	
	}
	
	
});

$(document).on('mouseleave','.tooltipMenu',function()
{
	var idVentana=$(this).attr('id');	
	$('#'+idVentana).hide('slow');
});




$(document).on('click','.closeToolTipMenu',function()
{
	var idVentanaAcerrar=$(this).closest('div').attr('id');
	$('#'+idVentanaAcerrar).hide('slow');
	
});

/*mostrar menus*/












/*********************************************Control presupuestal******************************************************/



/*menu escondible*/
$("#linkMenuEscondible").click(function(){
$("#menuEscondible").toggle("slow");
/*ocultar ventana de busqueda*/
if($('.conTSearch').is(':visible'))
{
	$(document).find('.conTSearch').remove();
}
/*ocultar ventana de busqueda*/
});
/*menu escondible*/



/*acciones de pagina personalizarDeColoresDeReporte.php*/

$('#accordionTipoDeReportes').accordion();
$('.tabsReportes').tabs();



/*modificar propiedades de texto de reportes*/
$(document).on('click','.formatText',function()
{
	var caseUpdate=$(this).closest('table td').attr('id');
	var valor=$(this).attr('id').substr(3);
	var data={};
	
	switch(caseUpdate)
	{
		/*seguimiento a margenes*/
		case 'EfuentesEncabezadoSM':
		case 'EfuentesContenidoSM':
		switch(valor)
		{
			/*estilos de texto de cabecera de tabla seguimiento a margenes*/
			case 'NHSM':
			
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.tablaMargenes tr th').css('font-weight','normal');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.tablaMargenes tr th').css('font-weight','bold');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'KHSM':
			//cambiamos el estilo
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.tablaMargenes tr th').css('font-style','normal');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.tablaMargenes tr th').css('font-style','italic');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'SHSM':
			//cambiamos el estilo}
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				$('.tablaMargenes tr th').css('text-decoration','none');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				$('.tablaMargenes tr th').css('text-decoration','underline');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			
			case 'NCSM':
			
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.tablaMargenes tbody tr td').css('font-weight','normal');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.tablaMargenes tbody tr td').css('font-weight','bold');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'KCSM':
			//cambiamos el estilo
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.tablaMargenes tbody tr td').css('font-style','normal');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.tablaMargenes tbody tr td').css('font-style','italic');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'SCSM':
			//cambiamos el estilo}
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				$('.tablaMargenes tbody tr td').css('text-decoration','none');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				$('.tablaMargenes tbody tr td').css('text-decoration','underline');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			
			/*estilos de texto de cabecera de tabla seguimiento a margenes*/
		}
		break;
		
		case 'EfuentesEncabezadoSV':
		case 'EfuentesContenidoSV':
		
		
		switch(valor)
		{
			/*estilos de texto de cabecera de tabla seguimiento a margenes*/
			case 'NHSV':
			
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.pintaPiezasSV').css('font-weight','normal');
		         $('.pintaIngresosSV').css('font-weight','normal');
		         $('.pintaMargenTdasSV').css('font-weight','normal');
		         $('.pintaMargenByesSV').css('font-weight','normal');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.pintaPiezasSV').css('font-weight','bold');
		         $('.pintaIngresosSV').css('font-weight','bold');
		         $('.pintaMargenTdasSV').css('font-weight','bold');
		         $('.pintaMargenByesSV').css('font-weight','bold');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'KHSV':
			//cambiamos el estilo
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.pintaPiezasSV').css('font-style','normal');
		         $('.pintaIngresosSV').css('font-style','normal');
		         $('.pintaMargenTdasSV').css('font-style','normal');
		         $('.pintaMargenByesSV').css('font-style','normal');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 
				 $('.pintaPiezasSV').css('font-style','italic');
		         $('.pintaIngresosSV').css('font-style','italic');
		         $('.pintaMargenTdasSV').css('font-style','italic');
		         $('.pintaMargenByesSV').css('font-style','italic');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'SHSV':
			//cambiamos el estilo}
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				
				$('.pintaPiezasSV').css('text-decoration','none');
		         $('.pintaIngresosSV').css('text-decoration','none');
		         $('.pintaMargenTdasSV').css('text-decoration','none');
		         $('.pintaMargenByesSV').css('text-decoration','none');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.pintaPiezasSV').css('text-decoration','underline');
		         $('.pintaIngresosSV').css('text-decoration','underline');
		         $('.pintaMargenTdasSV').css('text-decoration','underline');
		         $('.pintaMargenByesSV').css('text-decoration','underline');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			
			case 'NCSV':
			
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.ctsv').css('font-weight','normal');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.ctsv').css('font-weight','bold');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'KCSV':
			//cambiamos el estilo
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				  $('.ctsv').css('font-style','normal');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				  $('.ctsv').css('font-style','italic');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'SCSV':
			//cambiamos el estilo}
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.ctsv').css('text-decoration','none');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.ctsv').css('text-decoration','underline');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			}
		
		break;
		
		/*seguimiento a margenes*/
		
		case 'EfuentesEncabezadoVPM':
		case 'EfuentesContenidoVPM':
		/*Estilos de texto reporte ventas por marca*/
		switch(valor)
		{
			/*Estilos de texto de cabecera de tabla seguimiento a margenes*/
			case 'NHVPM':
			
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.ventasPorMarcas tr th').css('font-weight','normal');
				 
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.ventasPorMarcas tr th ').css('font-weight','bold');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'KHVPM':
			//cambiamos el estilo
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.ventasPorMarcas tr th').css('font-style','normal');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.ventasPorMarcas tr th').css('font-style','italic');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'SHVPM':
			//cambiamos el estilo}
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				$('.ventasPorMarcas tr th').css('text-decoration','none');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				$('.ventasPorMarcas tr th').css('text-decoration','underline');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			
			case 'NCVPM':
			
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.ventasPorMarcas tbody tr td').css('font-weight','normal');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.ventasPorMarcas tbody tr td').css('font-weight','bold');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'KCVPM':
			//cambiamos el estilo
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				 $('.ventasPorMarcas tbody tr td').css('font-style','normal');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				 $('.ventasPorMarcas tbody tr td').css('font-style','italic');
				  data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			case 'SCVPM':
			//cambiamos el estilo}
			if($(this).hasClass('selectedFormatText'))
	        {
	             $(this).removeClass('selectedFormatText');	
				$('.ventasPorMarcas tbody tr td').css('text-decoration','none');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:0
		               }
	        }else
	        {
		         $(this).addClass('selectedFormatText');
				$('.ventasPorMarcas tbody tr td').css('text-decoration','underline');
				 data={
			            accion:'actualizarEstilosDeTexto',
			            clase:valor,
						color:1
		               }
            }
			break;
			/*Estilos de texto de cabecera de tabla seguimiento a margenes*/
			}
			
		break;
	}
	
	$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:data,
		dataType:'json',
		error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
});
/*modificar propiedades de texto de reportes*/


/*modificar estilos de reporte seguimiento a margenes y ventas*/

$(document).on('change','.cmbFZRM',function()
{
	   
	var id=$(this).attr('id');
	var valor=$('#'+id+' option:selected').val();
	var data={};
	
	switch(id)
	{
		case'cmbEstiloDeFuenteEncabezadoDeTablaRM':
		$('.tablaMargenes tr th').css('font-family',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'rm',
			tipoDefuenteE:valor,
		}
		break;
		case'cmbTamanoLetraReporteRM':
		$('.tablaMargenes tr th').css('font-size',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'rm',
			tamanoDeLetraE:valor,
		}
		break;
		case 'cmbEstiloDeFuenteContenidoDeTablaRM':
		$('.tablaMargenes tbody tr td').css('font-family',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'rm',
			tipoDefuenteC:valor,
		}
		break;
		case 'cmbTamanoLetraReporteContenidoRM':
		$('.tablaMargenes tbody tr td').css('font-size',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'rm',
			tamanoDeLetraC:valor,
		}
		break;
		/*reporte seguimiento a ventas*/
		
		case 'cmbEstiloDeFuenteEncabezadoDeTablaRMSV':
		$('.pintaPiezasSV').css('font-family',valor);
		$('.pintaIngresosSV').css('font-family',valor);
		$('.pintaMargenTdasSV').css('font-family',valor);
		$('.pintaMargenByesSV').css('font-family',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'sv',
			tipoDefuenteE:valor,
		}
		
		break;
		
		case 'cmbTamanoLetraReporteRMSV':
		$('.pintaPiezasSV').css('font-size',valor);
		$('.pintaIngresosSV').css('font-size',valor);
		$('.pintaMargenTdasSV').css('font-size',valor);
		$('.pintaMargenByesSV').css('font-size',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'sv',
			tamanoDeLetraE:valor,
		}
		
		
		break;
		
		case'cmbTamanoLetraReporteContenidoRMSV':
		$('.ctsv').css('font-size',valor);
	    data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'sv',
			tamanoDeLetraC:valor,
		}
		break;
		
		case 'cmbEstiloDeFuenteContenidoDeTablaRMSV':
		$('.ctsv').css('font-family',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'sv',
			tipoDefuenteC:valor,
		}
		break;
		/*reporte seguimiento a ventas*/
		
		/*reporte ventas por marca*/
		case 'cmbEstiloDeFuenteEncabezadoDeTablaRVPM':
		$('.ventasPorMarcas tr th').css('font-family',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'vpm',
			tipoDefuenteE:valor,
		}
		
		break;
		
		case 'cmbTamanoLetraReporteRVPM':
		$('.ventasPorMarcas tr th').css('font-size',valor);
		
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'vpm',
			tamanoDeLetraE:valor,
		}
		break;
		
		case 'cmbEstiloDeFuenteContenidoDeTablaRVPM':
		$('.ventasPorMarcas tbody tr td').css('font-family',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'vpm',
			tipoDefuenteC:valor,
		}
		break;
		
		case 'cmbTamanoLetraReporteContenidoRVPM':
		$('.ventasPorMarcas tbody tr td').css('font-size',valor);
		data={
			accion:'modificarSizeFontTypeFontStyleLetter',
			bandera:'vpm',
			tamanoDeLetraC:valor,
		}
		break;
		
		
		
		/*reporte ventas por marca*/
		
	}
	
	$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:data,
		dataType:'json',
		error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
	
});

/*modificar estilos de colores de reporte ventas por marca*/
$(document).on('change','.inputColorVPM',function()//modificar color de fondo
{    
    var clase=($(this).attr('id')).substr(3);
	var color=$(this).val();

	$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:'color='+color+'&clase='+clase+'&accion=ModificarEstilosReporte',
		dataType:'json',
		success: function(response)
		{
			
			if(response.respuesta=="si"){
				
			$('.'+clase).css('background-color',color);
			
			}
		},error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
		
});
/*modificar estilos de colores de reporte ventas por marca*/


/*modificar colores de reporte seguimiento a margenes*/
$(document).on('change','.inputColorReporteMargenes',function()//modificar color de fondo
{    
    var clase=($(this).attr('id')).substr(3);
	var color=$(this).val();

	$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:'color='+color+'&clase='+clase+'&accion=ModificarEstilosReporte',
		dataType:'json',
		success: function(response)
		{
			
			if(response.respuesta=="si"){
				
			$('.'+clase).css('background-color',color);
			
			}
		},error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
		
});
/*modificar colores de reporte seguimiento a margenes*/

/*restablecer estilos de reporte ventas por marca*/
$(document).on('click','#btnRestablecerColoresDeFondoVentasPorMarca',function()
{
	if(confirm("¿Desea restablecer los estilos por default del reporte ventas por marca?")){
	$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:'accion=RestablecerEstilosDeReporteVentasPorMarca',
		dataType:'json',
		success: function(response)
		{
			
			if(response.respuesta=="si"){
			
		    $('.ventasPorMarcas thead tr th').css({'font-size':'12px','font-family':'Verdana','font-weight':'normal','font-style':'normal','text-decoration':'none'});
			$('.ventasPorMarcas tbody tr td').css({'font-size':'12px','font-family':'Verdana','font-weight':'normal','font-style':'normal','text-decoration':'none'});
			$('.pintaCostoTdasVMP').css('background-color','#8cc979'); 
			$('.pintaPiezasTotalVPM').css('background-color','#75a865');
			$('.pintaPiezasVPM').css('background-color','#5b914a');
			$('.c1').css('background-color','#dfdede');
			$('.c2').css('background-color','#efefef');
			$('#EfuentesEncabezadoVPM').each(function(index, element) {
                $(this).find('span').removeClass('selectedFormatText');
            });	
			$('#EfuentesContenidoVPM').each(function(index, element) {
                $(this).find('span').removeClass('selectedFormatText');
            });	
			$('#cmbEstiloDeFuenteEncabezadoDeTablaRVPM').val('Verdana');
			$('#cmbTamanoLetraReporteRVPM').val('12px');
			$('#cmbEstiloDeFuenteContenidoDeTablaRVPM').val('Verdana');
			$('#cmbTamanoLetraReporteContenidoRVPM').val('12px');
			
			
			
			
			}
			
			
			
			
		},error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
	
	}
});
/*restablecer estilos de reporte ventas por marca*/



/*restablecer estilos reporte seguimiento a margenes*/
$(document).on('click','#btnRestablecerColoresDeFondoSeguimientoAMargenes',function()
{
	
if(confirm("¿Desea restablecer los estilos por default del reporte seguimiento a margenes?"))
	{
		$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:'accion=RestablecerEstilosDeReporteMargenes',
		dataType:'json',
		success: function(response)
		{
			
			if(response.respuesta=="si"){
			
		$('.pintaAmarillo').css('background-color','#ffff00');
		$('.pintaPiezas').css('background-color','#09A418');
		$('.pintatotalGral').css('background-color','#207DC9');
		$('.pintatotalGralM').css('background-color','#7F06CB');
		$('.pintaPiezasTotal').css('background-color','#02720D');
		$('.pintaIngresosTotal').css('background-color','#116EA8');
		$('.pintaCostoPtTotal').css('background-color','#E1A43A');
		$('.pintaCostoTdasTotal').css('background-color','#DC6E33');
		$('.pintaMargenByesTotal').css('background-color','#D95E00');
		$('.pintaIngresos').css('background-color','#1C9AE8');
	    $('.pintaCostoPt').css('background-color','#FFB738');
		$('.pintaCostoTdas').css('background-color','#FF7E37');
		$('.pintaMargenTdas').css('background-color','#000000');
		$('.pintaMargenByes').css('background-color','#FF6F00');
		$('.tablaMargenes tr th').css('font-family','Verdana');
		$('.tablaMargenes tr th').css('font-size','12px');
		$('#cmbEstiloDeFuenteEncabezadoDeTablaRM').val('Verdana');
		$('#cmbTamanoLetraReporteRM').val('12px');
		$('#cmbEstiloDeFuenteContenidoDeTablaRM').val('Verdana');
		$('#cmbTamanoLetraReporteContenidoRM').val('12px');
		$('.tablaMargenes tbody tr td').css('font-family','Verdana');
		$('.tablaMargenes tbody tr td').css('font-size','12px'); 
		$('#EfuentesEncabezadoSM').each(function(index, element) {
            $(this).find('span').removeClass('selectedFormatText');
        }); 
		$('#EfuentesContenidoSM').each(function(index, element) {
            $(this).find('span').removeClass('selectedFormatText');
        }); 
		                             
		$('.tablaMargenes tbody tr td').css('text-decoration','none');
        $('.tablaMargenes tbody tr td').css('font-style','normal');
        $('.tablaMargenes tbody tr td').css('font-weight','normal');
        $('.tablaMargenes tr th').css('text-decoration','none');
        $('.tablaMargenes tr th').css('font-style','normal');
        $('.tablaMargenes tr th').css('font-weight','normal');
		
		
		
	
		
		
			}
		},error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
	}
});
/*restablecer estilos reporte seguimiento a margenes*/


/*Restablecer estilos de reporte seguimiento a ventas*/
$(document).on('click','#btnRestablecerColoresDeFondoSeguimientoAVentas',function()
{
	if(confirm("¿Desea restablecer los estilos por default del reporte seguimiento a ventas?"))
	{
		$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:'accion=ReestablecerEstilosDeReporteSeguimientoAVentas',
		dataType:'json',
		success: function(response)
		{
			
			if(response.respuesta=="si"){
			
		$('#cmbEstiloDeFuenteContenidoDeTablaRMSV').val('Verdana');
		$('#cmbTamanoLetraReporteContenidoRMSV').val('11px');
		$('#cmbEstiloDeFuenteEncabezadoDeTablaRMSV').val('Verdana');
		$('#cmbTamanoLetraReporteRMSV').val('12px');	
		$('.ctsv').css('font-family','Verdana');
        $('.ctsv').css('font-size','11px');
		$('.gb').css('background-color','#eeeeee');
		$('.pintaPiezasSV').css('font-family','Verdana');
        $('.pintaIngresosSV').css('font-family','Verdana');
        $('.pintaMargenTdasSV').css('font-family','Verdana');
		$('.pintaMargenByesSV').css('font-family','Verdana');
		$('.pintaPiezasSV').css('font-size','12px');
        $('.pintaIngresosSV').css('font-size','12px');
        $('.pintaMargenTdasSV').css('font-size','12px');
		$('.pintaMargenByesSV').css('font-size','12px');
		$('.pintaPiezasSV').css('background-color','#09A418');
        $('.pintaIngresosSV').css('background-color','#1C9AE8');
        $('.pintaMargenTdasSV').css('background-color','#000000');
		$('.pintaMargenByesSV').css('background-color','#FF6F00');
		
		$('#EfuentesEncabezadoSV').each(function(index, element) {
            $(this).find('span').removeClass('selectedFormatText');
        });
		$('#EfuentesContenidoSV').each(function(index, element) {
            $(this).find('span').removeClass('selectedFormatText');
        });
		
		
		$('.ctsv').css('font-weight','normal');
        $('.ctsv').css('font-style','normal');
        $('.ctsv').css('text-decoration','none');
		$('.pintaPiezasSV').css('text-decoration','none');
		$('.pintaIngresosSV').css('text-decoration','none');
		$('.pintaMargenTdasSV').css('text-decoration','none');
		$('.pintaMargenByesSV').css('text-decoration','none');
	    $('.pintaPiezasSV').css('font-style','normal');
		$('.pintaIngresosSV').css('font-style','normal');
		$('.pintaMargenTdasSV').css('font-style','normal');
        $('.pintaMargenByesSV').css('font-style','normal');
        $('.pintaPiezasSV').css('font-weight','normal');
		$('.pintaIngresosSV').css('font-weight','normal');
	    $('.pintaMargenTdasSV').css('font-weight','normal');
		$('.pintaMargenByesSV').css('font-weight','normal');
	
		
		
			}
		},error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
	}
});
/*Restablecer estilos de reporte seguimiento a ventas*/

/*cambiar colores de reporte seguimiento a ventas*/
$(document).on('change','.inputColorSV',function()
{
	var clase=($(this).attr('id')).substr(3);
	var color=$(this).val();
    
	$.ajax({
		type:'POST',
		url:'../Php_Scripts/s_accionesCambiarEstilosReporte.php',
		data:'color='+color+'&clase='+clase+'&accion=ModificarEstilosReporte',
		dataType:'json',
		success: function(response)
		{
			
			if(response.respuesta=="si"){
				
			$('.'+clase).css('background-color',color);
			}
		},error: function(response)
		{
			   alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	});
});
/*cambiar colores de reporte seguimiento a ventas*/


/*ampliar vizualización de reportes*/
$(document).on('click','#lklAmpliarVizualizacionDelReporte',function()
{
	var acordionActivo=$('#accordionTipoDeReportes').accordion("option","active");
	var tabActiva=$('.tabsReportes').tabs("option","active");
	switch(acordionActivo)
	{
		case 0: //reporte Margenes
		
		switch(tabActiva)
		{
			case 0:
			
			$('#contenidoVentana').html($('#seguimientoAMargenes').html());
			$('#seguimientoAMargenes').html("")
			break;
			case 1:
			$('#contenidoVentana').html($('#seguimientoAVentas').html());
			$('#seguimientoAVentas').html("")
			break;
		}
		
		break;
		
		case 1://Reporte venta por marca
		switch(tabActiva)
		{
			case 0:
			
			$('#contenidoVentana').html($('#reporteVentaPorMarca').html());
			$('#reporteVentaPorMarca').html("");
			break;
		}
		break;
		
	}
	
	
	$('#vAmpliamientoDeReportes').bPopup({
            speed: 650,
			onClose: function() { 
			
			switch(acordionActivo)
       	{
		case 0: //reporte Margenes
			   
		    switch(tabActiva)
		    {
			case 0:
			$('#seguimientoAMargenes').html($('#contenidoVentana').html());
			break;
			case 1:
			$('#seguimientoAVentas').html($('#contenidoVentana').html());
			break;
		    }
			break; //Termina reporte margenes
		
		 case 1://reporte seguimiento a ventas	
		 
		  switch(tabActiva)
		    {
			case 0:
			$('#reporteVentaPorMarca').html($('#contenidoVentana').html());
			break;
		    }
		
		 break;//termina seguimiento a ventas
			
		}
				   
				   },
            transition: 'slideDown'
			
        });
	
});
/*ampliar vizualización de reportes*/

$('#btnCerraVizualizacionDeReporte').click(function()
{
	$('#vAmpliamientoDeReportes').bPopup().close();
})


/*acciones de pagina personalizarDeColoresDeReporte.php*/







/*cargar lista de fechas disponibles*/
$('#frmBuscarFechasDisponibles').on('submit',function()
{
	
					 $.ajax({
						 type:'post',
						 url:$(this).attr('action'),
						 dataType:"json",
						data:$('#frmBuscarFechasDisponibles').serialize()+'&accion=cargarCatalogo',
						 beforeSend: function(response)
						 {
							
								  $('#tListadoFechasDisponible tbody').html('<tr align="center" id="loaderTable"><td colspan="3" ><img src="Imagenes/loader3.gif" width="32" height="32" alt="loader" /></td></tr>');
							
							
							 
							 
						 },success: function(response)
						 { 
					
							 if(response.respuesta=="si")
							 {
								
								 $('#tListadoFechasDisponible tbody').html(response.contenidoTabla);
							 }
							 
						 },error: function(response)
						 {
							     alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },complete: function(response)
						 {
							 $('#loaderTable').remove();
							
						 }
						 
					 });
					
	
	return false;
});
/*cargar lista de fechas disponibles*/

$(document).on('click','.verFechasDisponiblesParaRegistro',function()
{
	$('#frmBuscarFechasDisponibles').each(function(index, element) {
        this.reset();
    });
	$("#dListadoFechasRegistro").dialog("open");
})


/*dialog ventana listado de fechas para registro de facturas*/
$("#dListadoFechasRegistro").dialog(
{
	title:"Listado de fechas para registro",
                closeOnEscape: true,
		        height: 350,
                scrollable: true,
				resizable: false,
                width: 700,
				show:cea(),
				hide:cea(),
                modal: true,
				autoOpen:false,
				open:function(event, ui )
				{
					
					/*cargar lista de fechas disponibles*/
					 $.ajax({
						 type:'post',
						 url:$('#frmBuscarFechasDisponibles').attr('action'),
						 dataType:"json",
						 data:$('#frmBuscarFechasDisponibles').serialize()+'&accion=cargarCatalogo',
						 beforeSend: function(response)
						 {
							 $('#tListadoFechasDisponible tbody').html('<tr align="center" id="loaderTable"><td colspan="3" ><img src="Imagenes/loader3.gif" width="32" height="32" alt="loader" /></td></tr>');
							 
						 },success: function(response)
						 { 
						
							 if(response.respuesta=="si")
							 {
								 
								 $('#tListadoFechasDisponible tbody').html(response.contenidoTabla);
							 }
							 
						 },error: function(response)
						 {
							     alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },complete: function(response)
						 {
							 $('#loaderTable').remove();
						 }
						 
					 });
					/*cargar lista de fechas disponibles*/
					
				},
				buttons:{
					'Cerrar':function(event,ui )
					{
						$(this).dialog("close");
					
						
					}
				}
});
/*dialog ventana listado de fechas para registro de facturas*/



/*mandar email automatico al entrar en editarPerfil.php*/

/*if(baseName=='editarPerfil.php')
{
	$.ajax(
		{
			url:'../Php_Scripts/s_checarCompaniasAuto.php',
			dataType:"json",
			type:'POST',
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
				
			},success:function(response)
			{
				$('#loader').bPopup().close();
				
				if(response.respuesta=="si")
				{
					if(response.mensaje!=""){
					alertt(response.mensaje);
					}
					
				}else
				{
					alertt(response.mensaje);
				}
              				
			},error:function(response)
			{
				$('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			
		})
	
}

/*mandar email automatico al entrar en editarPerfil.php*/




/*mandar email para solicitar que se autorisen las compañias*/
$(document).on('click','#solicitarAutoProvCompania,#SADC',function()
{
	
	if(confirm("¿Desea mandar un correo para solicitar que se autoricen todas o algunas de tus empresas asociadas?"))
	{
		$.ajax(
		{
			url:'../Php_Scripts/s_emailSolicitudDeAutorizacionesDeEmpresa.php',
			dataType:"json",
			type:'POST',
			beforeSend: function(response)
			{
				 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
				
			},success:function(response)
			{
				$('#loader').bPopup().close();
				
				if(response.respuesta=="si")
				{
					alertt(response.mensaje);
					
				}else
				{
					alertt(response.mensaje);
				}
              				
			},error:function(response)
			{
				$('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			
		})
	}
});






/*boton bug acciones*/
$(document).on('click','#bugButton',function()
{
	$('#frmReporteDeBug').each(function(index, element) {
        this.reset();
		
    });
	$("#frmReporteDeBug input,#frmReporteDeBug textarea").removeClass("formulario-inputs-alert");
	$('#vfrmEnvioDeBug').dialog("open");
});


/*ventana dialogo ventana bug*/
$('#vfrmEnvioDeBug').dialog({autoOpen:false,
                title:"Reporte De Bug En El Sistema",
                closeOnEscape: true,
		        height: 490,
                scrollable: true,
				resizable: false,
                width: 750,
				show:cea(),
				hide:cea(),
                modal: true,
				buttons:
				{
					"Enviar Problema":function(event, ui)
					{
						var data = new FormData();
						var img=document.getElementById($("#txtBArchivoImg").attr("Id"));
						img=img.files;
						data.append("txtBArchivoImg", img[0]);
						data.append("txtBNombreDe", $('#txtBNombreDe').val());
						data.append("txtBAsunto", $('#txtBAsunto').val());
						data.append("txtBMSCO", $('#txtBMSCO').val());
						data.append("txtBDetalleDelProblema",$('#txtBDetalleDelProblema').val());
						
					
						
						$.ajax(
						{
							url:$('#frmReporteDeBug').attr('action'),
							type:"post",
							dataType:"json",
							data:data,
                            processData: false,
                            contentType: false,
							beforeSend: function(response)
							{
								 $('#loader').bPopup({
			                     onClose: function() { response.abort();
							   
							        
					    }
            });
								
							},success: function(response)
							{
								alertt(response);
								$('#loader').bPopup().close();
								
								if(response.respuesta=="si")
								{
									$("#frmReporteDeBug input,#frmReporteDeBug textarea").removeClass("formulario-inputs-alert");
									alertt(response.mensaje);
								
								}else
								{
									if(response.fo=="bImg")
									{
										
									 $('#txtBArchivoImg').addClass("formulario-inputs-alert");
									 
									} 
									if(response.fo=="bDproblema")
									{
										$('#txtBDetalleDelProblema').focus();
										$('#txtBDetalleDelProblema').addClass("formulario-inputs-alert");
									}
									
									
									$(document).on(' keyup input',"#frmReporteDeBug input, #frmReporteDeBug textarea",function()
									{
										$('#frmReporteDeBug input').removeClass('formulario-inputs-alert');
										$('#frmReporteDeBug textarea').removeClass('formulario-inputs-alert');
									});
									alertt(response.mensaje);
									
								}
								
							},error: function(response)
							{
								$('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
							}
							
						});
					},
					"Cerrar":function(event, ui)
					{
						$(this).dialog("close");
					}
					
					
				}
				})
/*ventana dialogo ventana bug*/

/*boton bug acciones*/






/*acciones de la pagina catalogoUsuariosProv.php*/


/*Eliminar compañia asociada de usuario*/
$(document).on('click','.eliinarEmpresaAsociada',function()
{
	
if(confirm("Esta seguro de eliminar la compañia con RFC "+$(this).closest('table tr').find('td').eq(0).text()+"?")){

$.ajax(
{
	type:'POST',
	data:'RFC='+$(this).closest('table tr').find('td').eq(0).text()+'&idRegistro='+$('#idUsuario').text()+'&accion=eliminarEmpresaAsociadaAUsuario',
	dataType:"json",
	url:"../Php_Scripts/s_accionesCatalogoProveedores.php",
	success: function(response)
	{
		
		if(response.respuesta=="si")
	{
		tCatalogoCompanias.fnClearTable();//limpiar tabla
        tCatalogoCompanias.fnAddData(response.aContenidoTabla);//agregar datos a la tabla
        tCatalogoCompanias.fnAdjustColumnSizing();//ajustar contenido a la tabla
	}else
	{
		alertt(response.mensaje);
	}
		
	},error:function(response)
	{
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
	}
	
});

}
});

/*Eliminar compañia asociada de usuario*/


/*actualizar companias*/
$(document).on('change','.ACDU',function()
{
	var rfc=$(this).closest('table tr').find('td').eq(0).text();
	rfc=rfc.split("&").join("%26");
	var autorizado=($(this).is(':checked'))?1:0;
	
	
	$.post('../Php_Scripts/s_accionesCatalogoProveedores.php','RFC='+rfc+'&estatus='+autorizado+'&idRegistro='+$('#idUsuario').text()+'&accion=autorizarCompaniaDeUsuario',function(response)
	{
		
		if(response.respuesta=="si")
		{
			
			                     tCatalogoCompanias.fnClearTable();//limpiar tabla
                                 tCatalogoCompanias.fnAddData(response.aContenidoTabla);//agregar datos a la tabla
								 
								 tCatalogoCompanias.fnAdjustColumnSizing();//ajustar contenido a la tabla
								 cargarUsuariosProveedores();
								 
								
			
		}
		
	},'json').error(function(response)
	{
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
	});
	
});
/*actualizar companias*/


/*abrir dialogo para autorizar compañias*/
var tCatalogoCompanias= dataTableEspanolById($('#tCatalogoCompaniasAutorizar').attr('id'));
$(document).on('click','.autorizarCompaniasAsociadas',function()
{
	var usuario=$(this).closest('table tr').find('td').eq(2).text();
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	$('#idUsuario').text($(this).closest('table tr').find('td').eq(0).text());
	
	$('#vDAutorizarCompaniasDeUsuario').dialog(
	{
		        title:'Autorizar Compañias Usuario '+usuario,
		        closeOnEscape: true,
		        height: 750,
				show:cea(),
                scrollable: true,
			    width:650,
				hide: {
			
                effect: cea(),
                duration: 500
                       },
                modal: true,
			    autoOpen: true,
				resizable: false,
			    open: function(event, ui)
				{
					$.ajax(
					{
						type:'POST',
						dataType:"json",
						url:"../Php_Scripts/s_accionesCatalogoProveedores.php",
						data:'idRegistro='+idRegistro+'&accion=cargarCompaniasAsociadas',
						beforeSend: function(response)
						{
							$('#tCatalogoCompaniasAutorizar>tbody').html('<tr align="center"><td colspan="4"> <img src="Imagenes/loader3.gif" width="32" height="32" alt="loader3" /> </td> </tr>');
						},success: function(response)
						{
							if(response.respuesta=="si")
							{
							     tCatalogoCompanias.fnClearTable();//limpiar tabla
                                 tCatalogoCompanias.fnAddData(response.aContenidoTabla);//agregar datos a la tabla
								 tCatalogoCompanias.fnAdjustColumnSizing();//ajustar contenido a la tabla
							}
							
						},error: function(response)
						{
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						}
					});
					
					
					
				},buttons: {
					
					'Cerrar':function(event,ui)
					{
						$(this).dialog("close");
					}
				}
	});
});

/*abrir dialogo para autorizar compañias*/



/*modificar contraseña de usuario proveedor*/

$(document).on(' click','.mDProveedores',function()
{
	
	
$('#frmCambiarContrasena input').removeClass("formulario-inputs-alert");
$('#frmCambiarContrasena').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
	var usuario=($(this).closest('table tr').find('td').eq(2).text()).toLowerCase();
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	
	
	
	
	$('#windowDialog').dialog({
		        title:'Modificar Contraseña De '+usuario,
		        closeOnEscape: true,
		        height: 310,
                scrollable: true,
                width: 550,
                modal: true,
			    autoOpen: true,
					buttons: {
						'Modificar':function(){
						   
						   $.ajax(
						   {
							   type:'post',
							   dataType:"json",
							   url:$('#frmCambiarContrasena').attr('action'),
							   data:$('#frmCambiarContrasena').serialize()+'&idRegistro='+idRegistro+'&accion=cambiarContrasena',
							   beforeSend: function(response)
							   {
								   $('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					    }
            });
								   
							   },success: function(response)
							   {
								   
								   if(response.respuesta=="si")
				{
					 $('#loader').bPopup().close();
					 
					 alertt(response.mensaje);
					 
			
					 
					 
					 
				}else
				{
					     /**focus**/
					    if(response.fo=="contrasena1")
						{
							$('#txtNuevaContrasena').focus();
							$('#txtNuevaContrasena').addClass("formulario-inputs-alert");
							$(document).on('input','#frmCambiarContrasena input',function()
							{
								$('#frmCambiarContrasena input').removeClass("formulario-inputs-alert");
								
							})
						}else if(response.fo=="contrasena2")
						{
							$('#txtRepetirNuevaContrasena').focus();
							$('#txtRepetirNuevaContrasena').addClass("formulario-inputs-alert");
						    $(document).on('input','#frmCambiarContrasena input',function()
							{
								
								$('#frmCambiarContrasena input').removeClass("formulario-inputs-alert");
							})
						}
						$('#loader').bPopup().close();
						alertt(response.mensaje);
					
								
				}
							   },error: function(response)
							   {
								    $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
							   }
							   
						   });
						   
						},
						
                'Cerrar': function(){
					
                    $(this).dialog('close');
				
				
                        
		}, 
		
	}
	});
});

/*modificar contraseña de usuario proveedor*/


/*cargar catalogo de usuarios*/
if(baseName=='catalogoUsuariosProv.php')
{
	var oTable= dataTableEspanolById($('#tCatalogoDeUsuariosProveedores').attr('id'));//crear data table
	cargarUsuariosProveedores();
	
}
/*cargar catalogo de usuarios*/



/*cambiar tipo de usuario proveedor*/
$(document).on('change','.changueProfilesProov',function()
{
	
    /*obtener info*/
	idcmb=$(this).attr('id');
	nameUsuario=($(this).closest('table tr').find('td').eq(2).text()).toLowerCase();
	idUsuario=$(this).closest('table tr').find('td').eq(0).text();
	var tipoUsuario=$('#'+idcmb+' option:selected').val();
   /*obtener info*/
   
  
    if(confirm("Esta seguro de cambiar el tipo de usuario a "+nameUsuario+'?'))
	 { 
	    
		
		$.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesCatalogoProveedores.php",
		                 data:'idRegistro='+idUsuario+'&tipoUsuario='+tipoUsuario+'&accion=cambiarTipoDeUsuarioProveedor',
		                 dataType:"json",
					     success:function(response)
						 {
						
						
							 if(response.respuesta=="si"){
								 
								 cargarUsuariosProveedores();
								$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			                    $('.mensajeSatisfactorio').fadeOut(15000);
								   
							 }else
							 {
								 
		    						 $('#'+idcmb+' option').each(function(index, element) {
		                              	if($(this).is('[selected]'))
		                                  	{
		                     	  $('#'+idcmb).val($(this).val());
		                         	  return false;
		                                         	}
                                               });
											   
											   
											   $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			                                       $('.mensajeInformativo').fadeOut(15000);
							 }
					
							 
							 
							 
						 },error:function(response)
						 {
							 
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
	
	
		
	}else
	{
		$('#'+idcmb+' option').each(function(index, element) {
			if($(this).is('[selected]'))
			{
			  $('#'+idcmb).val($(this).val());
			  return false;
			}
        });
	}
});
/*cambiar tipo de usuario proveedor*/



/*eliminar usuario proveedor*/

$(document).on('click','.deleteUserProov',function()
{
	var idRegistro=$(this).closest('table tr').find('td').eq(0).text();
	var nombreUsuario=$(this).closest('table tr').find('td').eq(2).text();
	if(confirm("Esta seguro que desea eliminar al usuario " + nombreUsuario.toLowerCase()+"?"))
	{
		$.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesCatalogoProveedores.php",
		                 data:'idRegistro='+idRegistro+'&accion=eliminarUsuarioProov',
		                 dataType:"json",
		                 success:function(response)
						 {
							
							 
							 if(response.respuesta=="si"){
			 					  
								  cargarUsuariosProveedores();
								  $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			                      $('.mensajeSatisfactorio').fadeOut(15000);
								  
							 }else
							 {
								 $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			                     $('.mensajeInformativo').fadeOut(15000);
							 }
							 
							 
							 
						 },error:function(response)
						 {
							
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
	}
	
	
	
});

/*eliminar usuario proveedor*/



/*funcion cargar usuarios proveedores*/
function cargarUsuariosProveedores()
{
	$.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesCatalogoProveedores.php",
		                 data:'accion=cargarCatalogoDeProveedores',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					    }
            });
							 
						 },success:function(response)
						 {
							// alert(response.aContenidoTabla);
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
			 					  
								  oTable.fnClearTable();//limpiar tabla
								 // oTable.fnSetColumnVis(0,false);//ocultar columna
                                  oTable.fnAddData(response.aContenidoTabla);//agregar datos a la tabla
							    //  oTable.fnAdjustColumnSizing();//ajustar contenido a la tabla
								
								 
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
}
/*funcion cargar usuarios proveedores*/

/*acciones de la pagina catalogoUsuariosProv.php*/




/*Poner img panel de control*/

/*evento del maouse para checar sesion en paginas no CO,PS,PC*/
$(document).on('mouseover',function()
{ 
	//cargarImgCOPSPC();	
});
/*evento del maouse para checar sesion en paginas no CO,PS,PC*/




/*Evento que se ejecuta al cargar completamente la página web*/
$(window).load(function() {
     //cargarImgCOPSPC();
});
/*Evento que se ejecuta al cargar completamente la página web*/


/*funcion para cargar imagen de control panel*/
function cargarImgCOPSPC()
{
	if(baseName=='index.php' || baseName=='proveedores.php' || baseName=='proveedoresRegistro.php' ||  baseName=='centroDeAyuda.php'  || baseName=='preguntasFrecuentes.php' || baseName=='requisitosPaginaWeb.php' || baseName=="")
	{
		$.ajax(
		{
			url:"../Php_Scripts/s_redirigirControlPanelUsuario.php",
			dataType:"json",
			success: function(response)
			{
				if(response.respuesta=='si')
				{
					
					$('#backToHome span').text(response.title);
					$('#backToHome a').attr('href',response.href);
					$('#backToHome').show();
					/*desabilitar ventanas de logins*/
					$('#login-coorporativos').attr('id','login-coorporativoss');
					$('#login-form').attr('id','login-formm');
					/*desabilitar ventanas de logins*/
					$('#login-coorporativoss').attr('title','Actualmente hay una sesión activa en el navegador.');
					$('#login-formm').attr('title','Actualmente hay una sesión activa en el navegador.');
					
				}else
				{
					$('#backToHome').hide();
				    $('#backToHome span').text("");
					$('#backToHome a').removeAttr('href');
					/*habilitar ventanas de logins*/
					$('#login-coorporativoss').attr('id','login-coorporativos');
					$('#login-formm').attr('id','login-form');
					/*habilitar ventanas de logins*/
					$('#login-coorporativos').removeAttr('title');
					$('#login-form').removeAttr('title');
				}
				
			},error:function(response)
			{
				 	
				 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
			
		});
	}
}
/*funcion para cargar imagen de control panel*/

/*Poner img panel de control*/




/*operaciones pagina montosMensualAutorizados.php*/


//modificar monto margenes

/*funccion modificar monto*/
function modificarMonto(idRegistro)
{
	 $.ajax({
						 type:'post',
		                 url:$('#frmAgregarMonto').attr('action'),
		                 data:$('#frmAgregarMonto').serialize()+'&idRegistro='+idRegistro+'&accion=modificarMonto',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
							 
						 },success:function(response)
						 {
							 
							
							
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
								  
								  $('#vAgregarOModificarMonto').dialog("close");
								  alertt(response.mensaje);
		setTimeout(function()
		  {  
		       
			   window.location.href = "../montosMensualAutorizados.php";   
		  },1500);
								  
							 }else
							 {
								  if(response.fo=="mo")
								 {
									 $('#txtMonto').addClass("formulario-inputs-alert");
									 $('#txtMonto').focus();
									 $(document).on('input keyup','#frmAgregarMonto input',function()
									 {
										 $('#txtMonto').removeClass("formulario-inputs-alert");
									 })
								 }
								 else if(response.fo=="al")
								 {
									$('#frmAgregarMonto  input').addClass("formulario-inputs-alert");
									$('#frmAgregarMonto select').addClass("formulario-inputs-selects-alert");									
								 }

								 	$(document).on('change','#frmAgregarMonto select',function()
									{
										$('#frmAgregarMonto  input').removeClass("formulario-inputs-alert");
									    $('#frmAgregarMonto select').removeClass("formulario-inputs-selects-alert");
									})
									
									$(document).on('input','#frmAgregarMonto input',function()
									{
										$('#frmAgregarMonto  input').removeClass("formulario-inputs-alert");
									    $('#frmAgregarMonto select').removeClass("formulario-inputs-selects-alert");
									})
								 alertt(response.mensaje);
								 
								 
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
						    
					  });
				return false;	
}
/*funccion modificar monto*/

$(document).on('click','.ModificarMontoMargenes',function()
{
  
   
   
	
	/*limpiar datos*/
	$('#frmAgregarMonto input').removeClass("formulario-inputs-alert");
	$('#frmAgregarMonto select').removeClass("formulario-inputs-selects-alert");
	$('#frmAgregarMonto').each(function(index, element) {
        this.reset();
    });
	/*limpiar datos*/
	
	/**variables**/
	$('#idRegistro').text($(this).closest('table tr').attr('id'));
	var meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var optionsC="";
    var b=0;
    var fecha = new Date();
    var ano = fecha.getFullYear();
	/**variables**/
	
	
	
	
	/*poner valores por defaul*/
	$('#cmbAnoMonto').val($(this).closest('table tr').find('td').eq(1).text());
	$('#cmbColorPresupuesto').val($(this).closest('table tr').find('td').eq(5).attr('id'));
	$('#cmbEmpresaMonto').val($(this).closest('table tr').find('td').eq(0).attr('id'));
	$('#cmbPlazaMonto').val($(this).closest('table tr').find('td').eq(3).attr('id'));
	$('#txtMonto').val(($(this).closest('table tr').find('td').eq(4).text()));
	/*poner valores por defaul*/
	
	
   /*cargar meses si el año actual es menos al seleccionado*/
  
   var anoSeleccionado=$('#cmbAnoMonto option:selected').val();
   
   
   
   if(anoSeleccionado!=ano)
   {
   
     for(var x=0; x<=11;x++)
	 { 
	      b=x+1;
		 optionsC+="<option value="+b+">"+meses[x]+"</option>"
	 }
	 
	 $("#cmbMesesIniMonto").html(optionsC);
	 
   }else
   {
	   for(var x=fecha.getMonth(); x<=11; x++)
		{
			 b=x+1;
		    optionsC+="<option value="+b+">"+meses[x]+"</option>"
		}
		$("#cmbMesesIniMonto").html(optionsC);
	   
   }
	/*cargar meses si el año actual es menos al seleccionado*/
	
	/*mes por default*/
	$('#cmbMesesIniMonto').val($(this).closest('table tr').find('td').eq(2).attr('id'));
	/*mes por default*/
	
	$('#vAgregarOModificarMonto').dialog(
	{
		        title:'Modificar Monto',
			    autoOpen:true,
					buttons: {
				 'Modificar':function(event, ui)
				 {
					  modificarMonto($('#idRegistro').text());
					  
					
					 
				 },
                'Cerrar': function(event, ui){
					
                    $(this).dialog('close');
					                 
		}, 
		
	}
	});
});


//eliminar monto
$(document).on('click','.EliminarMontoMargenes',function()
{
	var idRegistro=$(this).closest('table tr').attr('id');
	if(confirm("Esta seguro de eliminar el monto de la empresa " +($(this).closest('table tr').find('td').eq(0).text()).toLowerCase()+ "?"))
	{
		$.ajax({
						 type:'POST',
		                 url:"./Php_Scripts/s_accionesMontosMargenes.php",
		                 data:'idRegistro='+idRegistro+'&accion=eliminarMontoMargenes',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					    }
            });
							 
						 },success:function(response)
						 {
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
								
								   $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			                       $('.mensajeSatisfactorio').fadeOut(15000);
								    table.fnDeleteRow( $('#'+idRegistro)[0]);//eliminamos el tr y se actualiza el dataTable
									
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
	}
	
});
//eliminar monto




/*crear ventana dialog nuevo monto*/
$('#vAgregarOModificarMonto').dialog({autoOpen:false,
               closeOnEscape: true,
		        height: 370,
                scrollable: true,
				resizable: false,
                width: 400,
				show:cea(),
				hide:cea(),
                modal: true,
				})
/*crear ventana dialog nuevo monto*/

/*Agregar Nuevo Monto*/


/*funcion agregarMonto*/

function agregarMonto(){



	 $.ajax({
						 type:'post',
		                 url:$('#frmAgregarMonto').attr('action'),
		                 data:$('#frmAgregarMonto').serialize()+'&accion=agregarNuevoMonto',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
							 
						 },success:function(response)
						 {
							
							
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
								  
								  alertt(response.mensaje);
								  $('#vAgregarOModificarMonto').dialog("close");
		setTimeout(function()
		  {
			   window.location.href = "../montosMensualAutorizados.php";   
		  },1500);
								  
							 }else
							 {
								 if(response.fo=="mo")
								 {
									 $('#txtMonto').addClass("formulario-inputs-alert");
									 $('#txtMonto').focus();
									 $(document).on('input keyup','#frmAgregarMonto input',function()
									 {
										 $('#txtMonto').removeClass("formulario-inputs-alert");
									 })
								 }
								 else if(response.fo=="al")
								 {
									$('#frmAgregarMonto  input').addClass("formulario-inputs-alert");
									$('#frmAgregarMonto select').addClass("formulario-inputs-selects-alert");									
								 }

								 	$(document).on('change','#frmAgregarMonto select',function()
									{
										$('#frmAgregarMonto  input').removeClass("formulario-inputs-alert");
									    $('#frmAgregarMonto select').removeClass("formulario-inputs-selects-alert");
									})
									
									$(document).on('input','#frmAgregarMonto input',function()
									{
										$('#frmAgregarMonto  input').removeClass("formulario-inputs-alert");
									    $('#frmAgregarMonto select').removeClass("formulario-inputs-selects-alert");
									})
								 alertt(response.mensaje);
								 
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
			
               return false;
			   
	


}
/*funcion agregarMonto*/


/*cargar monto al cambiar colo o plaza onchangue*/
$(document).on('change','#cmbPlazaMonto,#cmbColorPresupuesto',function()
{
	/*cargar monto*/
					$.ajax(
					{
						type:'POST',
						data:$('#frmAgregarMonto').serialize()+'&accion=obtenerPresupuestoColor',
						url:$('#frmAgregarMonto').attr('action'),
						dataType:"json",
						 beforeSend: function(response)
						 {
							  $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
			        		    }
                            });
						 },
            
						success: function(response)
						{
							$('#loader').bPopup().close();
							if(response.respuesta=="si")
							{
								
								$('#txtMonto').val(response.datosDeTabla);
							}
							
						},error: function(response)
						{
							$('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						}
						
					});
					/*cargar monto*/
});


$(document).on('click','#btnAgregarNuevoMonto',function()
{
	
	/*limpiar datos*/
	$('#frmAgregarMonto input').removeClass("formulario-inputs-alert");
	$('#frmAgregarMonto select').removeClass("formulario-inputs-selects-alert");
	$('#frmAgregarMonto').each(function(index, element) {
        this.reset();
    });
	/*limpiar datos*/

	$('#vAgregarOModificarMonto').dialog(
	{
		        title:'Agregar Monto',
			    autoOpen:true,
				open:function(event, ui)
				{
					var title = $(this).dialog( "option", "title" );
					
					if(title=='Agregar Monto'){
					/*cargar monto*/
					$.ajax(
					{
						type:'POST',
						data:$('#frmAgregarMonto').serialize()+'&accion=obtenerPresupuestoColor',
						url:$('#frmAgregarMonto').attr('action'),
						dataType:"json",
						 beforeSend: function(response)
						 {
							  $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
			        		    }
                            });
						 },
            
						success: function(response)
						{
							$('#loader').bPopup().close();
							if(response.respuesta=="si")
							{
								
								$('#txtMonto').val(response.datosDeTabla);
							}
							
						},error: function(response)
						{
							$('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						}
						
					});
					}
					/*cargar monto*/
				},
					buttons:{
				 'Agregar':function(event, ui)
				 {
					  agregarMonto();
				 },
                'Cerrar': function(event, ui){
					
                    $(this).dialog('close');
					                 
				},
		
	}
	});
});


/*cmbAnoMonto*/
$(document).on('change','#cmbAnoMonto',function()
{
	
   var fecha = new Date();
   var ano = fecha.getFullYear();
   var anoSeleccionado=$('#cmbAnoMonto option:selected').val();
   var meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
   var optionsC="";
   var b=0;
   
   
   if(anoSeleccionado!=ano)
   {
   
     for(var x=0; x<=11;x++)
	 { 
	      b=x+1;
		 optionsC+="<option value="+b+">"+meses[x]+"</option>"
	 }
	 
	 $("#cmbMesesIniMonto").html(optionsC);
	 
   }else
   {

		for(var x=fecha.getMonth(); x<=11; x++)
		{
			 b=x+1;
		    optionsC+="<option value="+b+">"+meses[x]+"</option>"
		}
		$("#cmbMesesIniMonto").html(optionsC);
	    
   }
});
/*cmbAnoMonto*/

if(baseName=='montosMensualAutorizados.php')
{
	  $.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesMontosMargenes.php",
		                 data:'accion=cargarMontosMensuales',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
							 
						 },success:function(response)
						 {
							
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
								  $('#tCatalogoMargenesMonto>tbody').html(response.datosDeTabla);
								  dataTableEspanolById($('#tCatalogoMargenesMonto').attr('id'));//crear data table
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
}



/*operaciones pagina montosMensualAutorizados.php*/



/*Crear Dialogo de accesos eb catalogo de usuarios*/
$('#accesosUsuarioOUSRCatalogo').dialog({
	            title:"Listado De Accesos",
		        closeOnEscape: true,
		        height: 350,
                scrollable: true,
                width: 720,
				show:cea(),
				hide:cea(),
                modal: true,
			    open: function(event, ui )
				{   
				  
					  
					  $.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'accion=cargarAccesosListaPerfil',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html('<tr align="center"><td colspan="4"> <img src="Imagenes/loader3.gif" width="32" height="32" alt="loader3" /> </td> </tr>');
							 
						 },success:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 if(response.respuesta=="si"){
								  $('#tListadoDeAccesosEnPerfilAgregar>tbody').html(response.datosDeTabla);
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
					 
					
				},
				autoOpen:false,
					buttons: {
                'Cerrar': function(){
					
                    $(this).dialog('close');
					
           
				
                        
		}, 
		
	}
	});

$(document).on('click','.abrirCatalogoOusrAccesosEnCatalogos',function()
{
	$('#txtBuscarAccesosListadoA').val("")//LIMPIAR INPUT
	/*abrimos el listado de accesos*/
	$("#accesosUsuarioOUSRCatalogo").dialog("open");  
	/*abrimos el listado de accesos*/
	
})

/*Abrir Dialogo de accesos eb catalogo de usuarios*/


























//Modificar Accesos de usuario en catalogo usuario

$(document).on('click','.modifiUserAccessCoorp',function()
{
	
	$('#idUsuario').text($(this).closest('table tr').attr('id'));
	$('#ban').text(3);
	$('#idPerfil').text($(this).closest('table tr').find('td').eq(4).attr('id'));
	var nameU=($(this).closest('table tr').find('td').eq(1).text()).toLowerCase()
	$('.nameU').text(nameU);
    $('#mdu').hide();//ocultar div que contiene las pestañas para modificar los datos de usuario
	$('#au').show();
	$('.mee').text("");
	$('input').removeClass('formulario-inputs-alert');
	$('#windowDialog').dialog({
		        title:"Modificar Accesos De Usuario",
		        closeOnEscape: true,
		        height: 350,
                scrollable: true,
                width: 720,
                modal: true,
				autoOpen:true,
				open:function(event,ui)
				{
					 $.ajax(
	{
		type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+$('#idUsuario').text()+'&accion=cargarDetalladoOusrAccesos',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			 $('#txtBAccesoOusrAccesos').val("");
			 $('#tAccesosOusr>tbody').html(response.datosDeTabla); 
			 
			
			//$('.abrirCatalogoOusrAccesosEnCatalogos').removeAttr('style');
			$('.abrirCatalogoOusrAccesosEnCatalogos').css({'cursor':'pointer','opacity':''});
		    $('.abrirCatalogoOusrAccesosEnCatalogos').attr('title','Agregar acceso al usuario '+nameU+'.');
			  
			 if($('#tAccesosOusr>tbody>tr').length)
			 {
			
                if($('#tAccesosOusr>tbody>tr').find('td').eq(0).attr('class')=='nr')
				{
					 $('#tp').text(response.NombrePerfil);
					 
					 $('#txtBAccesoOusrAccesos').attr('disabled',true);
					  
				}else
				{
					$('#txtBAccesoOusrAccesos').removeAttr('disabled');
					$('#txtBAccesoOusrAccesos').focus();
				}
			 }
			
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	});
					
				},
					buttons: {
                'Cerrar': function(){
					
                    $(this).dialog('close');
                        
		}, 
		
	}
	});
});



//Modificar datos de usuario
$(document).on('click','.modifiUserCoorp',function()
{
	 
	$('#mdu').show();
	$('#au').hide();
	$('.mee').text("");
	
	$('#txtEmailA').attr('disabled',false);
	$('#txtNombreUsuarioA').attr('disabled',false);
	$('#frmModificarDatosDeUsuarioCoo input').removeClass('formulario-inputs-alert');
	
	$('#frmModificarDatosDeUsuarioCoo').each(function(index, element) {
        this.reset();
    });
	
	$('#frmModificarContrasenaCoorporativo input').removeClass('formulario-inputs-alert');
	//limpiar contraseña
	$('#frmModificarContrasenaCoorporativo').each(function(index, element) {
        this.reset();
		
    });
	//limpiar contraseña
	emailEnTabla=$(this).closest('table tr').find('td').eq(3).text();
	$('#idUsuario').text($(this).closest('table tr').attr('id'));
	idRegistro=$(this).closest('table tr').attr('id')
	$("span.ui-dialog-title").text("Modificar Datos De Usuario"); 
	$('.nameU').text(($(this).closest('table tr').find('td').eq(1).text()).toLowerCase());
		$('#windowDialog').dialog({
		        closeOnEscape: true,
		        height: 600,
                scrollable: true,
                width: 720,
				
                modal: true,
			    open: function(event, ui )
				{   
				  
					  
					  $.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'idRegistro='+idRegistro+'&accion=cargarDatosDeUsuarioAModificar',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							 $('#tabs-updateDataUserCoorp').tabs();
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html('<tr align="center"><td colspan="3"> <img src="Imagenes/loader3.gif" width="32" height="32" alt="loader3" /> </td> </tr>');
							 
						 },success:function(response)
						 {
							
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 if(response.respuesta=="si"){
								  $('#txtNombreA').val(response.nombre);
								  $('#txtApellidoPA').val(response.ap);
								  $('#txtApellidoMA').val(response.am);
								  $('#txtEmailA').val(response.em);
								  ((response.vc=='Y'))?$('#chkVerCamposEspeciales').attr('checked',true):$('#chkVerCamposEspeciales').attr('checked',false);
								  $('#txtNombreUsuarioA').val(response.no);
                                                                  $("#txtNombreUsuarioRR").val(response.userRR);
								  
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
					 
					
				},
				autoOpen:true,
					buttons: {
						
				'Modificar' : function()
	 {
		 var active = $( "#tabs-updateDataUserCoorp" ).tabs( "option", "active" );
		
		 if(active==0) //procedemos a  modificar los datos personales del usuario
		 {
			
	
	$.ajax({
	type:'POST',
	url:$('#frmModificarDatosDeUsuarioCoo').attr('action'),
	data:$('#frmModificarDatosDeUsuarioCoo').serialize()+'&idRegistro='+$('#idUsuario').text()+'&accion=modificarUsuarioCoorporativo',
	dataType:"json",
	beforeSend: function(response)
	{
		 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
	},success: function(response)
	{
	
		  $('#loader').bPopup().close();
		
		
		if(response.respuesta=="si")
		{
			
		$('.mee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
		
								  
									    setTimeout(function()
		  {
			   window.location.href = "../catalogoUsuariosCoorpAdmin.php";
			  
			   
			   
			  
		  },2500);
		
		 
		}else
		{
			
			if(response.fo=='nom')
			{
				$('#txtNombreA').focus();
			    $('#txtNombreA').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='aP')
			{
				$('#txtApellidoPA').focus();
			    $('#txtApellidoPA').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='aM')
			{
				$('#txtApellidoMA').focus();
			    $('#txtApellidoMA').addClass("formulario-inputs-alert");
				
			
			}else if(response.fo=='email')
			{
				$('#txtEmailA').focus();
			    $('#txtEmailA').addClass("formulario-inputs-alert");
				
			}
			else if(response.fo='no')
			{
				$('#txtNombreUsuarioA').focus();
				$('#txtNombreUsuarioA').addClass("formulario-inputs-alert");
			}
			 
				
		    $(document).on('keyup input','#frmModificarDatosDeUsuarioCoo input',function()
			{
				  $('#frmModificarDatosDeUsuarioCoo input').removeClass("formulario-inputs-alert");
				  $('.mee').text("");
			});
			$('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		}
		
	},error: function(response)
	{
		$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		
	}
	
})		 
			 
			 
		 }
		 else//modificar contraseña de usuario
		 {
			
			$.ajax({
	type:'POST',
	url:$('#frmModificarContrasenaCoorporativo').attr('action'),
	data:$('#frmModificarContrasenaCoorporativo').serialize()+'&idRegistro='+$('#idUsuario').text()+'&accion=modificarMiContrasenaCoorporativo',
	dataType:"json",
	beforeSend: function(response)
	{
		 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
	},success: function(response)
	{
		  $('#loader').bPopup().close();
		
		if(response.respuesta=="si")
		{
		        
		 
		     $('.mee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			
				
				
			
		    
			
			
		 
		}else
		{
			if(response.fo=='co1')
			{
				$('#txtContrasenaA').focus();
			    $('#txtContrasenaA').addClass("formulario-inputs-alert");
				$('#txtContrasenaA').keyup(function()
				{
					  $('input').removeClass("formulario-inputs-alert");
					  $('.mee').text("");
				})
			}else if(response.fo=='co2')
			{
				$('#txtRContrasenaA').focus();
			    $('#txtRContrasenaA').addClass("formulario-inputs-alert");
				$('#txtRContrasenaA').keyup(function()
				{
					  $('input').removeClass("formulario-inputs-alert");
					  $('.mee').text("");
				})
			}
			
			
		    $('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		}
		
	},error: function(response)
	{
		$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		
	}
	
})
			
			
			
		 }
	 },		
						
                'Cerrar': function(){
					
                    $(this).dialog('close');         
		}, 
	 
		
	}
	})
})




//obtener changue cmb
$(document).on('change','.changueProfiles',function()
{
    /*obtener info*/
	idcmb=$(this).attr('id');
	nameUsuario=($(this).closest('table tr').find('td').eq(1).text()).toLowerCase();
	idRegistro=$(this).closest('table tr').find('td').eq(4).attr('id');
	idUsuario=$(this).closest('table tr').attr('id');
	var idPerfil=$('#'+idcmb+' option:selected').val();
   /*obtener info*/
	
    if(confirm("Esta seguro de cambiar el perfil al usuario "+nameUsuario+'?'))
	 { 
	    
		
		$.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'txtNombreA='+idUsuario+'&idPerfil='+idPerfil+'&accion=modificarPerfilOusr',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					    }
            });
							 
						 },success:function(response)
						 {
							 $('#loader').bPopup().close();
							 
							 if(response.respuesta=="si"){
								$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
								   
			                       
								      setTimeout(function()
		  {
			   window.location.href = "../catalogoUsuariosCoorpAdmin.php";
			  
			   
			   
			  
		  },1500);
									
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
	
	
		
	}else
	{
		$('#'+idcmb+' option').each(function(index, element) {
			if($(this).is('[selected]'))
			{
			  $('#'+idcmb).val($(this).val());
			  return false;
			}
        });
	}
})
//obtener changue cmb



//eliminamos usuario coorporativo de la tabla

$(document).on('click','.deleteUserCoorp',function()
{
	var idRegistro=$(this).closest('table tr').attr('id');
	
	
	
	if(confirm("Esta seguro de eliminar al usuario " + ($(this).closest('table tr').find('td').eq(1).text()).toLowerCase()+'?'))
	{
		$.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'idRegistro='+idRegistro+'&accion=eliminarUsuarioCoorporativo',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					    }
            });
							 
						 },success:function(response)
						 {
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
								
								   $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			                       $('.mensajeSatisfactorio').fadeOut(15000);
								    table.fnDeleteRow( $('#'+idRegistro)[0]);//eliminamos el tr y se actualiza el dataTable
									
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
					  
	}
	
});





//cargar catalogo usuarios coorporativos

if(baseName=="catalogoUsuariosCoorpAdmin.php")
{

	/*creamos dialogo JQuery UI*/
	$('#vtnDialogoAlert').dialog(
	{
		        closeOnEscape: true,
                scrollable: true,
				resizable: false,
				show:cea(),
				hide:cea(),
                modal: true,
				autoOpen:false,
	});
	/*creamos dialogo JQuery UI*/
	
	
	
	/*mandar de con datos de inicio de sesión*/
	$(document).on('click','.SendDataUserByEmail',function(e)
	{
		var idRegistro=$(this).closest('table tbody tr').find('td').eq(0).text();
		
		
		
		$('#vtnDialogoAlert').html('<img src="Imagenes/questionMsj.png" style=" float:left; margin:10px;" />¿Deseas enviar los datos de inicio de sesion del usuario?')
		$('#vtnDialogoAlert').dialog({
			autoOpen:true,
			title:'Mensaje Del Sistema',
			buttons:
			{
				
				'Si':function(event,ui)
				{
					$(this).dialog('close');
					/*peticion ajax*/
					data=
					{
						accion:'reenviarInfoSesion',
						idRegistro:idRegistro,
						
					}
					
					$.ajax(
					{
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:data,
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					 					   }
           			 					});
							 
						 },success:function(response)
						 {
							 $('#loader').bPopup().close();
							if(response.respuesta=="si")
							{
							 alertt('<img src="Imagenes/successMsj.png" style=" float:left; margin:10px;" />'+response.mensaje);		   
							}else
							{
								alertt('<img src="Imagenes/ErrorMsj.png" style=" float:left; margin:10px;" />'+response.mensaje);	
							}
						
							setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							
						   },2500); 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
					});
					/*peticion ajax*/
					
				},
				'No':function(event,ui)
				{
					$(this).dialog('close');
				}
			}
			
			});
		
	});
	/*mandar de con datos de inicio de sesión*/
	
	
	
	
	
	
	
	$.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'accion=cargarCatalogoUsuariosCoorporativos',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					    }
            });
							 
						 },success:function(response)
						 {
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
								  $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
								  $('#tCatalogoDeUsuariosCoorp tbody').html(response.datosDeTabla);
								  dataTableEspanolById($('#tCatalogoDeUsuariosCoorp').attr('id'));//crear data table
									   
								 
								
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
					  
					  
					  
}




/*acciones perfiles de usuario pagina perfilesDeUsuario.php*/




//abrir dialogo para agregar acceso a perfil ousr
$(document).on('click','.abrirCatalogoOusrAccesos',function()
{
	var dataBandera=$(this).data('bandera');
	$('#txtBuscarAccesosListadoA').val("")//LIMPIAR INPUT 
	if(dataBandera==1){
	
	
	$('#ban').text("");
	$('#ban').text(2);//bandera
	$("span.ui-dialog-title").text("Listado De Accesos"); 
	$('#windowDialog').css('overflow','hidden');
	$('#windowDialog').dialog({
		        closeOnEscape: true,
		        height: 350,
                scrollable: true,
                width: 720,
				
                modal: true,
			    open: function(event, ui )
				{   
				  
					  
					  $.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'accion=cargarAccesosListaPerfil',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html('<tr align="center"><td colspan="3"> <img src="Imagenes/loader3.gif" width="32" height="32" alt="loader3" /> </td> </tr>');
							 
						 },success:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 if(response.respuesta=="si"){
								  $('#tListadoDeAccesosEnPerfilAgregar>tbody').html(response.datosDeTabla);
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
					 
					
				},
				autoOpen:true,
					buttons: {
                'Cerrar': function(){
					
                    $(this).dialog('close');
					
           
				
                        
		}, 
		
	}
	});
	}
}); 

//modificar autorizado si o no ousr_accesos

$(document).on('click','.chkOusrAccesos',function()
{
	var idRegistro=$(this).closest('table tr').attr('id');
	
	var idChk=$(this).attr('id');
	var bandera=1;
	if(!($('#'+idChk).is(':checked')))
	{
		bandera=0;
		
	}
	
	//enviar peticion ajax
	
	 $.ajax(
	{
		type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+idRegistro+'&idPerfil='+bandera+'&accion=actualizarPermisoOusr',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			   if($('#windowDialog').is(':visible')){
			   alertt(response.mensaje);
			    setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							
						   },2500);
			   
			   }else
			   {
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			   }
			 
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	});
	
});



//eliminar acceso de ousr_accesos pagina confAutorizacionesAdmin.php

$(document).on('click','.EliminarAccesoOusr',function()
{
	var idRegistro=$(this).closest('table tr').attr('id');
	var idUsuario=$('#cmbListaDeUsuariosCoorp option:selected').val(); 
	if(idUsuario==null)
	{
		idUsuario=$('#idUsuario').text();
	}
	if(confirm("Deseas eliminar el acceso "+$(this).closest('table tr').find('td').eq(0).text()+" del usuario "+($('#cmbListaDeUsuariosCoorp option:selected').text()).toLowerCase()+"?")){
	 $.ajax(
	{
		type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+idRegistro+'&idPerfil='+idUsuario+'&accion=eliminarAccesoOusr',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			
			 if($('#windowDialog').is(':visible')){
			   alertt(response.mensaje);
			   setTimeout(function()
			   {
				   $('#customAlert').dialog("close");
			   },1500);
			   }else
			   {
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			   }
			 $('#tAccesosOusr>tbody').html(response.datosDeTabla);
			 $('#txtBAccesoOusrAccesos').val("");
			 
			  if($('#tAccesosOusr>tbody>tr').length)
			 {
			
                if($('#tAccesosOusr>tbody>tr').find('td').eq(0).attr('class')=='nr')
				{
					 
					 $('#txtBAccesoOusrAccesos').attr('disabled',true);
					  
				}else
				{
					$('#txtBAccesoOusrAccesos').removeAttr('disabled');
					$('#txtBAccesoOusrAccesos').focus();
				}
			 }
			
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	});
	
	}
});

//eliminar acceso de ousr_accesos pagina confAutorizacionesAdmin.php

//busqueda en tabla ousrAccesos
$(document).on('keyup input keydown change paste','#txtBAccesoOusrAccesos',function(event){
	var data=$.trim($(this).val())
	
	if(event.keyCode==32  && $(this).val().length==0 && event.keyCode==9)
	{
		event.preventDefault(); 
		
		
	}else{
		
		searchTable(data,'tAccesosOusr');
	}})
//busqueda en tabla ousrAccesos


//mostrar detallado de tabla xml_ousr_accesos
$(document).on('change','#cmbListaDeUsuariosCoorp',function()
{
	var idUsuario=$('#cmbListaDeUsuariosCoorp option:selected').val();
	
	

	if($.isNumeric(idUsuario))
	{
		
		 $.ajax(
	{
		type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+idUsuario+'&accion=cargarDetalladoOusrAccesos',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
				 $('#txtBAccesoOusrAccesos').val("");
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			
			
			
		
			 $('#txtBAccesoOusrAccesos').val("");
			 $('.abrirCatalogoOusrAccesos').data('bandera',1);
			 $('.abrirCatalogoOusrAccesos').removeAttr('style');
			 $('.abrirCatalogoOusrAccesos').css('cursor','pointer');
			 $('.abrirCatalogoOusrAccesos').attr('title','Agregar acceso al usuario '+$('#cmbListaDeUsuariosCoorp option:selected').text()+'.');
			 $('#cmbTipoDeUsuarioChangueProfile').html(response.optionsSelect); 
			  $('#tAccesosOusr>tbody').html(response.datosDeTabla); 
			 if($('#tAccesosOusr>tbody>tr').length)
			 {
			
                if($('#tAccesosOusr>tbody>tr').find('td').eq(0).attr('class')=='nr')
				{
					 
					 
					 $('#txtBAccesoOusrAccesos').attr('disabled',true);
					  
				}else
				{
					$('#txtBAccesoOusrAccesos').removeAttr('disabled');
					$('#txtBAccesoOusrAccesos').focus();
				}
			 }
			
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	});
		
	}else
	{
		     $('#tAccesosOusr>tbody').html(""); 
			
			 $('#txtBAccesoOusrAccesos').val("");
			 $('.abrirCatalogoOusrAccesos').data('bandera',0);
			 $('.abrirCatalogoOusrAccesos').removeAttr('style');
			 $('.abrirCatalogoOusrAccesos').removeAttr('title');
			 $('.abrirCatalogoOusrAccesos').css({'-moz-opacity':'.5','-webkit-opacity':'.5','opacity':'.5'});
			 $('#txtBAccesoOusrAccesos').attr('disabled',true);
			 $('#cmbTipoDeUsuarioChangueProfile').html("");
			  $('#cmbTipoDeUsuarioChangueProfile').html('<option>Sin Definir</option>'); 
			 
			  
	}
	
	
	
})

//cambiar tipo de perfil en pagina confAutorizacionesAdmin.php
$(document).on('change','#cmbTipoDeUsuarioChangueProfile',function()
{
	var idUsuario=$('#cmbListaDeUsuariosCoorp').val();
	var idPerfil=$(this).val();
    
	if(confirm("Esta seguro de cambiar el perfil al usuario "+$('#cmbListaDeUsuariosCoorp option:selected').text().toLowerCase()+'?'))
	 { 
	    
		
		$.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'txtNombreA='+idUsuario+'&idPerfil='+idPerfil+'&accion=modificarPerfilUsuarioEnAutorizacion',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							  
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							   
							        
					    }
            });
							 
						 },success:function(response)
						 {
							 $('#loader').bPopup().close();
							 
							 if(response.respuesta=="si"){
								$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
								$('.mensajeSatisfactorio').fadeOut(15000);
								 $('#tAccesosOusr>tbody').html(response.datosDeTabla); 
								 $('#cmbTipoDeUsuarioChangueProfile').html(response.optionsSelect);
			                      if($('#tAccesosOusr>tbody>tr').length)
			                        {
			
                                     if($('#tAccesosOusr>tbody>tr').find('td').eq(0).attr('class')=='nr')
				                    {
					 
					 
				                          	 $('#txtBAccesoOusrAccesos').attr('disabled',true);
					  
				                    }else
				                   {
				                	$('#txtBAccesoOusrAccesos').removeAttr('disabled');
				                  	$('#txtBAccesoOusrAccesos').focus();
				                    }
			 }
									
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 },
						  
					  });
	
	
		
	}else
	{
		$('#cmbTipoDeUsuarioChangueProfile option').each(function(index, element) {
			if($(this).is('[selected]'))
			{
			  $('#cmbTipoDeUsuarioChangueProfile').val($(this).val());
			  return false;
			}
        });
	}
	
})
//cambiar tipo de perfil en pagina confAutorizacionesAdmin.php
//modificar Nombre de perfil
$('#btnModificarNombrePerfil').click(function()
{ 
     var bandera=$(this).data("bandera");
	 var idRegistro=$('#cmbListadoDePerfiles option:selected').val();
	 var nombrePerfil=$('#txtNuevoNombrePerfil').val();
	 if(bandera==1){
	   
	 $.ajax(
	{
		type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+idRegistro+'&txtNombreA='+nombrePerfil+'&accion=modificarNombrePerfil',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			 $('#cmbListadoDePerfiles').html(response.datosDeTabla); 
			 $('#txtNuevoNombrePerfil').val("");
			 $('#txtNuevoNombrePerfil').prop('placeholder','Nuevo nombre perfil '+$('#cmbListadoDePerfiles option:selected').text());	
			}else
			{
				$('input').removeClass("formulario-inputs-alert");
				$('table>thead>tr').removeClass("pintar-td-mensaje-informativo");
				
				if(response.fo="no")
				{
					$("#txtNuevoNombrePerfil").addClass("formulario-inputs-alert");
					$("#txtNuevoNombrePerfil").focus();
					$('#txtNuevoNombrePerfil').keyup(function()
					{
						$(".me").text("");
						$(this).removeClass("formulario-inputs-alert");
						
					})
				}
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			    $('.mensajeSatisfactorio').fadeOut(15000);
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	})
	
	
	 }
})


//eliminar Detalle de perfil



$(document).on('click','.EliminarDetallePerfil',function()
{
	var idRegistro=$(this).closest('table tr').attr('id');
	var idPerfil=$("#cmbListadoDePerfiles option:selected").val();
	if(confirm("Esta seguro de eliminar el detalle del perfil "+ $("#cmbListadoDePerfiles option:selected").text().toLowerCase()+"?")){
	 $.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'idRegistro='+idRegistro+'&idPerfil='+idPerfil+'&accion=eliminarDetalladoPerfil',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							$('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
                     });
							        
					    
							 
						 },success:function(response)
						 {
							 $('#loader').bPopup().close();
							 if(response.respuesta=="si"){
								 $('input').removeClass("formulario-inputs-alert");
								 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			                     $('.mensajeSatisfactorio').fadeOut(15000);
								  $("#txtBuscarDetalladoPerfil").val("");
								  $("#tListadoDeAccesosEnPerfilBD>tbody").html(response.datosDeTabla);
								  if( $("#tListadoDeAccesosEnPerfilBD>tbody>tr").length)
								  {
									  
									   if($('#tListadoDeAccesosEnPerfilBD>tbody>tr').find('td').eq(0).attr('class')=='nr')
				{
					  $("#txtBuscarDetalladoPerfil").attr("disabled",true);
					  
				}else
				{
					$('#txtBuscarDetalladoPerfil').removeAttr('disabled');
					$('#txtBuscarDetalladoPerfil').focus();
				}
									   
									   
									   
									   
									   
									   
								  }
								  
								  
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#loader').bPopup().close();
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
	}
});



//agregar detalle a perfil

$(document).on('click','#btnAgregarDetallePerfil',function()
{
	var bandera=$(this).data('bandera');
	
	if(bandera==1){
		
	$('#Ma').hide();
	$('#Mb').show();
	$('#ban').text(1);
	$('#txtBuscarAccesosListadoA').val("");
	$('#idPerfil').text($("#cmbListadoDePerfiles option:selected").val());
	$("span.ui-dialog-title").text("Listado De Accesos"); 
	$('#windowDialog').css('overflow','hidden');
	$('#windowDialog').dialog({
		        closeOnEscape: true,
		        height: 350,
                scrollable: true,
                width: 720,
				
                modal: true,
			    open: function(event, ui )
				{   
				    if($('#Mb').is(':visible')){
					  
					  $.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'accion=cargarAccesosListaPerfil',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html('<tr align="center"><td colspan="4"> <img src="Imagenes/loader3.gif" width="32" height="32" alt="loader3" /> </td> </tr>');
							 
						 },success:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 if(response.respuesta=="si"){
								  $('#tListadoDeAccesosEnPerfilAgregar>tbody').html(response.datosDeTabla);
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
					 
					}
				},
				autoOpen:true,
					buttons: {
                'Cerrar': function(){
					
                    $(this).dialog('close');
					$('#txtBuscarAccesosListadoA').val("");
           
				
                        
		}
		
	}
	})
		
	}
})



//eliminar perfil de usuario
$(document).on('click','#btnDeletePerfilUsuario',function()
{
	var bandera=$(this).data('bandera');
	var idRegistro=$('#cmbListadoDePerfiles option:selected').val();
	
if(bandera==1){
	
	if(confirm("Deseas eliminar el perfil "+$('#cmbListadoDePerfiles option:selected').text()+"?")){
	$.ajax({
		type:"POST",
			url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		    data:'idRegistro='+idRegistro+'&accion=eliminarPerfilUsuario',
			dataType:"json",
			beforeSend: function(response)
			{
				$('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
				
			},success: function(response)
			{
				$('#loader').bPopup().close();
				if(response.respuesta=="si")
				{
					             $('input').removeClass("formulario-inputs-alert");
								 $('table>thead>tr').removeClass("pintar-td-mensaje-informativo");
					             $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
								 $('.mensajeSatisfactorio').fadeOut(15000);
								 $('#cmbListadoDePerfiles').html(response.datosDeTabla);
								 
								 //acciones despues de eliminar el perfil
								$("#btnAgregarDetallePerfil").removeAttr("style");
		                        $("#btnAgregarDetallePerfil").attr("title","");
		                        $('#btnAgregarDetallePerfil').css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
		                        $("#btnDeletePerfilUsuario").removeAttr("style");
		                        $("#btnDeletePerfilUsuario").attr("title","");
		                        $("#btnDeletePerfilUsuario").css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
		                        $("#btnDeletePerfilUsuario").data('bandera',0);
		                        $('#btnAgregarDetallePerfil').data('bandera',0);
		                        $('#txtBuscarDetalladoPerfil').attr('disabled',true);
		                        $('#txtBuscarDetalladoPerfil').val("");
		                        $('#tListadoDeAccesosEnPerfilBD>tbody').html("");
								
								$('#btnModificarNombrePerfil').data('bandera',0);
								$('#txtNuevoNombrePerfil').val("");
								$('#txtNuevoNombrePerfil').attr('disabled',true);
								 
								$("#btnModificarNombrePerfil").removeAttr("style");
		                        $("#btnModificarNombrePerfil").attr("title","");
		                        $("#btnModificarNombrePerfil").css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
								$("#txtNuevoNombrePerfil").prop('placeholder','Nuevo nombre perfil');
					
				}else
				{
					$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				    $('.mensajeSatisfactorio').fadeOut(15000);
				}
				
			},error: function(response)
			{
					$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		
	});
}
}
});

//eliminar perfil de usuario

$('#tabs-perfiles-usuario').tabs();

$('#irAccesos').click(function()
{
	$('#tabs-perfiles-usuario').tabs({active:0});
});

//cargar detalles de perfil 
$(document).on('change','#cmbListadoDePerfiles',function()
{
	var valor=$('#cmbListadoDePerfiles option:selected').val();
	$(".me").text("");
	$('input').removeClass("formulario-inputs-alert");
	$('table>thead>tr').removeClass("pintar-td-mensaje-informativo");
	if($.isNumeric(valor))
	{
		$('#txtBuscarDetalladoPerfil').val("");
		
		$.ajax(
		{
			type:"POST",
			url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		    data:'idRegistro='+valor+'&accion=detalladoPerfilesBD',
			dataType:"json",
			beforeSend: function(response)
			{
				$('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
				
			},success:function(response)
			{
			
				$('#loader').bPopup().close();
				if(response.respuesta=="si")
				{
					
					$('#tListadoDeAccesosEnPerfilBD>tbody').html(response.datosDeTabla);
					$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
					$('.mensajeSatisfactorio').fadeOut(15000);
					$("#btnAgregarDetallePerfil").removeAttr("style");
					$("#btnAgregarDetallePerfil").attr("title","Agregar Detalle Al Perfil "+$('#cmbListadoDePerfiles option:selected').text());
					$('#btnAgregarDetallePerfil').css({"cursor":"pointer"});
					$('#btnAgregarDetallePerfil').data('bandera',1);
					
					$("#btnDeletePerfilUsuario").removeAttr("style");
					$("#btnDeletePerfilUsuario").attr("title","Eliminar Perfil "+$('#cmbListadoDePerfiles option:selected').text());
					$("#btnDeletePerfilUsuario").css({"cursor":"pointer"});
					$("#btnDeletePerfilUsuario").data('bandera',1);
					
					$("#btnModificarNombrePerfil").removeAttr("style");
					$("#btnModificarNombrePerfil").attr("title","Moficar Nombre De Perfil "+$('#cmbListadoDePerfiles option:selected').text());
					$("#btnModificarNombrePerfil").css({"cursor":"pointer"});
					$("#btnModificarNombrePerfil").data('bandera',1);
					
					$('#txtNuevoNombrePerfil').prop('placeholder','Nuevo nombre perfil '+$('#cmbListadoDePerfiles option:selected').text());
					$('#txtNuevoNombrePerfil').removeAttr('disabled');
					
					 if( $("#tListadoDeAccesosEnPerfilBD>tbody>tr").length==0)
								  {
									   $("#txtBuscarDetalladoPerfil").attr("disabled",true);
								  }else
								  {
									  $("#txtBuscarDetalladoPerfil").removeAttr('disabled');
									  $("#txtBuscarDetalladoPerfil").focus();
									  $("#txtBuscarDetalladoPerfil").val("");
								  }
			  }
				
			},error:function(response)
			{
				$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		});
	}else
	{
		$("#btnAgregarDetallePerfil").removeAttr("style");
		$("#btnAgregarDetallePerfil").attr("title","");
		$('#btnAgregarDetallePerfil').css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
		$("#btnDeletePerfilUsuario").removeAttr("style");
		$("#btnDeletePerfilUsuario").attr("title","");
		$("#btnDeletePerfilUsuario").css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
		$("#btnModificarNombrePerfil").removeAttr("style");
		$("#btnModificarNombrePerfil").attr("title","");
		$("#btnModificarNombrePerfil").css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
		
		$("#btnDeletePerfilUsuario").data('bandera',0);
		$('#btnModificarNombrePerfil').data('bandera',0);
		$('#btnAgregarDetallePerfil').data('bandera',0);
	
		$('#txtBuscarDetalladoPerfil').attr('disabled',true);
		$('#txtBuscarDetalladoPerfil').val("");
		$('#tListadoDeAccesosEnPerfilBD>tbody').html("");
		$('#txtNuevoNombrePerfil').prop('placeholder','Nuevo nombre perfil');
		$('#txtNuevoNombrePerfil').attr('disabled',true);
		$('#txtNuevoNombrePerfil').val("");
		
		
	}
});
//cargar detalles de perfil 


//agregar accesos a listado

//no permitir espacios en direccion de página

$(document).on('keydown','#txtPaginaAcceso,#txtPaginaAccesoM',function(event)
{ 
     (event.keyCode ==32)?event.preventDefault():'';
})
//no permitri espacios en direccion de página


//agregar nuevo perfil

$(document).on('submit','#frmAgregarNuevoPerfil',function()
{
	
	
$('input').removeClass('formulario-inputs-alert');
     
	//contar el numero de registros de la tabla temporal que seran enviado por ajax/
     $('#tListadoDeAccesosEnPerfil>tbody>tr').each(function(index, element) {
        nAjax++;
    });
  
	$.ajax(
	{
		type:'POST',
		url:$(this).attr('action'),
		data:$(this).serialize()+'&na='+nAjax+'&accion=agregarPerfilDeUsuario',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
			 
			 //aparecer registros de tabla //
	 
	  $('#tListadoDeAccesosEnPerfil>tbody>tr.nr').remove();
	 
	 $('#tListadoDeAccesosEnPerfil>tbody>tr').each(function(index, element) {
        $(this).show();
    });
	 
	 //aparecer registros de tabla //
	$('#txtBuscarAccesosP').val("");
					    
			
		},success: function(response)
		{
			if(response.respuesta=="si")
			{
				$('#tListadoDeAccesosEnPerfil>tbody>tr').each(function(index, element) {
				   var idAcceso=$(this).attr('id');
				   var nombrePaginaAcceso=$(this).find('td').eq(2).text();
				    
					$.ajax(
					{
						type:'POST',
		                url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                data:'txtPaginaAcceso='+nombrePaginaAcceso+'&idRegistro='+idAcceso+'&accion=detalladosDePerfil',
		                dataType:"json",
						success: function(response)
						{
							
						   
							if(response.respuesta=="si" && nAjax==nnAjax)
							{
								 $('#loader').bPopup().close();
								 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
								 $('.mensajeSatisfactorio').fadeOut(15000);
								 $('#cmbListadoDePerfiles').html(response.datosDeTabla);
								 
								 
								 $("#btnAgregarDetallePerfil").removeAttr("style");
		                         $("#btnAgregarDetallePerfil").attr("title","");
		                         $('#btnAgregarDetallePerfil').css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
		                         $('#txtBuscarDetalladoPerfil').attr('disabled',true);
		                         $('#txtBuscarDetalladoPerfil').val("");
		                         $('#tListadoDeAccesosEnPerfilBD>tbody').html("");
								 $("#btnDeletePerfilUsuario").removeAttr("style");
		                         $("#btnDeletePerfilUsuario").attr("title","");
		                         $("#btnDeletePerfilUsuario").css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
								 $("#btnDeletePerfilUsuario").data('bandera',0);
		                         $('#btnAgregarDetallePerfil').data('bandera',0);
								 $('#btnModificarNombrePerfil').data('bandera',0);
								 $('#txtNuevoNombrePerfil').val("");
								 $('#txtNuevoNombrePerfil').attr('disabled',true);
								 
								  $("#btnModificarNombrePerfil").removeAttr("style");
		                         $("#btnModificarNombrePerfil").attr("title","");
		                         $("#btnModificarNombrePerfil").css({"-moz-opacity":".5","-webkit-opacity":".5","opacity":".5"});
								 $("#txtNuevoNombrePerfil").prop('placeholder','Nuevo nombre perfil');
								 
								 
								 $('#frmAgregarNuevoPerfil').each(function(index, element) {
                                    this.reset();
                                });
								$('#tListadoDeAccesosEnPerfil>tbody').html("");
								$('#txtBuscarAccesosP').attr('disabled',true);
							}
							
						},error: function(response)
						{
							 $('#loader').bPopup().close();
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						}
					})
					
					
					
				});
				
			}else
			{
				$('#loader').bPopup().close();
				 if(response.fo=="nop")
				 {
					 $('#txtNombrePerfil').focus();
					 $('#txtNombrePerfil').addClass("formulario-inputs-alert");
					 $('#txtNombrePerfil').keyup(function()
					 {
						 $('.me').text("");
						 $('#tListadoDeAccesosEnPerfil>thead>tr').removeClass("pintar-td-mensaje-informativo");
						 $('#txtNombrePerfil').removeClass("formulario-inputs-alert");
					 })
					 
					 
					 
				 }else 
					 {   
					      $('#tListadoDeAccesosEnPerfil>thead>tr').addClass("pintar-td-mensaje-informativo");
						 $('input').removeClass('formulario-inputs-alert');
					 }
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
	})
	nAjax=0;
	nnAjax=0;
	return false;
	
})


//busqueda local detallado perfil


$(document).on('keyup input keydown change paste','#txtBuscarDetalladoPerfil ',function(event){
	var Data=$.trim($(this).val())
	
	if(event.keyCode==32  && $(this).val().length==0 && event.keyCode==9 )
	{
		event.preventDefault(); 
		
		
	}else{
		searchTable(Data,'tListadoDeAccesosEnPerfilBD');
	}})


//busqueda en tabla local listado accesos perfil
$(document).on('keyup input keydown change paste','#txtBuscarAccesosListadoA',function(event){
	var Data=$.trim($(this).val())
	
	if(event.keyCode==32  && $(this).val().length==0 && event.keyCode==9 )
	{
		event.preventDefault(); 
		
		
	}else{
		searchTable(Data,'tListadoDeAccesosEnPerfilAgregar');
	}})

//buscar en tabla listado de accesos pestaña accesos
$(document).on('keyup input keydown change paste','#txtBuscarAccesosA',function(event){
	var Data=$.trim($(this).val())
	
	if(event.keyCode==32  && $(this).val().length==0 && event.keyCode==9)
	{
		event.preventDefault(); 
		
		
	}else{
		searchTable(Data,'tListadoDeAccesos');
	}})



//busqueda de accesos en pestaña perfil

$(document).on('keyup input keydown change paste','#txtBuscarAccesosListadoA',function(event){
	var Data=$.trim($(this).val())
	
	if(event.keyCode==32  && $(this).val().length==0 && event.keyCode==9 )
	{
		event.preventDefault(); 
		
		
	}else{
		searchTable(Data,'tListadoDeAccesosEnPerfilAgregar');
	}})

//buscar en tabla listado de accesos pestaña accesos
$(document).on('keyup input keydown change paste','#txtBuscarAccesosP',function(event){
	var Data=$.trim($(this).val())
	
	if(event.keyCode==32  && $(this).val().length==0 && event.keyCode==9)
	{
		event.preventDefault(); 
		
		
	}else{
		searchTable(Data,'tListadoDeAccesosEnPerfil');
	}})

//modificar modificar acceso

$(document).on('click','.ModificarAcceso',function()
{
	 
	 $('#frmModificarAcceso input').removeClass("formulario-inputs-alert");
	 $('#frmModificarAcceso textarea').removeClass('formulario-inputs-selects-alert');
	 $('.mee').text("");
	 $('#Mb').hide();
	 $('#Ma').show();
	 var nombreMenu=$(this).closest('table tr').find('td').eq(0).text();
	 var rutaMenu=$(this).closest('table tr').find('td').eq(0).attr('RutaMenu');
	 var idAcceso=$(this).closest('table tr').attr('id');
	 var nombreAcceso=$(this).closest('table tr').find('td').eq(1).text();
	 var paginaAcceso=$(this).closest('table tr').find('td').eq(2).text();
	
	 
	 $('#txtNombreDeAccesoM').val(nombreAcceso);
	 $('#txtRutaMenuM').val(rutaMenu);
	 $('#txtPaginaAccesoM').val(paginaAcceso);
	 $('#txtNombreDeMenuM').val(nombreMenu);
	
	$("span.ui-dialog-title").text("Modificar Acceso"); 
	$('#windowDialog').dialog({
		        closeOnEscape: true,
		        height: 365,
                scrollable: true,
                width: 550,
                modal: true,
			    autoOpen: true,
					buttons: {
						'Modificar':function(){
							
							$.ajax({
	type:'POST',
	url:$('#frmModificarAcceso').attr('action'),
	data:$('#frmModificarAcceso').serialize()+'&idRegistro='+idAcceso+'&accion=modificarAcceso',
	dataType:"json",
	beforeSend: function(response)
	{
		 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
	},success: function(response)
	{
		
		  $('#loader').bPopup().close();
	
		
		if(response.respuesta=="si")
		{
		 
		      
		
		     $('.mee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('#tListadoDeAccesos>tbody').html(response.datosDeTabla);
			 $('.mensajeSatisfactorio').fadeOut(15000);
			 $('#txtBuscarAccesosA').val("");
			 setTimeout(function()
			 {
				 $('#windowDialog').dialog("close");
				 
			 },2500)
			
			
			
		 
		}else
		{
			if(response.fo=='men')
			{
				$('#txtNombreDeMenuM').focus();
			    $('#txtNombreDeMenuM').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='rmen')
			{
				$('#txtRutaMenuM').focus();
			    $('#txtRutaMenuM').addClass("formulario-inputs-selects-alert");
				
			}
			
			else if(response.fo=='na')
			{
				$('#txtNombreDeAccesoM').focus();
			    $('#txtNombreDeAccesoM').addClass("formulario-inputs-alert");
			
			}else if(response.fo=='np')
			{
				$('#txtPaginaAccesoM').focus();
			    $('#txtPaginaAccesoM').addClass("formulario-inputs-alert");
				
			}
			
			$(document).on('input keyup','#frmModificarAcceso input,#frmModificarAcceso textarea',function()
			{
				      $('#frmModificarAcceso input').removeClass("formulario-inputs-alert");
					  $('#frmModificarAcceso textarea').removeClass("formulario-inputs-selects-alert");
					  $('.mee').text("");
			});
			
		    $('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		}
		
	},error: function(response)
	{
		$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		
	}
	
})
return false;
							
							
			 
	},
						
                'Cerrar': function(){
					
                    $(this).dialog('close');
				
				
                        
		}, 
		
	}
	});
});

//perfil 
//eliminar perfil temporal de la lista

$(document).on('click','.EliminarAccesoListaPerfil',function()
{
	var tr=$(this).closest("table tr");
	$("input").removeClass("formulario-inputs-alert");
	
   
   
	             	tr.remove();
					$('.me').html('<div class="mensajeSatisfactorio">Acceso Temporal eliminado.</div>');
				    $('.mensajeSatisfactorio').fadeOut(15000);		
				    if($('#tListadoDeAccesosEnPerfil>tbody>tr').length==0)
					{
		               $('#txtBuscarAccesosP').attr('disabled',true);
					} 					  
			
	
	
	   
	
})

//agregar acceso a lista perfil
$(document).on('click','.addAccesoListaPerfil',function()
{
	var IdDato=datoABuscar=$(this).closest('table tr').attr('id'); //Id Acceso
	var nombreDeAcceso=$(this).closest('table tr').find('td').eq(1).text();
	var nombreMenu=$(this).closest('table tr').find('td').eq(0).text();
	var rutamenu=$(this).closest('table tr').find('td').eq(0).attr('rutamenu');
	var datoABuscar=$(this).closest('table tr').find('td').eq(2).text();//Pagina Acceso
	var idPerfil=$("#idPerfil").text();
	

	
	$("input").removeClass("formulario-inputs-alert");

	
	if($('#ban').text()!=1 && $('#ban').text()!=2  && $('#ban').text()!=3 ){
	if(!(buscarEnTabla(datoABuscar,2,'#tListadoDeAccesosEnPerfil')))
	{
		$('#tListadoDeAccesosEnPerfil>tbody').append('<tr align="center" class="pintar-td-titulos-gris-bajo" id="'+IdDato+'"><td  title="<strong>Ruta Del Menu</strong><hr/>'+rutamenu+'">'+nombreMenu+'</td><td>'+nombreDeAcceso+'</td><td>'+datoABuscar+'</td><td><img title="Eliminar Acceso." src="Imagenes/delete.png" class="EliminarAccesoListaPerfil" alt="Eliminar Aceeso" style="cursor:pointer;">  </td></tr>');
		 
			   alertt('Acceso agregado a la lista.');
			   setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							
						   },2500);
			   
		 $('#txtBuscarAccesosP').removeAttr('disabled');
		 $('#txtBuscarAccesosP').val("");
		 $('#tListadoDeAccesosEnPerfil>thead>tr').removeClass("pintar-td-mensaje-informativo");
		 $('#tListadoDeAccesosEnPerfil>tbody>tr.nr').remove();
		 $('#tListadoDeAccesosEnPerfil>tbody>tr').each(function(index, element) {
         $(this).show();
        });
		 
		
	}
	else
	{
		alertt('La página no se puede agregar por que ya fue agregada!.');
			 
	}
	
	}else if($('#ban').text()==3)//agregar detalle de acceso ousr en catalogo usuarios
	{
	
		$.ajax(
		{
			type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+IdDato+'&idPerfil='+$('#idPerfil').text()+'&txtNombreUsuarioA='+$('#idUsuario').text()+'&accion=agregarAccesoOusr',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},success: function(response)
		{
		
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			 $('#txtBAccesoOusrAccesos').val("");
			 if($('#windowDialog').is(':visible')){
			   alertt(response.mensaje);
			    setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							
						   },2500);
			   }else
			   {
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			   }
			 
			 $('#tAccesosOusr>tbody').html(response.datosDeTabla);
			 
			 
				
			}else
			{
				
				alertt(response.mensaje);
				 setTimeout(function()
			              {
			                $('#customAlert').dialog("close");
							
						   },2500);
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud            (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	});
		
	}
	else if($('#ban').text()==2)//aqui se hara la accion de agregar detalle a acceso ousr
	{
		
		
	
		
		var idUsuario=$('#cmbListaDeUsuariosCoorp option:selected').val();
		var idP=$('#cmbListaDeUsuariosCoorp option:selected').data('idp');
	   
		
	
		$.ajax(
		{
			type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+IdDato+'&idPerfil='+idP+'&txtNombreUsuarioA='+idUsuario+'&accion=agregarAccesoOusr',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},success: function(response)
		{
		
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			 if($('#windowDialog').is(':visible')){
			   alertt(response.mensaje);
			  
			   }else
			   {
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			   }
			 $('#tAccesosOusr>tbody').html(response.datosDeTabla);
			 
			 
				
			}else
			{
				
				alertt(response.mensaje);
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud            (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	});
	}
	else//agregar detalle a perfil existente
	{
			
	 
		$.ajax(
	{
		type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+IdDato+'&idPerfil='+idPerfil+'&txtPaginaAcceso='+datoABuscar+'&accion=agregarDetallePerfilEx',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			 
			 if($('#windowDialog').is(':visible')){
			   alertt(response.mensaje);
			 
			   }else
			   {
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			   }
			 
			 
			 
			 $('#tListadoDeAccesosEnPerfilBD>tbody').html(response.datosDeTabla);
			 if( $("#tListadoDeAccesosEnPerfilBD>tbody>tr").length)
								  {
									  $("#txtBuscarDetalladoPerfil").removeAttr('disabled');
									  
									  $("#txtBuscarDetalladoPerfil").val("");
									  
								  }
			 
			 
				
			}else
			{
				
				alertt(response.mensaje);
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	})
	 
	}
})

//quitar mensaje cuando se cambia de pestaña



$('#tabs-perfiles-usuario ul li').click(function()
{
	$('.me').text("");
	$('.mee').text("");
	$('input').removeClass("formulario-inputs-alert");
	$('textarea').removeClass("formulario-inputs-selects-alert");
	$('#tListadoDeAccesosEnPerfil>thead>tr').removeClass("pintar-td-mensaje-informativo");
	
})

$('#tabs-updateDataUserCoorp ul li').click(function()
{
	$('#frmModificarContrasenaCoorporativo input,#frmModificarDatosDeUsuarioCoo input').removeClass('formulario-inputs-alert');
	$('.mee').text("");
	
});


//funcion para buscar en tabla
function buscarEnTabla(datoABuscar,eq,idTabla)
{
	var encontrado=false;
	 
	 $(idTabla+'>tbody tr').each(function(index, element) {
        
		if($(this).find('td').eq(eq).text()==datoABuscar)
		{
			encontrado=true;
			return false;
			
			
		}
    });
	
	return encontrado;
	
}

//Listado de accesos
$(document).on(' click','.abrirCatalogoAccesos',function()
{
	$('#Ma').hide();
	$('#Mb').show();
	$('#ban').text("");
	$('#idPerfil').text("");
	$("span.ui-dialog-title").text("Listado De Accesos"); 
	$('#windowDialog').css('overflow','hidden');
	$('#windowDialog').dialog({
		        closeOnEscape: true,
		        height: 350,
                scrollable: true,
                width: 720,
				
                modal: true,
			    open: function(event, ui )
				{   
				    if($('#Mb').is(':visible')){
					  
					  $.ajax({
						 type:'POST',
		                 url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		                 data:'accion=cargarAccesosListaPerfil',
		                 dataType:"json",
						 beforeSend: function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html('<tr align="center"><td colspan="4"> <img src="Imagenes/loader3.gif" width="32" height="32" alt="loader3" /> </td> </tr>');
							 
						 },success:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 if(response.respuesta=="si"){
								  $('#tListadoDeAccesosEnPerfilAgregar>tbody').html(response.datosDeTabla);
							 }
							 
							 
							 
						 },error:function(response)
						 {
							 $('#tListadoDeAccesosEnPerfilAgregar>tbody').html("");
							 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						 }
						  
					  });
					 
					}
				},
				autoOpen:true,
					buttons: {
                'Cerrar': function(){
					
                    $(this).dialog('close');
					
           
				
                        
		}, 
		
	}
	})
	
})


//eliminar acceso

$(document).on('click','.EliminarAcceso',function()
{
	var paginaAcceso=$(this).closest('table tr').find('td').eq(1).text();
	
	if(confirm("Esta seguro que desea eliminar el acceso "+ paginaAcceso +"? \n Este sera eliminado de todos los perfiles ya creados."))
	{
	var idAcceso=$(this).closest('table tr').attr('id');
	$.ajax(
	{
		type:'POST',
		url:"../Php_Scripts/s_accionesUsuarioAdmin.php",
		data:'idRegistro='+idAcceso+'&accion=eliminarAcceso',
		dataType:"json",
		beforeSend: function(response)
		{
			 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
            });
		},
		success: function(response)
		{
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('#tListadoDeAccesos>tbody').html(response.datosDeTabla);
			 
			 $('.mensajeSatisfactorio').fadeOut(15000);
				
			}
			
		},error: function(response)
		{
			$('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
		
	})
	}
});
//eliminar acceso




$(document).on('submit','#frmAgregarAcceso',function()
{
	
	$.ajax({
	type:'POST',
	url:$(this).attr('action'),
	data:$(this).serialize()+'&accion=agregarAcceso',
	dataType:"json",
	beforeSend: function(response)
	{
		 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
	},success: function(response)
	{
		  $('#loader').bPopup().close();
		
		
		if(response.respuesta=="si")
		{
		 
		      
		
		     $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('#tListadoDeAccesos>tbody').html(response.datosDeTabla);
			 $('.mensajeSatisfactorio').fadeOut(15000);
			
			 $('#frmAgregarAcceso').each(function() {
                this.reset();
            });
			
		 
		}else
		{
			if(response.fo=='men')
			{
				$('#txtNombreDeMenu').focus();
			    $('#txtNombreDeMenu').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='rmen')
			{
				$('#txtRutaMenu').focus();
			    $('#txtRutaMenu').addClass("formulario-inputs-selects-alert");
				
			}
			
			else if(response.fo=='na')
			{
				$('#txtNombreDeAcceso').focus();
			    $('#txtNombreDeAcceso').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='np')
			{
				$('#txtPaginaAcceso').focus();
			    $('#txtPaginaAcceso').addClass("formulario-inputs-alert");
				
			}
			 $(document).on('input keyup','#frmAgregarAcceso input,#frmAgregarAcceso textarea',function()
				{
				
					 $('#frmAgregarAcceso input').removeClass("formulario-inputs-alert");
				     $('#frmAgregarAcceso textarea').removeClass("formulario-inputs-selects-alert");
					 $('.me').text("");
				})
			
		    $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		}
		
	},error: function(response)
	{
		$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		
	}
	
})
	
	
	return false;
});

/*acciones perfiles de usuario pagina perfilesDeUsuario.php*/



/*acciones editar info usuario coorporativo editarMisdatosCoorp.php*/
$('#tab-modificar-datos-coo').tabs();

$('#tab-modificar-datos-coo ul li').click(function()
{
	
	$('#tab-modificar-datos-coo input').removeClass("formulario-inputs-alert");
	$('.me').text("");
})


/*acciones de super usuario*/


/*modificar usuario*/
$(document).on('submit','#frmModificarUsuarioA',function(){

$.ajax({
	type:'POST',
	url:$(this).attr('action'),
	data:$(this).serialize()+'&accion=modificarMisDatos',
	dataType:"json",
	beforeSend: function(response)
	{
		 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
	},success: function(response)
	{
		  $('#loader').bPopup().close();
		
		if(response.respuesta=="si")
		{
		 
		  setTimeout(function()
		  {
			   window.location.href = "../editarMisdatosCoorp.php";
			   
			   
			  
		  },1500);	
		
		     $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 
			
		 
		}else
		{
			
			if(response.fo=='nom')
			{
				$('#txtNombreA').focus();
			    $('#txtNombreA').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='aP')
			{
				$('#txtApellidoPA').focus();
			    $('#txtApellidoPA').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='aM')
			{
				$('#txtApellidoMA').focus();
			    $('#txtApellidoMA').addClass("formulario-inputs-alert");
				
			
			}else if(response.fo=='email')
			{
				$('#txtEmailA').focus();
			    $('#txtEmailA').addClass("formulario-inputs-alert");
				
			}
			 $(document).on('input','#frmModificarUsuarioA input',function()
			 {
				 $('#frmModificarUsuarioA input').removeClass("formulario-inputs-alert");
				 $('.me').text("");
			 });
		    $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		}
		
	},error: function(response)
	{
		$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
                
		
	}
	
})

return false;
});
/*modificar usuario*/

/*modificar contraseña de usuario*/
$(document).on('submit','#frmModificarContrasenaA',function(){

$.ajax({
	type:'POST',
	url:$(this).attr('action'),
	data:$(this).serialize()+'&accion=modificarMiContrasena',
	dataType:"json",
	beforeSend: function(response)
	{
		 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
	},success: function(response)
	{
		  $('#loader').bPopup().close();
		
		if(response.respuesta=="si")
		{
		
		 
		     $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
		   $('#frmModificarContrasenaA').each(function() {
                    this.reset();
                });
			
			
		 
		}else
		{
			if(response.fo=='co1')
			{
				$('#txtContrasenaA').focus();
			    $('#txtContrasenaA').addClass("formulario-inputs-alert");
				
			}else if(response.fo=='co2')
			{
				$('#txtRContrasenaA').focus();
			    $('#txtRContrasenaA').addClass("formulario-inputs-alert");
			
			}
			
			$(document).on('input','#frmModificarContrasenaA input',function()
			{
				$('#frmModificarContrasenaA input').removeClass("formulario-inputs-alert");
				$('.me').text("");
			});
		    $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		}
		
	},error: function(response)
	{
		$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		
	}
	
})

return false;
});

/*modificar contraseña de usuario*/

/*agregar usuario*/

$(document).on('submit','#frmNuevoUsuarioA',function(){

$.ajax({
	type:'POST',
	url:$(this).attr('action'),
	data:$(this).serialize()+'&accion=agregarNuevoUsuario',
	dataType:"json",
	beforeSend: function(response)
	{
		 $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
     });
	},success: function(response)
	{
		  $('#loader').bPopup().close();
		
		
		if(response.respuesta=="si")
		{
			
		 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				  $('.mensajeSatisfactorio').fadeOut(15000);
		 $('#frmNuevoUsuarioA').each(function() {
                    this.reset();
                });
			
		 
		}else
		{
			
			if(response.fo=='nom')
			{
				$('#txtNombreA').focus();
			    $('#txtNombreA').addClass("formulario-inputs-alert");
				$('#txtNombreA').keyup(function()
				{
					   $('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
					  $('.me').text("");
				})
			}else if(response.fo=='aP')
			{
				$('#txtApellidoPA').focus();
			    $('#txtApellidoPA').addClass("formulario-inputs-alert");
				$('#txtApellidoPA').keyup(function()
				{
					   $('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
					  $('.me').text("");
				})
			}else if(response.fo=='aM')
			{
				$('#txtApellidoMA').focus();
			    $('#txtApellidoMA').addClass("formulario-inputs-alert");
				$('#txtApellidoMA').keyup(function()
				{
					   $('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
					  $('.me').text("");
				})
			}else if(response.fo=='no')
			{
				$('#txtNombreUsuarioA').focus();
			    $('#txtNombreUsuarioA').addClass("formulario-inputs-alert");
				$('#txtNombreUsuarioA').keyup(function()
				{
					   $('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
					  $('.me').text("");
				})
			}else if(response.fo=='email')
			{
				$('#txtEmailA').focus();
			    $('#txtEmailA').addClass("formulario-inputs-alert");
				$('#txtEmailA').keyup(function()
				{
					   $('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
					  $('.me').text("");
				})
			}else if(response.fo=='co1')
			{
				$('#txtContrasenaA').focus();
			    $('#txtContrasenaA').addClass("formulario-inputs-alert");
				$('#txtContrasenaA').keyup(function()
				{
					   $('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
					  $('.me').text("");
				})
			}else if(response.fo=='co2')
			{
				$('#txtRContrasenaA').focus();
			    $('#txtRContrasenaA').addClass("formulario-inputs-alert");
				$('#txtRContrasenaA').keyup(function()
				{
					  $('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
					  $('.me').text("");
				})
			}else if(response.fo=="per")
			{
				$('#cmbPerfilesDeUsuario').addClass("formulario-inputs-selects-alert");
							$('#cmbPerfilesDeUsuario').click(function()
							{
								$('input').removeClass("formulario-inputs-alert");
					  $('select').removeClass("formulario-inputs-selects-alert");
								$('.me').text("");
							})
			}
			
		    $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		}
		
	},error: function(response)
	{
		$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		
	}
	
})

return false;

});

//comprobar que nombre de usuario no este registrado
$(document).on('keyup input','#txtNombreUsuarioA',function()
{
	
$('#btnGuardarUsuarioA').attr('disabled',true);	

 var url=$(this).parents('form').attr('action');
 if(event.keyCode!=13 && event.keyCode!=37 &&  event.keyCode!=39){
	$.ajax(
		{
			type:'POST',//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:url,//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:'pagina='+baseName+'&idRegistro='+$('#idUsuario').text()+'&txtNombreUsuarioA='+$('#txtNombreUsuarioA').val()+'&accion=comprobarNombreUsuario',//DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
			beforeSend: function(){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
			
		     $('#loaderNombreUsuarioA').show();
			}, success: function(response)
			{
				
				$('#loaderNombreUsuarioA').hide();
				
				
				
				if(response.respuesta=="si")
				{
					
			        if($('#windowDialog').is(':visible'))
					{
						$('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					}else{
					$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					}
					
					       /*quitamos la clase de alerta de todos los inputs menos el de email*/
		                     $('input[type=text]').each(function(index, element) {
                                $(this).removeClass("formulario-inputs-alert");
                            });
							/*quitamos la clase de alerta de todos los inputs menos el de email*/
							$('#txtNombreUsuarioA').addClass("formulario-inputs-alert");
							$('#txtNombreUsuarioA').keyup(function()
							{
								$('#txtNombreUsuarioA').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					
					/*desactivamos botones*/
					$('#btnGuardarUsuarioA').attr('disabled',true);
					$('#btnModificarDatosCO').attr('disabled',true);
					$('#txtEmailA').attr('disabled',true);
					$(".ui-dialog-buttonpane button:contains('Modificar')").button("disable");
					/*desactivamos botones*/
					
					
					
					
				}else
				{
					
					$('#loaderNombreUsuarioA').hide();
					$('.me').text("");
					$('#btnGuardarUsuarioA').attr('disabled',false);
					$('#txtEmailA').attr('disabled',false);
					$('#btnModificarDatosCO').attr('disabled',false);
					$(".ui-dialog-buttonpane button:contains('Modificar')").button("enable");
					
					
				}
				
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				$('#loaderNombreUsuarioA').hide();
			}
			
		});
 }
	
	
	
})
//comprobar que nombre de usuario no este registrado

//comprobar email que no este registrado

$(document).on('keyup input keydown','#txtEmailA',function(event)
{
	$('#btnGuardarUsuarioA').attr('disabled',true);	
 var url=$(this).parents('form').attr('action');
 
 if(event.keyCode!=13 && event.keyCode!=37 &&  event.keyCode!=39){
	
	$.ajax(
		{
			type:'POST',//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:url,//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:'txtNombreA='+emailEnTabla+'&txtEmailA='+$('#txtEmailA').val()+'&accion=comprobarEmail&pagina='+baseName,//DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
			beforeSend: function(){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
			
		     $('#loaderEmailA').show();
			}, success: function(response)
			{
				
				$('#loaderEmailA').hide();
				if(response.respuesta=="si")
				{
					
			        if($('#windowDialog').is(':visible'))
					{
						$('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					}else{
					$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					}
					
					       /*quitamos la clase de alerta de todos los inputs meno el de email*/
		                     $('input[type=text]').each(function(index, element) {
                                $(this).removeClass("formulario-inputs-alert");
                            });
							/*quitamos la clase de alerta de todos los inputs meno el de email*/
							$('#txtEmailA').addClass("formulario-inputs-alert");
							$('#txtEmailA').keyup(function()
							{
								$('#txtEmailA').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					
					/*desactivamos botones*/
					$('#btnGuardarUsuarioA').attr('disabled',true);
					$('#btnModificarDatosCO').attr('disabled',true);
					$('#txtNombreUsuarioA').attr('disabled',true);
					$(".ui-dialog-buttonpane button:contains('Modificar')").button("disable");
					/*desactivamos botones*/
					
					
					
					
				}else
				{
					
					$('#loaderEmailA').hide();
					$('.me').text("");
					$('#btnGuardarUsuarioA').attr('disabled',false);
					$('#txtNombreUsuarioA').attr('disabled',false);
					$('#btnModificarDatosCO').attr('disabled',false);
					$(".ui-dialog-buttonpane button:contains('Modificar')").button("enable");
					
					
				}
				
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				$('#loaderEmailA').hide();
			}
			
		});
 }
})


//comprobar email que no este registrado


/*agregar usuario*/








/*acciones de super usuario*/








/*ventana de dialogo*/
$("#windowDialog").dialog({
	autoOpen: false,
	show:cea(),
	closeOnEscape: false,
        hide: {
			
            effect: cea(),
            duration: 500
        },
	draggable: true,
        modal:true,
	resizable: false,
        height:400,
        width:420,
	buttons: {
                'Cerrar': function(){
                    $("#contFrmAlta").html("");
                    $(this).dialog('close');
				
                        
		},
		
	}
}); 
/*ventana de dialogo*/




/*envio de la informacion */

$(document).on('click','#SiguienteSeleccionET',function(){

alert('Envio De La Info');
	
})



/*seleccionar todas las plazas*/

/*cargar dialog y filtros cuando se da click en una caja de filtros adicionales */
$(document).on('click','.faET',function()
{
	var idCajaDeTexto=$(this).attr('id');
	var cajaDeTextoSeleccionada=$(this).closest('table tr').find('td').eq(0).find('input:checkbox').attr('id');
	/*poner titulo a ventana*/
	switch(cajaDeTextoSeleccionada)
	{
		case 'chkPrendasET':
		tituloVentanaDialogoET="Filtro Adicional Prendas";
		accionFiltro="filtrarPrenda";
		break; 
		case 'chkArteET':
		tituloVentanaDialogoET="Filtro Adicional Arte";
		accionFiltro="filtrarArte";
		break;
		case 'chkColorET':
		tituloVentanaDialogoET="Filtro Adicional Color";
		accionFiltro="filtrarColor";
		break;
		case 'chkTallasET':
		tituloVentanaDialogoET="Filtro Adicional Tallas";
		accionFiltro="filtrarTallas";
		break;
		case 'chkGrupoET':
		tituloVentanaDialogoET="Filtro Adicional Grupo";
		accionFiltro="filtrarGrupo";
		break;
		case 'chkFamiliaET':
		tituloVentanaDialogoET="Filtro Adicional Familia";
		accionFiltro="filtrarFamilia";
		break;
		case 'chkSubFamiliaET':
		tituloVentanaDialogoET="Filtro Adicional Sub Familia";
		accionFiltro="filtrarSubFamilia";
		break;
		
	}
    /*poner titulo a ventana*/
	
    busquedaFiltros='<div id="filtra_"'+idCajaDeTexto+'" class="FiltraSearch">';
    busquedaFiltros+='<div class="headSearch">';
    busquedaFiltros+='<div class="filaH">';
    busquedaFiltros+='<div>Codigo</div>';
    busquedaFiltros+='<div>Descripcion</div>';
    busquedaFiltros+='</div>';
    busquedaFiltros+='<div class="filaH">';
    busquedaFiltros+='<div style="background:yellow;" ><input class="filtrabusquedaET" style="background:transparent;border:0px;box-shadow:none; text-align:center;" id="txtFiltraCodeET" name="filtraCodeET"     type="text"/></div>';
    busquedaFiltros+='<div style="background:yellow;" ><input class="filtrabusquedaET" style="background:transparent;border:0px;box-shadow:none; text-align:center;" id="txtFiltraDescET" name="filtraDescET"     type="text"/></div>';
    busquedaFiltros+='</div>';
    busquedaFiltros+='</div>';
    busquedaFiltros+='<div class="bodySearch">';
    busquedaFiltros+='</div>';
    busquedaFiltros+='</div>';
		
		
		
       $("#contFrmAlta").html(busquedaFiltros);
		$("span.ui-dialog-title").text(tituloVentanaDialogoET); 
        $("#windowDialog").dialog("open");
	   $('#txtFiltraCodeET').keyup();
})
/*cargar dialog y filtros cuando se da click en una caja de filtros adicionales */

/*programacion de la ventana evaluacionDeTemporada.php*/
$(document).on("keyup",".filtrabusquedaET",function(){
   
   var codigo=$('#txtFiltraCodeET').val();
   var descripcion=$('#txtFiltraDescET').val();
   $.ajax({
	   type:'POST',
	   dataType:"json",
	   url:'../Php_Scripts/s_accionesEvaluacionTemporada.php',
	   data:'accion='+accionFiltro+'&txtCodigo='+codigo+'&txtDescripcion='+descripcion,
	   beforeSend: function(response)
	   {
		   $('.bodySearch').html('<div style=" text-align:center;"><img width="32" height="32"  src="Imagenes/loader3.gif" alt="Cargando" /></div>');
	   },success: function(response)
	   {
		   
		   if(response.respuesta=='si')
		   {
			   $('.bodySearch').html(response.contenidoTabla);
			
		   }
		   
	   },error: function(response)
	   {
		    alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		   
	   }
	   })
});

/*busqueda de filtros adicionales Evaluacion De Temporada*/


$(document).on('click','#chkTodosET',function()
{
	if($('#chkTodosET').is(':checked'))
	{
		$('#tcpEvaluacionTemporada').find('input:checkbox').each(function(index, element) {
            $(this).attr('checked',true);
        });
	
	}else
	{
		$('#tcpEvaluacionTemporada').find('input:checkbox').each(function(index, element) {
			 
               $(this).removeAttr('checked');
			 
        });
	
	}
	
})
/*seleccionar todas las plazas*/



/*deseleccionar todos*/
$(document).on('click','#tcpEvaluacionTemporada :input',function()
{
	var contCheckBox=0;
	var contCheckBoxIsChecked=0;
	
	if($(this).attr('id')!='chkTodosET')
	{
		$('#chkTodosET').prop('checked',false);
		$('#tcpEvaluacionTemporada :input').each(function(index, element) {
          contCheckBox++;
        });
		
		$('#tcpEvaluacionTemporada :input:checkbox:checked').each(function(index, element) {
          contCheckBoxIsChecked++;
        });
		
		if(contCheckBox==(contCheckBoxIsChecked+1))
		{
			$('#chkTodosET').prop('checked',true);
		}
	}
	
})
/*deseleccionar todos*/


/*habilitar o deshabilitar filtros adicionales*/

$(document).on('click','.filAET',function()
{ 
var id=$(this).attr('id');

if($('#'+id).is(':checked'))
{
	switch(id)
	{
		case 'chkPrendasET':
		$('#txtInicialPrendasET').removeAttr('disabled');
		$('#txtInicialPrendasET').removeClass('disabled');
		$('#txtFinalPrendasET').removeAttr('disabled');
		$('#txtFinalPrendasET').removeClass('disabled');
		$('#txtInicialPrendasET').focus();
		break; 
		case 'chkArteET':
		$('#txtInicialArteET').removeAttr('disabled');
		$('#txtInicialArteET').removeClass('disabled');
		$('#txtFinalArteET').removeAttr('disabled');
		$('#txtFinalArteET').removeClass('disabled');
		$('#txtInicialArteET').focus();
	
		break;
		case 'chkColorET':
		$('#txtInicialColorET').removeAttr('disabled');
		$('#txtInicialColorET').removeClass('disabled');
		$('#txtFinalColorET').removeAttr('disabled');
		$('#txtFinalColorET').removeClass('disabled');
		$('#txtInicialColorET').focus();
	
		break;
		case 'chkTallasET':
		$('#txtInicialTallasET').removeAttr('disabled');
		$('#txtInicialTallasET').removeClass('disabled');
		$('#txtFinalTallasET').removeAttr('disabled');
		$('#txtFinalTallasET').removeClass('disabled');
		$('#txtInicialTallasET').focus();
		
		break;
		case 'chkGrupoET':
		$('#txtInicialGrupoET').removeAttr('disabled');
		$('#txtInicialGrupoET').removeClass('disabled');
		$('#txtFinalGrupoET').removeAttr('disabled');
		$('#txtFinalGrupoET').removeClass('disabled');
		$('#txtInicialGrupoET').focus();
	
		break;
		case 'chkFamiliaET':
		$('#txtInicialFamiliaET').removeAttr('disabled');
		$('#txtInicialFamiliaET').removeClass('disabled');
		$('#txtFinalFamiliaET').removeAttr('disabled');
		$('#txtFinalFamiliaET').removeClass('disabled');
		$('#txtInicialFamiliaET').focus();
		
		break;
		case 'chkSubFamiliaET':
		$('#txtInicialSubFamiliaET').removeAttr('disabled');
		$('#txtInicialSubFamiliaET').removeClass('disabled');
		$('#txtFinalSubFamiliaET').removeAttr('disabled');
		$('#txtFinalSubFamiliaET').removeClass('disabled');
		$('#txtInicialSubFamiliaET').focus();
	
		break;
		case 'chkTipoET':
		$('#cmbTipoET').removeAttr('disabled');
		$('#cmbTipoET').removeClass('disabled');
		break;
	}
	
}else
{
	
	switch(id)
	{
		case 'chkPrendasET':
		$('#txtInicialPrendasET').attr('disabled',true);
		$('#txtInicialPrendasET').addClass('disabled');
		$('#txtFinalPrendasET').attr('disabled',true);
		$('#txtFinalPrendasET').addClass('disabled');
		$('#txtInicialPrendasET').focus();
		$('#txtInicialPrendasET').val("");
		$('#txtFinalPrendasET').val("");
		break; 
		case 'chkArteET':
		$('#txtInicialArteET').attr('disabled',true);
		$('#txtInicialArteET').addClass('disabled');
		$('#txtFinalArteET').attr('disabled',true);
		$('#txtFinalArteET').addClass('disabled');
		$('#txtInicialArteET').focus();
		$('#txtInicialArteET').val("");
		$('#txtFinalArteET').val("");
		break;
		case 'chkColorET':
		$('#txtInicialColorET').attr('disabled',true);
		$('#txtInicialColorET').addClass('disabled');
		$('#txtFinalColorET').attr('disabled',true);
		$('#txtFinalColorET').addClass('disabled');
		$('#txtInicialColorET').focus();
		$('#txtInicialColorET').val("");
		$('#txtFinalColorET').val("");
		break;
		case 'chkTallasET':
		$('#txtInicialTallasET').attr('disabled',true);
		$('#txtInicialTallasET').addClass('disabled');
		$('#txtFinalTallasET').attr('disabled',true);
		$('#txtFinalTallasET').addClass('disabled');
		$('#txtInicialTallasET').focus();
		$('#txtInicialTallasET').val("");
		$('#txtFinalTallasET').val("");
		break;
		case 'chkGrupoET':
		$('#txtInicialGrupoET').attr('disabled',true);
		$('#txtInicialGrupoET').addClass('disabled');
		$('#txtFinalGrupoET').attr('disabled',true);
		$('#txtFinalGrupoET').addClass('disabled');
		$('#txtInicialGrupoET').focus();
		$('#txtInicialGrupoET').val("");
		$('#txtFinalGrupoET').val("");
		break;
		case 'chkFamiliaET':
		$('#txtInicialFamiliaET').attr('disabled',true);
		$('#txtInicialFamiliaET').addClass('disabled');
		$('#txtFinalFamiliaET').attr('disabled',true);
		$('#txtFinalFamiliaET').addClass('disabled');
		$('#txtInicialFamiliaET').focus();
		$('#txtInicialFamiliaET').val("");
		$('#txtFinalFamiliaET').val("");
		break;
		case 'chkSubFamiliaET':
		$('#txtInicialSubFamiliaET').attr('disabled',true);
		$('#txtInicialSubFamiliaET').addClass('disabled');
		$('#txtFinalSubFamiliaET').attr('disabled',true);
		$('#txtFinalSubFamiliaET').addClass('disabled');
		$('#txtInicialSubFamiliaET').focus();
		$('#txtInicialSubFamiliaET').val("");
		$('#txtFinalSubFamiliaET').val("");
		break;
		case 'chkTipoET':
		$('#cmbTipoET').attr('disabled',true);
		$('#cmbTipoET').addClass('disabled');
		break;
	}
	
	
}
	
});

/*habilitar o deshabilitar filtros adicionales*/





/*programacion de la ventana evaluacionDeTemporada.php*/






/*crear efecto aleatorio para ventana modal*/
function cea(){  
var efectos=['blind','clip','drop','explode','fade','slide']; //efectos de ventana
var rea=Math.floor(Math.random()*efectos.length); //random efecto alaeatorio
 
 return efectos[rea];
}
/*crear efecto aleatorio para ventana modal*/








$('#toTop').click(function()
{
	$('html, body').animate({scrollTop : 0},800);
	 return false;
	 
})


$('#toDown').click(function()
{
	
	$('html, body').animate({scrollTop : $(document).height()},1800);
	  return false;
	  
	 
})

//cachar evento con de scroll

$(window).scroll(function()
{
	
	if(!($('#toDown').is(':visible')) && $(window).scrollTop()>0 )
       {
	           $('#toDown').fadeIn();
			   $('#toTop').fadeOut();
			 
			 
       }
	   
	   if(!($('#toTop').is(':visible')) && $(window).height() + $(window).scrollTop()== $(document).height() )
       {    
			 $('#toTop').fadeIn();
			 $('#toDown').fadeOut();
			 
       }
	
})

//cachar evento con de scroll



/*busqueda en tabla local*/
$(document).on('change','#cmbFiltroA',function() //ocultar tablas para hacer la busqueda mas facil
{ 
	var tablaSeleccionada=$('#cmbFiltroA option:selected').val(); 
	$('#txtDatoDetalladoFind').val("");
	$('#txtDatoDetalladoFind').focus()
	
	   $('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) { //mostramos todas las tablas y los tr ocultos
            
			     $(this).show();
			    
				$(this).find(' tbody>tr').each(function(index, element) {
                    
					$(this).show();
					
                });
				
				
				$('#'+$(this).attr('id')+'>tbody').find('tr.nr').each(function(index, element) {
            
		 			$(this).remove();
        		});
			
        });                                                    
	
	    $('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) {//mostramos solo la tabla deseada
            
			if($(this).attr('id')!='tRPSReporteFiltros'+tablaSeleccionada && tablaSeleccionada!='SELECCIONE UNA OPCION')
			{
				$(this).hide();
			}
			
        });
		
		
		
})

 



$(document).on('keyup input keydown change paste','#txtDatoDetalladoFind',function(event){
	var Data=$.trim($(this).val())
	
	if(event.keyCode==32  && $(this).val().length==0 && event.keyCode==9)
	{
		event.preventDefault(); 
		
		
	}else{
		if($('cmbFiltroA').val('SELECCIONE UNA OPCION'))
		{
			$('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) {
                
				idTabla=$(this).attr('id');
				searchTable(Data,idTabla);
				
            });
		}else
		{
	  searchTable(Data,'tRPSReporteFiltros'+$('#cmbFiltroA option:selected').val())
		}
	}})

/*busqueda en tabla local*/



/*funcion para mostrar registros*/

  function searchTable(inputVal,t) {
                var table = $('#'+t).attr('id');
                $('#'+table).find('tbody>tr').each(function(index, row) {
                        var allCells = $(row).find('td');
                        if (allCells.length > 0) {
                                var found = false;
                                allCells.each(function(index, td) {
                                        var regExp = new RegExp(inputVal, 'i');
                                        if (regExp.test($(td).text())) {
                                                found = true;
                                                return false;
                                        }
                                });
                                if (found == true){
                                        $(row).show();
										$('#'+table+'>tbody').find('tr.nr').each(function(index, element) {//quitamos el mensaje 
            
										   $(this).remove()
        								});
								}
                                else{
                                        $(row).hide();
										
	                                 $('#'+table+'>tbody').find('tr.nr').each(function(index, element) {//quitamos el mensaje 
            
											$(this).remove()
        								});
								}
								
												
                        }
						
                });
				
				if($('#'+table+'>tbody>tr:visible').length==0){//ponemos el mensaje de que no se encontraron registros 
										$('#'+table+'>tbody').append('<tr class="nr" align="center"><td colspan="16" class="pintarCeldaSeleccionada"><span style=" font-size:16px;">¡No Se Encontraron Registros!</span></td></tr>');
	}
		
	
        }
/*funcion para mostrar registros*/












/*modificar y guardar detalles en bd margenBaseEnc*/

$('#btnModificarDetalladosBaseDet').click(function() //////////////////
{
	var tipoInfo="";
	var nta="";//tipo articulo
	var m="";//nombre marca
	var idm="";//id marca
    var ng="";//nombre genero
	var idng="";//id genero
	var nfam="";//nombre familia
	var idfam="";//idFamilia	
	var pCalculado=0;//porcentaje calculado
	var pVariable=0; //porcetanje variable
	var integracioDeVentaIngreso=0; //venta ingreso
	allC=parseFloat($('.allTC').text().split('%').join('')).toFixed(6);
	allV=parseFloat($('.allTV').text().split('%').join('')).toFixed(6);
	var plaza=$('#pam').text();
    tPresupuesto=0;//igualar variable a 0
	nnAjax=0;//variable para guardar el numero de registros que seran enviado spor ajax
    nAjax=0;//variable para guardar el numero de registros que seran enviado spor ajax
    var idEmpresa=$('#empresa').text();
	

	var p=0; //piezas
	var inversionPT=0; //inversion tienda promedio
	var ctoPromUnitPT=0;//costo promedio unitario en tienda
	var inversionTP=0;//inversion de tienda
	var ctoPromUnitTP=0;//costo promedio de tienda
	
	
	/*mostrar tablas ocultas*/
	$('#contenedorTablaDetalles').find('table').each(function(index, element) { //mostramos todas las tablas
            
			
				$(this).show();
				
				$(this).find('tbody>tr').each(function(index, element) { //mostrar tr ocultos
                    $(this).show();
                });
			//mostrar tr ocultos
			
			$('#'+$(this).attr('id')+'>tbody').find('tr.nr').each(function(index, element) {
                
				$(this).remove();
            });

        }); 
	/*mostrar tablas ocultas*/
	
	$('#cmbFiltroA').val('SELECCIONE UNA OPCION')//reetablecemos el listbox de busqueda
	$('#txtDatoDetalladoFind').val("");
	
	
	
	
	//contar numeros de registros que se enviaran por ajax
	$('#contenedorTablaDetalles').find('table').each(function(index, element) {
		
		
		 idTabla=$(this).attr('id');
		
		  $('#'+idTabla+ '  tbody tr ').each(function(index, element) {
			 
			nAjax++;
			
		  })
		
		
		  
	})
	

	//verificar el total presupuesto  e igualar total presupuesto que fue traido al consultar de la base de datos
	$('#contenedorTablaDetalles').find('table').each(function(index, element) {
		
		
		 idTabla=$(this).attr('id');
		
		  $('#'+idTabla+ '  tfoot tr ').each(function(index, element) {
			 
			tPresupuesto+=parseFloat($(this).find("td").eq(4).find('.totalIngreso'+idTabla.substring(18,idTabla.length)).text().split(',').join(''))//sumar totales de ingreso
			
		  })
		
		
		  
	})
	

		//verificar el total presupuesto  e igualar total presupuesto que fue traido al consultar de la base de datos
		
	
	if(tPresupuesto>parseFloat(($('.allPA').text().split('$').join('')).split(',').join('')) )//validar si la suma total de los ingreso por cada articulo es menor al presupuesto total del mes
	{
		
		
		$('.me').html('<div class="mensajeInformativo">El presupuesto local no deve de ser mayor a $'+(parseFloat(($('.allPA').text().split('$').join('')).split(',').join('')).formatMoney(6, '.', ',')).toString()+'.</div>');
		$('.mensajeInformativo').fadeOut(15000);
		
	}else
	if(tPresupuesto< parseFloat($('.tpli').text())  )
	{
		$('.me').html('<div class="mensajeInformativo">El presupuesto local no deve de ser menor a $'+(parseFloat($('.tpli').text()).formatMoney(6, '.', ',')).toString()+'.</div>');
		$('.mensajeInformativo').fadeOut(15000);
	}/*else
	 if(allV>100)//validar si el total de % de variable es mayor al 100%
    {
		 $('.me').html('<div class="mensajeInformativo">El porcentaje total  Variable pasa del 100%.</div>');
		$('.mensajeInformativo').fadeOut(15000);
	}*/
	else 
	{
	
    if(confirm("Deseas guardar y modificar los  " +($('.rppm').text()).toLowerCase()+"?"))
	{	
	 
		$.ajax(
	{
		type:'post',
		 url:'../Php_Scripts/s_accionesParticipacionPorSegmento.php',
		data:'id_margenBaseEnc='+$('#idmbenc').text()+'&bandera='+10,
		dataType:"json",
		beforeSend: function(response)
		{
			//desabilitar botones
			$('#btnAgregarNuevoDetalleDP,#btnModificarDetalladosBaseDet').hide();
			//desabilitar botones
			$('.me').text("");
			
			$('.loadF').show();
			
		},success: function(response)
		{
		
			
			if(response.respuesta=="si")
			{
		$('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) {
		  var claseA=$(this).attr('id').substr(18,$(this).attr('id').length); //clase articulo
		  idTabla=$(this).attr('id');
		  
		  $('#'+idTabla+' >tbody>tr ').each(function(index, element) {
            	
	        tipoInfo=$(this).attr('tipoinfo');
			nta=$(this).find("td").eq(2).text()//tipo articulo
		    m=$(this).find("td").eq(3).text()//marca
			idm=$(this).find("td").eq(3).attr('id').substr(5,$(this).find("td").eq(3).attr('id').length) //id marca
			ng=$(this).find("td").eq(4).text()//nombre genero
			idng=$(this).find("td").eq(4).attr('id').substr(6,$(this).find("td").eq(4).attr('id').length)// id genero
		    nfam=$(this).find("td").eq(5).text()//nombre familia
			idfam=$(this).find("td").eq(5).attr('id').substr(7,$(this).find("td").eq(5).attr('id').length) //id familia
			pCalculado=((pCalculado=($(this).find("td").eq(6).text()).split('%').join('')));//porcentaje calculado
		    pVariable=((($(this).find("td").eq(7).text()).split('%').join(''))); // porcentaje variable
			integracioDeVentaIngreso=parseFloat(($(this).find("td").eq(8).text()).split(',').join(''));//integracion  de venta ingreso 
			p=parseInt($(this).find("td").eq(9).text().split(',').join(''))//piezas
		    inversionPT=parseFloat($(this).find("td").eq(10).text().split(',').join(''))//inversion de costo pt
		    ctoPromUnitPT=parseFloat($(this).find("td").eq(11).text().split(',').join('')); // costo promedio unitario pt
		    inversionTP=parseFloat($(this).find("td").eq(12).text().split(',').join(''));//inversion de costo tienda
		    ctoPromUnitTP=parseFloat($(this).find("td").eq(13).text().split(',').join(''));// costo promedio unitario de tienda
			

		$.ajax(
	{
		type:'post',
	    url:'../Php_Scripts/s_accionesParticipacionPorSegmento.php',
		data:'&bandera='+9+'&cmbPlaza='+plaza+'&cmbTipoArticulo='+nta+'&cmbClaseArticulo='+claseA+'&idGenero='+idng+'&cmbGenero='+ng+'&idFamilia='+ idfam+'&idMarca='+idm+'&txtFamilia='+nfam+'&cmbMarca='+m+'&txtCalculadoP='+pCalculado+'&txtVariableP='+pVariable+'&txtIngresoVenta='+integracioDeVentaIngreso+'&txtPiezas='+p+'&txtInversionPT='+inversionPT+'&txtCtoPromUni='+ctoPromUnitPT+'&txtInversionCTP='+inversionTP+'&txtCtoPromUniCTP='+ ctoPromUnitTP+'&cmbMesesIni='+$('#m').text()+'&cmbAEvaluacion='+$('#anno').text()+'&txtTotalPA='+($('.allPA').text().split("$").join('')).split(',').join('')+'&id_margenBaseEnc='+$('#idmbenc').text()+'&tipoInfo='+tipoInfo+'&cmbEmpresasAE='+idEmpresa,
		dataType:"json",
		success: function(response)
		{
			nnAjax++;
			
			
      
			  if(response.respuesta=='si' && nnAjax==nAjax)
			  {
				  $('.loadF').hide();
				  $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				  $('.mensajeSatisfactorio').fadeOut(15000);
				 
			 //hailitar botones
			$('#btnAgregarNuevoDetalleDP,#btnModificarDetalladosBaseDet').show();
			//habilitar botones
				 
                /************************************cargar Listado***********************************************************/
var ano=$('#cmbAListaPPS option:selected').val();//obtener año actual
$.ajax({
		type:'post',
		dataType:"json",
		 url:"../Php_Scripts/s_accionesParticipacionPorSegmento.php",
		 data:'bandera='+1+'&year='+ano,
		 beforeSend: function(response)
		 {
			$('.loadF').show();
			
		 },success: function(response)
		 {     
		     $('.loadF').hide();
			 if(response.respuesta=="si"){
			
			 $('#accordionListaPPS').html(response.contenidoTabla);
			
			 if(response.fo!="nr"){
		       
			$('#accordionListaPPS').accordion();
		     $('#accordionListaPPS').accordion("refresh");
			 crearDataTablePPS();
			 }else
			 {
				 $('.loadF').hide();
				 $('.me').html('<div class="mensajeDeError">No se encontraron registros.</div>');
				 $('.mensajeDeError').fadeOut(15000);
			 }
			
			 
			 }
			 
		 },
		 error: function(response)
		 {
			 $('.loadF').hide();
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		 }
	});
				/************************************cargar Listado***********************************************************/
			 
				  
			  }else if(response.respuesta=='no')
			  {
				  $('.loadF').hide();
				  $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				  $('.mensajeInformativo').fadeOut(15000);
				  //hailitar botones
			$('#btnAgregarNuevoDetalleDP,#btnModificarDetalladosBaseDet').show();
			//habilitar botones
			
							   
			  }
			
		},error: function(response)
		{
			$('.loadF').hide();
			
 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 //hailitar botones
			$('#btnAgregarNuevoDetalleDP,#btnModificarDetalladosBaseDet').show();
			//habilitar botones
										}
		
		
								})
			
        				});
		
	
			    });
	
				
			}else if(response.respuesta=='no')
			{
				$('.loadF').hide();
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				$('.mensajeInformativo').fadeOut(15000);
				 //hailitar botones
			$('#btnAgregarNuevoDetalleDP,#btnModificarDetalladosBaseDet').show();
			//habilitar botones
			
			}
		},error: function(response)
		{
			
			$('.loadF').hide();
 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
 //hailitar botones
			$('#btnAgregarNuevoDetalleDP,#btnModificarDetalladosBaseDet').show();
			//habilitar botones
 
		}
		
	})
	
	}	
	
	}
		
})



//cerrar ventana

$('#cVtnDetalladoParticipacion').click(function()
{
	$('#vtnDetalladoParticipacion').bPopup({
            speed: 650,
			onClose: function() { 
	              
				
				 
				  $('#cprPPS').find('table').remove();
				  $('.tpli').remove();
				   
				   },
            transition: 'slideDown'
			
        }).close();
	
})


/*ver detalles de participación*/

$(document).on('click','.verParticipacion',function()
{
	allPL=0;//variable para guardar el total presupuesto local
	PPAAV=0; //variable para guardar el % permitido variable
	PPAAC=0;  //variable para guardar el % permitido calculado
	var id_MargenBaseEnc=$(this).closest('table tr').attr('id'); //id de la tabla 
	var mesIni=$(this).closest('table tr').find('td').eq(0).text(); //numero mes a consultar
	var nombreDePlaza=$(this).closest('table tr').find('td').eq(0).attr('id');
	var nombreMes=$(this).closest('table tr').find('td').eq(1).text(); //nombre de mes a consultar
	var pam=$(this).closest('table tr').find('td').eq(1).attr('plaza');// id de plaza a modificar 
	var ano=$(this).closest('table tr').find('td').eq(2).attr('ano');
	var idempresa=$(this).closest('table tr').find('td').eq(6).attr('empresa');
	var empresa=$(this).closest('table tr').find('td').eq(6).text();
	var estado=$(this).closest('table tr').find('td').eq(7).text();		
	
				  
	  $.ajax({
					   type:'post',
					   url:'../Php_Scripts/s_accionesParticipacionPorSegmento.php',
					   dataType:"json",
					   data:'id_margenBaseEnc='+id_MargenBaseEnc+'&bandera='+8+'&cmbMesesIni='+mesIni,
					   beforeSend: function(response)
					   {
						   $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
					    }
			                               });
					   },
					   success: function(response)
					   { 
					 
					
				
						  $('#loader').bPopup().close();
						  
						   if(response.respuesta=='si')
						   {
							   $('#empresa').text(idempresa);
							   $('#pam').text(pam);
						       $('#idmbenc').text(id_MargenBaseEnc);
							   $('#anno').text(ano);
							   $('#m').text(mesIni);
						       $('#cmbClaseArticulo').html(response.contenidoDeCmbArticulo); //cargar clases de articulos a combobox
					           $('.rppm').text("RESULTADOS DE " +nombreDePlaza+ " EMPRESA "+empresa +" PARTICIPACIÓN DEL MES DE "+ nombreMes.toUpperCase() +' '+  ano);
							   $('#contenedorTablaDetalles').html(response.contenidoTablaPPS);
							   $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				               $('.mensajeSatisfactorio').fadeOut(15000);
							  
								
								
							/*sacar total presupuesto local*/
								
									 if($('#contenedorTablaDetalles').find('table').length>0)
	 {
		 $('#contenedorTablaDetalles').find('table').each(function(index, element) {
         
		    var idTabla=$(this).attr('id');
		
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		 allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));//total presupuesto local
		 
        });
		
    });
	 }/*sacar total presupuesto local*/
	 
	 
	 
	 
	 //sacar porcentaje total permitido para agregar
	 PPAAV=100-(parseFloat(response.allV));
	 PPAAC=100-(parseFloat(response.allC));
	//sacar porcentaje total permitido para agregar
								
	
	$('#cprPPS').append('<span class="tpli" style="display:none;">'+allPL+'</span><table class="tablaDeResultados" width="100%" border="1" cellpadding="2"><thead><tr align="center"><td class="pintaAmarillo" >Total Presupuesto Autorizado</td><td class="pintaIngresos">Total Presupuesto Local</td><td class="pintarNegro">Total % Calculado</td><td class="allPPC">% Pendiente Por Agregar</td> <td class="pintarAnaranjado">Total % Varible</td> <td class="allPPV">% Permitido Variable</td> </tr></thead><tbody><tr align="center"> <td class="pintar-td-titulos-gris-bajo" title="Total Presupuesto Autorizado."><span class="allPA">$'+response.allP+'</span></td><td class="pintar-td-titulos-gris-bajo" title="Total Presupuesto Local."><span class="allPL">$'+allPL.formatMoney(6, '.', ',')+'</span></td> <td class="pintar-td-titulos-gris-bajo" title="Total % Calculado."><span class="allTC" >'+response.allC.formatMoney(6, '.', ',')+'%</span></td><td title="Porcentaje Permitido Calculado." class="pintar-td-titulos-gris-bajo"><span class="PPAAC">'+PPAAC.formatMoney(6, '.', ',')+'%</span></td><td class="pintar-td-titulos-gris-bajo"  title="Total % Variable."><span class="allTV" >'+response.allV.formatMoney(6, '.', ',')+'%</span></td><td class="pintar-td-titulos-gris-bajo" title="Porcentaje Permitido Variable."><span class="PPAAV">'+PPAAV.formatMoney(6, '.', ',')+'%</span></td></tr> </tbody></table><table class="table" width="100%" align="center" id="tBuscarDetallados"><tr align="center"><td colspan="4" style="font-size:18px; background-color:#F0F0F0;">Filtros De Busqueda</td></tr><tr align="center" style="background-color:#D6EBF5;"><td><label for="cmbFiltroA" style=" font-size:12px; font-weight:bold;">Seleccione La Clase Articulo A Filtrar</label></td><td><select id="cmbFiltroA" name="cmbFiltroA" class="formulario-inputs-selects">'+response.contenidoDeCmbArticulo+'<option value="SELECCIONE UNA OPCION" selected="selected">Filtrar En Todas Las Clases De Articulos</option></select></td><td><label  for="txtDatoDetalladoFind" style=" font-weight:bold; font-size:12px;">Escribe El Dato A Buscar</label></td><td><input type="text" name="txtDatoDetalladoFind" id="txtDatoDetalladoFind" placeholder="Escribe el dato a buscar."  style="width:90%;" class="formulario-inputs"   /></td></tr></table>');
	


								
								 
								  /*agregar estilos a th de tablas*/
								    $('#contenedorTablaDetalles').find('table thead th').each(function(index, element) {
									$(this).css('width','90px');
                                    });
									
									$('#contenedorTablaDetalles,#cprPPS').find('table').each(function(index, element) {
										$(this).css('margin-top','40px');
                                    });
								/*agregar estilos a th de tablas*/
								
								/*agregar estilos a td*/
								$('#contenedorTablaDetalles').find('table').each(function(index, element) {
                                    
									idTabla=$(this).attr('id');
									
									$('#'+idTabla+' tbody tr').each(function(index, element) {
                                        
										
										if($(this).attr('tipoinfo')=='a')
										{
											$(this).find('td').each(function(index, element) {
                                                
												 $(this).css('background-color','#fde3bd');
                                            });
											
										}
										
										if($(this).attr('tipoinfo')=='n')
										{
											$(this).find('td').each(function(index, element) {
                                                
												  $(this).css('background-color','#bdf5fd');
                                            });
											
										}
										
                                    });
									
									
										
									
                                });
								
								
								/*agregar estilos a td*/
							
								/*abrir pop up*/			   
	$('.me').text("");
	$('#vtnDetalladoParticipacion').bPopup({
            speed: 650,
			onClose: function() { 
	              
				
				  
				  $('#cprPPS').find('table').remove();
				  $('.tpli').remove();
				   
				   },
            transition: 'slideDown'
			
        });
	/*abrir pop up*/	
				
				if(estado=='Inactivo')//verificar estado si esta inactivo o activo
					{
						
						$('#btnModificarDetalladosBaseDet').hide();
						$('#btnAgregarNuevoDetalleDP').hide();
						$('.eliminarDetallePPS').css('opacity','.5');
						$('.modificarDetallePPS').css('opacity','.5');
						$('.eliminarDetallePPS').attr('title','El detalle de la participación no se puede eliminar.');
						$('.modificarDetallePPS').attr('title','El detalle de la participación no se puede modificar.');
						$('.eliminarDetallePPS').removeAttr('class');
						$('.modificarDetallePPS').removeAttr('class');
						
					}else
					{
						$('#btnModificarDetalladosBaseDet').show();
						$('#btnAgregarNuevoDetalleDP').show()
					}

						   
						    
					   }else
					   {
						     
							    $('.me').html('<div class="mensajeInformativo">No se encontraron registros.</div>');
							    $('.mensajeInformativo').fadeOut(15000);
								alertt("¡No se encontraron registros!...");
								$('#btnReloadTablePPS').hide();
							   
						   
					   }
						   
						   
					  },error: function(response)
					   {
						    $('#loader').bPopup().close();
						    alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						   
					   }
					   
				   });
				   
				   
										
									
	
})	





/*mostrar mas contenido*/
$(document).on('click','.verMasAccion',function()
{   


    if($(this).attr('name')=="1")
	{
		alto=$(document).find('.ventanaDeAyuda').css('height');
		$(this).text("Ver menos contenido de ayuda..");
		$('.verMas').show();
		$(document).find('.ventanaDeAyuda').css('height','auto');
		$(this).attr('name','2');
		
		
		
	}else
	{
		$(this).text("Ver más contenido de ayuda..");
				
		$(document).find('.ventanaDeAyuda').css('height',alto)
		$('.verMas').hide();
		$(this).attr('name','1')
	}
})
	
/*mostrar mas contenido*/
	
/***evitar copiar pegar y cortar en cajas de texto***/	

	 $('#txtFechaInicial,#txtFechaFinal,#txtFechaRecepcion').bind("cut copy paste",function(e) {
	      e.preventDefault();
    });
/***evitar copiar pegar y cortar en cajas de texto***/	
	
	
	
	
	
//sacar parte decimal
	
//function sacarParteDecimal(num)
//{
	
	//var parteDecimal=(num.toString()).split(".")[1];
	//if(parteDecimal!=undefined)
	//{
		//return parteDecimal.length;
	//}
	//else
	//{
	//	return 2;
	//}
	
	
//}
	

/*funcion para formatear numeros*/
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
/*funcion para formatear numeros*/	
	
	


/*acciones pagina listaParticipacionSegmento.php y nuevaParticipacionSegmento.php */

/*cambiar th estilos de la tablas*/

/*cambiar th estilos de la tablas*/


/*Recargar tabla pps*/
$('#btnReloadTablePPS').click(function()
{
	if(confirm('¿Deseas cargar de nuevo los datos?\n Los cambios efectuados se perderan.')){
	/*quitar botones y tablas*/
				  $('#contenedorTablaDetalles').empty();
				  $('#lklAmpliarTablaRP').remove();
				  $('#lklAgregarNuevoDetalle').remove();
				  $('.tpli').remove();		
				  $('.rppm').empty(); 
				  $('.tablaDeResultados').remove();
				  $('#tBuscarDetallados').remove();
				  $('#btnGuardarPPS').remove(); 
				  $('.me').text("");
				    /*quitar botones y tablas*/
	
	
	                                allPL=0;//variable para guardar el total presupuesto local
								    PPAAV=0; //variable para guardar el % permitido variable
								    PPAAC=0;  //variable para guardar el % permitido calculado
	 $.ajax(
				   {
					   type:'post',
					   url:$('#frmSeleccionDeFiltrosPS').attr('action'),
					   dataType:"json",
					   data:$('#frmSeleccionDeFiltrosPS').serialize()+'&bandera='+4,
					   beforeSend: function(response)
					   {
						   $('#loader').bPopup({
			                   onClose: function() { response.abort();
							        
							    }
			                               });
					   },
					   success: function(response)
					   { 
					 
				
				
				         
						  $('#loader').bPopup().close();
						  
						   if(response.respuesta=='si')
						   {
							    
								
						        
						
						       $('#cmbClaseArticulo').html(response.contenidoDeCmbArticulo); //cargar clases de articulos a combobox
						        $('.rppm').text("RESULTADOS DE " + $('#cmbPlaza option:selected').text()+ " EMPRESA "+$('#cmbEmpresasAE option:selected').text() +" PARTICIPACIÓN DEL MES DE "+ ($('#cmbMesesIni option:selected').text()).toUpperCase()+$('#cmbAEvaluacion option:selected').val()+'.');
							   $('#contenedorTablaDetalles').html(response.contenidoTablaPPS);
							   $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				               $('.mensajeSatisfactorio').fadeOut(15000);
							   $('#cBotonAmpliarTablaRP').html('<span> <a href="#AmpliarTablaRP"  id="lklAmpliarTablaRP" class="butonDownStatusBar"><img src="Imagenes/Lupa.png" width="16" height="16" alt="lupa" /> Ampliar Tablas </a></span>&nbsp;&nbsp;&nbsp;<span><a   href="#nuevoDetalle" id="lklAgregarNuevoDetalle" class="butonDownStatusBar"><img src="Imagenes/add.png" width="16" height="16" alt="agregarNuevoDetalle" />Agregar Nuevo Detalle</a></span>&nbsp;&nbsp;&nbsp;<span><a id="btnGuardarPPS" href="#guardar" class="butonDownStatusBar"><img src="Imagenes/save_as.png" width="16" height="16" alt="Guardar">Guardar</a></span>');
								
								
								/*sacar total presupuesto local*/
								
									 if($('#contenedorTablaDetalles').find('table').length>0)
	 {
		 $('#contenedorTablaDetalles').find('table').each(function(index, element) {
         
		  var idTabla=$(this).attr('id');
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		  allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));//total presupuesto local
        });
		
    });
	 }/*sacar total presupuesto local*/
	 
	  //sacar porcentaje total permitido para agregar
	 PPAAV=100-(parseFloat(response.allV));
	 PPAAC=100-(parseFloat(response.allC));
	//sacar porcentaje total permitido para agregar
								
								
		$('#cprPPS').append('<span class="tpli" style="display:none;">'+allPL+'</span><table class="tablaDeResultados" width="100%" border="1" cellpadding="2"><thead><tr align="center"><td class="pintaAmarillo" >Total Presupuesto Autorizado</td><td class="pintaIngresos">Total Presupuesto Local</td><td class="pintarNegro">Total % Calculado</td><td class="allPPC">% Pendiente Por Agregar</td> <td class="pintarAnaranjado">Total % Varible</td> <td class="allPPV">% Permitido Variable</td> </tr></thead><tbody><tr align="center"> <td class="pintar-td-titulos-gris-bajo" title="Total Presupuesto Autorizado."><span class="allPA">$'+response.allP+'</span></td><td class="pintar-td-titulos-gris-bajo" title="Total Presupuesto Local."><span class="allPL">$'+allPL.formatMoney(6, '.', ',')+'</span></td> <td class="pintar-td-titulos-gris-bajo" title="Total % Calculado."><span class="allTC" >'+response.allC.formatMoney(6, '.', ',')+'%</span></td><td title="Porcentaje Permitido Calculado." class="pintar-td-titulos-gris-bajo"><span class="PPAAC">'+PPAAC.formatMoney(6, '.', ',')+'%</span></td><td class="pintar-td-titulos-gris-bajo"  title="Total % Variable."><span class="allTV" >'+response.allV.formatMoney(6, '.', ',')+'%</span></td><td class="pintar-td-titulos-gris-bajo" title="Porcentaje Permitido Variable."><span class="PPAAV">'+PPAAV.formatMoney(6, '.', ',')+'%</span></td></tr> </tbody></table><table class="table" width="100%" align="center" id="tBuscarDetallados"><tr align="center"><td colspan="4" style="font-size:18px; background-color:#F0F0F0;">Filtros De Busqueda</td></tr><tr align="center" style="background-color:#D6EBF5;"><td><label for="cmbFiltroA" style=" font-size:12px; font-weight:bold;">Seleccione La Clase Articulo A Filtrar</label></td><td><select id="cmbFiltroA" name="cmbFiltroA" class="formulario-inputs-selects">'+response.contenidoDeCmbArticulo+'<option value="SELECCIONE UNA OPCION" selected="selected">Filtrar En Todas Las Clases De Articulos</option></select></td><td><label  for="txtDatoDetalladoFind" style=" font-weight:bold; font-size:12px;">Escribe El Dato A Buscar</label></td><td><input type="text" name="txtDatoDetalladoFind" id="txtDatoDetalladoFind" placeholder="Escribe el dato a buscar."  style="width:90%;" class="formulario-inputs"   /></td></tr></table>');


								
								  /*agregar estilos a th de tablas*/
								    $('#op2').find('table thead th').each(function(index, element) {
									$(this).css('width','90px');
                                    });
									
									$('#op2').find('table').each(function(index, element) {
										$(this).css('margin-top','20px');
                                    });
								/*agregar estilos a th de tablas*/
								
							
								
									

						   
						    
					   }else
					   {
						     
							    $('.me').html('<div class="mensajeInformativo">No se encontraron registros.</div>');
							    $('.mensajeInformativo').fadeOut(15000);
							   
						   
					   }
						   
						   
					  },error: function(response)
					   {
						    $('#loader').bPopup().close();
						    alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
						   
					   }
					   
				   })
				   				   
	}
})
/*Recargar tabla pps*/


/*Eliminar Detalle de tabla participación*/

$(document).on('click','.eliminarDetallePPS',function()

{          
  if(confirm('Deseas Eliminar El Detalle De La Participación?')){
	  $('.me').html('<div class="mensajeSatisfactorio">Detalle Eliminado.</div>');
		 $('.mensajeSatisfactorio').fadeOut(15000);
      allC=0;//igualar a 0 vg
	  allV=0;//igualar a 0 vg  
	  allPL=0;//igualar a 0    
	  PPAAV=0;   
	  PPAAC=0;                                
	  var idTabla=$(this).closest('table').attr('id'); //id de la tabla 
	  var claseArticulo=idTabla.substr(18,idTabla.length);//variable que guarda el tipo articulo en el cual se dio clic esto se obtiene del id de la tabla.
      var idFila=$(this).closest('tbody tr').attr('class');//id de fila a eliminar

	  var nc=0; //variable que almacena el nuevo calculado
	  var nv=0; //variable que almacena el nuevo variable
	  var ntiv=0; //variable que almacena el nuevo total ingreso de venta
	  var ntp=0;  //variable que guarda el nuevo total de piezas
	  var nictp=0;//variable que guarda la nueva inversion de costo Pt
	  nctpi=0; //variable para calcular nueva inversion de tienda promedio
	  $('.'+idFila).remove();//eliminar fila en la que se dio clic
	  
	 
	  
	  /*recorrer tabla en la que se desea recalcular datos*/
	  
	  $('#' +idTabla+' tbody tr').each(function(index, element) {
        
	
		nc+=parseFloat($(this).find('td').eq(6).text().split('%').join('')); //calcular nuevo total calculado
		nv+=parseFloat($(this).find('td').eq(7).text().split('%').join('')); // calcular nuevo total variable
		ntiv+=parseFloat(($(this).find('td').eq(8).text().split(',').join(''))); //calcular nuevo total ingreso de venta
		ntp+=parseInt($(this).find('td').eq(9).text().split(',').join(''));//calcular nuevo total de piezas
		nictp+=parseFloat(($(this).find('td').eq(10).text()).split(',').join('')); //calcular nuevo ingreso costo pt 
		nctpi+=parseFloat(($(this).find('td').eq(12).text()).split(',').join(''));//calcular inversion de tienda
		
		 
	
    });
	
	
	  
	 /*cargar nuevos totales*/
	 $('.totalCalculado'+claseArticulo).text(nc.formatMoney(6, '.', ','));
	 $('.totalVariable'+claseArticulo).text(nv.formatMoney(6, '.', ','));
	 $('.totalIngreso'+claseArticulo).text(ntiv.formatMoney(6, '.', ','));
	 $('.totalPiezas'+claseArticulo).text(ntp.formatMoney(6, '.', ','));
	 $('.totalInversion'+claseArticulo).text(nictp.formatMoney(6, '.', ','));
	 $('.totalInversionTDA'+claseArticulo).text(nctpi.formatMoney(6, '.', ','));
	 /*cargar nuevos totales*/
	 
	 
	 //sumar porcentajes de total calculado y total variable
	 
	 if($('#contenedorTablaDetalles').find('table').length>0)
	 {
		 
		 
		 $('#contenedorTablaDetalles').find('table').each(function(index, element) {
         
		  idTabla=$(this).attr('id');
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		  allC+=parseFloat(($(this).find("td").eq(2).text().split('%').join('')));
		  allV+=parseFloat(($(this).find("td").eq(3).text().split('%').join('')));
		  allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));
		  
		  
        });
		
    });
	 }
	 
	 if($('#contentToCopyAmpliadoDeTablaRp').find('table').length>0)
	 {
		  $('#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) {
         
		  idTabla=$(this).attr('id');
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		  allC+=parseFloat(($(this).find("td").eq(2).text().split('%').join('')));
		  allV+=parseFloat(($(this).find("td").eq(3).text().split('%').join('')));
		  allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));
		 
        });
		
    });
	 }
	 
	    
		
	 
	    //sacar porcentaje permitido para agregar

	    PPAAC=100-allC;
	    PPAAV=100-allV;
	 //sacar porcentaje permitido para agregar	
	
	  
	 
	  
	
	
     //sumar porcentajes de total calculado y total variable
	  
	  
	//poner porcentajes y total 
	$('.allTC').text(allC.toFixed(6)+'%');
	$('.allTV').text(allV.toFixed(6)+'%');
	$('.allPL').text('$'+allPL.formatMoney(6, '.', ','));
	$('.PPAAV').text(PPAAV.toFixed(6)+'%');
	$('.PPAAC').text(PPAAC.toFixed(6)+'%');
	//poner porcentajes y total 
	
  }
	
})




/*Eliminar Detalle de tabla participación*/





/*sacar costo tienda promedio*/
$(document).on('keyup keydown','#txtCtoPromUniCTP',function(event)
{
	if(event.keyCode>=48 && event.keyCode<=57 || event.keyCode>=96 &&  event.keyCode<=105  ||  event.keyCode==8 && $(this).val().length>0){
		 
	if($('#txtPiezas').val().length>0 && $.isNumeric($(this).val()) && $.isNumeric($('#txtPiezas').val()))
	{
		
		costoTPInversion=(parseInt($('#txtPiezas').val()))*(parseFloat($(this).val()));
		$('#txtInversionCTP').val(costoTPInversion.toFixed(6));
	}
	}
	
	if($(this).val().length==0)
	{
		$('#txtInversionCTP').val("");
	}
	
})



/*sacar costo inversion pt*/


$(document).on('keyup change keydown','#txtPiezas',function(event)
{
	
	/*event.keyCode!=9 && event.keyCode!=32 && event.keyCode!=37 && event.keyCode!=39*/
	if(event.keyCode>=48 && event.keyCode<=57 || event.keyCode>=96 &&  event.keyCode<=105  ||  event.keyCode==8 && $(this).val().length>0 ){//validacion que no permite que se ejecutela operacion si se presionan la tecla TAB,<-,-> y Barra Espaciadora 
	
	if( $('#txtCtoPromUniCTP').val().length>0 && $.isNumeric($(this).val()) && $.isNumeric($('#txtCtoPromUniCTP').val())   )
	{
		costoPTInversion=(parseInt($(this).val()))*(parseFloat($('#txtCtoPromUniCTP').val()));
		$('#txtInversionCTP').val(costoPTInversion.toFixed(6));
	}
	
	
	
	if($(this).val().length>0 && $('#txtCtoPromUni').val().length>0 && $.isNumeric($(this).val()) && $.isNumeric($('#txtCtoPromUni').val())  )
	{
		costoPTInversion=(parseInt($(this).val()))*(parseFloat($('#txtCtoPromUni').val()));
		$('#txtInversionPT').val(costoPTInversion.toFixed(6));
	}
	
	
	}
	
	if($(this).val().length==0)
	{
		$('#txtInversionCTP').val("");
	}
	if($(this).val().length==0)
	{
		$('#txtInversionPT').val("");
	}
})


$(document).on('keyup keydown','#txtCtoPromUni',function(event)
{
	if(event.keyCode>=48 && event.keyCode<=57 || event.keyCode>=96 &&  event.keyCode<=105  ||  event.keyCode==8 && $(this).val().length>0 ){
	if($('#txtPiezas').val().length>0 && $.isNumeric($(this).val()) && $.isNumeric($('#txtPiezas').val())   )
	{   
	  
		costoPTInversion=(parseInt($('#txtPiezas').val()))*(parseFloat($(this).val()));
		$('#txtInversionPT').val(costoPTInversion.toFixed(6));
	}
	}
	if($(this).val().length==0)
	{
		$('#txtInversionPT').val("");
		
	}
 
})



/*sacar costo inversion*/




/*tareas y sumas de detalles*/

$('#txtCalculadoP').keyup(function(e) //calcular total calculado la precionar la tecla
{
	/*var op=0;
	var pCalculado=parseFloat($('#txtCalculadoP').val());
	/************************************/
	  //op= (totalCalculado + pCalculado)-(parseFloat(totalCalculadoModificar))
	  
	
	/************************************/
    //if($('#textoVentanaDetalladoPPS').text()!="Agregar Nuevo Detalle"){
	 //if($(this).val().replace(/ /g, '') != '' && e.keyCode!=9    ){
     //if($.isNumeric($(this).val())){ 
	   
	  //$('.totalCalculadoD').text(op.formatMoney(6, '.', ','));
	 //}
	//}else
	//{
		//$('.totalCalculadoD').text($('.totalCalculado'+$('#cmbClaseArticulo option:selected').val()).text());
	//	$(this).val(0);
		
	//}
	
	
	//}
	
})

/////////////////////////////////////////////////
$(document).on('keyup keydown','#txtVariableP',function(event)//////calcular total ingreso y total variable al precionar la tecla txtVariableP
{     
         
   
     var nPiezas=0;
     var ingresoIV=0; //totalIngreso 
	 var  op=0;
	 var pVariable=parseFloat($('#txtVariableP').val());
	
	 if($(this).val().replace(/ /g, '') != '' && event.keyCode!=9 && event.keyCode!=32 && event.keyCode!=37 && event.keyCode!=39 ){
     if($.isNumeric($(this).val())){ 
	
	 if($('#textoVentanaDetalladoPPS').text()=='Modificar Detalle' )
	 {
		 
	  if(parseFloat(totalVariableCal)!=pVariable){
	  op=(totalCalculadoV + pVariable);
	  }
	  else
	  {
		  op=(totalCalculadoV + pVariable)-(parseFloat(totalVariableCal));
	  }
	  ingresoIV=(pVariable/100)* totalPresupuesto;
	  $('#txtIngresoVenta').val(ingresoIV);  
	  $('.totalVariableD').text(op.formatMoney(6, '.', ','));
	  nPiezas=(ingresoIV/costoXPiezas);   
	  $('#txtPiezas').val(Math.round(parseFloat(nPiezas)));
	  $('#txtPiezas').change();
		  
	     
	
	/************************************/
	 }
	 else
	 { 
     /************************************/
	  op= totalCalculadoV + pVariable;
	  ingresoIV=(pVariable/100)* totalPresupuesto;
	  $('#txtIngresoVenta').val(ingresoIV);
	 
	  $('.totalVariableD').text(op.formatMoney(6, '.', ','));
	 
	/************************************/
	 }
	 }
	}
	
	if($('#txtVariableP').val().length==0)
	{
		 $('.totalVariableD').text($('.totalVariable'+$('#cmbClaseArticulo option:selected').val()).text());
		 $('#txtIngresoVenta').val(0);
		 if($('#textoVentanaDetalladoPPS').text()=='Modificar Detalle' && $('#txtVariableP').val().length==0)
		 {
		 $('#txtPiezas').val(0);
		 }
	
		 
	 
		
	}

})





//cambiar totales en la ventana de nuevo detalle
$('#cmbClaseArticulo').change(function()
{
	var tabla=$('#cmbClaseArticulo option:selected').val();
	 /*limpiar cajas de texto*/
	    $('#txtFamilia').val("");
		$("#txtCtoPromUni").val("");
		$("#txtCtoPromUniCTP").val("");
		$("#txtCalculadoP").val("");
		$("#txtVariableP").val("");
		$("#txtPiezas").val("");
		
		$('#txtInversionPT').val("");
		$('#txtInversionCTP').val("");
		$('#txtIngresoVenta').val("");
	 /*limpiar cajas de texto*/
	
	    $('.mee').text("");
		$('input').removeClass("formulario-inputs-alert");
		
	    $('.totalPresupuestoD').text($('.totalPresupuestoD').text());
		$('.totalCalculadoD').text($('.totalCalculado'+tabla).text());
		$('.totalVariableD').text($('.totalVariable'+tabla).text());
		totalCalculadoV=parseFloat($('.totalVariableD').text());//igualar variable total calculado al valor cargado
		$('#txtCalculadoP').val(0);
	  
		
});




//agregar nuevo detalle a tabla

$('#lklAgregarNuevoDetalleVNuevoDetalleRp').click(function()
{
	
	$('input').removeClass("formulario-inputs-alert");
	var tipoDeAccion=$(this).val();
	allC=0;
	allV=0;
	allPL=0;
	PPAAV=0;
	PPAAC=0;
	
	if(tipoDeAccion==1){//agregar nuevo detalle
		$.ajax(
	{
		type:'post',
		url:$('#frmAgregarDetalle').attr('action'),
		data:$('#frmAgregarDetalle').serialize()+'&bandera='+5+'&totalVariableD='+$('.totalVariableD').text(),
		dataType:"json",
		beforeSend: function(response)
		{
			$('#loaderDetalleNuevoPS').show();
			$('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',true);
			
			
		},success: function(response)
		{
			       
					$('#loaderDetalleNuevoPS').hide();
			
			  if(response.respuesta=='si')
			  {
				   
				  /*limpiar caja de %participacion e ingreso venta*/
				  $('#txtVariableP').val("");
				  $('#txtIngresoVenta').val("");
				  /*limpiar caja de %participacion*/
				  $('.mee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				  $('.mensajeSatisfactorio').fadeOut(15000);
				  $('.'+response.NombreDeTabla).append(response.contenidoTablaD);//agregar fila a tabla
				  $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').eq(0).html('<img src="Imagenes/1401999563_New.png" width="16" height="16" title="Nuevo Detalle Agregado Por El Usuario." alt="Nuevo Detalle." />');              
				  $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').eq(1).text("NDAU");
				  $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').eq(1).attr('title','Nuevo Detalle Agregado Por El Usuario.');
				   $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').each(function(index, element) {
                       $(this).css('background-color','#bdf5fd');
                    });
					 $('.'+response.NombreDeTabla + ' tbody tr:last').attr('tipoinfo','n');
				  //agregar clase a la ultima fila agregada
				  $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',false);
				   
				  //**********************************************************actualizar totales en tabla*******************************************************//
				  
	                 var idTabla='tRPSReporteFiltros'+response.NombreDeTabla; //id de la tabla 
					 
	  
	                  var nc=0; //variable que almacena el nuevo calculado
	                  var nv=0; //variable que almacena el nuevo variable
	                  var ntiv=0; //variable que almacena el nuevo total ingreso de venta
	                  var ntp=0;  //variable que guarda el nuevo total de piezas
	                  var nictp=0;//variable que guarda la nueva inversion de costo Pt
	                  nctpi=0; //variable para calcular nueva inversion de tienda promedio

	  
	 
	  
	  
	          $('#'+idTabla+ ' tbody tr').each(function() {
        
        
	                     nc+=parseFloat($(this).find('td').eq(6).text().split('%').join('')); //calcular nuevo total calculado
		                 nv+=parseFloat($(this).find('td').eq(7).text().split('%').join('')); // calcular nuevo total variable
		                 ntiv+=parseFloat(($(this).find('td').eq(8).text().split(',').join(''))); //calcular nuevo total ingreso de venta
		                 ntp+=parseInt($(this).find('td').eq(9).text().split(',').join(''));//calcular nuevo total de piezas
		                 nictp+=parseFloat(($(this).find('td').eq(10).text()).split(',').join('')); //calcular nuevo ingreso costo pt 
		                 nctpi+=parseFloat(($(this).find('td').eq(12).text()).split(',').join(''));//calcular inversion de tienda
		
		 
	
                     });
	  
	            /*cargar nuevos totales*/
	            $('.totalCalculado'+response.NombreDeTabla).text(nc.formatMoney(6, '.', ','));
                $('.totalVariable'+response.NombreDeTabla).text(nv.formatMoney(6, '.', ','));
	            $('.totalIngreso'+response.NombreDeTabla).text(ntiv.formatMoney(6, '.', ','));
	            $('.totalPiezas'+response.NombreDeTabla).text(ntp.formatMoney(6, '.', ','));
	            $('.totalInversion'+response.NombreDeTabla).text(nictp.formatMoney(6, '.', ','));
	            $('.totalInversionTDA'+response.NombreDeTabla).text(nctpi.formatMoney(6, '.', ','));
	            /*cargar nuevos totales*/
			   $('.totalVariableD').text($('.totalVariable'+response.NombreDeTabla).text());//actualizar texto en ventana detallado
			   totalCalculadoV=parseFloat($('.totalVariableD').text());//igualar variable total calculado al valor cargado

	  
				  
 //**********************************************************actualizar totales en tabla*******************************************************//
 
 
  //sumar porcentajes de total calculado y total variable
	 
	 if($('#contenedorTablaDetalles').find('table').length>0)
	 {
		 $('#contenedorTablaDetalles').find('table').each(function(index, element) {
         
		  idTabla=$(this).attr('id');
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		  allC+=parseFloat(($(this).find("td").eq(2).text().split('%').join('')));
		  allV+=parseFloat(($(this).find("td").eq(3).text().split('%').join('')));
		  allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));
        });
		
    });
	 }
	 
	 if($('#contentToCopyAmpliadoDeTablaRp').find('table').length>0)
	 {
		  $('#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) {
         
		  idTabla=$(this).attr('id');
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		  allC+=parseFloat(($(this).find("td").eq(2).text().split('%').join('')));
		  allV+=parseFloat(($(this).find("td").eq(3).text().split('%').join('')));
		  allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));
        });
		
    });
	 }
	 
	 //sacar porcentaje permitido para agregar

	  PPAAC=100-allC;
	  PPAAV=100-allV;
	 //sacar porcentaje permitido para agregar		
		
     //sumar porcentajes de total calculado y total variable
	  
	  
	//poner porcentajes 
	$('.allTC').text(allC.toFixed(6)+'%');
	$('.allTV').text(allV.toFixed(6)+'%');
	$('.allPL').text('$'+allPL.formatMoney(6, '.', ','));
	$('.PPAAV').text(PPAAV.toFixed(6)+'%');
    $('.PPAAC').text(PPAAC.toFixed(6)+'%');
	
	//poner porcentajes 
	//sumar porcentajes de total calculado y total variable			 
			  }else
			  {
				    
				  $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',false);
				  if(response.fo=="txtFamilia")
				  {
					   $('#txtFamilia').focus();
							$('#txtFamilia').addClass("formulario-inputs-alert");
							$('#txtFamilia').keyup(function()
							{
								$('#txtFamilia').removeClass("formulario-inputs-alert");
								
								$('.mee').text("");
							})
				  }else if(response.fo=="txtIngresoVenta")
				  {
					   $('#txtVariableP').focus();
							$('#txtIngresoVenta').addClass("formulario-inputs-alert");
							$('#txtVariableP').keyup(function()
							{
								
								$('#txtIngresoVenta').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
							
							alert('Escribe el % Variable de nuevo.');
				  }
				  else if(response.fo=='txtInversionPT')
				  {
					  $('#txtCtoPromUni').focus();
							$('#txtInversionPT').addClass("formulario-inputs-alert");
							$('#txtCtoPromUni').keyup(function()
							{
								$('#txtInversionPT').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					  alert("Escribe de nuevo el costo promedio unitario.");
				  }
				  else if(response.fo=="txtInversionCTP")
				  {
					    $('#txtCtoPromUniCTP').focus();
							$('#txtInversionCTP').addClass("formulario-inputs-alert");
							$('#txtCtoPromUniCTP').keyup(function()
							{
								$('#txtInversionCTP').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					  alert("Escribe de nuevo el costo promedio unitario de tienda.");
				  }
				   else  if(response.fo=='txtVariableP')
					 {    
						    $('#txtVariableP').focus();
							$('#txtVariableP').addClass("formulario-inputs-alert");
							$('#txtVariableP').keyup(function()
							{
								$('#txtVariableP').removeClass("formulario-inputs-alert");
								$('#txtIngresoVenta').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 
						 
					 }else if(response.fo=='txtPiezas')
					 {
						   $('#txtPiezas').focus();
							$('#txtPiezas').addClass("formulario-inputs-alert");
							$('#txtPiezas').keyup(function()
							{
								$('#txtPiezas').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 } else if(response.fo=='txtCtoPromUni')
					 {
						   $('#txtCtoPromUni').focus();
							$('#txtCtoPromUni').addClass("formulario-inputs-alert");
							$('#txtCtoPromUni').keyup(function()
							{
								$('#txtCtoPromUni').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 }else if(response.fo=="txtCtoPromUniCTP")
					 {
						  $('#txtCtoPromUniCTP').focus();
							$('#txtCtoPromUniCTP').addClass("formulario-inputs-alert");
							$('#txtCtoPromUniCTP').keyup(function()
							{
								$('#txtCtoPromUniCTP').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 }
					
				   
				               $('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
							    
							   
			  }
			
		},error: function(response)
		{
			
			 $('#loaderDetalleNuevoPS').hide();
			 $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',false);
 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		}
		
		
	})

	}else//modificar datos de detalle
	{
		
		$.ajax(
	{
		
		type:'post',
		url:$('#frmAgregarDetalle').attr('action'),
		data:$('#frmAgregarDetalle').serialize()+'&bandera='+6+'&totalVariableD='+$('.totalVariableD').text()+'&txtFila='+$('#txtFila').val()+'&cmbClaseArticulo='+$('#cmbClaseArticulo option:selected ').val()+'&totalCalculadoD='+$('.totalCalculadoD').text(),
		dataType:"json",
		beforeSend: function(response)
		{
			$('#loaderDetalleNuevoPS').show();
			$('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',true);
			
			
		},success: function(response)
		{
			       
					$('#loaderDetalleNuevoPS').hide();
					
			
			  if(response.respuesta=='si')
			  {
				   
				  
				  $('.mee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				  $('.mensajeSatisfactorio').fadeOut(15000);
				  $('#tRPSReporteFiltros'+response.NombreDeTabla).find('.'+$('#txtFila').val()).remove();
				  $('.'+response.NombreDeTabla).append(response.contenidoTablaD);//agregar fila a tabla
				  $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',false);
				  $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').eq(0).html('<img src="Imagenes/1402001444_gtk-refresh.png" width="16" height="16" title="Detalle Modificado Por El Usuario."  alt="Detalle Modificado." />');
				  $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').eq(1).text("DMU");
				   $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').eq(1).attr('title','Detalle Modificado Por El Usuario.');
				    $('.'+response.NombreDeTabla + ' tbody tr:last').attr('tipoinfo','a');
				     $('.'+response.NombreDeTabla + ' tbody tr:last').find('td').each(function(index, element) {
                        $(this).css('background-color','#fde3bd');
                    });
				   
				   
				  //**********************************************************actualizar totales en tabla*******************************************************//
				  
	                 var idTabla='tRPSReporteFiltros'+response.NombreDeTabla; //id de la tabla 
					 
					
	  
	                  var nc=0; //variable que almacena el nuevo calculado
	                  var nv=0; //variable que almacena el nuevo variable
	                  var ntiv=0; //variable que almacena el nuevo total ingreso de venta
	                  var ntp=0;  //variable que guarda el nuevo total de piezas
	                  var nictp=0;//variable que guarda la nueva inversion de costo Pt
	                  nctpi=0; //variable para calcular nueva inversion de tienda promedio

	  
	 
	  
	  
	                    $('#'+idTabla+ ' tbody tr').each(function() {
        
                          
	                     nc+=parseFloat($(this).find('td').eq(6).text().split('%').join('')); //calcular nuevo total calculado
		                 nv+=parseFloat($(this).find('td').eq(7).text().split('%').join('')); // calcular nuevo total variable
		                 ntiv+=parseFloat(($(this).find('td').eq(8).text().split(',').join(''))); //calcular nuevo total ingreso de venta
		                 ntp+=parseInt($(this).find('td').eq(9).text().split(',').join(''));//calcular nuevo total de piezas
		                 nictp+=parseFloat(($(this).find('td').eq(10).text()).split(',').join('')); //calcular nuevo ingreso costo pt 
		                 nctpi+=parseFloat(($(this).find('td').eq(12).text()).split(',').join(''));//calcular inversion de tienda
		
		 
	
                     });
	  		
				/*cargar nuevos totales*/
	            $('.totalCalculado'+response.NombreDeTabla).text(nc.formatMoney(6, '.', ','));
                $('.totalVariable'+response.NombreDeTabla).text(nv.formatMoney(6, '.', ','));
	            $('.totalIngreso'+response.NombreDeTabla).text(ntiv.formatMoney(6, '.', ','));
	            $('.totalPiezas'+response.NombreDeTabla).text(ntp.formatMoney(6, '.', ','));
	            $('.totalInversion'+response.NombreDeTabla).text(nictp.formatMoney(6, '.', ','));
	            $('.totalInversionTDA'+response.NombreDeTabla).text(nctpi.formatMoney(6, '.', ','));
	            /*cargar nuevos totales*/
				
			  $('.totalVariableD').text($('.totalVariable'+response.NombreDeTabla).text());//actualizar texto en ventana detallado
			   totalCalculadoV=parseFloat($('.totalVariableD').text());//igualar variable total calculado al valor cargado

	  
				  
 //**********************************************************actualizar totales en tabla*******************************************************//
				 
				//sumar porcentajes de total calculado y total variable
	 
	 if($('#contenedorTablaDetalles').find('table').length>0)
	 {
		 $('#contenedorTablaDetalles').find('table').each(function(index, element) {
         
		  idTabla=$(this).attr('id');
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		  allC+=parseFloat(($(this).find("td").eq(2).text().split('%').join('')));
		  allV+=parseFloat(($(this).find("td").eq(3).text().split('%').join('')));
		  allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));
        });
		
    });
	 }
	 
	 if($('#contentToCopyAmpliadoDeTablaRp').find('table').length>0)
	 {
		  $('#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) {
         
		  idTabla=$(this).attr('id');
		  $('#'+idTabla+' >tfoot>tr ').each(function(index, element) {
            
		  allC+=parseFloat(($(this).find("td").eq(2).text().split('%').join('')));
		  allV+=parseFloat(($(this).find("td").eq(3).text().split('%').join('')));
		  allPL+=parseFloat((($(this).find("td").eq(4).text().split('$').join(''))).split(',').join(''));
        });
		
    });
	 }
	 
		
		
     //sumar porcentajes de total calculado y total variable
	  
	   //sacar porcentaje permitido para agregar
	 
	  PPAAC=100-allC;
	  PPAAV=100-allV;
	 //sacar porcentaje permitido para agregar	
	  
	  
	  
	//poner porcentajes 
	$('.allTC').text(allC.toFixed(6)+'%');
	$('.allTV').text(allV.toFixed(6)+'%');
	$('.allPL').text('$'+allPL.formatMoney(6, '.', ','));
	$('.PPAAV').text(PPAAV.toFixed(6)+'%');
	$('.PPAAC').text(PPAAC.toFixed(6)+'%');
	//poner porcentajes 
	//sumar porcentajes de total calculado y total variable		
			  }else
			  {
				  
					
				  $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',false);
				  if(response.fo=="txtFamilia")
				  {
					   $('#txtFamilia').focus();
							$('#txtFamilia').addClass("formulario-inputs-alert");
							$('#txtFamilia').keyup(function()
							{
								$('#txtFamilia').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
				  }else if(response.fo=="txtIngresoVenta")
				  {
					        $('#txtVariableP').focus();
							$('#txtIngresoVenta').addClass("formulario-inputs-alert");
							$('#txtVariableP').keyup(function()
							{
								
								$('#txtIngresoVenta').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
							
							alert('Escribe el % Variable de nuevo.');
				  }
				  else if(response.fo=='txtInversionPT')
				  {
					  $('#txtCtoPromUni').focus();
							$('#txtInversionPT').addClass("formulario-inputs-alert");
							$('#txtCtoPromUni').keyup(function()
							{
								$('#txtInversionPT').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					  alert("Escribe de nuevo el costo promedio unitario.");
				  }
				  else if(response.fo=="txtInversionCTP")
				  {
					    $('#txtCtoPromUniCTP').focus();
							$('#txtInversionCTP').addClass("formulario-inputs-alert");
							$('#txtCtoPromUniCTP').keyup(function()
							{
								$('#txtInversionCTP').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					  alert("Escribe de nuevo el costo promedio unitario de tienda.");
				  }
				   else  if(response.fo=='txtVariableP')
					 {    
						    $('#txtVariableP').focus();
							$('#txtVariableP').addClass("formulario-inputs-alert");
							$('#txtVariableP').keyup(function()
							{
								$('#txtVariableP').removeClass("formulario-inputs-alert");
								$('#txtIngresoVenta').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 
						 
					 }else if(response.fo=='txtCalculadoP')
				  {
					       
					       $('#txtCalculadoP').focus();
							$('#txtCalculadoP').addClass("formulario-inputs-alert");
							$('#txtCalculadoP').keyup(function()
							{
								$('#txtCalculadoP').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					  
				  }else if(response.fo=='txtPiezas')
					 {
						   $('#txtPiezas').focus();
							$('#txtPiezas').addClass("formulario-inputs-alert");
							$('#txtPiezas').keyup(function()
							{
								$('#txtPiezas').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 } else if(response.fo=='txtCtoPromUni')
					 {
						   $('#txtCtoPromUni').focus();
							$('#txtCtoPromUni').addClass("formulario-inputs-alert");
							$('#txtCtoPromUni').keyup(function()
							{
								$('#txtCtoPromUni').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 }else if(response.fo=="txtCtoPromUniCTP")
					 {
						  $('#txtCtoPromUniCTP').focus();
							$('#txtCtoPromUniCTP').addClass("formulario-inputs-alert");
							$('#txtCtoPromUniCTP').keyup(function()
							{
								$('#txtCtoPromUniCTP').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
					 }
					
				   
				               $('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
							    
							   
			  }
			
		},error: function(response)
		{
			
			 $('#loaderDetalleNuevoPS').hide();
			 $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('disabled',false);
 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		}
		
		
	})
	}
	
  						 
 })
 
 //agregar porcentaje
 //validar solo valores numericos
 $("#txtVariableP,#txtCtoPromUni,#txtCtoPromUniCTP").numeric({negative: false});  //solo valores decimales
 $("#txtPiezas").numeric({ decimal: false, negative: false });//entero
 
 



//agregar datos de familia a caja de texto

$(document).on('click','.addFamilia',function()
{
    var codigo = $(this).closest('tbody tr').find('td').eq(0).text(); 
	var nombreF= $(this).closest('tbody tr').find('td').eq(1).text(); 
	$('#txtFamilia').val(nombreF);
	$('#txtFamilia').attr('alt',codigo);
	$('.mee').html();
	$('.meee').html('<div class="mensajeSatisfactorio">Agregado Correctamente'+nombreF+'.</div>');
	$('.mensajeSatisfactorio').fadeOut(15000);
	$('#txtFamilia').removeClass("formulario-inputs-alert");
	$('.mee').text("");
$('#vBusquedaFamilia').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
	
});

//convertir tabla busqueda familia eb dataTable

dataTableEspanolById($('#tVBusquedaFamilia').attr('id'));


//convertir tabla busqueda familia eb dataTable



function dataTableEspanolByClass(tabla)
{
	
	table=$('.'+tabla).dataTable(
		{
			"iDisplayLength": 50,
			
			"bJQueryUI":false,
			
			"sPaginationType": "full_numbers",
			
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious":"Anterior"
                },

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="100">100</option>'+
'<option value="150">150</option>'+
'<option value="200">200</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

} 
			
		});
		
		
return table;
}

function DataTableEspanolByObj(obj)
{
	table=$(obj).DataTable(
		{
			"iDisplayLength": 50,
			"bJQueryUI":false,
			
			"sPaginationType": "full_numbers",
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious":"Anterior"
                },
"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="100">100</option>'+
'<option value="150">150</option>'+
'<option value="200">200</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 
"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 
"sInfoFiltered": " - filtrados de _MAX_ registros.", 
"sInfoEmpty": "No hay resultados de búsqueda.", 
"sZeroRecords": "No hay registros a mostrar.", 
"sProcessing": "Espere, por favor...", 
"sSearch": "Buscar:</span>", 
} 
		});
return table;
}

function DataTableEspanolByObjNonPagination(obj)
{
	table=$(obj).DataTable(
		{
			"iDisplayLength": 50,
			"bJQueryUI":false,
			"bPaginate": false,
			"bFilter": false, 
			"bInfo": false,
			"sPaginationType": "full_numbers",
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious":"Anterior"
                },
"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="100">100</option>'+
'<option value="150">150</option>'+
'<option value="200">200</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 
"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 
"sInfoFiltered": " - filtrados de _MAX_ registros.", 
"sInfoEmpty": "No hay resultados de búsqueda.", 
"sZeroRecords": "No hay registros a mostrar.", 
"sProcessing": "Espere, por favor...", 
"sSearch": "Buscar:</span>", 
} 
		});
return table;
}



	function DataTableEmpresas(obj){
	var table = $(obj).DataTable({
		"iDisplayLength": 50,
    "columns": [
            {
				
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
			
            {},
			
            ],
			
			
			
			"bJQueryUI":false,
			
			"sPaginationType": "full_numbers",
			
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious": "Anterior"
                },

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="100">100</option>'+
'<option value="150">150</option>'+
'<option value="200">200</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

} 
    

}); 

 return table;
}


function dataTableEspanolById(tabla)
{
	
	table=$('#'+tabla).dataTable(
		{
			"iDisplayLength": 50,
			
			"bJQueryUI":false,
			
			"sPaginationType": "full_numbers",
			
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious": "Anterior"
                },

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="100">100</option>'+
'<option value="150">150</option>'+
'<option value="200">200</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

} 
			
		});
		
		
return table;
}
	



//abrir ventana buscar familia

$("#bf").click( function()
{
	$('#vBusquedaFamilia').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
})

//cerrar ventana familia

$('#btnCVBusquedaFamilia').click(function()
{
	$('#vBusquedaFamilia').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
})



/*modificar detalle*/
$(document).on('click','.modificarDetallePPS',function()
{
	
	     
	     var idFila=$(this).closest('tbody tr').attr('class');
		 var idTabla=$(this).closest('table').attr('id');
		 var tipoA=$(this).closest('tbody tr').find('td').eq(2).html();//obtenemos el tipo articulo
		 var marca=$(this).closest('tbody tr').find('td').eq(3).html();//obtenemos la marca
		 var genero =$(this).closest('tbody tr').find('td').eq(4).html();//obtenemos el genero
		 var fam=$(this).closest('tbody tr').find('td').eq(5).html();//obtenemos la familia
		 var pc=$(this).closest('tbody tr').find('td').eq(6).html();//obtenemos el % calculado
		 var pv=$(this).closest('tbody tr').find('td').eq(7).html();//obtenemos el % variable
		 var ivi=$(this).closest('tbody tr').find('td').eq(8).html();// obtenemos el ingreso De integracion de venta
		 var piezas=$(this).closest('tbody tr').find('td').eq(9).html();// obtenemos el numero de piezas
		 var icpt=$(this).closest('tbody tr').find('td').eq(10).html();// obtenemos la inversion costo pt
		 var ctoPromUniPT=$(this).closest('tbody tr').find('td').eq(11).html();// obtenemos el costo prom uni pt
		 var ctpi=$(this).closest('tbody tr').find('td').eq(12).html();// obtenemos la inversion de tienda
		 var ctpu=$(this).closest('tbody tr').find('td').eq(13).html();// obtenemos la costo de tienda promedio
		 //costoXPiezas
		  
		 
		 
		 
		 /*cargar totales*/
		$('.totalPresupuestoD').text($('.allPA').text());
        $('.totalCalculadoD').text($('.totalCalculado'+idTabla.substr(18,idTabla.length)).text());
		$('.totalVariableD').text($('.totalVariable'+idTabla.substr(18,idTabla.length)).text());
		totalCalculadoV=parseFloat($('.totalVariableD').text());//igualar variable total calculado al valor cargado
		totalPresupuesto=parseFloat(($('.totalPresupuestoD').text().split(',').join('')).split('$').join('')); //igualara variale total presupuesto cargado
		totalCalculado=parseFloat($('.totalCalculadoD').text()); //obtener total calculado
		

		/*cargar totales*/
		 
	     $('#lklAgregarNuevoDetalleVNuevoDetalleRp').text('Modificar Detalle');//cambiar texto del boton
		 $('#lklAgregarNuevoDetalleVNuevoDetalleRp').prepend('<img src="Imagenes/add.png" width="16" height="16" alt="agregarNuevoDetalle">');//añadir imagen al boton
		 $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('value',2);
		 $('#txtFila').val(idFila);//agregar id de fila
		 //quitar clases de advertencias
		 $('.mee').text("");
         $('input').removeClass("formulario-inputs-alert");
		
		
	$('#vNuevoDetalleRp').bPopup({
            speed: 650,
            transition: 'slideDown',
			onClose: function()
			{          
			         $('#txtCalculadoP').attr('readonly',true);//poner total calculado como lectura
				     $('#lklAgregarNuevoDetalleVNuevoDetalleRp').text('Agregar Detalle');//cambiar texto del boton
					 $('#lklAgregarNuevoDetalleVNuevoDetalleRp').prepend('<img src="Imagenes/add.png" width="16" height="16" alt="agregarNuevoDetalle">');//añadir imagen al boton
					 $('#lklAgregarNuevoDetalleVNuevoDetalleRp').attr('value',1);
					$('#textoVentanaDetalladoPPS').text('Agregar Nuevo Detalle');//cambiar titulo de ventana	
					$('#cmbClaseArticulo').attr('disabled',false);// habilitamos la lista desplegable
					$('#cmbTipoArticulo option').each(function() {//removemos el atributo selected de los options
                          $(this).removeAttr('selected');
                    });
					$('#cmbMarca option').each(function() {//removemos el atributo selected de los options
						  $(this).removeAttr('selected');
					})
					
					$('#cmbGenero option').each(function() {//removemos el atributo selected de los options
			                  $(this).removeAttr('selected');
		
                       });
			}
        });
		
	/*se añaden las nuevas configuraciones y atributos a la ventana asi como los valores de cada celda de la tabla a la ventana*/			
	$('#textoVentanaDetalladoPPS').text('Modificar Detalle');//cambiar titulo de ventana	
	
	
	
	
	$('#cmbClaseArticulo option').each(function() {
       
	     if(idTabla.substr(18,idTabla.length)==$(this).attr('value'))//buscamos la clase articulo en la lista desplegable 
		 {
			 $(this).attr('selected',true);
		 }
		
    });
	$('#cmbClaseArticulo').attr('disabled',true);//des habilitamos la lista desplegable
	//buscamos el tipo articulo que corresponde al texto de la celda obtenido
	$('#cmbTipoArticulo option').each(function() {
        
		if(tipoA==$(this).attr('value'))
		{
			 $(this).attr('selected',true);
		}
    });
	
	//buscamos el tipo de marca que corresponde al texto de la celda obtenido
	$('#cmbMarca option').each(function() {
	
		if(marca==$(this).text())
		{
			 $(this).attr('selected',true);
		}
        
    });
	
	//buscamos el tipo de genero en la lista 
	$('#cmbGenero option').each(function() {
        
		if(genero==$(this).text())
		{
			$(this).attr('selected',true);
		}
    });
	
	//añadimos la familia
	$('#txtFamilia').val(fam);
	
	//añadimos el %calculado 
	 $('#txtCalculadoP').val(parseFloat(pc.split('%').join('')));
	 totalCalculadoModificar=$('#txtCalculadoP').val();
	 //añadimos %variable
	 $('#txtVariableP').val(parseFloat(pv.split('%').join('')));
	 totalVariableCal=$('#txtVariableP').val(); //igualar variable global al total a modificar
	 //ingreso de venta
	 $('#txtIngresoVenta').val(parseFloat(ivi.split(',').join('')));
	 //agregamos el num de piezas
	 $('#txtPiezas').val(parseInt(piezas.split(',').join('')));
	 //agregamos inversion pt
	 $('#txtInversionPT').val(parseFloat(icpt.split(',').join('')))
	 //agreganos el costo prom uni pt 
	 $('#txtCtoPromUni').val(parseFloat(ctoPromUniPT.split(',').join('')));
	 //agregamos la inversion de tienda
	 $('#txtInversionCTP').val(parseFloat(ctpi.split(',').join('')));
	  //agregamos el costo promedio de tienda
	 $('#txtCtoPromUniCTP').val(parseFloat(ctpu.split(',').join('')));
	
  /*se añaden las nuevas configuraciones y atributos a la ventana asi como los valores de cada celda de la tabla a la ventana*/	
  costoXPiezas=($('#txtIngresoVenta').val()/$('#txtPiezas').val());

 /*Igualamos la variable costoXPiezas*/
 
 /*deshabilitamos piezas*/ 
 $('#txtPiezas').attr('readonly',true);
 $('#txtPiezas').addClass('readOnly');
 /*deshabilitamos piezas*/
 
});
/*modificar detalle*/


//abrir ventana agregar nuevo detalle

$(document).on('click','#lklAgregarNuevoDetalle,#lklAgregarNuevoDetalleTA,#btnAgregarNuevoDetalleDP',function()
{
	var ca="";
	
	$('#vNuevoDetalleRp').bPopup({
            speed: 650,
            transition: 'slideDown',
        });
		$('#cmbClaseArticulo option:selected').each(function(index, element) {//remover atributo selected de la lista desplegable
            $(this).removeAttr('selected');
        });
		 $('#frmAgregarDetalle').each(function(index, element) {
                    this.reset();
                });
		$('.mee').text("");
		$('input').removeClass("formulario-inputs-alert");
	    $('#txtCalculadoP').val("0");
		
		$('#cmbClaseArticulo option').each(function(index, element) {
			if(index==0){
			ca=$(this).val();
			}
        });
		
		
		/*cargar totales*/
		$('.totalPresupuestoD').text($('.allPA').text());
        $('.totalCalculadoD').text($('.totalCalculado'+ca).text());
		$('.totalVariableD').text($('.totalVariable'+ca).text());
		totalCalculadoV=parseFloat($('.totalVariableD').text());//igualar variable total calculado al valor cargado
		totalPresupuesto=parseFloat(($('.totalPresupuestoD').text().split(',').join('')).split('$').join('')); // igualara variale total presupuesto cargado
		totalCalculado=parseFloat($('.totalCalculadoD').text()); //obtener total calculado
		/*cargar totales*/
		/*habilitamos piezas*/ 
         $('#txtPiezas').attr('readonly',false);
		 $('#txtPiezas').removeClass('readOnly');
       /*habilitamos piezas*/
		
		
		
		
		
		
})

//cerrar ventana

$('#btnCVNuevoDetalleRp').click(function()
{
	$('#vNuevoDetalleRp').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
		
		//return false;
	
})



/*agregar nuevo detalle nuevaParticipacionSegmento.php*/



/*agregar nuevo detalle nuevaParticipacionSegmento.php*/


/*checar año de evaluación y cambiar meses*/

$('#cmbAEvaluacion').change(function()
{
   var fecha = new Date();
   var ano = fecha.getFullYear();
   var anoSeleccionado=$('#cmbAEvaluacion option:selected').val();
   var meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
   var optionsC="";
   var b=0;
   
   
   if(anoSeleccionado!=ano)
   {
   
     for(var x=0; x<=11;x++)
	 { 
	      b=x+1;
		 optionsC+="<option value="+b+">"+meses[x]+"</option>"
	 }
	 
	 $("#cmbMesesIni").html(optionsC);
	 
   }else
   {
	    
		
		for(var x=fecha.getMonth(); x<=11; x++)
		{
			 b=x+1;
		    optionsC+="<option value="+b+">"+meses[x]+"</option>"
		}
		$("#cmbMesesIni").html(optionsC);
	    
   }
   
   

})
/*checar año de evaluación y cambiar meses*/

/*abrir tabla filtros participacion*/

$(document).on('click','#lklAmpliarTablaRP',function()
{
	
	/*mostramos todas las tablas y los tr ocultos*/
	 $('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) { //mostramos todas las tablas y los tr ocultos
            
			     $(this).show();
			    
				$(this).find(' tbody>tr').each(function(index, element) {
                    
					$(this).show();
					
                });
				
				$('#'+$(this).attr('id')+'>tbody').find('tr.nr').each(function(index, element) {
            
			$(this).remove()
				
				})
			
        });  
			/*mostramos todas las tablas y los tr ocultos*/
	$('.me').text("");
	
	$('#vtnAmpliadoDeTablaRP').bPopup({
            speed: 650,
		    follow: [false, false], //x, y
			position: [0, 0],
			onOpen:function()
			{
				$('html, body').animate({scrollTop : 0},800);
	             return false;
			},
			onClose: function() { 
	              
				   /*mostrar tablas ocultas*/
	$('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) { //mostramos todas las tablas
           
				$(this).show();
				$(this).find('tbody>tr').each(function(index, element) { //mostrar tr ocultos
                    $(this).show();
                });
				
				$('#'+$(this).attr('id')+'>tbody').find('tr.nr').each(function(index, element) {
            
			$(this).remove()
        });
				
				
			
        }); 
		
	/*mostrar tablas ocultas*/ 
				  $('#contenedorTablaDetalles').html($('#contentToCopyAmpliadoDeTablaRp').html());//copiamos el contenido de la tabla secundaria a la tabla principal
				  $('#cprPPS').html($('#cprTablaAmpliada ').html());//copiamos el contenido
				  $('#contentToCopyAmpliadoDeTablaRp').empty();//eliminamos el contenido
				  $('#cprTablaAmpliada').empty();//eliminamos contenido
				 

				   },
            transition: 'slideDown'
			
        });
		
	    $('#contentToCopyAmpliadoDeTablaRp').html($('#contenedorTablaDetalles').html()); //copiamos el contenido de la tabla principal en la table secundaria a ampliar
		$('#cprTablaAmpliada').html($('#cprPPS').html());//copiamos contenido
		$('#contenedorTablaDetalles').empty(); //eliminamos el contenido
		$('#cprPPS').empty();//eliminamos contenido
		
		
	
})

//cerrar ventana

$(document).on('click','#btnCVtnAmpliadoDeTablaRP',function()
{
	$('#vtnAmpliadoDeTablaRP').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
	
})





/*guardar participacion*/
$(document).on('click','#btnGuardarPPS,#btnGuardarPPSTA',function()
{
	/*mostrar tablas ocultas*/
	$('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) { //mostramos todas las tablas
            
			
				$(this).show();
				
				$(this).find('tbody>tr').each(function(index, element) { //mostrar tr ocultos
                    $(this).show();
                });
			//mostrar tr ocultos
            $('#'+$(this).attr('id')+'>tbody').find('tr.nr').each(function(index, element) {
                
				$(this).remove();
            });
        }); 
	/*mostrar tablas ocultas*/
	
	$('#cmbFiltroA').val('SELECCIONE UNA OPCION')//reetablecemos el listbox de busqueda
	$('#txtDatoDetalladoFind').val("");
  
	
    
	
	var tipoInfo="";
	var nta="";//tipo articulo
	var m="";//nombre marca
	var idm="";//id marca
    var ng="";//nombre genero
	var idng="";//id genero
	var nfam="";//nombre familia
	var idfam="";//idFamilia	
	var pCalculado=0;//porcentaje calculado
	var pVariable=0; //porcetanje variable
	var integracioDeVentaIngreso=0; //venta ingreso
	allC=parseFloat($('.allTC').text().split('%').join('')).toFixed(6);
	allV=parseFloat($('.allTV').text().split('%').join('')).toFixed(6);
	var plaza=$('#cmbPlaza option:selected').val();
    tPresupuesto=0;//igualar variable a 0
	nnAjax=0;//variable para guardar el numero de registros que seran enviado spor ajax
    nAjax=0;//variable para guardar el numero de registros que seran enviado spor ajax
 
	

	var p=0; //piezas
	var inversionPT=0; //inversion tienda promedio
	var ctoPromUnitPT=0;//costo promedio unitario en tienda
	var inversionTP=0;//inversion de tienda
	var ctoPromUnitTP=0;//costo promedio de tienda
	
	
	//contar numeros de registros que se enviaran por ajax
	$('#ctfme,#cVtnAmpliadoDeTablaRP').find('table').each(function(index, element) {
		
		
		 idTabla=$(this).attr('id');
		
		  $('#'+idTabla+ '  tbody tr ').each(function(index, element) {
			 
			nAjax++;
			
		  })
		
		
		  
	})
	

	//verificar el total presupuesto  e igualar total presupuesto que fue traido al consultar de la base de datos
	$('#ctfme,#cVtnAmpliadoDeTablaRP').find('table').each(function(index, element) {
		
		
		 idTabla=$(this).attr('id');
		
		  $('#'+idTabla+ '  tfoot tr ').each(function(index, element) {
			 
			tPresupuesto+=parseFloat($(this).find("td").eq(4).find('.totalIngreso'+idTabla.substring(18,idTabla.length)).text().split(',').join(''))//sumar totales de ingreso
			
		  })
		
		
		  
	})
	

		//verificar el total presupuesto  e igualar total presupuesto que fue traido al consultar de la base de datos
		
	
	if(tPresupuesto>parseFloat(($('.allPA').text().split('$').join('')).split(',').join('')) )//validar si la suma total de los ingreso por cada articulo es menor al presupuesto total del mes
	{
		
		
		$('.me').html('<div class="mensajeInformativo">El presupuesto local no deve de ser mayor a $'+(parseFloat(($('.allPA').text().split('$').join('')).split(',').join('')).formatMoney(6, '.', ',')).toString()+'.</div>');
		$('.mensajeInformativo').fadeOut(15000);
		
	}else
	if(tPresupuesto< parseFloat($('.tpli').text())  )
	{
		$('.me').html('<div class="mensajeInformativo">El presupuesto local no deve de ser menor a $'+(parseFloat($('.tpli').text()).formatMoney(6, '.', ',')).toString()+'.</div>');
		$('.mensajeInformativo').fadeOut(15000);
	}/*else 
	if(allV>100)//validar si el total de % de variable es mayor al 100%
    {
		 $('.me').html('<div class="mensajeInformativo">El porcentaje total  Variable pasa del 100%.</div>');
		$('.mensajeInformativo').fadeOut(15000);
	}*/
	else 
	{
	
    if(confirm("Deseas guardar los  " +($('.rppm').text()).toLowerCase()+"?"))
	{	
		$.ajax(
	{
		type:'post',
		url:$('#frmSeleccionDeFiltrosPS').attr('action'),
		data:$('#frmSeleccionDeFiltrosPS').serialize()+'&bandera='+7,
		dataType:"json",
		beforeSend: function(response)
		{
			//desabilitar botones
			$('#btnGuardarPPS').hide()
			$('#lklAmpliarTablaRP').hide();
			$('#btnReloadTablePPS').attr('disabled',true);
			$('#lklAgregarNuevoDetalle').hide();
			$('#anteriorSeleccionRpt').hide();
			$('#finalizarSeleccionRpt').hide();
			$('#btnGuardarPPSTA').hide();
			$('#lklAgregarNuevoDetalleTA').hide();
			$('#btnReloadTablePPS').hide();
			$('.eliminarDetallePPS').removeAttr('style');
			$('.modificarDetallePPS').removeAttr('style');
			$('.eliminarDetallePPS').css('opacity','.5');
			$('.modificarDetallePPS').css('opacity','.5');
			$('.modificarDetallePPS').attr('title','El detalle no se puede modificar.');
			$('.eliminarDetallePPS').attr('title','El detalle no se puede eliminar.');
			$('.modificarDetallePPS').attr('class','mod');
			$('.eliminarDetallePPS').attr('class','eli');
			//desabilitar botones
			$('.me').text("");
			
			$('.loadF').show();
			
		},success: function(response)
		{
		
			
			if(response.respuesta=="si")
			{
		$('#contenedorTablaDetalles,#contentToCopyAmpliadoDeTablaRp').find('table').each(function(index, element) {
		  var claseA=$(this).attr('id').substr(18,$(this).attr('id').length); //clase articulo
		  idTabla=$(this).attr('id');
		  
		  $('#'+idTabla+' >tbody>tr ').each(function(index, element) {
            	
	        tipoInfo=$(this).attr('tipoinfo');
			nta=$(this).find("td").eq(2).text()//tipo articulo
		    m=$(this).find("td").eq(3).text()//marca
			idm=$(this).find("td").eq(3).attr('id').substr(5,$(this).find("td").eq(3).attr('id').length) //id marca
			ng=$(this).find("td").eq(4).text()//nombre genero
			idng=$(this).find("td").eq(4).attr('id').substr(6,$(this).find("td").eq(4).attr('id').length)// id genero
		    nfam=$(this).find("td").eq(5).text()//nombre familia
			idfam=$(this).find("td").eq(5).attr('id').substr(7,$(this).find("td").eq(5).attr('id').length) //id familia
			pCalculado=((pCalculado=($(this).find("td").eq(6).text()).split('%').join('')));//porcentaje calculado
		    pVariable=((($(this).find("td").eq(7).text()).split('%').join(''))); // porcentaje variable
			integracioDeVentaIngreso=parseFloat(($(this).find("td").eq(8).text()).split(',').join(''));//integracion  de venta ingreso 
			p=parseInt($(this).find("td").eq(9).text().split(',').join(''))//piezas
		    inversionPT=parseFloat($(this).find("td").eq(10).text().split(',').join(''))//inversion de costo pt
		    ctoPromUnitPT=parseFloat($(this).find("td").eq(11).text().split(',').join('')); // costo promedio unitario pt
		    inversionTP=parseFloat($(this).find("td").eq(12).text().split(',').join(''));//inversion de costo tienda
		    ctoPromUnitTP=parseFloat($(this).find("td").eq(13).text().split(',').join(''));// costo promedio unitario de tienda
			 

		$.ajax(
	{
		type:'post',
		url:$('#frmSeleccionDeFiltrosPS').attr('action'),
		data:$('#frmSeleccionDeFiltrosPS').serialize()+'&bandera='+3+'&cmbPlaza='+plaza+'&cmbTipoArticulo='+nta+'&cmbClaseArticulo='+claseA+'&idGenero='+idng+'&cmbGenero='+ng+'&idFamilia='+ idfam+'&idMarca='+idm+'&txtFamilia='+nfam+'&cmbMarca='+m+'&txtCalculadoP='+pCalculado+'&txtVariableP='+pVariable+'&txtIngresoVenta='+integracioDeVentaIngreso+'&txtPiezas='+p+'&txtInversionPT='+inversionPT+'&txtCtoPromUni='+ctoPromUnitPT+'&txtInversionCTP='+inversionTP+'&txtCtoPromUniCTP='+ ctoPromUnitTP+'&cmbMesesIni='+$('#cmbMesesIni option:selected').val()+'&cmbAEvaluacion='+$('#cmbAEvaluacion option:selected').val()+'&txtTotalPA='+($('.allPA').text().split("$").join('')).split(',').join('')+'&tipoInfo='+tipoInfo,
		dataType:"json",
		success: function(response)
		{
			nnAjax++;
			
			 
      
			  if(response.respuesta=='si' && nnAjax==nAjax)
			  {
				 
				  $('#btnReloadTablePPS').hide();
				  $('.loadF').hide();
				  $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				  $('.mensajeSatisfactorio').fadeOut(15000);			 
			 //desabilitar botones
			$('#btnGuardarPPS').hide()
			$('#lklAmpliarTablaRP').show();
			$('#lklAgregarNuevoDetalle').hide();
			$('#anteriorSeleccionRpt').show();
			$('#finalizarSeleccionRpt').show();
			$('#btnGuardarPPSTA').hide();
			$('#lklAgregarNuevoDetalleTA').hide();
			//desabilitar botones
			//redireccionar
			setTimeout( function()
			{
				window.location.href = "../listaParticipacionSegmento.php";
			},1500);
			//redireccionar
			
			 
				  
			  }else if(response.respuesta=='no')
			  {
				  $('.loadF').hide();
				  $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				  $('.mensajeInformativo').fadeOut(15000);
				  //desabilitar botones
			$('#btnGuardarPPS').show()
			$('#lklAmpliarTablaRP').show();
			$('#btnReloadTablePPS').attr('disabled',false);
			$('#lklAgregarNuevoDetalle').show();
			$('#anteriorSeleccionRpt').show();
			$('#finalizarSeleccionRpt').show();
			$('#btnGuardarPPSTA').show();
			$('#lklAgregarNuevoDetalleTA').show();
			$('#btnReloadTablePPS').show();
			$('.mod').removeAttr('style');
			$('.eli').removeAttr('style');
			$('.mod').css('cursor','pointer');
			$('.eli').css('cursor','pointer');
			$('.mod').attr('title','Modificar.');
			$('.eli').attr('class','Eliminar Detalle.');
			$('.mod').attr('class','modificarDetallePPS');
			$('.eli').attr('class','eliminarDetallePPS');
			//desabilitar botones
			
							   
			  }
			
		},error: function(response)
		{
			$('.loadF').hide();
			
 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 //habilitar botones
			$('#btnGuardarPPS').show()
			$('#lklAmpliarTablaRP').show();
			$('#btnReloadTablePPS').attr('disabled',false);
			$('#lklAgregarNuevoDetalle').show();
			$('#anteriorSeleccionRpt').show();
			$('#finalizarSeleccionRpt').show();
			$('#btnGuardarPPSTA').show();
			$('#lklAgregarNuevoDetalleTA').show();
		    $('#btnReloadTablePPS').show();
			$('.mod').removeAttr('style');
			$('.eli').removeAttr('style');
			$('.mod').css('cursor','pointer');
			$('.eli').css('cursor','pointer');
			$('.mod').attr('title','Modificar.');
			$('.eli').attr('class','Eliminar Detalle.');
			$('.mod').attr('class','modificarDetallePPS');
			$('.eli').attr('class','eliminarDetallePPS');
			//habilitar botones
										}
		
		
								})
			
        				});
		
	
			    });
	
				
			}else if(response.respusta=='no')
			{
				$('.loadF').hide();
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				$('.mensajeInformativo').fadeOut(15000);
				//desabilitar botones
			$('#btnGuardarPPS').show()
			$('#lklAmpliarTablaRP').show();
			$('#btnReloadTablePPS').attr('disabled',false);
			$('#lklAgregarNuevoDetalle').show();
			$('#anteriorSeleccionRpt').show();
			$('#finalizarSeleccionRpt').show();
			$('#btnGuardarPPSTA').show();
			$('#lklAgregarNuevoDetalleTA').show();
		    $('#btnReloadTablePPS').show();
			$('.mod').removeAttr('style');
			$('.eli').removeAttr('style');
			$('.mod').css('cursor','pointer');
			$('.eli').css('cursor','pointer');
			$('.mod').attr('title','Modificar.');
			$('.eli').attr('class','Eliminar Detalle.');
			$('.mod').attr('class','modificarDetallePPS');
			$('.eli').attr('class','eliminarDetallePPS');
			//desabilitar botones
			
			}
		},error: function(response)
		{
			
			$('.loadF').hide();
 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
 //desabilitar botones
			$('#btnGuardarPPS').show()
			$('#lklAmpliarTablaRP').show();
			$('#btnReloadTablePPS').attr('disabled',false);
			$('#lklAgregarNuevoDetalle').show();
			$('#anteriorSeleccionRpt').show();
			$('#finalizarSeleccionRpt').show();
			$('#btnGuardarPPSTA').show();
			$('#lklAgregarNuevoDetalleTA').show();
			$('#btnReloadTablePPS').show();
			$('.mod').removeAttr('style');
			$('.eli').removeAttr('style');
			$('.mod').css('cursor','pointer');
			$('.eli').css('cursor','pointer');
			$('.mod').attr('title','Modificar.');
			$('.eli').attr('class','Eliminar Detalle.');
			$('.mod').attr('class','modificarDetallePPS');
			$('.eli').attr('class','eliminarDetallePPS');
			//desabilitar botones
 
		}
		
	})
	
			}	
	
		}
		

	
});
/*guardar participacion*/


/*eliminar participacion*/
$(document).on('click','.eliminarPPS',function()
{
	 idRegistroParticipacion = $(this).closest('tbody tr').attr('id');//obtenemos id de la tr  
	 idTabla= $(this).closest('table').attr('id');
	 table = $('#'+idTabla).DataTable(); //convertimos la tabla a dataTable
     dialogoEliminarPPS();
	
})
/*eliminar participacion*/





crearDataTablePPS();//crear data table


/*cargar plazas al entrar a la pagina*/

if(baseName=='listaParticipacionSegmento.php'){
var ano=$('#cmbAListaPPS option:selected').val();
$.ajax({
		 type:'post',
		 dataType:"json",
		 url:"../Php_Scripts/s_accionesParticipacionPorSegmento.php",
		 data:'bandera='+1+'&year='+ano,
		 beforeSend: function(response)
		 {
			 $('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
			
		 },success: function(response)
		 {     
		 
		     $('#loader').bPopup().close();
			 if(response.respuesta=="si"){
			 $('#accordionListaPPS').html(response.contenidoTabla);
			 if(response.fo!="nr"){
		       
			$('#accordionListaPPS').accordion();
		    $('#accordionListaPPS').accordion("refresh");
			 crearDataTablePPS();
			 }else
			 {
				 $('.me').html('<div class="mensajeDeError">No se encontraron registros.</div>');
				 $('.mensajeDeError').fadeOut(15000);
			 }
			
			 
			 }
			 
		 },
		 error: function(response)
		 {
			 $('#loader').bPopup().close();
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		 }
	});
}
/*cargar plazas al entrar a la pagina*/



/*mostrar por año*/

$('#anoPPS').html($('#cmbAListaPPS option:selected').text());
$('#cmbAListaPPS').change(function()
{
	var year=$(this).val();
	$.ajax({
		type:'post',
		dataType:"json",
		 url:"../Php_Scripts/s_accionesParticipacionPorSegmento.php",
		 data:'bandera='+1+'&year='+year,
		 beforeSend: function(response)
		 {
			  $('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
		 },success: function(response)
		 {     
		     
	     
		$('#loader').bPopup().close();
			 if(response.respuesta=="si"){
			
			
			 $('#accordionListaPPS').html(response.contenidoTabla);
			 $('#anoPPS').text(year);
			 if(response.fo!="nr"){
			 $('#accordionListaPPS').accordion();
		     $('#accordionListaPPS').accordion("refresh");
			 crearDataTablePPS();
			 }else
			 {
				  $('.me').html('<div class="mensajeDeError">No se encontraron registros.</div>');
				   $('.mensajeDeError').fadeOut(15000);
			 }
			
			 
			 }
			 
		 },
		 error: function(response)
		 {
			 $('#loader').bPopup().close();
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		 }
	});
})
/*mostrar por año*/


/*cargar datos en data table*/

function crearDataTablePPS(){
		
		var table= $('.dtPPS').dataTable(
		{
			
			
			
			"bJQueryUI":false,
			"sPaginationType": "full_numbers",
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious": "Anterior"
                },

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

} 
			
		});
	
}

/*seleccionar tabla*/


  

/*cargar datos en data table*/

/*acordion lista pagina */
$('#accordionListaPPS').accordion();
/*acordion lista pagina */

/*acciones pagina listaParticipacionSegmento.php */




//recorrer tabla de preguntas para agregar clase a preguntas que no han sido respondidas

$('#tEliminarModificarPF>tbody>tr').each(function(index) {
    
	if($('#txtRespuestaCoAE'+$(this).attr('id')).val()=="")
	{
		$('#'+$(this).attr('id')).addClass('pintarCeldaSeleccionada');
	}
});

//recorrer tabla de preguntas para agregar clase a preguntas que no han sido respondidas




	
/*abrir popup video de ayuda*/
$('.videoAyudalkl').click(function()
{
	var bpopup=$('#iframeVideo').html();	
	var titleVideo=$('#iframeVideo').data('title');
	if(bpopup=="" || bpopup==undefined || null)
	{
		alert("El video no ha sido subido.");
	}else
	{
	$('#vVideoContenido').html($('#iframeVideo').html());
	$('#tvdayuda').text(titleVideo);
	$('.vVideo').bPopup({
			speed: 650,
            transition: 'slideDown',

        });
	
	}
	return false;
})	
/*abrir popup video de ayuda*/	
		
/*Ayuda en pagina web acciones*/
$('.Ayuda').click(function()
{
	$('.ventanaDeAyuda').bPopup({
            speed: 650,
            transition: 'slideDown',
			 follow: [false, false],
            position: [0, 0], 
			 onClose: function() {$('.tooltipAyudaR ').fadeOut(1300);$('.tooltipAyudaL ').fadeOut(1300);$('.tooltipAyudaB').fadeOut(1300);$('.br').fadeOut(1300); $('.tooltipAyudaA').fadeOut(1300);
	      }
        });
		
	

		$('.tooltipAyudaR').fadeIn(1300);
		$('.tooltipAyudaB').fadeIn(1300);
		$('.tooltipAyudaA').fadeIn(1300);
		$('.br').show();
		
	
	
	     
		 
		
		
		
})

$('.botonCerrarVentanaAyuda').click(function()
{
	$('.ventanaDeAyuda').bPopup({
            speed: 650,
            transition: 'slideDown',
        }).close();
		
		
	
})

$('.botonCerrarVentanaAyudaVideos').click(function()
{
	$('.vVideo').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
		
		
	
})
/*Ayuda en pagina web acciones*/

/*funcion buscar facturas al cargar pagina*/



if(baseName=='misFacturas.php')
{
	
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:$('#frmBuscarFacturas').attr('action'),
		data:$('#frmBuscarFacturas').serialize(),
		beforeSend: function(response)
		{
			$('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
			
		},
		success: function(response)
		{
			
			
			$('#loader').bPopup().close();
			
			if(response.respuesta=="si")
			{        
			       
			    
			
				////////////////////////////Vizualizar pendientes por generar/////////////////////////
				$('#contenidoTablaPPG').html(response.ppg);
				/////////////////////////////////////////////////////////
				
				///////////////////////////Vizualizar Disponibles para impresión//////////////////
				$('#contenidoTablaDPI').html(response.dpi);
					/////////////////////////////////////////////////////////
					
				///////////////////////////Vizualizar Generados//////////////////
			     $('#contenidoTablaGen').html(response.gyp);
				 /////////////////////////////////////////////////////////
				 
				 ///////////////////////////Vizualizar todos//////////////////
				 $('#contenidoTablaTodos').html(response.todos);
				  /////////////////////////////////////////////////////////
				  
		
				
				  
				   /*visualizar detallado de solicitud solicitud generada*/
				  $('#adsg').html(response.verDetalladoSolicitudGenerada);
				  /*visualizar detallado de solicitud solicitud generada*/
				  
				 
					/*acordion ver detallado vista solicitud generada y disponible para impresion*/
                              $('#adsg').accordion();
							  $('#adsg').accordion("refresh");//refrescar cotenido de accordion
                    /*acordion ver detallado vista solicitud generada y disponible para impresion*/
					
					
					/*vizualizar detallado disponible para impresion*/
					$('#adpi').html(response.verDetalladodisponibleParaImpresion);
					/*vizualizar detallado disponible para impresion*/
					
					
					 /*acordion ver detallado vista solicitud generada y disponible para impresion*/
					       $('#adpi').accordion();
						   $('#adpi').accordion("refresh");
	               /*acordion ver detallado vista solicitud generada y disponible para impresion*/
				 
				
				
				$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				$('.mensajeSatisfactorio').fadeOut(15000);
				
				$('#accordion').accordion({active:0})
				
				if(active==0)
			    {
					
					if($('.1').length)
		{
			
			
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Pendientes Por Recepcionar.');
			$('#btnImprimirReportesFacturas').attr('disabled',false);
			$('#btnImprimirReportesFacturas').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('value',1);
			
		}else
		{
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
		}
				}
				
				/*saber si el usuario tiene empresas por validar*/
			
			}else
			{
				
				
				if(response.fo=="fechaCaptura")
				{
					        $('#txtFechaDeCaptura').focus();
							$('#txtFechaDeCaptura').addClass("formulario-inputs-alert");
							$('#txtFechaDeCaptura').change(function()
							{
								$('#txtFechaDeCaptura').removeClass("formulario-inputs-alert");
								$('.me').text("");
								
							});
					
				}else if(response.fo=="fechaHasta")
				{
					     $('#txtFechaHasta').focus();
						 $('#txtFechaHasta').addClass("formulario-inputs-alert");
						 $('#txtFechaHasta').change(function()
							{
								$('#txtFechaHasta').removeClass("formulario-inputs-alert");
								$('.me').text("");
								
							});
							
				}
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				$('.mensajeInformativo').fadeOut(15000);
				$('#loader').bPopup().close();
				
			}
		     	
		},error: function(response)
		{
			$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		    
		}
		
	});
	
	

	
}

/*funcion buscar facturas al cargar pagina*/




/*validar boton actualizar preguntas frecuentes*/

if($('#tEliminarModificarPF>tbody>tr').length)
			{
				$('#btnActualizarPreguntas').attr('disabled',false);
				$('#btnActualizarPreguntas').css("color","#000");
			}else
			{
				$('#btnActualizarPreguntas').css("color","#CCC");
				$('#btnActualizarPreguntas').attr('disabled',true);
			}
/*validar boton actualizar preguntas frecuentes*/


/*modificar preguntas frecuentes CO*/

$(document).on('submit','#frmActualizarOEliminarPreguntas',function()
{
	
	$.ajax(
	{
		type:"post",
		dataType:"json",
		url:$(this).attr('action'),
		data:$(this).serialize()+'&bandera='+4,
		beforeSend: function(response)
		{
			$('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
		},success: function(response)
		{
		
			if(response.respuesta=="si")
			{
				
				 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				 $('#num').html(response.num);
				 $('.mensajeSatisfactorio').fadeOut(15000);
				  $('#tEliminarModificarPF>tbody>tr').each(function(index) {
    
	if($('#txtRespuestaCoAE'+$(this).attr('id')).val()=="")
	{
		$('#'+$(this).attr('id')).addClass('pintarCeldaSeleccionada');
	}else
	{
		$('#'+$(this).attr('id')).removeClass('pintarCeldaSeleccionada');
		
	}
});
				
				 
			}else
			{
				
				$('#frmActualizarOEliminarPreguntas').find('input[type=text],textarea').each(function(index,element) {
					
				

                    if($(this).val().replace(/ /g, '') == '')
					{
						
						
						$('#'+$(this).attr('id')).addClass("formulario-inputs-alert");
						$('#'+$(this).attr('id')).focus();
						
						$('#'+$(this).attr('id')).keyup(function()
						{
							$('#'+$(this).attr('id')).removeClass("formulario-inputs-alert");
								$('.me').text("");
						})
						
						
					
					}
					
					
					
					
					
                });
				
				
				
                  		
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{
			$('#loader').bPopup().close();
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
	})
	
	return false;
})
/*modificar preguntas frecuentes CO*/




/*Eliminar pregunta frecuentes CO*/


$(document).on( 'click','.eliminarPreguntaFrecuente', function() {
	
	var idPregunta = $(this).closest('tbody tr').attr('id');
    
	
	if(confirm("Estas seguro que deseas eliminar la pregunta con  id "+idPregunta+"?")){
	 
	 $.ajax({
		 type:"POST",
		 dataType:"json",
		 url:"../Php_Scripts/s_accionesPreguntasFrecuentes.php",
		 data:"bandera="+3+"&idPregunta="+idPregunta,
		 beforeSend: function(response)
		 {
			 $('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
			 
		 },
		 success: function(response)
		 {
			 
			$('#loader').bPopup().close();
			$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			$('#tEliminarModificarPF>tbody').html(response.contenidoTablaPreguntas);
		    $('.mensajeSatisfactorio').fadeOut(15000);
			 $('#num').html(response.num);
			 
			  $('#tEliminarModificarPF>tbody>tr').each(function(index) {
    
	if($('#txtRespuestaCoAE'+$(this).attr('id')).val()=="")
	{
		$('#'+$(this).attr('id')).addClass('pintarCeldaSeleccionada');
	}else
	{
		$('#'+$(this).attr('id')).removeClass('pintarCeldaSeleccionada');
		
	}
});

			/*validar boton actualizar preguntas frecuentes*/

if($('#tEliminarModificarPF>tbody>tr').length)
			{
				$('#btnActualizarPreguntas').attr('disabled',false);
				$('#btnActualizarPreguntas').css("color","#000");
			}else
			{
				$('#btnActualizarPreguntas').css("color","#CCC");
				$('#btnActualizarPreguntas').attr('disabled',true);
			}
/*validar boton actualizar preguntas frecuentes*/
			
		 },
	     error: function(response)
		 {
			 $('#loader').bPopup().close();
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		 }
	 });
	}
	
})




/*envio de ajax agregar pregunta co*/

$('#frmAgregarRespuestaCo').on('submit', function()
{
	
	$.ajax(
	{
		type:"post",
		dataType:"json",
		url:$(this).attr('action'),
		data:$(this).serialize()+'&bandera='+2,
		beforeSend: function(response)
		{
			$('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
		},success: function(response)
		{
			
			
			if(response.respuesta=="si")
			{
				
				 $('#tEliminarModificarPF>tbody').html(response.contenidoTablaPreguntas);
				 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				 $('.mensajeSatisfactorio').fadeOut(15000);
				 $('#frmAgregarRespuestaCo').each(function(index, element) {
                    this.reset();
                });
			/*validar boton actualizar preguntas frecuentes*/
			
			
			 $('#tEliminarModificarPF>tbody>tr').each(function(index) {
    
	if($('#txtRespuestaCoAE'+$(this).attr('id')).val()=="")
	{
		$('#'+$(this).attr('id')).addClass('pintarCeldaSeleccionada');
	}else
	{
		$('#'+$(this).attr('id')).removeClass('pintarCeldaSeleccionada');
		
	}
});
			

if($('#tEliminarModificarPF>tbody>tr').length)
			{
				$('#btnActualizarPreguntas').attr('disabled',false);
				$('#btnActualizarPreguntas').css("color","#000");
			}else
			{
				$('#btnActualizarPreguntas').css("color","#CCC");
				$('#btnActualizarPreguntas').attr('disabled',true);
			}
/*validar boton actualizar preguntas frecuentes*/
			}else
			{
				if( response.fo=="respCo")
				{
					$('#txtRespuestaCo').focus();
					$('#txtRespuestaCo').addClass("formulario-inputs-alert");
				}
				if(response.fo=="pregCo")
				{
					$('#txtPreguntaCo').focus();
				    $('#txtPreguntaCo').addClass("formulario-inputs-alert");		
				}
				$(document).on('input','#frmAgregarRespuestaCo input,#frmAgregarRespuestaCo textarea',function()
				{
					$('#frmAgregarRespuestaCo input,#frmAgregarRespuestaCo textarea').removeClass("formulario-inputs-alert");
					$('.me').text("");
				});
				
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			}
			$('#loader').bPopup().close();
		},error: function(response)
		{
			
			$('#loader').bPopup().close();
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			
		}
	})
	return false;
})

/*abrir ventana de imagen no java*/
$('#imgNoJava').click(function()
{
	$('#vContenedorImagen').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
})
/*abrir ventana de imagen no java*/


/*cerra ventana preguntas frecuentes*/
$('#cvpf').click(function()
{
	$('#vPreguntasFrecuentes').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
		
		
}
/*cerra ventana preguntas frecuentes*/)



/*enviar pregunta*/
$('#frmHacerPregunta').on('submit', function()
{
	
	$.ajax(
	{
		type:'POST',
		dataType:"json",
		url:$(this).attr('action'),
		data:$(this).serialize()+'&bandera='+1,
		beforeSend: function(response)
		{
			$('#lpf').show();
		},
		success: function(response)
		{
			$('#lpf').hide();
			
			if(response.respuesta=="si")
			{
				  $('.meq').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				  $('.mensajeSatisfactorio').fadeOut(15000);
				  $('#frmHacerPregunta').each(function(index, element) {
                    this.reset();
                });
				
			}else
			{
				if(response.fo="preg")
				{
					
					
					$('#txtPreguntaF').focus();
							$('#txtPreguntaF').addClass("formulario-inputs-alert");
							
							$('#txtPreguntaF').keyup(function()
							{
								$('#txtPreguntaF').removeClass("formulario-inputs-alert");
								$('.meq').text("");
							})
				}
				
				 $('.meq').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			     $('#lpf').hide();
			}
		},error: function(response)
		{
			('#lpf').hide();
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	})
	
	return false;
})
/*enviar pregunta*/



/*abrir ventana preguntas frecuentes*/
$(document).on('click','#btnHacerUnaPregunta,#vpfo,.questionAyudalkl,#makeQ',function()
{
	$('#vPreguntasFrecuentes').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
		
		
		
		$('#frmHacerPregunta input').removeClass("formulario-inputs-alert");
		$('#vPreguntasFrecuentes .me').text("");
		$('.meq').text("");
		
		$('#frmHacerPregunta').each(function() {
            this.reset();
        });
	
})
/*abrir ventana preguntas frecuentes*/

/*ver detallado tipo de reporte*/

$('#btnExportarReporteDDSG,#btnExportarReporteDDPI').click(function()
{
	var tipoDeReporteDetallado=$(this).attr('value');
	window.open('./facturasReporteDetallado.php?tipoDeReporteDetallado='+tipoDeReporteDetallado,'Reporte Detallado','_blank');
})

/*Exporta archivo excel detallado solicitud generada*/
$('#btnExportarExcelDDSG').click(function()
{
	
	var tipoDeReporteDetallado=$(this).attr('value');
	alert(tipoDeReporteDetallado);
	window.open('Php_Scripts/s_exportarExcelDetallados.php?tipoDeReporteDetallado='+tipoDeReporteDetallado,'Reporte Detallado','_blank');
})
/*Exporta archivo excel detallado solicitud generada*/



/*Exportar excel detallado disponibles para impresion*/
$('#btnExportarExcelDPI').click(function()
{
	var tipoDeReporteDetallado=$(this).attr('value');

	window.open('Php_Scripts/s_exportarExcelDetallados.php?tipoDeReporteDetallado='+tipoDeReporteDetallado,'Reporte Detallado','_blank');
	
})
/*Exportar excel detallado disponibles para impresion*/



/*boton imprimir detallado facturas*/

$('#btnImprimirReportesFacturas').click(function()
{
	
	var tipoDeReporte=$(this).attr('value');
	window.open('facturasReporte.php?tipoDeReporte='+tipoDeReporte,'Reporte de mis facturas','_blank');
})



/*boton imprimir detallado facturas*/


/*acordion preguntas frecuentes*/
$('#acordionPreguntasFrecuentes').accordion();
/*acordion preguntas frecuentes*/






/*cancelar busqueda filtrado detalle solicitud generada*/

$('#btnCancelarDDSG').click(function()
{
	
	$('#frmBusquedaDeFiltroDDSG').each(function() {
        
		this.reset();
    });
	$('#vfddsg').toggle('slow');
	
	
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:"../Php_Scripts/s_buscarFacturas.php",	
		data:"bandera="+2,
		beforeSend: function(response)
		{
			$('#l22').show();
			
		},success: function(response)
		{  
		
		   
		    $('#l22').hide();
			
			if(response.fo=="nr"){
			   
				$('#adsg').html('<br/><br/><div class="mensajeDeError">No se encontraron resultados.</div>');
			}else
			{
			/*cargamos detallado de disponible para impresion */
			$('#adsg').html(response.verDetalladoSolicitudGenerada);
			$('#adsg').accordion("refresh");//refrescar cotenido de accordion
			/*cargamos detallado de disponible para impresion */
				
			}
			
			
		},error: function(response)
		{
			$('#l22').hide();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	})
	
})




/*cancelar Busqueda filtrado disponible para impresion*/
$('#btnCancelarDDPI').click(function()
{
	$('#frmBusquedaDeFiltroDDPI').each(function() {
		this.reset();
        
    });
	
	$('#vfddpi').toggle('slow');
	
	
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:"../Php_Scripts/s_buscarFacturas.php",	
		data:$(this).serialize()+"&bandera="+1,
		beforeSend: function(response)
		{
			$('#l2').show();
			
		},success: function(response)
		{  
		
		   
		    $('#l2').hide();
			
			if(response.fo=="nr"){
			   
				$('#adpi').html('<br/><br/><div class="mensajeDeError">No se encontraron resultados.</div>');
			}else
			{
				/*cargamos detallado de disponible para impresion */
			$('#adpi').html(response.verDetalladodisponibleParaImpresion);
			$('#adpi').accordion("refresh");//refrescar cotenido de accordion
			/*cargamos detallado de disponible para impresion */
				
			}
			
			
		},error: function(response)
		{
			$('#l2').hide();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	})
	
})

/*cancelar Busqueda filtrado disponible para impresion*/



/*permitir solo numeros caja de texto*/

$("#txtMontoDEFDPI,#txtMontoHastaFDPI,#txtMontoDEFDSG,#txtMontoHastaFDSG").keydown(function(event) {
   if(event.shiftKey)
   {
        event.preventDefault();
   }
 
   if (event.keyCode == 46 || event.keyCode == 8)    {
   }
   else {
        if (event.keyCode < 95) {
          if (event.keyCode < 48 || event.keyCode > 57) {
                event.preventDefault();
          }
        } 
        else {
              if (event.keyCode < 96 || event.keyCode > 105) {
                  event.preventDefault();
              }
        }
      }
   });
   /*permitir solo numeros caja de texto*/





/*busqueda de filtros detallado de facturas disponible para impreción*/
$('#frmBusquedaDeFiltroDDPI').on('submit',function()
{
	
	

    
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:$(this).attr('action'),	
		data:$(this).serialize()+"&bandera="+1,
		beforeSend: function(response)
		{
			$('#l2').show();
			
		},success: function(response)
		{  
		
		    
           
		   
		    $('#l2').hide();
			
			if(response.fo=="nr"){
			   
				$('#adpi').html('<br/><br/><div class="mensajeDeError">No se encontraron resultados.</div>');
			}else
			{
			/*cargamos detallado de disponible para impresion */
			$('#adpi').html(response.verDetalladodisponibleParaImpresion);
			$('#adpi').accordion("refresh");//refrescar cotenido de accordion
			/*cargamos detallado de disponible para impresion */
				
			}
			
			
		},error: function(response)
		{
			$('#l2').hide();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	})
	return false;
})

/*busqueda de filtros detallado de solicitud generada*/
$('#frmBusquedaDeFiltroDDSG').on('submit',function()
{
	
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:$(this).attr('action'),	
		data:$(this).serialize()+"&bandera="+2,
		beforeSend: function(response)
		{
			$('#l22').show();
			
		},success: function(response)
		{  
		
		   
		    $('#l22').hide();
			
			if(response.fo=="nr"){
			   
				$('#adsg').html('<br/><br/><div class="mensajeDeError">No se encontraron resultados.</div>');
			}else
			{
			/*cargamos detallado de disponible para impresion */
			$('#adsg').html(response.verDetalladoSolicitudGenerada);
			$('#adsg').accordion("refresh");//refrescar cotenido de accordion
			/*cargamos detallado de disponible para impresion */
				
			}
			
			
		},error: function(response)
		{
			$('#l22').hide();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
	})
	return false;
})








/*togle busqueda disponible para impresion*/

$('#muestraFiltrosDDPI').click(function()
{
	$('#vfddpi').toggle('slow');
	
});

$('#muestraFiltrosDDSG').click(function()
{
	$('#vfddsg').toggle('slow');
	
	
})


/*togle busqueda disponible para impresion*/
if(baseName=='proveedoresRegistro.php')
{
	$('#agregarCompaniaV').hide();



/*cmbTipoDeContacto ocultar nombres de compañias*/
$(document).on('change','#cmbTipoDeContacto',function()
{
	

	if($('#cmbTipoDeContacto option:selected').text()!='Elija un tipo de contacto')
	{
	  $('#agregarCompaniaV').show();
	  ($('#cmbTipoDeContacto option:selected').val()=='C')?$('.nCompania').hide():$('.nCompania').show();
	}else
	{    		
	  $('#agregarCompaniaV').hide();
	}
	
});
}

if(baseName=='editarPerfil.php')
{
 
 ($('#cmbTipoDeContacto option:selected').val()=='C')?$('.nCompania').hide():$('.nCompania').show();
	
$(document).on('change','#cmbTipoDeContacto',function()
{
	

	if($('#cmbTipoDeContacto option:selected').text()!='Elija un tipo de contacto')
	{
	  
	  ($('#cmbTipoDeContacto option:selected').val()=='C')?$('.nCompania').hide():$('.nCompania').show();
	}
	
});
}
/*cmbTipoDeContacto ocultar nombres de compañias*/


/*acciones de combobox cmbTipoDeContactoBuscarFacturas pagina mis facturas */

$(document).on('change','#cmbTipoDeContactoBuscarFacturas',function(){
	
	
	$('#btnImprimirReportesFacturas').attr('title','');
	$('#btnImprimirReportesFacturas').attr('disabled',true);
	$('#btnImprimirReportesFacturas').css("color","#CCC");
	$('#btnImprimirReportesFacturas').attr('value','');
	
	$('#btnVerDetallado').attr('title',"");
    $('#btnVerDetallado').attr('disabled',true);
    $('#btnVerDetallado').css("color","#CCC");
	$('#btnImprimirReportesFacturas').attr('value','');
	
	
	
	
	if($(this).val()=='S')
	{
		var active = $('#accordion').accordion('option', 'active');
		$('#contenidoTablaPPG').text("");
	    $('#contenidoTablaDPI').text("");
	    $('#contenidoTablaGen').text("");
	    $('#contenidoTablaTodos').text("");
		$('#chkDPIC').attr('id','chkDPI');
		$('#chkTodosC').attr('id','chkTodos');
		$('#chkGYPtd').show();
		$('#3').show();
		
		
		
		
		
		
		
		
	}else
	{ 
	    
			$('#chkGYPtd').hide();
		    $('.g').hide();
            $('#chkDPI').attr('id','chkDPIC');
		    $('#chkTodos').attr('id','chkTodosC');
			$('#contenidoTablaPPG').text("");
	        $('#contenidoTablaDPI').text("");
	        $('#contenidoTablaGen').text("");
	        $('#contenidoTablaTodos').text("");
			
	}
	
});





/*salir de ventada detallado disponible para impresion*/
$('#btnSalirExportarReportesDisponiblesParaImpresion').click(function()

{
	$('#vddpi').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
		
		
	
})

/*salir de ventada detallado disponible para impresion*/

/*salir de ventana detallado reportes solicitud generada*/

$('#btnSalirExportarReporteDetalladoSolicitud').click(function()
{
	$('#vdsg').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
})



/*envio por ajax para cambiar rutas de xml*/

$('#frmAgregarRutaDeXML').on('submit',function()
{
	var bandera=0;
	var bd=$('#cmbSociedad').val();
	if($('#btnAgregarRutaXml').attr('value')=="Agregar")
	{
		bandera=2;
	}else
	{
		bandera=3;
		
	}
	$.ajax({
		 type:"POST",
		 dataType:"json",
		 url:$(this).attr('action'),
		 data:$(this).serialize()+"&bandera="+bandera+"&bd="+bd,
		 beforeSend: function(response)
		 {
			 $('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
		 },
		 success: function(response)
		 {
			 $('#loader').bPopup().close();
			 if(response.respuesta=="si")
			 {
				
			    $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				$('.mensajeSatisfactorio').fadeOut(15000);
				$('#tRutasDeArchivosXml>tbody').html(response.ct);//cargamso los datos de la tabla
				$('#tRutasDeArchivosXml>tbody').find('#'+response.celda+'').removeClass('pintar-td-titulos-gris-bajo');
				$('#tRutasDeArchivosXml>tbody').find('#'+response.celda+'').addClass('pintarCeldaVerde');
				$('.pintarCeldaVerde').fadeOut(15000,function()
				{
					$('#tRutasDeArchivosXml>tbody').html(response.ct);//cargamso los datos de la tabla
					$('#tRutasDeArchivosXml>tbody').find('#'+$('#cmbSociedad').val()+'').removeClass('pintar-td-titulos-gris-bajo');
					$('#tRutasDeArchivosXml>tbody').find('#'+$('#cmbSociedad').val()+'').addClass('pintarCeldaSeleccionada');
				    $('#btnAgregarRutaXml').attr('title','Modificar ruta de la sociedad '+$('#cmbSociedad option:selected').text()+'');
					
				});
				
				$('#btnAgregarRutaXml').attr('value','Modificar');
				
			 }else
			 {
				 if(response.fo=="cmd")
				 {
					 $('#cmbSociedad').addClass("formulario-inputs-selects-alert");
				 }else if(response.fo=="xml")
				 {
					$('#txtRuta').focus();
					$('#txtRuta').addClass("formulario-inputs-alert");
				 }
				  $(document).on('input keyup','#frmAgregarRutaDeXML input',function()
				  {
					  $('#frmAgregarRutaDeXML select').removeClass("formulario-inputs-selects-alert");
					  $('#frmAgregarRutaDeXML input').removeClass("formulario-inputs-alert");
					  $('.me').text("");
				  });
				  $(document).on('change','#frmAgregarRutaDeXML select',function()
				  {
					  $('#frmAgregarRutaDeXML select').removeClass("formulario-inputs-selects-alert");
					  $('#frmAgregarRutaDeXML input').removeClass("formulario-inputs-alert");
					  $('.me').text("");
				  });
				  
				 $('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			 }
		 },
	     error: function(response)
		 {
			 
			$('#loader').bPopup().close();
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		 }
	 });
	
	return false;
});






/*llamada ajax a sociedad*/

$('#cmbSociedad').change(function()
{
	var bd=$(this).val();
	
	$('#txtRuta').focus();
	
	$('#tRutasDeArchivosXml>tbody').find('#'+bd+'').removeClass('pintar-td-titulos-gris-bajo');
	$('#tRutasDeArchivosXml>tbody').find('tr').removeClass('pintarCeldaSeleccionada');
	$('#tRutasDeArchivosXml>tbody').find('tr').removeClass('pintarCeldaVerde');
	$('#tRutasDeArchivosXml>tbody').find('#'+bd+'').addClass('pintarCeldaSeleccionada');
	$('#tRutasDeArchivosXml>tbody>tr').each(function() {
		if(($(this).attr('class')==''))
		{
			$(this).attr('class','pintar-td-titulos-gris-bajo');
		}
        
    });
	
    
	$.ajax({
		 type:"POST",
		 dataType:"json",
		 url:"../Php_Scripts/s_consultarRutasDeSociedades.php",
		 data:"bandera="+1+"&bd="+bd,		 
		 success: function(response)
		 {
			 
			 if(response.respuesta=="si")
			 {
				 if(response.ruta!=null){
				$('#txtRuta').attr('value',response.ruta);
				$('#btnAgregarRutaXml').attr('value','Modificar');
				$('#btnAgregarRutaXml').attr('title','Modificar ruta de la sociedad '+$('#cmbSociedad option:selected').text()+'');
				 }else
				 {
				$('#btnAgregarRutaXml').attr('value','Agregar');
				$('#btnAgregarRutaXml').attr('title','Agregar ruta de la sociedad'+$('#cmbSociedad option:selected').text()+'');
				$('#txtRuta').attr('value',"");
				 }
				
			 }
		 },
	     error: function(response)
		 {
			
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		 }
	 });
})

/*llamada ajax a sociedad*/



/*cerrar ventana recuperar contraseña coorp*/
$('#cerrarVentanaRecuperarCoorp').click(function()
{
	$('#colvideMiContrasenaCoorp').bPopup({
            speed: 650,
            transition: 'slideDown'
        }).close();
	
});

/*cerrar ventana login coorp*/

$('#cerrarVentanaLoginCoorp').click(function()
{
	$('#loginCoorporativos').bPopup({
		    
            speed: 650,
            transition: 'slideDown'
        }).close();
	
})



/*envio de datos por ajax para recuperar contraseña de coorporativo*/

$('#frmRecuperarPassCoorporativo').on('submit',function()
{
	
	
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:$(this).attr('action'),
		data:$(this).serialize(),
		success: function(response)
		{
			if(response.respuesta=="si")
			{
				$('#frmRecuperarPassCoorporativo').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
				$('.meee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				$('.mensajeSatisfactorio').fadeOut(15000);
				
			}else
			{
				 if(response.fo=='email')
						{
							
							$('#txtEmailCorp').focus();
							$('#txtEmailCorp').addClass("formulario-inputs-alert");
							
							$(document).on('input','#frmRecuperarPassCoorporativo input',function()
							{
								$('#txtEmailCorp').removeClass("formulario-inputs-alert");
								$('.meee').text("");
							})
							
							
						}
						
					
				$('.meee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
			}
		},error: function(response)
		{
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		
	})
	
	return false;
})


/*abrir ventana para recuperar usuario y contraseña Coorp*/

$("#olvideMiContrasenaCoorp").click(function()
{
	$('.meee').text("");
	$('#txtEmailCorp').removeClass("formulario-inputs-alert");
	$('#frmRecuperarPassCoorporativo').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
	$('#colvideMiContrasenaCoorp').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
	
})



/*limpiar mensaje de acordion meses*/
$('.cMeses').click(function()
{
	$('input').removeClass("formulario-inputs-alert");
	$('.me').text("");
})
/*limpiar mensaje de acordion meses*/

/*modificar fecha calendario*/
$(document).on( 'click','.modificarFechaDeCalendario', function() {
	$('input').removeClass("formulario-inputs-alert");
	
	$('.me').text("");
	/*variables que se igualan a los valores contenidos en los inputs*/
	var idRegistroFecha = $(this).closest('tbody tr').attr('id');
	var fechaIni=$('#txtFechaInicial'+idRegistroFecha).val();
	var fechaFin=$('#txtFechaFinal'+idRegistroFecha).val();
	var fechaE=$('#txtFechaRecepcion'+idRegistroFecha).val();
	var tr=$(this).closest('tbody tr');
	
	
	/*variables que se igualan a los valores contenidos en los inputs*/
	
	
 
	 $.ajax({
		 type:"POST",
		dataType:"json",
		 url:"../Php_Scripts/s_calendarioParaRecepciones.php",
		 data:"bandera="+2+"&txtFechaInicial="+fechaIni+"&txtFechaFinal="+fechaFin+"&txtFechaRecepcion="+fechaE+"&IdRegistroFecha="+idRegistroFecha,
		 success: function(response)
		 {
			 
			
			 if(response.respuesta=="si")
			 {
				  tr.fadeOut(1500,function ()//elimina la fila a la cual se le da clic
	             {
	             	$(this).remove();
	              });
	
				 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				 $('.mensajeSatisfactorio').fadeOut(15000);
				 if(response.index=='01')
				 {
					 $('#accordionCalendario').accordion({active:0});
					 $('#agregarModificarAgregarEnero>tbody').html(response.enero);
				
				 }
				 else  if(response.index=='02')
				 {
					 $('#accordionCalendario').accordion({active:1});
					 $('#agregarModificarAgregarFebrero>tbody').html(response.febrero);
				
				 }else  if(response.index=='03')
				 {
					 $('#accordionCalendario').accordion({active:2});
					 $('#agregarModificarAgregarMarzo>tbody').html(response.marzo);
				
				 }else  if(response.index=='04')
				 {
					 $('#accordionCalendario').accordion({active:3});
					 $('#agregarModificarAgregarAbril>tbody').html(response.abril);
				
				 }else  if(response.index=='05')
				 {
					 $('#accordionCalendario').accordion({active:4});
					 $('#agregarModificarAgregarMayo>tbody').html(response.mayo);
				
				 }else  if(response.index=='06')
				 {
					 $('#accordionCalendario').accordion({active:5});
					 $('#agregarModificarAgregarJunio>tbody').html(response.junio);
				
				 }
				 else  if(response.index=='07')
				 {
					 $('#accordionCalendario').accordion({active:6});
					 $('#agregarModificarAgregarJulio>tbody').html(response.julio);
				
				 }else  if(response.index=='08')
				 {
					 $('#accordionCalendario').accordion({active:7});
					 $('#agregarModificarAgregarAgosto>tbody').html(response.agosto);
					
				
				 }else  if(response.index=='09')
				 {
					 $('#accordionCalendario').accordion({active:8});
					 $('#agregarModificarAgregarSeptiembre>tbody').html(response.septiembre);
				
				 }else  if(response.index=='10')
				 {
					 $('#accordionCalendario').accordion({active:9});
					 $('#agregarModificarAgregarOctubre>tbody').html(response.octubre);
				
				 }else  if(response.index=='11')
				 {
					 $('#accordionCalendario').accordion({active:10});
					 $('#agregarModificarAgregarNoviembre>tbody').html(response.noviembre);
				
				 }else  if(response.index=='12')
				 {
					 $('#accordionCalendario').accordion({active:11});
					 $('#agregarModificarAgregarDiciembre>tbody').html(response.diciembre);
				 }
				 
				 dtpDeTablasMeses();//cargar dtp en la tabla meses
				 
		
				
			 }else
			 {
				 
				 if(response.fo=="fic")
						{
							$('#txtFechaInicial'+idRegistroFecha).focus();
							$('#txtFechaInicial'+idRegistroFecha).addClass("formulario-inputs-alert");
							
						}else if(response.fo=="ffc")
						{
							$('#txtFechaFinal'+idRegistroFecha).focus();
							$('#txtFechaFinal'+idRegistroFecha).addClass("formulario-inputs-alert");
							
						}else if(response.fo=="ffe")
						{
							$('#txtFechaRecepcion'+idRegistroFecha).focus();
							$('#txtFechaRecepcion'+idRegistroFecha).addClass("formulario-inputs-alert");
							
						}else if(response.fo=="i")
						{
							$('input').removeClass("formulario-inputs-alert");;
						
							
							$('#txtFechaRecepcion'+idRegistroFecha).addClass("formulario-inputs-alert");
							$('#txtFechaFinal'+idRegistroFecha).addClass("formulario-inputs-alert");
							$('#txtFechaInicial'+idRegistroFecha).addClass("formulario-inputs-alert");
							
							
							
						}
						
						/*Quitar mensajes*/
						
				$('#txtFechaRecepcion'+idRegistroFecha).change(function()
							{
							   $('input').removeClass("formulario-inputs-alert");
	                         
	                            $('.me').text("");
							
								
								
							})
							
							$('#txtFechaFinal'+idRegistroFecha).change(function()
							{
								$('input').removeClass("formulario-inputs-alert");
	                         
	                            $('.me').text("");
								
								
								
								
							})
							
							
							$('#txtFechaInicial'+idRegistroFecha).change(function()
							{
								$('input').removeClass("formulario-inputs-alert");
	                         
	                            $('.me').text("");
								
								
								
								
							})
							/*Quitar mensajes*/
				
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				$('#loader').bPopup().close();
				  
			 }
		 },
		 
		 error: function(response)
		 {
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		 }
	 });
	
	 
    
	
});
/*modificar fecha calendario*/




/*actaulizar lista de calendario peticion ajax*/
$('#cmdSeleccionAno').change(function()
{
	
	$('.year').html($('#cmdSeleccionAno option:selected').val());
	 
	  $.ajax({
		 type:"POST",
		 dataType:"json",
		 url:"../Php_Scripts/s_calendarioParaRecepciones.php",
		 data:"bandera="+3+"&yearM="+$('#cmdSeleccionAno option:selected').val(),
		 beforeSend: function(response)
		 {
			 $('#loader').bPopup();			 
		 },
		 success: function(response)
		 {
			 
			 if(response.respuesta=="si")
			 {


//////////////////////////////////////////////////
$('#agregarModificarAgregarEnero>tbody').html(response.enero);
$('#agregarModificarAgregarFebrero>tbody').html(response.febrero);
$('#agregarModificarAgregarMarzo>tbody').html(response.marzo);
$('#agregarModificarAgregarAbril>tbody').html(response.abril);
$('#agregarModificarAgregarMayo>tbody').html(response.mayo);
$('#agregarModificarAgregarJunio>tbody').html(response.junio);
$('#agregarModificarAgregarJulio>tbody').html(response.julio);
$('#agregarModificarAgregarAgosto>tbody').html(response.agosto);
$('#agregarModificarAgregarSeptiembre>tbody').html(response.septiembre);
$('#agregarModificarAgregarOctubre>tbody').html(response.octubre);
$('#agregarModificarAgregarNoviembre>tbody').html(response.noviembre);
$('#agregarModificarAgregarDiciembre>tbody').html(response.diciembre);
//////////////////////////////////////////////////
dtpDeTablasMeses();//cargar dtp en la tabla meses
			 $('#loader').bPopup().close();
			 $('input').removeClass("formulario-inputs-alert");
			 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			 }else
			 {
				 
				  $('#loader').bPopup().close();
				  alert("ha ocurrido un error al ejecutar la consulta.");
			 }
			 
		 },
		 
		 error: function(response)
		 {
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 $('#loader').bPopup().close();
		 }
	 });
})


/*funcion llamar dtp en tablas de los meses*/

function dtpDeTablasMeses()
{
	/*cargar dtp*/
				$(".fii,.fff,.frr" ).datepicker({
			dateFormat:"yy-mm-dd",
			showOn: "button",
			buttonImage: "./Imagenes/calendario.png",
			buttonImageOnly: true,
			showAnim: "drop",
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
dayNames:['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
nextText: "Adelante",
prevText: "Atras"

			
		
			
			
		});
		/*cargar dtp*/
	
}


/*agregar fecha Calendario*/

/*Limpiar datos*/


$('#cleanerLimpiarDatos').click(function()
{
	$('#frmInsertarFechaCalendario').each(function() {
		this.reset();
        
    });
	$('#txtFechaRecepcion').removeClass("formulario-inputs-alert");
	$('#txtFechaFinal').removeClass("formulario-inputs-alert");
    $('#txtFechaInicial').removeClass("formulario-inputs-alert");
	$('.me').text("");
})
/*Limpiar datos*/


/*insertar Fecha peticion ajax*/
$('#frmInsertarFechaCalendario').on('submit',function()
{
	$('input').removeClass("formulario-inputs-alert");

	$('.me').text("");
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:$(this).attr('action'),
		data:$(this).serialize(),
		beforeSend: function(response)
		{
			$('#loader').bPopup();
			
		},success: function(response)
		{
			if(response.respuesta=="si")
			
			{
				
				
				
				
               $("#cmdSeleccionAno option[value="+response.anoParaFiltrar+"]").attr("selected",true);//cambiar valor del select 
			   $('.year').html(response.anoParaFiltrar);
				
				
				 
				
				 if(response.index=='01')
				 {
					 $('#accordionCalendario').accordion({active:0});
					 $('#agregarModificarAgregarEnero>tbody').html(response.enero);
				
				 }
				 else  if(response.index=='02')
				 {
					 $('#accordionCalendario').accordion({active:1});
					 $('#agregarModificarAgregarFebrero>tbody').html(response.febrero);
				
				 }else  if(response.index=='03')
				 {
					 $('#accordionCalendario').accordion({active:2});
					 $('#agregarModificarAgregarMarzo>tbody').html(response.marzo);
				
				 }else  if(response.index=='04')
				 {
					 $('#accordionCalendario').accordion({active:3});
					 $('#agregarModificarAgregarAbril>tbody').html(response.abril);
				
				 }else  if(response.index=='05')
				 {
					 $('#accordionCalendario').accordion({active:4});
					 $('#agregarModificarAgregarMayo>tbody').html(response.mayo);
				
				 }else  if(response.index=='06')
				 {
					 $('#accordionCalendario').accordion({active:5});
					 $('#agregarModificarAgregarJunio>tbody').html(response.junio);
				
				 }
				 else  if(response.index=='07')
				 {
					 $('#accordionCalendario').accordion({active:6});
					 $('#agregarModificarAgregarJulio>tbody').html(response.julio);
				
				 }else  if(response.index=='08')
				 {
					 $('#accordionCalendario').accordion({active:7});
					 $('#agregarModificarAgregarAgosto>tbody').html(response.agosto);
				
				 }else  if(response.index=='09')
				 {
					 $('#accordionCalendario').accordion({active:8});
					 $('#agregarModificarAgregarSeptiembre>tbody').html(response.septiembre);
				
				 }else  if(response.index=='10')
				 {
					 $('#accordionCalendario').accordion({active:9});
					 $('#agregarModificarAgregarOctubre>tbody').html(response.octubre);
				
				 }else  if(response.index=='11')
				 {
					 $('#accordionCalendario').accordion({active:10});
					 $('#agregarModificarAgregarNoviembre>tbody').html(response.noviembre);
				
				 }else  if(response.index=='12')
				 {
					 $('#accordionCalendario').accordion({active:11});
					 $('#agregarModificarAgregarDiciembre>tbody').html(response.diciembre);
				 }
				
				$('#loader').bPopup().close();
				$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				$('.mensajeSatisfactorio').fadeOut(15000);
				$('#frmInsertarFechaCalendario').each(function() {
		this.reset();
		$('#txtFechaRecepcion').removeClass("formulario-inputs-alert");
	    $('#txtFechaFinal').removeClass("formulario-inputs-alert");
		$('#txtFechaInicial').removeClass("formulario-inputs-alert");
        
    });
	
	/*cargar dtp*/
		dtpDeTablasMeses();//cargar dtp en la tabla meses
		/*cargar dtp*/
				
			}else
			{
				
				
				if(response.fo=="fic")
						{
							$('#txtFechaInicial').focus();
							$('#txtFechaInicial').addClass("formulario-inputs-alert");
							
						}else if(response.fo=="ffc")
						{
							$('#txtFechaFinal').focus();
							$('#txtFechaFinal').addClass("formulario-inputs-alert");
							
						}else if(response.fo=="ffe")
						{
							$('#txtFechaRecepcion').focus();
							$('#txtFechaRecepcion').addClass("formulario-inputs-alert");
							
						}else if(response.fo=="i")
						{
							$('#txtFechaRecepcion').removeClass("formulario-inputs-alert");
							$('#txtFechaFinal').removeClass("formulario-inputs-alert");
							$('#txtFechaInicial').removeClass("formulario-inputs-alert");
						
							
							$('#txtFechaRecepcion').addClass("formulario-inputs-alert");
							$('#txtFechaFinal').addClass("formulario-inputs-alert");
							$('#txtFechaInicial').addClass("formulario-inputs-alert");
							
							
							
						}
						
						/*Quitar mensajes*/
						
				$('#txtFechaRecepcion').change(function()
							{
							$('#txtFechaRecepcion').removeClass("formulario-inputs-alert");
							$('#txtFechaFinal').removeClass("formulario-inputs-alert");
							$('#txtFechaInicial').removeClass("formulario-inputs-alert");
								$('.me').text("");
								
								
							})
							
							$('#txtFechaFinal').change(function()
							{
								$('#txtFechaRecepcion').removeClass("formulario-inputs-alert");
							$('#txtFechaFinal').removeClass("formulario-inputs-alert");
							$('#txtFechaInicial').removeClass("formulario-inputs-alert");
								$('.me').text("");
								
								
							})
							
							
							$('#txtFechaInicial').change(function()
							{
								$('#txtFechaRecepcion').removeClass("formulario-inputs-alert");
							    $('#txtFechaFinal').removeClass("formulario-inputs-alert");
							    $('#txtFechaInicial').removeClass("formulario-inputs-alert");
								$('.me').text("");
								
								
							})
							/*Quitar mensajes*/
				
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				$('#loader').bPopup().close();
			}
			
		},error: function(response)
		{
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			$('#loader').bPopup().close();
		}
	})
	return false;
})
/*insertar Fecha*/


/*agregar fecha Calendario*/






/*datatime picker de calendario para recepcion*/
$( ".fi,.ff,.fr,.fii,.fff,.frr,.cff" ).datepicker({
			dateFormat:"yy-mm-dd",
			showOn: "button",
			buttonImage: "./Imagenes/calendario.png",
			buttonImageOnly: true,
			showAnim: "drop",
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
dayNames:['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
nextText: "Adelante",
prevText: "Atras"

			
		
			
			
		});

/*datatime picker de calendario para recepcion*/



/*acordion calendario*/

$('#accordionCalendario').accordion({active:13});


/*acordion calendario*/




/*peticion ajax login coorporativo*/
$('#frmLoginCoorporativo').on('submit',function()
{
	
	$.ajax({
		type:"POST",
		url:$(this).attr('action'),
		data:$(this).serialize(),
		dataType:"json",
		beforeSend: function(response)
		{
			$('#loader3').show();
		},success: function(response)
		{
			if(response.respuesta=="si")
			{
				
				$('#loader3').hide();
				$('#frmLoginCoorporativo').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
				$(location).attr('href','../portalCoorporativo.php');
	
										
			}else
			{
				 if(response.fo=="uc")
						{
							$('#txtUsuarioCorp').focus();
							$('#txtUsuarioCorp').addClass("formulario-inputs-alert");
							$(document).on('input','#frmLoginCoorporativo input',function(e)
							{
								
						    $('#frmLoginCoorporativo input').removeClass("formulario-inputs-alert");
							$('.mee').text("");
								
								
							});
						}else if(response.fo=="cc")
						{
							$('#txtContrasenaCorp').focus();
							$('#txtContrasenaCorp').addClass("formulario-inputs-alert");
							$(document).on('input','#frmLoginCoorporativo input',function(e)
							{
								   $('#frmLoginCoorporativo input').removeClass("formulario-inputs-alert");
							       $('.mee').text("");
								
								
							})
						}else
						{
							 $('#frmLoginCoorporativo input').addClass("formulario-inputs-alert");
							
							$(document).on('input','#frmLoginCoorporativo input',function(e)
							{
								    $('#frmLoginCoorporativo input').removeClass("formulario-inputs-alert");
							        $('.mee').text("");
								
								
							})
							
						}
				$('#loader3').hide();
				$('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				
			}
		},error: function(response)
		{
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			$('#loader3').hide();
		}
	})
	return false;
})
/*peticion ajax login coorporativo*/






/*Poner tooltip segun la pestaña que se seleccione*/
$('.headerAccordion').click(function()
{
	
	 
				  
	if($(this).attr('id')!=2 || $(this).attr('id')!=3)
	{
		
			$('#btnVerDetallado').attr('title',"La ventana seleccionada no posee detallado.");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			
			if($(this).attr('id')==1)
			{
				if($('.1').length){
				$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Pendientes Por Recepcionar.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',1);
				
				}else
				{
			
			
				$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
			
				}
				
			}
			
			if($(this).attr('id')==4)
			{
				if($('.1').length){
				$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Todos.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',4);
				}
				else
			{
				$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
			}
			
				
			}
			
			
			
		
	} if($(this).attr('id')==2)
	{
		
		
		
		if($('.2').length)
		{
			$('#btnVerDetallado').attr('title',"Ver Detallado Facturas Recepcionadas.");
			$('#btnVerDetallado').attr('value','2');
			$('#btnVerDetallado').attr('disabled',false);
			$('#btnVerDetallado').css("color","#000");
			
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Recepcionadas.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',2);
			
			
		}else
		{
			$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			
			$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
			
		}
	}
	if($(this).attr('id')==3)
	{
		
		if($('.3').length)
		{
			$('#btnVerDetallado').attr('title',"Ver Detallado Facturas Recepcionadas.");
			$('#btnVerDetallado').attr('value','3');
			$('#btnVerDetallado').attr('disabled',false);
			$('#btnVerDetallado').css("color","#000");
			
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Recepcionadas.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('value',3);
			
		}else
		{
			$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);;
			$('#btnVerDetallado').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
			
		}
	}
});
/*Poner tooltip segun la pestaña que se seleccione*/

/*mostrar detallado de formas de vizualizacion segun la pestaña seleccionada*/
$('#btnVerDetallado').click( function() {
	
	if($(this).attr('value')==2){
	
      $('#vddpi').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
		
		
		
	}
if($(this).attr('value')==3){
	
      $('#vdsg').bPopup({
            speed: 650,
            transition: 'slideDown'
        });


}
})
/*mostrar detallado de formas de vizualizacion segun la pestaña seleccionada*/










/*funciones para pagina mis facturas*/
/* chk fecha de captura */
$("#chkFechaDeCaptura").bind("change",function(){
	$('.me').text("");
if($('#chkFechaDeCaptura').is(':checked')==true)
{
	$('#txtFechaDeCaptura').attr('disabled',false);
	$('#txtFechaHasta').attr('disabled',false);
	$("#txtFechaDeCaptura").datepicker("option", "disabled", false);
    $("#txtFechaHasta").datepicker("option", "disabled", false);
	$("#txtFechaDeCaptura" ).datepicker({dateFormat:"yy/mm/dd"}).datepicker("setDate",new Date());
	$("#txtFechaHasta" ).datepicker({dateFormat:"yy/mm/dd"}).datepicker("setDate",new Date());
}else
{
	$('#txtFechaDeCaptura').attr('disabled',true);
	$('#txtFechaHasta').attr('disabled',true);
	$("#txtFechaDeCaptura").datepicker("option", "disabled", true);
$("#txtFechaHasta").datepicker("option", "disabled", true);
	
	
	$('#txtFechaDeCaptura').val("");
	$('#txtFechaHasta').val("");
}

});
/* chk fecha de captura */
/* chk mis rfc */


$("#chkMisRFC").bind("change",function(){
	$('.me').text("");
if($('#chkMisRFC').is(':checked')==true)
{
	$('#rfcs').attr('hidden',false);
	
}else
{
	$('#rfcs').attr('hidden',true);
	/*$('#rfcs').find(":checked").each(function() {
        $(this).removeAttr("checked");
    });*/
	
	
	
}

});
/* chk mis rfc */

/*chk empresas del grupo*/
$("#mischkEDG").bind("change",function(){
	$('.me').text("");
if($('#mischkEDG').is(':checked')==true)
{
	$('#edg').attr('hidden',false);
	
}else
{
	$('#edg').attr('hidden',true);
	//$('#edg').find(":checked").each(function() {
      //  $(this).removeAttr("checked");
    //});
	
	
}

});
/*chk empresas del grupo*/





/*Ventana login coorporativos*/

$(document).on('click','#login-coorporativos',function()
{
	
		$.ajax(
		{
			type:"POST",//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML	
            url:"../Php_Scripts/s_checarSesion.php",
			success: function(response)
			{    
			
			     if(response.login=="si")
				 {
					 if(response.tipoDeUsuario!='CO')
					 {
						 if(confirm("Se ha detectado una sesión activa en el navegador.\nPara poder ingresar al apartado de proveedores debes de terminar la sesión actual.\n¿Deseas terminar la sesión actual?"))
						 {
							 $.post('../Php_Scripts/s_cerrarSesion.php');
							 
						 }
				  
					 }else
					 {
						$(location).attr('href','../portalCoorporativo.php'); 
					 }
				 }else
				 {
					$('#loginCoorporativos').bPopup({
                            speed: 650,
                          transition: 'slideDown'
                           });
		
		                
		                $(".mee").text("");
		                $('#txtUsuarioCorp').removeClass("formulario-inputs-alert"); 
		                $('#txtContrasenaCorp').removeClass("formulario-inputs-alert");
			            $('#frmLoginCoorporativo').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
					$('#txtUsuarioCorp').focus();
				 }
			  
			},error: function()
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		
		
});
	
	
	
})





/*calendario pagina mis facturas*/

$( "#txtFechaDeCaptura" ).datepicker({
			dateFormat:"yy-mm-dd",
			showOn: "button",
			buttonImage: "./Imagenes/calendario.png",
			buttonImageOnly: true,
			showAnim: "drop",
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
dayNames:['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
nextText: "Adelante",
prevText: "Atras"

			
		
			
			
		});
		
		
		
		
		$( "#txtFechaHasta" ).datepicker({
			dateFormat:"yy-mm-dd",
			showOn: "button",
			buttonImage: "./Imagenes/calendario.png",
			buttonImageOnly: true,
			showAnim: "drop",
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
dayNames:['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
nextText: "Adelante",
prevText: "Atras"

		
			
		});
		
		


//$("#txtFechaDeCaptura").datepicker("option", "disabled", true);
//$("#txtFechaHasta").datepicker("option", "disabled", true);



	

$('#frmBuscarFacturas').on('submit',function()
{
   	
	$.ajax(
	{
		type:"POST",
		dataType:"json",
		url:$(this).attr('action'),
		data:$(this).serialize(),
		beforeSend: function(response)
		{
			$('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
			
		},
		success: function(response)
		{
		
			
			
			if(response.respuesta=="si")
			{        
			       
			    
			
				////////////////////////////Vizualizar pendientes por generar/////////////////////////
				$('#contenidoTablaPPG').html(response.ppg);
				/////////////////////////////////////////////////////////
				
				///////////////////////////Vizualizar Disponibles para impresión//////////////////
				$('#contenidoTablaDPI').html(response.dpi);
					/////////////////////////////////////////////////////////
					
				///////////////////////////Vizualizar Generados//////////////////
			     $('#contenidoTablaGen').html(response.gyp);
				 /////////////////////////////////////////////////////////
				 
				 ///////////////////////////Vizualizar todos//////////////////
				 $('#contenidoTablaTodos').html(response.todos);
				  /////////////////////////////////////////////////////////
				  
		
				
				  
				   /*visualizar detallado de solicitud solicitud generada*/
				  $('#adsg').html(response.verDetalladoSolicitudGenerada);
				  /*visualizar detallado de solicitud solicitud generada*/
				  
				 
					/*acordion ver detallado vista solicitud generada y disponible para impresion*/
                              $('#adsg').accordion();
							  $('#adsg').accordion("refresh");//refrescar cotenido de accordion
                    /*acordion ver detallado vista solicitud generada y disponible para impresion*/
					
					
					/*vizualizar detallado disponible para impresion*/
					$('#adpi').html(response.verDetalladodisponibleParaImpresion);
					/*vizualizar detallado disponible para impresion*/
					
					
					 /*acordion ver detallado vista solicitud generada y disponible para impresion*/
					       $('#adpi').accordion();
						   $('#adpi').accordion("refresh");
	               /*acordion ver detallado vista solicitud generada y disponible para impresion*/
				 
				
				$('#loader').bPopup().close();
				$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				$('.mensajeSatisfactorio').fadeOut(15000);
				var active = $('#accordion').accordion('option', 'active');
				
				
				if(active==0)
			    {
					
					if($('.1').length)
		{
			
			
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Pendiente Por Recepcionar.');
			$('#btnImprimirReportesFacturas').attr('disabled',false);
			$('#btnImprimirReportesFacturas').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('value',1);
			
		}else
		{
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
		}
				}
				
				
				
				
				if(active==1)
			    {
					
					if($('.2').length)
		{
			$('#btnVerDetallado').attr('title',"Ver Detallado Facturas Recepcionadas.");
			$('#btnVerDetallado').attr('value','2');
			$('#btnVerDetallado').attr('disabled',false);
			$('#btnVerDetallado').css("color","#000");
			
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Recepcionadas.');
			$('#btnImprimirReportesFacturas').attr('disabled',false);
			$('#btnImprimirReportesFacturas').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('value',2);
			
		}else
		{
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
			
			$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('value','');
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
		}
				}
				if(active==2)
				{
					if($('.3').length)
					
		{
			$('#btnVerDetallado').attr('title',"Ver Detallado Facturas Autorizadas.");
			$('#btnVerDetallado').attr('value','3');
			$('#btnVerDetallado').attr('disabled',false);
			$('#btnVerDetallado').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Autorizadas.');
			$('#btnImprimirReportesFacturas').attr('disabled',false);
			$('#btnImprimirReportesFacturas').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('value',3);
			
		}else
		{
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
			
			$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('value','');
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
		}
				}
				
				
				if(active==3)
			    {
					
					if($('.4').length)
		{
			
			
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Todos.');
			$('#btnImprimirReportesFacturas').attr('disabled',false);
			$('#btnImprimirReportesFacturas').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('value',4);
			
		}else
		{
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
			
			
		}
				}
				
			}else
			{
				
				
				if(response.fo=="fechaCaptura")
				{
					        $('#txtFechaDeCaptura').focus();
							$('#txtFechaDeCaptura').addClass("formulario-inputs-alert");
							$('#txtFechaDeCaptura').change(function()
							{
								$('#txtFechaDeCaptura').removeClass("formulario-inputs-alert");
								$('.me').text("");
								
							});
					
				}else if(response.fo=="fechaHasta")
				{
					     $('#txtFechaHasta').focus();
						 $('#txtFechaHasta').addClass("formulario-inputs-alert");
						 $('#txtFechaHasta').change(function()
							{
								$('#txtFechaHasta').removeClass("formulario-inputs-alert");
								$('.me').text("");
								
							});
							
				}
				$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				$('.mensajeInformativo').fadeOut(15000);
				$('#loader').bPopup().close();
				
			}
		     	
		},error: function(response)
		{
			$('#loader').bPopup().close();
		alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		    
		}
		
	});
	return false;
});
/*peticion aja seleccion de filtros para  facturas*/






/*boton cancelar busqueda facturas*/
$('#btnCancelarBusqueda').click(function()
{
	
	

	
	$('#frmBuscarFacturas').each(function()
	{
		this.reset();
	})
	$('#chkDPIC').attr('id','chkDPI');
    $('#chkTodosC').attr('id','chkTodos');
	$('#contenidoTablaPPG').text("");
	$('#contenidoTablaDPI').text("");
	$('#contenidoTablaGen').text("");
	$('#contenidoTablaTodos').text("");
	
	
	
	$('#btnVerDetallado').attr('title',"La ventana seleccionada no posee detallado.");
	$('#btnVerDetallado').attr('disabled',true);
	$('#btnVerDetallado').css("color","#CCC");
	$('#txtFechaHasta').removeClass("formulario-inputs-alert");
	$('#txtFechaDeCaptura').removeClass("formulario-inputs-alert");
	$('.mee').text("");
	$('.me').text("");
	$('#rfcs').attr('hidden',false);
	$('#edg').attr('hidden',false);
	$("#txtFechaDeCaptura").datepicker("option", "disabled", false);
    $("#txtFechaHasta").datepicker("option", "disabled", false);
	$("#txtFechaDeCaptura").attr('disabled',false);
	$("#txtFechaHasta").attr('disabled',false);
	
	$("#txtFechaDeCaptura" ).datepicker({dateFormat:"yy/mm/dd"}).datepicker("setDate",new Date());
	$("#txtFechaHasta" ).datepicker({dateFormat:"yy/mm/dd"}).datepicker("setDate",new Date());
	$( "#accordion" ).accordion({active: 0});
	$('#contenidoTablaPPG').show();
	

	if($('#cmbTipoDeContactoBuscarFacturas').val()=='S')
	{
		$('#chkGYPtd').show();
        $('#1').show();
	    $('#2').show();
	    $('#4').show();	
		$('#3').show();
	}else
	{
		
		 
        $('#1').show();
	    $('#2').show();
	    $('#4').show();	
		
	}
	
	$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
	
	
	
	
})
/*boton cancelar busqueda facturas*/

/*acordion*/
$( "#accordion" ).accordion({active: 4});
/*acordion*/




/*chk mostrar y ocultar ventanas*/

$(document).on("change","#chkPPG",function(){
	
var active = $('#accordion').accordion('option', 'active');

if($('#chkPPG').is(':checked')==true)
{
	$('.ppg').show();
	$( "#accordion" ).accordion({ active: 0});
	$('#btnVerDetallado').attr('title',"La ventana seleccionada no posee detallado.");
    $('#btnVerDetallado').attr('disabled',true);
    $('#btnVerDetallado').css("color","#CCC");
	if($('.1').length){
				$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Pendientes Por Recepcionar.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',1);
				
				}else
				{
			
			
				$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
			
			
				}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
}else
{
	
	if(active==0){
	$( "#accordion" ).accordion({ active: 0});
	$('#btnVerDetallado').attr('title',"");
    $('#btnVerDetallado').attr('disabled',true);
    $('#btnVerDetallado').css("color","#CCC");
	
	$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
				
	}
	$('.ppg').hide();
	
	
	
}

}); 







$(document).on("change","#chkDPIC", function()
{

var active = $('#accordion').accordion('option', 'active');
if($('#chkDPIC').is(':checked')==true)
{
	
	$('.di').show();
	$( "#accordion" ).accordion({ active: 1});
	
		if($('.2').length)
		{
			$('#btnVerDetallado').attr('title',"Ver Detallado Facturas Recepcionadas.");
			$('#btnVerDetallado').attr('value','2');
			$('#btnVerDetallado').attr('disabled',false);
			$('#btnVerDetallado').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Recepcionadas.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',2);
			
		}else
		{
			$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
		}
	
	
}else
{
	$('.di').hide();
	if(active==1)
	{
		    $('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
		
	}
	
	
	
}

});


$(document).on("change","#chkDPI",function(){
	
	var active = $('#accordion').accordion('option', 'active');
if($('#chkDPI').is(':checked')==true)
{
	$('.di').show();
	$( "#accordion" ).accordion({ active: 1});
	
					if($('.2').length)
		{
			$('#btnVerDetallado').attr('title',"Ver Detallado Facturas Recepcionadas.");
			$('#btnVerDetallado').attr('value','2');
			$('#btnVerDetallado').attr('disabled',false);
			$('#btnVerDetallado').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Recepcionadas.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',2);
		}else
		{
			$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
		}
	
}else
{
	$('.di').hide();
	
	if(active==1)
	{
		$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
	}
	
	
}

});


$(document).on("change","#chkGYP",function(){
var active = $('#accordion').accordion('option', 'active');	

if($('#chkGYP').is(':checked')==true)
{
	$('.g').show();
	$( "#accordion" ).accordion({ active: 2});
	
	if($('.3').length)
					
		{
			$('#btnVerDetallado').attr('title',"Ver Detallado Facturas Autorizadas.");
			$('#btnVerDetallado').attr('value','3');
			$('#btnVerDetallado').attr('disabled',false);
			$('#btnVerDetallado').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Facturas Autorizadas.');
			$('#btnImprimirReportesFacturas').attr('disabled',false);
			$('#btnImprimirReportesFacturas').css("color","#000");
			$('#btnImprimirReportesFacturas').attr('value',3);
			
			
		}else
		{
			
			$('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
		
		}
	
}else
{
	$('.g').hide();
	if(active==2)
	{
		    $('#btnVerDetallado').attr('title',"");
			$('#btnVerDetallado').attr('disabled',true);
			$('#btnVerDetallado').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('title','');
			$('#btnImprimirReportesFacturas').attr('disabled',true);
			$('#btnImprimirReportesFacturas').css("color","#CCC");
			$('#btnImprimirReportesFacturas').attr('value','');
	}
	
	
}

});

$(document).on("change","#chkTodos",function(){
	var active = $('#accordion').accordion('option', 'active');	

if($('#chkTodos').is(':checked')==true)
{
	$('.t').show();
	$( "#accordion" ).accordion({ active: 3});
    $('#btnVerDetallado').attr('title',"La ventana seleccionada no posee detallado.");
    $('#btnVerDetallado').attr('disabled',true);
    $('#btnVerDetallado').css("color","#CCC");
	
	
				if($('.4').length){
				$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Todos.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',4);
				}
				else
			{
				$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
			}
			
	
}else
{
	$('.t').hide();
	
	if(active==3)
	{
		        $('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
	}
}

});


$(document).on("change","#chkTodosC",function(){
	var active = $('#accordion').accordion('option', 'active');
	var numDeOption=$('#cmbTipoDeContactoBuscarFacturas option').length;
	var tipoUsusario=$('#cmbTipoDeContactoBuscarFacturas').val();
	
	
	
if($('#chkTodosC').is(':checked')==true)
{
	
				if($('.4').length){
				$('#btnImprimirReportesFacturas').attr('title','Imprimir Reporte Todos.');
				$('#btnImprimirReportesFacturas').attr('disabled',false);
				$('#btnImprimirReportesFacturas').css("color","#000");
				$('#btnImprimirReportesFacturas').attr('value',4);
				}
				else
			{
				$('#btnImprimirReportesFacturas').attr('title','');
				$('#btnImprimirReportesFacturas').attr('disabled',true);
				$('#btnImprimirReportesFacturas').css("color","#CCC");
				$('#btnImprimirReportesFacturas').attr('value','');
			}
			
	
	
	
	if(numDeOption==2 && tipoUsusario=='C')
	{
	$('.t').show();
	$("#accordion" ).accordion({ active:3 });
	$('#btnVerDetallado').attr('title',"La ventana seleccionada no posee detallado.");
    $('#btnVerDetallado').attr('disabled',true);
    $('#btnVerDetallado').css("color","#CCC");
	
	}else
	{
    $('.t').show();
	$("#accordion" ).accordion({ active:2 });
	$('#btnVerDetallado').attr('title',"La ventana seleccionada no posee detallado.");
    $('#btnVerDetallado').attr('disabled',true);
    $('#btnVerDetallado').css("color","#CCC");
	}
	
	
}else
{
	$('.t').hide();
	if(active==2 || active==3)
	{
	$('#btnVerDetallado').attr('title',"");
    $('#btnVerDetallado').attr('disabled',true);
    $('#btnVerDetallado').css("color","#CCC");
		
	}
	
	
}

});
/*chk mostrar y ocultar ventanas*/

/*funciones para pagina mis facturas*/




/*menu desplegable*/
$('#navi > li > a,#navi>li>ul>li>a').click(function(){
	
    if ($(this).attr('class') != 'active'){
      $('#nav>li>ul').slideUp();
      $(this).next().slideToggle();
      $('#nav>li>a').removeClass('active');
      $(this).addClass('active');
	  
    }else
	{
		$(this).next().slideToggle();
		$(this).removeClass('active');
	}
  });
  /*menu desplegable*/



/*envio de formulario registro de rfc*/

$('#frmRegistrarRazonSocial').on('submit', function()
{
	
	$.ajax(
	{
		type:"POST",
		url:$(this).attr('action'),
		dataType:"json",
		data:$(this).serialize(),
		success: function(response)
		{
			if(response.respuesta=="si")
			{   
				$('.mee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');	
			    $('.mensajeSatisfactorio').fadeOut(15000);
				 $('#frmRegistrarRazonSocial').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
			}else
			{
			 if(response.fo=="stdp")
						{
							$('#cmbTipoDePersonaFs').addClass("formulario-inputs-selects-alert");
							
						}else if(response.fo=="rfc")
						{
							$('#txtRFC').focus();
							$('#txtRFC').addClass("formulario-inputs-alert");
						}else if(response.fo=="email")
			               {       
				            $('#txtEmailRazonSocial').focus();
							$('#txtEmailRazonSocial').addClass("formulario-inputs-alert");
							
		               	}else  if(response.fo=="razonsocial")
						{
							$('#txtRozonSocial').focus();
							$('#txtRozonSocial').addClass("formulario-inputs-alert");
						}
						$(document).on('input keyup','#frmRegistrarRazonSocial input',function()
							{
								$('#frmRegistrarRazonSocial input').removeClass("formulario-inputs-alert");
								$('#frmRegistrarRazonSocial select').removeClass("formulario-inputs-selects-alert");
								$('.mee').text("");
								
							});
					    
						$(document).on('change','#frmRegistrarRazonSocial select',function()
							{
								$('#frmRegistrarRazonSocial input').removeClass("formulario-inputs-alert");
								$('#frmRegistrarRazonSocial select').removeClass("formulario-inputs-selects-alert");
								$('.mee').text("");
								
							});		
							
				$('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
				
			}
			
		},error: function(response)
		{
			alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		}
		
	})
	return false;
})


/*ventana razonSocial*/

$('.razonSocial').click(function()
{
	$('#vRazonSocial').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
		$('.mee').text("");
		$('#frmRegistrarRazonSocial input').removeClass("formulario-inputs-alert");
		$('#frmRegistrarRazonSocial select').removeClass("formulario-inputs-selects-alert");
		$('#frmRegistrarRazonSocial').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
		
		
})
/*ventana razonSocial*/


/*peticion ajax formulario enviar comentario*/

$('#frmEnviarComentarios').on('submit',function()
{
	
		
		$.ajax(
		{
			type:"POST",
			dataType:"json",
			url:$(this).attr('action'),
			data:$(this).serialize(),
			success: function(response)
			{
				if(response.respuesta=="si")
				{
					
					 $('.mee').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');	
					 $('.mensajeSatisfactorio').fadeOut(15000);
					 
					 $('#frmEnviarComentarios').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
				}else
				{
					     /**focus**/
					    if(response.fo=="nombre")
						{
							$('#txtNombreCompletoC').focus();
							$('#txtNombreCompletoC').addClass("formulario-inputs-alert");
						}else if(response.fo=="email")
						 {
						    $('#txtEmailC').focus();
							$('#txtEmailC').addClass("formulario-inputs-alert");
						}else if(response.fo=="asunto")
						{
							$('#txtAsuntoC').focus();
							$('#txtAsuntoC').addClass("formulario-inputs-alert");
						}else if(response.fo=="comentario")
						{
							$('#txtComentarioC').focus();
							$('#txtComentarioC').addClass("formulario-inputs-alert");	
						}
						$(document).on('input keyup','#frmEnviarComentarios input,#frmEnviarComentarios textarea',function()
							{
								$('#frmEnviarComentarios input,#frmEnviarComentarios textarea').removeClass("formulario-inputs-alert");
								$('.mee').text("");
							})
						$('.mee').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					
				}
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				
			}
			
			
		})
	
	return false;
});



/*peticion ajax cambiar datos de perfil*/
$('#frmCambiarDatosDePerfil').on('submit',function()
{
	
	$.ajax(
		{
			type:"POST",
			url:$(this).attr('action'),
			dataType:"json",
			data:$(this).serialize(),
			beforeSend: function(){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
				
				 $('#loader').bPopup();
			},
			success: function(response)
			{
				if(response.respuesta=="si")
				{
					
					$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
					$('.mensajeSatisfactorio').fadeOut(15000);
					$('#txtEmail').removeClass("formulario-inputs-alert");
					$('#bienvenido').html("Bienvenido(a) " +response.nombre+ " " +response.apellidoP + "|EMAIL: " + response.email);                  $('#loader').bPopup().close();
					
				}else
				{
					$('#loader').bPopup().close();
						$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		   
						
						
						
						/*focus*/
						
						if(response.fo=='elc')
						{
							$('#cmbTipoDeContacto').addClass("formulario-inputs-selects-alert");
							$(document).on('click','#frmCambiarDatosDePerfil select',function()
							{
								$('#frmCambiarDatosDePerfil select').removeClass("formulario-inputs-selects-alert");
								$('#frmCambiarDatosDePerfil input').removeClass("formulario-inputs-alert");
								$('.me').text("");
							})
						}
						
						if(response.fo=='email')
						{
							$('#txtEmail').focus();
							$('#txtEmail').addClass("formulario-inputs-alert");
							$(document).on('input','#frmCambiarDatosDePerfil input',function()
							{
								$('#frmCambiarDatosDePerfil select').removeClass("formulario-inputs-selects-alert");
								$('#frmCambiarDatosDePerfil input').removeClass("formulario-inputs-alert");
								$('.me').text("");
							})
							
						}else if(response.fo=='nombre')
						{
							$('#txtNombre').focus();
							$('#txtNombre').addClass("formulario-inputs-alert");
									$(document).on('input','#frmCambiarDatosDePerfil input',function()
							{
								$('#frmCambiarDatosDePerfil select').removeClass("formulario-inputs-selects-alert");
								$('#frmCambiarDatosDePerfil input').removeClass("formulario-inputs-alert");
								
								$('.me').text("");
							})
							
							
						}else if(response.fo=='apellidoP')
						{
							$('#txtApellidoP').focus();
							$('#txtApellidoP').addClass("formulario-inputs-alert");
									$(document).on('input','#frmCambiarDatosDePerfil input',function()
							{
								$('#frmCambiarDatosDePerfil select').removeClass("formulario-inputs-selects-alert");
								$('#frmCambiarDatosDePerfil input').removeClass("formulario-inputs-alert");
								$('.me').text("");
							})
							
						}else
						{
							
							
								$(document).on('input','#frmCambiarDatosDePerfil input',function()
							{
								$('#frmCambiarDatosDePerfil select').removeClass("formulario-inputs-selects-alert");
								$('#frmCambiarDatosDePerfil  #tRfcRazonSocialRegistro>thead>tr').removeClass("pintar-td-mensaje-informativo");
								$('.me').text("");
							
							});
						}
						/*focus*/
				
					
					$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					
				}
				
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				 $('#loader').bPopup().close();
			}
			
		})
	return false;
});
/*peticion ajax cambiar datos de perfil*/	
	
	
	/*peticion ajax para recuperar datos de cuenta*/
	$('#frmOlvidoDeContrasena').on('submit',function()
	{
		
		$.ajax(
		{
			type:"POST",
			url:$(this).attr('action'),
			dataType:"json",
			data:$(this).serialize(),
			success: function(response)
			{
				if(response.respuesta=="si")
				{
					$('#frmOlvidoDeContrasena').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
					$('.meo').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
					$('.mensajeSatisfactorio').fadeOut(15000);
					
					
				}else
				{
					
					
					
					if(response.fo=='email')
						{
							$('#txtEmailR').focus();
							$('#txtEmailR').addClass("formulario-inputs-alert");
							$(document).on('input','#frmOlvidoDeContrasena input',function()
							{
								$('#txtEmailR').removeClass("formulario-inputs-alert");
								$('.meo').text("");
							})
						}
						$('.meo').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					}
				
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			
		})
		return false;
	})
	
	/*peticion ajax para recuperar datos de cuenta*/
	
	
	
	
	
	/*ventana olvido de contraseña*/
	
	$('#otc').click(function()
	{
		$('.meo').text("");
		$('#txtEmailR').removeClass("formulario-inputs-alert");
	
		$('#olvidoContrasena').bPopup({
            speed: 650,
            transition: 'slideIn'
        });
		
			$('#txtEmailR').focus();
			$('#frmOlvidoDeContrasena').each(function() {
				
				this.reset();
                
            });
	})
	
	
	
	/*FUNCION MENSJAE DE DIALOGO*/
	
		/*dialogo de confirmacion eliminarParticipacion*/
	function dialogoEliminarPPS(){
	
	$("#dialogo-de-confirmacion").html("Esta seguro de eliminar La Participación?");//texto de dialogo de confirmacion
	//CONFIGURAMOS EL FORM TIPO DIALOG
	$('#dialogo-de-confirmacion').dialog({
		resizable:false,
		modal:true,//BLOQUEAMOS OTRA ACCION MIENTRAS EL FORM ESTE ABIERTO
		title:'Eliminar La Fecha De Calendario',//TITULO EN EL FORM
		width:300,//TAMAÑO DEL FORM
		height:'auto',
		show:{
			effect:cea(),
			duration:800
			},
		hide:{
			effect:cea(),
			duration:800
			},
			buttons:
			{
				"Si": function () {
                $(this).dialog('close');
                 eliminarPPS(true);
			
            },
                "No": function () {
                $(this).dialog('close');
                 eliminarPPS(false);
            }
			}
	});
	}
	/*dialogo de confirmacion eliminarParticipacion*/
	
	

/*dialogo de confirmacion de cierre de sesion*/
	function dialogoDeConfirmacionEliminarFechaCalendario(){
	
	$("#dialogo-de-confirmacion").html("¿Está seguro de eliminar la fecha del calendario?");//texto de dialogo de confirmacion
	//CONFIGURAMOS EL FORM TIPO DIALOG
	$('#dialogo-de-confirmacion').dialog({
		resizable:false,
		modal:true,//BLOQUEAMOS OTRA ACCION MIENTRAS EL FORM ESTE ABIERTO
		title:'Eliminar La Fecha De Calendario',//TITULO EN EL FORM
		width:300,//TAMAÑO DEL FORM
		height:'auto',
		show:{
			effect:cea(),
			duration:800
			},
		hide:{
			effect:cea(),
			duration:800
			},
			buttons:
			{
				"Si": function () {
                $(this).dialog('close');
                 eliminarFechaCalendario(true);
			
            },
                "No": function () {
                $(this).dialog('close');
                 eliminarFechaCalendario(false);
            }
			}
	});
	}
	/*dialogo de confirmacion de cierre de sesion*/




	
	/*dialogo de confirmacion de cierre de sesion*/
	function dialogoDeConfirmacionCerrarSesion(){
	
	$("#dialogo-de-confirmacion").html("Esta realmente seguro que deseas cerrar sesi&oacute;n?");//texto de dialogo de confirmacion
	//CONFIGURAMOS EL FORM TIPO DIALOG
	$('#dialogo-de-confirmacion').dialog({
		resizable:false,
		modal:true,//BLOQUEAMOS OTRA ACCION MIENTRAS EL FORM ESTE ABIERTO
		title:'Cerrar Sesión?',//TITULO EN EL FORM
		width:300,//TAMAÑO DEL FORM
		height:'auto',
		show:{
			effect:cea(),
			duration:800
			},
		hide:{
			effect:cea(),
			duration:800
			},
			buttons:
			{
				"Si": function () {
                $(this).dialog('close');
               cerrarSesion(true);
			
            },
                "No": function () {
                $(this).dialog('close');
                cerrarSesion(false);
            }
			}
	});
	/*dialogo de confirmacion de cierre de sesion*/
	}
	//abrimos el dialogo de confirmacion
	$('.cerrarSesion').click(dialogoDeConfirmacionCerrarSesion);
	
	/*eliminar Fecha calendario*/
	$(document).on( 'click','.eliminarFechaCalendario', function() {
		
		idRegistroFecha = $(this).closest('tbody tr').attr('id');
		dialogoDeConfirmacionEliminarFechaCalendario();
	});
	/*eliminar Fecha calendario*/
		
	//abrimos el dialogo de confirmacion
	
	
	//eliminar participacion 
	
	function eliminarPPS(value)
	{
		if(value)
		{
			
	$.ajax({
		type:'post',
		dataType:"json",
		 url:"../Php_Scripts/s_accionesParticipacionPorSegmento.php",
		 data:'bandera='+2+'&idP='+idRegistroParticipacion,
		 beforeSend: function(response)
		 {
			 $('#loader').bPopup({
			   onClose: function() { response.abort(); }
			});
		 },success: function(response)
		 {     
		     $('#loader').bPopup().close();
	     
		
			 if(response.respuesta=="si"){
			
				$('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');
				$('.mensajeSatisfactorio').fadeOut(15000);
	             table.fnDeleteRow( $('#'+idRegistroParticipacion)[0]);//eliminamos la fila o tr del dataTable se refrescan los registros
			
				
				
			 }
			 
		 },
		 error: function(response)
		 {
			 $('#loader').bPopup().close();
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			 
		 }
	});
		}
	}
	

//verificar si le dio clic al boton si para cerrar sesion
function cerrarSesion(value) {
    if (value) {
	 
     $(location).attr('href','../Php_Scripts/s_cerrarSesion.php');
	   	
    }
}
//verificar si le dio clic al boton si para cerrar sesion


function eliminarFechaCalendario(value)
{
	if(value)
	{
	
	$('#'+idRegistroFecha).fadeOut(1500,function()
	{
		$(this).remove();
	});
	
	$.ajax({
		 type:"POST",
		 dataType:"json",
		 url:"../Php_Scripts/s_calendarioParaRecepciones.php",
		 data:"bandera="+1+"&IdRegistroFecha="+idRegistroFecha,
	     error: function(response)
		 {
			 alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
		 }
	 });
	
   
	}
}


	/*invalidaos que el formulario no se envie con la tecla enter*/
	$('form').keydown(function(event)
		{  
		    var idForm =$(this).attr('id');
			
			if(idForm!="frm-login" && idForm!="frmLoginCoorporativo" && event.keyCode==13)
			{
				event.preventDefault();
				
			}
		})
		
	/*invalidaos que el formulario no se envie con la tecla enter*/
	
	
	/**************************************************************************************/
	
	
	$(document).on('keyup input','#txtEmail',function()
	{
		
		$.ajax(
		{
			type:'POST',//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:"../Php_Scripts/s_validarEmail.php",//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:'Email='+$('#txtEmail').val(),//DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
			beforeSend: function(){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
				
				  $('#loader2').show();
			}, success: function(response)
			{
				if(response.respuesta=="si")
				{
					$('#loader2').hide();
			              
						 
						  /*quitamos la clase de alerta de todos los inputs meno el de email*/
						   
		                     $('input[type=text],select').each(function(index, element) {
                                $(this).removeClass("formulario-inputs-alert");
								$(this).removeClass("formulario-inputs-selects-alert");
                            });
							/*quitamos la clase de alerta de todos los inputs meno el de email*/
			
					    $('.me').html('<div class="mensajeInformativo">Ya hay una cuenta registrada con ese e-mail.</div>');
		            
							$('#txtEmail').addClass("formulario-inputs-alert");
							$('#txtEmail').keyup(function()
							{
								$('#txtEmail').removeClass("formulario-inputs-alert");
							})
					
					/*desactivamos botones*/
					$('#btnGuardarContacto').attr('disabled',true);
					$('#btnCambiarDatosDePerfil').attr('disabled',true);
					/*desactivamos botones*/
					
					
					
					
				}else
				{
					
					$('#loader2').hide();
					$('.me').text("");
					$('#btnGuardarContacto').attr('disabled',false);
					$('#btnCambiarDatosDePerfil').attr('disabled',false);
					
				}
				
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				$('#loader2').hide();
			}
			
		});
	})
	
	
	








$(document).on( 'click',' #tRfcRazonSocialRegistro .lklEliminarCompania', function() { //eliminar fila especifica de la tabla


//var rfc = $(this).closest('tbody tr').find('td').eq(0).html();//obtiene el valor de la caelda o que se a hecho click

if (($(this).closest('tbody tr').find('td').eq(0).html()).indexOf('&amp;') !== -1)
{
  var rfc = ($(this).closest('tbody tr').find('td').eq(0).html()).split('&amp;').join('<>');
  
}else
{
	 var rfc = ($(this).closest('tbody tr').find('td').eq(0).html()).split('&lt;&gt;').join('<>');
}


if(baseName=="proveedoresRegistro.php")
{
	$(this).parent().parent().remove();//remueve la fila en la cual se iso click

}
else{





$.ajax(
{
	
	        type:'POST',//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:"../Php_Scripts/s_eliminarCompania.php",//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:'rfc='+rfc,
			success: function(response)
			{
				if(response.respuesta=="si")
				{
					
					
					$('#tRfcRazonSocialRegistro>tbody').html(response.companias);
                    $('.me').html('<div class="mensajeSatisfactorio">Compa&ntilde;ia eliminada.</div>');  
                    $('.mensajeSatisfactorio').fadeOut(15000);
					
					
				}else
				{
					$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');  
                    $('.mensajeInformativo').fadeOut(15000);
				}
				
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			

			
})
}

});




 
 $('#agregarCompaniaV').click(function()//abrir popup quienes somos
{
	$('#vCompaniaAgregar').bPopup({
            speed: 650,
            transition: 'slideIn'
        });
		$('#txtBuscarCompania').focus();
		$('.mee').text("");
		
});
 
 
$('#quienesSomos').click(function()//abrir popup quienes somos
{
	$('#vQuienesSomos').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
});

$('.avisoPrivacidad').click(function()
{
	
	$('#vPrivacidad').bPopup({
            speed: 650,
            transition: 'slideIn'
        });
})

$('#tServicios').click(function()
{
	$('#vTservicios').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
	
})


$('#ubicacion,.pu').click(function()//abrir popup quienes somos
{
	$('#vUbicacion').bPopup({
            speed: 650,
            transition: 'slideIn'
        });
});

$('#mision').click(function()//abrir popup quienes somos
{
	$('#vMision').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
});

$('#vision').click(function()//abrir popup quienes somos
{
	$('#vVision').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
});



$('#cont,#conta,.pc').click(function()//abrir popup quienes somos
{
	$('#vContacto').bPopup({
            speed: 650,
            transition: 'slideDown'
        });
		
		$('.mee').text("");
		$('#txtNombreCompletoC').removeClass("formulario-inputs-alert");
		$('#txtEmailC').removeClass("formulario-inputs-alert");
		$('#txtAsuntoC').removeClass("formulario-inputs-alert");
		$('#txtComentarioC').removeClass("formulario-inputs-alert");
		
		$('#frmEnviarComentarios').each(function() {
			this.reset();
            
        });
});

$('.cerrarVentana').click(function()//cerrar popup
{
        
	//$('#cargaGeneralOrdenTrabajo').bPopup().close();
        /*****/
	$('#vQuienesSomos').bPopup().close();
	$('#vVision').bPopup().close();
	$('#vMision').bPopup().close();
	$('#vUbicacion').bPopup().close();
	$('#vContacto').bPopup().close();
	$('#vPrivacidad').bPopup().close();
	$('#vTservicios').bPopup().close();
	
	$('#olvidoContrasena').bPopup().close();
	$('#vCompaniaAgregar').bPopup().close();
	$('#vRazonSocial').bPopup().close();
	
	$('.meo').text("");
	$('.me').text("");
	$('.mee').text("");
	$('#txtEmailR').removeClass("formulario-inputs-alert");
	$('#cargaFacturas').bPopup().close();
    $('#estatusFacturas').bPopup().close();
	
	
	
	
	
});






$(document).on('click','.addCompany',function(){

    $('.mee').text("");
    var id=$(this).closest('tbody tr').attr('id'); 
    var rfc = ($(this).closest('tbody tr').find('td').eq(0).html()).split("&amp;").join("<>"); 
    var nombre = ($(this).closest('tbody tr').find('td').eq(1).html()).split("&amp;").join("<>"); 
	var bandera=0;
	   $('#tRfcRazonSocialRegistro tbody tr').each(function () {  
	   
            var rowRfcRfcRazonSocialRegistro= ($(this).find('td').eq(0).html()).split("&amp;").join("<>");
		  if(rfc==rowRfcRfcRazonSocialRegistro)
	   {
	        $('.mee').html('<div class="mensajeInformativo">Ya agrego esa compa&ntilde;ia.</div>');
			$('.mensajeInformativo').fadeOut(15000);  
		   
			  exit();
	   }else
	   {
		   bandera=0;
	   }
	

	   }); 

         
		 
		 if(bandera==0)
		 {
			 $('#nohayCompanias').remove();
			 $('.mee').html('<div class="mensajeSatisfactorio">Compañia agregada.</div>');
			 $('.mensajeSatisfactorio').fadeOut(15000);
			 $('#na').remove();
			 $("#tRfcRazonSocialRegistro tbody").append('<tr id="'+id+'" class="pintar-td-titulos-gris-bajo" align="center"><td title="RFC:'+rfc+'" >'+rfc+'</td><td title="Razon Social:'+nombre+'">'+nombre+'</td><td title="Compañía No Autorizada"  ><img src="Imagenes/circle_Red.png" width="16" height="16" alt="NoAutorizado" title="No Autorizado" /></td><td><img src="Imagenes/delete.png" alt="Eliminar" title="Eliminar." class="lklEliminarCompania"/><span class="tooltipAyudaR">Eliminar.</span></td></tr>');
			 $('#frmRegistroContacto select').removeClass("formulario-inputs-selects-alert");
			 $('#frmRegistroContacto input').removeClass("formulario-inputs-alert");
			 $('#frmRegistroContacto  #tRfcRazonSocialRegistro>thead>tr').removeClass("pintar-td-mensaje-informativo");
			 $('.me').text("");
			 
	
	
	if(baseName=="editarPerfil.php"){		 
			 $.ajax(
{
	
	        type:'POST',//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:"../Php_Scripts/s_agregarCompanias.php",//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:'RFC='+rfc+'&CardName='+nombre+'&CardCode='+id,
			success: function(response)
			{
				if(response.tiene=="si")
				{
					$('#cmbTipoDeContacto').attr('disabled',true);
					$('#cmbTipoDeContacto').addClass('pintarOptions');
					$('#cmbTipoDeContacto').attr('title','No se puede modificar el tipo de contacto por que ya hay archivos subidos.');
					
				}
				
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
			
			
})
			
		 }
		 }
	
})







/*buscar compania*/




$('#txtBuscarCompania').keyup(function()
{
 $('.mee').text("");
		$.ajax(
		{
			type:"POST",//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:"../Php_Scripts/s_buscarCompania.php",//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:'datos='+$('#txtBuscarCompania').val()+'&tipoU='+$('#cmbTipoDeContacto option:selected').val(),
			beforeSend: function(response)
			{
				$('#tBuscarCompania tbody ').html('<tr align="center"><td colspan="3"><img src="./Imagenes/loader2.gif" width="16" height="16" alt="loader"></td></tr>');
			},
			success: function(response)
			{    
			    
				//alert(response);
				
				$('#tCompania tbody ').html(response.contenidoTablaCompanias);
				
				
				
			     
				
				
			},error: function()
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		
		
});
//	  }else
//	  {
//		  
//	  }
});


/*login form*/

$(document).on('click','#login-form',function()
{
	
		$.ajax(
		{
			type:"POST",//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML	
            url:"../Php_Scripts/s_checarSesion.php",
			success: function(response)
			{    
			
			     if(response.login=="si")
				 {
					 if(response.tipoDeUsuario=='CO')
					 {
						 if(confirm("Se ha detectado una sesión activa en el navegador.\nPara poder ingresar al apartado de proveedores debes de terminar la sesión actual.\n¿Deseas terminar la sesión actual?"))
						 {
							 $.post('../Php_Scripts/s_cerrarSesion.php');
							 
						 }
				  
					 }else
					 {
						$(location).attr('href','../portalProveedores.php'); 
					 }
				 }else
				 {
					 $('#fLogin').toggle('slow');
	                 $('#frm-login input').removeClass('formulario-inputs-alert');
	                 $('#frm-login').each(function()
	                 {
		
	              	   this.reset();
	                 });
					 $('#txt-NombreUsuario').focus();
				 }
			  
			},error: function()
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
			}
		
		
});
	
	
	
});

$('#cancelar').click(function()//cerrar formulario de login
{
	$('#fLogin').toggle('slow');
});




	
	/*******************************************************************************************************/
	
	
	  
	/*peticion ajax formulario de login*/
	$('#frm-login').on('submit',function()
	{
		var datos=$(this).serialize();
			
		
		$.ajax({
			type:'POST',//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:$(this).attr('action'),//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:datos,//DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
			beforeSend: function(response){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
				
				  $('#loader').bPopup();
				  
				  
			},
			success: function(response){//ACCION QUE SUCEDE DESPUES DE REALIZAR CORRECTAMENTE LA PETCION EL CUAL NOS TRAE UNA RESPUESTA
			$('#loader').bPopup().close();
				if(response.respuesta=="si"){//MANDAMOS EL MENSAJE QUE NOS DEVUELVE EL RESPONSE					
					 

					//alert((response.mensaje));
					$(location).attr('href','../portalProveedores.php');
					$('#frm-login').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
										
					
					
	             
  
										
				}
				else{
					alert(response.mensaje);
					if(response.fo=='nombreDeUsuario')
					{
						$('#txt-NombreUsuario').focus();
						$('#txt-NombreUsuario').addClass("formulario-inputs-alert");
						$(document).on('input','#frm-login input',function(e)
						{
							$('#frm-login input').removeClass('formulario-inputs-alert');
						});
					}
					else if(response.fo=='contrasena')
					{
						$('#txt-Pass').focus();
						$('#txt-Pass').addClass("formulario-inputs-alert");
						$(document).on('input','#frm-login input',function(e)
						{
							$('#frm-login input').removeClass('formulario-inputs-alert');
						});
					}
					else
					{
						$('#frm-login input').addClass("formulario-inputs-alert");
						
						$(document).on('input','#frm-login input',function(e)
						{
							$('#frm-login input').removeClass('formulario-inputs-alert');
							
						});
					}
					 $('#loader').bPopup().close();	
				}
				
				
			},
			error: function(){//SI OCURRE UN ERROR 
			    $('#loader').bPopup().close();
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				
			}
		});
		return false;//RETORNAMOS FALSE PARA QUE NO HAGA UN RELOAD EN LA PAGINA
		/*peticion ajax*/
		
	});
	/*peticion ajax formulario de login*/
	
	/*cambio de ocntrasena*/
	$('#frmCambiarContrasena').on('submit',function()
	{
	
		
		$.ajax(
		{
			type:"POST",
			dataType:"json",
			url:$(this).attr('action'),
			data:$(this).serialize(),
			beforeSend: function(response)
			{
				  $('#loader').bPopup();
			},success: function(response)
			{
				if(response.respuesta=="si")
				{
					 $('#loader').bPopup().close();
					 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');	
					 $('.mensajeSatisfactorio').fadeOut(15000);
					 
					 $('#frmCambiarContrasena').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
				}else
				{
					     /**focus**/
					    if(response.fo=="contrasena1")
						{
							$('#txtNuevaContrasena').focus();
							$('#txtNuevaContrasena').addClass("formulario-inputs-alert");
							$(document).on('input','#frmCambiarContrasena input',function()
							{
								$('#frmCambiarContrasena input').removeClass("formulario-inputs-alert");
								$('.me').text("");
							})
						}else if(response.fo=="contrasena2")
						{
							$('#txtRepetirNuevaContrasena').focus();
							$('#txtRepetirNuevaContrasena').addClass("formulario-inputs-alert");
						    $(document).on('input','#frmCambiarContrasena input',function()
							{
								
								$('#frmCambiarContrasena input').removeClass("formulario-inputs-alert");
								$('.me').text("");
							})
						}
						$('#loader').bPopup().close();
						$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
					
				}
			},error: function(response)
			{
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				$('#loader').bPopup().close();
			}		
		})
		
		return false;
	})
	/*cambio de ocntrasena*/
	
	/*peticion ajax formulario nuevo contacto registro*/
	$('#frmRegistroContacto').on('submit',function()
	{
		
		var numRows=0;
		var datos=$(this).serialize();
		
		/*validacion*/
		 if ($('#tRfcRazonSocialRegistro >tbody >tr').length < 1){
       
		                  numRows=1;
						  
						  
				  }
		/*validacion*/  
		
		$.ajax({
			type:'POST',//TIPO DE PETICION PUEDE SER GET
			dataType:"json",//EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
			url:"../Php_Scripts/s_registrarContacto.php",//DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
			data:'numRows='+numRows+'&'+datos,//DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
			beforeSend: function(){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
				
				  $('#loader').bPopup();
				 
			},
			success: function(response){//ACCION QUE SUCEDE DESPUES DE REALIZAR CORRECTAMENTE LA PETCION EL CUAL NOS TRAE UNA RESPUESTA          
			     
				if(response.respuesta=="si"){//MANDAMOS EL MENSAJE QUE NOS DEVUELVE EL RESPONSE		
							
					 $('#loader').bPopup().close();
					 $('.me').html('<div class="mensajeSatisfactorio">'+response.mensaje+'</div>');	
					 $('.mensajeSatisfactorio').fadeOut(15000);
					  
					$('#tRfcRazonSocialRegistro tbody tr').each(function(){
						                            
						 $.ajax({
							   type:"POST",
			                   dataType:"json",
			                   url:"../Php_Scripts/s_agregarCompanias.php",
			                   data:'IdMax='+response.idMax+'&RFC='+$(this).find("td").eq(0).html()+'&CardName='+$(this).find("td").eq(1).html()+'&CardCode='+$(this).attr("id")
							  });
                
							
	                    });
					/*limpia las cajas de texto del formulario*/
					   $('#frmRegistroContacto').each(function(){
                            this.reset();   //se resetea el formulario
				                        });
						/*limpiar datos de tabla */
						$('#tRfcRazonSocialRegistro tbody tr').each(function(){
							$('#tRfcRazonSocialRegistro tbody tr').fadeOut(15000,function(){
							$(this).remove();
							});
						});
           
				}
				else{
						$('#loader').bPopup().close();
						
						if(response.fo=='elc')
						{
							$('#cmbTipoDeContacto').addClass("formulario-inputs-selects-alert");
						}
						
						if(response.fo=='email')
						{
							$('#txtEmail').focus();
							$('#txtEmail').addClass("formulario-inputs-alert");
							
						}else if(response.fo=='nombre')
						{
							$('#txtNombre').focus();
							$('#txtNombre').addClass("formulario-inputs-alert");
							
						}else if(response.fo=='apellidoP')
						{
							$('#txtApellidoP').focus();
							$('#txtApellidoP').addClass("formulario-inputs-alert");
							
							
						}else if(response.fo=='contra1')
						{
							$('#txtContrasena').focus();
							$('#txtContrasena').addClass("formulario-inputs-alert");		
							
						}else if(response.fo=='contra2')
						{
							$('#txtRContrasena').focus();
							$('#txtRContrasena').addClass("formulario-inputs-alert");
							
						}else if(response.fo=="noC")
						{
							$('#frmRegistroContacto #tRfcRazonSocialRegistro>thead>tr').addClass("pintar-td-mensaje-informativo");
						}
							$(document).on('input','#frmRegistroContacto input',function()
							{
								$('#frmRegistroContacto select').removeClass("formulario-inputs-selects-alert");
								$('#frmRegistroContacto input').removeClass("formulario-inputs-alert");
								$('#frmRegistroContacto  #tRfcRazonSocialRegistro>thead>tr').removeClass("pintar-td-mensaje-informativo");
								$('.me').text("");
							})
							$(document).on('change','#frmRegistroContacto select',function()
							{
								$('#frmRegistroContacto select').removeClass("formulario-inputs-selects-alert");
								$('#frmRegistroContacto input').removeClass("formulario-inputs-alert");
								$('#frmRegistroContacto  #tRfcRazonSocialRegistro>thead>tr').removeClass("pintar-td-mensaje-informativo");
								$('.me').text("");
							})
							
							$('.me').html('<div class="mensajeInformativo">'+response.mensaje+'</div>');
		   
						/*focus*/
				}		
			},
			error: function(){//SI OCURRE UN ERROR 
				alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');
				$('#loader').bPopup().close();
			}
		});
		return false;//RETORNAMOS FALSE PARA QUE NO HAGA UN RELOAD EN LA PAGINA
		/*peticion ajax*/
		
	})
	
	/*peticion ajax formulario nuevo contacto registro*/
$(document).tooltip({
          content: function () {
              return $(this).attr('title');
			  
          }
      });
	  
	  
	        /*acepta de la fecha de hoy en adelante*/
      
});



function combierteDatatableTemp2(id,subTabla){
	
        osubTabla=subTabla;
          tablaPPTO=$("#"+id).DataTable( {
             "drawCallback": function ( settings ) {
                 console.log("entro");
                    var api = this.api();
                    var rows = api.rows({}).nodes();
                    var last=null;
                    
                    api.column(3, {page:'ALL'} ).data().each( function ( group, i ) {
                        nomCuentaMaestra=api.column(4, {page:'ALL'} ).data()[i];
                        if ( last !== group ) {
                            $(rows).eq( i ).before(
                                subTabla.headerAlterna.split("_").join(group).split("**").join(nomCuentaMaestra)
                            );
                           //console.log(enero);
                            last = group;
                        }
                    } );
                    //calculaPPTO(api);
                    
                },
//                "footerCallback": function ( row, data, start, end, display ) {
//                        var api = this.api(), data;
//
//                        // Remove the formatting to get integer data for summation
//                        var intVal = function ( i ) {
//                            return typeof i === 'string' ?
//                                i.replace(/[\$,]/g, '')*1 :
//                                typeof i === 'number' ?
//                                    i : 0;
//                        };
//
//                        // Total over all pages
//                        total = api
//                            .column( 7)
//                            .data()
//                            .reduce( function (a, b) {
//                                return intVal(a) + intVal(b);
//                            } );
//                            console.log(total);
//                        // Total over this page
//                        pageTotal = api
//                            .column( 17, { page: 'current'} )
//                            .data()
//                            .reduce( function (a, b) {
//                                return intVal(a) + intVal(b);
//                            }, 0 );
//                            console.log("pg total->"+pageTotal);
//                        // Update footer
//                        $( api.column( 4 ).footer() ).html(
//                            '$'+pageTotal.toFixed(2) +' ( $'+ total.toFixed(2) +' total)'
//                        );
//                        
//                },
           "paging": false,
            "scrollY": "680px",
            "scrollX": "2000px",
            "lengthMenu": [[100, 250, 500, -1], [100, 250, 500, "All"]],
            "oLanguage": {
                "oAria": {
                    "sSortAscending": " "
                },
                "oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious": "Anterior"
                },
                "sEmptyTable": "No Existen Regstros en la Base de Datos",
                "sInfoEmpty": "No Existen Regstros en la Base de Datos",
                "sZeroRecords": "No Existe en la Base de Datos",
                "sSearch": "Buscar:",
                "sInfo":"Mostrando _START_ al _END_ de un total de _TOTAL_ Registros",
                "sLengthMenu":"Mostrando _MENU_ Registros"
            },
           
        } );
        panelClasificacion="<span class='tituloClasificaciones' >Clasificaciones<a class='nuevasCls' >-Nueva clasificacion</a></span>";
        panelClasificacion+="<div class='contClasificacion' placeholder='Sin Datos' >";
        panelClasificacion+="</div>";
        tablaPPTO.rows().eq( 0 ).each( function (rowIdx) {
                if (Object.keys(osubTabla['escenario'][rowIdx]).length>0){
                    clasificacionesText="";
                    titulo="-1";
                    conceptos=new Array();
                    $.each(osubTabla.escenario[rowIdx],function(index,val){
                        tituloTemp=val['Clasificador'];
                        if(tituloTemp!=titulo){
                            if(titulo!='-1'){
                                clasificacionesText+=creaTablaClasificaciones(titulo,conceptos);
                                conceptos=new Array();
                            }
                            titulo=tituloTemp;
                        }
                        conceptos.push(val);
                    });
                    clasificacionesText+=creaTablaClasificaciones(titulo,conceptos);
                    panelClasificacion2="<span class='tituloClasificaciones' >Clasificaciones<a class='nuevasCls' >-Nueva clasificacion</a></span>";
                    panelClasificacion2+="<div class='contClasificacion' placeholder='Sin Datos'  >";
                    panelClasificacion2+=clasificacionesText;
                    panelClasificacion2+="</div>";
                    tablaPPTO.row( rowIdx ).child(panelClasificacion2);
                 }else{
                    tablaPPTO.row( rowIdx ).child(panelClasificacion);
                }
                //tablaPPTO.row( rowIdx ).child(panelClasificacion);     
        });
}

/*ventana de dialogo para vizualizar presupuesto*/




function cargaPPTO(idEnc){
       var nombrePresupuesto="";
	   if($(document).find('.presupuestoSeleccionado').text()=="")
	   {
		   nombrePresupuesto=$('.nombrePresup').text();
	   }else
	   {
		   nombrePresupuesto=$(document).find('.presupuestoSeleccionado').text();
	   }
	   
        var data={
            accion:"OBTIENEDATOSPPTOPARAEDICION",
            idEnc:idEnc
        }
        $.ajax({
                    url:'../Php_Scripts/s_edicionPPTO.php',
                    type:'post',
                    data:data,
                    dataType:'json',
                    beforeSend: function(response)
                    {
                            $('#loader').bPopup({
                              onClose: function() { response.abort(); }
                           });
                    },success: function(ttr)
                    {  
                         $('#loader').bPopup().close();
                        dataTableChildPPTO=new Array();
                        $("#vtnDialogoVizualizarPresupuesto").dialog("open");
                        $("#vtnDialogoVizualizarPresupuesto").html(ttr.Cuentas);
						
						
						$("#vtnDialogoVizualizarPresupuesto").prepend('<span id="nomTituloPPTO">'+nombrePresupuesto+'</span>');
                        combierteDatatableTemp2("tablePPTO",ttr);
                        $("#tablePPTO_wrapper").css("margin-top","21px");
                         calculaPPTO();
                        tablaPPTO.columns.adjust();
                        
                    },
                    error: function(response)
                    {
                            $('#loader').bPopup().close();
                            alert('Error al enviar  datos!!!\nPosibles errores:\n1-Ha introducido caracteres no validos en los campos de texto (verifique los datos ingresados).\n2-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n3-La sesión ha expirado(actualize la página web o teclee f5).\n4-Ha cancelado la peticion al servidor.');

                    }
        });
    }


function addCommas(str) {
        numR = parseFloat(str);
        positivo = true;
        if (numR < 0) {
            positivo = false;
            str = numR * -1 + "";
        }
        val = str.split(".");
        var amount = new String(val[0]);
        amount = amount.split("").reverse();
        var output = "";
        for (var i = 0; i <= amount.length - 1; i++) {
            output = amount[i] + output;
            if ((i + 1) % 3 == 0 && (amount.length - 1) !== i)
                output = ',' + output;
        }
        decimal = ($.isNumeric(val[1])) ? val[1] : 0;

        if (!positivo) {

            output = "-" + output;
        }
        return output + "." + decimal;
    }


function calculaPPTO(){
    scrolls = $(".dataTables_scrollBody").scrollTop();
    tablaPPTO.draw();
    //console.log("----------Empezamos Sumatoria----------------");
    totalCalculo=0;
    $( tablaPPTO.table().container() ).find(".filaTitulo").each(function(){
		
        enero=0,febrero=0,marzo=0,abril=0,mayo=0,junio=0,julio=0,agosto=0,septiembre=0,octubre=0,noviembre=0,diciembre=0;
       // console.log("Igualar variable Julio -> "+julio);
        $("."+$(this).find(".CuentaMaestra").text()).each(function(){
            //console.log("Julio ya tiene valor -> "+julio);
            Aenero=0,Afebrero=0,Amarzo=0,Aabril=0,Amayo=0,Ajunio=0,Ajulio=0,Aagosto=0,Aseptiembre=0,Aoctubre=0,Anoviembre=0,Adiciembre=0;
           // console.log("Inicializamos Ajulio -> "+Ajulio);
            if(tablaPPTO.row(this).child().find(".filaConcepto").length>0){
                
                tablaPPTO.row(this).child().find(".filaConcepto").each(function(){
                   // console.log("Antes de incrementar Ajulio -> "+Ajulio);
                    
                    eneroIndi=parseFloat($(this).find(".ene").text().split(",").join(""));
                    febreroIndi=parseFloat($(this).find(".feb").text().split(",").join(""));
                    marzoIndi=parseFloat($(this).find(".mar").text().split(",").join(""));
                    abrilIndi=parseFloat($(this).find(".abr").text().split(",").join(""));
                    mayoIndi=parseFloat($(this).find(".may").text().split(",").join(""));
                    junioIndi=parseFloat($(this).find(".jun").text().split(",").join(""));
                    julioIndi=parseFloat($(this).find(".jul").text().split(",").join(""));
                    agostoIndi=parseFloat($(this).find(".ago").text().split(",").join(""));
                    septiembreIndi=parseFloat($(this).find(".sep").text().split(",").join(""));
                    octubreIndi=parseFloat($(this).find(".oct").text().split(",").join(""));
                    noviembreIndi=parseFloat($(this).find(".nov").text().split(",").join(""));
                    diciembreIndi=parseFloat($(this).find(".dic ").text().split(",").join(""));
                    
                    
                    Aenero+=parseFloat($(this).find(".ene").text().split(",").join(""));
                    Afebrero+=parseFloat($(this).find(".feb").text().split(",").join(""));
                    Amarzo+=parseFloat($(this).find(".mar").text().split(",").join(""));
                    Aabril+=parseFloat($(this).find(".abr").text().split(",").join(""));
                    Amayo+=parseFloat($(this).find(".may").text().split(",").join(""));
                    Ajunio+=parseFloat($(this).find(".jun").text().split(",").join(""));
                    Ajulio+=parseFloat($(this).find(".jul").text().split(",").join(""));
                    Aagosto+=parseFloat($(this).find(".ago").text().split(",").join(""));
                    Aseptiembre+=parseFloat($(this).find(".sep").text().split(",").join(""));
                    Aoctubre+=parseFloat($(this).find(".oct").text().split(",").join(""));
                    Anoviembre+=parseFloat($(this).find(".nov").text().split(",").join(""));
                    Adiciembre+=parseFloat($(this).find(".dic ").text().split(",").join(""));
//                    console.log("Despues de incrementar Ajulio -> "+Ajulio);
//                    console.log("Antes de incrementar julio -> "+julio);
                    enero+=eneroIndi;
                    febrero+=febreroIndi;
                    marzo+=marzoIndi;
                    abril+=abrilIndi;
                    mayo+=mayoIndi;
                    junio+=junioIndi;
                    julio+=julioIndi;
                    agosto+=agostoIndi;
                    septiembre+=septiembreIndi;
                    octubre+=octubreIndi;
                    noviembre+=noviembreIndi;
                    diciembre+=diciembreIndi;
                   // console.log("Incrementamos julio julio -> "+julio);
        
                });
                $(this).find(".Enero").text(addCommas(Aenero.toFixed(2)));
                $(this).find(".Febrero").text(addCommas(Afebrero.toFixed(2)));
                $(this).find(".Marzo").text(addCommas(Amarzo.toFixed(2)));
                $(this).find(".Abril").text(addCommas(Aabril.toFixed(2)));
                $(this).find(".Mayo").text(addCommas(Amayo.toFixed(2)));
                $(this).find(".Junio").text(addCommas(Ajunio.toFixed(2)));
                $(this).find(".Julio").text(addCommas(Ajulio.toFixed(2)));
                $(this).find(".Agosto").text(addCommas(Aagosto.toFixed(2)));
                $(this).find(".Septiembre").text(addCommas(Aseptiembre.toFixed(2)));
                $(this).find(".Octubre").text(addCommas(Aoctubre.toFixed(2)));
                $(this).find(".Noviembre").text(addCommas(Anoviembre.toFixed(2)));
                $(this).find(".Diciembre").text(addCommas(Adiciembre.toFixed(2)));
                totalAnio=Aenero+Afebrero+Amarzo+Aabril+Amayo+Ajunio+Ajulio+Aagosto+Aseptiembre+Aoctubre+Anoviembre+Adiciembre;
                $(this).find(".TotalAnual").text(addCommas(totalAnio.toFixed(2)));
                
            }else{
                enero+=parseFloat($(this).find(".Enero").text().split(",").join(""));
                febrero+=parseFloat($(this).find(".Febrero").text().split(",").join(""));
                marzo+=parseFloat($(this).find(".Marzo").text().split(",").join(""));
                abril+=parseFloat($(this).find(".Abril").text().split(",").join(""));
                mayo+=parseFloat($(this).find(".Mayo").text().split(",").join(""));
                junio+=parseFloat($(this).find(".Junio").text().split(",").join(""));
                julio+=parseFloat($(this).find(".Julio").text().split(",").join(""));
                agosto+=parseFloat($(this).find(".Agosto").text().split(",").join(""));
                septiembre+=parseFloat($(this).find(".Septiembre").text().split(",").join(""));
                octubre+=parseFloat($(this).find(".Octubre").text().split(",").join(""));
                noviembre+=parseFloat($(this).find(".Noviembre").text().split(",").join(""));
                diciembre+=parseFloat($(this).find(".Diciembre").text().split(",").join(""));
                /**/
                ienero=parseFloat($(this).find(".Enero").text().split(",").join(""));
                ifebrero=parseFloat($(this).find(".Febrero").text().split(",").join(""));
                imarzo=parseFloat($(this).find(".Marzo").text().split(",").join(""));
                iabril=parseFloat($(this).find(".Abril").text().split(",").join(""));
                imayo=parseFloat($(this).find(".Mayo").text().split(",").join(""));
                ijunio=parseFloat($(this).find(".Junio").text().split(",").join(""));
                ijulio=parseFloat($(this).find(".Julio").text().split(",").join(""));
                iagosto=parseFloat($(this).find(".Agosto").text().split(",").join(""));
                iseptiembre=parseFloat($(this).find(".Septiembre").text().split(",").join(""));
                ioctubre=parseFloat($(this).find(".Octubre").text().split(",").join(""));
                inoviembre=parseFloat($(this).find(".Noviembre").text().split(",").join(""));
                idiciembre=parseFloat($(this).find(".Diciembre").text().split(",").join(""));
                totalAnio=ienero+ifebrero+imarzo+iabril+imayo+ijunio+ijulio+iagosto+iseptiembre+ioctubre+inoviembre+idiciembre;
                $(this).find(".TotalAnual").text(addCommas(totalAnio.toFixed(2)));
            }
            
        });
        $(this).find(".Enero").text(addCommas(enero.toFixed(2)));
        $(this).find(".Febrero").text(addCommas(febrero.toFixed(2)));
        $(this).find(".Marzo").text(addCommas(marzo.toFixed(2)));
        $(this).find(".Abril").text(addCommas(abril.toFixed(2)));
        $(this).find(".Mayo").text(addCommas(mayo.toFixed(2)));
        $(this).find(".Junio").text(addCommas(junio.toFixed(2)));
        $(this).find(".Julio").text(addCommas(julio.toFixed(2)));
        $(this).find(".Agosto").text(addCommas(agosto.toFixed(2)));
        $(this).find(".Septiembre").text(addCommas(septiembre.toFixed(2)));
        $(this).find(".Octubre").text(addCommas(octubre.toFixed(2)));
        $(this).find(".Noviembre").text(addCommas(noviembre.toFixed(2)));
        $(this).find(".Diciembre").text(addCommas(diciembre.toFixed(2)));
        totalCalculo+=parseFloat(enero.toFixed(2))+parseFloat(febrero.toFixed(2))+parseFloat(marzo.toFixed(2))+parseFloat(abril.toFixed(2))+parseFloat(mayo.toFixed(2))+parseFloat(junio.toFixed(2))+parseFloat(julio.toFixed(2))+parseFloat(agosto.toFixed(2))+parseFloat(septiembre.toFixed(2))+parseFloat(octubre.toFixed(2))+parseFloat(noviembre.toFixed(2))+parseFloat(diciembre.toFixed(2));
        totalCalculoFilaTitulo=parseFloat(enero.toFixed(2))+parseFloat(febrero.toFixed(2))+parseFloat(marzo.toFixed(2))+parseFloat(abril.toFixed(2))+parseFloat(mayo.toFixed(2))+parseFloat(junio.toFixed(2))+parseFloat(julio.toFixed(2))+parseFloat(agosto.toFixed(2))+parseFloat(septiembre.toFixed(2))+parseFloat(octubre.toFixed(2))+parseFloat(noviembre.toFixed(2))+parseFloat(diciembre.toFixed(2));
         $(this).find(".TotalAnual").text(addCommas(totalCalculoFilaTitulo.toFixed(2)));
       // console.log("Es Enero "+enero+"<-----------------------------------");
    });
    //$("#totalGeneral").text("0");
    $(".dataTables_scrollBody").scrollTop(scrolls);
    tablaPPTO.columns.adjust();
     $( tablaPPTO.column( 4 ).footer() ).html('Total: $'+addCommas(totalCalculo.toFixed(2)));
    //console.log("----------Finalizamos sumatoria----------------");
}


function creaTablaClasificaciones(titulo,options){
 nuevaClasificacion="<div class='panelClasificacion' >";
            nuevaClasificacion+="<span class='tituloClasificacion editTituloCLasificacion under' >"+(titulo.trim()==''?'Sin titulo':titulo)+"</span><img title='eliminar clasificación' class='eliminaClasificacion' src='Imagenes/delete.png' alt='eliminar'>";
            nuevaClasificacion+="<table>";
                nuevaClasificacion+="<thead>";
                    nuevaClasificacion+="<tr    >";
                        nuevaClasificacion+="<th><img  class='addFilaConcepto' style='width:16px' src='Imagenes/add.png' alt='agregar nueva fila'></th>";
                        nuevaClasificacion+="<th>Concepto</th>";
                        nuevaClasificacion+="<th>Ene</th>";
                        nuevaClasificacion+="<th>Feb</th>";
                        nuevaClasificacion+="<th>Mar</th>";
                        nuevaClasificacion+="<th>Abr</th>";
                        nuevaClasificacion+="<th>May</th>";
                        nuevaClasificacion+="<th>Jun</th>";
                        nuevaClasificacion+="<th>Jul</th>";
                        nuevaClasificacion+="<th>Ago</th>";
                        nuevaClasificacion+="<th>Sep</th>";
                        nuevaClasificacion+="<th>Oct</th>";
                        nuevaClasificacion+="<th>Nov</th>";
                        nuevaClasificacion+="<th>Dic</th>";
                    nuevaClasificacion+="</tr>";
                nuevaClasificacion+="</thead>";
                nuevaClasificacion+="<tbody>";
                
                $(options).each(function(index,val){
                        nuevaClasificacion+="<tr id='subFila_"+val['id']+"' class='filaConcepto' >";
                        nuevaClasificacion+="<td><img class='eliminaFila' src='Imagenes/delete.png' alt='eliminar'></td>";
                        nuevaClasificacion+="<td class='conceptoL editame under'>"+val['Conceptos']+"</td>";
                        nuevaClasificacion+="<td class='ene editame numerico under' >"+val['Enero']+"</td>";
                        nuevaClasificacion+="<td class='feb editame numerico under' >"+val['Febrero']+"</td>";
                        nuevaClasificacion+="<td class='mar editame numerico under' >"+val['Marzo']+"</td>";
                        nuevaClasificacion+="<td class='abr editame numerico under' >"+val['Abril']+"</td>";
                        nuevaClasificacion+="<td class='may editame numerico under' >"+val['Mayo']+"</td>";
                        nuevaClasificacion+="<td class='jun editame numerico under' >"+val['Junio']+"</td>";
                        nuevaClasificacion+="<td class='jul editame numerico under' >"+val['Julio']+"</td>";
                        nuevaClasificacion+="<td class='ago editame numerico under' >"+val['Agosto']+"</td>";
                        nuevaClasificacion+="<td class='sep editame numerico under' >"+val['Septiembre']+"</td>";
                        nuevaClasificacion+="<td class='oct editame numerico under' >"+val['Octubre']+"</td>";
                        nuevaClasificacion+="<td class='nov editame numerico under' >"+val['Noviembre']+"</td>";
                        nuevaClasificacion+="<td class='dic editame numerico under' >"+val['Diciembre']+"</td>";
                        nuevaClasificacion+="</tr>";
        
                });
                   
                nuevaClasificacion+="</tbody>";
            nuevaClasificacion+="</table>";
        nuevaClasificacion+="</div>";    
    return nuevaClasificacion;
}




function alertt(msg){
	
	/*crear efecto aleatorio para ventana modal*/
function cea(){  
var efectos=['blind','bounce','clip','drop','explode','fade','fold','puff','scale','shake','size','slide']; //efectos de ventana
var rea=Math.floor(Math.random()*efectos.length); //random efecto alaeatorio
 
 return efectos[rea];
}
/*crear efecto aleatorio para ventana modal*/
	
	/*dialogo de confirmacion de cierre de sesion*/
	$("#customAlert").html(msg);//texto de dialogo de confirmacion
	//CONFIGURAMOS EL FORM TIPO DIALOG
	$('#customAlert').dialog({
		resizable:false,
		modal:true,//BLOQUEAMOS OTRA ACCION MIENTRAS EL FORM ESTE ABIERTO
		title:'Mensaje Del Sistema',//TITULO EN EL FORM
		width:300,//TAMAÑO DEL FORM
		height:'auto',
		show:{
			effect:cea(),
			duration:800
			},
		hide:{
			effect:cea(),
			duration:800
			},
			buttons:
			{
			"Aceptar": function () {
                            $(this).dialog('close');
                            //callback(true);
			
                        },
                
			}
	});
	/*dialogo de confirmacion de cierre de sesion*/
	}

function combierteDatatableTempReferencia(obj){
       $(obj).dataTable(
		{
			
			"iDisplayLength": 50,
			"bJQueryUI":false,
			"sPaginationType": "full_numbers",
			
			
			 "oLanguage": { 
"oPaginate": {
                    "sLast": "Ultima",
                    "sNext": "Siguiente",
                    "sFirst": "Primera",
                    "sPrevious":"Anterior"
                },
				

"sLengthMenu": 'Mostrar <select>'+ 
'<option value="10">10</option>'+ 
'<option value="20">20</option>'+ 
'<option value="30">30</option>'+ 
'<option value="40">40</option>'+ 
'<option value="50">50</option>'+ 
'<option value="-1">Todos</option>'+ 
'</select> Registros', 
  

"sInfo": "Mostrando del _START_ a _END_ (Total: _TOTAL_ resultados)", 

"sInfoFiltered": " - filtrados de _MAX_ registros.", 

"sInfoEmpty": "No hay resultados de búsqueda.", 

"sZeroRecords": "No hay registros a mostrar.", 

"sProcessing": "Espere, por favor...", 

"sSearch": "Buscar:</span>", 

	} 
			
		});
		
			
		
		
}