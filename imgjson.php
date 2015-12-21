<?php
if (! isset($_SERVER['HTTP_X_REQUESTED_WITH']) ||
	$_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
	die(json_encode(array('status' => "エラー")));
}
	$dir = "img/" ;
    $imgList=array();
	if( is_dir( $dir ) && $handle = opendir( $dir ) ) {
		while( ($file = readdir($handle)) !== false ) {
			if( filetype( $path = $dir . $file ) == "file" ) {
                if (strpos($file, ".jpg") !== false) {
                    list($imgW,$imgH) = getimagesize($dir.$file);
                    $model=array("filename"=>$file,"width"=>$imgW,"height"=>$imgH);
				    $imgList[]=$model ;
                }
			}
		}

	}
header( 'Content-Type: text/javascript; charset=utf-8' );
echo json_encode($imgList);
?>