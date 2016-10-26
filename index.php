<?php 
    include_once '/charset.php';
    include '/components/tags.php';
    include '/components/topics.php';
?>
<html>
    <head>
        <title>cnVintage</title>
        <link rel="stylesheet" href="style/main.css">
    </head>
    <body bgcolor="#ffffff" >
        <?php include '/components/header.php'; ?>
        <!-- Page body -->
        <br>
        <table width="100%" bgcolor="#ffffff" border="0" cellspacing="0" cellpadding="0"><tbody><tr>
            <td width="20">&nbsp;</td>      <!-- margin left : 20 -->
            <td width="150" valign="top">   <!-- tags list -->
                <?php require_tags(); ?>
            </td>
            <td width="20">&nbsp;</td>      <!-- margin-left|right: 10 -->
            <td valign="top">               <!-- topics list|content -->
                <?php require_all_topic(); ?>
            </td>
            <td width="20">&nbsp;</td>      <!-- margin right : 20 -->
		</tr></tbody></table>
    </body>
</html>
