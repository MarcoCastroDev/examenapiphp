<?php
$server = '172.19.0.31';
$user = 'react';
$password = 'SAPFrogs09';
$database = 'Siti';

switch($_POST['accion']){
	case 'CARGATIENDASPORPLAZA':
		$plazasTiendas=$_POST['plazasTiendas'];
		$conjuntosChecks='';
		$inclu_bodega_=$_POST['incluir_bodega'];
		
		
		if(!empty($plazasTiendas)){
			$plazasTiendas=str_replace("'",'',join(",",$plazasTiendas));
			$connectionInfo = array("Database" => "BDGrupoS_Buena", "UID" => $user, "PWD" => $password);
			$conn = sqlsrv_connect($server, $connectionInfo);
			if ($conn === false) {
				die(print_r(sqlsrv_errors(), true));
			}
			if($inclu_bodega_==0){$sql="SELECT WhsCode Code, WhsName name, CASE  WHEN U_bys_clasificacion in (2) then 'T_SKORO' else 'T_FROGS' END tipo FROM BDGrupoS_Buena..OWHS WHERE U_U_BYS_MAXIMIZADOR IN(2,4) and Location in(".$plazasTiendas.") order by  WhsName "; } 
			if($inclu_bodega_==1){$sql="SELECT WhsCode Code, WhsName name FROM BDGrupoS_Buena..OWHS WHERE U_U_BYS_MAXIMIZADOR IN(2,4,3,1) and Location in(".$plazasTiendas.") order by  WhsName "; }
			$stmt = sqlsrv_query($conn, $sql);
			if ($stmt === false) {
				die(print_r(sqlsrv_errors(), true));
			}
			$conjuntosChecks="<div style='width:100%;text-align:left' ><label for='tienda_all' ><input type='checkbox' id='tienda_all' />Seleccionar Todo</label></div>";
			while($row= sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
				$conjuntosChecks.="<div style='width:33%;float:left;' class='contOpcionPlaza div50Tienda ".$row['tipo']."' identifi='".$row['Code']."' ><label for='tienda_".$row['Code']."' ><input type='checkbox' id='tienda_".$row['Code']."' />".$row['name']."</label></div>";
			}
		}
		echo json_encode(array('tiendas'=>$conjuntosChecks));
	break;
	case'CONSULTATABLAGRAFICA':
		$dataReturnTabs="";
        $fechaInicial=$_POST['fechaInicial'];
        $fechaFinal=$_POST['fechaFinal'];
        $agrupacion=$_POST['agrupacion'];
        
		
		$auxAgrupacion=join(",",$_POST['auxAgrupacion']);
		//echo $auxAgrupacion;
        $dataReturnTabs.="<div id='graphTab' >";
        /*$dataReturnTabs.="<ul>";
    
        foreach ($tipoClientes as $key => $value) {
            $key=$value;
            $dataReturnTabs.="<li><a href='#tab-$key' >$value</a></li>";
        }
        $dataReturnTabs.="</ul>";*/
		$dataReturn=getDataTablaGrafica($fechaInicial,$fechaFinal,$agrupacion,$auxAgrupacion);
		$dataTabla=$dataReturn['data'];
		$plazasInd=$dataReturn['sql'];
		if(!empty($dataTabla)){
			$Chart=getDataGrafica($fechaInicial,$fechaFinal,$agrupacion,$auxAgrupacion);
			$datasBarChart=$Chart['datasBarChart'];
            $tablasChart=$Chart['contenido'];
			$dataReturnTabs.="<div id='tab-RESULTADO' ><h3 class='tituloTab' style='display:none' >$value</h3>".$tablasChart."</div>";
        }else{
            $dataReturnTabs.="<div id='tab-RESULTADO' ><h3 class='tituloTab' style='display:none' >$value</h3><div style='min-height:200px' ><h3>No se encontro información con estas caracteristicas</h3></div></div>";
        }
		$dataReturnTabs="</div>".$dataReturnTabs;
        echo json_encode(array(
			'dataComparativo'=>$datasBarChart,
			'contenido'=> $dataReturnTabs
		));
        //echo "</div>".$dataReturnTabs;
	
        break;
		case 'GUARDASESSIONDATOSGRAFICAS':
        break;
}
function getDataGrafica($fechaInicial,$fechaFinal,$agrupacion,$auxAgrupacion){
	$server = '172.19.0.31';
	$user = 'react';
	$password = 'SAPFrogs09';
	$connectionInfo = array("Database" => "BDGrupoS_Buena", "UID" => $user, "PWD" => $password);
	$conn = sqlsrv_connect($server, $connectionInfo);
	if ($conn === false) {
		die(print_r(sqlsrv_errors(), true));
	}
	$sql="EXEC BDGrupoS_Buena..BYS_RPT_ENCUESTATIENDAS $agrupacion,'$auxAgrupacion','$fechaInicial','$fechaFinal'";
	$stmt = sqlsrv_query($conn, $sql);
	if ($stmt === false) {
		die(print_r(sqlsrv_errors(), true));
	}
	$graficasIndividuales=array();
	
	while($row= sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
		$datasPieChart[$row['AGRUPADOR']]=array(
			'SI'=>$row['NUEVOS'],
			'NO'=>$row['CANT_FOLIOS']
		);
		$datasBarChart[]=array(
			'AGRUPADOR'=>$row['AGRUPADOR'],
			'SI'=>$row['NUEVOS']
		);
	}
	//echo json_encode( $datasPieChart);
	foreach($datasPieChart as $key => $value){
		//echo json_encode($datasPieChart[$key]);
		$tamanioChart1="504px";
		$graficasIndividuales[]="<div style='display:inline-block ;width:48%;border:1px #C7C7C7 solid;margin-bottom: 15px;margin: 5px;background: #EEEEEE;    border-radius: 3px;    padding-bottom: 5px;' ><h3 class='tituloChart' agrupador='$key' >".str_replace("_"," ",$key)."</h3> <hr> ".obtieneGraficaIndividual($datasPieChart[$key],$key,'graphicType1',$tamanioChart1)."</div>";
		
	}
	$tamanioChart1="1050px";
	$graficasIndividuales[]="<div style='display:inline-block ;width:99%;border:1px #C7C7C7 solid;margin-bottom: 15px;margin: 5px;background: #EEEEEE;    border-radius: 3px;    padding-bottom: 5px;' ><h3 class='tituloChartCOMPARATIVO' agrupador='COMPARATIVO' >COMPARATIVO</h3> <hr> ".obtieneGraficaIndividual($datasBarChart,'COMPARATIVO','graphicType2',$tamanioChart1)."</div>";
	
	return array(
		'datasBarChart'=>$datasBarChart,
		'contenido'=>join("",$graficasIndividuales)
	);
	//return join("",$graficasIndividuales);

}
function getDataTablaGrafica($fechaInicial,$fechaFinal,$agrupacion,$auxAgrupacion){
    
    $sql="EXEC BDGrupoS_Buena..BYS_RPT_ENCUESTATIENDAS $agrupacion,'$auxAgrupacion','$fechaInicial','$fechaFinal'";
	
	$stmt=mssql_query($sql);
    $grupo=array();
    $dataChart=array();
    while($row=mssql_fetch_assoc($stmt)){
        
        $grupo=$row['AGRUPADOR'];
        $dataChart[$row['AGRUPADOR']]=$row;
       
    }
    
    //$arrFormateado=formateoArregloTablaPrincipal($dataChart,$tiposArticulos);
	//echo json_encode($grupo);
	//echo json_encode($dataChart);
    return array(
        'data'=>$dataChart,
        'sql'=>$sql
    );
}
function obtieneGraficaIndividual($row,$grupo,$tipoGrafica,$tamanio){
	$tablasChart="";
	$tablasChart.="<div style='width:$tamanio;float:left;background:white;margin: 5px;' class=' $tipoGrafica contenedorTGrafica contDiv".str_replace(" ","_",$grupo)."' >";
	//while($row=mssql_fetch_assoc($stmt)){
	//echo json_encode($row);
	$total_=0;	
			if($tipoGrafica!='graphicType3'){
				$tablasChart.="<div id='".str_replace(" ","_",$grupo)."_$tipoGrafica' class='aquiVaLaGrafica' style='padding: 7px;'></div>";
			}
			if($tipoGrafica=='graphicType2'){
				$tablasChart.="<table class='tablaChart' id='tablaComparativo' ><thead>";
				$tablasChart.="<tr><th colspan='2'>RESPUESTA</th></tr>";
				$tablasChart.="<tr><td class='GRUPO_'></td><td class='SI_'>SI</td></tr>";
				$tablasChart.="</thead><tbody>";
				foreach($row as $keyCelda=>$valueCelda){
					//echo $valueCelda;
					$tablasChart.="<tr>";
					foreach($valueCelda as $keyCelda2=>$valueCelda2){
						//echo $valueCelda2;
						if(is_numeric($valueCelda)){
							$valueCelda=number_format($valueCelda,0);
						}
						$tablasChart.="<td class='".$keyCelda2."'>".$valueCelda2."</td>";
						$total_=$total_+$valueCelda2;
					}
				}
				$tablasChart.="<tr><td class='TOTAL_'>TOTAL</td><td class='TOTAL'>".number_format($total_,0)."</td></tr>";
				
			}

			if($tipoGrafica=='graphicType1'){
				$tablasChart.="<table class='tablaChart' ><thead>";
				$tablasChart.="<tr><th colspan='3'>RESPUESTA</th></tr>";
				$tablasChart.="<tr><td class='SI_'>SI</td><td class='NO_'>NO</td><td class='TOTAL_'>TOTAL</td></tr>";
				$tablasChart.="</thead><tbody><tr>";
				$tablasChart.="<td class='grupo' style='display:none;'>".$grupo."</td>";
				foreach($row as $keyCelda=>$valueCelda){
					//print_r($keyCelda);
					//print_r($valueCelda);
					//print_r("-");
					$total_=$total_+$valueCelda;
					if(is_numeric($valueCelda)){
						$valueCelda=number_format($valueCelda,0);
					}
					$tablasChart.="<td class='".$keyCelda."'>".$valueCelda."</td>";
					//$total_=$total_+$valueCelda;
				}
				$tablasChart.="<td class='TOTAL'>".number_format($total_,0)."</td>";
				$tablasChart.="</tr>";
			}
			
	$tablasChart.="</tbody></table>";
	$tablasChart.="</div> <!-----End contDiv".str_replace(" ","_",$grupo)."----->";
return $tablasChart;
}

?>